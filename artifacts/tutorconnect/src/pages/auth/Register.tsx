import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister, RegisterRequestRole } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Loader2 } from "lucide-react";
import { useEffect } from "react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Valid phone number required"),
  role: z.enum([RegisterRequestRole.tutor, RegisterRequestRole.parent]),
});

export default function Register() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  
  // Extract role from URL search params if present
  const defaultRole = new URLSearchParams(window.location.search).get("role") as RegisterRequestRole || RegisterRequestRole.parent;

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", phone: "", role: defaultRole },
  });

  const { mutate, isPending } = useRegister({
    mutation: {
      onSuccess: (data) => {
        login(data.token);
        toast({ title: "Account created!", description: "Welcome to TutorConnect." });
        if (data.user.role === "tutor") setLocation("/tutor/dashboard");
        else setLocation("/parent/dashboard");
      },
      onError: (error: any) => {
        toast({ 
          title: "Registration failed", 
          description: error.message || "An error occurred", 
          variant: "destructive" 
        });
      }
    }
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    mutate({ data: values });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 bg-grid-pattern relative py-12">
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 text-foreground font-bold text-xl hover:opacity-80">
          <BookOpen className="text-primary w-6 h-6"/> TutorConnect
        </Link>
      </div>

      <Card className="w-full max-w-xl shadow-2xl border-0">
        <CardHeader className="space-y-2 text-center pt-8">
          <CardTitle className="text-3xl font-display font-bold">Create an account</CardTitle>
          <CardDescription className="text-base">
            Join the premium tuition marketplace today
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" className="h-12 rounded-xl bg-slate-50/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 9876543210" className="h-12 rounded-xl bg-slate-50/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" className="h-12 rounded-xl bg-slate-50/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-slate-50/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>I want to...</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl bg-slate-50/50">
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={RegisterRequestRole.parent}>Find a Tutor (Parent)</SelectItem>
                          <SelectItem value={RegisterRequestRole.tutor}>Teach Students (Tutor)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full h-12 rounded-xl text-base shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform mt-2" disabled={isPending}>
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
