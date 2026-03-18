import { useAdminGetPosts, useAdminToggleFeatured, useDeletePost } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Link as LinkIcon } from "lucide-react";
import { Link } from "wouter";

export default function AdminPosts() {
  const { getAuthHeaders } = useAuth();
  const { toast } = useToast();
  
  const { data, refetch } = useAdminGetPosts({ limit: 100 }, {
    request: { headers: getAuthHeaders() }
  });

  const { mutate: toggleFeatured } = useAdminToggleFeatured({
    request: { headers: getAuthHeaders() },
    mutation: { onSuccess: () => { toast({ title: "Updated" }); refetch(); } }
  });

  const { mutate: deletePost } = useDeletePost({
    request: { headers: getAuthHeaders() },
    mutation: { onSuccess: () => { toast({ title: "Post deleted" }); refetch(); } }
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Tuition Posts</h2>
      <Card className="border-0 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Class/Subj</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium text-slate-900 max-w-[200px] truncate">{post.title}</TableCell>
                <TableCell className="text-slate-500 text-sm">{post.class} - {post.subjects}</TableCell>
                <TableCell className="text-slate-900 font-medium">₹{post.monthlyFee}</TableCell>
                <TableCell>
                  <Switch 
                    checked={post.featured} 
                    onCheckedChange={(v) => toggleFeatured({ id: post.id, data: { featured: v } })} 
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/posts/${post.id}`}>
                      <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                        <LinkIcon className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => {
                      if(confirm("Are you sure?")) deletePost({ id: post.id })
                    }}>
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
