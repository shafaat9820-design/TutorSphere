import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister, RegisterRequestRole } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, User, Mail, Phone, Lock, ChevronRight, UserPlus, Eye, EyeOff, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { getDeviceId } from "@/lib/fingerprint";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Valid phone number required"),
  role: z.enum([RegisterRequestRole.tutor, RegisterRequestRole.parent]),
  otpCode: z.string().optional(),
});

export default function Register() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'info' | 'otp'>('info');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    getDeviceId().then(setDeviceId);
  }, []);

  const defaultRole = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("role") as RegisterRequestRole || RegisterRequestRole.parent;

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", phone: "", role: defaultRole, otpCode: "" },
  });

  const { mutate, isPending } = useRegister({
    request: { headers: { "x-device-id": deviceId } },
    mutation: {
      onSuccess: (data) => {
        login(data.token, data.user);
        toast({ title: "Account created!", description: "Welcome to TutorSphere." });
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

  const handleSendOtp = async () => {
    const isValid = await form.trigger(["name", "email", "password", "phone", "role"]);
    if (!isValid) return;

    setIsSendingOtp(true);
    try {
      const response = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-device-id": deviceId
        },
        body: JSON.stringify({ email: form.getValues("email"), type: "register" }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send OTP");

      toast({ title: "OTP Sent!", description: "Check your email for the verification code." });
      setStep('otp');
    } catch (error: any) {
      console.error("Email OTP Error:", error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to send OTP email. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    if (step === 'info') {
      handleSendOtp();
      return;
    }
    
    if (!otpValue || otpValue.length !== 6) {
      toast({ title: "OTP required", description: "Please enter the 6-digit code sent to your email.", variant: "destructive" });
      return;
    }

    // Call backend with the manual OTP code
    mutate({ data: { ...values, otpCode: otpValue } });
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Left Side: Brand Section */}
      <div className="hidden lg:flex lg:w-5/12 relative flex-col items-center justify-center p-12 bg-gradient-to-br from-violet-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
        {/* Animated Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[140px]" />
        
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
              className="w-full max-w-[320px] h-auto object-contain drop-shadow-[0_20px_50px_rgba(255,255,255,0.2)]"
            />
          </div>
          
          <div className="space-y-4 max-w-sm">
            <h1 className="text-4xl font-display font-black tracking-tight leading-tight">
              Start Your <span className="text-purple-200">Success Story</span>
            </h1>
            <p className="text-lg text-blue-50/80 leading-relaxed font-medium">
              Create an account and unlock a world of educational possibilities.
            </p>
          </div>
        </motion.div>

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

      {/* Right Side: Register Form */}
      <div className="w-full lg:w-7/12 flex flex-col items-center justify-center p-6 sm:p-12 bg-slate-50 relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-100 rounded-full blur-[100px] opacity-40 -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-100 rounded-full blur-[100px] opacity-40 -ml-40 -mb-40" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-2xl relative z-10 py-12"
        >
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

          <div className="space-y-10">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-display font-black text-slate-900 mb-3">Create an account</h2>
              <p className="text-slate-500 text-lg">Join the premium tuition marketplace today</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <AnimatePresence mode="wait">
                  {step === 'info' ? (
                    <motion.div
                      key="info"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 font-semibold ml-1">Full Name</FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                                  <Input 
                                    placeholder="Enter your full name" 
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
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 font-semibold ml-1">Phone Number</FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                                  <Input 
                                    placeholder="9876543210" 
                                    className="h-14 pl-12 rounded-2xl bg-white border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 shadow-sm transition-all text-base" 
                                    {...field} 
                                  />
                                </div>
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
                            <FormLabel className="text-slate-700 font-semibold ml-1">Email Address</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                                <Input 
                                  placeholder="Enter your email address" 
                                  className="h-14 pl-12 rounded-2xl bg-white border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 shadow-sm transition-all text-base" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 font-semibold ml-1">I want to...</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <div className="relative group">
                                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-600 transition-colors z-10" />
                                    <SelectTrigger className="h-14 pl-12 rounded-2xl bg-white border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 shadow-sm transition-all text-base">
                                      <SelectValue placeholder="Select an option" />
                                    </SelectTrigger>
                                  </div>
                                </FormControl>
                                <SelectContent className="rounded-xl border-slate-200">
                                  <SelectItem value={RegisterRequestRole.parent} className="py-3 font-medium">Find a Tutor (Parent)</SelectItem>
                                  <SelectItem value={RegisterRequestRole.tutor} className="py-3 font-medium">Teach Students (Tutor)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-14 rounded-2xl text-lg font-bold bg-violet-600 hover:bg-violet-700 shadow-xl shadow-violet-500/20 transition-all hover:-translate-y-0.5" 
                        disabled={isSendingOtp}
                      >
                        {isSendingOtp ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <span className="flex items-center gap-2">
                            Send Email OTP <ChevronRight className="w-5 h-5" />
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="otp"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8 flex flex-col items-center"
                    >
                      <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <MessageSquare className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">Verify your email</h3>
                        <p className="text-slate-500">We've sent a 6-digit code to <span className="text-slate-900 font-semibold">{form.getValues('email')}</span></p>
                      </div>

                      <div className="flex justify-center py-4">
                        <InputOTP
                          maxLength={6}
                          value={otpValue}
                          onChange={(value) => setOtpValue(value)}
                        >
                          <InputOTPGroup className="gap-2">
                            <InputOTPSlot index={0} className="h-14 w-12 rounded-xl text-xl border-slate-200" />
                            <InputOTPSlot index={1} className="h-14 w-12 rounded-xl text-xl border-slate-200" />
                            <InputOTPSlot index={2} className="h-14 w-12 rounded-xl text-xl border-slate-200" />
                            <InputOTPSlot index={3} className="h-14 w-12 rounded-xl text-xl border-slate-200" />
                            <InputOTPSlot index={4} className="h-14 w-12 rounded-xl text-xl border-slate-200" />
                            <InputOTPSlot index={5} className="h-14 w-12 rounded-xl text-xl border-slate-200" />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>

                      <div className="w-full space-y-4">
                        <Button 
                          type="submit" 
                          className="w-full h-14 rounded-2xl text-lg font-bold bg-violet-600 hover:bg-violet-700 shadow-xl shadow-violet-500/20 transition-all hover:-translate-y-0.5" 
                          disabled={isPending}
                        >
                          {isPending ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                          ) : (
                            "Verify & Create Account"
                          )}
                        </Button>
                        <Button 
                          type="button" 
                          variant="ghost"
                          className="w-full h-12 rounded-xl text-slate-500 font-semibold"
                          onClick={() => setStep('info')}
                        >
                          Change Email
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </Form>

            <div className="text-center pt-2">
              <p className="text-slate-500 font-medium">
                Already have an account?{" "}
                <Link href="/login" className="text-violet-600 font-bold hover:underline underline-offset-4 transition-colors font-display">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        <div className="text-center lg:text-left text-xs text-slate-400 max-w-md mx-auto lg:mx-0 mt-8 mb-4">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="hover:text-slate-600 underline transition-colors font-medium">Terms of Service</Link> and{" "}
          <Link href="/privacy" className="hover:text-slate-600 underline transition-colors font-medium">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
}
