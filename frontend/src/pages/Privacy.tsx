import { Shield } from "lucide-react";

const sections = [
  {
    title: "1. Information We Collect",
    content: `When you register on TutorConnect, we collect your name, email address, phone number, and role (parent or tutor). Tutors may also provide their qualifications, subjects taught, and profile photo. When you post a tuition requirement, we collect details like subject, class, location, and budget. Payment transactions are processed securely via Razorpay; we do not store your card details.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use your information to operate the TutorConnect platform — to display tuition listings, facilitate connections between tutors and parents, process payments, and send relevant notifications. We may also use aggregate, anonymised data to improve our services and for internal analytics. We will never sell your personal data to third parties.`,
  },
  {
    title: "3. Contact Information Visibility",
    content: `Your phone number and detailed address are kept private by default. They are only revealed to a tutor after they have paid the contact-unlock fee for your specific post. This gives you full control over who can contact you directly.`,
  },
  {
    title: "4. Data Security",
    content: `We implement industry-standard security measures including HTTPS encryption, bcrypt password hashing, and JWT-based authentication. Access to sensitive data is restricted to authorised users only. While we take every precaution, no system is 100% immune — we recommend using a strong, unique password for your account.`,
  },
  {
    title: "5. Cookies",
    content: `TutorConnect uses minimal cookies and local browser storage to keep you logged in across sessions. We do not use tracking cookies or share cookie data with advertisers. You may clear your browser storage at any time, though this will log you out.`,
  },
  {
    title: "6. Third-Party Services",
    content: `We integrate with Razorpay for payment processing. Razorpay has its own privacy policy governing the data they collect during payment. We are not responsible for third-party data practices. Please review Razorpay's privacy policy before completing a transaction.`,
  },
  {
    title: "7. Data Retention",
    content: `We retain your account data for as long as your account is active. If you delete your account, we will remove your personal information within 30 days, except where retention is required by law (e.g., financial records for tax purposes).`,
  },
  {
    title: "8. Your Rights",
    content: `You have the right to access, correct, or delete the personal data we hold about you. To exercise these rights, email us at support@tutorconnect.com with the subject line "Data Request". We will respond within 7 business days.`,
  },
  {
    title: "9. Children's Privacy",
    content: `TutorConnect is intended for use by adults (parents/guardians and tutors). We do not knowingly collect personal information from children under 13. If you believe a child has registered without parental consent, please contact us immediately.`,
  },
  {
    title: "10. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. When we do, we will revise the "Last Updated" date below and notify registered users via email for material changes. Continued use of TutorConnect after changes constitutes acceptance of the updated policy.`,
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-primary/10 via-white to-accent/10 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Shield className="w-4 h-4" /> Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-500 text-sm">Last Updated: January 1, 2025</p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-16 max-w-3xl">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 space-y-10">
          <p className="text-slate-600 leading-relaxed">
            TutorConnect ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
            use, and safeguard your information when you use our platform at tutorconnect.com. Please read this policy carefully.
          </p>
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h2>
              <p className="text-slate-600 leading-relaxed text-sm">{s.content}</p>
            </div>
          ))}
          <div className="border-t border-slate-100 pt-8">
            <p className="text-slate-500 text-sm">
              For any privacy-related questions, contact us at{" "}
              <a href="mailto:support@tutorconnect.com" className="text-primary hover:underline">support@tutorconnect.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
