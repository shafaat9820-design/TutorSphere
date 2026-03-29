import { useAdminGetPayments } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, CreditCard, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function AdminPayments() {
  const { getAuthHeaders } = useAuth();
  const { data, isLoading } = useAdminGetPayments({ limit: 100 }, {
    request: { headers: getAuthHeaders() }
  });

  const statusStyles: Record<string, string> = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-100 ring-1 ring-emerald-500/10",
    pending: "bg-amber-50 text-amber-700 border-amber-100 ring-1 ring-amber-500/10",
    failed: "bg-red-50 text-red-700 border-red-100 ring-1 ring-red-500/10"
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <IndianRupee className="w-6 h-6 text-violet-600" />
            Financial Records
          </h2>
          <p className="text-sm text-slate-500">Monitor all platform transactions and unlock history.</p>
        </div>
        
        {!isLoading && data && (
          <div className="bg-violet-600 px-6 py-3 rounded-2xl shadow-lg shadow-violet-500/20 flex items-center gap-4">
            <div className="p-2 bg-violet-500/20 rounded-lg">
              <CreditCard className="w-5 h-5 text-violet-100" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-violet-200 uppercase tracking-widest leading-none mb-1">Total Gross Revenue</p>
              <p className="text-xl font-display font-bold text-white leading-none">₹{(data.totalRevenue / 100).toLocaleString('en-IN')}</p>
            </div>
          </div>
        )}
      </div>

      <Card className="border-slate-200 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4 pl-6">Transaction ID</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Associated Post</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Total Amount</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Status</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4 pr-6">Date & Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="h-40 text-center text-slate-400 font-medium">Loading ledger...</TableCell></TableRow>
            ) : data?.payments.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-40 text-center text-slate-400 font-medium">No transactions recorded yet.</TableCell></TableRow>
            ) : data?.payments.map((payment) => (
              <TableRow key={payment.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                <TableCell className="py-4 pl-6">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Order: {payment.razorpayOrderId}</span>
                    <span className="text-[10px] text-slate-300 font-mono">ID: {payment.id}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2 group cursor-pointer">
                    <span className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">{payment.postTitle || "Post Deleted"}</span>
                    <ArrowRight className="w-3 h-3 text-slate-200 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <span className="font-bold text-slate-900">₹{(payment.amount / 100).toLocaleString('en-IN')}</span>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="outline" className={`${statusStyles[payment.paymentStatus] || "bg-slate-50"} rounded-lg px-2.5 py-0.5 border-0 capitalize font-bold text-[10px] tracking-wide`}>
                    {payment.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500 py-4 pr-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-300" />
                    {format(new Date(payment.createdAt), 'MMM dd, yyyy • HH:mm')}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
