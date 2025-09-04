import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from './ThemeProvider';
import {
  ArrowLeft,
  MapPin,
  Shield,
  Truck,
  Users,
  Home,
  AlertTriangle,
  Zap,
  CheckCircle,
  Camera,
  Image,
  Send
} from 'react-native-feather';

const { width } = Dimensions.get('window');

interface ReportIssueScreenProps {
  userData: any;
}

export function ReportIssueScreen({ userData }: ReportIssueScreenProps) {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    { 
      id: 'safety', 
      name: 'Safety Concern', 
      icon: Shield, 
      color: '#ef4444', 
      description: 'Unsafe conditions, harassment, theft' 
    },
    { 
      id: 'traffic', 
      name: 'Traffic Issue', 
      icon: Truck, 
      color: '#f59e0b', 
      description: 'Traffic violations, road hazards' 
    },
    { 
      id: 'crowding', 
      name: 'Overcrowding', 
      icon: Users, 
      color: '#f97316', 
      description: 'Dangerous crowd situations' 
    },
    { 
      id: 'infrastructure', 
      name: 'Infrastructure', 
      icon: Home, 
      color: '#3b82f6', 
      description: 'Broken facilities, poor lighting' 
    },
    { 
      id: 'emergency', 
      name: 'Emergency', 
      icon: AlertTriangle, 
      color: '#8b5cf6', 
      description: 'Immediate danger, medical emergency' 
    },
    { 
      id: 'other', 
      name: 'Other', 
      icon: Zap, 
      color: '#6b7280', 
      description: 'Any other safety related concern' 
    }
  ];

  const handleSubmit = async () => {
    if (!selectedCategory || !description.trim()) {
      Alert.alert('Error', 'Please select a category and provide description');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    Alert.alert('Success', 'Report submitted successfully!');
    
    // Auto close after success
    setTimeout(() => {
      navigation.goBack();
    }, 3000);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: StatusBar.currentHeight + 16,
    },
    backButton: {
      padding: 8,
      marginRight: 12,
      borderRadius: 8,
    },
    headerContent: {
      flex: 1,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.foreground,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.mutedForeground,
      marginTop: 2,
    },
    spacer: {
      width: 36, // Same width as back button + margin
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 32,
    },
    locationCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    locationIcon: {
      marginRight: 12,
    },
    locationContent: {
      flex: 1,
    },
    locationTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.cardForeground,
    },
    locationSubtitle: {
      fontSize: 14,
      color: colors.mutedForeground,
      marginTop: 2,
    },
    statusDot: {
      width: 12,
      height: 12,
      backgroundColor: '#10b981',
      borderRadius: 6,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.foreground,
      marginBottom: 16,
    },
    categoryItem: {
      backgroundColor: colors.card,
      borderWidth: 2,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    categoryIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    categoryContent: {
      flex: 1,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.cardForeground,
    },
    categoryDescription: {
      fontSize: 14,
      color: colors.mutedForeground,
      marginTop: 2,
    },
    selectedIndicator: {
      width: 20,
      height: 20,
      backgroundColor: colors.primary,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 16,
    },
    descriptionCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    textInput: {
      color: colors.cardForeground,
      fontSize: 14,
      textAlignVertical: 'top',
      minHeight: 120,
      lineHeight: 20,
    },
    characterCount: {
      alignSelf: 'flex-end',
      marginTop: 12,
    },
    characterCountText: {
      fontSize: 12,
      color: colors.mutedForeground,
    },
    mediaGrid: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    mediaButton: {
      flex: 1,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingVertical: 24,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 100,
    },
    mediaButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.foreground,
      textAlign: 'center',
      marginTop: 8,
    },
    submitButton: {
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 56,
      marginBottom: 16,
    },
    submitButtonActive: {
      backgroundColor: colors.primary,
    },
    submitButtonInactive: {
      backgroundColor: colors.mutedForeground + '80',
    },
    submitButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    submitButtonText: {
      fontSize: 18,
      fontWeight: '600',
      marginLeft: 8,
    },
    submitButtonTextActive: {
      color: colors.primaryForeground,
    },
    submitButtonTextInactive: {
      color: colors.muted,
    },
    disclaimer: {
      fontSize: 12,
      color: colors.mutedForeground,
      textAlign: 'center',
      lineHeight: 18,
    },
    successContainer: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    successIcon: {
      width: 96,
      height: 96,
      backgroundColor: '#10b981',
      borderRadius: 48,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    successTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.foreground,
      marginBottom: 24,
    },
    successCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 24,
      width: '100%',
      marginBottom: 24,
    },
    successMessage: {
      fontSize: 18,
      color: colors.cardForeground,
      textAlign: 'center',
      marginBottom: 16,
    },
    successDetails: {
      gap: 8,
    },
    successDetailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    successDetailLabel: {
      fontSize: 14,
      color: colors.mutedForeground,
    },
    successDetailValue: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.cardForeground,
    },
    successFooter: {
      fontSize: 14,
      color: colors.mutedForeground,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  if (isSubmitted) {
    return (
      <View style={styles.successContainer}>
        <StatusBar barStyle={colors.isDark ? 'light-content' : 'dark-content'} />
        
        <View style={styles.successIcon}>
          <CheckCircle size={48} color="white" />
        </View>
        
        <Text style={styles.successTitle}>Report Submitted!</Text>
        
        <View style={styles.successCard}>
          <Text style={styles.successMessage}>Your safety report has been received</Text>
          
          <View style={styles.successDetails}>
            <View style={styles.successDetailRow}>
              <Text style={styles.successDetailLabel}>Report ID:</Text>
              <Text style={styles.successDetailValue}>
                SR-{Date.now().toString().slice(-6)}
              </Text>
            </View>
            
            <View style={styles.successDetailRow}>
              <Text style={styles.successDetailLabel}>Status:</Text>
              <Text style={styles.successDetailValue}>Under Review</Text>
            </View>
            
            <View style={styles.successDetailRow}>
              <Text style={styles.successDetailLabel}>Expected Response:</Text>
              <Text style={styles.successDetailValue}>Within 15 minutes</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.successFooter}>
          Thank you for helping keep our community safe!{'\n'}
          You'll receive updates via SMS and app notifications.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={colors.isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Report Issue</Text>
          <Text style={styles.headerSubtitle}>Help us keep everyone safe</Text>
        </View>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Location Info */}
        <View style={styles.locationCard}>
          <MapPin size={20} color={colors.primary} style={styles.locationIcon} />
          <View style={styles.locationContent}>
            <Text style={styles.locationTitle}>Current Location</Text>
            <Text style={styles.locationSubtitle}>{userData.currentLocation}</Text>
          </View>
          <View style={styles.statusDot} />
        </View>

        {/* Category Selection */}
        <Text style={styles.sectionTitle}>What type of issue are you reporting?</Text>
        
        {categories.map((category) => {
          const IconComponent = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              style={[
                styles.categoryItem,
                {
                  borderColor: isSelected ? colors.primary : colors.border,
                  backgroundColor: colors.card,
                }
              ]}
            >
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                <IconComponent size={20} color="white" />
              </View>
              <View style={styles.categoryContent}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>
              {isSelected && (
                <View style={styles.selectedIndicator}>
                  <CheckCircle size={12} color={colors.primaryForeground} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Description */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Describe the issue</Text>
        
        <View style={styles.descriptionCard}>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Please provide as much detail as possible. Include what happened, when it occurred, and any immediate safety concerns..."
            placeholderTextColor={colors.mutedForeground}
            style={styles.textInput}
            multiline
            maxLength={500}
          />
          <View style={styles.characterCount}>
            <Text style={styles.characterCountText}>
              {description.length}/500 characters
            </Text>
          </View>
        </View>

        {/* Media Upload */}
        <Text style={styles.sectionTitle}>Add evidence (optional)</Text>
        
        <View style={styles.mediaGrid}>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => Alert.alert('Coming Soon', 'Camera feature will be available in full version')}
          >
            <Camera size={32} color={colors.foreground} />
            <Text style={styles.mediaButtonText}>Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => Alert.alert('Coming Soon', 'Gallery feature will be available in full version')}
          >
            <Image size={32} color={colors.foreground} />
            <Text style={styles.mediaButtonText}>From Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!selectedCategory || !description.trim() || isSubmitting}
          style={[
            styles.submitButton,
            selectedCategory && description.trim() 
              ? styles.submitButtonActive 
              : styles.submitButtonInactive
          ]}
        >
          {isSubmitting ? (
            <View style={styles.submitButtonContent}>
              <ActivityIndicator 
                size="small" 
                color={colors.primaryForeground} 
              />
              <Text style={[styles.submitButtonText, styles.submitButtonTextActive]}>
                Submitting Report...
              </Text>
            </View>
          ) : (
            <View style={styles.submitButtonContent}>
              <Send size={20} color={selectedCategory && description.trim() ? colors.primaryForeground : colors.muted} />
              <Text style={[
                styles.submitButtonText,
                selectedCategory && description.trim() 
                  ? styles.submitButtonTextActive 
                  : styles.submitButtonTextInactive
              ]}>
                Submit Report
              </Text>
            </View>
          )}
        </TouchableOpacity>
        
        <Text style={styles.disclaimer}>
          Your report will be reviewed immediately by local authorities and tourist safety officials.
          False reports may result in penalties.
        </Text>
      </ScrollView>
    </View>
  );
}