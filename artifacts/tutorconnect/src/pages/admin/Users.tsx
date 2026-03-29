import { useAdminGetUsers, useAdminDeleteUser } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Search, Filter, UserCog, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function AdminUsers() {
  const { getAuthHeaders } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  
  const { data, refetch, isLoading } = useAdminGetUsers({ 
    limit: 100,
    search: search || undefined
  }, {
    request: { headers: getAuthHeaders() }
  });

  const { mutate: deleteUser } = useAdminDeleteUser({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: () => {
        toast({ title: "User deleted successfully" });
        refetch();
      }
    }
  });

  const roleStyles: Record<string, string> = {
    admin: "bg-red-50 text-red-700 border-red-100 ring-1 ring-red-500/10",
    tutor: "bg-violet-50 text-violet-700 border-violet-100 ring-1 ring-violet-500/10",
    parent: "bg-emerald-50 text-emerald-700 border-emerald-100 ring-1 ring-emerald-500/10"
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UserCog className="w-6 h-6 text-violet-600" />
            User Directory
          </h2>
          <p className="text-sm text-slate-500">Manage all registered accounts across the platform.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 w-full sm:w-64 rounded-xl border-slate-200 focus:ring-violet-500 focus:border-violet-500"
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200">
            <Filter className="w-4 h-4 text-slate-600" />
          </Button>
        </div>
      </div>

      <Card className="border-slate-200 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Full Name</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Account Email</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Access Level</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Registration Date</TableHead>
              <TableHead className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Control</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="h-40 text-center text-slate-400 font-medium">Crunching user data...</TableCell></TableRow>
            ) : data?.users.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-40 text-center text-slate-400 font-medium">No users found matching your criteria.</TableCell></TableRow>
            ) : data?.users.map((user) => (
              <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                <TableCell className="font-semibold text-slate-900 py-4">{user.name}</TableCell>
                <TableCell className="text-slate-500 py-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-300" />
                    {user.email}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="outline" className={`${roleStyles[user.role]} rounded-lg px-2.5 py-0.5 border-0 capitalize font-bold text-[10px] tracking-wide`}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-300" />
                    {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                  </div>
                </TableCell>
                <TableCell className="text-right py-4 px-6">
                  {user.role !== "admin" ? (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-9 h-9 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all" 
                      onClick={() => {
                        if(confirm(`Are you absolutely sure you want to delete ${user.name}? This action cannot be undone.`)) deleteUser({ id: user.id })
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest px-2">Protected</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
