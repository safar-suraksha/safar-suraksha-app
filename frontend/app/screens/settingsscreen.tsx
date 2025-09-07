"use client"

import React, { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch, Alert } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { useTheme } from "../../providers/ThemeProvider"
import { ArrowLeft, Globe, Shield, Bell, Settings, Phone, Lock, Mail, User, Sun, Moon } from "lucide-react-native"

interface SettingsScreenProps {
  onNavigateBack: () => void
}

export function SettingsScreen({ onNavigateBack }: SettingsScreenProps) {
  const { colors, isDark, toggleTheme } = useTheme()
  const [settings, setSettings] = useState({
    language: "en",
    notifications: true,
    locationTracking: true,
    emergencyAlerts: true,
    soundAlerts: true,
    dataSharing: true,
    biometricAuth: false,
    autoBackup: true,
    offlineMode: false,
    batteryOptimization: true,
  })

  const updateSetting = (key: string, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))

    // Show alert for important settings
    if (key === "emergencyAlerts" && !value) {
      Alert.alert("Warning", "Emergency alerts disabled - This may affect your safety!")
    } else if (key === "locationTracking" && !value) {
      Alert.alert("Warning", "Location tracking disabled - Some safety features may not work")
    } else {
      Alert.alert("Success", "Setting updated successfully")
    }
  }

  const handleThemeToggle = () => {
    toggleTheme()
    Alert.alert("Success", `Switched to ${isDark ? "light" : "dark"} mode`)
  }

  const languages = [
    { code: "en", name: "English", native: "English" },
    { code: "hi", name: "Hindi", native: "हिन्दी" },
    { code: "bn", name: "Bengali", native: "বাংলা" },
    { code: "te", name: "Telugu", native: "తెలుగు" },
    { code: "mr", name: "Marathi", native: "मराठी" },
    { code: "ta", name: "Tamil", native: "தமிழ்" },
    { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
    { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
    { code: "ml", name: "Malayalam", native: "മലയാളം" },
    { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  ]

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
      flexDirection: "row",
      alignItems: "center",
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
      fontWeight: "600",
      color: colors.foreground,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.foreground + "80",
    },
    content: {
      padding: 16,
    },
    profileCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    profileIcon: {
      width: 48,
      height: 48,
      backgroundColor: colors.primary,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    profileContent: {
      flex: 1,
    },
    profileTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.foreground,
    },
    profileSubtitle: {
      fontSize: 14,
      color: colors.foreground + "80",
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
      fontWeight: "500",
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
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionIcon: {
      width: 40,
      height: 40,
      backgroundColor: colors.primary,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.foreground,
    },
    settingItem: {
      paddingVertical: 12,
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    settingContent: {
      flex: 1,
      marginRight: 16,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.foreground,
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: 14,
      color: colors.foreground + "80",
    },
    criticalBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      backgroundColor: "#ef4444",
      borderRadius: 8,
      marginLeft: 8,
    },
    criticalBadgeText: {
      fontSize: 12,
      fontWeight: "600",
      color: "white",
    },
    themeButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
    },
    themeButtonText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.foreground,
      marginLeft: 8,
    },
    picker: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      color: colors.foreground,
    },
    divider: {
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
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    emergencyIcon: {
      width: 32,
      height: 32,
      backgroundColor: "#ef4444",
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    emergencyTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.foreground,
    },
    emergencyItem: {
      backgroundColor: "#ef444410",
      borderWidth: 1,
      borderColor: "#ef444420",
      borderRadius: 8,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    emergencyItemContent: {
      flex: 1,
    },
    emergencyItemTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#dc2626",
    },
    emergencyItemSubtitle: {
      fontSize: 14,
      color: "#dc262680",
    },
    emergencyCallButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: "#ef4444",
      borderRadius: 8,
    },
    emergencyCallButtonText: {
      fontSize: 14,
      fontWeight: "500",
      color: "white",
      marginLeft: 4,
    },
    addContactButton: {
      width: "100%",
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      alignItems: "center",
    },
    addContactButtonText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.foreground,
    },
    legalButton: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      padding: 12,
      borderRadius: 8,
    },
    legalButtonText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.foreground,
      marginLeft: 12,
    },
    versionInfo: {
      alignItems: "center",
      paddingVertical: 16,
    },
    versionText: {
      fontSize: 12,
      color: colors.foreground + "80",
      marginBottom: 4,
    },
    dataProtectionCard: {
      backgroundColor: colors.muted,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    dataProtectionContent: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    dataProtectionText: {
      flex: 1,
      marginLeft: 12,
    },
    dataProtectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.foreground,
      marginBottom: 8,
    },
    dataProtectionDescription: {
      fontSize: 12,
      color: colors.foreground + "80",
      lineHeight: 18,
    },
  })

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onNavigateBack}>
          <ArrowLeft size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Manage your safety preferences</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.profileIcon}>
            <User size={24} color="white" />
          </View>
          <View style={styles.profileContent}>
            <Text style={styles.profileTitle}>Profile & Account</Text>
            <Text style={styles.profileSubtitle}>Manage your personal information</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => Alert.alert("Info", "Profile editing will be available in the full version")}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Language & Region */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Globe size={20} color="white" />
            </View>
            <Text style={styles.sectionTitle}>Language & Region</Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>App Language</Text>
                <Text style={styles.settingDescription}>Choose your preferred language</Text>
              </View>
              <Picker
                selectedValue={settings.language}
                style={[styles.picker, { width: 120 }]}
                onValueChange={(value) => updateSetting("language", value)}
              >
                {languages.map((lang) => (
                  <Picker.Item key={lang.code} label={`${lang.native} (${lang.name})`} value={lang.code} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Privacy & Security */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Shield size={20} color="white" />
            </View>
            <Text style={styles.sectionTitle}>Privacy & Security</Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Location Tracking</Text>
                <Text style={styles.settingDescription}>Allow real-time location monitoring for safety</Text>
              </View>
              <Switch
                value={settings.locationTracking}
                onValueChange={(value) => updateSetting("locationTracking", value)}
                trackColor={{ false: colors.muted, true: colors.primary }}
                thumbColor="white"
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Share Safety Data</Text>
                <Text style={styles.settingDescription}>Help improve tourist safety by sharing anonymous data</Text>
              </View>
              <Switch
                value={settings.dataSharing}
                onValueChange={(value) => updateSetting("dataSharing", value)}
                trackColor={{ false: colors.muted, true: colors.primary }}
                thumbColor="white"
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Biometric Authentication</Text>
                <Text style={styles.settingDescription}>Use fingerprint or face recognition for app access</Text>
              </View>
              <Switch
                value={settings.biometricAuth}
                onValueChange={(value) => updateSetting("biometricAuth", value)}
                trackColor={{ false: colors.muted, true: colors.primary }}
                thumbColor="white"
              />
            </View>
          </View>
        </View>

        {/* Notifications & Alerts */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Bell size={20} color="white" />
            </View>
            <Text style={styles.sectionTitle}>Notifications & Alerts</Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive safety updates and alerts</Text>
              </View>
              <Switch
                value={settings.notifications}
                onValueChange={(value) => updateSetting("notifications", value)}
                trackColor={{ false: colors.muted, true: colors.primary }}
                thumbColor="white"
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.settingLabel}>Emergency Alerts</Text>
                  <View style={styles.criticalBadge}>
                    <Text style={styles.criticalBadgeText}>Critical</Text>
                  </View>
                </View>
                <Text style={styles.settingDescription}>Critical safety warnings and government alerts</Text>
              </View>
              <Switch
                value={settings.emergencyAlerts}
                onValueChange={(value) => updateSetting("emergencyAlerts", value)}
                trackColor={{ false: colors.muted, true: colors.primary }}
                thumbColor="white"
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Sound Alerts</Text>
                <Text style={styles.settingDescription}>Play audio for danger zone warnings</Text>
              </View>
              <Switch
                value={settings.soundAlerts}
                onValueChange={(value) => updateSetting("soundAlerts", value)}
                trackColor={{ false: colors.muted, true: colors.primary }}
                thumbColor="white"
              />
            </View>
          </View>
        </View>

        {/* App Preferences */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Settings size={20} color="white" />
            </View>
            <Text style={styles.sectionTitle}>App Preferences</Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>{isDark ? "Light" : "Dark"} Mode</Text>
                <Text style={styles.settingDescription}>Switch to {isDark ? "light" : "dark"} theme</Text>
              </View>
              <TouchableOpacity style={styles.themeButton} onPress={handleThemeToggle}>
                {isDark ? <Sun size={16} color={colors.foreground} /> : <Moon size={16} color={colors.foreground} />}
                <Text style={styles.themeButtonText}>{isDark ? "Light" : "Dark"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Auto Backup</Text>
                <Text style={styles.settingDescription}>Automatically backup your safety data</Text>
              </View>
              <Switch
                value={settings.autoBackup}
                onValueChange={(value) => updateSetting("autoBackup", value)}
                trackColor={{ false: colors.muted, true: colors.primary }}
                thumbColor="white"
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Offline Mode</Text>
                <Text style={styles.settingDescription}>Download maps for offline access</Text>
              </View>
              <Switch
                value={settings.offlineMode}
                onValueChange={(value) => updateSetting("offlineMode", value)}
                trackColor={{ false: colors.muted, true: colors.primary }}
                thumbColor="white"
              />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Battery Optimization</Text>
                <Text style={styles.settingDescription}>Reduce power consumption when possible</Text>
              </View>
              <Switch
                value={settings.batteryOptimization}
                onValueChange={(value) => updateSetting("batteryOptimization", value)}
                trackColor={{ false: colors.muted, true: colors.primary }}
                thumbColor="white"
              />
            </View>
          </View>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <View style={styles.emergencyIcon}>
              <Phone size={16} color="white" />
            </View>
            <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
          </View>

          <View style={styles.emergencyItem}>
            <View style={styles.emergencyItemContent}>
              <Text style={styles.emergencyItemTitle}>Tourist Helpline</Text>
              <Text style={styles.emergencyItemSubtitle}>1363 (24/7 Support)</Text>
            </View>
            <TouchableOpacity
              style={styles.emergencyCallButton}
              onPress={() => Alert.alert("Info", "Emergency call feature will be available in full version")}
            >
              <Phone size={16} color="white" />
              <Text style={styles.emergencyCallButtonText}>Call</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.emergencyItem, { backgroundColor: "#f5910010" }]}>
            <View style={styles.emergencyItemContent}>
              <Text style={[styles.emergencyItemTitle, { color: "#d97706" }]}>Police Emergency</Text>
              <Text style={[styles.emergencyItemSubtitle, { color: "#d9770680" }]}>100 (Police)</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.emergencyCallButton,
                { backgroundColor: "transparent", borderWidth: 1, borderColor: "#d9770640" },
              ]}
              onPress={() => Alert.alert("Info", "Emergency call feature will be available in full version")}
            >
              <Phone size={16} color="#d97706" />
              <Text style={[styles.emergencyCallButtonText, { color: "#d97706" }]}>Call</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.addContactButton}
            onPress={() => Alert.alert("Info", "Contact management will be available in full version")}
          >
            <Text style={styles.addContactButtonText}>Add Personal Emergency Contact</Text>
          </TouchableOpacity>
        </View>

        {/* Legal & Support */}
        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={styles.legalButton}
            onPress={() => Alert.alert("Info", "Privacy policy will open in full version")}
          >
            <Lock size={16} color={colors.foreground} />
            <Text style={styles.legalButtonText}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.legalButton}
            onPress={() => Alert.alert("Info", "Terms of service will open in full version")}
          >
            <Shield size={16} color={colors.foreground} />
            <Text style={styles.legalButtonText}>Terms of Service</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.legalButton}
            onPress={() => Alert.alert("Info", "Support contact will be available in full version")}
          >
            <Mail size={16} color={colors.foreground} />
            <Text style={styles.legalButtonText}>Contact Support</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

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
                Your location and safety data is encrypted and used only for emergency response and improving tourist
                safety. Data is stored locally and shared only when necessary for your protection.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
