import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Picker } from '@react-native-picker/picker';
import { useThemeContext } from '../../contexts/ThemeContext';

type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ route, navigation }: SettingsScreenProps) {
  const { userData } = route.params;
  
  // Use your existing theme context
  const { theme, toggleTheme } = useThemeContext();
  const isDark = theme === 'dark';
  
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

  // Define theme colors based on current theme
  const colors = {
    background: isDark ? '#0A0B0E' : '#FFFFFF',
    surface: isDark ? '#1A1B1E' : '#F8FAFC',
    surfaceVariant: isDark ? '#2A2B2E' : '#F1F5F9',
    primary: '#3B82F6',
    primaryLight: '#60A5FA',
    text: isDark ? '#F8FAFC' : '#1E293B',
    textSecondary: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? '#334155' : '#E2E8F0',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    muted: isDark ? '#374151' : '#F1F5F9',
  };

  const updateSetting = (key: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
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
    Alert.alert('Success', `Switched to ${isDark ? 'light' : 'dark'} mode`);
  };

  const handleEditProfile = () => {
    Alert.alert('Profile', 'Profile editing will be available in the full version');
  };

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ্' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' }
  ];

  const settingSections = [
    {
      title: 'Language & Region',
      icon: 'globe-outline',
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
      icon: 'shield-checkmark-outline',
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
      icon: 'notifications-outline',
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
      icon: 'settings-outline',
      items: [
        {
          id: 'theme',
          label: `Switch to ${isDark ? 'Light' : 'Dark'} Mode`,
          description: `Currently using ${isDark ? 'dark' : 'light'} theme`,
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

  const renderHeader = () => (
    <View style={[styles.header, { 
      backgroundColor: colors.surface, 
      borderBottomColor: colors.border 
    }]}>
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.background }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Manage your safety preferences
          </Text>
        </View>
      </View>
    </View>
  );

  const renderProfileSection = () => (
    <View style={[styles.profileSection, { 
      backgroundColor: colors.surface, 
      borderColor: colors.border 
    }]}>
      <View style={[styles.profileIcon, { backgroundColor: colors.primary }]}>
        <Ionicons name="person" size={24} color="#FFFFFF" />
      </View>
      <View style={styles.profileInfo}>
        <Text style={[styles.profileTitle, { color: colors.text }]}>Profile & Account</Text>
        <Text style={[styles.profileSubtitle, { color: colors.textSecondary }]}>
          {userData.fullName}
        </Text>
      </View>
      <TouchableOpacity 
        style={[styles.editButton, { borderColor: colors.border }]}
        onPress={handleEditProfile}
      >
        <Text style={[styles.editButtonText, { color: colors.text }]}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLanguagePicker = (item: any) => (
    <View style={[styles.pickerContainer, { 
      backgroundColor: colors.background, 
      borderColor: colors.border 
    }]}>
      <Picker
        selectedValue={item.value as string}
        style={[styles.picker, { color: colors.text }]}
        onValueChange={(value) => updateSetting(item.id, value)}
        dropdownIconColor={colors.textSecondary}
      >
        {item.options?.map((option: any) => (
          <Picker.Item 
            key={option.code} 
            label={`${option.native} (${option.name})`} 
            value={option.code}
            color={colors.text}
          />
        ))}
      </Picker>
    </View>
  );

  const renderSettingItem = (item: any, isLast: boolean) => (
    <View key={item.id}>
      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <View style={styles.settingLabelContainer}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>{item.label}</Text>
            {item.id === 'emergencyAlerts' && (
              <View style={[styles.criticalBadge, { backgroundColor: colors.error }]}>
                <Text style={styles.criticalBadgeText}>Critical</Text>
              </View>
            )}
          </View>
          <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
            {item.description}
          </Text>
        </View>

        <View style={styles.settingControl}>
          {item.type === 'theme-toggle' ? (
            <TouchableOpacity
              style={[styles.themeButton, { 
                borderColor: colors.border,
                backgroundColor: isDark ? colors.surfaceVariant : colors.background
              }]}
              onPress={handleThemeToggle}
            >
              <Ionicons 
                name={isDark ? "sunny" : "moon"} 
                size={16} 
                color={isDark ? "#FCD34D" : "#60A5FA"}
                style={styles.themeIcon}
              />
              <Text style={[styles.themeButtonText, { color: colors.text }]}>
                {isDark ? 'Light' : 'Dark'}
              </Text>
            </TouchableOpacity>
          ) : item.type === 'toggle' ? (
            <Switch
              value={item.value as boolean}
              onValueChange={(value) => updateSetting(item.id, value)}
              trackColor={{ 
                false: colors.muted, 
                true: colors.primary + (isDark ? '80' : '50')
              }}
              thumbColor={item.value ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#F3F4F6')}
              ios_backgroundColor={colors.muted}
            />
          ) : item.type === 'select' && item.options ? (
            renderLanguagePicker(item)
          ) : null}
        </View>
      </View>
      {!isLast && <View style={[styles.settingDivider, { backgroundColor: colors.border }]} />}
    </View>
  );

  const renderSettingSection = (section: any) => (
    <View 
      key={section.title}
      style={[styles.settingSection, { 
        backgroundColor: colors.surface, 
        borderColor: colors.border 
      }]}
    >
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: colors.primary }]}>
          <Ionicons name={section.icon as any} size={20} color="#FFFFFF" />
        </View>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
      </View>

      <View style={styles.sectionContent}>
        {section.items.map((item: any, itemIndex: number) => 
          renderSettingItem(item, itemIndex === section.items.length - 1)
        )}
      </View>
    </View>
  );

  const renderEmergencyContacts = () => (
    <View style={[styles.emergencySection, { 
      backgroundColor: colors.surface, 
      borderColor: colors.border 
    }]}>
      <View style={styles.sectionHeader}>
        <View style={[styles.emergencyIcon, { backgroundColor: colors.error }]}>
          <Ionicons name="call" size={16} color="#FFFFFF" />
        </View>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Emergency Contacts</Text>
      </View>

      <View style={styles.emergencyContent}>
        <View style={[styles.emergencyContact, { 
          backgroundColor: colors.error + (isDark ? '20' : '10'), 
          borderColor: colors.error + (isDark ? '40' : '30') 
        }]}>
          <View style={styles.contactInfo}>
            <Text style={[styles.contactTitle, { color: colors.error }]}>Tourist Helpline</Text>
            <Text style={[styles.contactNumber, { color: colors.error + 'CC' }]}>
              1363 (24/7 Support)
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.callButton, { backgroundColor: colors.error }]}
            onPress={() => navigation.navigate('EmergencyCall', { userData })}
          >
            <Ionicons name="call" size={16} color="#FFFFFF" />
            <Text style={styles.callButtonText}>Call</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.emergencyContact, { 
          backgroundColor: colors.warning + (isDark ? '20' : '10'), 
          borderColor: colors.warning + (isDark ? '40' : '30') 
        }]}>
          <View style={styles.contactInfo}>
            <Text style={[styles.contactTitle, { color: colors.warning }]}>Police Emergency</Text>
            <Text style={[styles.contactNumber, { color: colors.warning + 'CC' }]}>
              100 (Police)
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.callButtonOutline, { borderColor: colors.warning + '60' }]}
            onPress={() => navigation.navigate('EmergencyCall', { userData })}
          >
            <Ionicons name="call" size={16} color={colors.warning} />
            <Text style={[styles.callButtonOutlineText, { color: colors.warning }]}>Call</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.addContactButton, { borderColor: colors.border }]}
          onPress={() => Alert.alert('Info', 'Contact management will be available in full version')}
        >
          <Text style={[styles.addContactText, { color: colors.text }]}>
            Add Personal Emergency Contact
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLegalSection = () => (
    <View style={[styles.legalSection, { 
      backgroundColor: colors.surface, 
      borderColor: colors.border 
    }]}>
      <TouchableOpacity 
        style={styles.legalItem}
        onPress={() => Alert.alert('Info', 'Privacy policy will open in full version')}
      >
        <Ionicons name="lock-closed" size={16} color={colors.text} />
        <Text style={[styles.legalText, { color: colors.text }]}>Privacy Policy</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.legalItem}
        onPress={() => Alert.alert('Info', 'Terms of service will open in full version')}
      >
        <Ionicons name="shield-checkmark" size={16} color={colors.text} />
        <Text style={[styles.legalText, { color: colors.text }]}>Terms of Service</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.legalItem}
        onPress={() => Alert.alert('Info', 'Support contact will be available in full version')}
      >
        <Ionicons name="mail" size={16} color={colors.text} />
        <Text style={[styles.legalText, { color: colors.text }]}>Contact Support</Text>
      </TouchableOpacity>
      
      <View style={[styles.legalDivider, { backgroundColor: colors.border }]} />
      
      <View style={styles.versionInfo}>
        <Text style={[styles.versionText, { color: colors.textSecondary }]}>
          Smart Tourist Safety App v2.1.0
        </Text>
        <Text style={[styles.versionText, { color: colors.textSecondary }]}>
          Government of India • Ministry of Tourism
        </Text>
      </View>
    </View>
  );

  const renderDataProtectionNotice = () => (
    <View style={[styles.dataProtectionNotice, { 
      backgroundColor: colors.muted, 
      borderColor: colors.border 
    }]}>
      <View style={styles.dataProtectionContent}>
        <Ionicons name="shield-checkmark" size={20} color={colors.primary} style={styles.dataProtectionIcon} />
        <View style={styles.dataProtectionText}>
          <Text style={[styles.dataProtectionTitle, { color: colors.text }]}>
            Data Protection Notice
          </Text>
          <Text style={[styles.dataProtectionDescription, { color: colors.textSecondary }]}>
            Your location and safety data is encrypted and used only for emergency response and improving tourist safety. Data is stored locally and shared only when necessary for your protection.
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background} 
      />
      
      {renderHeader()}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {renderProfileSection()}
          {settingSections.map(renderSettingSection)}
          {renderEmergencyContacts()}
          {renderLegalSection()}
          {renderDataProtectionNotice()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  profileSection: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  profileSubtitle: {
    fontSize: 14,
  },
  editButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingSection: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionContent: {
    gap: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  criticalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  criticalBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  settingControl: {
    alignItems: 'flex-end',
  },
  settingDivider: {
    height: 1,
    marginVertical: 16,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  themeIcon: {
    marginRight: 8,
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    minWidth: 120,
    height: 40,
    justifyContent: 'center',
  },
  picker: {
    height: 40,
    minWidth: 120,
  },
  emergencySection: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  emergencyIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emergencyContent: {
    gap: 12,
  },
  emergencyContact: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactNumber: {
    fontSize: 14,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  callButtonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  callButtonOutlineText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  addContactButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  addContactText: {
    fontSize: 14,
    fontWeight: '500',
  },
  legalSection: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 0,
    overflow: 'hidden',
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  legalText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  legalDivider: {
    height: 1,
    marginVertical: 16,
  },
  versionInfo: {
    alignItems: 'center',
    padding: 16,
    gap: 4,
  },
  versionText: {
    fontSize: 12,
  },
  dataProtectionNotice: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  dataProtectionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dataProtectionIcon: {
    marginTop: 4,
    marginRight: 12,
  },
  dataProtectionText: {
    flex: 1,
  },
  dataProtectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  dataProtectionDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
});