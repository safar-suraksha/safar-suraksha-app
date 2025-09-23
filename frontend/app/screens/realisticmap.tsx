"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native"
import Svg, { Path } from "react-native-svg"
import {
  Navigation,
  AlertTriangle,
  Shield,
  Users,
  Phone,
  Car,
  ShoppingBag,
  Coffee,
  Hospital,
  Building,
} from "lucide-react-native"
import React from "react"

interface RealisticMapProps {
  height?: number
  showUserLocation?: boolean
  interactive?: boolean
  style?: any
}

interface MapLocation {
  id: string
  x: number
  y: number
  type: "safe" | "warning" | "danger" | "poi" | "service"
  name: string
  icon: any
  description?: string
}

const { width: screenWidth } = Dimensions.get("window")

export default function RealisticMap({ height = 320, showUserLocation = true, interactive = true, style }: RealisticMapProps) {
  const [userLocation, setUserLocation] = useState({ x: 50, y: 60 })
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [pulseAnimation] = useState(new Animated.Value(0))
  const [rotationAnimation] = useState(new Animated.Value(0))

  // Simulate real-time location updates
  useEffect(() => {
    if (!interactive) return

    const interval = setInterval(() => {
      setUserLocation((prev) => ({
        x: Math.max(10, Math.min(90, prev.x + (Math.random() - 0.5) * 3)),
        y: Math.max(10, Math.min(90, prev.y + (Math.random() - 0.5) * 3)),
      }))
    }, 4000)

    return () => clearInterval(interval)
  }, [interactive])

  // Animations
  useEffect(() => {
    // Pulse animation for user location
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // Rotation animation for compass
    Animated.loop(
      Animated.timing(rotationAnimation, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      }),
    ).start()
  }, [])

  const mapLocations: MapLocation[] = [
    // Safe zones
    {
      id: "1",
      x: 25,
      y: 35,
      type: "safe",
      name: "India Gate",
      icon: Shield,
      description: "Tourist police station nearby",
    },
    {
      id: "2",
      x: 70,
      y: 25,
      name: "Red Fort",
      type: "safe",
      icon: Building,
    },
    {
      id: "3",
      x: 40,
      y: 20,
      name: "Connaught Place",
      type: "safe",
      icon: ShoppingBag,
    },

    // Warning zones
    {
      id: "4",
      x: 20,
      y: 75,
      name: "Chandni Chowk",
      type: "warning",
      icon: Users,
      description: "Crowded market area",
    },
    {
      id: "5",
      x: 75,
      y: 70,
      name: "Old Delhi Station",
      type: "warning",
      icon: Car,
    },

    // Danger zones
    {
      id: "6",
      x: 85,
      y: 80,
      name: "Construction Zone",
      type: "danger",
      icon: AlertTriangle,
      description: "Avoid after 8 PM",
    },

    // Points of interest
    {
      id: "7",
      x: 45,
      y: 40,
      name: "Coffee House",
      type: "poi",
      icon: Coffee,
    },
    {
      id: "8",
      x: 60,
      y: 50,
      name: "Hospital",
      type: "service",
      icon: Hospital,
    },
    {
      id: "9",
      x: 35,
      y: 65,
      name: "Tourist Help",
      type: "service",
      icon: Phone,
    },
  ]

  const getLocationColor = (type: string) => {
    switch (type) {
      case "safe":
        return "#10b981"
      case "warning":
        return "#f59e0b"
      case "danger":
        return "#ef4444"
      case "poi":
        return "#3b82f6"
      case "service":
        return "#8b5cf6"
      default:
        return "#6b7280"
    }
  }

  const getZoneOpacity = (type: string) => {
    switch (type) {
      case "safe":
        return "rgba(16, 185, 129, 0.2)"
      case "warning":
        return "rgba(245, 158, 11, 0.2)"
      case "danger":
        return "rgba(239, 68, 68, 0.2)"
      default:
        return "rgba(107, 114, 128, 0.1)"
    }
  }

  const styles = StyleSheet.create({
    container: {
      height,
      borderRadius: 12,
      overflow: "hidden",
      position: "relative",
      backgroundColor: "#f0f9ff",
    },
    streetGrid: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.3,
    },
    buildingBlock: {
      position: "absolute",
      backgroundColor: "rgba(156, 163, 175, 0.4)",
      borderRadius: 2,
    },
    parkArea: {
      position: "absolute",
      backgroundColor: "rgba(34, 197, 94, 0.6)",
      borderRadius: 8,
    },
    safetyZone: {
      position: "absolute",
      borderRadius: 50,
      borderWidth: 1,
      borderColor: "rgba(0, 0, 0, 0.1)",
    },
    locationMarker: {
      position: "absolute",
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: "white",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    userLocation: {
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
    },
    userDot: {
      width: 24,
      height: 24,
      backgroundColor: "#3b82f6",
      borderRadius: 12,
      borderWidth: 3,
      borderColor: "white",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    userInnerDot: {
      width: 8,
      height: 8,
      backgroundColor: "white",
      borderRadius: 4,
    },
    pulseRing: {
      position: "absolute",
      width: 24,
      height: 24,
      backgroundColor: "#3b82f6",
      borderRadius: 12,
    },
    compass: {
      position: "absolute",
      top: 16,
      right: 16,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: 20,
      padding: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    compassN: {
      position: "absolute",
      top: -4,
      left: "50%",
      marginLeft: -6,
      fontSize: 12,
      fontWeight: "bold",
      color: "#374151",
    },
    scaleIndicator: {
      position: "absolute",
      bottom: 16,
      left: 16,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    scaleLine: {
      width: 40,
      height: 2,
      backgroundColor: "#374151",
      marginBottom: 4,
    },
    scaleText: {
      fontSize: 12,
      fontWeight: "500",
      color: "#374151",
    },
    weatherInfo: {
      position: "absolute",
      top: 16,
      left: 16,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    weatherDot: {
      width: 12,
      height: 12,
      backgroundColor: "#fbbf24",
      borderRadius: 6,
      marginRight: 8,
    },
    weatherText: {
      fontSize: 12,
      fontWeight: "500",
      color: "#374151",
    },
    tooltip: {
      position: "absolute",
      backgroundColor: "white",
      borderRadius: 8,
      padding: 12,
      minWidth: 120,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.2)",
    },
    tooltipTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: "#111827",
    },
    tooltipDescription: {
      fontSize: 12,
      color: "#6b7280",
      marginTop: 4,
    },
    tooltipArrow: {
      position: "absolute",
      top: "100%",
      left: "50%",
      marginLeft: -4,
      width: 8,
      height: 8,
      backgroundColor: "white",
      transform: [{ rotate: "45deg" }],
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.2)",
    },
  })

  return (
    <View style={[styles.container, style]}>
      {/* Street Grid */}
      <Svg style={styles.streetGrid} width="100%" height="100%" viewBox="0 0 100 100">
        {/* Major roads */}
        <Path d="M0,30 L100,30" stroke="#9ca3af" strokeWidth="0.5" />
        <Path d="M0,60 L100,60" stroke="#9ca3af" strokeWidth="0.5" />
        <Path d="M30,0 L30,100" stroke="#9ca3af" strokeWidth="0.5" />
        <Path d="M70,0 L70,100" stroke="#9ca3af" strokeWidth="0.5" />

        {/* Minor streets */}
        <Path d="M0,15 L100,15" stroke="#d1d5db" strokeWidth="0.2" />
        <Path d="M0,45 L100,45" stroke="#d1d5db" strokeWidth="0.2" />
        <Path d="M0,75 L100,75" stroke="#d1d5db" strokeWidth="0.2" />
        <Path d="M15,0 L15,100" stroke="#d1d5db" strokeWidth="0.2" />
        <Path d="M45,0 L45,100" stroke="#d1d5db" strokeWidth="0.2" />
        <Path d="M85,0 L85,100" stroke="#d1d5db" strokeWidth="0.2" />

        {/* Curved roads */}
        <Path d="M20,10 Q50,25 80,15" stroke="#9ca3af" strokeWidth="0.3" fill="none" />
        <Path d="M15,80 Q40,70 65,85" stroke="#9ca3af" strokeWidth="0.3" fill="none" />
      </Svg>

      {/* Building blocks */}
      <View style={[styles.buildingBlock, { top: "5%", left: "10%", width: "15%", height: "20%" }]} />
      <View style={[styles.buildingBlock, { top: "35%", left: "5%", width: "20%", height: "15%" }]} />
      <View style={[styles.buildingBlock, { top: "10%", right: "15%", width: "18%", height: "25%" }]} />
      <View style={[styles.buildingBlock, { bottom: "15%", right: "10%", width: "22%", height: "18%" }]} />

      {/* Parks/green spaces */}
      <View style={[styles.parkArea, { top: "60%", left: "35%", width: "25%", height: "20%" }]} />
      <View style={[styles.parkArea, { top: "5%", left: "50%", width: "15%", height: "15%" }]} />

      {/* Safety Zones */}
      {mapLocations
        .filter((loc) => ["safe", "warning", "danger"].includes(loc.type))
        .map((zone) => (
          <Animated.View
            key={`zone-${zone.id}`}
            style={[
              styles.safetyZone,
              {
                left: `${zone.x - 12}%`,
                top: `${zone.y - 12}%`,
                width: `${zone.type === "safe" ? 24 : zone.type === "warning" ? 18 : 15}%`,
                height: `${zone.type === "safe" ? 24 : zone.type === "warning" ? 18 : 15}%`,
                backgroundColor: getZoneOpacity(zone.type),
              },
            ]}
          />
        ))}

      {/* Location Markers */}
      {mapLocations.map((location) => {
        const IconComponent = location.icon
        const isSelected = selectedLocation === location.id

        return (
          <View key={location.id}>
            <TouchableOpacity
              style={[
                styles.locationMarker,
                {
                  left: `${location.x}%`,
                  top: `${location.y}%`,
                  backgroundColor: getLocationColor(location.type),
                  transform: [{ translateX: -16 }, { translateY: -16 }],
                },
              ]}
              onPress={() => interactive && setSelectedLocation(selectedLocation === location.id ? null : location.id)}
              disabled={!interactive}
            >
              <IconComponent size={16} color="white" />
            </TouchableOpacity>

            {/* Location tooltip */}
            {isSelected && (
              <View
                style={[
                  styles.tooltip,
                  {
                    left: `${location.x}%`,
                    top: `${location.y - 15}%`,
                    transform: [{ translateX: -60 }],
                  },
                ]}
              >
                <Text style={styles.tooltipTitle}>{location.name}</Text>
                {location.description && <Text style={styles.tooltipDescription}>{location.description}</Text>}
                <View style={styles.tooltipArrow} />
              </View>
            )}
          </View>
        )
      })}

      {/* User Location */}
      {showUserLocation && (
        <View
          style={[
            styles.userLocation,
            {
              left: `${userLocation.x}%`,
              top: `${userLocation.y}%`,
              transform: [{ translateX: -12 }, { translateY: -12 }],
            },
          ]}
        >
          {/* Pulsing ring */}
          <Animated.View
            style={[
              styles.pulseRing,
              {
                opacity: pulseAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.75, 0],
                }),
                transform: [
                  {
                    scale: pulseAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.5],
                    }),
                  },
                ],
              },
            ]}
          />

          {/* Main dot */}
          <View style={styles.userDot}>
            <View style={styles.userInnerDot} />
          </View>
        </View>
      )}

      {/* Compass */}
      <View style={styles.compass}>
        <Animated.View
          style={{
            transform: [
              {
                rotate: rotationAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          }}
        >
          <Navigation size={20} color="#374151" />
        </Animated.View>
        <Text style={styles.compassN}>N</Text>
      </View>

      {/* Scale indicator */}
      <View style={styles.scaleIndicator}>
        <View style={styles.scaleLine} />
        <Text style={styles.scaleText}>500m</Text>
      </View>

      {/* Weather overlay */}
      <View style={styles.weatherInfo}>
        <View style={styles.weatherDot} />
        <Text style={styles.weatherText}>28°C Clear</Text>
      </View>
    </View>
  )
}
