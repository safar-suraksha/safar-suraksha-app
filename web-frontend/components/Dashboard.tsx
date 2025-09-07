import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  MapPin, 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  Clock,
  CheckCircle,
  Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const statsData = [
  { icon: Users, label: 'Active Tourists', value: '1,247', change: '+12%', trend: 'up' },
  { icon: MapPin, label: 'Officers on Duty', value: '89', change: '+5%', trend: 'up' },
  { icon: AlertTriangle, label: 'Active Alerts', value: '7', change: '-23%', trend: 'down' },
  { icon: Shield, label: 'Security Level', value: '94%', change: '+2%', trend: 'up' },
];

const weeklyData = [
  { day: 'Mon', incidents: 12, resolved: 10 },
  { day: 'Tue', incidents: 8, resolved: 8 },
  { day: 'Wed', incidents: 15, resolved: 12 },
  { day: 'Thu', incidents: 6, resolved: 6 },
  { day: 'Fri', incidents: 18, resolved: 15 },
  { day: 'Sat', incidents: 22, resolved: 18 },
  { day: 'Sun', incidents: 14, resolved: 13 },
];

const alertsData = [
  { name: 'Resolved', value: 78, color: '#00d9ff' },
  { name: 'Pending', value: 15, color: '#f9ca24' },
  { name: 'Critical', value: 7, color: '#ff4444' },
];

const recentIncidents = [
  { id: 1, type: 'Lost Tourist', location: 'Times Square', time: '5 min ago', status: 'resolved' },
  { id: 2, type: 'Medical Emergency', location: 'Central Park', time: '12 min ago', status: 'active' },
  { id: 3, type: 'Theft Report', location: 'Broadway', time: '28 min ago', status: 'investigating' },
  { id: 4, type: 'Suspicious Activity', location: 'Brooklyn Bridge', time: '45 min ago', status: 'resolved' },
];

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass hover-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className={`w-4 h-4 mr-1 ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`} />
                        <span className={`text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-primary/20">
                      <Icon className="w-8 h-8 text-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Incidents Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass hover-glow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-foreground" />
                <span>Weekly Incident Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.1)" />
                  <XAxis dataKey="day" stroke="#ffffff" />
                  <YAxis stroke="#ffffff" />
                  <Bar dataKey="incidents" fill="#00d9ff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" fill="#4ecdc4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alert Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass hover-glow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-foreground" />
                <span>Alert Status Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={alertsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {alertsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {alertsData.map((item) => (
                  <div key={item.name} className="text-center">
                    <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }} />
                    <p className="text-xs text-muted-foreground">{item.name}</p>
                    <p className="font-bold">{item.value}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Incidents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="glass hover-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-foreground" />
              <span>Recent Incidents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIncidents.map((incident, index) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-primary/20">
                      <AlertTriangle className="w-4 h-4 text-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{incident.type}</p>
                      <p className="text-sm text-muted-foreground">{incident.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">{incident.time}</span>
                    <Badge
                      variant={incident.status === 'resolved' ? 'default' : incident.status === 'active' ? 'destructive' : 'secondary'}
                      className={incident.status === 'resolved' ? 'bg-green-500/20 text-green-400' : ''}
                    >
                      {incident.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}