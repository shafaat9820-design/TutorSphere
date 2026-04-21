import { useParams, Link } from "wouter";
import { 
  useGetPost, 
  useGetPostContact, 
  useApplyToPost, 
  useCreatePaymentOrder, 
  useVerifyPayment 
} from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { loadRazorpay } from "@/lib/razorpay";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, GraduationCap, Clock, IndianRupee, CalendarDays, 
  PhoneCall, ShieldCheck, CheckCircle2, ChevronLeft, LockKeyhole, BookOpen, Loader2, Zap
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id || "0");
  const { user, getAuthHeaders } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { data: post, isLoading, error } = useGetPost(postId);
  
  // Try to fetch contact - if it 402s, we haven't paid.
  const { data: contactData, isError: isContactError } = useGetPostContact(postId, {
    query: {
      queryKey: [`/api/posts/${postId}/contact`],
      enabled: !!user && user.role === "tutor",
      retry: false
    },
    request: { headers: getAuthHeaders() }
  });

  const { mutate: apply, isPending: isApplying } = useApplyToPost({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: () => {
        toast({ title: "Application Sent!", description: "The parent has been notified." });
        // Assume apply doesn't immediately unlock contact, just notifies
      },
      onError: (err: any) => {
        toast({ title: "Failed to apply", description: err.message, variant: "destructive" });
      }
    }
  });

  const { mutateAsync: createOrder } = useCreatePaymentOrder({
    request: { headers: getAuthHeaders() }
  });

  const { mutateAsync: verifyPayment } = useVerifyPayment({
    request: { headers: getAuthHeaders() }
  });

  const handleFreeUnlock = async () => {
    try {
      setIsProcessingPayment(true);
      const response = await fetch(`/api/posts/${postId}/unlock-free`, {
        method: "POST",
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast({ title: "Success", description: "Contact unlocked using your free trial!" });
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${postId}/contact`] });
      // We should also refresh the user profile to update freeContactUsed
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    } catch (err: any) {
      toast({ title: "Unlock Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleUnlockContact = async () => {
    if (user && !user.freeContactUsed) {
      return handleFreeUnlock();
    }

    try {
      setIsProcessingPayment(true);
      const order = await createOrder({ data: { postId } });
// ... rest of the function (merged in replacement)
      const res = await loadRazorpay();
      if (!res) throw new Error("Razorpay SDK failed to load. Are you online?");

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "TutorSphere",
        description: "Unlock Parent Contact Details",
        order_id: order.orderId,
        handler: async function (response: any) {
          try {
            await verifyPayment({
              data: {
                postId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              }
            });
            toast({ title: "Payment Successful", description: "Contact details unlocked!" });
            queryClient.invalidateQueries({ queryKey: [`/api/posts/${postId}/contact`] });
          } catch (err: any) {
            toast({ title: "Verification Failed", description: err.message, variant: "destructive" });
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone
        },
        theme: {
          color: "#4f46e5"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to start payment", variant: "destructive" });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) return <LoadingSkeleton />;
  if (error || !post) return <div className="p-20 text-center text-destructive font-bold">Post not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Banner */}
      <div className="bg-slate-900 pt-8 pb-32">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/posts" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-6 text-sm font-medium">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Listings
          </Link>
          <div className="flex flex-wrap gap-3 mb-4">
            {post.featured && <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0">Featured</Badge>}
            <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-0">Class {post.class}</Badge>
            <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-0 capitalize">{post.mode} Mode</Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 max-w-4xl leading-tight">
            {post.title}
          </h1>
          <p className="text-slate-400 flex items-center gap-2 text-sm md:text-base">
            Posted on {format(new Date(post.createdAt.endsWith('Z') || post.createdAt.includes('+') ? post.createdAt : post.createdAt + 'Z'), 'MMMM d, yyyy')} by {post.createdByName || "Parent"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-xl shadow-slate-200/40 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Requirement Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-8">
                  <DetailItem icon={GraduationCap} label="Subjects" value={post.subjects} />
                  <DetailItem icon={MapPin} label="Location" value={`${post.address}${post.state ? `, ${post.state}` : ""}`} />
                  <DetailItem icon={CalendarDays} label="Frequency" value={`${post.daysPerWeek} days/week`} />
                  <DetailItem icon={Clock} label="Duration" value={`${post.duration} hours/day`} />
                  <DetailItem icon={ShieldCheck} label="Medium" value={<span className="capitalize">{post.medium}</span>} />
                  <DetailItem icon={ShieldCheck} label="Tutor Pref." value={<span className="capitalize">{post.genderPreference || "Any gender"}</span>} />
                </div>

                <Separator className="my-6" />
                
                <h3 className="text-lg font-bold text-slate-800 mb-4">Description</h3>
                <div className="prose max-w-none text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {post.description || "No additional description provided by the parent."}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Sidebar */}
          <div className="space-y-6">
            <Card className="border-2 border-primary/10 shadow-xl shadow-primary/5 rounded-2xl overflow-hidden sticky top-24 bg-white">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <p className="text-slate-500 font-medium uppercase tracking-wider text-xs mb-2">Monthly Budget</p>
                  <div className="flex items-center justify-center text-4xl font-bold text-slate-800">
                    <IndianRupee className="w-7 h-7 mr-1 text-slate-400" />
                    {post.monthlyFee.toLocaleString('en-IN')}
                  </div>
                </div>

                <Separator className="my-6" />

                {!user ? (
                  <div className="text-center space-y-4">
                    <p className="text-sm text-slate-600">Login as a tutor to apply and view contact details.</p>
                    <Link href="/login">
                      <Button className="w-full h-12 rounded-xl font-bold shadow-md hover-elevate">Login to Apply</Button>
                    </Link>
                  </div>
                ) : user.role === "tutor" ? (
                  <div className="space-y-4">
                    <Button 
                      variant="outline" 
                      className="w-full h-12 rounded-xl font-bold border-2 border-primary/20 text-primary hover:bg-primary/5"
                      onClick={() => apply({ data: { postId } })}
                      disabled={isApplying}
                    >
                      {isApplying ? "Applying..." : "Express Interest (Free)"}
                    </Button>

                    {contactData?.phone ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center mt-4 shadow-sm">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        <p className="text-emerald-800 font-bold mb-1 uppercase tracking-widest text-[10px]">Contact Unlocked</p>
                        <p className="text-2xl font-bold text-slate-900 tracking-widest font-mono">{contactData.phone}</p>
                      </div>
                    ) : (
                      <div className="space-y-4 pt-4">
                        {/* Blurred Contact Preview */}
                        <div className="relative group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 p-6 text-center">
                          <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-10 flex flex-col items-center justify-center p-4">
                            <LockKeyhole className="w-8 h-8 text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
                            <p className="text-sm font-bold text-slate-800 uppercase tracking-tighter">Contact Number Locked</p>
                          </div>
                          <p className="text-2xl font-bold text-slate-200 blur-[2px] select-none tracking-widest font-mono">+91 99XXXXXX21</p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <Button 
                            onClick={handleUnlockContact}
                            disabled={isProcessingPayment}
                            className={`w-full h-12 rounded-xl font-bold text-white shadow-lg border-0 transition-all flex items-center justify-center gap-2 ${
                              user && !user.freeContactUsed 
                                ? "bg-emerald-600 hover:bg-emerald-700" 
                                : "bg-slate-900 hover:bg-slate-800"
                            }`}
                          >
                            {isProcessingPayment ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                              <>
                                {user && !user.freeContactUsed ? (
                                  <><Zap className="w-4 h-4 fill-white" /> Unlock for Free (Trial)</>
                                ) : (
                                  <>Unlock for ₹49 or get unlimited access</>
                                )}
                              </>
                            )}
                          </Button>
                          
                          {user?.freeContactUsed && (
                             <p className="text-center text-xs font-semibold text-rose-500 mt-1 mb-2">
                               Free access used. Upgrade to continue.
                             </p>
                          )}

                          <div className="relative py-2 mt-2">
                            <div className="absolute inset-0 flex items-center"><Separator /></div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-white px-2 text-slate-400">OR</span></div>
                          </div>

                          <Link href="/pricing" className="w-full">
                            <Button 
                              variant="outline"
                              className="w-full h-12 rounded-xl font-bold border-2 border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300 transition-all flex items-center justify-center gap-2"
                            >
                              <Zap className="w-4 h-4 fill-violet-600 text-violet-600" />
                              Get Unlimited Access
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center bg-slate-50 p-4 rounded-xl">
                    <p className="text-sm text-slate-600 font-medium">You are logged in as a {user.role}. Only tutors can apply to posts.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }: { icon: any, label: string, value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-slate-100 p-2 rounded-lg text-slate-500 shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-slate-800 font-medium">{value}</p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 h-64 pt-8">
        <div className="container mx-auto px-4"><Skeleton className="h-10 w-3/4 bg-white/10" /></div>
      </div>
      <div className="container mx-auto px-4 -mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-[400px] lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-[300px] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
