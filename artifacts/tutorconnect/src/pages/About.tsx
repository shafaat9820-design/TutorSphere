import { BookOpen, Users, Target, Award, GraduationCap, Heart, Zap, ShieldCheck, Mail } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function About() {
  const stats = [
    { label: "Active Tutors", value: "2,400+" },
    { label: "Happy Families", value: "8,500+" },
    { label: "Cities Covered", value: "50+" },
    { label: "Match Success Rate", value: "94%" },
  ];

  const process = [
    {
      step: "01",
      title: "Post a Requirement",
      desc: "Parents post their tuition needs including subjects, location, and fees for free.",
    },
    {
      step: "02",
      title: "Get Matches",
      desc: "Our platform matches the requirement with qualified, nearby tutors instantly.",
    },
    {
      step: "03",
      title: "Unlock & Connect",
      desc: "Tutors can unlock specific parent contacts for a minimal ₹49 fee or subscribe for unlimited access.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-1/2 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-md">
                <BookOpen className="w-4 h-4 text-purple-300" /> Bridging the Gap
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6 leading-tight">
                Empowering Education through <span className="text-purple-300">Smart Connections</span>
              </h1>
              <p className="text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                TutorSphere is India's most transparent tuition marketplace. We provide a platform where quality educators and seeking families meet without middleman interference. 
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link href="/posts"><Button className="h-14 px-8 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-xl">Get Started</Button></Link>
                <Link href="/pricing"><Button variant="outline" className="h-14 px-8 rounded-2xl border-white/20 text-white hover:bg-white/10 font-bold">View Plans</Button></Link>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/30 to-indigo-500/30 blur-3xl opacity-50" />
                <img 
                  src="/images/about_hero.png" 
                  alt="Education Hub" 
                  className="relative rounded-3xl shadow-2xl border border-white/10"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Process - How it Works */}
      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-black text-slate-900 mb-4">How TutorSphere Works</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">A transparent, direct-to-tutor system that values your time and money.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {process.map((p) => (
              <div key={p.step} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-all">
                <div className="text-6xl font-black text-slate-100 absolute -bottom-4 -right-4 transition-colors group-hover:text-primary/5">{p.step}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed relative z-10">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-5xl font-display font-black text-slate-900 mb-8 leading-tight">
                Simple. Transparent. <br /><span className="text-primary">Reliable.</span>
              </h2>
              <div className="space-y-6">
                <ValueCard icon={Zap} title="Direct Connection" text="No third-party calling. Tutors get direct access to parent details instantly after matching." />
                <ValueCard icon={ShieldCheck} title="Verified Only" titleColor="text-emerald-600" text="Every profile is screened for quality. We prioritize genuine requirements over bulk quantity." />
                <ValueCard icon={Mail} title="No Hidden Charges" titleColor="text-indigo-600" text="Pay ₹49 per unlock or choose from our affordable weekly/monthly plans. No commissions on your tuition fee." />
              </div>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-slate-50 p-8 rounded-3xl text-center border border-slate-100">
                  <p className="text-4xl font-display font-black text-slate-900 mb-1">{s.value}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <GraduationCap className="w-16 h-16 text-purple-400 mx-auto mb-8 animate-bounce" />
          <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-6 leading-tight">
            Ready to Start Teaching or Learning?
          </h2>
          <p className="text-slate-400 mb-10 text-lg leading-relaxed">
            Join the community built for excellence. Whether you are a parent looking for the perfect tutor or a tutor building your reputation, TutorSphere is your platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/posts">
              <Button className="h-14 px-10 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-xl">Find a Tutor</Button>
            </Link>
            <Link href="/register">
              <Button className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-xl">Join as Tutor</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ValueCard({ icon: Icon, title, text, titleColor = "text-slate-900" }: { icon: any, title: string, text: string, titleColor?: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h4 className={`text-lg font-bold ${titleColor} mb-1`}>{title}</h4>
        <p className="text-slate-500 text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
