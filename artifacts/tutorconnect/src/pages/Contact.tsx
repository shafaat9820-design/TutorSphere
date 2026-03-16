import { Mail, Phone, MapPin, MessageSquare, Clock, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const faqs = [
  {
    q: "How do I post a tuition requirement?",
    a: "Register as a parent, go to your dashboard and click 'Post New Requirement'. Fill in the subject, class, location, and budget. Your post will be visible to all tutors immediately.",
  },
  {
    q: "How does the contact unlock work?",
    a: "Tutors pay a small fee of ₹49 to unlock a parent's contact details for a specific post. This ensures only serious tutors reach out to you.",
  },
  {
    q: "Is my personal information safe?",
    a: "Yes. Your phone number and address are hidden until a tutor pays to unlock the post. We use industry-standard encryption for all data.",
  },
  {
    q: "How are tutors verified?",
    a: "Tutors submit their qualifications during registration. Our team reviews profiles before they go live. Parents can also see tutor ratings from previous sessions.",
  },
  {
    q: "Can I get a refund?",
    a: "Refund requests for contact unlock payments can be raised within 24 hours if the contact details were incorrect. Email us at support@tutorconnect.com.",
  },
];

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-white to-accent/10 py-20">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <MessageSquare className="w-4 h-4" /> Get in Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Help Center</h1>
          <p className="text-slate-600 text-lg">Have a question or need support? We're here for you every step of the way.</p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl"><Mail className="w-5 h-5 text-primary" /></div>
                <div>
                  <p className="font-semibold text-slate-800 mb-1">Email Support</p>
                  <p className="text-sm text-slate-500">support@tutorconnect.com</p>
                  <p className="text-xs text-slate-400 mt-1">Response within 24 hours</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl"><Phone className="w-5 h-5 text-primary" /></div>
                <div>
                  <p className="font-semibold text-slate-800 mb-1">Phone Support</p>
                  <p className="text-sm text-slate-500">+91 98765 43210</p>
                  <p className="text-xs text-slate-400 mt-1">Mon–Sat, 9 AM – 7 PM IST</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl"><MapPin className="w-5 h-5 text-primary" /></div>
                <div>
                  <p className="font-semibold text-slate-800 mb-1">Office</p>
                  <p className="text-sm text-slate-500">Education Hub, Connaught Place<br />New Delhi – 110001, India</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl"><Clock className="w-5 h-5 text-primary" /></div>
                <div>
                  <p className="font-semibold text-slate-800 mb-1">Support Hours</p>
                  <p className="text-sm text-slate-500">Monday – Saturday</p>
                  <p className="text-sm text-slate-500">9:00 AM – 7:00 PM IST</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" placeholder="Rahul Sharma" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" placeholder="rahul@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="h-11 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="e.g. Payment issue, Account help..." value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea id="message" placeholder="Describe your issue or question in detail..." rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="rounded-xl resize-none" />
                  </div>
                  <Button type="submit" disabled={sending} className="w-full h-12 rounded-xl font-semibold">
                    {sending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <HelpCircle className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faqs.map((faq) => (
              <Card key={faq.q} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <p className="font-semibold text-slate-800 mb-2">{faq.q}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
