import { useGetMyApplications, useGetMyPayments } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/layout/Navbar";
import { format } from "date-fns";
import { Briefcase, IndianRupee, MapPin, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TutorDashboard() {
  const { getAuthHeaders } = useAuth();
  
  const { data: applications, isLoading: isLoadingApps } = useGetMyApplications({
    request: { headers: getAuthHeaders() }
  });

  const { data: payments, isLoading: isLoadingPayments } = useGetMyPayments({
    request: { headers: getAuthHeaders() }
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="bg-slate-900 text-white pt-10 pb-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Tutor Workspace</h1>
          <p className="text-slate-400">Manage your applications and unlocked contacts.</p>
        </div>
      </div>

      <main className="container mx-auto px-4 max-w-5xl -mt-12 relative z-10 pb-20">
        <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
          <CardContent className="p-2 md:p-6">
            <Tabs defaultValue="applications" className="w-full">
              <TabsList className="w-full justify-start border-b border-border bg-transparent h-auto p-0 rounded-none mb-6 overflow-x-auto">
                <TabsTrigger 
                  value="applications" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 text-base font-semibold data-[state=active]:text-primary"
                >
                  <Briefcase className="w-4 h-4 mr-2" /> My Applications
                </TabsTrigger>
                <TabsTrigger 
                  value="payments" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 py-3 text-base font-semibold data-[state=active]:text-primary"
                >
                  <IndianRupee className="w-4 h-4 mr-2" /> Unlocked Contacts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="applications" className="outline-none">
                {isLoadingApps ? <p className="p-8 text-center text-slate-500">Loading...</p> : 
                 applications?.length === 0 ? (
                  <div className="text-center py-16">
                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium mb-4">You haven't applied to any tuitions yet.</p>
                    <Link href="/posts" className="text-primary font-bold hover:underline">Browse Tuitions</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications?.map(app => (
                      <Card key={app.id} className="border border-border/60 shadow-sm rounded-xl overflow-hidden hover:border-primary/30 transition-colors">
                        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <p className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Applied on {format(new Date(app.appliedAt), 'MMM d, yyyy')}
                            </p>
                            <Link href={`/posts/${app.postId}`}>
                              <h4 className="text-lg font-bold text-slate-800 hover:text-primary transition-colors cursor-pointer">
                                {app.postTitle || `Post #${app.postId}`}
                              </h4>
                            </Link>
                          </div>
                          <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 self-start md:self-center">
                            Application Sent
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="payments" className="outline-none">
                 {isLoadingPayments ? <p className="p-8 text-center text-slate-500">Loading...</p> : 
                 payments?.length === 0 ? (
                  <div className="text-center py-16">
                    <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium mb-4">You haven't unlocked any contacts yet.</p>
                    <Link href="/posts" className="text-primary font-bold hover:underline">Find Tuitions</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payments?.map(payment => (
                      <Card key={payment.id} className="border border-border/60 shadow-sm rounded-xl overflow-hidden">
                        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {payment.paymentStatus === "success" ? (
                                <Badge className="bg-emerald-500 hover:bg-emerald-600">Success</Badge>
                              ) : (
                                <Badge variant="destructive">{payment.paymentStatus}</Badge>
                              )}
                              <span className="text-xs text-slate-400 font-medium">{format(new Date(payment.createdAt), 'MMM d, yyyy')}</span>
                            </div>
                            <Link href={`/posts/${payment.postId}`}>
                              <h4 className="text-lg font-bold text-slate-800 hover:text-primary transition-colors cursor-pointer">
                                {payment.postTitle || `Post #${payment.postId}`}
                              </h4>
                            </Link>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-slate-500">Amount Paid</p>
                            <p className="text-xl font-bold text-slate-800">₹{(payment.amount / 100).toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
