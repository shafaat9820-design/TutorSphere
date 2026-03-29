import { Shield, Eye, Lock, Fingerprint, Globe } from "lucide-react";
import { motion } from "framer-motion";

const sections = [
  {
    title: "1. Information We Collect",
    icon: Eye,
    content: `When you register on TutorSphere, we collect your name, email address, phone number, and role (parent or tutor). Tutors may also provide their qualifications, subjects taught, and profile photo. When you post a tuition requirement, we collect details like subject, class, location, and budget. Payment transactions are processed securely via Razorpay; we do not store your card details.`,
  },
  {
    title: "2. How We Use Your Information",
    icon: Shield,
    content: `We use your information to operate the TutorSphere platform — to display tuition listings, facilitate connections between tutors and parents, process payments, and send relevant notifications. We may also use aggregate, anonymised data to improve our services and for internal analytics. We will never sell your personal data to third parties.`,
  },
  {
    title: "3. Contact Information Visibility",
    icon: Lock,
    content: `Your phone number and detailed address are kept private by default. They are only revealed to a tutor after they have paid the contact-unlock fee (₹49) or used their subscription for your specific post. This gives you full control over who can contact you directly.`,
  },
  {
    title: "4. Anti-Cheat & Platform Integrity",
    icon: Fingerprint,
    content: `To prevent fraud, multi-account abuse, and trial exploitation, TutorSphere uses device fingerprinting (via FingerprintJS). We generate a unique ID for your browser/device during authentication. This ID is used solely to identify suspicious activity and enforce platform limits. We also track your last login IP address for security purposes.`,
  },
  {
    title: "5. Data Security",
    icon: Shield,
    content: `We implement industry-standard security measures including HTTPS encryption, bcrypt password hashing, and JWT-based authentication. Access to sensitive data is restricted to authorised users only. While we take every precaution, no system is 100% immune — we recommend using a strong, unique password for your account.`,
  },
  {
    title: "6. Cookies & Storage",
    icon: Globe,
    content: `TutorSphere uses minimal cookies and local browser storage to keep you logged in across sessions. We do not use tracking cookies for advertising. You may clear your browser storage at any time, though this will log you out and may reset your fingerprinting context.`,
  },
  {
    title: "7. Third-Party Services",
    icon: Globe,
    content: `We integrate with Razorpay for payment processing. Razorpay has its own privacy policy governing the data they collect during payment. We are not responsible for third-party data practices. Please review Razorpay's privacy policy before completing a transaction.`,
  },
  {
    title: "8. Your Rights",
    icon: Shield,
    content: `You have the right to access, correct, or delete the personal data we hold about you. To exercise these rights, email us at tutorsphereofficial@gmail.com with the subject line "Data Request". We will respond within 7 business days.`,
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
        <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-md">
              <Shield className="w-4 h-4 text-emerald-400" /> Trust & Safety
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6">Privacy Policy</h1>
            <p className="text-slate-400 text-lg">
              Transparency is our core value. Learn how we handle your data with respect and absolute security.
            </p>
            <p className="text-slate-500 text-sm mt-8 font-mono tracking-widest uppercase">Last Updated: March 28, 2026</p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 -mt-12 relative z-20">
        <div className="max-w-4xl mx-auto space-y-6">
          {sections.map((s, i) => (
            <motion.div 
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 group hover:border-primary/20 transition-all"
            >
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">{s.title}</h2>
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base whitespace-pre-wrap">{s.content}</p>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 text-center mt-12">
            <p className="text-slate-700 font-medium mb-4">
              Have questions about your data or our security practices?
            </p>
            <a 
              href="mailto:tutorsphereofficial@gmail.com" 
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
            >
              Contact Privacy Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
