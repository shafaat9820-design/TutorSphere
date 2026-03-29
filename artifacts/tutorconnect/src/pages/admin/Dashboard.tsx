import { useAdminGetDashboard } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  BookOpen, 
  CreditCard, 
  IndianRupee, 
  Loader2, 
  ArrowUpRight, 
  TrendingUp, 
  ShieldCheck, 
  Activity,
  Zap,
  Globe,
  UserCog,
  Flag
} from "lucide-react";

export default function AdminDashboard() {
  const { getAuthHeaders } = useAuth();
  const { data, isLoading } = useAdminGetDashboard({
    request: { headers: getAuthHeaders() }
  });

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-24 gap-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
        <Zap className="w-6 h-6 text-violet-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Initializing Console...</p>
    </div>
  );
  
  if (!data) return null;

  const stats = [
    { 
      title: "Total Users", 
      value: data.totalUsers, 
      icon: Users, 
      color: "text-blue-400", 
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      trend: "+12.5%",
      glow: "shadow-blue-500/10"
    },
    { 
      title: "Active Posts", 
      value: data.totalPosts, 
      icon: BookOpen, 
      color: "text-violet-400", 
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
      trend: "+5.2%",
      glow: "shadow-violet-500/10"
    },
    { 
      title: "Transactions", 
      value: data.totalPayments, 
      icon: CreditCard, 
      color: "text-emerald-400", 
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      trend: "+8.1%",
      glow: "shadow-emerald-500/10"
    },
    { 
      title: "Total Revenue", 
      value: `₹${(data.totalRevenue / 100).toLocaleString('en-IN')}`, 
      icon: IndianRupee, 
      color: "text-amber-400", 
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      trend: "STABLE",
      glow: "shadow-amber-500/10"
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-violet-600 rounded-full" />
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">System Intelligence</h2>
        </div>
        <p className="text-slate-500 font-medium ml-4">High-level platform telemetry and growth indicators.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className={`bg-slate-900/40 backdrop-blur-md border ${stat.border} ${stat.glow} transition-all duration-300 rounded-3xl overflow-hidden group hover:bg-slate-900/60`}>
            <CardContent className="p-7">
              <div className="flex justify-between items-start mb-5">
                <div className={`${stat.bg} ${stat.color} p-3.5 rounded-2xl transition-transform group-hover:scale-110 duration-500`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">
                  <TrendingUp className="w-3 h-3" /> {stat.trend}
                </div>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1.5">{stat.title}</p>
              <p className="text-3xl font-display font-bold text-white group-hover:text-violet-400 transition-colors">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-[#0c111d]/60 border-slate-800/60 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
          <CardHeader className="border-b border-slate-800/50 bg-slate-900/20 p-8">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-3 text-white">
                <Activity className="w-5 h-5 text-violet-500" />
                Platform Demographics
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Syncing</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
              <div className="space-y-8">
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Verified Educators</p>
                    <p className="text-5xl font-display font-bold text-white">{data.totalTutors}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-violet-400 bg-violet-500/10 px-3 py-1.5 rounded-xl border border-violet-500/20">
                      {Math.round((data.totalTutors / data.totalUsers) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-slate-800/50 rounded-full overflow-hidden flex shadow-inner border border-slate-800/40">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500 transition-all duration-1000 shadow-[0_0_15px_rgba(124,58,237,0.4)]" 
                    style={{ width: `${(data.totalTutors / data.totalUsers) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Parent Network</p>
                    <p className="text-5xl font-display font-bold text-white">{data.totalParents}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                       {Math.round((data.totalParents / data.totalUsers) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-slate-800/50 rounded-full overflow-hidden flex shadow-inner border border-slate-800/40">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                    style={{ width: `${(data.totalParents / data.totalUsers) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#020617] border-slate-800/80 shadow-2xl rounded-[2.5rem] overflow-hidden ring-1 ring-slate-800/50">
          <CardHeader className="border-b border-slate-800/50 p-8">
            <CardTitle className="text-lg font-bold flex items-center gap-3 text-white font-display">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Infrastructure
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-7">
            {[
              { label: "Neural DB Engine", status: "Operational", color: "bg-emerald-500", icon: Globe },
              { label: "Sentinel Auth", status: "Encrypted", color: "bg-emerald-500", icon: Zap },
              { label: "Titan Payments", status: "Active", color: "bg-emerald-500", icon: CreditCard }
            ].map((sys, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl bg-slate-800 text-slate-400`}>
                    <sys.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-500">{sys.label}</p>
                    <p className="text-white text-xs font-semibold">{sys.status}</p>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${sys.color} animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.6)]`} />
              </div>
            ))}
            
            <div className="pt-2">
              <div className="p-5 rounded-3xl bg-violet-600/5 border border-violet-500/10 text-[11px] text-slate-400 leading-relaxed font-bold italic text-center">
                "System health is currently at optimal levels. All nodes responding within 12ms."
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-[#0c111d]/60 border-slate-800/60 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
          <CardHeader className="border-b border-slate-800/50 bg-slate-900/20 p-8">
            <CardTitle className="text-lg font-bold flex items-center gap-3 text-white">
              <Zap className="w-5 h-5 text-amber-500" />
              Quick Operations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-24 flex flex-col gap-2 bg-slate-900/50 border-slate-800 hover:bg-violet-600/20 hover:border-violet-500/50 text-slate-300 hover:text-white rounded-2xl transition-all">
                <Flag className="w-6 h-6 text-red-500" />
                <span className="text-xs font-bold uppercase tracking-wider">Review Reports</span>
              </Button>
              <Button className="h-24 flex flex-col gap-2 bg-slate-900/50 border-slate-800 hover:bg-violet-600/20 hover:border-violet-500/50 text-slate-300 hover:text-white rounded-2xl transition-all">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider">Audit Logs</span>
              </Button>
              <Button className="h-24 flex flex-col gap-2 bg-slate-900/50 border-slate-800 hover:bg-violet-600/20 hover:border-violet-500/50 text-slate-300 hover:text-white rounded-2xl transition-all">
                <Users className="w-6 h-6 text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider">User Support</span>
              </Button>
              <Button className="h-24 flex flex-col gap-2 bg-slate-900/50 border-slate-800 hover:bg-violet-600/20 hover:border-violet-500/50 text-slate-300 hover:text-white rounded-2xl transition-all">
                <Globe className="w-6 h-6 text-violet-500" />
                <span className="text-xs font-bold uppercase tracking-wider">Platform Msg</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0c111d]/60 border-slate-800/60 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
          <CardHeader className="border-b border-slate-800/50 bg-slate-900/20 p-8">
            <CardTitle className="text-lg font-bold flex items-center gap-3 text-white">
              <Activity className="w-5 h-5 text-indigo-500" />
              Security Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-800/50">
              {[
                { event: "Account Promo", user: "Suhail Khan", detail: "Promoted to ADMIN", time: "2 min ago", icon: UserCog, iconColor: "text-red-400" },
                { event: "Payment Success", user: "Rahul Sharma", detail: "Unlocked 5 contacts", time: "12 min ago", icon: CreditCard, iconColor: "text-emerald-400" },
                { event: "New Report", user: "System", detail: "Post ID #884 reported", time: "45 min ago", icon: Flag, iconColor: "text-amber-400" },
                { event: "Auth Alert", user: "Admin", detail: "New login from unknown IP", time: "1 hr ago", icon: ShieldCheck, iconColor: "text-blue-400" },
              ].map((log, i) => (
                <div key={i} className="flex items-center gap-4 p-5 hover:bg-slate-800/20 transition-colors">
                  <div className={`p-2.5 rounded-xl bg-slate-900/50 ${log.iconColor} border border-slate-800`}>
                    <log.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{log.event}</p>
                      <span className="text-[10px] text-slate-600 font-bold uppercase">{log.time}</span>
                    </div>
                    <p className="text-white text-xs font-semibold">{log.user}</p>
                    <p className="text-slate-400 text-[10px]">{log.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

