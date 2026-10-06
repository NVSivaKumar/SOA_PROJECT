import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Activity, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  role?: 'CUSTOMER' | 'AGENT' | 'ADMIN';
}

const Dashboard = ({ role = 'CUSTOMER' }: DashboardProps) => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Depending on role, we fetch different data. The backend already handles it via userRole header
      const response = await api.get('/complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div></div>;
  }

  // Calculate stats
  const total = complaints.length;
  const open = complaints.filter(c => c.status === 'OPEN' || c.status === 'ASSIGNED').length;
  const inProgress = complaints.filter(c => c.status === 'IN_PROGRESS' || c.status === 'ESCALATED').length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length;

  const statusData = [
    { name: 'Open', value: open, color: 'var(--color-gold)' },
    { name: 'In Progress', value: inProgress, color: 'var(--color-gold-bright)' },
    { name: 'Resolved', value: resolved, color: 'var(--color-gold-bronze)' }
  ];

  // Category data
  const categories = complaints.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.keys(categories).map(key => ({
    name: key,
    value: categories[key]
  }));

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="glass-panel rounded-md-glass p-6 flex flex-col justify-between transition-all hover:-translate-y-[2px] duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-sm-glass bg-glass-fill backdrop-blur-sm border border-glass-border group-hover:border-gold-bright transition-colors`}>
          <Icon className={`w-5 h-5 ${color}`} style={{ filter: 'drop-shadow(0px 0px 8px currentColor)' }} />
        </div>
      </div>
      <div>
        <p className="text-xs font-mono font-semibold tracking-wider text-text-muted uppercase mb-1">{title}</p>
        <p className="text-4xl font-serif text-text-main tracking-wide">{String(value).padStart(2, '0')}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl md:text-5xl font-serif text-text-main tracking-wide">
          Welcome back, <span className="text-gold">{user?.name}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Complaints" value={total} icon={Activity} color="text-gold-bright" />
        <StatCard title="Open" value={open} icon={AlertTriangle} color="text-gold" />
        <StatCard title="In Progress" value={inProgress} icon={Clock} color="text-gold-bronze" />
        <StatCard title="Resolved" value={resolved} icon={CheckCircle} color="text-gold-bright" />
      </div>

      {total > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel-lg p-6">
            <h3 className="text-lg font-serif text-text-main mb-6 tracking-wide">Complaints by Status</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0px 0px 6px ${entry.color})` }} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-glass-border)', borderRadius: '16px', color: 'var(--color-text-main)', backdropFilter: 'blur(16px)' }}
                    itemStyle={{ color: 'var(--color-text-main)', fontFamily: '"Space Mono", monospace' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4 font-mono">
              {statusData.map(stat => (
                <div key={stat.name} className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2 shadow-lg" style={{ backgroundColor: stat.color }}></span>
                  <span className="text-sm text-text-muted">{stat.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel-lg p-6">
            <h3 className="text-lg font-serif text-text-main mb-6 tracking-wide">Complaints by Category</h3>
            <div className="h-64 font-mono">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-glass-border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="var(--color-text-muted)" />
                  <YAxis axisLine={false} tickLine={false} allowDecimals={false} stroke="var(--color-text-muted)" />
                  <Tooltip 
                    cursor={{ fill: 'var(--color-glass-fill)' }} 
                    contentStyle={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-glass-border)', borderRadius: '16px', color: 'var(--color-text-main)', backdropFilter: 'blur(16px)' }}
                  />
                  <Bar dataKey="value" fill="var(--color-gold)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel-lg p-16 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-glass-fill backdrop-blur-sm rounded-full flex items-center justify-center mb-6 border border-glass-border shadow-lg">
            <Activity className="w-8 h-8 text-gold-bright drop-shadow-md" />
          </div>
          <h3 className="text-xl font-serif text-text-main mb-2">No data available</h3>
          <p className="text-text-muted max-w-md">
            {role === 'CUSTOMER' 
              ? "You haven't submitted any complaints yet." 
              : "There are currently no complaints in the system."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
