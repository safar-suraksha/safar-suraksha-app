"use client"

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Users, 
  Shield, 
  AlertTriangle, 
  Navigation,
  Zap,
  Eye,
  Filter
} from 'lucide-react';

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
    ? mockMarkers 
    : mockMarkers.filter(marker => marker.type === filterType);

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
                <Button className="w-full hover-glow" size="sm">
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
              <Button className="w-full hover-glow" variant="outline">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Create Alert
              </Button>
              <Button className="w-full hover-glow" variant="outline">
                <Shield className="w-4 h-4 mr-2" />
                Dispatch Officer
              </Button>
              <Button className="w-full hover-glow" variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View All Cameras
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}