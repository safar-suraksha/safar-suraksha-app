"use client"

import { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Plus,
  Calendar,
  MapPin,
  User,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';

interface IncidentReport {
  id: string;
  title: string;
  type: 'theft' | 'assault' | 'harassment' | 'medical' | 'fraud' | 'lost_property';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'investigating' | 'resolved' | 'closed';
  location: string;
  reportedBy: string;
  assignedOfficer: string;
  dateReported: string;
  lastUpdated: string;
  description: string;
  evidence?: string[];
}

const mockReports: IncidentReport[] = [
  {
    id: 'RPT-2024-001',
    title: 'Tourist Wallet Theft at Times Square',
    type: 'theft',
    severity: 'high',
    status: 'investigating',
    location: 'Times Square, 7th Ave & 42nd St',
    reportedBy: 'John Miller (Tourist)',
    assignedOfficer: 'Officer Davis',
    dateReported: '2024-01-15 09:30:00',
    lastUpdated: '2024-01-15 14:22:00',
    description: 'Tourist reported theft of wallet containing $500 cash, credit cards, and passport while taking photos near Red Steps.',
    evidence: ['CCTV-TS-001.mp4', 'witness-statement-1.pdf']
  },
  {
    id: 'RPT-2024-002',
    title: 'Harassment Incident at Central Park',
    type: 'harassment',
    severity: 'medium',
    status: 'resolved',
    location: 'Central Park, Bethesda Fountain',
    reportedBy: 'Lisa Wong (Tourist)',
    assignedOfficer: 'Officer Johnson',
    dateReported: '2024-01-14 16:45:00',
    lastUpdated: '2024-01-15 11:00:00',
    description: 'Female tourist reported verbal harassment and inappropriate comments from unknown male individual.',
    evidence: ['incident-photo-001.jpg', 'witness-contact.txt']
  },
  {
    id: 'RPT-2024-003',
    title: 'Medical Emergency - Brooklyn Bridge',
    type: 'medical',
    severity: 'critical',
    status: 'resolved',
    location: 'Brooklyn Bridge Pedestrian Walkway',
    reportedBy: 'Emergency Services',
    assignedOfficer: 'Sergeant Martinez',
    dateReported: '2024-01-13 14:20:00',
    lastUpdated: '2024-01-13 15:45:00',
    description: 'Tourist collapsed due to heat exhaustion. Ambulance dispatched, patient hospitalized and stable.',
    evidence: ['medical-report.pdf', 'ems-log.txt']
  }
];

const monthlyData = [
  { month: 'Jul', incidents: 45, resolved: 42 },
  { month: 'Aug', incidents: 52, resolved: 48 },
  { month: 'Sep', incidents: 38, resolved: 37 },
  { month: 'Oct', incidents: 61, resolved: 55 },
  { month: 'Nov', incidents: 49, resolved: 47 },
  { month: 'Dec', incidents: 43, resolved: 41 },
  { month: 'Jan', incidents: 36, resolved: 32 },
];

const incidentTrends = [
  { day: 'Mon', theft: 12, harassment: 5, medical: 2, other: 8 },
  { day: 'Tue', theft: 8, harassment: 3, medical: 4, other: 6 },
  { day: 'Wed', theft: 15, harassment: 7, medical: 1, other: 9 },
  { day: 'Thu', theft: 6, harassment: 2, medical: 3, other: 5 },
  { day: 'Fri', theft: 18, harassment: 9, medical: 2, other: 12 },
  { day: 'Sat', theft: 22, harassment: 12, medical: 5, other: 15 },
  { day: 'Sun', theft: 14, harassment: 6, medical: 3, other: 8 },
];

export function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'investigating': return 'bg-blue-500/20 text-blue-400';
      case 'resolved': return 'bg-green-500/20 text-green-400';
      case 'closed': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'theft': return '🔒';
      case 'assault': return '⚔️';
      case 'harassment': return '⚠️';
      case 'medical': return '🏥';
      case 'fraud': return '💳';
      case 'lost_property': return '📦';
      default: return '📋';
    }
  };

  const filteredReports = mockReports.filter(report => {
    const searchMatch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       report.location.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'all' || report.status === statusFilter;
    const severityMatch = severityFilter === 'all' || report.severity === severityFilter;
    return searchMatch && statusMatch && severityMatch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Reports', value: mockReports.length, icon: FileText, color: 'text-blue-400', change: '+12%' },
          { label: 'Under Investigation', value: mockReports.filter(r => r.status === 'investigating').length, icon: Search, color: 'text-yellow-400', change: '-5%' },
          { label: 'Resolved This Month', value: mockReports.filter(r => r.status === 'resolved').length, icon: CheckCircle, color: 'text-green-400', change: '+18%' },
          { label: 'Critical Cases', value: mockReports.filter(r => r.severity === 'critical').length, icon: AlertCircle, color: 'text-red-400', change: '-8%' },
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
                      <div className="flex items-center mt-1">
                        <TrendingUp className={`w-3 h-3 mr-1 ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`} />
                        <span className={`text-xs ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Section */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="glass">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="reports">All Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Resolution Rate */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-foreground" />
                    <span>Monthly Resolution Rate</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.1)" />
                      <XAxis dataKey="month" stroke="#ffffff" />
                      <YAxis stroke="#ffffff" />
                      <Area type="monotone" dataKey="incidents" stroke="#ff6b9d" fill="#ff6b9d" fillOpacity={0.2} />
                      <Area type="monotone" dataKey="resolved" stroke="#00d9ff" fill="#00d9ff" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Incident Categories */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-foreground" />
                    <span>Incident Categories This Week</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={incidentTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.1)" />
                      <XAxis dataKey="day" stroke="#ffffff" />
                      <YAxis stroke="#ffffff" />
                      <Bar dataKey="theft" stackId="a" fill="#00d9ff" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="harassment" stackId="a" fill="#ff6b9d" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="medical" stackId="a" fill="#f9ca24" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="other" stackId="a" fill="#4ecdc4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass hover-glow">
              <CardHeader>
                <CardTitle>Incident Trends Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.1)" />
                    <XAxis dataKey="month" stroke="#ffffff" />
                    <YAxis stroke="#ffffff" />
                    <Line type="monotone" dataKey="incidents" stroke="#00d9ff" strokeWidth={3} dot={{ fill: '#00d9ff' }} />
                    <Line type="monotone" dataKey="resolved" stroke="#4ecdc4" strokeWidth={3} dot={{ fill: '#4ecdc4' }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="glass">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reports by ID, title, or location..."
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
                      className="px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="investigating">Investigating</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                    <select
                      value={severityFilter}
                      onChange={(e) => setSeverityFilter(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm"
                    >
                      <option value="all">All Severity</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <Button className="hover-glow">
                    <Plus className="w-4 h-4 mr-2" />
                    New Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Reports Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass hover-glow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-foreground" />
                    <span>Incident Reports</span>
                    <Badge className="neon-glow">{filteredReports.length} reports</Badge>
                  </CardTitle>
                  <Button variant="outline" size="sm" className="hover-glow">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned Officer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report, index) => (
                      <motion.tr
                        key={report.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="hover:bg-secondary/30 cursor-pointer"
                        onClick={() => setSelectedReport(report)}
                      >
                        <TableCell>
                          <div className="font-mono text-sm">{report.id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getTypeIcon(report.type)}</span>
                            <div>
                              <p className="font-medium">{report.title}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-xs">{report.location}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">{report.type.replace('_', ' ')}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(report.severity)}>
                            {report.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{report.assignedOfficer}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{new Date(report.dateReported).toLocaleDateString()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="icon" className="hover-glow">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover-glow">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Report Details Modal */}
      {selectedReport && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedReport(null)}
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
                    <span className="text-2xl">{getTypeIcon(selectedReport.type)}</span>
                    <div>
                      <h2 className="text-xl">{selectedReport.title}</h2>
                      <p className="text-sm text-muted-foreground">Report ID: {selectedReport.id}</p>
                    </div>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedReport(null)}
                    className="hover-glow"
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-foreground">Report Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Severity:</span>
                        <Badge className={getSeverityColor(selectedReport.severity)}>
                          {selectedReport.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge className={getStatusColor(selectedReport.status)}>
                          {selectedReport.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Location:</p>
                        <p className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedReport.location}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reported By:</p>
                        <p>{selectedReport.reportedBy}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-foreground">Investigation Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Assigned Officer:</p>
                        <p className="flex items-center space-x-1">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedReport.assignedOfficer}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date Reported:</p>
                        <p className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{new Date(selectedReport.dateReported).toLocaleString()}</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Updated:</p>
                        <p className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{new Date(selectedReport.lastUpdated).toLocaleString()}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-foreground mb-3">Description</h3>
                  <p className="text-sm bg-secondary/30 p-4 rounded-lg">{selectedReport.description}</p>
                </div>

                {selectedReport.evidence && (
                  <div>
                    <h3 className="font-bold text-foreground mb-3">Evidence Files</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedReport.evidence.map((file, index) => (
                        <div key={index} className="flex items-center space-x-2 p-3 bg-secondary/30 rounded-lg">
                          <FileText className="w-4 h-4 text-foreground" />
                          <span className="text-sm">{file}</span>
                          <Button variant="ghost" size="sm" className="ml-auto hover-glow">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4 border-t border-border">
                  <Button className="hover-glow">
                    <Edit className="w-4 h-4 mr-2" />
                    Update Report
                  </Button>
                  <Button variant="outline" className="hover-glow">
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                  <Button variant="outline" className="hover-glow">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
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