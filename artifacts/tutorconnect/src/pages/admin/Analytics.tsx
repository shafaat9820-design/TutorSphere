import { useAdminGetAnalytics } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Loader2, TrendingUp, PieChart, Activity, MapPin } from "lucide-react";

export default function AdminAnalytics() {
  const { getAuthHeaders } = useAuth();
  const { data, isLoading } = useAdminGetAnalytics({
    request: { headers: getAuthHeaders() }
  });

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-24 gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-violet-600" />
      <p className="text-slate-500 font-medium">Analyzing platform data...</p>
    </div>
  );
  
  if (!data) return null;

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Platform Insights</h2>
        <p className="text-slate-500 font-medium">In-depth analysis of revenue, registrations, and user behavior.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Growth */}
        <Card className="border-slate-200 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
          <CardHeader className="border-b border-slate-50 p-6 bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Revenue Growth</CardTitle>
                <CardDescription>Daily transaction volume over the last 30 days</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueByDay}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} 
                  dy={10}
                  tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} 
                  tickFormatter={(v) => `₹${(v / 100).toLocaleString()}`} 
                />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}} 
                  itemStyle={{fontWeight: 700, color: '#0f172a'}}
                  labelStyle={{fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em'}}
                  formatter={(v: number) => [`₹${(v / 100).toLocaleString('en-IN')}`, 'Revenue']} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Onboarding */}
        <Card className="border-slate-200 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
          <CardHeader className="border-b border-slate-50 p-6 bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">User Registrations</CardTitle>
                <CardDescription>New account sign-ups per day</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 h-[350px]">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.dailyRegistrations} margin={{ bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}}
                  dy={10}
                  tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}} 
                  labelStyle={{fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em'}}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Popular Subjects */}
        <Card className="border-slate-200 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white lg:col-span-2">
          <CardHeader className="border-b border-slate-50 p-6 bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-50 rounded-lg">
                <PieChart className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">Highest Demand Subjects</CardTitle>
                <CardDescription>Most frequently requested subjects by parents and students</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topSubjects} layout="vertical" margin={{ left: 40, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="subject" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#475569', fontSize: 11, fontWeight: 700}}
                  width={140}
                />
                <Tooltip 
                  cursor={{fill: '#f5f3ff'}}
                  contentStyle={{borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}} 
                />
                <Bar 
                  dataKey="count" 
                  fill="#818cf8" 
                  radius={[0, 10, 10, 0]} 
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
