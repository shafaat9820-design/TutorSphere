import { BookOpen, Users, Target, Award, GraduationCap, Heart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
  const stats = [
    { label: "Active Tutors", value: "2,400+" },
    { label: "Happy Families", value: "8,500+" },
    { label: "Cities Covered", value: "50+" },
    { label: "Sessions Completed", value: "1.2L+" },
  ];

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      desc: "To bridge the gap between quality educators and students who need them — making personalised learning accessible to every family across India.",
    },
    {
      icon: Award,
      title: "Quality First",
      desc: "Every tutor on TutorConnect is verified. We ensure parents only connect with qualified, experienced educators who genuinely care about student growth.",
    },
    {
      icon: Heart,
      title: "Community Driven",
      desc: "We believe education is a community effort. TutorConnect fosters trust between tutors, parents, and students through transparent ratings and honest reviews.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-white to-accent/10 py-24">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <BookOpen className="w-4 h-4" /> Our Story
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Empowering Education,<br />One Connection at a Time
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            TutorConnect was founded in 2023 with a simple belief: every student deserves access to a great teacher. 
            We built a platform that makes it easy for parents to find trusted tutors and for talented educators 
            to build a fulfilling career — right from their city.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-bold text-primary mb-1">{s.value}</p>
                <p className="text-slate-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-900">What We Stand For</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
                  <v.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">{v.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-2xl">
          <GraduationCap className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4 text-slate-900">Built by Educators, for Educators</h2>
          <p className="text-slate-600 leading-relaxed mb-8">
            Our team comprises former teachers, ed-tech veterans, and parents who understand first-hand the challenges 
            of finding the right tutor. Every feature on TutorConnect is designed with the classroom in mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/posts">
              <Button className="px-8 h-12 rounded-xl font-semibold">Find a Tutor</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="px-8 h-12 rounded-xl font-semibold">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
