import { Link } from "wouter";
import { BookOpen, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-white p-1.5 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                TutorConnect
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Connecting passionate educators with eager learners. The premium marketplace for home and online tuitions.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/posts" className="hover:text-primary transition-colors">Find Tuitions</Link></li>
              <li><Link href="/register?role=tutor" className="hover:text-primary transition-colors">Become a Tutor</Link></li>
              <li><Link href="/register?role=parent" className="hover:text-primary transition-colors">Post a Requirement</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/contact" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Report an Issue</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> support@tutorconnect.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Education Hub, New Delhi, India</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} TutorConnect. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Built with precision.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
