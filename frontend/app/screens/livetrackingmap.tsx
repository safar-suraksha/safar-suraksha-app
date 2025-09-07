import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  MapPin,
  Shield,
  AlertTriangle,
  Zap,
  Users,
  Clock,
  Eye,
  Target
} from 'lucide-react-native';

const LiveTrackingMap = ({ onShowWarning, onNavigateBack, theme }:any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentLocation, setCurrentLocation] = useState({ lat: 28.6139, lng: 77.2090 });
  const [mapMode, setMapMode] = useState('safety');
  const [showTraffic, setShowTraffic] = useState(true);
  const [nearbyIncidents, ] = useState(3);

  // Animation refs
  const pulseAnim1 = useRef(new Animated.Value(1)).current;
  const pulseAnim2 = useRef(new Animated.Value(1)).current;
  const pulseAnim3 = useRef(new Animated.Value(1)).current;
  const liveIndicatorAnim = useRef(new Animated.Value(1)).current;
  const userLocationAnim = useRef(new Animated.Value(1)).current;

  const safetyZones = [
    { id: 1, type: 'safe', name: 'Connaught Place', level: 'high', x: 45, y: 40 },
    { id: 2, type: 'warning', name: 'Red Fort Area', level: 'medium', x: 60, y: 25 },
    { id: 3, type: 'danger', name: 'Old Delhi Market', level: 'high', x: 35, y: 60 },
    { id: 4, type: 'safe', name: 'India Gate', level: 'high', x: 70, y: 45 },
    { id: 5, type: 'warning', name: 'Chandni Chowk', level: 'medium', x: 25, y: 30 }
  ];

  useEffect(() => {
    // Animated pulsing effects
    const createPulseAnimation = (animValue:any) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Start all animations
    createPulseAnimation(pulseAnim1).start();
    
    setTimeout(() => createPulseAnimation(pulseAnim2).start(), 300);
    setTimeout(() => createPulseAnimation(pulseAnim3).start(), 600);

    // Live indicator pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(liveIndicatorAnim, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(liveIndicatorAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // User location pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(userLocationAnim, {
          toValue: 1.2,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(userLocationAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [liveIndicatorAnim, pulseAnim1, pulseAnim2, pulseAnim3, userLocationAnim]);

  const getZoneStyles = (type:any) => {
    switch (type) {
      case 'safe':
        return {
          backgroundColor: '#10b981',
          borderColor: '#6ee7b7',
        };
      case 'warning':
        return {
          backgroundColor: '#f59e0b',
          borderColor: '#fbbf24',
        };
      case 'danger':
        return {
          backgroundColor: '#ef4444',
          borderColor: '#f87171',
        };
      default:
        return {
          backgroundColor: '#6b7280',
          borderColor: '#9ca3af',
        };
    }
  };

  const handleZonePress = (zone:any) => {
    if (zone.type === 'danger') {
      onShowWarning();
    } else {
      Alert.alert(zone.name, `Safety Level: ${zone.level.toUpperCase()}`);
    }
  };

  const handleEmergencyPress = () => {
    Alert.alert('Emergency', 'Navigating to emergency call...');
  };

  const handleCenterLocation = () => {
    Alert.alert('Location', 'Centering on your location...');
  };

  const isDark = theme?.mode === 'dark';

  const getMapBackground = () => {
    if (mapMode === 'satellite') {
      return ['#166534', '#15803d', '#22c55e'];
    } else {
      return isDark 
        ? ['#111827', '#1f2937', '#374151'] 
        : ['#f9fafb', '#f3f4f6', '#ffffff'];
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.colors?.background || '#ffffff' }]}>
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: theme?.colors?.card || '#ffffff',
        borderBottomColor: theme?.colors?.border || '#e2e8f0'
      }]}>
        <TouchableOpacity
          onPress={onNavigateBack}
          style={[styles.backButton, { backgroundColor: theme?.colors?.accent || '#f1f5f9' }]}
        >
          <ArrowLeft size={20} color={theme?.colors?.foreground || '#000000'} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme?.colors?.foreground || '#000000' }]}>
            Live Safety Map
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme?.colors?.mutedForeground || '#64748b' }]}>
            Real-time safety monitoring
          </Text>
        </View>
        
        <View style={styles.liveIndicator}>
          <Animated.View 
            style={[
              styles.liveDot,
              { transform: [{ scale: liveIndicatorAnim }] }
            ]} 
          />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {/* Map Controls */}
      <View style={[styles.controls, { 
        backgroundColor: theme?.colors?.card || '#ffffff',
        borderBottomColor: theme?.colors?.border || '#e2e8f0'
      }]}>
        <View style={styles.controlsLeft}>
          {['normal', 'satellite', 'safety'].map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => setMapMode(mode)}
              style={[
                styles.modeButton,
                mapMode === mode 
                  ? { backgroundColor: theme?.colors?.primary || '#3b82f6' }
                  : { backgroundColor: theme?.colors?.muted || '#f1f5f9' }
              ]}
            >
              <Text style={[
                styles.modeButtonText,
                mapMode === mode 
                  ? { color: '#ffffff' }
                  : { color: theme?.colors?.mutedForeground || '#64748b' }
              ]}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity
          onPress={() => setShowTraffic(!showTraffic)}
          style={[
            styles.trafficButton,
            showTraffic 
              ? { backgroundColor: '#f59e0b' }
              : { backgroundColor: theme?.colors?.muted || '#f1f5f9' }
          ]}
        >
          <Text style={[
            styles.trafficButtonText,
            showTraffic 
              ? { color: '#ffffff' }
              : { color: theme?.colors?.mutedForeground || '#64748b' }
          ]}>
            Traffic
          </Text>
        </TouchableOpacity>
      </View>

      {/* Map Display */}
      <View style={styles.mapContainer}>
        <LinearGradient
          colors={getMapBackground()}
          style={styles.mapGradient}
        >
          {/* Grid Pattern */}
          {mapMode !== 'satellite' && (
            <View style={styles.gridContainer}>
              {/* Horizontal lines */}
              {Array.from({ length: 20 }, (_, i) => (
                <View
                  key={`h${i}`}
                  style={[
                    styles.gridLineHorizontal,
                    { 
                      top: `${i * 5}%`,
                      backgroundColor: theme?.colors?.border || '#e2e8f0'
                    }
                  ]}
                />
              ))}
              {/* Vertical lines */}
              {Array.from({ length: 20 }, (_, i) => (
                <View
                  key={`v${i}`}
                  style={[
                    styles.gridLineVertical,
                    { 
                      left: `${i * 5}%`,
                      backgroundColor: theme?.colors?.border || '#e2e8f0'
                    }
                  ]}
                />
              ))}
            </View>
          )}

          {/* Roads/Streets */}
          <View style={styles.roadsContainer}>
            <View style={[styles.road1, { backgroundColor: isDark ? '#4b5563' : '#d1d5db' }]} />
            <View style={[styles.road2, { backgroundColor: isDark ? '#4b5563' : '#d1d5db' }]} />
            <View style={[styles.road3, { backgroundColor: isDark ? '#4b5563' : '#d1d5db' }]} />
            <View style={[styles.road4, { backgroundColor: isDark ? '#4b5563' : '#d1d5db' }]} />
          </View>

          {/* Safety Zones */}
          {safetyZones.map((zone, index) => {
            const zoneStyles = getZoneStyles(zone.type);
            let animValue = pulseAnim1;
            if (index % 3 === 1) animValue = pulseAnim2;
            if (index % 3 === 2) animValue = pulseAnim3;

            return (
              <TouchableOpacity
                key={zone.id}
                onPress={() => handleZonePress(zone)}
                style={[
                  styles.safetyZone,
                  {
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                    backgroundColor: zoneStyles.backgroundColor,
                    borderColor: zoneStyles.borderColor,
                  }
                ]}
              >
                <Animated.View
                  style={[
                    styles.safetyZonePulse,
                    {
                      backgroundColor: zoneStyles.backgroundColor,
                      transform: [{ scale: animValue }]
                    }
                  ]}
                />
              </TouchableOpacity>
            );
          })}

          {/* User Location */}
          <View style={styles.userLocationContainer}>
            <View style={styles.userLocation}>
              <Animated.View 
                style={[
                  styles.userLocationPulse,
                  { transform: [{ scale: userLocationAnim }] }
                ]} 
              />
            </View>
          </View>

          {/* Traffic Indicators */}
          {showTraffic && (
            <>
              <View style={[styles.trafficIndicator1, { backgroundColor: '#f87171' }]} />
              <View style={[styles.trafficIndicator2, { backgroundColor: '#fbbf24' }]} />
              <View style={[styles.trafficIndicator3, { backgroundColor: '#34d399' }]} />
            </>
          )}
        </LinearGradient>

        {/* Map Legend */}
        <View style={[styles.legend, { 
          backgroundColor: theme?.colors?.card || '#ffffff',
          borderColor: theme?.colors?.border || '#e2e8f0'
        }]}>
          {[
            { color: '#10b981', label: 'Safe Zone' },
            { color: '#f59e0b', label: 'Caution' },
            { color: '#ef4444', label: 'Danger' }
          ].map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={[styles.legendText, { color: theme?.colors?.foreground || '#000000' }]}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Floating Action Buttons */}
        <View style={styles.floatingButtons}>
          <TouchableOpacity
            onPress={handleCenterLocation}
            style={[styles.floatingButton, { 
              backgroundColor: theme?.colors?.card || '#ffffff',
              borderColor: theme?.colors?.border || '#e2e8f0'
            }]}
          >
            <Target size={20} color={theme?.colors?.foreground || '#000000'} />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleEmergencyPress}
            style={[styles.floatingButton, styles.emergencyButton]}
          >
            <AlertTriangle size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Info */}
      <View style={[styles.locationInfo, { 
        backgroundColor: `${theme?.colors?.card || '#ffffff'}f2`,
        borderColor: theme?.colors?.border || '#e2e8f0'
      }]}>
        <View style={styles.locationHeader}>
          <View style={styles.locationTitle}>
            <MapPin size={16} color={theme?.colors?.primary || '#3b82f6'} />
            <Text style={[styles.locationTitleText, { color: theme?.colors?.cardForeground || '#000000' }]}>
              Current Location
            </Text>
          </View>
          <View style={styles.locationTime}>
            <Clock size={12} color={theme?.colors?.mutedForeground || '#64748b'} />
            <Text style={[styles.locationTimeText, { color: theme?.colors?.mutedForeground || '#64748b' }]}>
              Updated now
            </Text>
          </View>
        </View>
        
        <Text style={[styles.locationAddress, { color: theme?.colors?.mutedForeground || '#64748b' }]}>
          Connaught Place, New Delhi
        </Text>
        
        <View style={styles.locationStats}>
          <View style={styles.locationSafety}>
            <Shield size={14} color="#10b981" />
            <Text style={styles.safetyText}>Safe Area</Text>
          </View>
          
          <View style={styles.locationDetails}>
            <View style={styles.detailItem}>
              <Eye size={12} color={theme?.colors?.mutedForeground || '#64748b'} />
              <Text style={[styles.detailText, { color: theme?.colors?.mutedForeground || '#64748b' }]}>
                12 cameras
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Users size={12} color={theme?.colors?.mutedForeground || '#64748b'} />
              <Text style={[styles.detailText, { color: theme?.colors?.mutedForeground || '#64748b' }]}>
                High activity
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Stats */}
      <View style={[styles.bottomStats, { 
        backgroundColor: theme?.colors?.card || '#ffffff',
        borderTopColor: theme?.colors?.border || '#e2e8f0'
      }]}>
        <View style={styles.statItem}>
          <View style={styles.statIcon}>
            <Shield size={16} color="#10b981" />
            <Text style={[styles.statLabel, { color: theme?.colors?.foreground || '#000000' }]}>
              Safe
            </Text>
          </View>
          <Text style={[styles.statDescription, { color: theme?.colors?.mutedForeground || '#64748b' }]}>
            Current status
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={styles.statIcon}>
            <AlertTriangle size={16} color="#f59e0b" />
            <Text style={[styles.statLabel, { color: theme?.colors?.foreground || '#000000' }]}>
              {nearbyIncidents}
            </Text>
          </View>
          <Text style={[styles.statDescription, { color: theme?.colors?.mutedForeground || '#64748b' }]}>
            Nearby alerts
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <View style={styles.statIcon}>
            <Zap size={16} color="#3b82f6" />
            <Text style={[styles.statLabel, { color: theme?.colors?.foreground || '#000000' }]}>
              Live
            </Text>
          </View>
          <Text style={[styles.statDescription, { color: theme?.colors?.mutedForeground || '#64748b' }]}>
            Tracking
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 12,
    height: 12,
    backgroundColor: '#10b981',
    borderRadius: 6,
    marginRight: 8,
  },
  liveText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10b981',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
  },
  controlsLeft: {
    flexDirection: 'row',
    gap: 8,
  },
  modeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  trafficButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  trafficButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapGradient: {
    flex: 1,
    position: 'relative',
  },
  gridContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  gridLineHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
  },
  roadsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  road1: {
    position: 'absolute',
    height: 4,
    width: '75%',
    top: '25%',
    left: '12.5%',
    borderRadius: 2,
    transform: [{ rotate: '12deg' }],
  },
  road2: {
    position: 'absolute',
    height: 4,
    width: '66%',
    top: '50%',
    left: '16%',
    borderRadius: 2,
    transform: [{ rotate: '-6deg' }],
  },
  road3: {
    position: 'absolute',
    width: 4,
    height: '50%',
    left: '33%',
    top: '25%',
    borderRadius: 2,
  },
  road4: {
    position: 'absolute',
    width: 4,
    height: '66%',
    left: '66%',
    top: '16%',
    borderRadius: 2,
  },
  safetyZone: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  safetyZonePulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.3,
  },
  userLocationContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{ translateX: -8 }, { translateY: -8 }],
  },
  userLocation: {
    width: 16,
    height: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  userLocationPulse: {
    position: 'absolute',
    width: 16,
    height: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    opacity: 0.3,
    top: -2,
    left: -2,
  },
  trafficIndicator1: {
    position: 'absolute',
    width: 8,
    height: 32,
    top: '33%',
    left: '25%',
    borderRadius: 4,
    opacity: 0.7,
  },
  trafficIndicator2: {
    position: 'absolute',
    width: 8,
    height: 24,
    top: '66%',
    left: '75%',
    borderRadius: 4,
    opacity: 0.7,
  },
  trafficIndicator3: {
    position: 'absolute',
    width: 8,
    height: 16,
    top: '50%',
    left: '12%',
    borderRadius: 4,
    opacity: 0.7,
  },
  legend: {
    position: 'absolute',
    top: 16,
    right: 16,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
  floatingButtons: {
    position: 'absolute',
    top: 64,
    right: 16,
  },
  floatingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
  },
  emergencyButton: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  locationInfo: {
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTitleText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  locationTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTimeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  locationAddress: {
    fontSize: 12,
    marginBottom: 8,
  },
  locationStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationSafety: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  safetyText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#059669',
    marginLeft: 4,
  },
  locationDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    marginLeft: 4,
  },
  bottomStats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  statDescription: {
    fontSize: 12,
  },
});

export default LiveTrackingMap;