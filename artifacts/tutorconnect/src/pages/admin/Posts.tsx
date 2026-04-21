import { useAdminGetPosts, useAdminToggleFeatured, useDeletePost } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ExternalLink, Sparkles, MapPin, GraduationCap } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function AdminPosts() {
  const { getAuthHeaders } = useAuth();
  const { toast } = useToast();
  
  const { data, refetch, isLoading } = useAdminGetPosts({ limit: 100 }, {
    request: { headers: getAuthHeaders() }
  });

  const { mutate: toggleFeatured } = useAdminToggleFeatured({
    request: { headers: getAuthHeaders() },
    mutation: { 
      onSuccess: () => { 
        toast({ title: "Post status updated" }); 
        refetch(); 
      } 
    }
  });

  const { mutate: deletePost } = useDeletePost({
    request: { headers: getAuthHeaders() },
    mutation: { 
      onSuccess: () => { 
        toast({ title: "Post removed from platform" }); 
        refetch(); 
      } 
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-violet-600" />
            Tuition Requirements
          </h2>
          <p className="text-sm text-slate-500">Review and manage all active tuition postings.</p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Requirement Details</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Educational Level</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Budget (Monthly)</TableHead>
              <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Featured Status</TableHead>
              <TableHead className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="h-40 text-center text-slate-400 font-medium">Loading requirements...</TableCell></TableRow>
            ) : data?.posts.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-40 text-center text-slate-400 font-medium">No posts available to manage.</TableCell></TableRow>
            ) : data?.posts.map((post) => (
              <TableRow key={post.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                <TableCell className="py-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-slate-900 line-clamp-1">{post.title}</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {post.address}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0 border-0">{post.class}</Badge>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">{post.subjects}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <span className="font-bold text-slate-900 tracking-tight">₹{post.monthlyFee.toLocaleString('en-IN')}</span>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Switch 
                      checked={post.featured} 
                      onCheckedChange={(v) => toggleFeatured({ id: post.id, data: { featured: v } })}
                      className="data-[state=checked]:bg-amber-500" 
                    />
                    {post.featured && <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />}
                  </div>
                </TableCell>
                <TableCell className="text-right py-4 px-6">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/posts/${post.id}`}>
                      <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl text-violet-600 hover:bg-violet-50 transition-all" title="View Public Page">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-9 h-9 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all" 
                      onClick={() => {
                        if(confirm("Confirm deletion of this tuition post? This will remove it for all users.")) deletePost({ id: post.id })
                      }}
                      title="Delete Post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
