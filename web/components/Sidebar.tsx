"use client"

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  MapPin, 
  AlertTriangle, 
  UserCheck, 
  FileText, 
  MessageCircle, 
  Link, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Activity
} from 'lucide-react';

interface SidebarProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
}

const sidebarItems = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'map', label: 'Live Tracking', icon: MapPin },
  { id: 'sos', label: 'Emergency Alerts', icon: AlertTriangle },
  { id: 'kyc', label: 'Identity Verification', icon: UserCheck },
  { id: 'reports', label: 'Incident Reports', icon: FileText },
  { id: 'chat', label: 'Communication', icon: MessageCircle },
  { id: 'blockchain', label: 'Audit Logs', icon: Link },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

export function Sidebar({ activeScreen, setActiveScreen }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div
      className={`glass-strong h-full flex flex-col p-4 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-3"
          >
            <div className="relative">
              <Shield className="w-8 h-8 text-foreground" />
              <Activity className="w-3 h-3 absolute -top-0.5 -right-0.5 text-green-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">SurakshaNet</h1>
              <p className="text-xs text-muted-foreground">Security Command</p>
            </div>
          </motion.div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-accent/20 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              onClick={() => setActiveScreen(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover-glow ${
                isActive
                  ? 'bg-primary/20 text-primary border-primary/50 neon-glow'
                  : 'hover:bg-accent/20 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-foreground' : ''}`} />
              {!isCollapsed && (
                <span className={isActive ? 'text-foreground' : ''}>{item.label}</span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-auto pt-4 border-t border-border"
        >
          <div className="text-xs text-muted-foreground text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400">System Online</span>
            </div>
            <p className="text-foreground">SurakshaNet v3.2</p>
            <p className="text-xs opacity-70">Blockchain Secured</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}