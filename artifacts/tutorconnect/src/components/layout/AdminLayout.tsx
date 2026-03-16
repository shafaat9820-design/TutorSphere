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
  ChevronLeft
} from "lucide-react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const [location] = useLocation();

  const navItems = [
    { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Posts", url: "/admin/posts", icon: BookOpen },
    { title: "Payments", url: "/admin/payments", icon: CreditCard },
    { title: "Reports", url: "/admin/reports", icon: Flag },
    { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  ];

  return (
    <SidebarProvider style={{ "--sidebar-width": "16rem" } as React.CSSProperties}>
      <div className="flex min-h-screen w-full bg-slate-50">
        <Sidebar className="border-r border-border bg-slate-900 text-slate-300">
          <SidebarContent>
            <div className="p-6">
              <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
                <div className="bg-primary text-white p-1 rounded-md">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="font-display font-bold text-lg">TutorConnect</span>
              </Link>
            </div>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => {
                    const isActive = location === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          isActive={isActive}
                          className={isActive ? "bg-primary text-white hover:bg-primary/90 hover:text-white" : "hover:bg-slate-800 hover:text-white"}
                        >
                          <Link href={item.url} className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                            <item.icon className="w-4 h-4" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <div className="mt-auto p-4 border-t border-slate-800">
              <button 
                onClick={logout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </SidebarContent>
        </Sidebar>
        
        <main className="flex-1 overflow-auto">
          <header className="bg-white border-b border-border h-16 flex items-center px-8 justify-between sticky top-0 z-10 shadow-sm shadow-slate-100">
            <div className="flex items-center gap-4">
              <h1 className="font-display font-semibold text-xl text-slate-800">Admin Portal</h1>
            </div>
            <Link href="/" className="text-sm font-medium text-slate-500 hover:text-primary flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Back to Site
            </Link>
          </header>
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
