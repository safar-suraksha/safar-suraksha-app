import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
import {
  AlertTriangle,
  X,
  MapPin,
  Clock,
  Phone,
  Navigation,
  Shield,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const GeoFenceWarning = ({ isOpen, onClose, warningData, theme }:any) => {
  const [flashingRed, setFlashingRed] = useState(true);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setFlashingRed(prev => !prev);
      }, 500);

      // Pulse animation for high risk
      if (warningData.riskLevel === 'high') {
        const pulse = () => {
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => pulse());
        };
        pulse();
      }

      return () => {
        clearInterval(interval);
        pulseAnim.setValue(1);
      };
    }
  }, [isOpen, pulseAnim, warningData.riskLevel]);

  const getRiskStyles = () => {
    switch (warningData.riskLevel) {
      case 'high': 
        return {
          border: '#ef4444',
          background: 'rgba(239, 68, 68, 0.05)',
          iconColor: '#ef4444',
          alertBg: '#fef2f2',
          alertBorder: '#fecaca',
          alertBgDark: 'rgba(153, 27, 27, 0.3)',
          alertBorderDark: '#991b1b'
        };
      case 'medium':
        return {
          border: '#f59e0b',
          background: 'rgba(245, 158, 11, 0.05)',
          iconColor: '#f59e0b',
          alertBg: '#fffbeb',
          alertBorder: '#fde68a',
          alertBgDark: 'rgba(146, 64, 14, 0.3)',
          alertBorderDark: '#92400e'
        };
      case 'low':
        return {
          border: '#3b82f6',
          background: 'rgba(59, 130, 246, 0.05)',
          iconColor: '#3b82f6',
          alertBg: '#eff6ff',
          alertBorder: '#bfdbfe',
          alertBgDark: 'rgba(30, 58, 138, 0.3)',
          alertBorderDark: '#1e3a8a'
        };
      default:
        return {
          border: '#ef4444',
          background: 'rgba(239, 68, 68, 0.05)',
          iconColor: '#ef4444',
          alertBg: '#fef2f2',
          alertBorder: '#fecaca',
          alertBgDark: 'rgba(153, 27, 27, 0.3)',
          alertBorderDark: '#991b1b'
        };
    }
  };

  const riskStyles = getRiskStyles();
  const isDark = theme?.mode === 'dark';

  const getTitle = () => {
    switch (warningData.riskLevel) {
      case 'high': return 'DANGER ZONE ALERT';
      case 'medium': return 'CAUTION ZONE';
      case 'low': return 'ADVISORY NOTICE';
      default: return 'DANGER ZONE ALERT';
    }
  };

  const handleEmergencyCall = () => {
    Alert.alert('Emergency Call', 'Calling emergency services...');
  };

  const handleAlternateRoute = () => {
    Alert.alert('Navigation', 'Finding alternate route...');
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <Animated.View 
          style={[
            styles.modal,
            {
              borderColor: riskStyles.border,
              backgroundColor: theme?.colors?.card || '#ffffff',
              transform: [{ scale: warningData.riskLevel === 'high' && flashingRed ? pulseAnim : 1 }]
            }
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme?.colors?.border || '#e2e8f0' }]}>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <AlertTriangle 
                  size={24} 
                  color={riskStyles.iconColor} 
                  style={styles.headerIcon}
                />
                <View>
                  <Text style={[styles.title, { color: theme?.colors?.foreground || '#000000' }]}>
                    {getTitle()}
                  </Text>
                  <Text style={[styles.subtitle, { color: theme?.colors?.mutedForeground || '#64748b' }]}>
                    Safety warning for your area
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity
                onPress={onClose}
                style={[styles.closeButton, { backgroundColor: theme?.colors?.accent || '#f1f5f9' }]}
              >
                <X size={20} color={theme?.colors?.foreground || '#000000'} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Zone Information */}
            <View style={styles.section}>
              <View style={styles.infoRow}>
                <MapPin size={16} color={theme?.colors?.mutedForeground || '#64748b'} />
                <Text style={[styles.zoneName, { color: theme?.colors?.cardForeground || '#000000' }]}>
                  {warningData.zone}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Navigation size={16} color={theme?.colors?.mutedForeground || '#64748b'} />
                <Text style={[styles.distanceTime, { color: theme?.colors?.mutedForeground || '#64748b' }]}>
                  {warningData.distance} • {warningData.estimatedTime}
                </Text>
              </View>
            </View>

            {/* Description */}
            <View style={[
              styles.descriptionBox,
              {
                backgroundColor: isDark ? riskStyles.alertBgDark : riskStyles.alertBg,
                borderColor: isDark ? riskStyles.alertBorderDark : riskStyles.alertBorder,
              }
            ]}>
              <Text style={[styles.description, { color: theme?.colors?.cardForeground || '#000000' }]}>
                {warningData.description}
              </Text>
            </View>

            {/* Recommendations */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Shield size={16} color={theme?.colors?.primary || '#3b82f6'} />
                <Text style={[styles.sectionTitle, { color: theme?.colors?.cardForeground || '#000000' }]}>
                  Safety Recommendations
                </Text>
              </View>
              <View style={styles.recommendationsList}>
                {warningData.recommendations.map((recommendation:any, index:any) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Text style={[styles.bullet, { color: theme?.colors?.primary || '#3b82f6' }]}>•</Text>
                    <Text style={[styles.recommendationText, { color: theme?.colors?.mutedForeground || '#64748b' }]}>
                      {recommendation}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Emergency Contacts */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Phone size={16} color="#ef4444" />
                <Text style={[styles.sectionTitle, { color: theme?.colors?.cardForeground || '#000000' }]}>
                  Emergency Contacts
                </Text>
              </View>
              <View style={styles.contactsList}>
                {warningData.emergencyContacts.map((contact:any, index:any) => (
                  <Text key={index} style={[styles.contactText, { color: theme?.colors?.mutedForeground || '#64748b' }]}>
                    {contact}
                  </Text>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={[styles.actions, { borderTopColor: theme?.colors?.border || '#e2e8f0' }]}>
            <TouchableOpacity
              onPress={handleEmergencyCall}
              style={styles.emergencyButton}
            >
              <Phone size={16} color="#ffffff" style={styles.buttonIcon} />
              <Text style={styles.emergencyButtonText}>Emergency Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleAlternateRoute}
              style={[styles.alternateButton, { backgroundColor: theme?.colors?.primary || '#3b82f6' }]}
            >
              <Navigation size={16} color="#ffffff" style={styles.buttonIcon} />
              <Text style={styles.alternateButtonText}>Alternate Route</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Notice */}
          <View style={[styles.bottomNotice, { borderTopColor: theme?.colors?.border || '#e2e8f0' }]}>
            <View style={styles.noticeContent}>
              <Clock size={12} color={warningData.riskLevel === 'high' ? '#dc2626' : theme?.colors?.mutedForeground || '#64748b'} />
              <Text style={[
                styles.noticeText, 
                { 
                  color: warningData.riskLevel === 'high' 
                    ? (isDark ? '#f87171' : '#dc2626') 
                    : theme?.colors?.mutedForeground || '#64748b' 
                }
              ]}>
                Updated in real-time • Stay alert
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    width: width - 32,
    maxWidth: 400,
    borderWidth: 2,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 24,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  headerIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  content: {
    padding: 16,
    maxHeight: 400,
  },
  section: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  zoneName: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  distanceTime: {
    fontSize: 14,
    marginLeft: 8,
  },
  descriptionBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  recommendationsList: {
    paddingLeft: 4,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bullet: {
    marginRight: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  recommendationText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 18,
  },
  contactsList: {
    paddingLeft: 4,
  },
  contactText: {
    fontSize: 14,
    marginBottom: 4,
  },
  actions: {
    padding: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
  },
  emergencyButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alternateButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  emergencyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  alternateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomNotice: {
    padding: 12,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  noticeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noticeText: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default GeoFenceWarning;