"use client"

import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database,
  Monitor,
  Smartphone,
  Wifi,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload,
  Trash2,
  Edit,
  Save,
  Camera,
  Globe,
  Palette,
  Volume2
} from 'lucide-react';

export function Settings() {
  const [notifications, setNotifications] = useState({
    sosAlerts: true,
    newTourists: false,
    systemUpdates: true,
    emergencyOnly: false,
    emailNotifications: true,
    pushNotifications: true,
    soundAlerts: true
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: true,
    biometricLogin: false,
    sessionTimeout: 30,
    autoLock: true,
    blockchainSync: true
  });

  const [display, setDisplay] = useState({
    darkMode: true,
    neonAccents: true,
    animations: true,
    highContrast: false,
    fontSize: 'medium',
    glassEffect: true
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Inspector Sarah Chen',
    badgeId: 'SC-2024',
    department: 'Tourist Safety Division',
    email: 'sarah.chen@police.gov',
    phone: '+1-555-0123',
    location: 'Manhattan Command Center'
  });

  const systemInfo = [
    { label: 'System Version', value: 'SurakshaNet v3.2.1' },
    { label: 'Last Update', value: 'January 15, 2024' },
    { label: 'Database Status', value: 'Online', status: 'success' },
    { label: 'Blockchain Sync', value: '99.8%', status: 'success' },
    { label: 'Network Status', value: 'Secure Connection', status: 'success' },
    { label: 'Backup Status', value: 'Last backup: 2 hours ago', status: 'success' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-20 h-20 border-2 border-primary/30">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/20 text-lg text-foreground">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 w-8 h-8 hover-glow"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-foreground">{profileData.name}</h2>
                  <div className="flex items-center space-x-2">
                    <Badge className="neon-glow">ACTIVE</Badge>
                    <Badge variant="outline">Admin Level</Badge>
                  </div>
                </div>
                <p className="text-muted-foreground mb-1">Badge ID: {profileData.badgeId} • {profileData.department}</p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span>{profileData.location}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Verified Officer</span>
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="glass">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass hover-glow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-foreground" />
                    <span>Personal Information</span>
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    className="hover-glow"
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="glass border-border/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="badge">Badge ID</Label>
                      <Input
                        id="badge"
                        value={profileData.badgeId}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({ ...profileData, badgeId: e.target.value })}
                        className="glass border-border/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={profileData.department}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                        className="glass border-border/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="glass border-border/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="glass border-border/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Primary Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className="glass border-border/50"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-foreground" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">SOS Emergency Alerts</Label>
                      <p className="text-sm text-muted-foreground">Receive immediate notifications for SOS emergencies</p>
                    </div>
                    <Switch
                      checked={notifications.sosAlerts}
                      onCheckedChange={(checked: any) => 
                        setNotifications({ ...notifications, sosAlerts: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">New Tourist Registrations</Label>
                      <p className="text-sm text-muted-foreground">Get notified when new tourists register in your area</p>
                    </div>
                    <Switch
                      checked={notifications.newTourists}
                      onCheckedChange={(checked: any) => 
                        setNotifications({ ...notifications, newTourists: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">System Updates</Label>
                      <p className="text-sm text-muted-foreground">Notifications about system updates and maintenance</p>
                    </div>
                    <Switch
                      checked={notifications.systemUpdates}
                      onCheckedChange={(checked: any) => 
                        setNotifications({ ...notifications, systemUpdates: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Emergency Only Mode</Label>
                      <p className="text-sm text-muted-foreground">Only receive critical emergency notifications</p>
                    </div>
                    <Switch
                      checked={notifications.emergencyOnly}
                      onCheckedChange={(checked: any) => 
                        setNotifications({ ...notifications, emergencyOnly: checked })
                      }
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Delivery Methods</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4" />
                        <span className="text-sm">Push Notifications</span>
                      </div>
                      <Switch
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked: any) => 
                          setNotifications({ ...notifications, pushNotifications: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div className="flex items-center space-x-2">
                        <Volume2 className="w-4 h-4" />
                        <span className="text-sm">Sound Alerts</span>
                      </div>
                      <Switch
                        checked={notifications.soundAlerts}
                        onCheckedChange={(checked: any) => 
                          setNotifications({ ...notifications, soundAlerts: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4" />
                        <span className="text-sm">Email Alerts</span>
                      </div>
                      <Switch
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked: any) => 
                          setNotifications({ ...notifications, emailNotifications: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-foreground" />
                  <span>Security Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={security.twoFactorAuth}
                      onCheckedChange={(checked: any) => 
                        setSecurity({ ...security, twoFactorAuth: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Biometric Login</Label>
                      <p className="text-sm text-muted-foreground">Use fingerprint or face recognition for login</p>
                    </div>
                    <Switch
                      checked={security.biometricLogin}
                      onCheckedChange={(checked: any) => 
                        setSecurity({ ...security, biometricLogin: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Auto Screen Lock</Label>
                      <p className="text-sm text-muted-foreground">Automatically lock screen when inactive</p>
                    </div>
                    <Switch
                      checked={security.autoLock}
                      onCheckedChange={(checked: any) => 
                        setSecurity({ ...security, autoLock: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Real-time Blockchain Sync</Label>
                      <p className="text-sm text-muted-foreground">Keep blockchain data synchronized in real-time</p>
                    </div>
                    <Switch
                      checked={security.blockchainSync}
                      onCheckedChange={(checked: any) => 
                        setSecurity({ ...security, blockchainSync: checked })
                      }
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Account Actions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="hover-glow">
                      <Key className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="hover-glow">
                      <Download className="w-4 h-4 mr-2" />
                      Download Security Log
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="display" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5 text-foreground" />
                  <span>Display & Appearance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Use dark theme for better visibility in low light</p>
                    </div>
                    <Switch
                      checked={display.darkMode}
                      onCheckedChange={(checked: any) => 
                        setDisplay({ ...display, darkMode: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Neon Blue Accents</Label>
                      <p className="text-sm text-muted-foreground">Enable neon blue accent colors and glows</p>
                    </div>
                    <Switch
                      checked={display.neonAccents}
                      onCheckedChange={(checked: any) => 
                        setDisplay({ ...display, neonAccents: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Glassmorphism Effects</Label>
                      <p className="text-sm text-muted-foreground">Enable glass-like transparency effects</p>
                    </div>
                    <Switch
                      checked={display.glassEffect}
                      onCheckedChange={(checked: any) => 
                        setDisplay({ ...display, glassEffect: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Smooth Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable smooth transitions and animations</p>
                    </div>
                    <Switch
                      checked={display.animations}
                      onCheckedChange={(checked: any) => 
                        setDisplay({ ...display, animations: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">High Contrast Mode</Label>
                      <p className="text-sm text-muted-foreground">Increase contrast for better accessibility</p>
                    </div>
                    <Switch
                      checked={display.highContrast}
                      onCheckedChange={(checked: any) => 
                        setDisplay({ ...display, highContrast: checked })
                      }
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <Label className="font-medium">Font Size</Label>
                  <p className="text-sm text-muted-foreground mb-3">Adjust the size of text throughout the application</p>
                  <div className="grid grid-cols-3 gap-3">
                    {['small', 'medium', 'large'].map((size) => (
                      <Button
                        key={size}
                        variant={display.fontSize === size ? 'default' : 'outline'}
                        className="hover-glow capitalize"
                        onClick={() => setDisplay({ ...display, fontSize: size })}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="w-5 h-5 text-foreground" />
                  <span>System Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {systemInfo.map((info, index) => (
                    <motion.div
                      key={info.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                    >
                      <div>
                        <p className="text-sm text-muted-foreground">{info.label}</p>
                        <p className="font-medium">{info.value}</p>
                      </div>
                      {info.status === 'success' && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-foreground" />
                  <span>Data Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="hover-glow">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="hover-glow">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Settings
                  </Button>
                  <Button variant="destructive" className="hover-glow">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Cache
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}