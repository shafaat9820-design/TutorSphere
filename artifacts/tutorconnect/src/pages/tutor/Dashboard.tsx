import { useGetMyApplications, useGetMyPayments } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { format } from "date-fns";
import { Briefcase, IndianRupee, CheckCircle2, Clock, LayoutDashboard, Sparkles} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function TutorDashboard() {
  const { getAuthHeaders, user } = useAuth();

  const { data: applications, isLoading: isLoadingApps } = useGetMyApplications({
    request: { headers: getAuthHeaders() },
  });

  const { data: payments, isLoading: isLoadingPayments } = useGetMyPayments({
    request: { headers: getAuthHeaders() },
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/60">
      <Navbar />

      {/* Hero band */}
      <div className="relative bg-gradient-to-br from-[#0f0618] to-[#0d1540] text-white pt-12 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-25" />
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-indigo-600/15 rounded-full blur-[80px]" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="flex items-center gap-2 text-violet-300 text-sm font-medium mb-3">
            <LayoutDashboard className="w-4 h-4" /> Tutor Workspace
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-1">
            Welcome back, {user?.name?.split(" ")[0] || "Tutor"} 👋
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <p className="text-slate-400">Track your applications and unlocked parent contacts.</p>
            {(user as any)?.planType && (user as any).planType !== 'none' && (user as any).planExpiry && new Date((user as any).planExpiry) > new Date() && (
              <Badge className="bg-violet-600 text-white border-violet-400 px-3 py-1 animate-pulse">
                <Sparkles className="w-3 h-3 mr-1 fill-white" />
                {(user as any).planType.toUpperCase()} PLAN ACTIVE
              </Badge>
            )}
          </div>
          {(user as any)?.planExpiry && new Date((user as any).planExpiry) > new Date() && (
            <p className="text-xs text-violet-300 mt-2 font-medium">
              Unlimited access until {format(new Date((user as any).planExpiry), 'MMMM d, yyyy')}
            </p>
          )}
        </div>
      </div>

      {/* Tabs panel */}
      <main className="container mx-auto px-4 max-w-5xl -mt-12 relative z-10 pb-16 flex-1">
        <Card className="border-0 shadow-xl shadow-slate-200/60 rounded-2xl overflow-hidden bg-white/95 backdrop-blur-xl">
          <CardContent className="p-4 md:p-6">
            <Tabs defaultValue="applications" className="w-full">
              <TabsList className="w-full justify-start border-b border-slate-100 bg-transparent h-auto p-0 rounded-none mb-6 overflow-x-auto">
                <TabsTrigger
                  value="applications"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-violet-600 data-[state=active]:text-violet-700 rounded-none px-5 py-3 text-sm font-semibold text-slate-500"
                >
                  <Briefcase className="w-4 h-4 mr-2" /> My Applications
                  {applications && applications.length > 0 && (
                    <span className="ml-2 bg-violet-100 text-violet-700 text-xs rounded-full px-2 py-0.5 font-bold">
                      {applications.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="payments"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-violet-600 data-[state=active]:text-violet-700 rounded-none px-5 py-3 text-sm font-semibold text-slate-500"
                >
                  <IndianRupee className="w-4 h-4 mr-2" /> Unlocked Contacts
                </TabsTrigger>
              </TabsList>

              {/* Applications */}
              <TabsContent value="applications" className="outline-none">
                {isLoadingApps ? (
                  <div className="grid gap-3">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />)}
                  </div>
                ) : applications?.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-7 h-7 text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-semibold mb-1">No applications yet</p>
                    <p className="text-slate-400 text-sm mb-5">Start applying to tuitions that match your expertise.</p>
                    <Link href="/posts" className="text-violet-600 font-bold hover:underline text-sm">
                      Browse Tuitions →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applications?.map((app, i) => (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.35 }}
                      >
                        <Card className="border border-slate-100 shadow-sm rounded-xl hover:border-violet-200 hover:shadow-md transition-all duration-200">
                          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Applied {format(new Date(app.appliedAt.endsWith('Z') || app.appliedAt.includes('+') ? app.appliedAt : app.appliedAt + 'Z'), 'MMM d, yyyy')}
                              </p>
                              <Link href={`/posts/${app.postId}`}>
                                <h4 className="text-base font-bold text-slate-800 hover:text-violet-700 transition-colors cursor-pointer capitalize">
                                  {app.postTitle || `Post #${app.postId}`}
                                </h4>
                              </Link>
                            </div>
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 shrink-0 font-semibold text-xs">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Applied
                            </Badge>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Payments */}
              <TabsContent value="payments" className="outline-none">
                {isLoadingPayments ? (
                  <div className="grid gap-3">
                    {[...Array(2)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />)}
                  </div>
                ) : payments?.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-7 h-7 text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-semibold mb-1">No contacts unlocked yet</p>
                    <p className="text-slate-400 text-sm mb-5">Pay a small fee to unlock a parent's contact information.</p>
                    <Link href="/posts" className="text-violet-600 font-bold hover:underline text-sm">
                      Find Tuitions →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {payments?.map((payment, i) => (
                      <motion.div
                        key={payment.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.35 }}
                      >
                        <Card className="border border-slate-100 shadow-sm rounded-xl hover:border-violet-200 hover:shadow-md transition-all duration-200">
                          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                {payment.paymentStatus === "success" ? (
                                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs font-bold">✓ Success</Badge>
                                ) : (
                                  <Badge variant="destructive" className="text-xs">{payment.paymentStatus}</Badge>
                                )}
                                <span className="text-xs text-slate-400">
                                  {format(new Date(payment.createdAt.endsWith('Z') || payment.createdAt.includes('+') ? payment.createdAt : payment.createdAt + 'Z'), 'MMM d, yyyy')}
                                </span>
                              </div>
                              <Link href={`/posts/${payment.postId}`}>
                                <h4 className="text-base font-bold text-slate-800 hover:text-violet-700 transition-colors cursor-pointer capitalize">
                                  {payment.postTitle || `Post #${payment.postId}`}
                                </h4>
                              </Link>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-400 font-medium">Amount Paid</p>
                              <p className="text-xl font-extrabold text-slate-800">₹{(payment.amount / 100).toLocaleString("en-IN")}</p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
