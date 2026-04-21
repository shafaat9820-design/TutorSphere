import { Link } from "wouter";
import { BookOpen, Mail, MapPin, Phone, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0c0a18] text-slate-400 relative overflow-hidden">
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-violet-900/20 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-5 group w-fit">
              <img src="/logo.png" alt="TutorSphere" className="h-14 w-auto object-contain transition-transform group-hover:scale-105" />
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Connecting passionate educators with eager learners. The premium marketplace for home and online tuitions.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-violet-600 flex items-center justify-center transition-colors duration-200">
                  <Icon className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
                </button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Platform</h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/posts", label: "Find Tuitions" },
                { href: "/register?role=tutor", label: "Become a Tutor" },
                { href: "/register?role=parent", label: "Post Requirement" },
                { href: "/about", label: "About Us" },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-slate-500 hover:text-violet-400 transition-colors duration-150">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Support</h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/contact", label: "Help Center" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/contact", label: "Report an Issue" },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="text-slate-500 hover:text-violet-400 transition-colors duration-150">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">Contact</h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                <span className="text-slate-500">tutorsphereofficial@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                <span className="text-slate-500">+91 82870 6*****</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                <span className="text-slate-500">Education Hub, New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-7 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} TutorSphere. All rights reserved.</p>
          <p>Built with precision & care.</p>
        </div>
      </div>
    </footer>
  );
}
