"use client"

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Search, User, LogOut, Moon, Sun, AlertTriangle, CheckCircle, Clock, MapPin, Shield, X, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'emergency' | 'info' | 'warning' | 'success';
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface TopBarProps {
  activeScreen: string;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export function TopBar({ activeScreen, isDarkMode, toggleTheme }: TopBarProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Emergency SOS Alert',
      message: 'Tourist in distress reported at Central Park. Immediate assistance required.',
      type: 'emergency',
      timestamp: '2 minutes ago',
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      title: 'New Tourist Registration',
      message: 'John Doe has completed KYC verification and registered for tourist services.',
      type: 'success',
      timestamp: '15 minutes ago',
      read: false,
      priority: 'medium'
    },
    {
      id: '3',
      title: 'System Maintenance',
      message: 'Scheduled maintenance for blockchain verification system at 2:00 AM.',
      type: 'info',
      timestamp: '1 hour ago',
      read: true,
      priority: 'low'
    },
    {
      id: '4',
      title: 'Incident Report Filed',
      message: 'Officer Martinez has filed a new incident report for Times Square theft case.',
      type: 'info',
      timestamp: '2 hours ago',
      read: true,
      priority: 'medium'
    },
    {
      id: '5',
      title: 'Security Alert',
      message: 'Unusual activity detected in tourist verification system. Investigation ongoing.',
      type: 'warning',
      timestamp: '3 hours ago',
      read: false,
      priority: 'high'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close notification dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getScreenTitle = (screen: string) => {
    const titles: Record<string, string> = {
      dashboard: 'Command Center Overview',
      map: 'Real-time Location Tracking',
      sos: 'Emergency Response Center',
      kyc: 'Identity Verification System',
      reports: 'Incident Analysis & Reports',
      chat: 'Secure Communication Hub',
      blockchain: 'Blockchain Audit Trail',
      settings: 'System Configuration',
    };
    return titles[screen] || 'Command Center';
  };

  return (
    <motion.div
      className="glass h-16 flex items-center justify-between px-6 border-b border-border"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Screen Title */}
      <motion.div
        key={activeScreen}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-foreground">{getScreenTitle(activeScreen)}</h2>
      </motion.div>

      {/* Search and Actions */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search incidents, tourists, reports..."
            className="pl-10 w-80 glass border-border/50 focus:border-primary"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover-glow"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <Bell className="w-5 h-5 text-foreground" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs neon-glow animate-pulse"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </motion.div>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {isNotificationOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-12 right-0 z-50"
              >
                <Card className="glass-strong w-80 max-h-96 shadow-2xl border border-primary/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Bell className="w-5 h-5 text-foreground" />
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                          <Badge className="neon-glow">{unreadCount} new</Badge>
                        )}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsNotificationOpen(false)}
                        className="hover-glow w-8 h-8"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <Separator />
                  <ScrollArea className="max-h-80">
                    <CardContent className="p-0">
                      {notifications.length > 0 ? (
                        <div className="space-y-1">
                          {notifications.map((notification, index) => (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`p-3 hover:bg-secondary/30 cursor-pointer transition-colors border-l-2 ${
                                notification.read ? 'opacity-70 border-l-transparent' : 'border-l-primary'
                              } ${
                                notification.type === 'emergency' ? 'bg-red-500/10' :
                                notification.type === 'warning' ? 'bg-yellow-500/10' :
                                notification.type === 'success' ? 'bg-green-500/10' : ''
                              }`}
                              onClick={() => {
                                setNotifications(prev => prev.map(n => 
                                  n.id === notification.id ? { ...n, read: true } : n
                                ));
                              }}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 mt-1">
                                  {notification.type === 'emergency' && (
                                    <AlertTriangle className="w-4 h-4 text-red-400" />
                                  )}
                                  {notification.type === 'warning' && (
                                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                  )}
                                  {notification.type === 'success' && (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                  )}
                                  {notification.type === 'info' && (
                                    <Shield className="w-4 h-4 text-blue-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className={`text-sm font-medium truncate ${!notification.read ? 'text-foreground' : ''}`}>
                                      {notification.title}
                                    </p>
                                    <Badge 
                                      variant={notification.priority === 'high' ? 'destructive' : 'secondary'}
                                      className="text-xs"
                                    >
                                      {notification.priority}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>{notification.timestamp}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <Bell className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">No notifications</p>
                        </div>
                      )}
                    </CardContent>
                  </ScrollArea>
                  {notifications.length > 0 && (
                    <>
                      <Separator />
                      <div className="p-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full hover-glow"
                          onClick={() => {
                            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                          }}
                        >
                          Mark All as Read
                        </Button>
                      </div>
                    </>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover-glow"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-blue-400" />
            )}
          </Button>
        </motion.div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" className="flex items-center space-x-2 hover-glow">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-foreground" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-foreground">Inspector Sarah Chen</p>
                  <p className="text-xs text-muted-foreground">Badge #SC-2024</p>
                </div>
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 glass-strong">
            <DropdownMenuItem className="hover:bg-accent/20">
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-accent/20">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-destructive/20 text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}