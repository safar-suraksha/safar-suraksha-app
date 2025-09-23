import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/onboardingscreen';
import Dashboard from '../screens/dashboard';
import EmergencyCallScreen from '../screens/emergencycallscreen';
import LiveTrackingMap from '../screens/livetrackingmap';
import ChatSupportScreen from '../screens/chatsupportscreen';
import ReportIssueScreen from '../screens/reportissuescreen';
import DigitalIDCard from '../screens/digitalidcard';
import GeoFenceWarning from '../screens/geofencewarning';
import RealisticMap from '../screens/realisticmap';
import SettingsScreen from '../screens/settingsscreen';
import ItinerarySection from '../screens/ItinerarySection';

// Define user data type to avoid repetition
type UserData = {
  fullName: string;
  safetyScore: number;
  currentLocation: string;
  destination: string;
  emergencyContacts: string[];
};

// Updated to include all screen routes with their parameter types
export type RootStackParamList = {
  Onboarding: undefined;
  Dashboard: {
    userData: UserData;
  };
  EmergencyCall: {
    userData: UserData;
  };
  LiveMap: {
    userData: UserData;
  };
  ChatSupport: {
    userData: UserData;
  };
  ReportIssue: {
    userData: UserData;
  };
  DigitalIDCard: {
    userData: UserData;
  };
  GeoFenceWarning: {
    userData: UserData;
    warningType?: string;
    location?: string;
  };
  RealisticMap: {
    userData: UserData;
    destination?: string;
  };
  Settings: {
    userData: UserData;
  };
  // FIXED: Added the missing Itinerary route
  Itinerary: {
    userData: UserData;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Onboarding" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen 
        name="Dashboard" 
        component={Dashboard}
        options={{ gestureEnabled: false }} // Prevent back gesture after onboarding
      />
      <Stack.Screen name="EmergencyCall" component={EmergencyCallScreen} />
      <Stack.Screen name="LiveMap" component={LiveTrackingMap} />
      <Stack.Screen name="ChatSupport" component={ChatSupportScreen} />
      <Stack.Screen name="ReportIssue" component={ReportIssueScreen} />
      <Stack.Screen name="DigitalIDCard" component={DigitalIDCard} />
      <Stack.Screen name="GeoFenceWarning" component={GeoFenceWarning} />
      <Stack.Screen name="RealisticMap" component={RealisticMap} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Itinerary" component={ItinerarySection} />
    </Stack.Navigator>
  );
}

// Export the UserData type for use in other components
export type { UserData };
