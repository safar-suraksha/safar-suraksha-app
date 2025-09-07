import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, StatusBar, Alert, Animated, Easing, Vibration, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

const { width, } = Dimensions.get('window');

interface DashboardProps {
  userData: {
    fullName: string;
    safetyScore: number;
    currentLocation: string;
    destination: string;
    emergencyContacts: string[];
  };
  isDark?: boolean;
  navigation?: any; // React Navigation
}

export default function Dashboard({ userData, isDark = false, navigation }: DashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sosPressed, setSosPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [safetyScoreAnimation, setSafetyScoreAnimation] = useState(0);
  const [showBatteryAlert, setShowBatteryAlert] = useState(false);
  const [connectionStatus] = useState('excellent');
  const [weatherInfo] = useState({ temp: 28, condition: 'Sunny' });
  const [nearbyTourists] = useState(12);

  // Animated values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const sosAnim = useRef(new Animated.Value(0)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const locationPulse = useRef(new Animated.Value(1)).current;
  const batteryAlertAnim = useRef(new Animated.Value(0)).current;

  const theme = {
    colors: {
      background: isDark ? '#0A0B0E' : '#FFFFFF',
      surface: isDark ? '#1A1B1E' : '#F8FAFC',
      surfaceVariant: isDark ? '#2A2B2E' : '#F1F5F9',
      primary: '#3B82F6',
      primaryLight: '#60A5FA',
      secondary: '#10B981',
      text: isDark ? '#F8FAFC' : '#1E293B',
      textSecondary: isDark ? '#94A3B8' : '#64748B',
      border: isDark ? '#334155' : '#E2E8F0',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      amber: '#F59E0B',
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Animate safety score on mount
    const scoreTimer = setTimeout(() => {
      Animated.timing(scoreAnim, {
        toValue: userData.safetyScore,
        duration: 2500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();

      const increment = userData.safetyScore / 50;
      let current = 0;
      const scoreInterval = setInterval(() => {
        current += increment;
        if (current >= userData.safetyScore) {
          current = userData.safetyScore;
          clearInterval(scoreInterval);
        }
        setSafetyScoreAnimation(Math.round(current));
      }, 50);
    }, 500);

    // Pulse animations
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Location pulse
    const locationPulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(locationPulse, {
          toValue: 1.2,
          duration: 3000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(locationPulse, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    locationPulseAnimation.start();

    // Simulate battery check
    const batteryTimer = setTimeout(() => {
      if (Math.random() > 0.7) {
        setShowBatteryAlert(true);
        Animated.spring(batteryAlertAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }).start();
      }
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(scoreTimer);
      clearTimeout(batteryTimer);
      pulseAnimation.stop();
      locationPulseAnimation.stop();
    };
  }, [userData.safetyScore]);

  const getSafetyColor = (score: number) => {
    if (score >= 80) return theme.colors.success;
    if (score >= 60) return theme.colors.warning;
    return theme.colors.error;
  };

  const handleSOSPress = () => {
    setSosPressed(true);
    setIsLoading(true);
    
    // Vibration pattern for emergency
    if (Platform.OS === 'ios') {
      Vibration.vibrate([200, 100, 200, 100, 200]);
    } else {
      Vibration.vibrate([200, 100, 200, 100, 200]);
    }

    // SOS animation
    Animated.sequence([
      Animated.timing(sosAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(sosAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
    
    setTimeout(() => {
      Alert.alert(
        'SOS ACTIVATED!',
        '✅ Emergency services contacted\n📍 Location shared with rescue team\n📞 Family notified\n⏱️ Response time: 3-5 minutes',
        [{ text: 'OK', onPress: () => setIsLoading(false) }]
      );
    }, 2000);
    
    setTimeout(() => setSosPressed(false), 4000);
  };

  const handleQuickAction = (route: string) => {
    setIsLoading(true);
    setTimeout(() => {
      if (navigation) {
        navigation.navigate(route);
      }
      setIsLoading(false);
    }, 800);
  };

  const quickActions = [
    { 
      icon: 'call',
      label: 'Emergency Call', 
      route: 'EmergencyCall',
      colors: [theme.colors.error, '#DC2626']
    },
    { 
      icon: 'navigate',
      label: 'Find Route', 
      route: 'LiveMap',
      colors: [theme.colors.primary, theme.colors.primaryLight]
    },
    { 
      icon: 'chatbubble-ellipses',
      label: 'AI Chat Support', 
      route: 'ChatSupport',
      colors: [theme.colors.success, '#059669']
    },
    { 
      icon: 'camera',
      label: 'Report Issue', 
      route: 'ReportIssue',
      colors: [theme.colors.warning, '#D97706']
    }
  ];

  const renderHeader = () => (
    <BlurView intensity={20} style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <View style={styles.timeWeatherContainer}>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={14} color={theme.colors.primary} />
              <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <View style={styles.weatherContainer}>
              <Ionicons 
                name={isDark ? 'moon' : 'sunny'} 
                size={14} 
                color={isDark ? '#60A5FA' : theme.colors.warning} 
              />
              <Text style={[styles.weatherText, { color: theme.colors.textSecondary }]}>
                {weatherInfo.temp}°C
              </Text>
            </View>
          </View>
          
          <Text style={[styles.greeting, { color: theme.colors.text }]}>
            Namaste, {userData.fullName.split(' ')[0]}! 🙏
          </Text>
          
          <View style={styles.statusContainer}>
            <View style={styles.activeStatus}>
              <Animated.View 
                style={[
                  styles.statusDot, 
                  { 
                    backgroundColor: theme.colors.success,
                    transform: [{ scale: pulseAnim }]
                  }
                ]} 
              />
              <Text style={[styles.statusText, { color: theme.colors.success }]}>
                Safety Guardian Active
              </Text>
            </View>
            <View style={styles.connectionIcons}>
              <Ionicons 
                name="wifi" 
                size={14} 
                color={connectionStatus === 'excellent' ? theme.colors.success : theme.colors.warning} 
              />
              <Ionicons name="battery-full" size={14} color={theme.colors.success} />
            </View>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => handleQuickAction('DigitalId')}
          >
            <Ionicons name="card-outline" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => handleQuickAction('Settings')}
          >
            <Ionicons name="settings-outline" size={22} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.quickStats}>
        <View style={[styles.statBadge, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Ionicons name="people" size={14} color={theme.colors.primary} />
          <Text style={[styles.statText, { color: theme.colors.text }]}>{nearbyTourists} nearby</Text>
        </View>
        <View style={[styles.statBadge, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Ionicons name="trending-up" size={14} color={theme.colors.success} />
          <Text style={[styles.statText, { color: theme.colors.text }]}>Safe zone</Text>
        </View>
      </View>
    </BlurView>
  );

  const renderBatteryAlert = () => {
    if (!showBatteryAlert) return null;

    return (
      <Animated.View 
        style={[
          styles.batteryAlert, 
          { 
            backgroundColor: `${theme.colors.warning}15`,
            borderColor: `${theme.colors.warning}30`,
            opacity: batteryAlertAnim,
            transform: [{ scale: batteryAlertAnim }]
          }
        ]}
      >
        <View style={styles.batteryAlertContent}>
          <Animated.View
            style={{
              transform: [{
                scale: pulseAnim.interpolate({
                  inputRange: [1, 1.1],
                  outputRange: [1, 1.1],
                })
              }]
            }}
          >
            <Ionicons name="battery-half" size={18} color={theme.colors.warning} />
          </Animated.View>
          <Text style={[styles.batteryAlertText, { color: theme.colors.warning }]}>
            Battery optimization suggested
          </Text>
        </View>
        <TouchableOpacity onPress={() => setShowBatteryAlert(false)}>
          <Ionicons name="close" size={18} color={theme.colors.warning} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderLocationCard = () => (
    <TouchableOpacity 
      style={[styles.locationCard, { backgroundColor: theme.colors.surface }]}
      activeOpacity={0.7}
    >
      <View style={styles.locationContent}>
        <View style={styles.locationIconContainer}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryLight]}
            style={styles.locationIcon}
          >
            <Animated.View style={{ transform: [{ scale: locationPulse }] }}>
              <Ionicons name="location" size={24} color="#FFFFFF" />
            </Animated.View>
          </LinearGradient>
          
          {/* Pulse rings */}
          {[1, 2, 3].map(i => (
            <Animated.View
              key={i}
              style={[
                styles.pulseRing,
                {
                  borderColor: theme.colors.primary,
                  transform: [{
                    scale: pulseAnim.interpolate({
                      inputRange: [1, 1.1],
                      outputRange: [1 + (i * 0.1), 1.2 + (i * 0.1)],
                    })
                  }],
                  opacity: pulseAnim.interpolate({
                    inputRange: [1, 1.1],
                    outputRange: [0.6, 0],
                  }),
                }
              ]}
            />
          ))}
        </View>
        
        <View style={styles.locationInfo}>
          <Text style={[styles.locationTitle, { color: theme.colors.text }]}>
            {userData.currentLocation}
          </Text>
          <View style={styles.locationStatus}>
            <View style={styles.liveTracker}>
              <View style={[styles.liveDot, { backgroundColor: theme.colors.success }]} />
              <Text style={[styles.liveText, { color: theme.colors.textSecondary }]}>
                Live tracking active
              </Text>
            </View>
          </View>
          <View style={styles.locationBadges}>
            <View style={[styles.badge, { backgroundColor: `${theme.colors.success}20` }]}>
              <Ionicons name="star" size={12} color={theme.colors.success} />
              <Text style={[styles.badgeText, { color: theme.colors.success }]}>SAFE ZONE</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: `${theme.colors.primary}20` }]}>
              <Ionicons name="radar" size={12} color={theme.colors.primary} />
              <Text style={[styles.badgeText, { color: theme.colors.primary }]}>MONITORED</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSafetyScore = () => {
    const circumference = 2 * Math.PI * 88;
    const strokeDashoffset = circumference - (safetyScoreAnimation / 100) * circumference;

    return (
      <View style={[styles.safetyScoreCard, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.safetyHeader}>
          <Ionicons name="shield-checkmark" size={28} color={theme.colors.primary} />
          <Text style={[styles.safetyTitle, { color: theme.colors.text }]}>
            AI Safety Guardian
          </Text>
          <Ionicons name="diamond" size={24} color={theme.colors.warning} />
        </View>

        <View style={styles.scoreContainer}>
          <View style={styles.scoreCircleContainer}>
            {/* Decorative rings */}
            {[1, 2, 3].map(i => (
              <Animated.View
                key={i}
                style={[
                  styles.decorativeRing,
                  {
                    borderColor: `${getSafetyColor(userData.safetyScore)}40`,
                    transform: [{
                      scale: pulseAnim.interpolate({
                        inputRange: [1, 1.1],
                        outputRange: [1 + (i * 0.05), 1.05 + (i * 0.05)],
                      })
                    }]
                  }
                ]}
              />
            ))}
            
            <Svg width={192} height={192} style={styles.progressSvg}>
              <Circle
                cx={96}
                cy={96}
                r={88}
                stroke={theme.colors.border}
                strokeWidth={8}
                fill="transparent"
                opacity={0.2}
              />
              <Circle
                cx={96}
                cy={96}
                r={88}
                stroke={getSafetyColor(userData.safetyScore)}
                strokeWidth={8}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 96 96)"
              />
            </Svg>
            
            <View style={styles.scoreCenter}>
              <Text style={[styles.scoreNumber, { color: theme.colors.text }]}>
                {safetyScoreAnimation}
              </Text>
              <Text style={[styles.scoreLabel, { color: theme.colors.textSecondary }]}>
                SAFETY SCORE
              </Text>
              <View style={styles.starsContainer}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons 
                    key={i}
                    name="star" 
                    size={12} 
                    color={i < Math.floor(userData.safetyScore / 20) ? theme.colors.warning : theme.colors.textSecondary} 
                  />
                ))}
              </View>
              <View style={styles.realtimeIndicator}>
                <Ionicons name="pulse" size={14} color={theme.colors.primary} />
                <Text style={[styles.realtimeText, { color: theme.colors.primary }]}>REAL-TIME</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[
          styles.statusBadge, 
          { backgroundColor: `${getSafetyColor(userData.safetyScore)}20` }
        ]}>
          <Ionicons name="checkmark-circle" size={16} color={getSafetyColor(userData.safetyScore)} />
          <Text style={[styles.statusBadgeText, { color: getSafetyColor(userData.safetyScore) }]}>
            {userData.safetyScore >= 80 ? '🛡️ FULLY PROTECTED' : 
             userData.safetyScore >= 60 ? '⚠️ CAUTION MODE' : '🚨 ALERT STATUS'}
          </Text>
        </View>
        
        <Text style={[styles.safetyDescription, { color: theme.colors.textSecondary }]}>
          Real-time analysis of 50+ safety parameters including location, weather, crowd density, and local security status
        </Text>
      </View>
    );
  };

  const renderSOSButton = () => (
    <View style={styles.sosContainer}>
      <View style={styles.sosButtonContainer}>
        {/* Pulse rings */}
        {!sosPressed && [1, 2, 3].map(i => (
          <Animated.View
            key={i}
            style={[
              styles.sosPulseRing,
              {
                borderColor: `${theme.colors.error}30`,
                transform: [{
                  scale: pulseAnim.interpolate({
                    inputRange: [1, 1.1],
                    outputRange: [1 + (i * 0.2), 1.4 + (i * 0.2)],
                  })
                }],
                opacity: pulseAnim.interpolate({
                  inputRange: [1, 1.1],
                  outputRange: [0.6, 0],
                }),
              }
            ]}
          />
        ))}
        
        <TouchableOpacity
          style={[styles.sosButton, { opacity: sosPressed ? 0.8 : 1 }]}
          onPress={handleSOSPress}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[theme.colors.error, '#DC2626', '#B91C1C']}
            style={styles.sosGradient}
          >
            {/* Inner glow layers */}
            <View style={styles.sosGlow1} />
            <View style={styles.sosGlow2} />
            
            <Animated.View 
              style={[
                styles.sosContent,
                {
                  transform: [{
                    scale: sosPressed ? sosAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.3],
                    }) : 1
                  }]
                }
              ]}
            >
              {isLoading ? (
                <Animated.View
                  style={{
                    transform: [{
                      rotate: pulseAnim.interpolate({
                        inputRange: [1, 1.1],
                        outputRange: ['0deg', '360deg'],
                      })
                    }]
                  }}
                >
                  <Ionicons name="refresh" size={56} color="#FFFFFF" />
                </Animated.View>
              ) : (
                <>
                  <Ionicons name="warning" size={56} color="#FFFFFF" />
                  <Text style={styles.sosText}>SOS</Text>
                  <Text style={styles.sosSubtext}>EMERGENCY</Text>
                </>
              )}
            </Animated.View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      <View style={styles.sosInfo}>
        <Text style={[styles.sosInfoText, { color: theme.colors.textSecondary }]}>
          <Ionicons name="flash" size={14} color={theme.colors.error} />
          {isLoading ? ' Connecting to emergency services...' : ' Tap for instant emergency response'}
        </Text>
        <Text style={[styles.sosInfoSubtext, { color: theme.colors.textSecondary }]}>
          Emergency services • Family notification • GPS tracking
        </Text>
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <View style={styles.quickActionsHeader}>
        <Text style={[styles.quickActionsTitle, { color: theme.colors.text }]}>Quick Actions</Text>
        <Ionicons name="flash" size={22} color={theme.colors.primary} />
      </View>
      
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickActionButton}
            onPress={() => handleQuickAction(action.route)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={action.colors}
              style={styles.quickActionGradient}
            >
              <View style={styles.quickActionIconContainer}>
                <Ionicons name={action.icon as any} size={36} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionText}>{action.label}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStatusCards = () => (
    <View style={styles.statusCardsContainer}>
      <View style={[styles.statusCard, { backgroundColor: theme.colors.surface }]}>
        <Ionicons name="time" size={28} color={theme.colors.primary} />
        <Text style={[styles.statusCardLabel, { color: theme.colors.textSecondary }]}>Trip Progress</Text>
        <Text style={[styles.statusCardValue, { color: theme.colors.text }]}>Day 3</Text>
        <Text style={[styles.statusCardSubvalue, { color: theme.colors.textSecondary }]}>of 14 days</Text>
        <View style={[styles.progressBarSmall, { backgroundColor: theme.colors.surfaceVariant }]}>
          <View style={[styles.progressFillSmall, { width: '21%', backgroundColor: theme.colors.primary }]} />
        </View>
      </View>
      
      <View style={[styles.statusCard, { backgroundColor: theme.colors.surface }]}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Ionicons name="shield-checkmark" size={28} color={theme.colors.success} />
        </Animated.View>
        <Text style={[styles.statusCardLabel, { color: theme.colors.textSecondary }]}>Guardian Status</Text>
        <Text style={[styles.statusCardValue, { color: theme.colors.success }]}>Active</Text>
        <View style={styles.guardianStatus}>
          <View style={[styles.guardianDot, { backgroundColor: theme.colors.success }]} />
          <Text style={[styles.guardianText, { color: theme.colors.success }]}>24/7 PROTECTED</Text>
        </View>
        <View style={[styles.guardianBar, { backgroundColor: theme.colors.success }]} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.background} 
      />
      
      {/* Background Elements */}
      <View style={styles.backgroundElements}>
        <Animated.View 
          style={[
            styles.backgroundGradient1, 
            { 
              backgroundColor: `${theme.colors.primary}05`,
              transform: [{ scale: pulseAnim }] 
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.backgroundGradient2, 
            { 
              backgroundColor: `${theme.colors.success}03`,
              transform: [{ scale: locationPulse }] 
            }
          ]} 
        />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {renderBatteryAlert()}
        {renderLocationCard()}
        {renderSafetyScore()}
        {renderSOSButton()}
        {renderQuickActions()}
        {renderStatusCards()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundGradient1: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 384,
    height: 384,
    borderRadius: 192,
    opacity: 0.1,
  },
  backgroundGradient2: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 320,
    height: 320,
    borderRadius: 160,
    opacity: 0.1,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  timeWeatherContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  connectionIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  batteryAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  batteryAlertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  batteryAlertText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  locationCard: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 24,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIconContainer: {
    position: 'relative',
    marginRight: 16,
  },
  locationIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  pulseRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderRadius: 16,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationStatus: {
    marginBottom: 12,
  },
  liveTracker: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  liveText: {
    fontSize: 14,
    fontWeight: '600',
  },
  locationBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  safetyScoreCard: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  safetyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 12,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreCircleContainer: {
    position: 'relative',
    width: 192,
    height: 192,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorativeRing: {
    position: 'absolute',
    width: 192,
    height: 192,
    borderRadius: 96,
    borderWidth: 2,
  },
  progressSvg: {
    position: 'absolute',
  },
  scoreCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  realtimeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  realtimeText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  safetyDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  sosContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  sosButtonContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  sosPulseRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
  },
  sosButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
  },
  sosGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  sosGlow1: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 64,
  },
  sosGlow2: {
    position: 'absolute',
    top: 24,
    left: 24,
    right: 24,
    bottom: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 56,
  },
  sosContent: {
    alignItems: 'center',
    zIndex: 10,
  },
  sosText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 4,
    marginTop: 8,
  },
  sosSubtext: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 2,
  },
  sosInfo: {
    alignItems: 'center',
  },
  sosInfoText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  sosInfoSubtext: {
    fontSize: 12,
    textAlign: 'center',
  },
  quickActionsContainer: {
    marginHorizontal: 16,
    marginVertical: 16,
  },
  quickActionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  quickActionButton: {
    width: (width - 48) / 2,
    height: 120,
    borderRadius: 24,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  quickActionIconContainer: {
    marginBottom: 12,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusCardsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 16,
    gap: 16,
  },
  statusCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusCardLabel: {
    fontSize: 12,
    marginTop: 12,
    marginBottom: 8,
  },
  statusCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusCardSubvalue: {
    fontSize: 12,
    marginBottom: 12,
  },
  progressBarSmall: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFillSmall: {
    height: '100%',
    borderRadius: 4,
  },
  guardianStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  guardianDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  guardianText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  guardianBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    marginTop: 12,
  },
});