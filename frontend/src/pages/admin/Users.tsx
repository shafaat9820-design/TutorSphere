import { useAdminGetUsers, useAdminDeleteUser } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function AdminUsers() {
  const { getAuthHeaders } = useAuth();
  const { toast } = useToast();
  const { data, refetch } = useAdminGetUsers({ limit: 100 }, {
    request: { headers: getAuthHeaders() }
  });

  const { mutate: deleteUser } = useAdminDeleteUser({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: () => {
        toast({ title: "User deleted" });
        refetch();
      }
    }
  });

  const roleColors: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700",
    tutor: "bg-indigo-100 text-indigo-700",
    parent: "bg-emerald-100 text-emerald-700"
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
      <Card className="border-0 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-slate-900">{user.name}</TableCell>
                <TableCell className="text-slate-500">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${roleColors[user.role]} border-0 capitalize`}>{user.role}</Badge>
                </TableCell>
                <TableCell className="text-slate-500">{format(new Date(user.createdAt), 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-right">
                  {user.role !== "admin" && (
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => {
                      if(confirm("Are you sure?")) deleteUser({ id: user.id })
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
