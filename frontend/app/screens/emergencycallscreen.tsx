"use client"

import React, { useState, useEffect, useRef } from "react"
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

interface EmergencyCallScreenProps {
  userData: any
  onBack: () => void
  onChatSupport: () => void
  onReportIssue: () => void
}

export function EmergencyCallScreen({ userData, onBack, onChatSupport, onReportIssue }: EmergencyCallScreenProps) {
  const [activeCall, setActiveCall] = useState<string | null>(null)
  const [callDuration, setCallDuration] = useState(0)
  const pulseAnim = useRef(new Animated.Value(1)).current
  const rotateAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (activeCall) {
        //@ts-ignore
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeCall])

  useEffect(() => {
    // Pulse animation for online indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // Rotate animation for call button
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ).start()
  }, [pulseAnim, rotateAnim])

  const emergencyContacts = [
    {
      id: "tourist-helpline",
      name: "Tourist Helpline",
      number: "1363",
      description: "24/7 Tourist Emergency Support",
      type: "primary",
      icon: "🛡️",
      color: "#3B82F6",
      available: true,
    },
    {
      id: "police",
      name: "Police Emergency",
      number: "100",
      description: "Police Emergency Services",
      type: "emergency",
      icon: "⚠️",
      color: "#EF4444",
      available: true,
    },
    {
      id: "medical",
      name: "Medical Emergency",
      number: "108",
      description: "Ambulance & Medical Support",
      type: "medical",
      icon: "📞",
      color: "#10B981",
      available: true,
    },
    {
      id: "fire",
      name: "Fire Department",
      number: "101",
      description: "Fire & Rescue Services",
      type: "fire",
      icon: "⚠️",
      color: "#F97316",
      available: true,
    },
  ]

  const handleCall = (contact: (typeof emergencyContacts)[0]) => {
    setActiveCall(contact.id)
    setCallDuration(0)
    Alert.alert("Calling", `Calling ${contact.name} at ${contact.number}...`)

    // Simulate call duration then end
    setTimeout(() => {
      setActiveCall(null)
      setCallDuration(0)
    }, 5000)
  }

  const handleEndCall = () => {
    setActiveCall(null)
    setCallDuration(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // If there's an active call, show call interface
  if (activeCall) {
    const currentContact = emergencyContacts.find((c) => c.id === activeCall)

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.callContainer}>
          <View style={[styles.callBackground, { backgroundColor: currentContact?.color }]}>
            <View style={styles.callContent}>
              <View style={styles.callContactInfo}>
                <View style={styles.callAvatar}>
                  <Text style={styles.callIcon}>{currentContact?.icon}</Text>
                </View>
                <Text style={styles.callName}>{currentContact?.name}</Text>
                <Text style={styles.callNumber}>{currentContact?.number}</Text>
                <Text style={styles.callDescription}>{currentContact?.description}</Text>
              </View>

              <View style={styles.callTimer}>
                <Text style={styles.callDuration}>{formatTime(callDuration)}</Text>
                <View style={styles.callStatus}>
                  <Animated.View style={[styles.callIndicator, { transform: [{ scale: pulseAnim }] }]} />
                  <Text style={styles.callStatusText}>Connected</Text>
                </View>
              </View>

              <TouchableOpacity onPress={handleEndCall} style={styles.endCallButton}>
                <Animated.View
                  style={{
                    transform: [
                      {
                        rotate: rotateAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0deg", "180deg"],
                        }),
                      },
                    ],
                  }}
                >
                  <Text style={styles.endCallIcon}>📞</Text>
                </Animated.View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.callFooter}>
            <View style={styles.locationShared}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText}>Location shared with emergency services</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Emergency Call</Text>
          <Text style={styles.headerSubtitle}>Quick access to emergency services</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.statusTitle}>Your Location</Text>
            <Animated.View style={[styles.statusIndicator, { transform: [{ scale: pulseAnim }] }]} />
          </View>
          <Text style={styles.locationValue}>{userData.currentLocation}</Text>
          <Text style={styles.locationNote}>Location will be automatically shared during emergency calls</Text>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>

          <View style={styles.contactsList}>
            {emergencyContacts.map((contact) => (
              <View key={contact.id} style={styles.contactCard}>
                <View style={styles.contactInfo}>
                  <View style={[styles.contactIcon, { backgroundColor: contact.color }]}>
                    <Text style={styles.contactIconText}>{contact.icon}</Text>
                  </View>
                  <View style={styles.contactDetails}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactDescription}>{contact.description}</Text>
                    <View style={styles.contactNumber}>
                      <Text style={styles.phoneIcon}>📞</Text>
                      <Text style={styles.contactNumberText}>{contact.number}</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => handleCall(contact)}
                  style={[styles.callButton, { backgroundColor: contact.color }]}
                >
                  <Text style={styles.callButtonIcon}>📞</Text>
                  <Text style={styles.callButtonText}>Call</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.actionsGrid}>
            <TouchableOpacity onPress={onChatSupport} style={styles.actionButton}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionText}>Chat Support</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onReportIssue} style={styles.actionButtonSecondary}>
              <Text style={styles.actionIcon}>⚠️</Text>
              <Text style={styles.actionText}>Report Issue</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Important Notice */}
        <View style={styles.noticeCard}>
          <View style={styles.noticeHeader}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <View style={styles.noticeContent}>
              <Text style={styles.noticeTitle}>Emergency Call Guidelines</Text>
              <View style={styles.noticeList}>
                <Text style={styles.noticeItem}>• Only call if you're in immediate danger or need urgent help</Text>
                <Text style={styles.noticeItem}>• Stay calm and speak clearly when connected</Text>
                <Text style={styles.noticeItem}>• Provide your exact location if different from GPS</Text>
                <Text style={styles.noticeItem}>• Keep your phone charged and accessible</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Tourist Safety Helpdesk</Text>
          <View style={styles.infoDetails}>
            <View style={styles.infoItem}>
              <Text style={styles.clockIcon}>🕐</Text>
              <Text style={styles.infoText}>Available 24/7 in multiple languages</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.usersIcon}>👥</Text>
              <Text style={styles.infoText}>Trained emergency response team</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 8,
  },
  backIcon: {
    fontSize: 20,
    color: "#374151",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statusCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    backgroundColor: "#10B981",
    borderRadius: 6,
  },
  locationValue: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 8,
  },
  locationNote: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 16,
  },
  contactsList: {
    gap: 12,
  },
  contactCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  contactIconText: {
    fontSize: 24,
    color: "#FFFFFF",
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  contactDescription: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  contactNumber: {
    flexDirection: "row",
    alignItems: "center",
  },
  phoneIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  contactNumberText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  callButtonIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  actionsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#3B82F6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: "#F59E0B",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  noticeCard: {
    backgroundColor: "rgba(239, 68, 68, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  noticeHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DC2626",
    marginBottom: 8,
  },
  noticeList: {
    gap: 4,
  },
  noticeItem: {
    fontSize: 12,
    color: "#DC2626",
  },
  infoCard: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  infoDetails: {
    gap: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  clockIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  usersIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  // Call Interface Styles
  callContainer: {
    flex: 1,
  },
  callBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  callContent: {
    alignItems: "center",
    padding: 32,
  },
  callContactInfo: {
    alignItems: "center",
    marginBottom: 32,
  },
  callAvatar: {
    width: 96,
    height: 96,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  callIcon: {
    fontSize: 48,
    color: "#FFFFFF",
  },
  callName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  callNumber: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  callDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.75)",
  },
  callTimer: {
    alignItems: "center",
    marginBottom: 32,
  },
  callDuration: {
    fontSize: 32,
    fontFamily: "monospace",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  callStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  callIndicator: {
    width: 8,
    height: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    marginRight: 8,
  },
  callStatusText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  endCallButton: {
    width: 80,
    height: 80,
    backgroundColor: "#DC2626",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  endCallIcon: {
    fontSize: 32,
    color: "#FFFFFF",
  },
  callFooter: {
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  locationShared: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  locationText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginLeft: 8,
  },
})
