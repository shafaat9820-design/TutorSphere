import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Mail, Lock, ArrowRight, ArrowLeft, KeyRound, Eye, EyeOff, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ForgotPassword() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const handleSendOtp = async (values: z.infer<typeof emailSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, type: "reset" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send OTP");

      setEmail(values.email);
      toast({ title: "OTP Sent", description: "Check your email for the reset code." });
      setStep('otp');
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpValue, type: "reset" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid OTP");

      toast({ title: "Email Verified", description: "You can now set a new password." });
      setStep('reset');
    } catch (error: any) {
      toast({ title: "Invalid OTP", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (values: z.infer<typeof resetSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpValue, newPassword: values.password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast({ title: "Success", description: "Password reset successfully. You can now log in." });
      setLocation("/login");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Brand Side */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 bg-gradient-to-br from-violet-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center"
        >
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl mb-8 inline-block">
            <KeyRound className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-display font-black mb-4">Account Recovery</h1>
          <p className="text-lg text-blue-50/80 max-w-sm mx-auto">Don't worry, it happens to the best of us. Let's get you back in.</p>
        </motion.div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <Link href="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-600 font-semibold mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Login
          </Link>

          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <AnimatePresence mode="wait">
              {step === 'email' && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-3xl font-display font-black text-slate-900 mb-2">Forgot Password?</h2>
                    <p className="text-slate-500">Enter your registered email address and we'll send you an OTP code to reset your password.</p>
                  </div>

                  <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(handleSendOtp)} className="space-y-6">
                      <FormField
                        control={emailForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-slate-700">Email Address</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                                <Input 
                                  placeholder="name@example.com" 
                                  className="h-14 pl-12 rounded-2xl bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full h-14 rounded-2xl bg-violet-600 hover:bg-violet-700 font-bold text-lg" disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Send Reset Code"}
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              )}

              {step === 'otp' && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 flex flex-col items-center"
                >
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Verify Email</h3>
                    <p className="text-slate-500">Reset code sent to <span className="text-slate-900 font-semibold">{email}</span></p>
                  </div>

                  <InputOTP
                    maxLength={6}
                    value={otpValue}
                    onChange={(val) => setOtpValue(val)}
                  >
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot index={0} className="h-14 w-12 rounded-xl text-xl border-slate-200 bg-white" />
                      <InputOTPSlot index={1} className="h-14 w-12 rounded-xl text-xl border-slate-200 bg-white" />
                      <InputOTPSlot index={2} className="h-14 w-12 rounded-xl text-xl border-slate-200 bg-white" />
                      <InputOTPSlot index={3} className="h-14 w-12 rounded-xl text-xl border-slate-200 bg-white" />
                      <InputOTPSlot index={4} className="h-14 w-12 rounded-xl text-xl border-slate-200 bg-white" />
                      <InputOTPSlot index={5} className="h-14 w-12 rounded-xl text-xl border-slate-200 bg-white" />
                    </InputOTPGroup>
                  </InputOTP>

                  <Button 
                    className="w-full h-14 rounded-2xl bg-violet-600 hover:bg-violet-700 font-bold text-lg"
                    onClick={handleVerifyOtp}
                    disabled={otpValue.length !== 6 || isLoading}
                  >
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Verify Code"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost"
                    className="w-full h-12 rounded-xl text-slate-500 font-semibold"
                    onClick={() => setStep('email')}
                  >
                    Change Email
                  </Button>
                </motion.div>
              )}

              {step === 'reset' && (
                <motion.div
                  key="reset"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-3xl font-display font-black text-slate-900 mb-2">New Password</h2>
                    <p className="text-slate-500">Security first! Choose a strong password for your account.</p>
                  </div>

                  <Form {...resetForm}>
                    <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-6">
                      <FormField
                        control={resetForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-slate-700">New Password</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                                <Input 
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Min. 6 characters" 
                                  className="h-14 pl-12 pr-12 rounded-2xl bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                                  {...field} 
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600">
                                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={resetForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold text-slate-700">Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                                <Input 
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Repeat new password" 
                                  className="h-14 pl-12 pr-12 rounded-2xl bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full h-14 rounded-2xl bg-violet-600 hover:bg-violet-700 font-bold text-lg" disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Reset Password"}
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
