import { FileText } from "lucide-react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using TutorConnect ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the Platform. These terms apply to all users including parents, tutors, and administrators.`,
  },
  {
    title: "2. Eligibility",
    content: `You must be at least 18 years of age to register on TutorConnect. If you are registering as a parent on behalf of a minor student, you confirm that you are the legal guardian and take full responsibility for the tuition arrangement. Tutors must provide accurate qualification details during registration.`,
  },
  {
    title: "3. User Accounts",
    content: `You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorised use of your account. TutorConnect will not be liable for losses resulting from unauthorised access due to your failure to keep credentials secure. You may not create multiple accounts or impersonate another person.`,
  },
  {
    title: "4. Tuition Post Listings",
    content: `Parents may post tuition requirements free of charge. Posts must contain accurate information about subjects, class/grade, location, and budget. Posting false, misleading, or offensive content is strictly prohibited and may result in account suspension. TutorConnect reserves the right to remove any post that violates these guidelines.`,
  },
  {
    title: "5. Contact Unlock & Payments",
    content: `Tutors may pay a contact-unlock fee (currently ₹49 per post) to access a parent's contact details. This fee is non-refundable except in cases where the contact information provided was demonstrably incorrect, in which case a refund request must be raised within 24 hours. Payments are processed securely via Razorpay. TutorConnect does not store card or banking details.`,
  },
  {
    title: "6. Tutor Conduct",
    content: `Tutors agree to maintain professional conduct in all interactions with parents and students. Misrepresentation of qualifications, harassment, or any form of misconduct will result in immediate suspension and may be reported to relevant authorities. Tutors are independent contractors; TutorConnect does not employ tutors and is not responsible for the quality of tuition sessions.`,
  },
  {
    title: "7. Parent Responsibilities",
    content: `Parents are responsible for verifying tutor credentials and suitability before engaging them. TutorConnect facilitates the connection but does not guarantee the performance or outcomes of any tuition arrangement. Parents should conduct their own due diligence, including background verification if required.`,
  },
  {
    title: "8. Prohibited Activities",
    content: `You may not: (a) use the platform for any unlawful purpose; (b) post spam or irrelevant content; (c) attempt to bypass the payment system by sharing contact details outside the platform in ways that circumvent our service; (d) scrape, copy, or republish platform content without permission; (e) introduce malware or otherwise interfere with the platform's operation.`,
  },
  {
    title: "9. Limitation of Liability",
    content: `TutorConnect provides a marketplace to connect tutors and parents. We are not a party to any agreement between them and are not liable for any disputes, damages, or losses arising from tutoring arrangements. Our aggregate liability for any claim shall not exceed the fees you have paid to us in the preceding 3 months.`,
  },
  {
    title: "10. Intellectual Property",
    content: `All content on TutorConnect, including the logo, design, text, and software, is the property of TutorConnect and protected by applicable intellectual property laws. You may not reproduce or distribute any platform content without prior written permission.`,
  },
  {
    title: "11. Termination",
    content: `We reserve the right to suspend or terminate your account at any time, with or without notice, for violation of these Terms. You may also delete your account at any time by contacting support. Termination does not entitle you to a refund of any payments made.`,
  },
  {
    title: "12. Governing Law",
    content: `These Terms shall be governed by the laws of India. Any disputes arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.`,
  },
  {
    title: "13. Changes to Terms",
    content: `TutorConnect may update these Terms at any time. We will notify users of significant changes via email or platform notification. Continued use of the Platform after changes are posted constitutes your acceptance of the revised Terms.`,
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-primary/10 via-white to-accent/10 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <FileText className="w-4 h-4" /> Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-slate-500 text-sm">Last Updated: January 1, 2025</p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-16 max-w-3xl">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 space-y-10">
          <p className="text-slate-600 leading-relaxed">
            Welcome to TutorConnect. These Terms of Service govern your use of our platform. By creating an account or 
            using our services, you agree to comply with and be bound by these terms. Please read them carefully before proceeding.
          </p>
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h2>
              <p className="text-slate-600 leading-relaxed text-sm">{s.content}</p>
            </div>
          ))}
          <div className="border-t border-slate-100 pt-8">
            <p className="text-slate-500 text-sm">
              Questions about these Terms? Contact us at{" "}
              <a href="mailto:support@tutorconnect.com" className="text-primary hover:underline">support@tutorconnect.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
