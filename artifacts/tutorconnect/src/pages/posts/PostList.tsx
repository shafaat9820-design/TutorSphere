import { useState } from "react";
import { Link } from "wouter";
import { useListPosts, TuitionPost, ListPostsMode, ListPostsMedium } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, GraduationCap, Clock, IndianRupee, SlidersHorizontal, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { INDIAN_STATES } from "@/lib/constants";

export default function PostList() {
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<ListPostsMode | "all">("all");
  const [medium, setMedium] = useState<ListPostsMedium | "all">("all");
  const [state, setState] = useState<string | "all">("all");
  const [timeFilter, setTimeFilter] = useState<string | "all">("all");

  const { data, isLoading } = useListPosts({
    search: search || undefined,
    mode: mode !== "all" ? mode : undefined,
    medium: medium !== "all" ? medium : undefined,
    state: state !== "all" ? state : undefined,
    timeFilter: timeFilter !== "all" ? timeFilter : undefined,
    limit: 20,
  } as any);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#0f0618] to-[#1a084a] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-[80px]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <Sparkles className="w-3.5 h-3.5" /> Live Requirements
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-white"><span className="gradient-text">Tuitions/Jobs</span></h1>
          <p className="text-slate-400 text-lg max-w-xl mb-10">Browse the latest requirements posted by parents and students. Apply to the ones that match your expertise.</p>

          {/* Search bar */}
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2 max-w-2xl flex gap-2 shadow-2xl shadow-black/20">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by subject, class, or location..."
                className="pl-12 h-12 border-0 shadow-none text-base focus-visible:ring-0 text-slate-900 bg-transparent"
              />
            </div>
            <Button className="h-12 px-6 rounded-xl shrink-0 font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border-0 text-white shadow-md shadow-violet-500/30">
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-8">
        <div className="flex flex-col lg:flex-row gap-7">
          {/* Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <Card className="sticky top-24 border-0 shadow-lg shadow-slate-200/60 rounded-2xl overflow-hidden card-premium">
              <div className="bg-gradient-to-r from-violet-50 to-purple-50/50 p-4 border-b border-violet-100/50 flex items-center gap-2 font-semibold text-slate-800">
                <SlidersHorizontal className="w-4 h-4 text-violet-600" /> Filters
              </div>
              <CardContent className="p-5 space-y-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Teaching Mode</Label>
                  <Select value={mode} onValueChange={(v: any) => setMode(v)}>
                    <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50/80 text-sm">
                      <SelectValue placeholder="Any mode" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">Any Mode</SelectItem>
                      <SelectItem value={ListPostsMode.home}>Home Tuition</SelectItem>
                      <SelectItem value={ListPostsMode.online}>Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Medium</Label>
                  <Select value={medium} onValueChange={(v: any) => setMedium(v)}>
                    <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50/80 text-sm">
                      <SelectValue placeholder="Any medium" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">Any Medium</SelectItem>
                      <SelectItem value={ListPostsMedium.english}>English</SelectItem>
                      <SelectItem value={ListPostsMedium.hindi}>Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wide">State</Label>
                  <Select value={state} onValueChange={(v: any) => setState(v)}>
                    <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50/80 text-sm">
                      <SelectValue placeholder="All States" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl max-h-60">
                      <SelectItem value="all">All States</SelectItem>
                      {INDIAN_STATES.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Time Posted</Label>
                  <Select value={timeFilter} onValueChange={(v: any) => setTimeFilter(v)}>
                    <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50/80 text-sm">
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">Any Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  className="w-full h-9 rounded-xl text-sm text-violet-700 border-violet-200 bg-violet-50/50 hover:bg-violet-100"
                  onClick={() => { setSearch(""); setMode("all"); setMedium("all"); setState("all"); setTimeFilter("all"); }}
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Cards */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-24">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-violet-600" />
                  <p className="text-slate-500 text-sm">Loading requirements...</p>
                </div>
              </div>
            ) : data?.posts.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">No tuitions found</h3>
                <p className="text-slate-500">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500 font-medium">
                    Showing <span className="text-slate-800 font-bold text-base">{data?.total}</span> requirements
                  </p>
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

function PostCard({ post, index }: { post: TuitionPost; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
    >
      <Link href={`/posts/${post.id}`}>
        <div className="card-premium cursor-pointer group p-6 md:p-7">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div className="flex-1 space-y-3 min-w-0">
              {/* Badges row */}
              <div className="flex items-center gap-2 flex-wrap">
                {post.featured && (
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] font-bold uppercase tracking-wider">
                    ⭐ Featured
                  </Badge>
                )}
                <Badge className="bg-violet-100 text-violet-700 border-violet-200 font-semibold">
                  Class {post.class}
                </Badge>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(
                    new Date(post.createdAt.endsWith('Z') || post.createdAt.includes('+') ? post.createdAt : post.createdAt + 'Z'),
                    { addSuffix: true }
                  )}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-violet-700 transition-colors duration-200 line-clamp-2 capitalize">
                {post.title}
              </h2>

              {/* Meta pills */}
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg font-medium text-xs">
                  <GraduationCap className="w-3.5 h-3.5 text-violet-500" /> {post.subjects}
                </span>
                <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg font-medium text-xs">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {post.address}{post.state ? `, ${post.state}` : ""}
                </span>
                <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg font-medium text-xs capitalize">
                  {post.mode} Mode
                </span>
              </div>
            </div>

            {/* Fee + CTA */}
            <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
              <div className="text-left md:text-right">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Monthly Fee</p>
                <div className="flex items-center text-2xl font-extrabold text-emerald-600">
                  <IndianRupee className="w-5 h-5 mr-0.5" />
                  {post.monthlyFee.toLocaleString("en-IN")}
                </div>
              </div>
              <Button
                size="sm"
                className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 shadow-md shadow-violet-500/25 text-xs font-semibold group-hover:shadow-lg transition-all duration-200"
              >
                View Details <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
