import { 
  useAdminGetUsers, 
  useAdminDeleteUser,
  useAdminUpdateUserStatus,
  useAdminUpdateUserRole,
  useAdminResetPassword
} from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Trash2, 
  Search, 
  Filter, 
  UserCog, 
  Mail, 
  Calendar,
  ShieldAlert,
  ShieldCheck,
  MoreVertical,
  Key,
  ShieldBan,
  UserPlus
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
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
        toast({ title: "User purged from system" });
        refetch();
      }
    }
  });

  const { mutate: updateStatus } = useAdminUpdateUserStatus({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: (data: any) => {
        toast({ title: data.message });
        refetch();
      }
    }
  });

  const { mutate: updateRole } = useAdminUpdateUserRole({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: (data: any) => {
        toast({ title: data.message });
        refetch();
      }
    }
  });

  const { mutate: resetPassword } = useAdminResetPassword({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: (data: any) => {
        toast({ title: data.message });
      }
    }
  });

  const roleStyles: Record<string, string> = {
    admin: "bg-red-500/10 text-red-400 border-red-500/20",
    tutor: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    parent: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-violet-600 rounded-full" />
            <h2 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
              <UserCog className="w-8 h-8 text-violet-500" />
              User Directory
            </h2>
          </div>
          <p className="text-sm text-slate-500 ml-4 font-medium">Advanced biometric and account governance console.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
            <Input 
              placeholder="Query by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 w-full sm:w-80 rounded-2xl bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 focus:ring-violet-500/50 focus:border-violet-500/50 backdrop-blur-md transition-all"
            />
          </div>
          <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white hover:bg-violet-600/20 transition-all">
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <Card className="border-slate-800/60 shadow-2xl rounded-[2.5rem] overflow-hidden bg-[#0c111d]/60 backdrop-blur-xl">
        <Table>
          <TableHeader className="bg-slate-900/40 border-b border-slate-800/50">
            <TableRow className="hover:bg-transparent border-slate-800/50">
              <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] py-6 px-8">Identity</TableHead>
              <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] py-6">Security Context</TableHead>
              <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] py-6">Status</TableHead>
              <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] py-6">Registered</TableHead>
              <TableHead className="text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] py-6 px-8">Control</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="h-60 text-center text-slate-500 font-bold uppercase tracking-widest animate-pulse">Synchronizing Neural Data...</TableCell></TableRow>
            ) : data?.users.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-60 text-center text-slate-500 font-bold uppercase tracking-widest">Zero database matches found.</TableCell></TableRow>
            ) : data?.users.map((user) => (
              <TableRow key={user.id} className="hover:bg-slate-800/30 transition-colors border-slate-800/40 group">
                <TableCell className="py-6 px-8">
                  <div className="flex flex-col">
                    <span className="font-bold text-white group-hover:text-violet-400 transition-colors">{user.name}</span>
                    <span className="text-[10px] font-medium text-slate-500 tracking-wide mt-0.5">UID: {user.id.toString().padStart(6, '0')}</span>
                  </div>
                </TableCell>
                <TableCell className="py-6">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                      <Mail className="w-3.5 h-3.5 text-slate-600" />
                      {user.email}
                    </div>
                    <Badge variant="outline" className={`${roleStyles[user.role]} rounded-lg px-2.5 py-0.5 border capitalize font-black text-[9px] tracking-widest inline-flex w-fit`}>
                      {user.role}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="py-6">
                  {user.isBanned ? (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 rounded-lg px-3 py-1 font-black text-[9px] tracking-widest uppercase flex items-center gap-1.5 w-fit">
                      <ShieldAlert className="w-3 h-3" />
                      TERMINATED
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 rounded-lg px-3 py-1 font-black text-[9px] tracking-widest uppercase flex items-center gap-1.5 w-fit">
                      <ShieldCheck className="w-3 h-3" />
                      ACTIVE
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-slate-500 py-6 text-sm font-medium">
                  <div className="flex items-center gap-2 uppercase text-[10px] font-black tracking-widest">
                    <Calendar className="w-3.5 h-3.5 text-slate-700" />
                    {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                  </div>
                </TableCell>
                <TableCell className="text-right py-6 px-8">
                  {user.role !== "admin" ? (
                    <div className="flex items-center justify-end gap-2">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800 text-slate-300 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3 py-2">Governance</DropdownMenuLabel>
                          <DropdownMenuItem 
                            onClick={() => updateStatus({ id: user.id, data: { isBanned: !user.isBanned } })}
                            className="rounded-xl px-3 py-2.5 flex items-center gap-3 focus:bg-slate-800 focus:text-white cursor-pointer"
                          >
                            <ShieldBan className={`w-4 h-4 ${user.isBanned ? "text-emerald-400" : "text-red-400"}`} />
                            <span className="font-bold text-xs">{user.isBanned ? "Reinstate Account" : "Terminate Account"}</span>
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator className="bg-slate-800 mx-1 my-1" />
                          
                          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3 py-2">Modifications</DropdownMenuLabel>
                          <DropdownMenuItem 
                            onClick={() => updateRole({ id: user.id, data: { role: user.role === "tutor" ? "parent" : "tutor" } })}
                            className="rounded-xl px-3 py-2.5 flex items-center gap-3 focus:bg-slate-800 focus:text-white cursor-pointer"
                          >
                            <UserPlus className="w-4 h-4 text-blue-400" />
                            <span className="font-bold text-xs">Switch to {user.role === "tutor" ? "Parent" : "Tutor"}</span>
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => resetPassword({ id: user.id })}
                            className="rounded-xl px-3 py-2.5 flex items-center gap-3 focus:bg-slate-800 focus:text-white cursor-pointer"
                          >
                            <Key className="w-4 h-4 text-amber-400" />
                            <span className="font-bold text-xs">Force Password Reset</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="bg-slate-800 mx-1 my-1" />
                          
                          <DropdownMenuItem 
                            onClick={() => {
                              if(confirm(`EXTREME CAUTION: Are you absolutely sure you want to PERMANENTLY DELETE ${user.name}?`)) deleteUser({ id: user.id })
                            }}
                            className="rounded-xl px-3 py-2.5 flex items-center gap-3 focus:bg-red-500/20 focus:text-red-400 cursor-pointer text-red-500/70"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="font-bold text-xs">Purge Identity</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-[9px] font-black text-red-500/50 uppercase tracking-[0.2em] border-red-500/20 bg-red-500/5 px-3 py-1.5 rounded-lg">
                      Protected Asset
                    </Badge>
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
