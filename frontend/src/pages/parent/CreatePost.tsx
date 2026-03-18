import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreatePost, CreatePostRequestMode, CreatePostRequestMedium, CreatePostRequestGenderPreference } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/layout/Navbar";
import { ChevronLeft, Loader2 } from "lucide-react";

const createPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  class: z.string().min(1, "Required"),
  subjects: z.string().min(2, "Required"),
  genderPreference: z.enum([CreatePostRequestGenderPreference.male, CreatePostRequestGenderPreference.female, CreatePostRequestGenderPreference.any]).nullable().optional(),
  medium: z.enum([CreatePostRequestMedium.english, CreatePostRequestMedium.hindi]),
  mode: z.enum([CreatePostRequestMode.home, CreatePostRequestMode.online]),
  address: z.string().min(5, "Required"),
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
      title: "", class: "", subjects: "", address: "", 
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
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Post a Requirement</h1>
          <p className="text-slate-400">Fill in the details to find the perfect tutor.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl -mt-16 relative z-10 pb-20">
        <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-2xl">
          <CardContent className="p-6 md:p-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Basic Info */}
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-slate-800 border-b border-border pb-2">Basic Information</h3>
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Title</FormLabel>
                      <FormControl><Input placeholder="E.g. Need experienced Math tutor for Class 10" className="h-12 bg-slate-50" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}/>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField control={form.control} name="class" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class / Grade</FormLabel>
                        <FormControl><Input placeholder="E.g. 10th CBSE" className="h-12 bg-slate-50" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                    <FormField control={form.control} name="subjects" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subjects Required</FormLabel>
                        <FormControl><Input placeholder="Maths, Science" className="h-12 bg-slate-50" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                  </div>
                </div>

                {/* Preferences */}
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-slate-800 border-b border-border pb-2">Teaching Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <FormField control={form.control} name="mode" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teaching Mode</FormLabel>
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
                        <FormLabel>Medium</FormLabel>
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
                        <FormLabel>Tutor Gender Pref.</FormLabel>
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
                      <FormLabel>Location / Area (For Home Tuition)</FormLabel>
                      <FormControl><Input placeholder="E.g. Vasant Kunj, South Delhi" className="h-12 bg-slate-50" {...field} /></FormControl>
                      <FormDescription>Even for online tuitions, mentioning city helps.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}/>
                </div>

                {/* Schedule & Fee */}
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-slate-800 border-b border-border pb-2">Schedule & Budget</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <FormField control={form.control} name="daysPerWeek" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Days / Week</FormLabel>
                        <FormControl><Input type="number" className="h-12 bg-slate-50" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                    <FormField control={form.control} name="duration" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hours / Day</FormLabel>
                        <FormControl><Input type="number" step="0.5" className="h-12 bg-slate-50" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                    <FormField control={form.control} name="monthlyFee" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Budget (₹)</FormLabel>
                        <FormControl><Input type="number" className="h-12 bg-slate-50 font-bold text-emerald-600" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}/>
                  </div>
                </div>

                {/* Contact & Details */}
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
                      <FormLabel>Your Contact Number</FormLabel>
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
      </div>
    </div>
  );
}
