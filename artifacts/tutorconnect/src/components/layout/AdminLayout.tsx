import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CreditCard, 
  Flag, 
  BarChart3, 
  LogOut,
  ChevronLeft,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Posts", url: "/admin/posts", icon: BookOpen },
    { title: "Payments", url: "/admin/payments", icon: CreditCard },
    { title: "Reports", url: "/admin/reports", icon: Flag },
    { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen w-full bg-[#020617] text-slate-300">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 z-50 bg-[#0f172a]/50 backdrop-blur-3xl text-slate-300 border-r border-slate-800/50 shadow-2xl">
        <div className="p-8 flex flex-col h-full">
          <Link href="/" className="flex items-center gap-3 mb-10 group">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
              <img src="/logo.png" alt="TS" className="w-6 h-6 object-contain brightness-0 invert" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl text-white tracking-tight leading-none">TutorSphere</span>
              <span className="text-[10px] font-bold text-violet-500 uppercase tracking-widest mt-1">Command Center</span>
            </div>
          </Link>

          <nav className="flex-1 space-y-1.5">
            {navItems.map((item) => {
              const isActive = location === item.url;
              return (
                <Link key={item.title} href={item.url}>
                  <a className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive 
                      ? "bg-violet-600/20 text-white shadow-xl shadow-violet-500/10 ring-1 ring-violet-500/30" 
                      : "hover:bg-slate-800/50 hover:text-white"
                  }`}>
                    <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-violet-400" : "group-hover:text-violet-400"}`} />
                    {item.title}
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.8)]" />}
                  </a>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-6">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-9 w-9 border-2 border-slate-700">
                  <AvatarFallback className="bg-violet-600 text-white text-xs font-bold font-display">
                    {user?.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>

              <div className="mb-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">System Online</span>
                </div>
                <span className="text-[9px] font-medium text-slate-600">12ms</span>
              </div>

              <Button 
                variant="ghost" 
                onClick={logout}
                className="w-full justify-start h-9 gap-2.5 px-2 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all font-medium text-xs"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-[#0f172a] border-b border-slate-800 px-4 flex items-center justify-between sticky top-0 z-40">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-slate-400 hover:bg-slate-800 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <img src="/logo.png" alt="TutorSphere" className="h-8 w-auto brightness-0 invert" />
          <div className="w-10" /> {/* Spacer */}
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex h-20 bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/50 px-10 items-center justify-between sticky top-0 z-40 transition-all duration-300 overflow-hidden">
          <div className="flex items-center gap-4">
            <h1 className="font-display font-bold text-2xl text-white tracking-tight">
              {navItems.find(i => i.url === location)?.title || "Admin"}
            </h1>
            <div className="h-5 w-px bg-slate-800 mx-2" />
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Console v2.0</span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/">
              <a className="text-sm font-bold text-violet-400 hover:text-violet-300 flex items-center gap-2 bg-violet-600/10 px-5 py-2.5 rounded-xl transition-all hover:bg-violet-600/20 ring-1 ring-violet-500/20">
                <ChevronLeft className="w-4 h-4" /> Go to Main Site
              </a>
            </Link>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-10 py-8 lg:py-10">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-700 slide-in-from-bottom-4">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <aside className={`fixed inset-y-0 left-0 z-[60] w-72 bg-[#0f172a] shadow-2xl lg:hidden transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex flex-col h-full uppercase">
          <div className="flex items-center justify-between mb-8">
            <span className="font-display font-bold text-lg text-white">Admin Menu</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <Link key={item.title} href={item.url}>
                <a 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                    location === item.url ? "bg-violet-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.title}
                </a>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
}
