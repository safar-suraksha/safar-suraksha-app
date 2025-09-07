"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, Dimensions, Clipboard } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

interface DigitalIDCardProps {
  userData: {
    fullName: string
    nationality: string
    currentLocation: string
    registrationDate: string
    safetyScore: number
    verificationLevel: "bronze" | "silver" | "gold"
    email: string
    phone: string
  }
  onBack: () => void
  onEmergencyCall: () => void
}

const { width } = Dimensions.get("window")

export function DigitalIDCard({ userData, onBack, onEmergencyCall }: DigitalIDCardProps) {
  const [showQR, setShowQR] = useState(false)
  const [copied, setCopied] = useState(false)

  // Animation refs
  const cardScale = useRef(new Animated.Value(0.8)).current
  const cardOpacity = useRef(new Animated.Value(0)).current
  const holographicAnim = useRef(new Animated.Value(0)).current
  const floatingAnim = useRef(new Animated.Value(0)).current
  const qrScale = useRef(new Animated.Value(0.8)).current
  const qrOpacity = useRef(new Animated.Value(0)).current
  const scanningAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    // Card entrance animation
    Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 1,
        tension: 80,
        friction: 12,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start()

    // Holographic background animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(holographicAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: false,
        }),
        Animated.timing(holographicAnim, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: false,
        }),
      ]),
    ).start()

    // Floating elements animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // QR scanning animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanningAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanningAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [])

  useEffect(() => {
    if (showQR) {
      Animated.parallel([
        Animated.spring(qrScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(qrOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(qrScale, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(qrOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [showQR])

  const getVerificationColor = (level: string) => {
    switch (level) {
      case "gold":
        return { text: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.2)" }
      case "silver":
        return { text: "#9CA3AF", bg: "rgba(156, 163, 175, 0.1)", border: "rgba(156, 163, 175, 0.2)" }
      case "bronze":
        return { text: "#EA580C", bg: "rgba(234, 88, 12, 0.1)", border: "rgba(234, 88, 12, 0.2)" }
      default:
        return { text: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.2)" }
    }
  }

  const getSafetyScoreColor = (score: number) => {
    if (score >= 80) return { text: "#10B981", bg: "rgba(16, 185, 129, 0.1)" }
    if (score >= 60) return { text: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" }
    return { text: "#EF4444", bg: "rgba(239, 68, 68, 0.1)" }
  }

  const generateQRCode = () => {
    return `https://tourist-safety.gov.in/verify/${userData.fullName.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}`
  }

  const copyToClipboard = async () => {
    try {
      await Clipboard.setString(generateQRCode())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Elements */}
      <View style={styles.backgroundContainer}>
        <Animated.View
          style={[
            styles.backgroundElement1,
            {
              transform: [
                {
                  rotate: holographicAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "90deg"],
                  }),
                },
              ],
              opacity: holographicAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.03, 0.08, 0.03],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.backgroundElement2,
            {
              transform: [
                {
                  rotate: holographicAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "-45deg"],
                  }),
                },
              ],
              opacity: holographicAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.02, 0.06, 0.02],
              }),
            },
          ]}
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Digital Tourist ID</Text>
          <View style={styles.headerSubtitle}>
            <Text style={styles.verifiedIcon}>✓</Text>
            <Text style={styles.headerSubtitleText}>Official Government Verification</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>↗</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>↓</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Premium ID Card */}
        <Animated.View
          style={[
            styles.idCard,
            {
              opacity: cardOpacity,
              transform: [{ scale: cardScale }],
            },
          ]}
        >
          {/* Holographic Background */}
          <View style={styles.cardBackground}>
            <Animated.View
              style={[
                styles.holographicOverlay,
                {
                  opacity: holographicAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.3, 0.6, 0.3],
                  }),
                },
              ]}
            />
          </View>

          {/* Background Pattern */}
          <View style={styles.backgroundPattern}>
            <Animated.View
              style={[
                styles.patternElement1,
                {
                  transform: [
                    {
                      scale: floatingAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.2],
                      }),
                    },
                    {
                      rotate: floatingAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "15deg"],
                      }),
                    },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.patternElement2,
                {
                  transform: [
                    {
                      scale: floatingAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.15],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>

          {/* Card Content */}
          <View style={styles.cardContent}>
            {/* Government Header */}
            <View style={styles.govHeader}>
              <View style={styles.govInfo}>
                <View style={styles.govIcon}>
                  <Text style={styles.shieldIcon}>🛡️</Text>
                </View>
                <View>
                  <Text style={styles.govTitle}>GOVERNMENT OF INDIA</Text>
                  <View style={styles.govSubtitle}>
                    <Text style={styles.crownIcon}>👑</Text>
                    <Text style={styles.govSubtitleText}>Ministry of Tourism</Text>
                  </View>
                </View>
              </View>
              <View style={styles.idNumber}>
                <Text style={styles.idLabel}>DIGITAL TOURIST ID</Text>
                <View style={styles.idBadge}>
                  <Text style={styles.idText}>#{Date.now().toString().slice(-6)}</Text>
                </View>
              </View>
            </View>

            {/* Profile Section */}
            <View style={styles.profileSection}>
              <View style={styles.profilePhoto}>
                <Text style={styles.userIcon}>👤</Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedIcon}>✓</Text>
                </View>
                <View style={styles.crownBadge}>
                  <Text style={styles.crownIcon}>👑</Text>
                </View>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userData.fullName}</Text>
                <View style={styles.nationality}>
                  <Text style={styles.globeIcon}>🌍</Text>
                  <Text style={styles.nationalityText}>{userData.nationality} Citizen</Text>
                </View>
                <View style={styles.badges}>
                  <View style={styles.scoreBadge}>
                    <Text style={styles.zapIcon}>⚡</Text>
                    <Text style={styles.badgeText}>Safety Score: {userData.safetyScore}</Text>
                  </View>
                  <View style={styles.levelBadge}>
                    <Text style={styles.shieldIcon}>🛡️</Text>
                    <Text style={styles.badgeText}>{userData.verificationLevel.toUpperCase()}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Action Section */}
            <View style={styles.actionSection}>
              <View style={styles.verifiedBadgeContainer}>
                <Text style={styles.awardIcon}>🏆</Text>
                <Text style={styles.verifiedText}>VERIFIED TOURIST</Text>
              </View>
              <TouchableOpacity onPress={() => setShowQR(!showQR)} style={styles.qrButton}>
                <Text style={styles.qrIcon}>📱</Text>
                <Text style={styles.qrButtonText}>{showQR ? "Hide QR" : "Show QR"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* QR Code Section */}
        {showQR && (
          <Animated.View
            style={[
              styles.qrSection,
              {
                opacity: qrOpacity,
                transform: [{ scale: qrScale }],
              },
            ]}
          >
            <View style={styles.qrContainer}>
              <Animated.View
                style={[
                  styles.qrCode,
                  {
                    transform: [{ scale: scanningAnim }],
                  },
                ]}
              >
                {/* QR Code Pattern */}
                <View style={styles.qrPattern}>
                  {Array.from({ length: 144 }, (_, i) => (
                    <View
                      key={i}
                      style={[styles.qrPixel, { backgroundColor: Math.random() > 0.4 ? "#FFFFFF" : "#000000" }]}
                    />
                  ))}
                </View>

                {/* Corner markers */}
                <View style={[styles.qrCorner, styles.qrCornerTL]} />
                <View style={[styles.qrCorner, styles.qrCornerTR]} />
                <View style={[styles.qrCorner, styles.qrCornerBL]} />
              </Animated.View>
            </View>

            <View style={styles.qrInfo}>
              <View style={styles.qrTitle}>
                <Text style={styles.eyeIcon}>👁️</Text>
                <Text style={styles.qrTitleText}>Instant Verification</Text>
              </View>
              <Text style={styles.qrDescription}>
                Show this secure QR code to authorities and establishments for instant verification of your tourist
                status
              </Text>

              <TouchableOpacity onPress={copyToClipboard} style={styles.urlContainer}>
                <Text style={styles.urlText}>{generateQRCode()}</Text>
                <Text style={styles.copyIcon}>📋</Text>
              </TouchableOpacity>

              {copied && (
                <View style={styles.copiedFeedback}>
                  <Text style={styles.checkIcon}>✓</Text>
                  <Text style={styles.copiedText}>Verification URL copied to clipboard!</Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <Text style={styles.userIcon}>👤</Text>
            <Text style={styles.detailsTitle}>Personal Details</Text>
          </View>

          <View style={styles.detailsList}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📧</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{userData.email}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📞</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailValue}>{userData.phone}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📍</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Current Location</Text>
                <Text style={styles.detailValue}>{userData.currentLocation}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📅</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Registration Date</Text>
                <Text style={styles.detailValue}>{userData.registrationDate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Status Cards */}
        <View style={styles.statusGrid}>
          <View
            style={[
              styles.statusCard,
              {
                backgroundColor: getVerificationColor(userData.verificationLevel).bg,
                borderColor: getVerificationColor(userData.verificationLevel).border,
              },
            ]}
          >
            <View style={styles.statusHeader}>
              <Text style={styles.awardIcon}>🏆</Text>
              <Text style={[styles.statusLabel, { color: getVerificationColor(userData.verificationLevel).text }]}>
                Verification
              </Text>
            </View>
            <Text style={[styles.statusValue, { color: getVerificationColor(userData.verificationLevel).text }]}>
              {userData.verificationLevel.charAt(0).toUpperCase() + userData.verificationLevel.slice(1)}
            </Text>
            <Text style={styles.statusSubtext}>Trusted Tourist</Text>
          </View>

          <View
            style={[
              styles.statusCard,
              {
                backgroundColor: getSafetyScoreColor(userData.safetyScore).bg,
              },
            ]}
          >
            <View style={styles.statusHeader}>
              <Text style={styles.shieldIcon}>🛡️</Text>
              <Text style={[styles.statusLabel, { color: getSafetyScoreColor(userData.safetyScore).text }]}>
                Safety Score
              </Text>
            </View>
            <Text style={[styles.statusValue, { color: getSafetyScoreColor(userData.safetyScore).text }]}>
              {userData.safetyScore}/100
            </Text>
            <Text style={styles.statusSubtext}>Current Status</Text>
          </View>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <View style={styles.securityHeader}>
            <Text style={styles.shieldIcon}>🛡️</Text>
            <View>
              <View style={styles.securityTitleRow}>
                <Text style={styles.securityTitle}>Security Features</Text>
                <Text style={styles.sparklesIcon}>✨</Text>
              </View>
              <View style={styles.securityFeatures}>
                <Text style={styles.securityFeature}>• Blockchain-secured verification</Text>
                <Text style={styles.securityFeature}>• Real-time location tracking</Text>
                <Text style={styles.securityFeature}>• 24/7 emergency response</Text>
                <Text style={styles.securityFeature}>• Multi-language support</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Emergency Contact Button */}
        <TouchableOpacity onPress={onEmergencyCall} style={styles.emergencyButton}>
          <Text style={styles.phoneIcon}>📞</Text>
          <Text style={styles.emergencyButtonText}>Emergency Contact</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundElement1: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 384,
    height: 384,
    backgroundColor: "#3B82F6",
    borderRadius: 192,
    opacity: 0.03,
  },
  backgroundElement2: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 320,
    height: 320,
    backgroundColor: "#10B981",
    borderRadius: 160,
    opacity: 0.02,
  },
  header: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
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
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  verifiedIcon: {
    fontSize: 14,
    color: "#10B981",
    marginRight: 4,
  },
  headerSubtitleText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 8,
  },
  actionIcon: {
    fontSize: 18,
    color: "#374151",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  idCard: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 32,
    elevation: 20,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  cardBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#3B82F6",
  },
  holographicOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#9333EA",
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
  },
  patternElement1: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 160,
    height: 160,
    backgroundColor: "#FFFFFF",
    borderRadius: 80,
  },
  patternElement2: {
    position: "absolute",
    bottom: -64,
    left: -64,
    width: 128,
    height: 128,
    backgroundColor: "#FFFFFF",
    borderRadius: 64,
  },
  cardContent: {
    padding: 32,
    position: "relative",
    zIndex: 10,
  },
  govHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  govInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  govIcon: {
    width: 56,
    height: 56,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  shieldIcon: {
    fontSize: 24,
  },
  govTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  govSubtitle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  crownIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  govSubtitleText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  idNumber: {
    alignItems: "flex-end",
  },
  idLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    letterSpacing: 1,
  },
  idBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  idText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  profilePhoto: {
    width: 80,
    height: 96,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 24,
    position: "relative",
  },
  userIcon: {
    fontSize: 36,
    color: "#FFFFFF",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    backgroundColor: "#10B981",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  crownBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    backgroundColor: "#F59E0B",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  nationality: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  globeIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  nationalityText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  badges: {
    flexDirection: "row",
    gap: 12,
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  zapIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  actionSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  verifiedBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  awardIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  verifiedText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  qrButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  qrIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  qrButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  qrSection: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderWidth: 2,
    borderColor: "rgba(59, 130, 246, 0.2)",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    marginBottom: 32,
  },
  qrContainer: {
    marginBottom: 24,
  },
  qrCode: {
    width: 224,
    height: 224,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "rgba(59, 130, 246, 0.2)",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  qrPattern: {
    width: 192,
    height: 192,
    backgroundColor: "#000000",
    borderRadius: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
  },
  qrPixel: {
    width: 12,
    height: 12,
    margin: 0.5,
    borderRadius: 2,
  },
  qrCorner: {
    position: "absolute",
    width: 32,
    height: 32,
    borderWidth: 4,
    borderColor: "#000000",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  qrCornerTL: {
    top: 16,
    left: 16,
  },
  qrCornerTR: {
    top: 16,
    right: 16,
  },
  qrCornerBL: {
    bottom: 16,
    left: 16,
  },
  qrInfo: {
    alignItems: "center",
  },
  qrTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  eyeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  qrTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
  },
  qrDescription: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  urlContainer: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  urlText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "monospace",
    flex: 1,
  },
  copyIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  copiedFeedback: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkIcon: {
    fontSize: 16,
    color: "#10B981",
    marginRight: 8,
  },
  copiedText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#10B981",
  },
  detailsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  detailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 8,
  },
  detailsList: {
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  detailValue: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  statusGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statusCard: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statusSubtext: {
    fontSize: 12,
    color: "#9CA3AF",
    opacity: 0.8,
  },
  securityNotice: {
    backgroundColor: "rgba(59, 130, 246, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  securityHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  securityTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E40AF",
    marginRight: 4,
  },
  sparklesIcon: {
    fontSize: 12,
    color: "#3B82F6",
  },
  securityFeatures: {
    gap: 2,
  },
  securityFeature: {
    fontSize: 12,
    color: "#2563EB",
  },
  emergencyButton: {
    backgroundColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  phoneIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  emergencyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
})
