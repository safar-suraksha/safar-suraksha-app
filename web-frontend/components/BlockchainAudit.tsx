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
  Link, 
  Search, 
  Filter, 
  Download, 
  Shield,
  CheckCircle,
  Clock,
  Hash,
  Database,
  Eye,
  Copy,
  ExternalLink,
  Activity,
  TrendingUp,
  AlertTriangle,
  Users
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

interface BlockchainTransaction {
  id: string;
  hash: string;
  blockNumber: number;
  timestamp: string;
  action: string;
  actor: string;
  target: string;
  status: 'verified' | 'pending' | 'failed';
  gasUsed: number;
  transactionFee: string;
  dataHash: string;
}

const mockTransactions: BlockchainTransaction[] = [
  {
    id: 'TX001',
    hash: '0xa1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890',
    blockNumber: 892547,
    timestamp: '2024-01-15 14:23:45',
    action: 'Tourist Verification',
    actor: 'Inspector S. Chen',
    target: 'Tourist ID: T-2024-001',
    status: 'verified',
    gasUsed: 21000,
    transactionFee: '0.003 ETH',
    dataHash: '0x9f8e7d6c5b4a39281726354'
  },
  {
    id: 'TX002',
    hash: '0xb2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    blockNumber: 892548,
    timestamp: '2024-01-15 14:25:12',
    action: 'SOS Alert Creation',
    actor: 'System Auto',
    target: 'Alert ID: SOS-001',
    status: 'verified',
    gasUsed: 45000,
    transactionFee: '0.007 ETH',
    dataHash: '0x8e7d6c5b4a392817263541'
  },
  {
    id: 'TX003',
    hash: '0xc3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
    blockNumber: 892549,
    timestamp: '2024-01-15 14:26:33',
    action: 'Incident Report Filed',
    actor: 'Officer Martinez',
    target: 'Report ID: RPT-2024-001',
    status: 'verified',
    gasUsed: 38000,
    transactionFee: '0.005 ETH',
    dataHash: '0x7d6c5b4a39281726354123'
  },
  {
    id: 'TX004',
    hash: '0xd4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    blockNumber: 892550,
    timestamp: '2024-01-15 14:28:01',
    action: 'Evidence Upload',
    actor: 'Officer Davis',
    target: 'Evidence ID: EVD-001',
    status: 'pending',
    gasUsed: 0,
    transactionFee: 'Pending',
    dataHash: '0x6c5b4a3928172635412345'
  }
];

const blockchainStats = [
  { date: 'Jan 10', transactions: 45, verified: 43, failed: 2 },
  { date: 'Jan 11', transactions: 52, verified: 50, failed: 2 },
  { date: 'Jan 12', transactions: 38, verified: 37, failed: 1 },
  { date: 'Jan 13', transactions: 61, verified: 58, failed: 3 },
  { date: 'Jan 14', transactions: 49, verified: 47, failed: 2 },
  { date: 'Jan 15', transactions: 43, verified: 40, failed: 3 },
];

const actionTypes = [
  { action: 'Tourist Verification', count: 156, percentage: 35 },
  { action: 'SOS Alerts', count: 89, percentage: 20 },
  { action: 'Incident Reports', count: 112, percentage: 25 },
  { action: 'Evidence Storage', count: 67, percentage: 15 },
  { action: 'System Updates', count: 22, percentage: 5 }
];

export function BlockchainAudit() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<BlockchainTransaction | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('Tourist')) return Users;
    if (action.includes('SOS')) return AlertTriangle;
    if (action.includes('Report')) return Database;
    if (action.includes('Evidence')) return Shield;
    return Activity;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const truncateHash = (hash: string) => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`;
  };

  const filteredTransactions = mockTransactions.filter(tx => {
    const searchMatch = tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       tx.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       tx.actor.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'all' || tx.status === statusFilter;
    return searchMatch && statusMatch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Blockchain Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Transactions', value: '1,247', icon: Link, color: 'text-blue-400', change: '+8.2%' },
          { label: 'Verified Today', value: '156', icon: CheckCircle, color: 'text-green-400', change: '+12%' },
          { label: 'Pending Verification', value: '23', icon: Clock, color: 'text-yellow-400', change: '-5%' },
          { label: 'Network Hash Rate', value: '2.4 TH/s', icon: Hash, color: 'text-purple-400', change: '+3.1%' },
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

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="glass">
          <TabsTrigger value="transactions">Transaction Log</TabsTrigger>
          <TabsTrigger value="analytics">Blockchain Analytics</TabsTrigger>
          <TabsTrigger value="integrity">Data Integrity</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
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
                      placeholder="Search by hash, action, or actor..."
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
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                  <Button className="hover-glow">
                    <Download className="w-4 h-4 mr-2" />
                    Export Log
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Transactions Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Link className="w-5 h-5 text-foreground" />
                  <span>Blockchain Transaction Log</span>
                  <Badge className="neon-glow">{filteredTransactions.length} transactions</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction Hash</TableHead>
                      <TableHead>Block</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Actor</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((tx, index) => {
                      const ActionIcon = getActionIcon(tx.action);
                      return (
                        <motion.tr
                          key={tx.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          className="hover:bg-secondary/30 cursor-pointer"
                          onClick={() => setSelectedTransaction(tx)}
                        >
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <code className="text-xs font-mono bg-secondary/30 px-2 py-1 rounded">
                                {truncateHash(tx.hash)}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-6 h-6 hover-glow"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(tx.hash);
                                }}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm">{tx.blockNumber}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <ActionIcon className="w-4 h-4 text-foreground" />
                              <span className="text-sm">{tx.action}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{tx.actor}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-mono">{tx.target}</span>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(tx.status)}>
                              {tx.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{new Date(tx.timestamp).toLocaleString()}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="icon" className="hover-glow">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="hover-glow">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transaction Trends */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-foreground" />
                    <span>Transaction Volume Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={blockchainStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.1)" />
                      <XAxis dataKey="date" stroke="#ffffff" />
                      <YAxis stroke="#ffffff" />
                      <Area type="monotone" dataKey="transactions" stroke="#00d9ff" fill="#00d9ff" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="verified" stroke="#4ecdc4" fill="#4ecdc4" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Types Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="w-5 h-5 text-foreground" />
                    <span>Action Types Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={actionTypes} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.1)" />
                      <XAxis type="number" stroke="#ffffff" />
                      <YAxis dataKey="action" type="category" stroke="#ffffff" width={120} />
                      <Bar dataKey="count" fill="#00d9ff" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="integrity" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-foreground" />
                  <span>Data Integrity Verification</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="font-bold text-lg">99.8%</h3>
                    <p className="text-sm text-muted-foreground">Data Integrity Score</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                      <Hash className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-lg">256-bit</h3>
                    <p className="text-sm text-muted-foreground">Encryption Standard</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                      <Activity className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="font-bold text-lg">2.1s</h3>
                    <p className="text-sm text-muted-foreground">Avg Block Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTransaction(null)}
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
                    <Link className="w-6 h-6 text-foreground" />
                    <div>
                      <h2 className="text-xl">Transaction Details</h2>
                      <p className="text-sm text-muted-foreground">ID: {selectedTransaction.id}</p>
                    </div>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedTransaction(null)}
                    className="hover-glow"
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-foreground">Transaction Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Transaction Hash</p>
                        <div className="flex items-center space-x-2">
                          <code className="text-xs bg-secondary/30 p-2 rounded flex-1 break-all">
                            {selectedTransaction.hash}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(selectedTransaction.hash)}
                            className="hover-glow"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Block Number</p>
                        <p className="font-mono">{selectedTransaction.blockNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge className={getStatusColor(selectedTransaction.status)}>
                          {selectedTransaction.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-foreground">Action Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Action Type</p>
                        <p>{selectedTransaction.action}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Performed By</p>
                        <p>{selectedTransaction.actor}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Target</p>
                        <p className="font-mono text-sm">{selectedTransaction.target}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-foreground">Network Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Gas Used</p>
                        <p className="font-mono">{selectedTransaction.gasUsed.toLocaleString()} gas</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Transaction Fee</p>
                        <p className="font-mono">{selectedTransaction.transactionFee}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-foreground">Data Verification</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Data Hash</p>
                        <div className="flex items-center space-x-2">
                          <code className="text-xs bg-secondary/30 p-2 rounded flex-1">
                            {selectedTransaction.dataHash}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(selectedTransaction.dataHash)}
                            className="hover-glow"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Timestamp</p>
                        <p>{new Date(selectedTransaction.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-border">
                  <Button className="hover-glow">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Explorer
                  </Button>
                  <Button variant="outline" className="hover-glow">
                    <Download className="w-4 h-4 mr-2" />
                    Export Details
                  </Button>
                  <Button variant="outline" className="hover-glow">
                    <Shield className="w-4 h-4 mr-2" />
                    Verify Integrity
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