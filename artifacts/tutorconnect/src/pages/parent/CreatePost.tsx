import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreatePost, CreatePostRequestMode, CreatePostRequestMedium, CreatePostRequestGenderPreference } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChevronLeft, Loader2, Zap, AlertCircle, CheckCircle } from "lucide-react";
import { INDIAN_STATES } from "@/lib/constants";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const createPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  class: z.string().min(1, "Required"),
  subjects: z.string().min(2, "Required"),
  genderPreference: z.enum([CreatePostRequestGenderPreference.male, CreatePostRequestGenderPreference.female, CreatePostRequestGenderPreference.any]).nullable().optional(),
  medium: z.enum([CreatePostRequestMedium.english, CreatePostRequestMedium.hindi]),
  mode: z.enum([CreatePostRequestMode.home, CreatePostRequestMode.online]),
  address: z.string().min(5, "Required"),
  state: z.string().min(1, "Required"),
  duration: z.coerce.number().min(1, "Minimum 1 hour"),
  daysPerWeek: z.coerce.number().min(1).max(7),
  monthlyFee: z.coerce.number().min(500, "Minimum fee is 500"),
  contactPhone: z.string().min(10, "Required"),
  description: z.string().optional()
});

export default function CreatePost() {
  const { getAuthHeaders, user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "", class: "", subjects: "", address: "", state: "",
      duration: 1, daysPerWeek: 3, monthlyFee: 5000, 
      contactPhone: user?.phone || "", description: "",
      mode: CreatePostRequestMode.home,
      medium: CreatePostRequestMedium.english,
      genderPreference: CreatePostRequestGenderPreference.any
    },
  });

  const { mutate, isPending } = useCreatePost({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: () => {
        toast({ title: "Success", description: "Requirement posted successfully!" });
        setLocation("/parent/dashboard");
      },
      onError: (err: any) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    }
  });

  const onSubmit = (values: z.infer<typeof createPostSchema>) => {
    mutate({ data: values });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="bg-slate-900 pb-24 pt-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="ghost" className="text-slate-400 hover:text-white mb-4 -ml-4" onClick={() => window.history.back()}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Post a Requirement</h1>
              <p className="text-slate-400">Fill in the details to find the perfect tutor.</p>
            </div>
            {user?.role === "parent" && (
              <div className="hidden md:block bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest mb-1">Active Posts</p>
                <div className="text-2xl font-bold text-white">{user.activePostCount} / {user.parentPlanExpiry && new Date(user.parentPlanExpiry) > new Date() ? 5 : 1}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl -mt-16 relative z-10 pb-20">
        {(() => {
          const now = new Date();
          const hasActivePlan = user?.parentPlanExpiry && new Date(user.parentPlanExpiry) > now;
          
          let isFreePostEligible = false;
          const lastFreePost = user?.freePostUsedAt ? new Date(user.freePostUsedAt) : null;
          if (!lastFreePost || (lastFreePost.getMonth() !== now.getMonth() || lastFreePost.getFullYear() !== now.getFullYear())) {
            isFreePostEligible = true;
          }

          if (!isFreePostEligible && !hasActivePlan) {
            return (
              <Card className="border-0 shadow-2xl shadow-indigo-200/50 rounded-3xl overflow-hidden">
                <div className="bg-indigo-600 p-8 text-center text-white">
                  <Zap className="w-12 h-12 mx-auto mb-4 fill-amber-400 text-amber-400" />
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Upgrade to Post More</h2>
                  <p className="text-indigo-100 opacity-90">You've used your free post for this month. Upgrade to our Premium Plan to post up to 5 requirements.</p>
                </div>
                <CardContent className="p-8 md:p-12 text-center space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-lg mx-auto">
                    <BenefitItem text="Post up to 5 requirements" />
                    <BenefitItem text="30 days validity" />
                    <BenefitItem text="Priority support" />
                    <BenefitItem text="Verified tutor matches" />
                  </div>
                  <div className="pt-4">
                    <Link href="/pricing" className="w-full">
                      <Button size="lg" className="w-full md:w-auto px-12 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold shadow-xl shadow-indigo-200">
                        Get Premium for ₹99
                      </Button>
                    </Link>
                  </div>
                  <p className="text-slate-400 text-sm italic">New free post available next month.</p>
                </CardContent>
              </Card>
            );
          }

          if (hasActivePlan && user && user.activePostCount >= 5) {
            return (
              <Card className="border-0 shadow-xl rounded-2xl p-10 text-center">
                <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Active Post Limit Reached</h2>
                <p className="text-slate-600 mb-6 font-medium">You currently have 5 active posts, which is the maximum allowed. Please delete or close an existing post to create a new one.</p>
                <Link href="/parent/dashboard">
                  <Button className="rounded-xl px-10">Manage Posts</Button>
                </Link>
              </Card>
            );
          }

          return (
            <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-2xl">
              <CardContent className="p-6 md:p-10">
                {isFreePostEligible && (
                  <Alert className="mb-8 bg-emerald-50 border-emerald-200 text-emerald-800 rounded-xl">
                    <Zap className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                    <AlertTitle className="font-bold">Free Monthly Post Available!</AlertTitle>
                    <AlertDescription>You can publish this requirement for free. Your next free post will be available next month.</AlertDescription>
                  </Alert>
                )}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* ... Existing form fields ... */}
                    <div className="space-y-5">
                      <h3 className="text-lg font-bold text-slate-800 border-b border-border pb-2">Basic Information</h3>
                      <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Post Title <span className="text-red-500">*</span></FormLabel>
                          <FormControl><Input placeholder="E.g. Need experienced Math tutor for Class 10" className="h-12 bg-slate-50" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField control={form.control} name="class" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Class / Grade <span className="text-red-500">*</span></FormLabel>
                            <FormControl><Input placeholder="E.g. 10th CBSE" className="h-12 bg-slate-50" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}/>
                        <FormField control={form.control} name="subjects" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subjects Required <span className="text-red-500">*</span></FormLabel>
                            <FormControl><Input placeholder="Maths, Science" className="h-12 bg-slate-50" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}/>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <h3 className="text-lg font-bold text-slate-800 border-b border-border pb-2">Teaching Preferences</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <FormField control={form.control} name="mode" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teaching Mode <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger className="h-12 bg-slate-50"><SelectValue/></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value={CreatePostRequestMode.home}>Home Tuition</SelectItem>
                                <SelectItem value={CreatePostRequestMode.online}>Online</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}/>
                        <FormField control={form.control} name="medium" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medium <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger className="h-12 bg-slate-50"><SelectValue/></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value={CreatePostRequestMedium.english}>English</SelectItem>
                                <SelectItem value={CreatePostRequestMedium.hindi}>Hindi</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}/>
                        <FormField control={form.control} name="genderPreference" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tutor Gender Pref. <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value || "any"}>
                              <FormControl><SelectTrigger className="h-12 bg-slate-50"><SelectValue/></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="any">No Preference</SelectItem>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}/>
                      </div>
                      
                      <FormField control={form.control} name="address" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location / Area <span className="text-red-500">*</span></FormLabel>
                          <FormControl><Input placeholder="E.g. Vasant Kunj, South Delhi" className="h-12 bg-slate-50" {...field} /></FormControl>
                          <FormDescription>Even for online tuitions, mentioning city helps.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}/>

                      <FormField control={form.control} name="state" render={({ field }) => (
                        <FormItem>
                          <FormLabel>State <span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 bg-slate-50">
                                <SelectValue placeholder="Select a state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-60">
                              {INDIAN_STATES.map(state => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}/>
                    </div>

                    <div className="space-y-5">
                      <h3 className="text-lg font-bold text-slate-800 border-b border-border pb-2">Schedule & Budget</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <FormField control={form.control} name="daysPerWeek" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Days / Week <span className="text-red-500">*</span></FormLabel>
                            <FormControl><Input type="number" className="h-12 bg-slate-50" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}/>
                        <FormField control={form.control} name="duration" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hours / Day <span className="text-red-500">*</span></FormLabel>
                            <FormControl><Input type="number" step="0.5" className="h-12 bg-slate-50" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}/>
                        <FormField control={form.control} name="monthlyFee" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monthly Budget (₹) <span className="text-red-500">*</span></FormLabel>
                            <FormControl><Input type="number" className="h-12 bg-slate-50 font-bold text-emerald-600" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}/>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <h3 className="text-lg font-bold text-slate-800 border-b border-border pb-2">Details</h3>
                      <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Details</FormLabel>
                          <FormControl><Textarea placeholder="Any specific requirements or student details..." className="min-h-32 bg-slate-50" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}/>
                      <FormField control={form.control} name="contactPhone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Contact Number <span className="text-red-500">*</span></FormLabel>
                          <FormControl><Input className="h-12 bg-slate-50" {...field} /></FormControl>
                          <FormDescription>This will be hidden. Tutors must pay to unlock it.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}/>
                    </div>

                    <div className="pt-6">
                      <Button type="submit" size="lg" className="w-full h-14 rounded-xl text-lg font-bold shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all" disabled={isPending}>
                        {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                        Publish Requirement
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          );
        })()}
      </div>
      <Footer />
    </div>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle className="w-5 h-5 text-emerald-500" />
      <span className="text-slate-700 font-medium">{text}</span>
    </div>
  );
}
