import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Modal,
  FlatList,
  Alert,
  Linking,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

const { height } = Dimensions.get('window');

interface Hotel {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  location: string;
  distance: number;
  distanceText: string;
  description: string;
  amenities: string[];
  facilities: {
    icon: string;
    name: string;
    available: boolean;
  }[];
  safetyScore: number;
  highlights: string[];
  popularity: number;
  verified: boolean;
}

type SortOption = {
  id: string;
  label: string;
  icon: string;
  sortFn: (a: Hotel, b: Hotel) => number;
};

const sortOptions: SortOption[] = [
  {
    id: 'popularity',
    label: 'Popularity',
    icon: 'trending-up',
    sortFn: (a, b) => b.popularity - a.popularity
  },
  {
    id: 'price_low',
    label: 'Price: Low to High',
    icon: 'cash',
    sortFn: (a, b) => a.price - b.price
  },
  {
    id: 'price_high',
    label: 'Price: High to Low',
    icon: 'cash',
    sortFn: (a, b) => b.price - a.price
  },
  {
    id: 'rating',
    label: 'Rating: High to Low',
    icon: 'star',
    sortFn: (a, b) => b.rating - a.rating
  },
  {
    id: 'distance',
    label: 'Distance: Near to Far',
    icon: 'navigate',
    sortFn: (a, b) => a.distance - b.distance
  },
  {
    id: 'safety',
    label: 'Safety Score',
    icon: 'shield-checkmark',
    sortFn: (a, b) => b.safetyScore - a.safetyScore
  }
];

const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'The Imperial Heritage Resort',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500',
    rating: 4.8,
    reviews: 2847,
    price: 8500,
    originalPrice: 12000,
    location: 'Connaught Place, New Delhi',
    distance: 0.5,
    distanceText: '0.5 km from you',
    description: 'Luxury heritage hotel in the heart of Delhi with world-class amenities.',
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Room Service'],
    facilities: [
      { icon: 'wifi', name: 'Free WiFi', available: true },
      { icon: 'car', name: 'Parking', available: true },
      { icon: 'water', name: 'Swimming Pool', available: true },
      { icon: 'fitness', name: 'Fitness Center', available: true },
      { icon: 'restaurant', name: 'Restaurant', available: true },
      { icon: 'cafe', name: 'Room Service', available: true },
    ],
    safetyScore: 95,
    highlights: ['Tourist Safety Certified', 'CCTV Monitored', '24/7 Security'],
    popularity: 95,
    verified: true
  },
  {
    id: '2',
    name: 'Royal Palace Boutique Hotel',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500',
    rating: 4.6,
    reviews: 1923,
    price: 6200,
    originalPrice: 8500,
    location: 'Karol Bagh, New Delhi',
    distance: 1.2,
    distanceText: '1.2 km from you',
    description: 'Elegant boutique hotel combining traditional Indian hospitality with modern luxury.',
    amenities: ['Free WiFi', 'Restaurant', 'Business Center', 'Concierge', 'Laundry'],
    facilities: [
      { icon: 'wifi', name: 'Free WiFi', available: true },
      { icon: 'car', name: 'Parking', available: true },
      { icon: 'restaurant', name: 'Restaurant', available: true },
      { icon: 'cafe', name: 'Room Service', available: true },
      { icon: 'shield-checkmark', name: 'Security', available: true },
      { icon: 'call', name: 'Concierge', available: true },
    ],
    safetyScore: 88,
    highlights: ['Verified Property', 'Tourist Friendly', 'Safe Neighborhood'],
    popularity: 82,
    verified: true
  },
  {
    id: '3',
    name: 'Modern Comfort Inn',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=500',
    rating: 4.3,
    reviews: 1456,
    price: 4200,
    location: 'Paharganj, New Delhi',
    distance: 2.1,
    distanceText: '2.1 km from you',
    description: 'Contemporary hotel offering excellent value with modern amenities.',
    amenities: ['Free WiFi', 'AC', 'Restaurant', 'Travel Desk', 'Laundry'],
    facilities: [
      { icon: 'wifi', name: 'Free WiFi', available: true },
      { icon: 'car', name: 'Parking', available: true },
      { icon: 'restaurant', name: 'Restaurant', available: true },
      { icon: 'cafe', name: 'Cafe', available: true },
      { icon: 'shield-checkmark', name: 'Security', available: true },
      { icon: 'call', name: 'Travel Desk', available: true },
    ],
    safetyScore: 82,
    highlights: ['Budget Friendly', 'Central Location', 'Metro Connected'],
    popularity: 68,
    verified: false
  },
  {
    id: '4',
    name: 'Grand Plaza Executive',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500',
    rating: 4.7,
    reviews: 2156,
    price: 9800,
    originalPrice: 13500,
    location: 'Rajouri Garden, New Delhi',
    distance: 3.5,
    distanceText: '3.5 km from you',
    description: 'Premium business hotel with state-of-the-art facilities and luxury accommodations.',
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Gym', 'Business Center', 'Fine Dining'],
    facilities: [
      { icon: 'wifi', name: 'Free WiFi', available: true },
      { icon: 'car', name: 'Valet Parking', available: true },
      { icon: 'water', name: 'Swimming Pool', available: true },
      { icon: 'fitness', name: 'Fitness Center', available: true },
      { icon: 'restaurant', name: 'Fine Dining', available: true },
      { icon: 'cafe', name: '24/7 Room Service', available: true },
    ],
    safetyScore: 92,
    highlights: ['Business Class', 'Executive Lounge', 'Concierge Service'],
    popularity: 88,
    verified: true
  },
  {
    id: '5',
    name: 'Budget Traveler Lodge',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500',
    rating: 4.1,
    reviews: 892,
    price: 2800,
    location: 'Janpath, New Delhi',
    distance: 1.8,
    distanceText: '1.8 km from you',
    description: 'Clean, comfortable budget accommodation perfect for backpackers and budget travelers.',
    amenities: ['Free WiFi', 'AC', 'Shared Kitchen', 'Common Area'],
    facilities: [
      { icon: 'wifi', name: 'Free WiFi', available: true },
      { icon: 'car', name: 'Parking', available: false },
      { icon: 'restaurant', name: 'Restaurant', available: false },
      { icon: 'cafe', name: 'Cafe', available: true },
      { icon: 'shield-checkmark', name: 'Security', available: true },
      { icon: 'call', name: 'Reception', available: true },
    ],
    safetyScore: 75,
    highlights: ['Budget Friendly', 'Backpacker Special', 'Central Location'],
    popularity: 45,
    verified: false
  }
];

type ItineraryNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LiveMap'>;

export default function ItineraryScreen() {
  const navigation = useNavigation<ItineraryNavigationProp>();
  const [likedHotels, setLikedHotels] = useState<Set<string>>(new Set());
  const [selectedSort, setSelectedSort] = useState<string>('popularity');
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showHotelDetail, setShowHotelDetail] = useState(false);

  const slideAnim = useRef(new Animated.Value(height)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const theme = {
    colors: {
      background: '#FFFFFF',
      surface: '#F8FAFC',
      surfaceVariant: '#F1F5F9',
      primary: '#3B82F6',
      primaryLight: '#60A5FA',
      secondary: '#10B981',
      text: '#1E293B',
      textSecondary: '#64748B',
      border: '#E2E8F0',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      muted: '#F1F5F9',
    }
  };

  const currentSortOption = sortOptions.find(option => option.id === selectedSort) || sortOptions[0];
  const sortedHotels = [...mockHotels].sort(currentSortOption.sortFn);

  const handleLike = (hotelId: string) => {
    const newLiked = new Set(likedHotels);
    if (newLiked.has(hotelId)) {
      newLiked.delete(hotelId);
    } else {
      newLiked.add(hotelId);
    }
    setLikedHotels(newLiked);

    // Scale animation for like button
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleBooking = (platform: 'mmt' | 'goibibo', hotel: Hotel) => {
    const hotelName = encodeURIComponent(hotel.name);
    const location = encodeURIComponent(hotel.location);
    
    let url = '';
    if (platform === 'mmt') {
      url = `https://www.makemytrip.com/hotels/search?city=${location}&hotel=${hotelName}`;
    } else {
      url = `https://www.goibibo.com/hotels/search/?city=${location}&name=${hotelName}`;
    }

    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open booking website');
    });
  };

  const handleCardPress = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setShowHotelDetail(true);
    
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeHotelDetail = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowHotelDetail(false);
      setSelectedHotel(null);
    });
  };

  const getSafetyColor = (score: number) => {
    if (score >= 90) return theme.colors.success;
    if (score >= 80) return theme.colors.warning;
    return theme.colors.error;
  };

  const getSafetyBgColor = (score: number) => {
    if (score >= 90) return theme.colors.success + '20';
    if (score >= 80) return theme.colors.warning + '20';
    return theme.colors.error + '20';
  };

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.colors.background }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Find Hotels</Text>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>Safe stays nearby</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: theme.colors.background }]}
          onPress={() => setShowSortModal(true)}
        >
          <Ionicons name="filter" size={16} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={[styles.sortInfo, { backgroundColor: theme.colors.muted }]}>
        <View style={styles.sortLeft}>
          <Ionicons name={currentSortOption.icon as any} size={14} color={theme.colors.primary} />
          <Text style={[styles.sortLabel, { color: theme.colors.textSecondary }]}>Sorted by:</Text>
          <Text style={[styles.sortValue, { color: theme.colors.text }]}>{currentSortOption.label}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowSortModal(true)}>
          <Ionicons name="chevron-down" size={14} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHotelCard = ({ item: hotel, index }: { item: Hotel; index: number }) => (
    <Animated.View 
      style={[
        styles.hotelCard,
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <TouchableOpacity onPress={() => handleCardPress(hotel)} activeOpacity={0.9}>
        {/* Hotel Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: hotel.image }} style={styles.hotelImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.4)']}
            style={styles.imageGradient}
          />
          
          {/* Heart Button */}
          <TouchableOpacity 
            style={styles.heartButton}
            onPress={() => handleLike(hotel.id)}
          >
            <BlurView intensity={20} style={styles.heartBlur}>
              <Ionicons 
                name={likedHotels.has(hotel.id) ? "heart" : "heart-outline"} 
                size={16} 
                color={likedHotels.has(hotel.id) ? theme.colors.error : "#FFFFFF"} 
              />
            </BlurView>
          </TouchableOpacity>

          {/* Safety Badge */}
          <View style={[styles.safetyBadge, { 
            backgroundColor: getSafetyBgColor(hotel.safetyScore),
            borderColor: getSafetyColor(hotel.safetyScore) 
          }]}>
            <Ionicons name="shield-checkmark" size={12} color={getSafetyColor(hotel.safetyScore)} />
            <Text style={[styles.safetyText, { color: getSafetyColor(hotel.safetyScore) }]}>
              {hotel.safetyScore}%
            </Text>
          </View>

          {/* Verified Badge */}
          {hotel.verified && (
            <View style={[styles.verifiedBadge, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}

          {/* Discount Badge */}
          {hotel.originalPrice && (
            <View style={[styles.discountBadge, { backgroundColor: theme.colors.success }]}>
              <Text style={styles.discountText}>
                {Math.round(((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100)}% OFF
              </Text>
            </View>
          )}
        </View>

        {/* Hotel Info */}
        <View style={styles.hotelInfo}>
          <View style={styles.hotelHeader}>
            <View style={styles.hotelHeaderLeft}>
              <Text style={[styles.hotelName, { color: theme.colors.text }]}>{hotel.name}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={12} color={theme.colors.textSecondary} />
                <Text style={[styles.locationText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                  {hotel.location}
                </Text>
              </View>
              <View style={styles.locationRow}>
                <Ionicons name="navigate" size={12} color={theme.colors.textSecondary} />
                <Text style={[styles.distanceText, { color: theme.colors.textSecondary }]}>
                  {hotel.distanceText}
                </Text>
              </View>
            </View>
            <View style={styles.ratingContainer}>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={theme.colors.warning} />
                <Text style={[styles.ratingText, { color: theme.colors.text }]}>{hotel.rating}</Text>
              </View>
              <Text style={[styles.reviewsText, { color: theme.colors.textSecondary }]}>
                ({hotel.reviews})
              </Text>
            </View>
          </View>

          <Text style={[styles.description, { color: theme.colors.textSecondary }]} numberOfLines={2}>
            {hotel.description}
          </Text>

          {/* Amenities */}
          <View style={styles.amenitiesContainer}>
            {hotel.amenities.slice(0, 3).map((amenity, idx) => (
              <View key={idx} style={[styles.amenityBadge, { backgroundColor: theme.colors.muted }]}>
                <Text style={[styles.amenityText, { color: theme.colors.textSecondary }]}>{amenity}</Text>
              </View>
            ))}
            {hotel.amenities.length > 3 && (
              <View style={[styles.amenityBadge, { backgroundColor: theme.colors.muted }]}>
                <Text style={[styles.amenityText, { color: theme.colors.textSecondary }]}>
                  +{hotel.amenities.length - 3}
                </Text>
              </View>
            )}
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: theme.colors.text }]}>₹{hotel.price.toLocaleString()}</Text>
            {hotel.originalPrice && (
              <Text style={[styles.originalPrice, { color: theme.colors.textSecondary }]}>
                ₹{hotel.originalPrice.toLocaleString()}
              </Text>
            )}
            <Text style={[styles.perNight, { color: theme.colors.textSecondary }]}>/night</Text>
          </View>

          {/* Booking Buttons */}
          <View style={styles.bookingButtons}>
            <TouchableOpacity 
              style={[styles.bookingButton, styles.mmtButton]}
              onPress={() => handleBooking('mmt', hotel)}
            >
              <LinearGradient
                colors={['#FF6B35', '#F7931E']}
                style={styles.buttonGradient}
              >
                <Ionicons name="open-outline" size={14} color="#FFFFFF" />
                <Text style={styles.buttonText}>MakeMyTrip</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.bookingButton, styles.goibiboButton]}
              onPress={() => handleBooking('goibibo', hotel)}
            >
              <LinearGradient
                colors={['#4285F4', '#7C3AED']}
                style={styles.buttonGradient}
              >
                <Ionicons name="open-outline" size={14} color="#FFFFFF" />
                <Text style={styles.buttonText}>Goibibo</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderSortModal = () => (
    <Modal
      visible={showSortModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSortModal(false)}
    >
      <View style={styles.modalOverlay}>
        <BlurView intensity={20} style={styles.modalBlur}>
          <View style={[styles.sortModal, { backgroundColor: theme.colors.background }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Sort Hotels</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>
              Choose how to sort hotels
            </Text>

            <ScrollView style={styles.sortOptions} showsVerticalScrollIndicator={false}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.sortOption,
                    {
                      backgroundColor: selectedSort === option.id ? theme.colors.primary : theme.colors.surface,
                      borderColor: selectedSort === option.id ? theme.colors.primary : theme.colors.border,
                    }
                  ]}
                  onPress={() => {
                    setSelectedSort(option.id);
                    setShowSortModal(false);
                  }}
                >
                  <View style={styles.sortOptionLeft}>
                    <Ionicons 
                      name={option.icon as any} 
                      size={20} 
                      color={selectedSort === option.id ? "#FFFFFF" : theme.colors.text} 
                    />
                    <Text style={[
                      styles.sortOptionText,
                      { color: selectedSort === option.id ? "#FFFFFF" : theme.colors.text }
                    ]}>
                      {option.label}
                    </Text>
                  </View>
                  {selectedSort === option.id && (
                    <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={[styles.applyButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setShowSortModal(false)}
            >
              <Text style={styles.applyButtonText}>Apply Sorting</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </Modal>
  );

  const renderHotelDetail = () => {
    if (!selectedHotel) return null;

    return (
      <Modal
        visible={showHotelDetail}
        transparent
        animationType="none"
        onRequestClose={closeHotelDetail}
      >
        <View style={styles.detailOverlay}>
          <Animated.View 
            style={[
              styles.detailModal,
              {
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Header Image */}
            <View style={styles.detailImageContainer}>
              <Image source={{ uri: selectedHotel.image }} style={styles.detailImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)']}
                style={styles.detailImageGradient}
              />
              
              {/* Close Button */}
              <TouchableOpacity style={styles.closeButton} onPress={closeHotelDetail}>
                <BlurView intensity={20} style={styles.closeButtonBlur}>
                  <Ionicons name="close" size={20} color="#FFFFFF" />
                </BlurView>
              </TouchableOpacity>

              {/* Hotel Info Overlay */}
              <View style={styles.detailOverlayInfo}>
                <View style={styles.detailHeaderInfo}>
                  <View style={styles.detailHeaderLeft}>
                    <Text style={styles.detailHotelName}>{selectedHotel.name}</Text>
                    <View style={styles.detailLocationRow}>
                      <Ionicons name="location" size={14} color="#FFFFFF" />
                      <Text style={styles.detailLocationText}>{selectedHotel.location}</Text>
                    </View>
                    <View style={styles.detailLocationRow}>
                      <Ionicons name="navigate" size={14} color="#FFFFFF" />
                      <Text style={styles.detailDistanceText}>{selectedHotel.distanceText}</Text>
                    </View>
                  </View>
                  <View style={styles.detailRatingContainer}>
                    <View style={styles.detailRatingRow}>
                      <Ionicons name="star" size={16} color={theme.colors.warning} />
                      <Text style={styles.detailRatingText}>{selectedHotel.rating}</Text>
                    </View>
                    <Text style={styles.detailReviewsText}>({selectedHotel.reviews} reviews)</Text>
                  </View>
                </View>

                {/* Badges */}
                <View style={styles.detailBadges}>
                  <View style={[styles.detailSafetyBadge, { 
                    backgroundColor: getSafetyBgColor(selectedHotel.safetyScore),
                    borderColor: getSafetyColor(selectedHotel.safetyScore) 
                  }]}>
                    <Ionicons name="shield-checkmark" size={12} color={getSafetyColor(selectedHotel.safetyScore)} />
                    <Text style={[styles.detailSafetyText, { color: getSafetyColor(selectedHotel.safetyScore) }]}>
                      {selectedHotel.safetyScore}% Safe
                    </Text>
                  </View>
                  {selectedHotel.verified && (
                    <View style={[styles.detailVerifiedBadge, { backgroundColor: theme.colors.primary }]}>
                      <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                      <Text style={styles.detailVerifiedText}>Verified</Text>
                    </View>
                  )}
                  {selectedHotel.originalPrice && (
                    <View style={[styles.detailDiscountBadge, { backgroundColor: theme.colors.success }]}>
                      <Text style={styles.detailDiscountText}>
                        {Math.round(((selectedHotel.originalPrice - selectedHotel.price) / selectedHotel.originalPrice) * 100)}% OFF
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Scrollable Content */}
            <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
              {/* Price Section */}
              <View style={[styles.priceSection, { backgroundColor: theme.colors.muted }]}>
                <View style={styles.priceSectionContent}>
                  <Text style={[styles.detailPrice, { color: theme.colors.primary }]}>
                    ₹{selectedHotel.price.toLocaleString()}
                  </Text>
                  {selectedHotel.originalPrice && (
                    <Text style={[styles.detailOriginalPrice, { color: theme.colors.textSecondary }]}>
                      ₹{selectedHotel.originalPrice.toLocaleString()}
                    </Text>
                  )}
                </View>
                <Text style={[styles.priceSectionSubtext, { color: theme.colors.textSecondary }]}>
                  per night (incl. taxes & fees)
                </Text>
              </View>

              {/* Description */}
              <View style={styles.detailSection}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIndicator, { backgroundColor: theme.colors.primary }]} />
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About This Hotel</Text>
                </View>
                <Text style={[styles.detailDescription, { color: theme.colors.textSecondary }]}>
                  {selectedHotel.description}
                </Text>
              </View>

              {/* Facilities */}
              <View style={styles.detailSection}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIndicator, { backgroundColor: theme.colors.primary }]} />
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Facilities & Amenities</Text>
                </View>
                <View style={styles.facilitiesGrid}>
                  {selectedHotel.facilities.map((facility, index) => (
                    <View 
                      key={index}
                      style={[
                        styles.facilityItem,
                        {
                          backgroundColor: facility.available ? 
                            theme.colors.success + '10' : theme.colors.muted,
                          borderColor: facility.available ? 
                            theme.colors.success + '30' : theme.colors.border,
                        }
                      ]}
                    >
                      <Ionicons 
                        name={facility.icon as any} 
                        size={16} 
                        color={facility.available ? theme.colors.success : theme.colors.textSecondary} 
                      />
                      <Text style={[
                        styles.facilityText,
                        { 
                          color: facility.available ? theme.colors.text : theme.colors.textSecondary,
                          opacity: facility.available ? 1 : 0.6 
                        }
                      ]}>
                        {facility.name}
                      </Text>
                      {facility.available && (
                        <Ionicons name="checkmark" size={12} color={theme.colors.success} />
                      )}
                    </View>
                  ))}
                </View>
              </View>

              {/* Safety Features */}
              <View style={styles.detailSection}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIndicator, { backgroundColor: theme.colors.success }]} />
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Safety Features</Text>
                  <View style={[styles.safetyScoreBadge, { backgroundColor: getSafetyBgColor(selectedHotel.safetyScore) }]}>
                    <Text style={[styles.safetyScoreText, { color: getSafetyColor(selectedHotel.safetyScore) }]}>
                      {selectedHotel.safetyScore}% Safe
                    </Text>
                  </View>
                </View>
                <View style={styles.highlightsContainer}>
                  {selectedHotel.highlights.map((highlight, index) => (
                    <View key={index} style={[styles.highlightItem, { backgroundColor: theme.colors.success + '05' }]}>
                      <View style={[styles.highlightDot, { backgroundColor: theme.colors.success }]} />
                      <Text style={[styles.highlightText, { color: theme.colors.text }]}>{highlight}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* All Amenities */}
              <View style={styles.detailSection}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIndicator, { backgroundColor: theme.colors.primary }]} />
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>All Amenities</Text>
                </View>
                <View style={styles.amenitiesDetailContainer}>
                  {selectedHotel.amenities.map((amenity, index) => (
                    <View key={index} style={[styles.amenityDetailBadge, { backgroundColor: theme.colors.muted }]}>
                      <Text style={[styles.amenityDetailText, { color: theme.colors.textSecondary }]}>{amenity}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Reviews Summary */}
              <View style={styles.detailSection}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIndicator, { backgroundColor: theme.colors.primary }]} />
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Guest Reviews</Text>
                </View>
                <View style={[styles.reviewsSection, { backgroundColor: theme.colors.muted }]}>
                  <View style={styles.reviewsHeader}>
                    <View style={styles.reviewsLeft}>
                      <Ionicons name="star" size={24} color={theme.colors.warning} />
                      <Text style={[styles.reviewsRating, { color: theme.colors.text }]}>{selectedHotel.rating}</Text>
                      <Text style={[styles.reviewsOutOf, { color: theme.colors.textSecondary }]}>/ 5.0</Text>
                    </View>
                    <Text style={[styles.reviewsCount, { color: theme.colors.textSecondary }]}>
                      Based on {selectedHotel.reviews.toLocaleString()} reviews
                    </Text>
                  </View>
                  <Text style={[styles.reviewsDescription, { color: theme.colors.textSecondary }]}>
                    {selectedHotel.rating >= 4.5 ? 'Excellent' : 
                     selectedHotel.rating >= 4.0 ? 'Very Good' : 
                     selectedHotel.rating >= 3.5 ? 'Good' : 'Fair'} rating from verified guests
                  </Text>
                </View>
              </View>

              {/* Contact Info */}
              <View style={[styles.contactSection, { backgroundColor: theme.colors.muted }]}>
                <Text style={[styles.contactTitle, { color: theme.colors.text }]}>Need Help?</Text>
                <View style={styles.contactInfo}>
                  <View style={styles.contactItem}>
                    <Ionicons name="call" size={16} color={theme.colors.textSecondary} />
                    <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>Tourist Helpline: 1363</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <Ionicons name="shield-checkmark" size={16} color={theme.colors.textSecondary} />
                    <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>24/7 Safety Support Available</Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Fixed Bottom Booking Section */}
            <View style={[styles.bookingSectionFixed, { backgroundColor: theme.colors.background }]}>
              <Text style={[styles.bookingSectionTitle, { color: theme.colors.textSecondary }]}>
                Choose your booking platform
              </Text>
              <Text style={[styles.bookingSectionSubtitle, { color: theme.colors.textSecondary }]}>
                Compare prices and book directly
              </Text>
              
              <View style={styles.bookingButtonsFixed}>
                <TouchableOpacity 
                  style={styles.bookingButtonFixed}
                  onPress={() => handleBooking('mmt', selectedHotel)}
                >
                  <LinearGradient
                    colors={['#FF6B35', '#F7931E']}
                    style={styles.bookingButtonFixedGradient}
                  >
                    <Ionicons name="open-outline" size={16} color="#FFFFFF" />
                    <View style={styles.bookingButtonFixedText}>
                      <Text style={styles.bookingButtonFixedTitle}>MakeMyTrip</Text>
                      <Text style={styles.bookingButtonFixedSubtitle}>Best Price Guarantee</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.bookingButtonFixed}
                  onPress={() => handleBooking('goibibo', selectedHotel)}
                >
                  <LinearGradient
                    colors={['#4285F4', '#7C3AED']}
                    style={styles.bookingButtonFixedGradient}
                  >
                    <Ionicons name="open-outline" size={16} color="#FFFFFF" />
                    <View style={styles.bookingButtonFixedText}>
                      <Text style={styles.bookingButtonFixedTitle}>Goibibo</Text>
                      <Text style={styles.bookingButtonFixedSubtitle}>Instant Confirmation</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.favoriteButton, { 
                  backgroundColor: likedHotels.has(selectedHotel.id) ? theme.colors.error + '20' : theme.colors.surface,
                  borderColor: likedHotels.has(selectedHotel.id) ? theme.colors.error : theme.colors.border
                }]}
                onPress={() => handleLike(selectedHotel.id)}
              >
                <Ionicons 
                  name={likedHotels.has(selectedHotel.id) ? "heart" : "heart-outline"} 
                  size={16} 
                  color={likedHotels.has(selectedHotel.id) ? theme.colors.error : theme.colors.text} 
                />
                <Text style={[styles.favoriteButtonText, { 
                  color: likedHotels.has(selectedHotel.id) ? theme.colors.error : theme.colors.text 
                }]}>
                  {likedHotels.has(selectedHotel.id) ? 'Saved to Favorites' : 'Save to Favorites'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      
      <FlatList
        data={sortedHotels}
        renderItem={renderHotelCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.hotelsList}
        showsVerticalScrollIndicator={false}
      />

      {renderSortModal()}
      {renderHotelDetail()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sortLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 12,
    marginLeft: 6,
  },
  sortValue: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  hotelsList: {
    padding: 16,
    paddingBottom: 80,
  },
  hotelCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    height: 192,
    position: 'relative',
  },
  hotelImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  heartBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safetyBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  safetyText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 48,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  discountBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hotelInfo: {
    padding: 16,
  },
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  hotelHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  distanceText: {
    fontSize: 12,
    marginLeft: 4,
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 10,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  amenityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  amenityText: {
    fontSize: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  perNight: {
    fontSize: 12,
    marginLeft: 4,
  },
  bookingButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  bookingButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mmtButton: {},
  goibiboButton: {},
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBlur: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sortModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalSubtitle: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
    fontSize: 14,
  },
  sortOptions: {
    maxHeight: 320,
    paddingHorizontal: 16,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  sortOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortOptionText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  applyButton: {
    margin: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  detailOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  detailModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.9,
    overflow: 'hidden',
  },
  detailImageContainer: {
    height: 256,
    position: 'relative',
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  detailImageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  closeButtonBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailOverlayInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  detailHeaderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailHeaderLeft: {
    flex: 1,
    marginRight: 16,
  },
  detailHotelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  detailLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  detailLocationText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 4,
  },
  detailDistanceText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 4,
  },
  detailRatingContainer: {
    alignItems: 'flex-end',
  },
  detailRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailRatingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  detailReviewsText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  detailBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  detailSafetyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  detailSafetyText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  detailVerifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  detailVerifiedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  detailDiscountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  detailDiscountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  detailContent: {
    maxHeight: height * 0.6,
  },
  priceSection: {
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  priceSectionContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  detailPrice: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  detailOriginalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  priceSectionSubtext: {
    fontSize: 12,
  },
  detailSection: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  safetyScoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  safetyScoreText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  facilitiesGrid: {
    gap: 12,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  facilityText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
  highlightsContainer: {
    gap: 8,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  highlightDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  highlightText: {
    fontSize: 12,
  },
  amenitiesDetailContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityDetailBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  amenityDetailText: {
    fontSize: 10,
  },
  reviewsSection: {
    padding: 16,
    borderRadius: 12,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewsRating: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  reviewsOutOf: {
    fontSize: 16,
    marginLeft: 4,
  },
  reviewsCount: {
    fontSize: 12,
  },
  reviewsDescription: {
    fontSize: 12,
  },
  contactSection: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  contactInfo: {
    gap: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 12,
    marginLeft: 8,
  },
  bookingSectionFixed: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  bookingSectionTitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  bookingSectionSubtitle: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 12,
  },
  bookingButtonsFixed: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  bookingButtonFixed: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bookingButtonFixedGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  bookingButtonFixedText: {
    marginLeft: 8,
  },
  bookingButtonFixedTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bookingButtonFixedSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  favoriteButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});
