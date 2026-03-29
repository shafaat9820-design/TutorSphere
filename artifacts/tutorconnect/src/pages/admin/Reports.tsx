import { useAdminGetReports, useAdminDeleteReport } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Flag, Trash2, AlertTriangle, User, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function AdminReports() {
  const { getAuthHeaders } = useAuth();
  const { toast } = useToast();
  
  const { data, refetch, isLoading } = useAdminGetReports({ limit: 100 }, {
    request: { headers: getAuthHeaders() }
  });

  const { mutate: deleteReport } = useAdminDeleteReport({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: () => {
        toast({ title: "Report dismissed" });
        refetch();
      }
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Flag className="w-6 h-6 text-red-600" />
            Content Reports
          </h2>
          <p className="text-sm text-slate-500">Monitor and resolve user-submitted complaints and policy violations.</p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4 pl-6">Report Info</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Reporter</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Category</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Date</TableHead>
              <TableHead className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4 pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="h-40 text-center text-slate-400 font-medium">Scanning reports...</TableCell></TableRow>
            ) : data?.reports.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-40 text-center text-slate-400 font-medium">No active reports. Your community is doing great!</TableCell></TableRow>
            ) : data?.reports.map((report) => (
              <TableRow key={report.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                <TableCell className="py-4 pl-6">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-slate-900 leading-tight italic">"{report.reason}"</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                      Target ID: {report.targetId}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                      <User className="w-3 h-3 text-slate-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-600">{report.reporterName || "Guest"}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="outline" className="bg-red-50 text-red-600 border-0 rounded-lg px-2 py-0.5 font-bold text-[10px] uppercase tracking-wide">
                    {report.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-300" />
                    {format(new Date(report.createdAt), 'MMM dd, yyyy')}
                  </div>
                </TableCell>
                <TableCell className="text-right py-4 pr-6">
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-9 h-9 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all" 
                    onClick={() => {
                      if(confirm("Dismiss this report? This will remove it from the admin console.")) deleteReport({ id: report.id })
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      
      <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-amber-200 shrink-0 h-fit">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-amber-900">Moderation Recommendation</h4>
          <p className="text-sm text-amber-800 leading-relaxed">
            Please investigate each report thoroughly by viewing the target content. Excessive reports on a single user or post might indicate a pattern of policy violation. Use the User Management console to suspend accounts if necessary.
          </p>
        </div>
      </div>
    </div>
  );
}
