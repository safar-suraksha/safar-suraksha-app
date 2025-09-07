"use client"

import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Phone, 
  Shield,
  CheckCircle,
  X,
  MoreHorizontal,
  Filter
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SOSAlert {
  id: string;
  type: 'medical' | 'safety' | 'lost' | 'emergency';
  location: string;
  timestamp: string;
  status: 'active' | 'responding' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  touristInfo: {
    name: string;
    phone: string;
    group?: string;
  };
  assignedOfficer?: string;
  description: string;
}

const mockAlerts: SOSAlert[] = [
  {
    id: 'SOS-001',
    type: 'medical',
    location: 'Central Park, Near Bethesda Fountain',
    timestamp: '2024-01-15 14:23:15',
    status: 'active',
    priority: 'critical',
    touristInfo: {
      name: 'Emma Johnson',
      phone: '+1-555-0123',
      group: 'Family Tour A'
    },
    description: 'Tourist experiencing chest pain, conscious but distressed'
  },
  {
    id: 'SOS-002',
    type: 'lost',
    location: 'Times Square, Near Red Steps',
    timestamp: '2024-01-15 14:18:42',
    status: 'responding',
    priority: 'medium',
    touristInfo: {
      name: 'Carlos Rodriguez',
      phone: '+1-555-0456'
    },
    assignedOfficer: 'Officer Davis',
    description: 'Lost tourist, separated from group, unfamiliar with area'
  },
  {
    id: 'SOS-003',
    type: 'safety',
    location: 'Brooklyn Bridge Walkway',
    timestamp: '2024-01-15 14:15:30',
    status: 'resolved',
    priority: 'high',
    touristInfo: {
      name: 'Sarah Kim',
      phone: '+1-555-0789',
      group: 'Photography Group'
    },
    assignedOfficer: 'Officer Johnson',
    description: 'Harassment incident, resolved, suspect detained'
  }
];

export function SOSAlerts() {
  const [selectedAlert, setSelectedAlert] = useState<SOSAlert | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500/20 text-red-400';
      case 'responding': return 'bg-blue-500/20 text-blue-400';
      case 'resolved': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medical': return '🏥';
      case 'safety': return '🚨';
      case 'lost': return '🔍';
      case 'emergency': return '⚠️';
      default: return '📢';
    }
  };

  const filteredAlerts = mockAlerts.filter(alert => {
    const statusMatch = statusFilter === 'all' || alert.status === statusFilter;
    const priorityMatch = priorityFilter === 'all' || alert.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Alerts', value: mockAlerts.filter(a => a.status === 'active').length, color: 'text-red-400' },
          { label: 'Responding', value: mockAlerts.filter(a => a.status === 'responding').length, color: 'text-blue-400' },
          { label: 'Resolved Today', value: mockAlerts.filter(a => a.status === 'resolved').length, color: 'text-green-400' },
          { label: 'Critical Priority', value: mockAlerts.filter(a => a.priority === 'critical').length, color: 'text-orange-400' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass hover-glow">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-foreground" />
              <div className="flex space-x-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1 rounded-lg bg-secondary/50 border border-border text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="responding">Responding</option>
                  <option value="resolved">Resolved</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-1 rounded-lg bg-secondary/50 border border-border text-sm"
                >
                  <option value="all">All Priority</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alerts Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="glass hover-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-foreground" />
              <span>SOS Alerts</span>
              <Badge className="neon-glow">{filteredAlerts.length} alerts</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Tourist Info</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Officer</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert, index) => (
                  <motion.tr
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="hover:bg-secondary/30 cursor-pointer"
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getTypeIcon(alert.type)}</span>
                        <span className="capitalize">{alert.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{alert.touristInfo.name}</p>
                        <p className="text-xs text-muted-foreground">{alert.touristInfo.phone}</p>
                        {alert.touristInfo.group && (
                          <p className="text-xs text-primary">{alert.touristInfo.group}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{alert.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(alert.priority)}>
                        {alert.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(alert.status)}>
                        {alert.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {alert.assignedOfficer ? (
                        <div className="flex items-center space-x-1">
                          <Shield className="w-4 h-4 text-foreground" />
                          <span className="text-sm">{alert.assignedOfficer}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover-glow">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="glass-strong">
                          <DropdownMenuItem className="hover:bg-accent/20">
                            <Phone className="w-4 h-4 mr-2" />
                            Call Tourist
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-accent/20">
                            <Shield className="w-4 h-4 mr-2" />
                            Assign Officer
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-accent/20">
                            <MapPin className="w-4 h-4 mr-2" />
                            View on Map
                          </DropdownMenuItem>
                          {alert.status !== 'resolved' && (
                            <DropdownMenuItem className="hover:bg-green-500/20 text-green-400">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Resolved
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alert Details Modal */}
      {selectedAlert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedAlert(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="glass-strong">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-2xl">{getTypeIcon(selectedAlert.type)}</span>
                    <span>Alert {selectedAlert.id}</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedAlert(null)}
                    className="hover-glow"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tourist</p>
                    <p className="font-medium">{selectedAlert.touristInfo.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedAlert.touristInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(selectedAlert.status)}>
                      {selectedAlert.status}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>{selectedAlert.location}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{selectedAlert.description}</p>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button className="hover-glow">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Tourist
                  </Button>
                  <Button variant="outline" className="hover-glow">
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                  {selectedAlert.status !== 'resolved' && (
                    <Button variant="outline" className="hover-glow">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}