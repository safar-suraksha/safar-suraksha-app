import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';

type ReportIssueScreenProps = NativeStackScreenProps<RootStackParamList, 'ReportIssue'>;

export default function ReportIssueScreen({ route, navigation }: ReportIssueScreenProps) {
  const { userData } = route.params;
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitAnimation] = useState(new Animated.Value(0));

  const colors = {
    background: "#FFFFFF",
    card: "#F8FAFC",
    border: "#E2E8F0",
    foreground: "#1E293B",
    primary: "#3B82F6",
  };

  const categories = [
    {
      id: "safety",
      name: "Safety Concern",
      icon: "shield-checkmark",
      color: "#ef4444",
      description: "Unsafe conditions, harassment, theft",
    },
    {
      id: "traffic",
      name: "Traffic Issue",
      icon: "car",
      color: "#f59e0b",
      description: "Traffic violations, road hazards",
    },
    {
      id: "crowding",
      name: "Overcrowding",
      icon: "people",
      color: "#f97316",
      description: "Dangerous crowd situations",
    },
    {
      id: "infrastructure",
      name: "Infrastructure",
      icon: "home",
      color: "#3b82f6",
      description: "Broken facilities, poor lighting",
    },
    {
      id: "emergency",
      name: "Emergency",
      icon: "warning",
      color: "#8b5cf6",
      description: "Immediate danger, medical emergency",
    },
    {
      id: "other",
      name: "Other",
      icon: "flash",
      color: "#6b7280",
      description: "Any other safety related concern",
    },
  ];

  const handleSubmit = async () => {
    if (!selectedCategory || !description.trim()) {
      Alert.alert("Error", "Please select a category and provide description");
      return;
    }

    setIsSubmitting(true);

    // Animate submission
    Animated.timing(submitAnimation, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      Alert.alert("Success", "Report submitted successfully!");

      // Auto close after success
      setTimeout(() => {
        navigation.goBack();
      }, 3000);
    }, 2000);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (isSubmitted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={48} color="white" />
          </View>

          <Text style={[styles.successTitle, { color: colors.foreground }]}>Report Submitted!</Text>

          <View style={[styles.successCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.successMessage, { color: colors.foreground }]}>Your safety report has been received</Text>
            <Text style={[styles.successDetail, { color: colors.foreground + "80" }]}>
              <Text style={[styles.successDetailLabel, { color: colors.foreground }]}>Report ID:</Text> SR-{Date.now().toString().slice(-6)}
            </Text>
            <Text style={[styles.successDetail, { color: colors.foreground + "80" }]}>
              <Text style={[styles.successDetailLabel, { color: colors.foreground }]}>Status:</Text> Under Review
            </Text>
            <Text style={[styles.successDetail, { color: colors.foreground + "80" }]}>
              <Text style={[styles.successDetailLabel, { color: colors.foreground }]}>Expected Response:</Text> Within 15 minutes
            </Text>
          </View>

          <Text style={[styles.successFooter, { color: colors.foreground + "80" }]}>
            Thank you for helping keep our community safe!{"\n"}
            You&apos;ll receive updates via SMS and app notifications.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Report Issue</Text>
          <Text style={[styles.headerSubtitle, { color: colors.foreground + "80" }]}>Help us keep everyone safe</Text>
        </View>
        <View style={styles.spacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Location Info */}
        <View style={[styles.locationCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="location" size={20} color={colors.primary} style={styles.locationIcon} />
          <View style={styles.locationContent}>
            <Text style={[styles.locationTitle, { color: colors.foreground }]}>Current Location</Text>
            <Text style={[styles.locationSubtitle, { color: colors.foreground + "80" }]}>{userData.currentLocation}</Text>
          </View>
          <View style={styles.statusDot} />
        </View>

        {/* Category Selection */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>What type of issue are you reporting?</Text>

        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;

          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: colors.card,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                <Ionicons name={category.icon as any} size={20} color="white" />
              </View>
              <View style={styles.categoryContent}>
                <Text style={[styles.categoryName, { color: colors.foreground }]}>{category.name}</Text>
                <Text style={[styles.categoryDescription, { color: colors.foreground + "80" }]}>{category.description}</Text>
              </View>
              {isSelected && (
                <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]}>
                  <Ionicons name="checkmark-circle" size={12} color="white" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Description */}
        <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 24 }]}>Describe the issue</Text>

        <TextInput
          style={[styles.textArea, { 
            backgroundColor: colors.card, 
            borderColor: colors.border, 
            color: colors.foreground 
          }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Please provide as much detail as possible. Include what happened, when it occurred, and any immediate safety concerns..."
          placeholderTextColor={colors.foreground + "60"}
          multiline
          maxLength={500}
        />
        <Text style={[styles.characterCount, { color: colors.foreground + "80" }]}>{description.length}/500 characters</Text>

        {/* Media Upload */}
        <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 24 }]}>Add evidence (optional)</Text>

        <View style={styles.mediaGrid}>
          <TouchableOpacity
            style={[styles.mediaButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => Alert.alert("Info", "Camera feature will be available in full version")}
          >
            <Ionicons name="camera" size={32} color={colors.foreground} />
            <Text style={[styles.mediaButtonText, { color: colors.foreground }]}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.mediaButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => Alert.alert("Info", "Gallery feature will be available in full version")}
          >
            <Ionicons name="image" size={32} color={colors.foreground} />
            <Text style={[styles.mediaButtonText, { color: colors.foreground }]}>From Gallery</Text>
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
                <Ionicons name="send" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={[styles.submitButtonText, { color: "white" }]}>Submit Report</Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        <Text style={[styles.disclaimer, { color: colors.foreground + "80" }]}>
          Your report will be reviewed immediately by local authorities and tourist safety officials. False reports may
          result in penalties.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
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
  },
  headerSubtitle: {
    fontSize: 14,
  },
  spacer: {
    width: 36,
  },
  content: {
    padding: 16,
  },
  locationCard: {
    borderWidth: 1,
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
  },
  locationSubtitle: {
    fontSize: 14,
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
    marginBottom: 16,
  },
  categoryButton: {
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
  },
  categoryDescription: {
    fontSize: 14,
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    textAlignVertical: "top",
    fontSize: 16,
  },
  characterCount: {
    textAlign: "right",
    fontSize: 12,
    marginTop: 8,
  },
  mediaGrid: {
    flexDirection: "row",
    gap: 12,
  },
  mediaButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
  },
  mediaButtonText: {
    fontSize: 14,
    fontWeight: "500",
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
    textAlign: "center",
    lineHeight: 18,
  },
  successContainer: {
    flex: 1,
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
    marginBottom: 24,
  },
  successCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    width: "100%",
    marginBottom: 24,
  },
  successMessage: {
    fontSize: 18,
    marginBottom: 16,
  },
  successDetail: {
    fontSize: 14,
    marginBottom: 8,
  },
  successDetailLabel: {
    fontWeight: "600",
  },
  successFooter: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
