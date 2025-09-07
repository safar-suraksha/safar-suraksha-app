"use client"

import React, { useState } from "react"
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert, Animated } from "react-native"
import { useTheme } from "../../providers/ThemeProvider"
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
  Send,
} from "lucide-react-native"

interface ReportIssueScreenProps {
  userData: any
  onNavigateBack: () => void
}

export function ReportIssueScreen({ userData, onNavigateBack }: ReportIssueScreenProps) {
  const { colors } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitAnimation] = useState(new Animated.Value(0))

  const categories = [
    {
      id: "safety",
      name: "Safety Concern",
      icon: Shield,
      color: "#ef4444",
      description: "Unsafe conditions, harassment, theft",
    },
    {
      id: "traffic",
      name: "Traffic Issue",
      icon: Truck,
      color: "#f59e0b",
      description: "Traffic violations, road hazards",
    },
    {
      id: "crowding",
      name: "Overcrowding",
      icon: Users,
      color: "#f97316",
      description: "Dangerous crowd situations",
    },
    {
      id: "infrastructure",
      name: "Infrastructure",
      icon: Home,
      color: "#3b82f6",
      description: "Broken facilities, poor lighting",
    },
    {
      id: "emergency",
      name: "Emergency",
      icon: AlertTriangle,
      color: "#8b5cf6",
      description: "Immediate danger, medical emergency",
    },
    {
      id: "other",
      name: "Other",
      icon: Zap,
      color: "#6b7280",
      description: "Any other safety related concern",
    },
  ]

  const handleSubmit = async () => {
    if (!selectedCategory || !description.trim()) {
      Alert.alert("Error", "Please select a category and provide description")
      return
    }

    setIsSubmitting(true)

    // Animate submission
    Animated.timing(submitAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start()

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      Alert.alert("Success", "Report submitted successfully!")

      // Auto close after success
      setTimeout(() => {
        onNavigateBack()
      }, 3000)
    }, 2000)
  }

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
      alignItems: "center",
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
    spacer: {
      width: 36,
    },
    content: {
      padding: 16,
    },
    locationCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
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
      fontWeight: "600",
      color: colors.foreground,
    },
    locationSubtitle: {
      fontSize: 14,
      color: colors.foreground + "80",
    },
    statusDot: {
      width: 12,
      height: 12,
      backgroundColor: "#10b981",
      borderRadius: 6,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.foreground,
      marginBottom: 16,
    },
    categoryButton: {
      backgroundColor: colors.card,
      borderWidth: 2,
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    categoryIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    categoryContent: {
      flex: 1,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.foreground,
    },
    categoryDescription: {
      fontSize: 14,
      color: colors.foreground + "80",
    },
    selectedIndicator: {
      width: 20,
      height: 20,
      backgroundColor: colors.primary,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 16,
    },
    textArea: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      minHeight: 120,
      textAlignVertical: "top",
      color: colors.foreground,
      fontSize: 16,
    },
    characterCount: {
      textAlign: "right",
      fontSize: 12,
      color: colors.foreground + "80",
      marginTop: 8,
    },
    mediaGrid: {
      flexDirection: "row",
      gap: 12,
    },
    mediaButton: {
      flex: 1,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 24,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 100,
    },
    mediaButtonText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.foreground,
      textAlign: "center",
      marginTop: 8,
    },
    submitButton: {
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 56,
      marginBottom: 16,
    },
    submitButtonText: {
      fontSize: 18,
      fontWeight: "600",
    },
    disclaimer: {
      fontSize: 12,
      color: colors.foreground + "80",
      textAlign: "center",
      lineHeight: 18,
    },
    successContainer: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },
    successIcon: {
      width: 96,
      height: 96,
      backgroundColor: "#10b981",
      borderRadius: 48,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
    },
    successTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.foreground,
      marginBottom: 24,
    },
    successCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      padding: 24,
      width: "100%",
      marginBottom: 24,
    },
    successMessage: {
      fontSize: 18,
      color: colors.foreground,
      marginBottom: 16,
    },
    successDetail: {
      fontSize: 14,
      color: colors.foreground + "80",
      marginBottom: 8,
    },
    successDetailLabel: {
      fontWeight: "600",
      color: colors.foreground,
    },
    successFooter: {
      fontSize: 14,
      color: colors.foreground + "80",
      textAlign: "center",
      lineHeight: 20,
    },
  })

  if (isSubmitted) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <CheckCircle size={48} color="white" />
        </View>

        <Text style={styles.successTitle}>Report Submitted!</Text>

        <View style={styles.successCard}>
          <Text style={styles.successMessage}>Your safety report has been received</Text>
          <Text style={styles.successDetail}>
            <Text style={styles.successDetailLabel}>Report ID:</Text> SR-{Date.now().toString().slice(-6)}
          </Text>
          <Text style={styles.successDetail}>
            <Text style={styles.successDetailLabel}>Status:</Text> Under Review
          </Text>
          <Text style={styles.successDetail}>
            <Text style={styles.successDetailLabel}>Expected Response:</Text> Within 15 minutes
          </Text>
        </View>

        <Text style={styles.successFooter}>
          Thank you for helping keep our community safe!{"\n"}
          You&apos;ll receive updates via SMS and app notifications.
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onNavigateBack}>
          <ArrowLeft size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Report Issue</Text>
          <Text style={styles.headerSubtitle}>Help us keep everyone safe</Text>
        </View>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
          const IconComponent = category.icon
          const isSelected = selectedCategory === category.id

          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                {
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setSelectedCategory(category.id)}
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
                  <CheckCircle size={12} color="white" />
                </View>
              )}
            </TouchableOpacity>
          )
        })}

        {/* Description */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Describe the issue</Text>

        <TextInput
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
          placeholder="Please provide as much detail as possible. Include what happened, when it occurred, and any immediate safety concerns..."
          placeholderTextColor={colors.foreground + "60"}
          multiline
          maxLength={500}
        />
        <Text style={styles.characterCount}>{description.length}/500 characters</Text>

        {/* Media Upload */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Add evidence (optional)</Text>

        <View style={styles.mediaGrid}>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => Alert.alert("Info", "Camera feature will be available in full version")}
          >
            <Camera size={32} color={colors.foreground} />
            <Text style={styles.mediaButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => Alert.alert("Info", "Gallery feature will be available in full version")}
          >
            <Image size={32} color={colors.foreground} />
            <Text style={styles.mediaButtonText}>From Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              backgroundColor: selectedCategory && description.trim() ? colors.primary : colors.foreground + "50",
              marginTop: 24,
            },
          ]}
          onPress={handleSubmit}
          disabled={!selectedCategory || !description.trim() || isSubmitting}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {isSubmitting ? (
              <>
                <Animated.View
                  style={{
                    width: 20,
                    height: 20,
                    borderWidth: 2,
                    borderColor: "white",
                    borderTopColor: "transparent",
                    borderRadius: 10,
                    marginRight: 8,
                    transform: [
                      {
                        rotate: submitAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0deg", "360deg"],
                        }),
                      },
                    ],
                  }}
                />
                <Text style={[styles.submitButtonText, { color: "white" }]}>Submitting Report...</Text>
              </>
            ) : (
              <>
                <Send size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={[styles.submitButtonText, { color: "white" }]}>Submit Report</Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Your report will be reviewed immediately by local authorities and tourist safety officials. False reports may
          result in penalties.
        </Text>
      </ScrollView>
    </View>
  )
}
