import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from './ThemeProvider';
import {
  ArrowLeft,
  Globe,
  Shield,
  Bell,
  Settings,
  Phone,
  Lock,
  Mail,
  User,
  Sun,
  Moon
} from 'react-native-feather';

const { width } = Dimensions.get('window');

export function SettingsScreen() {
  const navigation = useNavigation();
  const { colors, isDark, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    language: 'en',
    notifications: true,
    locationTracking: true,
    emergencyAlerts: true,
    soundAlerts: true,
    dataSharing: true,
    biometricAuth: false,
    autoBackup: true,
    offlineMode: false,
    batteryOptimization: true
  });

  const updateSetting = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Show alert for important settings
    if (key === 'emergencyAlerts' && !value) {
      Alert.alert('Warning', 'Emergency alerts disabled - This may affect your safety!');
    } else if (key === 'locationTracking' && !value) {
      Alert.alert('Warning', 'Location tracking disabled - Some safety features may not work');
    } else {
      Alert.alert('Success', 'Setting updated successfully');
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
    Alert.alert('Theme Changed', `Switched to ${isDark ? 'light' : 'dark'} mode`);
  };

  const handleEditProfile = () => {
    Alert.alert('Coming Soon', 'Profile editing will be available in the full version');
  };

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' }
  ];

  const settingSections = [
    {
      title: 'Language & Region',
      icon: Globe,
      items: [
        {
          id: 'language',
          label: 'App Language',
          description: 'Choose your preferred language',
          type: 'select',
          value: settings.language,
          options: languages
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        {
          id: 'locationTracking',
          label: 'Location Tracking',
          description: 'Allow real-time location monitoring for safety',
          type: 'toggle',
          value: settings.locationTracking
        },
        {
          id: 'dataSharing',
          label: 'Share Safety Data',
          description: 'Help improve tourist safety by sharing anonymous data',
          type: 'toggle',
          value: settings.dataSharing
        },
        {
          id: 'biometricAuth',
          label: 'Biometric Authentication',
          description: 'Use fingerprint or face recognition for app access',
          type: 'toggle',
          value: settings.biometricAuth
        }
      ]
    },
    {
      title: 'Notifications & Alerts',
      icon: Bell,
      items: [
        {
          id: 'notifications',
          label: 'Push Notifications',
          description: 'Receive safety updates and alerts',
          type: 'toggle',
          value: settings.notifications
        },
        {
          id: 'emergencyAlerts',
          label: 'Emergency Alerts',
          description: 'Critical safety warnings and government alerts',
          type: 'toggle',
          value: settings.emergencyAlerts
        },
        {
          id: 'soundAlerts',
          label: 'Sound Alerts',
          description: 'Play audio for danger zone warnings',
          type: 'toggle',
          value: settings.soundAlerts
        }
      ]
    },
    {
      title: 'App Preferences',
      icon: Settings,
      items: [
        {
          id: 'theme',
          label: `${isDark ? 'Light' : 'Dark'} Mode`,
          description: `Switch to ${isDark ? 'light' : 'dark'} theme`,
          type: 'theme-toggle',
          value: isDark
        },
        {
          id: 'autoBackup',
          label: 'Auto Backup',
          description: 'Automatically backup your safety data',
          type: 'toggle',
          value: settings.autoBackup
        },
        {
          id: 'offlineMode',
          label: 'Offline Mode',
          description: 'Download maps for offline access',
          type: 'toggle',
          value: settings.offlineMode
        },
        {
          id: 'batteryOptimization',
          label: 'Battery Optimization',
          description: 'Reduce power consumption when possible',
          type: 'toggle',
          value: settings.batteryOptimization
        }
      ]
    }
  ];

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
    scrollContent: {
      padding: 16,
      paddingBottom: 32,
    },
    profileCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    profileIcon: {
      width: 48,
      height: 48,
      backgroundColor: colors.primary,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    profileContent: {
      flex: 1,
    },
    profileTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.cardForeground,
    },
    profileSubtitle: {
      fontSize: 14,
      color: colors.mutedForeground,
      marginTop: 2,
    },
    editButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
    },
    editButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.foreground,
    },
    sectionCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionIcon: {
      width: 40,
      height: 40,
      backgroundColor: colors.primary,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.cardForeground,
    },
    settingItem: {
      paddingVertical: 8,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    settingContent: {
      flex: 1,
      marginRight: 16,
    },
    settingLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.cardForeground,
      marginRight: 8,
    },
    criticalBadge: {
      backgroundColor: '#ef4444',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
    },
    criticalText: {
      color: '#fee2e2',
      fontSize: 12,
      fontWeight: '600',
    },
    settingDescription: {
      fontSize: 14,
      color: colors.mutedForeground,
    },
    themeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
    },
    themeButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.foreground,
      marginLeft: 8,
    },
    separator: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 16,
    },
    emergencyCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    emergencyHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    emergencyIcon: {
      width: 32,
      height: 32,
      backgroundColor: '#ef4444',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    emergencyTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.cardForeground,
    },
    emergencyItem: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(239, 68, 68, 0.2)',
      borderRadius: 8,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    emergencyContent: {
      flex: 1,
    },
    emergencyName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#dc2626',
    },
    emergencyNumber: {
      fontSize: 14,
      color: 'rgba(220, 38, 38, 0.8)',
      marginTop: 2,
    },
    callButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#ef4444',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },
    callButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '500',
      marginLeft: 4,
    },
    legalCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    legalButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
    },
    legalButtonText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.foreground,
      marginLeft: 12,
    },
    versionInfo: {
      alignItems: 'center',
      marginTop: 16,
    },
    versionText: {
      fontSize: 12,
      color: colors.mutedForeground,
      textAlign: 'center',
    },
    dataProtectionCard: {
      backgroundColor: colors.muted,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
    },
    dataProtectionContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    dataProtectionText: {
      marginLeft: 12,
      flex: 1,
    },
    dataProtectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.foreground,
      marginBottom: 8,
    },
    dataProtectionDescription: {
      fontSize: 12,
      color: colors.mutedForeground,
      lineHeight: 18,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Manage your safety preferences</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.profileIcon}>
            <User size={24} color={colors.primaryForeground} />
          </View>
          <View style={styles.profileContent}>
            <Text style={styles.profileTitle}>Profile & Account</Text>
            <Text style={styles.profileSubtitle}>Manage your personal information</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        {settingSections.map((section) => (
          <View key={section.title} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <section.icon size={20} color={colors.primaryForeground} />
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>

            {section.items.map((item, itemIndex) => (
              <View key={item.id}>
                <View style={styles.settingItem}>
                  <View style={styles.settingRow}>
                    <View style={styles.settingContent}>
                      <View style={styles.settingLabelRow}>
                        <Text style={styles.settingLabel}>{item.label}</Text>
                        {item.id === 'emergencyAlerts' && (
                          <View style={styles.criticalBadge}>
                            <Text style={styles.criticalText}>Critical</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.settingDescription}>{item.description}</Text>
                    </View>

                    <View>
                      {item.type === 'theme-toggle' ? (
                        <TouchableOpacity style={styles.themeButton} onPress={handleThemeToggle}>
                          {isDark ? (
                            <Sun size={16} color={colors.foreground} />
                          ) : (
                            <Moon size={16} color={colors.foreground} />
                          )}
                          <Text style={styles.themeButtonText}>
                            {isDark ? 'Light' : 'Dark'}
                          </Text>
                        </TouchableOpacity>
                      ) : item.type === 'toggle' ? (
                        <Switch
                          value={item.value as boolean}
                          onValueChange={(value) => updateSetting(item.id, value)}
                          trackColor={{ false: colors.muted, true: colors.primary }}
                          thumbColor="white"
                        />
                      ) : null}
                    </View>
                  </View>
                </View>
                {itemIndex < section.items.length - 1 && (
                  <View style={styles.separator} />
                )}
              </View>
            ))}
          </View>
        ))}

        {/* Emergency Contacts */}
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <View style={styles.emergencyIcon}>
              <Phone size={16} color="white" />
            </View>
            <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
          </View>

          <View style={styles.emergencyItem}>
            <View style={styles.emergencyContent}>
              <Text style={styles.emergencyName}>Tourist Helpline</Text>
              <Text style={styles.emergencyNumber}>1363 (24/7 Support)</Text>
            </View>
            <TouchableOpacity 
              style={styles.callButton}
              onPress={() => Alert.alert('Coming Soon', 'Emergency call feature will be available in full version')}
            >
              <Phone size={16} color="white" />
              <Text style={styles.callButtonText}>Call</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.emergencyItem, { backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.2)' }]}>
            <View style={styles.emergencyContent}>
              <Text style={[styles.emergencyName, { color: '#d97706' }]}>Police Emergency</Text>
              <Text style={[styles.emergencyNumber, { color: 'rgba(217, 119, 6, 0.8)' }]}>100 (Police)</Text>
            </View>
            <TouchableOpacity 
              style={[styles.callButton, { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.4)' }]}
              onPress={() => Alert.alert('Coming Soon', 'Emergency call feature will be available in full version')}
            >
              <Phone size={16} color="#d97706" />
              <Text style={[styles.callButtonText, { color: '#d97706' }]}>Call</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.legalButton, { borderWidth: 1, borderColor: colors.border, marginTop: 8 }]}
            onPress={() => Alert.alert('Coming Soon', 'Contact management will be available in full version')}
          >
            <Text style={styles.legalButtonText}>Add Personal Emergency Contact</Text>
          </TouchableOpacity>
        </View>

        {/* Legal & Support */}
        <View style={styles.legalCard}>
          <TouchableOpacity 
            style={styles.legalButton}
            onPress={() => Alert.alert('Coming Soon', 'Privacy policy will open in full version')}
          >
            <Lock size={16} color={colors.foreground} />
            <Text style={styles.legalButtonText}>Privacy Policy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.legalButton}
            onPress={() => Alert.alert('Coming Soon', 'Terms of service will open in full version')}
          >
            <Shield size={16} color={colors.foreground} />
            <Text style={styles.legalButtonText}>Terms of Service</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.legalButton}
            onPress={() => Alert.alert('Coming Soon', 'Support contact will be available in full version')}
          >
            <Mail size={16} color={colors.foreground} />
            <Text style={styles.legalButtonText}>Contact Support</Text>
          </TouchableOpacity>
          
          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>Smart Tourist Safety App v2.1.0</Text>
            <Text style={styles.versionText}>Government of India • Ministry of Tourism</Text>
          </View>
        </View>

        {/* Data Protection Notice */}
        <View style={styles.dataProtectionCard}>
          <View style={styles.dataProtectionContent}>
            <Shield size={20} color={colors.primary} />
            <View style={styles.dataProtectionText}>
              <Text style={styles.dataProtectionTitle}>Data Protection Notice</Text>
              <Text style={styles.dataProtectionDescription}>
                Your location and safety data is encrypted and used only for emergency response and improving tourist safety. Data is stored locally and shared only when necessary for your protection.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}