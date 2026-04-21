import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { BookOpen, Loader2, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getDeviceId } from "@/lib/fingerprint";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [deviceId, setDeviceId] = useState("");
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const returnTo = searchParams.get("returnTo");

  useEffect(() => {
    getDeviceId().then(setDeviceId);
  }, []);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { mutate, isPending } = useLogin({
    request: { headers: { "x-device-id": deviceId } },
    mutation: {
      onSuccess: (data) => {
        login(data.token, data.user);
        toast({ title: "Welcome back!", description: "Successfully logged in." });
        
        if (returnTo) {
          setLocation(returnTo);
        } else if (data.user.role === "admin") {
          setLocation("/admin/dashboard");
        } else if (data.user.role === "tutor") {
          setLocation("/tutor/dashboard");
        } else {
          setLocation("/parent/dashboard");
        }
      },
      onError: (error: any) => {
        toast({ 
          title: "Login failed", 
          description: error.message || "Invalid credentials", 
          variant: "destructive" 
        });
      }
    }
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutate({ data: values });
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Left Side: Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 bg-gradient-to-br from-violet-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
        {/* Animated Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[140px]" />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center text-center space-y-8"
        >
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-2xl">
            <img 
              src="/images/auth-hero.png" 
              alt="TutorSphere Branding" 
              className="w-full max-w-[420px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(255,255,255,0.2)]"
            />
          </div>
          
          <div className="space-y-4 max-w-md">
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight leading-tight">
              Empower Your <span className="text-purple-200">Learning Journey</span>
            </h1>
            <p className="text-lg text-blue-50/80 leading-relaxed font-medium">
              Join the elite community of students and world-class tutors on TutorSphere.
            </p>
          </div>
        </motion.div>

        {/* Floating Brand Badge */}
        <div className="absolute top-12 left-12 z-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-white p-2 rounded-2xl shadow-xl transition-transform group-hover:scale-110">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tighter text-white">
              TutorSphere
            </span>
          </Link>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-100 rounded-full blur-[100px] opacity-40 -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full blur-[100px] opacity-40 -ml-32 -mb-32" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="bg-violet-600 p-2 rounded-xl shadow-lg">
                <img src="/logo.png" alt="Logo" className="w-6 h-6 brightness-0 invert" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-slate-900">
                TutorSphere
              </span>
            </Link>
          </div>

          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-display font-black text-slate-900 mb-3">Welcome back</h2>
              <p className="text-slate-500 text-lg">Enter your details to access your account</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold ml-1">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                            <Input 
                              placeholder="Enter your email" 
                              className="h-14 pl-12 rounded-2xl bg-white border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 shadow-sm transition-all text-base" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold ml-1">Password</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Enter your password" 
                              className="h-14 pl-12 pr-12 rounded-2xl bg-white border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 shadow-sm transition-all text-base" 
                              {...field} 
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors focus:outline-none"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <div className="flex justify-end mt-1">
                          <Link href="/forgot-password" className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors">
                            Forgot password?
                          </Link>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl text-lg font-bold bg-violet-600 hover:bg-violet-700 shadow-xl shadow-violet-500/20 transition-all hover:-translate-y-0.5 active:scale-[0.98]" 
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>
            </Form>

            <div className="text-center lg:text-left pt-4">
              <p className="text-slate-500 font-medium">
                New to TutorSphere?{" "}
                <Link href="/register" className="text-violet-600 font-bold hover:underline underline-offset-4">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
