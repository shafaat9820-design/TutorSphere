import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Users, GraduationCap, MapPin, Search, CheckCircle2, 
  ArrowRight, ShieldCheck, Zap, BookOpen, Star, Mail, Phone,
  ChevronRight, Award, MessageSquare, TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";

const heroStats = [
  { value: "2,400+", label: "Active Tutors" },
  { value: "8,500+", label: "Happy Students" },
  { value: "4.9/5", label: "Avg Rating" },
];

export default function Home() {
  const { user } = useAuth();
  const isTutor = user?.role === "tutor";
  
  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Hero Section */}
      <section className="relative min-h-[95vh] flex items-center pt-24 pb-32 overflow-hidden bg-slate-950">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/home_hero.png" 
            alt="Learning Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-bold mb-8 backdrop-blur-md">
                <Zap className="w-4 h-4 fill-primary text-primary" /> #1 Tutor Marketplace in India
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-8 leading-[1.1] tracking-tight">
                Find the Perfect <span className="gradient-text italic">Tutor</span> For Your Child
              </h1>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-xl font-medium">
                Connect directly with verified home tutors and online educators. Transparent pricing, zero commissions, and instant matching.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <Link href="/posts">
                  <Button className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-2xl shadow-primary/20 flex items-center gap-3 group transition-all">
                    Find a Tutor <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                {!isTutor && (
                  <Link href="/register?role=tutor">
                    <Button className="h-16 px-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl font-black text-lg transition-all">
                      Register as Tutor
                    </Button>
                  </Link>
                )}
              </div>

              {/* Trust Badges */}
              <div className="mt-12 flex items-center gap-8 opacity-70">
                <div className="flex items-center gap-2 text-white font-bold tracking-tighter uppercase text-[10px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Profiles
                </div>
                <div className="flex items-center gap-2 text-white font-bold tracking-tighter uppercase text-[10px]">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> 4.9/5 Avg Rating
                </div>
                <div className="flex items-center gap-2 text-white font-bold tracking-tighter uppercase text-[10px]">
                  <Users className="w-4 h-4 text-indigo-400" /> 10k+ Registered
                </div>
              </div>
            </motion.div>

            {/* Floating Visuals (Desktop) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 bg-white/5 p-4 rounded-[40px] border border-white/10 backdrop-blur-sm">
                <img 
                  src="/images/home_hero.png" 
                  alt="Students Learning" 
                  className="rounded-[32px] w-full shadow-2xl"
                />
              </div>
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-10 -left-10 glass-premium p-6 rounded-3xl z-20 shadow-xl border border-white/40"
              >
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-100 p-2 rounded-xl"><Star className="w-6 h-6 text-amber-500 fill-amber-500" /></div>
                    <div>
                      <p className="font-black text-slate-900 leading-tight">4.9/5</p>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Top Tutors</p>
                    </div>
                  </div>
              </motion.div>
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute -bottom-10 -right-10 glass-premium p-6 rounded-3xl z-20 shadow-xl border border-white/40"
              >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-xl"><TrendingUp className="w-6 h-6 text-primary" /></div>
                    <div>
                      <p className="font-black text-slate-900 leading-tight">8,500+</p>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Success Matches</p>
                    </div>
                  </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Grid */}
      <div className="py-16 bg-white container mx-auto px-6 relative z-30 -mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureBox 
              icon={Search} 
              title="Smart Matching" 
              desc="Our algorithm finds tutors based on subjects, class, and proximity instantly."
              color="bg-indigo-600"
            />
            <FeatureBox 
              icon={Zap} 
              title="₹49 Direct Unlock" 
              desc="No complex subscriptions needed. Unlock any parent contact detail for just ₹49."
              color="bg-amber-500"
            />
            <FeatureBox 
              icon={ShieldCheck} 
              title="Anti-Fraud Tech" 
              desc="Advanced device fingerprinting ensures only genuine tutors and requirements."
              color="bg-emerald-600"
            />
          </div>
      </div>

      {/* For Parents Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest mb-6 inline-block">For Parents</div>
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 mb-8 leading-tight">
                Hire Top Tutors <br /><span className="text-indigo-600">Without the Middleman</span>
              </h2>
              <ul className="space-y-6 mb-10">
                <BenefitItem text="Post requirements for free and get tutor proposals within minutes." />
                <BenefitItem text="Chat directly with tutors before deciding." />
                <BenefitItem text="Verify qualifications and reviews on teacher profiles." />
                <BenefitItem text="No commission taken from the student's monthly fee." />
              </ul>
              <Link href="/posts">
                <Button className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg flex items-center gap-2">
                  Post Requirement Now <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-slate-50 rounded-[40px] p-2 border border-slate-100 group">
                <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-[38px] shadow-2xl shadow-indigo-100/50 group-hover:shadow-indigo-200/50 transition-all duration-500">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                          <Users className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 leading-tight text-lg">Platform Quality</p>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Trust Dashboard</p>
                        </div>
                      </div>
                      <div className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100 shadow-sm shadow-emerald-100">
                        <ShieldCheck className="w-3.5 h-3.5 fill-emerald-500 text-white" /> Verified
                      </div>
                   </div>

                   <div className="space-y-8">
                      {/* Metric 1 */}
                      <div className="space-y-3">
                         <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                              <GraduationCap className="w-4 h-4 text-indigo-500" /> Tutor Quality Index
                            </span>
                            <span className="text-2xl font-black text-indigo-600">96%</span>
                         </div>
                         <div className="h-4 bg-slate-100 rounded-2xl overflow-hidden p-1 shadow-inner">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: "96%" }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              viewport={{ once: true }}
                              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl relative shadow-lg shadow-indigo-200"
                            >
                               <div className="absolute top-0 right-1 bottom-0 w-1 bg-white/30 rounded-full" />
                            </motion.div>
                         </div>
                      </div>

                      {/* Metric 2 */}
                      <div className="space-y-3">
                         <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-emerald-500" /> Match Success Rate
                            </span>
                            <span className="text-2xl font-black text-emerald-600">92%</span>
                         </div>
                         <div className="h-4 bg-slate-100 rounded-2xl overflow-hidden p-1 shadow-inner">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: "92%" }}
                              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                              viewport={{ once: true }}
                              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl relative shadow-lg shadow-emerald-200"
                            >
                               <div className="absolute top-0 right-1 bottom-0 w-1 bg-white/30 rounded-full" />
                            </motion.div>
                         </div>
                      </div>
                   </div>

                   <div className="mt-10 p-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                        Data reflects active parent-tutor <br /> interactions as of Q1 2024
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Tutors Section */}
      <section className="py-24 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[150px] -z-0" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-20">
            <div className="lg:w-1/2">
              <div className="bg-primary/20 text-primary-foreground px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest mb-6 inline-block">For Tutors</div>
              <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-8 leading-tight">
                Grow Your Reputation <br /><span className="text-primary">Independently</span>
              </h2>
              <ul className="space-y-6 mb-10">
                <BenefitItem variant="dark" text="Unlock student contacts for just ₹49 - no contracts." />
                <BenefitItem variant="dark" text="Weekly and Monthly unlimited plans available." />
                <BenefitItem variant="dark" text="Showcase your experience with a professional digital profile." />
                <BenefitItem variant="dark" text="Direct payment from parents - we take 0% commission." />
              </ul>
              <Link href="/register">
                <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg flex items-center gap-2">
                  Apply for Tuition <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="lg:w-1/2">
               <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-10 rounded-[40px] shadow-2xl group flex flex-col hover:scale-[1.02] transition-transform">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center border border-primary/20"><GraduationCap className="w-8 h-8 text-primary" /></div>
                    <div>
                      <h4 className="text-white font-bold text-xl uppercase tracking-tighter">Verified Tutor</h4>
                      <p className="text-slate-400 text-sm">Profile ID: TS-592</p>
                    </div>
                  </div>
                  <div className="space-y-4 mb-8">
                     <div className="h-1 bg-slate-700 w-full rounded" />
                     <div className="h-1 bg-slate-700 w-2/3 rounded" />
                  </div>
                  <div className="flex justify-between items-center text-white">
                      <div className="text-center">
                        <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-1">Total Leads</p>
                        <p className="text-2xl font-black">204</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-1">Active Fees</p>
                        <p className="text-2xl font-black">₹25k+</p>
                      </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center max-w-4xl">
           <Award className="w-16 h-16 text-primary mx-auto mb-8" />
           <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 mb-8">Building Trust in Education</h2>
           <p className="text-slate-500 text-lg leading-relaxed mb-12">
             TutorSphere is built on the foundation of transparency. We believe parents and teachers are the best decision-makers for a student's future. Our role is strictly to provide the best platform for that connection to happen safely and securely.
           </p>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatItem icon={ShieldCheck} label="Verified" value="10,000+" />
              <StatItem icon={MessageSquare} label="Reviews" value="4,500+" />
              <StatItem icon={Users} label="Daily Matches" value="800+" />
           </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 bg-primary text-white text-center rounded-t-[60px] md:rounded-t-[100px]">
         <div className="container mx-auto px-6 max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-display font-black mb-8 leading-tight">Start Your Journey Today</h2>
            <p className="text-primary-foreground/80 text-lg mb-12 font-medium">Join thousands of parents and tutors who have found their perfect match.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/posts"><Button className="h-16 px-10 rounded-2xl bg-white text-primary hover:bg-slate-100 font-bold text-lg shadow-xl">Hire a Tutor</Button></Link>
              <Link href="/register"><Button className="h-16 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg shadow-xl">Join the Community</Button></Link>
            </div>
         </div>
      </section>
    </div>
  );
}

function FeatureBox({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  return (
    <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-100/50 hover:border-primary/20 transition-all group flex flex-col items-center text-center">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tighter">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm font-medium">{desc}</p>
    </div>
  );
}

function BenefitItem({ text, variant = "light" }: { text: string, variant?: "light" | "dark" }) {
  return (
    <li className="flex items-start gap-4">
      <div className={`w-6 h-6 rounded-full ${variant === "light" ? "bg-indigo-100 text-indigo-500" : "bg-primary/20 text-primary"} flex items-center justify-center shrink-0 mt-0.5`}>
        <CheckCircle2 className="w-4 h-4" />
      </div>
      <span className={`${variant === "light" ? "text-slate-600" : "text-slate-300"} font-medium`}>{text}</span>
    </li>
  );
}

function StatItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="p-10 rounded-[32px] bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm"><Icon className="w-6 h-6 text-primary" /></div>
      <p className="text-3xl font-display font-black text-slate-900 mb-1">{value}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
  );
}
