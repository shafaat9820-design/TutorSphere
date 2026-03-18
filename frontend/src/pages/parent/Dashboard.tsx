import { useGetMyPosts } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, MapPin, IndianRupee, Users } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { format } from "date-fns";

export default function ParentDashboard() {
  const { getAuthHeaders } = useAuth();
  const { data: posts, isLoading } = useGetMyPosts({
    request: { headers: getAuthHeaders() }
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-800">My Tuitions</h1>
            <p className="text-slate-500 mt-1">Manage your requirements and view applicants.</p>
          </div>
          <Link href="/parent/posts/new">
            <Button className="rounded-xl shadow-md font-semibold hover-elevate">
              <Plus className="w-4 h-4 mr-2" /> Post New Requirement
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4"><Card className="h-32 animate-pulse bg-slate-200 border-0" /></div>
        ) : posts?.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-300 bg-transparent shadow-none">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">No posts yet</h3>
              <p className="text-slate-500 mb-6">Create your first requirement to start receiving applications from qualified tutors.</p>
              <Link href="/parent/posts/new">
                <Button className="rounded-xl">Create Post</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {posts?.map((post) => (
              <Card key={post.id} className="border-0 shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6 flex flex-col md:flex-row gap-6 justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-slate-100 border-0">Class {post.class}</Badge>
                        <span className="text-xs text-slate-400 font-medium">{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                      <Link href={`/posts/${post.id}`}>
                        <h3 className="text-xl font-bold text-slate-800 hover:text-primary transition-colors cursor-pointer">{post.title}</h3>
                      </Link>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400"/> {post.mode}</span>
                        <span className="flex items-center gap-1.5"><IndianRupee className="w-4 h-4 text-slate-400"/> {post.monthlyFee.toLocaleString('en-IN')}/mo</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center justify-center min-w-[140px] border border-slate-100">
                      <Users className="w-6 h-6 text-primary mb-1" />
                      <span className="text-2xl font-bold text-slate-800">--</span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 text-center">Applicants</span>
                      {/* Would link to applicants list here if API returned counts */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
