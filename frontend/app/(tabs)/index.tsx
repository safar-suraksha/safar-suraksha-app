import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider } from './components/ThemeProvider';
import { OnboardingScreen } from './components/OnboardingScreen';
import { DigitalIDCard } from './components/DigitalIDCard';
import { Dashboard } from './components/Dashboard';
import { GeoFenceWarning } from './components/GeoFenceWarning';
import { LiveTrackingMap } from './components/LiveTrackingMap';
import { SettingsScreen } from './components/SettingsScreen';
import { EmergencyCallScreen } from './components/EmergencyCallScreen';
import { ChatSupportScreen } from './components/ChatSupportScreen';
import { ReportIssueScreen } from './components/ReportIssueScreen';



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

export default function App() {
  const [userData, setUserData] = useState<any>(null);
  const [showWarning, setShowWarning] = useState(false);

  const handleOnboardingComplete = (data: OnboardingData) => {
    setUserData({
      fullName: data.personalInfo.fullName,
      email: data.personalInfo.email,
      phone: data.personalInfo.phone,
      nationality: data.personalInfo.nationality,
      destination: data.travelInfo.destination,
      registrationDate: new Date().toLocaleDateString('en-IN'),
      safetyScore: 85,
      verificationLevel: 'gold' as const,
      currentLocation: 'Connaught Place, New Delhi',
      emergencyContacts: [data.travelInfo.emergencyContact]
    });
  };

  const warningData = {
    zone: 'Old Delhi Market Area',
    riskLevel: 'high' as const,
    description: 'High crime rate area with frequent pickpocketing incidents. Poor lighting and crowded streets.',
    distance: '200m ahead',
    estimatedTime: '3 minutes',
    recommendations: [
      'Avoid carrying valuable items visibly',
      'Stay in groups and well-lit areas',
      'Use alternative route via Main Road',
      'Contact tourist police if needed'
    ],
    emergencyContacts: ['Tourist Helpline: 1363', 'Local Police: 100']
  };

  return (
    <div className="min-h-screen w-full professional-bg">
      <ThemeProvider>
        <Router>
          <Routes>
            {!userData ? (
              <Route 
                path="/*" 
                element={
                  <OnboardingScreen 
                    onComplete={handleOnboardingComplete} 
                  />
                }
              />
            ) : (
              <>
                <Route 
                  path="/" 
                  element={
                    <Dashboard 
                      userData={userData}
                    />
                  }
                />
                <Route 
                  path="/digital-id" 
                  element={
                    <DigitalIDCard 
                      userData={userData}
                    />
                  }
                />
                <Route 
                  path="/live-map" 
                  element={
                    <LiveTrackingMap 
                      onShowWarning={() => setShowWarning(true)}
                    />
                  }
                />
                <Route 
                  path="/settings" 
                  element={<SettingsScreen />}
                />
                <Route 
                  path="/emergency-call" 
                  element={
                    <EmergencyCallScreen 
                      userData={userData}
                    />
                  }
                />
                <Route 
                  path="/chat-support" 
                  element={
                    <ChatSupportScreen 
                      userData={userData}
                    />
                  }
                />
                <Route 
                  path="/report-issue" 
                  element={
                    <ReportIssueScreen 
                      userData={userData}
                    />
                  }
                />
                <Route path="/*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
          
          <GeoFenceWarning 
            isOpen={showWarning}
            onClose={() => setShowWarning(false)}
            warningData={warningData}
          />
        </Router>
      </ThemeProvider>
    </div>
  );
}