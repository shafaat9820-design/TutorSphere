import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, MapPin, Search, Star, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 px-3 py-1 mb-6 text-sm">
                #1 Tuition Marketplace
              </Badge>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.1] mb-6">
                Find the Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Tutor</span> for Your Success
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Connect with verified, high-quality tutors in your area or online. Whether you need help with Math, Science, or Test Prep, we've got you covered.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/posts">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base rounded-2xl shadow-xl shadow-primary/25 hover:-translate-y-1 transition-all duration-300">
                    <Search className="mr-2 w-5 h-5" /> Browse Tuitions
                  </Button>
                </Link>
                <Link href="/register?role=tutor">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base rounded-2xl bg-white/50 backdrop-blur-sm border-2 border-border hover:border-primary/50 hover:bg-white transition-all duration-300">
                    <GraduationCap className="mr-2 w-5 h-5" /> Become a Tutor
                  </Button>
                </Link>
              </div>
              
              <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground font-medium">
                <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-500"/> Verified Profiles</div>
                <div className="flex items-center gap-2"><Star className="w-5 h-5 text-accent"/> Quality Assured</div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative lg:h-[600px] flex items-center justify-center hidden md:flex"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[3rem] blur-3xl" />
              <img 
                src={`${import.meta.env.BASE_URL}images/tutor-illustration.png`}
                alt="Tutor helping student"
                className="relative z-10 w-full max-w-[500px] object-contain drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500"
              />
              
              {/* Floating Cards */}
              <Card className="absolute top-10 -left-10 p-4 shadow-xl glass-panel animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full"><Star className="w-5 h-5 text-emerald-600 fill-emerald-600"/></div>
                  <div>
                    <p className="font-bold text-sm">4.9/5 Average</p>
                    <p className="text-xs text-muted-foreground">Tutor Ratings</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-white relative">
        <img 
          src={`${import.meta.env.BASE_URL}images/pattern-dots.png`} 
          className="absolute inset-0 w-full h-full object-cover opacity-[0.03] pointer-events-none" 
          alt="" 
        />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How TutorConnect Works</h2>
            <p className="text-muted-foreground text-lg">A simple, transparent process to find the perfect educational match.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: BookOpen, title: "1. Post a Requirement", desc: "Parents post their specific tuition needs, detailing subjects, class, and budget." },
              { icon: Search, title: "2. Browse & Apply", desc: "Qualified tutors browse available posts and apply to those matching their expertise." },
              { icon: Zap, title: "3. Connect & Start", desc: "Tutors unlock contact details, connect with parents, and start the learning journey." }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-slate-50 border border-border/50 rounded-3xl p-8 text-center hover:shadow-xl hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto bg-white shadow-md rounded-2xl flex items-center justify-center mb-6 text-primary">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to accelerate learning?</h2>
          <p className="text-primary-foreground/80 text-xl max-w-2xl mx-auto mb-10">
            Join thousands of students and tutors already using TutorConnect to achieve their educational goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=parent">
              <Button size="lg" className="h-14 px-8 text-base font-bold bg-white text-primary hover:bg-white/90 rounded-xl w-full sm:w-auto shadow-xl">
                Post a Tuition
              </Button>
            </Link>
            <Link href="/register?role=tutor">
              <Button size="lg" className="h-14 px-8 text-base font-bold bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl w-full sm:w-auto shadow-xl">
                Start Tutoring
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
