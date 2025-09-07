"use client"

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  MapPin, 
  Users, 
  Shield, 
  AlertTriangle, 
  Navigation,
  Zap,
  Eye,
  Filter,
  Plus,
  Camera,
  Phone
} from 'lucide-react';
import { apiService } from '@/services/api';
import { showSuccess, showError, showLoading, dismissToast } from '@/services/toast';

interface MapMarker {
  id: string;
  type: 'officer' | 'tourist' | 'alert' | 'camera';
  position: { lat: number; lng: number };
  label: string;
  status: string;
  info?: string;
}

const mockMarkers: MapMarker[] = [
  { id: '1', type: 'officer', position: { lat: 40.7589, lng: -73.9851 }, label: 'Officer Johnson', status: 'active' },
  { id: '2', type: 'officer', position: { lat: 40.7614, lng: -73.9776 }, label: 'Officer Davis', status: 'patrol' },
  { id: '3', type: 'tourist', position: { lat: 40.7505, lng: -73.9934 }, label: 'Tourist Group A', status: 'safe', info: '15 members' },
  { id: '4', type: 'alert', position: { lat: 40.7580, lng: -73.9855 }, label: 'Medical Emergency', status: 'critical' },
  { id: '5', type: 'camera', position: { lat: 40.7549, lng: -73.9840 }, label: 'CCTV-001', status: 'online' },
];

export function MapView() {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [isLive, setIsLive] = useState(true);
  const [markers, setMarkers] = useState<MapMarker[]>(mockMarkers);
  const [officers, setOfficers] = useState<any[]>([]);
  const [isCreateAlertOpen, setIsCreateAlertOpen] = useState(false);
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [isCameraViewOpen, setIsCameraViewOpen] = useState(false);

  useEffect(() => {
    loadMapData();
    loadOfficers();
  }, []);

  const loadMapData = async () => {
    try {
      const mapMarkers = await apiService.getMapMarkers(filterType);
      setMarkers(mapMarkers);
    } catch (error) {
      console.error('Failed to load map data:', error);
    }
  };

  const loadOfficers = async () => {
    try {
      const officersData = await apiService.getOfficers();
      setOfficers(officersData);
    } catch (error) {
      console.error('Failed to load officers:', error);
    }
  };

  const handleCreateAlert = async (alertData: any) => {
    const loadingId = showLoading('Creating alert...');
    try {
      await apiService.createSOSAlert(alertData);
      showSuccess('Alert created successfully', 'Emergency responders have been notified');
      setIsCreateAlertOpen(false);
      loadMapData();
    } catch (error) {
      showError('Failed to create alert', 'Please try again');
    } finally {
      dismissToast(loadingId);
    }
  };

  const handleDispatchOfficer = async (officerId: string, location: string) => {
    const loadingId = showLoading('Dispatching officer...');
    try {
      const officer = officers.find(o => o.id === officerId);
      await apiService.dispatchOfficer(officerId, selectedMarker?.id, location);
      showSuccess('Officer dispatched', `${officer?.name} is en route to location`);
      setIsDispatchOpen(false);
      loadMapData();
      loadOfficers();
    } catch (error) {
      showError('Failed to dispatch officer', 'Please try again');
    } finally {
      dismissToast(loadingId);
    }
  };

  const handleNavigateToLocation = (marker: MapMarker) => {
    showInfo('Navigation activated', `Directing to ${marker.label} location`);
    // In a real app, this would integrate with mapping services
  };

  const handleViewAllCameras = async () => {
    const loadingId = showLoading('Loading camera feeds...');
    try {
      const cameras = await apiService.getCameras();
      setIsCameraViewOpen(true);
      showSuccess('Camera feeds loaded', `${cameras.length} cameras available`);
    } catch (error) {
      showError('Failed to load cameras', 'Please try again');
    } finally {
      dismissToast(loadingId);
    }
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'officer': return Shield;
      case 'tourist': return Users;
      case 'alert': return AlertTriangle;
      case 'camera': return Eye;
      default: return MapPin;
    }
  };

  const getMarkerColor = (type: string, status: string) => {
    if (type === 'alert') return 'text-red-400';
    if (type === 'officer') return 'text-blue-400';
    if (type === 'tourist') return 'text-green-400';
    if (type === 'camera') return 'text-purple-400';
    return 'text-white';
  };



  const filteredMarkers = filterType === 'all' 
    ? markers 
    : markers.filter(marker => marker.type === filterType);

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      {/* Map Area */}
      <div className="lg:col-span-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass hover-glow h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-foreground" />
                  <span>Live City Map</span>
                  {isLive && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Badge variant="destructive" className="neon-glow">
                        <Zap className="w-3 h-3 mr-1" />
                        LIVE
                      </Badge>
                    </motion.div>
                  )}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant={filterType === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('all')}
                    className="hover-glow"
                  >
                    All
                  </Button>
                  <Button
                    variant={filterType === 'officer' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('officer')}
                    className="hover-glow"
                  >
                    Officers
                  </Button>
                  <Button
                    variant={filterType === 'tourist' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('tourist')}
                    className="hover-glow"
                  >
                    Tourists
                  </Button>
                  <Button
                    variant={filterType === 'alert' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType('alert')}
                    className="hover-glow"
                  >
                    Alerts
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Simulated Map */}
              <div className="relative w-full h-96 lg:h-[500px] bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg border border-primary/30 overflow-hidden">
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-10 grid-rows-10 h-full">
                    {Array.from({ length: 100 }).map((_, i) => (
                      <div key={i} className="border border-primary/10" />
                    ))}
                  </div>
                </div>

                {/* Map Markers */}
                {filteredMarkers.map((marker, index) => {
                  const Icon = getMarkerIcon(marker.type);
                  return (
                    <motion.div
                      key={marker.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="absolute cursor-pointer"
                      style={{
                        left: `${((marker.position.lng + 74) * 1000) % 85 + 5}%`,
                        top: `${((marker.position.lat - 40.75) * 2000) % 85 + 5}%`,
                      }}
                      onClick={() => setSelectedMarker(marker)}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 rounded-full glass-strong border-2 ${
                          selectedMarker?.id === marker.id ? 'border-primary neon-glow' : 'border-border'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${getMarkerColor(marker.type, marker.status)}`} />
                      </motion.div>
                      
                      {/* Pulse animation for active alerts */}
                      {marker.type === 'alert' && (
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-red-400"
                          animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        />
                      )}
                    </motion.div>
                  );
                })}

                {/* Navigation Controls */}
                <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                  <Button size="icon" variant="outline" className="glass hover-glow">
                    <Navigation className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="glass hover-glow">
                    +
                  </Button>
                  <Button size="icon" variant="outline" className="glass hover-glow">
                    -
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Side Panel */}
      <div className="space-y-6">
        {/* Map Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass hover-glow">
            <CardHeader>
              <CardTitle className="text-lg">Live Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Officers</span>
                <span className="font-bold text-foreground">
                  {mockMarkers.filter(m => m.type === 'officer').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tourist Groups</span>
                <span className="font-bold text-green-400">
                  {mockMarkers.filter(m => m.type === 'tourist').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Alerts</span>
                <span className="font-bold text-red-400">
                  {mockMarkers.filter(m => m.type === 'alert').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">CCTV Cameras</span>
                <span className="font-bold text-purple-400">
                  {mockMarkers.filter(m => m.type === 'camera').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Selected Marker Info */}
        {selectedMarker && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass hover-glow">
              <CardHeader>
                <CardTitle className="text-lg">Marker Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{selectedMarker.label}</p>
                  <p className="text-sm text-muted-foreground">
                    Type: {selectedMarker.type}
                  </p>
                </div>
                <Badge
                  variant={selectedMarker.status === 'critical' ? 'destructive' : 'default'}
                  className={selectedMarker.status === 'active' ? 'neon-glow' : ''}
                >
                  {selectedMarker.status}
                </Badge>
                {selectedMarker.info && (
                  <p className="text-sm">{selectedMarker.info}</p>
                )}
                <Button 
                  className="w-full hover-glow" 
                  size="sm"
                  onClick={() => handleNavigateToLocation(selectedMarker)}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Navigate to Location
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass hover-glow">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Dialog open={isCreateAlertOpen} onOpenChange={setIsCreateAlertOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full hover-glow" variant="outline">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Create Alert
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-strong">
                  <DialogHeader>
                    <DialogTitle>Create Emergency Alert</DialogTitle>
                  </DialogHeader>
                  <CreateAlertForm onSubmit={handleCreateAlert} />
                </DialogContent>
              </Dialog>

              <Dialog open={isDispatchOpen} onOpenChange={setIsDispatchOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full hover-glow" variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Dispatch Officer
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-strong">
                  <DialogHeader>
                    <DialogTitle>Dispatch Officer</DialogTitle>
                  </DialogHeader>
                  <DispatchOfficerForm officers={officers} onSubmit={handleDispatchOfficer} />
                </DialogContent>
              </Dialog>

              <Button 
                className="w-full hover-glow" 
                variant="outline"
                onClick={handleViewAllCameras}
              >
                <Eye className="w-4 h-4 mr-2" />
                View All Cameras
              </Button>

              <Dialog open={isCameraViewOpen} onOpenChange={setIsCameraViewOpen}>
                <DialogContent className="glass-strong max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>CCTV Camera Network</DialogTitle>
                  </DialogHeader>
                  <CameraGrid />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Create Alert Form Component
function CreateAlertForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    type: 'emergency',
    priority: 'high',
    location: '',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    description: '',
    touristInfo: {
      name: '',
      phone: '',
      group: ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Alert Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
            <SelectTrigger className="glass">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-strong">
              <SelectItem value="medical">Medical Emergency</SelectItem>
              <SelectItem value="safety">Safety Concern</SelectItem>
              <SelectItem value="lost">Lost Person</SelectItem>
              <SelectItem value="emergency">General Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
            <SelectTrigger className="glass">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-strong">
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          className="glass"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          placeholder="Enter location details"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          className="glass"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Describe the emergency situation"
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Tourist Information (if applicable)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            className="glass"
            value={formData.touristInfo.name}
            onChange={(e) => setFormData({...formData, touristInfo: {...formData.touristInfo, name: e.target.value}})}
            placeholder="Tourist name"
          />
          <Input
            className="glass"
            value={formData.touristInfo.phone}
            onChange={(e) => setFormData({...formData, touristInfo: {...formData.touristInfo, phone: e.target.value}})}
            placeholder="Phone number"
          />
        </div>
      </div>

      <Button type="submit" className="w-full neon-glow">
        <AlertTriangle className="w-4 h-4 mr-2" />
        Create Alert
      </Button>
    </form>
  );
}

// Dispatch Officer Form Component
function DispatchOfficerForm({ officers, onSubmit }: { officers: any[], onSubmit: (officerId: string, location: string) => void }) {
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [location, setLocation] = useState('');

  const availableOfficers = officers.filter(officer => 
    officer.status === 'available' || officer.status === 'patrol'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOfficer && location) {
      onSubmit(selectedOfficer, location);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="officer">Select Officer</Label>
        <Select value={selectedOfficer} onValueChange={setSelectedOfficer}>
          <SelectTrigger className="glass">
            <SelectValue placeholder="Choose an available officer" />
          </SelectTrigger>
          <SelectContent className="glass-strong">
            {availableOfficers.map((officer) => (
              <SelectItem key={officer.id} value={officer.id}>
                {officer.name} - {officer.badge} ({officer.status})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="location">Destination</Label>
        <Input
          id="location"
          className="glass"
          value={location}  
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter dispatch location"
          required
        />
      </div>

      <Button type="submit" className="w-full neon-glow" disabled={!selectedOfficer || !location}>
        <Shield className="w-4 h-4 mr-2" />
        Dispatch Officer
      </Button>
    </form>
  );
}

// Camera Grid Component
function CameraGrid() {
  const [cameras, setCameras] = useState<any[]>([]);

  useEffect(() => {
    loadCameras();
  }, []);

  const loadCameras = async () => {
    try {
      const cameraData = await apiService.getCameras();
      setCameras(cameraData);
    } catch (error) {
      console.error('Failed to load cameras:', error);
    }
  };

  const handleViewCamera = async (cameraId: string) => {
    try {
      const response = await apiService.viewCamera(cameraId);
      showInfo('Camera feed opened', 'Connecting to live stream...');
    } catch (error) {
      showError('Failed to connect to camera', 'Stream may be unavailable');
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
      {cameras.map((camera) => (
        <Card key={camera.id} className="glass hover-glow">
          <CardContent className="p-4">
            <div className="aspect-video bg-black/50 rounded mb-3 flex items-center justify-center">
              <Camera className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="font-medium text-sm">{camera.name}</p>
              <p className="text-xs text-muted-foreground">{camera.location}</p>
              <Badge variant={camera.status === 'online' ? 'default' : 'secondary'} className="text-xs">
                {camera.status}
              </Badge>
              <Button 
                size="sm" 
                className="w-full" 
                variant="outline"
                onClick={() => handleViewCamera(camera.id)}
                disabled={camera.status !== 'online'}
              >
                <Eye className="w-3 h-3 mr-1" />
                View Live
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}