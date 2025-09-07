"use client"

import { useState } from 'react';
import { motion } from 'motion/react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/Topbar';
import { Dashboard } from '@/components/Dashboard';
import { MapView } from '@/components/MapView';
import { SOSAlerts } from '@/components/SOSAlerts';
import { TouristKYC } from '@/components/TouristKYC';
import { Reports } from '@/components/Reports';
import { CommunicationHub } from '@/components/CommunicationHub';
import { BlockchainAudit } from '@/components/BlockchainAudit';
import { Settings } from '@/components/Settings';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'map':
        return <MapView />;
      case 'sos':
        return <SOSAlerts />;
      case 'kyc':
        return <TouristKYC />;
      case 'reports':
        return <Reports />;
      case 'chat':
        return <CommunicationHub />;
      case 'blockchain':
        return <BlockchainAudit />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''} h-screen bg-background overflow-hidden`}>
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-black/50 pointer-events-none" />
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 h-full flex">
        {/* Sidebar */}
        <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <TopBar 
            activeScreen={activeScreen} 
            isDarkMode={isDarkMode}
            toggleTheme={() => setIsDarkMode(!isDarkMode)}
          />

          {/* Content Area */}
          <motion.main
            key={activeScreen}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-auto"
          >
            {renderScreen()}
          </motion.main>
        </div>
      </div>

      <Toaster />
    </div>
  );
}

