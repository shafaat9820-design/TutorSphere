import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useCreatePaymentOrder, useVerifyPayment } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { IndianRupee, Check, Zap, Star, ShieldCheck, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Pricing() {
  const { user, getAuthHeaders } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const { mutate: createOrder, isPending: isCreatingOrder } = useCreatePaymentOrder({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: (data: any) => {
        setLoadingPlan(null);
        handlePayment(data);
      },
      onError: () => {
        setLoadingPlan(null);
        toast({ title: "Failed to create order", variant: "destructive" });
      }
    }
  });

  const { mutate: verify } = useVerifyPayment({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: (data: any) => {
        toast({ 
          title: "Plan active!", 
          description: data.message || "You now have upgraded access." 
        });
        setLocation(user?.role === "parent" ? "/parent/dashboard" : "/tutor/dashboard");
      }
    }
  });

  const handlePayment = (orderData: any) => {
    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "TutorSphere",
      description: "Subscription Plan",
      order_id: orderData.orderId,
      handler: function (response: any) {
        verify({
          data: {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            type: orderData.paymentType 
          } as any
        });
      },
      prefill: {
        name: user?.name,
        email: user?.email,
      },
      theme: {
        color: "#7c3aed",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const handleSubscribe = (type: string) => {
    if (!user) {
      toast({ title: "Please login first", variant: "destructive" });
      setLocation("/login");
      return;
    }
    
    if (type === "parent_plan" && user.role !== "parent") {
      toast({ title: "Only parents can buy this plan", variant: "destructive" });
      return;
    }
    
    if (type !== "parent_plan" && user.role !== "tutor") {
      toast({ title: "Only tutors can buy this plan", variant: "destructive" });
      return;
    }

    if (type === "post_unlock") {
      setLocation("/posts");
      return;
    }

    setLoadingPlan(type);
    createOrder({ data: { postId: 0, type } as any });
  };

  const tutorPlans = [
    {
      id: "post_unlock",
      name: "Pay Per Post",
      price: "49",
      description: "Perfect for a single requirement",
      role: "tutor",
      features: [
        "One-time contact unlock",
        "Lifetime access to that post",
        "Full support",
        "No recurring fees"
      ],
      cta: "Find a Post",
      popular: false
    },
    {
      id: "weekly_plan",
      name: "Weekly Unlimited",
      price: "399",
      description: "Intensive search for 7 days",
      role: "tutor",
      features: [
        "Unlimited contact unlocks",
        "7 days total access",
        "Full support",
        "Priority dashboard"
      ],
      cta: "Get Weekly Access",
      popular: false
    },
    {
      id: "monthly_plan",
      name: "Monthly Unlimited",
      price: "999",
      description: "Complete platform access",
      role: "tutor",
      features: [
        "Unlimited contact unlocks",
        "30 days total access",
        "Full support",
        "Most cost-effective",
        "Only ₹33/day"
      ],
      cta: "Choose Monthly Plan",
      popular: true,
      badge: "🔥 Best Value"
    }
  ];

  const parentPlans = [
    {
      id: "parent_plan",
      name: "Premium Parent",
      price: "99",
      description: "For active hiring parents",
      role: "parent",
      features: [
        "Up to 5 active requirements",
        "30 days total access",
        "Priority match notification",
        "Reach 1000+ verified tutors",
        "Only ₹3.3/day"
      ],
      cta: "Get Premium Access",
      popular: true,
      badge: "⭐ Recommended"
    }
  ];

  const tutorPlansWithRole = tutorPlans.map(p => ({ ...p, role: "tutor" }));
  const parentPlansWithRole = parentPlans.map(p => ({ ...p, role: "parent" }));

  const currentPlans = !user 
    ? [...tutorPlansWithRole, ...parentPlansWithRole] 
    : (user.role === "tutor" ? tutorPlansWithRole : parentPlansWithRole);

  return (
    <div className="py-12 md:py-24 bg-slate-50 min-h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">
            {!user ? (
              <>Transparent Pricing for <span className="text-violet-600">Every Need</span></>
            ) : user.role === "parent" ? (
              <>Find the Perfect <span className="text-violet-600">Home Tutor</span></>
            ) : (
              <>Elevate Your <span className="text-violet-600">Teaching Career</span></>
            )}
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            {!user ? (
              "Whether you are a tutor looking to grow or a parent finding the best education, we have a plan for you."
            ) : user.role === "parent" ? (
              "Post your requirements and match with the best qualified tutors in your area."
            ) : (
              "Unlock student contact details instantly. Choose the plan that fits your growth."
            )}
          </p>
        </div>

        <div className={`grid grid-cols-1 gap-8 max-w-7xl mx-auto ${currentPlans.length > 3 ? "md:grid-cols-2 lg:grid-cols-4" : currentPlans.length > 1 ? "md:grid-cols-3" : "md:grid-cols-1 max-w-md"}`}>
          {currentPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative border-2 transition-all duration-300 rounded-3xl overflow-hidden ${
                plan.popular ? "border-violet-600 shadow-2xl shadow-violet-200 scale-105 z-10" : "border-slate-200 hover:border-slate-300 shadow-xl"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 left-0 bg-violet-600 text-white text-center py-2 font-bold text-xs uppercase tracking-widest">
                  {plan.badge}
                </div>
              )}

              <CardHeader className={`${plan.popular ? "pt-12" : "pt-8"} pb-8 px-8 relative`}>
                {!user && (
                  <Badge className={`absolute top-4 left-6 ${plan.role === "tutor" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-violet-100 text-violet-700 hover:bg-violet-100"}`}>
                    {plan.role === "tutor" ? "For Tutors" : "For Parents"}
                  </Badge>
                )}
                <CardTitle className={`text-2xl font-bold text-slate-900 ${!user ? "mt-4" : ""}`}>{plan.name}</CardTitle>
                <CardDescription className="text-slate-500 font-medium">{plan.description}</CardDescription>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-display font-bold text-slate-900">₹{plan.price}</span>
                  {plan.id !== "post_unlock" && <span className="text-slate-400 font-medium">/{plan.id === "weekly_plan" ? "week" : "month"}</span>}
                </div>
              </CardHeader>
              
              <CardContent className="px-8 pb-8 space-y-4">
                <div className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1 p-0.5 bg-emerald-100 rounded-full">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="px-8 pb-8 pt-0">
                <Button 
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full h-12 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                    plan.popular 
                      ? "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200" 
                      : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                  }`}
                  disabled={isCreatingOrder}
                >
                  {isCreatingOrder && loadingPlan === plan.id ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 bg-violet-50 rounded-2xl shrink-0">
            <ShieldCheck className="w-8 h-8 text-violet-600" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">Safe & Secure Transactions</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              We use Razorpay for processing all payments. Your bank details are never stored on our servers. All transactions are 100% encrypted and safe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
