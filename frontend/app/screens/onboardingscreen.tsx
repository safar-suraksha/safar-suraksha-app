import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    Alert,
    Animated,
    Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface OnboardingData {
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        nationality: string;
    };
    travelInfo: {
        destination: string;
        duration: string;
        purpose: string;
        emergencyContact: string;
    };
    verification: {
        passportNumber: string;
        visaNumber: string;
        photo: string;
    };
}

interface OnboardingScreenProps {
    onComplete: (data: OnboardingData) => void;
    isDark?: boolean;
}

export default function OnboardingScreen({ onComplete, isDark = false }: OnboardingScreenProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
    const [progressAnim] = useState(new Animated.Value(0));
    const [successAnim] = useState(new Animated.Value(0));
    const router = useRouter()

    const [formData, setFormData] = useState<OnboardingData>({
        personalInfo: {
            fullName: '',
            email: '',
            phone: '',
            nationality: 'India'
        },
        travelInfo: {
            destination: '',
            duration: '',
            purpose: 'Tourism',
            emergencyContact: ''
        },
        verification: {
            passportNumber: '',
            visaNumber: '',
            photo: ''
        }
    });

    const theme = {
        colors: {
            background: isDark ? '#0A0B0E' : '#FFFFFF',
            surface: isDark ? '#1A1B1E' : '#F8FAFC',
            primary: '#3B82F6',
            primaryLight: '#60A5FA',
            secondary: '#10B981',
            text: isDark ? '#F8FAFC' : '#1E293B',
            textSecondary: isDark ? '#94A3B8' : '#64748B',
            border: isDark ? '#334155' : '#E2E8F0',
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
        }
    };

    const steps = [
        {
            title: 'Personal Information',
            icon: 'person-outline',
            subtitle: 'Basic details for your safety profile'
        },
        {
            title: 'Travel Information',
            icon: 'location-outline',
            subtitle: 'Your trip details and destination'
        },
        {
            title: 'Verification',
            icon: 'shield-checkmark-outline',
            subtitle: 'Secure your digital tourist ID'
        }
    ];

    const updateFormData = (section: keyof OnboardingData, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 0:
                return formData.personalInfo.fullName &&
                    formData.personalInfo.email &&
                    formData.personalInfo.phone;
            case 1:
                return formData.travelInfo.destination &&
                    formData.travelInfo.duration &&
                    formData.travelInfo.emergencyContact;
            case 2:
                return formData.verification.passportNumber;
            default:
                return false;
        }
    };

    const animateProgress = (toValue: number) => {
        Animated.timing(progressAnim, {
            toValue,
            duration: 800,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
        }).start();
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setIsLoading(true);
            setTimeout(() => {
                setCurrentStep(prev => {
                    const newStep = prev + 1;
                    animateProgress((newStep + 1) / steps.length);
                    return newStep;
                });
                setIsLoading(false);
            }, 800);
        } else {
            // Last step: navigate to dashboard
            setIsLoading(true);
            setShowSuccessAnimation(true);

            Animated.spring(successAnim, {
                toValue: 1,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }).start();

            setTimeout(() => {
                router.push("/screens/dashboard"); // <--- navigate here
            }, 2000);
        }
    };


    const handleBack = () => {
        if (currentStep > 0) {
            const newStep = currentStep - 1;
            setCurrentStep(newStep);
            animateProgress((newStep + 1) / steps.length);
        }
    };

    const renderStepIndicators = () => (
        <View style={styles.stepIndicators}>
            <View style={styles.connectionLine} />
            <Animated.View
                style={[
                    styles.progressLine,
                    {
                        width: progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                        }),
                        backgroundColor: theme.colors.success,
                    }
                ]}
            />

            {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;

                return (
                    <View key={index} style={styles.stepIndicator}>
                        <View
                            style={[
                                styles.stepCircle,
                                {
                                    backgroundColor: isCompleted
                                        ? theme.colors.success
                                        : isCurrent
                                            ? theme.colors.primary
                                            : theme.colors.surface,
                                    borderColor: isCompleted
                                        ? theme.colors.success
                                        : isCurrent
                                            ? theme.colors.primary
                                            : theme.colors.border,
                                }
                            ]}
                        >
                            <Ionicons
                                name={isCompleted ? 'checkmark' : step.icon as any}
                                size={16}
                                color={
                                    isCompleted || isCurrent ? '#FFFFFF' : theme.colors.textSecondary
                                }
                            />
                        </View>
                        <Text
                            style={[
                                styles.stepLabel,
                                {
                                    color: isCurrent
                                        ? theme.colors.primary
                                        : isCompleted
                                            ? theme.colors.success
                                            : theme.colors.textSecondary
                                }
                            ]}
                        >
                            {step.title.split(' ')[0]}
                        </Text>
                    </View>
                );
            })}
        </View>
    );

    const renderPersonalInfo = () => (
        <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                    <Ionicons name="person-outline" size={14} color={theme.colors.primary} /> Full Name *
                </Text>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        borderColor: theme.colors.border
                    }]}
                    value={formData.personalInfo.fullName}
                    onChangeText={(text) => updateFormData('personalInfo', 'fullName', text)}
                    placeholder="Enter your full name as per passport"
                    placeholderTextColor={theme.colors.textSecondary}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Email Address *</Text>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        borderColor: theme.colors.border
                    }]}
                    value={formData.personalInfo.email}
                    onChangeText={(text) => updateFormData('personalInfo', 'email', text)}
                    placeholder="your.email@example.com"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Phone Number *</Text>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        borderColor: theme.colors.border
                    }]}
                    value={formData.personalInfo.phone}
                    onChangeText={(text) => updateFormData('personalInfo', 'phone', text)}
                    placeholder="+91 98765 43210"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="phone-pad"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                    <Ionicons name="globe-outline" size={14} color={theme.colors.primary} /> Nationality
                </Text>
                <View style={[styles.pickerContainer, {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border
                }]}>
                    <Text style={[styles.pickerText, { color: theme.colors.text }]}>
                        🇮🇳 {formData.personalInfo.nationality}
                    </Text>
                </View>
            </View>
            <View style={styles.navigationContainer}>
                {currentStep > 0 && (
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
                        onPress={handleBack}
                    >
                        <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
                        <Text style={[styles.backButtonText, { color: theme.colors.text }]}>Back</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[
                        styles.nextButton,
                        {
                            opacity: isStepValid() ? 1 : 0.5,
                            flex: currentStep === 0 ? 1 : 0.7,
                        }
                    ]}
                    onPress={handleNext}
                    disabled={!isStepValid() || isLoading}
                >
                    <LinearGradient
                        colors={isStepValid() ? [theme.colors.primary, theme.colors.primaryLight] : [theme.colors.surface, theme.colors.surface]}
                        style={styles.nextButtonGradient}
                    >
                        {isLoading ? (
                            <Animated.View
                                style={{
                                    transform: [
                                        {
                                            rotate: progressAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['0deg', '360deg'],
                                            }),
                                        },
                                    ],
                                }}
                            >
                                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                            </Animated.View>
                        ) : (
                            <>
                                <Text style={[styles.nextButtonText, { color: isStepValid() ? '#FFFFFF' : theme.colors.textSecondary }]}>
                                    {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                                </Text>
                                <Ionicons
                                    name="arrow-forward"
                                    size={20}
                                    color={isStepValid() ? '#FFFFFF' : theme.colors.textSecondary}
                                />
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderTravelInfo = () => (
        <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                    <Ionicons name="location-outline" size={14} color={theme.colors.primary} /> Destination *
                </Text>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        borderColor: theme.colors.border
                    }]}
                    value={formData.travelInfo.destination}
                    onChangeText={(text) => updateFormData('travelInfo', 'destination', text)}
                    placeholder="e.g., New Delhi, Rajasthan, Kerala"
                    placeholderTextColor={theme.colors.textSecondary}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                    <Ionicons name="time-outline" size={14} color={theme.colors.primary} /> Trip Duration *
                </Text>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        borderColor: theme.colors.border
                    }]}
                    value={formData.travelInfo.duration}
                    onChangeText={(text) => updateFormData('travelInfo', 'duration', text)}
                    placeholder="e.g., 2 weeks, 1 month"
                    placeholderTextColor={theme.colors.textSecondary}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Purpose of Visit</Text>
                <View style={[styles.pickerContainer, {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border
                }]}>
                    <Text style={[styles.pickerText, { color: theme.colors.text }]}>
                        🏛️ {formData.travelInfo.purpose}
                    </Text>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Emergency Contact *</Text>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        borderColor: theme.colors.border
                    }]}
                    value={formData.travelInfo.emergencyContact}
                    onChangeText={(text) => updateFormData('travelInfo', 'emergencyContact', text)}
                    placeholder="Name and phone number"
                    placeholderTextColor={theme.colors.textSecondary}
                />
            </View>
            <View style={styles.navigationContainer}>
                {currentStep > 0 && (
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
                        onPress={handleBack}
                    >
                        <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
                        <Text style={[styles.backButtonText, { color: theme.colors.text }]}>Back</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[
                        styles.nextButton,
                        {
                            opacity: isStepValid() ? 1 : 0.5,
                            flex: currentStep === 0 ? 1 : 0.7,
                        }
                    ]}
                    onPress={handleNext}
                    disabled={!isStepValid() || isLoading}
                >
                    <LinearGradient
                        colors={isStepValid() ? [theme.colors.primary, theme.colors.primaryLight] : [theme.colors.surface, theme.colors.surface]}
                        style={styles.nextButtonGradient}
                    >
                        {isLoading ? (
                            <Animated.View
                                style={{
                                    transform: [
                                        {
                                            rotate: progressAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['0deg', '360deg'],
                                            }),
                                        },
                                    ],
                                }}
                            >
                                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                            </Animated.View>
                        ) : (
                            <>
                                <Text style={[styles.nextButtonText, { color: isStepValid() ? '#FFFFFF' : theme.colors.textSecondary }]}>
                                    {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                                </Text>
                                <Ionicons
                                    name="arrow-forward"
                                    size={20}
                                    color={isStepValid() ? '#FFFFFF' : theme.colors.textSecondary}
                                />
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderVerification = () => (
        <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                    <Ionicons name="shield-checkmark-outline" size={14} color={theme.colors.primary} /> Passport Number *
                </Text>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        borderColor: theme.colors.border
                    }]}
                    value={formData.verification.passportNumber}
                    onChangeText={(text) => updateFormData('verification', 'passportNumber', text)}
                    placeholder="Enter your passport number"
                    placeholderTextColor={theme.colors.textSecondary}
                    autoCapitalize="characters"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>Visa Number (if applicable)</Text>
                <TextInput
                    style={[styles.input, {
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        borderColor: theme.colors.border
                    }]}
                    value={formData.verification.visaNumber}
                    onChangeText={(text) => updateFormData('verification', 'visaNumber', text)}
                    placeholder="Enter your visa number"
                    placeholderTextColor={theme.colors.textSecondary}
                    autoCapitalize="characters"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                    <Ionicons name="camera-outline" size={14} color={theme.colors.primary} /> Profile Photo
                </Text>
                <TouchableOpacity
                    style={[styles.photoButton, { borderColor: theme.colors.border }]}
                    onPress={() => Alert.alert('Photo Capture', 'Photo capture will be available in full version')}
                >
                    <Ionicons name="camera-outline" size={32} color={theme.colors.textSecondary} />
                    <Text style={[styles.photoButtonText, { color: theme.colors.text }]}>Take Photo</Text>
                    <Text style={[styles.photoButtonSubtext, { color: theme.colors.textSecondary }]}>
                        For your digital ID card
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.securityNotice, {
                backgroundColor: `${theme.colors.warning}15`,
                borderColor: `${theme.colors.warning}30`
            }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.warning} />
                <View style={styles.securityNoticeText}>
                    <Text style={[styles.securityTitle, { color: theme.colors.warning }]}>
                        Security Notice
                    </Text>
                    <Text style={[styles.securityDescription, { color: theme.colors.warning }]}>
                        Your information is encrypted and stored securely. This data is used only for emergency response and tourist safety services.
                    </Text>
                </View>
            </View>
            <View style={styles.navigationContainer}>
                {currentStep > 0 && (
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
                        onPress={handleBack}
                    >
                        <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
                        <Text style={[styles.backButtonText, { color: theme.colors.text }]}>Back</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[
                        styles.nextButton,
                        {
                            opacity: isStepValid() ? 1 : 0.5,
                            flex: currentStep === 0 ? 1 : 0.7,
                        }
                    ]}
                    onPress={handleNext}
                    disabled={!isStepValid() || isLoading}
                >
                    <LinearGradient
                        colors={isStepValid() ? [theme.colors.primary, theme.colors.primaryLight] : [theme.colors.surface, theme.colors.surface]}
                        style={styles.nextButtonGradient}
                    >
                        {isLoading ? (
                            <Animated.View
                                style={{
                                    transform: [
                                        {
                                            rotate: progressAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['0deg', '360deg'],
                                            }),
                                        },
                                    ],
                                }}
                            >
                                <Ionicons name="refresh" size={20} color="#FFFFFF" />
                            </Animated.View>
                        ) : (
                            <>
                                <Text style={[styles.nextButtonText, { color: isStepValid() ? '#FFFFFF' : theme.colors.textSecondary }]}>
                                    {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                                </Text>
                                <Ionicons
                                    name="arrow-forward"
                                    size={20}
                                    color={isStepValid() ? '#FFFFFF' : theme.colors.textSecondary}
                                />
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderSuccessOverlay = () => {
        if (!showSuccessAnimation) return null;

        return (
            <Animated.View
                style={[
                    styles.successOverlay,
                    {
                        opacity: successAnim,
                        backgroundColor: `${theme.colors.background}E6`,
                    }
                ]}
            >
                <Animated.View
                    style={[
                        styles.successContainer,
                        {
                            transform: [
                                {
                                    scale: successAnim.interpolate({
                                        inputRange: [0, 0.5, 1],
                                        outputRange: [0, 1.2, 1],
                                    }),
                                },
                            ],
                        }
                    ]}
                >
                    <View style={[styles.successIcon, { backgroundColor: theme.colors.success }]}>
                        <Ionicons name="checkmark" size={48} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.successTitle, { color: theme.colors.text }]}>
                        Welcome to India! 🇮🇳
                    </Text>
                    <Text style={[styles.successSubtitle, { color: theme.colors.textSecondary }]}>
                        Your safety profile is now active
                    </Text>
                </Animated.View>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.background}
            />

            {/* Background Elements */}
            <View style={styles.backgroundElements}>
                <View style={[styles.backgroundCircle1, { backgroundColor: `${theme.colors.primary}10` }]} />
                <View style={[styles.backgroundCircle2, { backgroundColor: `${theme.colors.success}10` }]} />
            </View>

            {/* Header */}
            <BlurView intensity={20} style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.headerLeft}>
                        <LinearGradient
                            colors={[theme.colors.primary, theme.colors.primaryLight]}
                            style={styles.headerIcon}
                        >
                            <Ionicons name="shield-checkmark-outline" size={18} color="#FFFFFF" />
                        </LinearGradient>
                        <View>
                            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                                Smart Tourist Safety
                            </Text>
                            <View style={styles.headerSubtitle}>
                                <Ionicons name="globe-outline" size={12} color={theme.colors.primary} />
                                <Text style={[styles.headerSubtitleText, { color: theme.colors.textSecondary }]}>
                                    Government of India
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        {[...Array(5)].map((_, i) => (
                            <Ionicons key={i} name="star" size={12} color="#FCD34D" />
                        ))}
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                        <View style={styles.progressInfo}>
                            <Ionicons name="time-outline" size={14} color={theme.colors.primary} />
                            <Text style={[styles.progressText, { color: theme.colors.text }]}>
                                Step {currentStep + 1} of {steps.length}
                            </Text>
                        </View>
                        <Text style={[styles.progressPercentage, { color: theme.colors.textSecondary }]}>
                            {Math.round(((currentStep + 1) / steps.length) * 100)}%
                        </Text>
                    </View>
                    <View style={[styles.progressBar, { backgroundColor: theme.colors.surface }]}>
                        <Animated.View
                            style={[
                                styles.progressFill,
                                {
                                    width: progressAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0%', '100%'],
                                    }),
                                }
                            ]}
                        >
                            <LinearGradient
                                colors={[theme.colors.primary, theme.colors.primaryLight]}
                                style={styles.progressGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            />
                        </Animated.View>
                    </View>
                </View>
            </BlurView>

            {/* Step Indicators */}
            {renderStepIndicators()}

            {/* Form Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.stepHeader}>
                    <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
                        {steps[currentStep].title}
                    </Text>
                    <Text style={[styles.stepSubtitle, { color: theme.colors.textSecondary }]}>
                        {steps[currentStep].subtitle}
                    </Text>
                </View>

                {currentStep === 0 && renderPersonalInfo()}
                {currentStep === 1 && renderTravelInfo()}
                {currentStep === 2 && renderVerification()}
            </ScrollView>

            {/* Success Overlay */}
            {renderSuccessOverlay()}
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
    backgroundCircle1: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 256,
        height: 256,
        borderRadius: 128,
        opacity: 0.1,
    },
    backgroundCircle2: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 192,
        height: 192,
        borderRadius: 96,
        opacity: 0.1,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    headerSubtitleText: {
        fontSize: 12,
        marginLeft: 4,
    },
    headerRight: {
        flexDirection: 'row',
    },
    progressContainer: {
        marginTop: 8,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    progressPercentage: {
        fontSize: 14,
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
    },
    progressGradient: {
        flex: 1,
        borderRadius: 5,
    },
    stepIndicators: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 24,
        position: 'relative',
    },
    connectionLine: {
        position: 'absolute',
        top: '50%',
        left: 40,
        right: 40,
        height: 2,
        backgroundColor: '#E5E7EB',
        zIndex: 1,
    },
    progressLine: {
        position: 'absolute',
        top: '50%',
        left: 40,
        height: 2,
        zIndex: 2,
    },
    stepIndicator: {
        alignItems: 'center',
        zIndex: 3,
    },
    stepCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    stepLabel: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    stepHeader: {
        alignItems: 'center',
        marginVertical: 24,
    },
    stepTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    stepSubtitle: {
        fontSize: 14,
        textAlign: 'center',
    },
    formContainer: {
        paddingBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    pickerContainer: {
        height: 50,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    pickerText: {
        fontSize: 16,
    },
    photoButton: {
        height: 120,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoButtonText: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 8,
    },
    photoButtonSubtext: {
        fontSize: 12,
        marginTop: 4,
    },
    securityNotice: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginTop: 16,
    },
    securityNoticeText: {
        flex: 1,
        marginLeft: 12,
    },
    securityTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    securityDescription: {
        fontSize: 12,
        lineHeight: 16,
    },
    navigationContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
    },
    backButton: {
        flex: 0.3,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    nextButton: {
        height: 50,
        borderRadius: 12,
        overflow: 'hidden',
    },
    nextButtonGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    successOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successContainer: {
        alignItems: 'center',
        padding: 32,
    },
    successIcon: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    successSubtitle: {
        fontSize: 16,
        textAlign: 'center',
    },
});