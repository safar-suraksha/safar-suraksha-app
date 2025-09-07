"use client"

import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  UserCheck, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Phone,
  Mail,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Globe
} from 'lucide-react';

interface Tourist {
  id: string;
  name: string;
  country: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string;
  hotel: string;
  status: 'verified' | 'pending' | 'flagged' | 'expired';
  groupSize: number;
  emergencyContact: string;
  avatar?: string;
  lastLocation?: string;
  verificationScore: number;
}

const mockTourists: Tourist[] = [
  {
    id: 'T001',
    name: 'Emma Johnson',
    country: 'United Kingdom',
    documentType: 'Passport',
    documentNumber: 'GB123456789',
    email: 'emma.johnson@email.com',
    phone: '+44 7700 900123',
    checkInDate: '2024-01-10',
    checkOutDate: '2024-01-20',
    hotel: 'Grand Central Hotel',
    status: 'verified',
    groupSize: 2,
    emergencyContact: '+44 7700 900124',
    lastLocation: 'Times Square',
    verificationScore: 95
  },
  {
    id: 'T002',
    name: 'Carlos Rodriguez',
    country: 'Spain',
    documentType: 'National ID',
    documentNumber: 'ES987654321',
    email: 'carlos.rodriguez@email.com',
    phone: '+34 600 123 456',
    checkInDate: '2024-01-12',
    checkOutDate: '2024-01-18',
    hotel: 'Manhattan Plaza',
    status: 'pending',
    groupSize: 1,
    emergencyContact: '+34 600 123 457',
    lastLocation: 'Central Park',
    verificationScore: 72
  },
  {
    id: 'T003',
    name: 'Li Wei',
    country: 'China',
    documentType: 'Passport',
    documentNumber: 'CN555666777',
    email: 'li.wei@email.com',
    phone: '+86 138 0013 8000',
    checkInDate: '2024-01-08',
    checkOutDate: '2024-01-25',
    hotel: 'Skyline Suites',
    status: 'flagged',
    groupSize: 4,
    emergencyContact: '+86 138 0013 8001',
    lastLocation: 'Brooklyn Bridge',
    verificationScore: 45
  }
];

export function TouristKYC() {
  const [selectedTourist, setSelectedTourist] = useState<Tourist | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'flagged': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'expired': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return CheckCircle;
      case 'pending': return Clock;
      case 'flagged': return AlertCircle;
      case 'expired': return AlertCircle;
      default: return Clock;
    }
  };

  const getVerificationColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      'United Kingdom': '🇬🇧',
      'Spain': '🇪🇸',
      'China': '🇨🇳',
      'United States': '🇺🇸',
      'France': '🇫🇷',
      'Germany': '🇩🇪',
      'Japan': '🇯🇵'
    };
    return flags[country] || '🌍';
  };

  const filteredTourists = mockTourists.filter(tourist => {
    const searchMatch = tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       tourist.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       tourist.country.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'all' || tourist.status === statusFilter;
    return searchMatch && statusMatch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tourists', value: mockTourists.length, icon: Users, color: 'text-blue-400' },
          { label: 'Verified', value: mockTourists.filter(t => t.status === 'verified').length, icon: CheckCircle, color: 'text-green-400' },
          { label: 'Pending Review', value: mockTourists.filter(t => t.status === 'pending').length, icon: Clock, color: 'text-yellow-400' },
          { label: 'Flagged', value: mockTourists.filter(t => t.status === 'flagged').length, icon: AlertCircle, color: 'text-red-400' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass hover-glow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, document number, or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass border-border/50 focus:border-primary"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-secondary/50 border border-border"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="flagged">Flagged</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tourist Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTourists.map((tourist, index) => {
          const StatusIcon = getStatusIcon(tourist.status);
          return (
            <motion.div
              key={tourist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card 
                className="glass hover-glow cursor-pointer transition-all duration-300"
                onClick={() => setSelectedTourist(tourist)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="border-2 border-primary/30">
                        <AvatarImage src={tourist.avatar} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {tourist.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold">{tourist.name}</h3>
                        <p className="text-sm text-muted-foreground">ID: {tourist.id}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(tourist.status)}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {tourist.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getCountryFlag(tourist.country)}</span>
                    <span className="text-sm">{tourist.country}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Document:</span>
                      <span>{tourist.documentType}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Hotel:</span>
                      <span className="truncate ml-2">{tourist.hotel}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Group:</span>
                      <span>{tourist.groupSize} people</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Verification Score:</span>
                      <span className={`font-bold ${getVerificationColor(tourist.verificationScore)}`}>
                        {tourist.verificationScore}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary/50 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getVerificationColor(tourist.verificationScore).replace('text-', 'bg-')}`}
                        style={{ width: `${tourist.verificationScore}%` }}
                      />
                    </div>
                  </div>

                  {tourist.lastLocation && (
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Last seen:</span>
                      <span>{tourist.lastLocation}</span>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="hover-glow flex-1">
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline" className="hover-glow flex-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      Locate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Tourist Details Modal */}
      {selectedTourist && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTourist(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="glass-strong">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12 border-2 border-primary/30">
                      <AvatarImage src={selectedTourist.avatar} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {selectedTourist.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl">{selectedTourist.name}</h2>
                      <p className="text-sm text-muted-foreground">Tourist ID: {selectedTourist.id}</p>
                    </div>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedTourist(null)}
                    className="hover-glow"
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-foreground">Personal Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span>{getCountryFlag(selectedTourist.country)} {selectedTourist.country}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedTourist.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedTourist.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>Group of {selectedTourist.groupSize} people</span>
                      </div>
                    </div>
                  </div>

                  {/* Document Information */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-foreground">Document Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Document Type</p>
                        <p>{selectedTourist.documentType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Document Number</p>
                        <p className="font-mono">{selectedTourist.documentNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Emergency Contact</p>
                        <p>{selectedTourist.emergencyContact}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stay Information */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-foreground">Stay Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Hotel</p>
                        <p>{selectedTourist.hotel}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedTourist.checkInDate} - {selectedTourist.checkOutDate}</span>
                      </div>
                      {selectedTourist.lastLocation && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>Last seen: {selectedTourist.lastLocation}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-foreground">Verification Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-muted-foreground" />
                        <Badge className={getStatusColor(selectedTourist.status)}>
                          {selectedTourist.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Verification Score</p>
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold ${getVerificationColor(selectedTourist.verificationScore)}`}>
                            {selectedTourist.verificationScore}%
                          </span>
                          <div className="flex-1 bg-secondary/50 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getVerificationColor(selectedTourist.verificationScore).replace('text-', 'bg-')}`}
                              style={{ width: `${selectedTourist.verificationScore}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t border-border">
                  <Button className="hover-glow">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Tourist
                  </Button>
                  <Button variant="outline" className="hover-glow">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="hover-glow">
                    <MapPin className="w-4 h-4 mr-2" />
                    Track Location
                  </Button>
                  <Button variant="outline" className="hover-glow">
                    <Shield className="w-4 h-4 mr-2" />
                    Update Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}