import { useState } from "react";
import { Link } from "wouter";
import { useListPosts, TuitionPost, ListPostsMode, ListPostsMedium } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, GraduationCap, Clock, IndianRupee, SlidersHorizontal, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

export default function PostList() {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<ListPostsMode | "all">("all");
  const [medium, setMedium] = useState<ListPostsMedium | "all">("all");

  const { data, isLoading } = useListPosts({
    search: search || undefined,
    mode: mode !== "all" ? mode : undefined,
    medium: medium !== "all" ? medium : undefined,
    limit: 20
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="bg-slate-900 text-white py-16 mb-8">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Find Tuitions</h1>
          <p className="text-slate-400 text-lg max-w-2xl mb-8">Browse the latest requirements posted by parents and students. Apply to the ones that match your expertise.</p>
          
          <div className="bg-white rounded-2xl p-2 max-w-3xl flex flex-col sm:flex-row gap-2 shadow-xl shadow-black/10">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by subject, class, or location..." 
                className="pl-12 h-14 border-0 shadow-none text-base focus-visible:ring-0 text-slate-900 bg-transparent"
              />
            </div>
            <Button className="h-14 px-8 rounded-xl shrink-0 text-base font-semibold">Search Jobs</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-72 shrink-0">
            <Card className="sticky top-24 border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden">
              <div className="bg-slate-50 p-4 border-b border-border flex items-center gap-2 font-semibold text-slate-700">
                <SlidersHorizontal className="w-5 h-5" /> Filters
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700">Teaching Mode</Label>
                  <Select value={mode} onValueChange={(v: any) => setMode(v)}>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Mode</SelectItem>
                      <SelectItem value={ListPostsMode.home}>Home Tuition (Offline)</SelectItem>
                      <SelectItem value={ListPostsMode.online}>Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700">Medium</Label>
                  <Select value={medium} onValueChange={(v: any) => setMedium(v)}>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Select medium" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Medium</SelectItem>
                      <SelectItem value={ListPostsMedium.english}>English Medium</SelectItem>
                      <SelectItem value={ListPostsMedium.hindi}>Hindi Medium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t border-border">
                  <Button variant="outline" className="w-full h-11 rounded-xl text-primary border-primary/20 hover:bg-primary/5" onClick={() => { setSearch(""); setMode("all"); setMedium("all"); }}>
                    Reset Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : data?.posts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-border/50 shadow-sm">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800">No tuitions found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-600 font-medium">Showing <span className="text-slate-900 font-bold">{data?.total}</span> requirements</p>
                </div>
                
                {data?.posts.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, index }: { post: TuitionPost, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/posts/${post.id}`}>
        <Card className="border-0 shadow-md shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden group">
          <CardContent className="p-0">
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  {post.featured && (
                    <Badge className="bg-amber-500 hover:bg-amber-600 text-white uppercase text-[10px] tracking-wider font-bold">Featured</Badge>
                  )}
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors">Class {post.class}</Badge>
                  <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md">
                    <GraduationCap className="w-4 h-4 text-slate-500" /> {post.subjects}
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md">
                    <MapPin className="w-4 h-4 text-slate-500" /> {post.location || post.address}
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md capitalize">
                    {post.mode} Mode
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-start md:items-end justify-between self-stretch shrink-0 min-w-[140px]">
                <div className="text-left md:text-right mb-4 md:mb-0">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Monthly Fee</p>
                  <div className="flex items-center text-2xl font-bold text-emerald-600">
                    <IndianRupee className="w-5 h-5 mr-0.5" />{post.monthlyFee.toLocaleString('en-IN')}
                  </div>
                </div>
                
                <Button className="w-full md:w-auto rounded-xl shadow-md group-hover:shadow-lg transition-all">
                  View Details <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
