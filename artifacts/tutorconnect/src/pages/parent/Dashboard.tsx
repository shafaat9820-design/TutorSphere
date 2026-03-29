import { useGetMyPosts } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, MapPin, IndianRupee, Users, LayoutDashboard, Zap, Calendar, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function ParentDashboard() {
  const { getAuthHeaders, user } = useAuth();
  const { data: posts, isLoading } = useGetMyPosts({
    request: { headers: getAuthHeaders() },
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/60">
      <Navbar />

      {/* Hero band */}
      <div className="relative bg-gradient-to-br from-[#0f0618] to-[#1a084a] text-white pt-12 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-25" />
        <div className="absolute top-0 right-1/3 w-64 h-64 bg-violet-600/15 rounded-full blur-[80px]" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 text-violet-300 text-sm font-medium mb-2">
                <LayoutDashboard className="w-4 h-4" /> Parent Dashboard
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">Hey, {user?.name?.split(' ')[0] || "Parent"} 👋</h1>
              <p className="text-slate-400 mt-1">Manage your requirements and find the best tutors.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/pricing">
                <Button variant="outline" className="rounded-2xl border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40">
                  <Zap className="w-4 h-4 mr-2 text-amber-400 fill-amber-400" /> Upgrade Plan
                </Button>
              </Link>
              <Link href="/parent/posts/new">
                <Button className="rounded-2xl font-semibold bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 border-0 text-white shadow-lg shadow-violet-500/30 hover:-translate-y-0.5 transition-all duration-200">
                  <Plus className="w-4 h-4 mr-2" /> Post New
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <main className="container mx-auto px-4 max-w-5xl -mt-20 relative z-10 pb-16 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${user?.parentPlanExpiry && new Date(user.parentPlanExpiry) > new Date() ? 'bg-amber-100' : 'bg-slate-100'}`}>
                <Zap className={`w-6 h-6 ${user?.parentPlanExpiry && new Date(user.parentPlanExpiry) > new Date() ? 'text-amber-600 fill-amber-600' : 'text-slate-400'}`} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Plan</p>
                <h4 className="text-lg font-bold text-slate-800">
                  {user?.parentPlanExpiry && new Date(user.parentPlanExpiry) > new Date() ? 'Premium Plan' : 'Free Trial'}
                </h4>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-violet-100 rounded-xl">
                <BookOpen className="w-6 h-6 text-violet-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Usage</p>
                <div className="flex justify-between items-end">
                  <h4 className="text-lg font-bold text-slate-800">{user?.activePostCount} / {user?.parentPlanExpiry && new Date(user.parentPlanExpiry) > new Date() ? 5 : 1}</h4>
                  <span className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-tighter">Active Posts</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Calendar className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Valid Until</p>
                <h4 className="text-lg font-bold text-slate-800">
                  {user?.parentPlanExpiry && new Date(user.parentPlanExpiry) > new Date() 
                    ? format(new Date(user.parentPlanExpiry), 'MMM d, yyyy')
                    : 'Next Month (Free)'}
                </h4>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">My Active Posts</h2>
          <span className="text-sm font-medium text-slate-500">{posts?.length || 0} Records</span>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : posts?.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <BookOpen className="w-8 h-8 text-violet-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No posts yet</h3>
            <p className="text-slate-500 mb-7 max-w-sm mx-auto">Create your first requirement to start receiving applications from qualified tutors.</p>
            <Link href="/parent/posts/new">
              <Button className="rounded-2xl font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border-0 text-white shadow-lg shadow-violet-500/30">
                <Plus className="w-4 h-4 mr-2" /> Create Post
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {posts?.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: "easeOut" }}
              >
                <Card className="border-0 card-premium overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6 flex flex-col md:flex-row gap-6 justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <Badge className="bg-violet-100 text-violet-700 border-violet-200 font-semibold">Class {post.class}</Badge>
                          <span className="text-xs text-slate-400 font-medium">
                            {format(new Date(post.createdAt.endsWith('Z') || post.createdAt.includes('+') ? post.createdAt : post.createdAt + 'Z'), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <Link href={`/posts/${post.id}`}>
                          <h3 className="text-xl font-bold text-slate-900 hover:text-violet-700 transition-colors cursor-pointer capitalize">{post.title}</h3>
                        </Link>
                        <div className="flex flex-wrap gap-3 text-sm text-slate-500 font-medium">
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" />{post.mode} Mode</span>
                          <span className="flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5 text-slate-400" />₹{post.monthlyFee.toLocaleString("en-IN")}/mo</span>
                        </div>
                      </div>
                      <div className="bg-violet-50/80 border border-violet-100 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[130px] gap-1">
                        <Users className="w-5 h-5 text-violet-500 mb-0.5" />
                        <span className="text-2xl font-extrabold text-slate-800">—</span>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Applicants</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
