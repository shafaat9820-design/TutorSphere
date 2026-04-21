import { FileText, CheckCircle, AlertTriangle, Scale, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

const sections = [
  {
    title: "1. Acceptance of Terms",
    icon: CheckCircle,
    content: `By accessing or using TutorSphere ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the Platform. These terms apply to all users including parents, tutors, and administrators.`,
  },
  {
    title: "2. Registration & Accounts",
    icon: ShieldAlert,
    content: `You must be at least 18 years of age to register. You are responsible for your account security. TutorSphere strictly prohibits the creation of multiple accounts or account sharing. We use device-level tracking to detect and block fraudulent registrations or multi-account abuse.`,
  },
  {
    title: "3. Tuition Requirements",
    icon: FileText,
    content: `Parents may post requirements for free. Posts must be genuine and accurate. False, duplicate, or irrelevant posts will be removed without notice. Parents are responsible for communicating their specific needs clearly to matched tutors.`,
  },
  {
    title: "4. Contact Unlock & Payments",
    icon: Scale,
    content: `Tutors can unlock parent contact details by paying a per-match fee (currently ₹49) or through a valid Subscription plan. All payments are non-refundable since our service (provision of contact details) is delivered immediately upon payment. Disputing valid transactions via your bank without contacting us first may result in account termination.`,
  },
  {
    title: "5. Anti-Cheat & Fair Use",
    icon: AlertTriangle,
    content: `TutorSphere employs advanced security and anti-cheat systems. Any attempt to bypass the payment system, exploit free trials through multiple accounts or browser manipulation, or scrape user data will result in immediate and permanent banning of all associated accounts and devices.`,
  },
  {
    title: "6. Platform Role & Liability",
    icon: ShieldAlert,
    content: `TutorSphere is a marketplace connecting tutors and parents. We do not employ tutors and are not party to any tuition agreements. We are not liable for the quality of teaching, student performance, or any disputes between users. Our total liability is limited to the amount paid by you to us in the last 30 days.`,
  },
  {
    title: "7. Termination",
    icon: AlertTriangle,
    content: `We reserve the right to suspend or terminate any user's access at our sole discretion, particularly for platform abuse, harassment, or violation of our fair use policies. No refunds will be issued for terminated accounts.`,
  },
  {
    title: "8. Jurisdiction",
    icon: Scale,
    content: `These terms are governed by the laws of India. Any legal disputes shall be settled exclusively in the competent courts of New Delhi, India.`,
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <section className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent)] opacity-50" />
        <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-md">
              <FileText className="w-4 h-4 text-primary" /> Rules of Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6">Terms of Service</h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Please read these terms carefully. They outline your rights, responsibilities, and our policies on security and fair use.
            </p>
            <p className="text-slate-500 text-sm mt-8 font-mono tracking-widest uppercase">Last Updated: March 28, 2026</p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 -mt-12 relative z-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((s, i) => (
            <motion.div 
              key={s.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col hover:border-primary/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-primary/5 transition-colors">
                <s.icon className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">{s.title}</h2>
              <p className="text-slate-600 leading-relaxed text-sm flex-1">{s.content}</p>
            </motion.div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-12 bg-white rounded-[40px] p-10 text-center border border-slate-100 shadow-xl shadow-slate-200/30">
          <p className="text-slate-500 text-sm mb-6">
            Accepting these terms means you acknowledge that TutorSphere acts ONLY as a connector and takes no responsibility for user-conduct once details are exchanged.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:tutorsphereofficial@gmail.com" className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg">
              Legal Inquiries
            </a>
            <button onClick={() => window.print()} className="bg-slate-100 text-slate-700 px-8 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
              Print Terms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
