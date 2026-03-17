import { useAdminGetDashboard } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, CreditCard, IndianRupee, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const { getAuthHeaders } = useAuth();
  const { data, isLoading } = useAdminGetDashboard({
    request: { headers: getAuthHeaders() }
  });

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!data) return null;

  const stats = [
    { title: "Total Users", value: data.totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-100" },
    { title: "Active Posts", value: data.totalPosts, icon: BookOpen, color: "text-indigo-500", bg: "bg-indigo-100" },
    { title: "Successful Payments", value: data.totalPayments, icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-100" },
    { title: "Total Revenue", value: `₹${(data.totalRevenue / 100).toLocaleString('en-IN')}`, icon: IndianRupee, color: "text-amber-500", bg: "bg-amber-100" },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">Platform Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl shrink-0`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                <p className="text-3xl font-display font-bold text-slate-800">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="border-0 shadow-sm"><CardContent className="p-6"><h3 className="font-bold mb-4">Quick Stats</h3><div className="space-y-4"><div className="flex justify-between border-b pb-2"><span>Tutors</span><span className="font-bold">{data.totalTutors}</span></div><div className="flex justify-between border-b pb-2"><span>Parents</span><span className="font-bold">{data.totalParents}</span></div></div></CardContent></Card>
      </div>
    </div>
  );
}
