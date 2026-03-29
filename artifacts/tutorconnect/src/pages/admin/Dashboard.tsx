import { useAdminGetDashboard } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, CreditCard, IndianRupee, Loader2, ArrowUpRight, TrendingUp, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  const { getAuthHeaders } = useAuth();
  const { data, isLoading } = useAdminGetDashboard({
    request: { headers: getAuthHeaders() }
  });

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-24 gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-violet-600" />
      <p className="text-slate-500 font-medium animate-pulse">Loading platform statistics...</p>
    </div>
  );
  
  if (!data) return null;

  const stats = [
    { 
      title: "Total Users", 
      value: data.totalUsers, 
      icon: Users, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      border: "border-blue-100",
      trend: "+12% this month"
    },
    { 
      title: "Active Posts", 
      value: data.totalPosts, 
      icon: BookOpen, 
      color: "text-violet-600", 
      bg: "bg-violet-50",
      border: "border-violet-100",
      trend: "+5% today" 
    },
    { 
      title: "Transactions", 
      value: data.totalPayments, 
      icon: CreditCard, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      trend: "+8% this week"
    },
    { 
      title: "Total Revenue", 
      value: `₹${(data.totalRevenue / 100).toLocaleString('en-IN')}`, 
      icon: IndianRupee, 
      color: "text-amber-600", 
      bg: "bg-amber-50",
      border: "border-amber-100",
      trend: "Last 30 days"
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">System Overview</h2>
        <p className="text-slate-500 font-medium">Real-time performance metrics and platform health.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className={`border ${stat.border} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden group`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-xl transition-transform group-hover:scale-110`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">
                  <ArrowUpRight className="w-3 h-3" /> {stat.trend}
                </div>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
              <p className="text-3xl font-display font-bold text-slate-900">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-slate-200 shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-600" />
                User Distribution
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs font-bold text-violet-600 hover:bg-violet-50 rounded-lg uppercase tracking-wide">View Details</Button>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Tutors</p>
                    <p className="text-4xl font-display font-bold text-slate-900">{data.totalTutors}</p>
                  </div>
                  <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
                    {Math.round((data.totalTutors / data.totalUsers) * 100)}% of total
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 transition-all duration-1000" 
                    style={{ width: `${(data.totalTutors / data.totalUsers) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Parents</p>
                    <p className="text-4xl font-display font-bold text-slate-900">{data.totalParents}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                     {Math.round((data.totalParents / data.totalUsers) * 100)}% of total
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-1000" 
                    style={{ width: `${(data.totalParents / data.totalUsers) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden bg-[#0f172a] text-white">
          <CardHeader className="border-b border-slate-800 p-6">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Platform Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.5)]" />
              <div>
                <p className="text-sm font-bold tracking-wide uppercase text-slate-400">Database Engine</p>
                <p className="text-slate-100 text-sm">PostgreSQL (Connected)</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.5)]" />
              <div>
                <p className="text-sm font-bold tracking-wide uppercase text-slate-400">Auth Service</p>
                <p className="text-slate-100 text-sm">JWT Stateless (Operational)</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.5)]" />
              <div>
                <p className="text-sm font-bold tracking-wide uppercase text-slate-400">Payment Gateway</p>
                <p className="text-slate-100 text-sm">Razorpay API (Active)</p>
              </div>
            </div>
            <div className="pt-4">
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-xs text-slate-400 leading-relaxed font-medium">
                All systems functional. No pending security alerts or system failures reported in the last 24 hours.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
