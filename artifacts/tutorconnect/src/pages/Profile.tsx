import { useState, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, Calendar, BookOpen, Camera,
  Save, Shield, GraduationCap, Home, LayoutDashboard
} from "lucide-react";
import { Link } from "wouter";

export default function ProfilePage() {
  const { user, login, getAuthHeaders } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name:   (user as any)?.name   ?? "",
    phone:  (user as any)?.phone  ?? "",
    age:    (user as any)?.age    ?? "",
    bio:    (user as any)?.bio    ?? "",
    avatar: (user as any)?.avatar ?? "",
  });

  const [preview, setPreview] = useState<string | null>((user as any)?.avatar ?? null);
  const [saving, setSaving] = useState(false);

  // Convert uploaded image → base64 data URL and store in form
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      setForm(f => ({ ...f, avatar: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("tutorsphere_token");
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name:   form.name,
          phone:  form.phone,
          age:    form.age ? Number(form.age) : undefined,
          bio:    form.bio,
          avatar: form.avatar || undefined,
        }),
      });

      if (!res.ok) {
        const raw = await res.text();
        let msg = "Update failed";
        try { msg = JSON.parse(raw)?.message ?? msg; } catch { /* HTML or non-JSON */ }
        throw new Error(msg);
      }

      const updated = await res.json();
      // Refresh auth context + localStorage
      const token2 = localStorage.getItem("tutorsphere_token")!;
      login(token2, updated);

      toast({ title: "Profile updated ✓", description: "Your changes have been saved." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name?.charAt(0).toUpperCase() ?? "?";
  const roleLabel = user?.role === "tutor" ? "Tutor" : user?.role === "parent" ? "Parent" : "User";
  const dashLink  = user?.role === "tutor" ? "/tutor/dashboard" : "/parent/dashboard";

  const roleColors: Record<string, string> = {
    tutor:  "from-indigo-500 to-blue-600",
    parent: "from-violet-500 to-purple-600",
    admin:  "from-red-500 to-rose-600",
  };
  const grad = roleColors[user?.role ?? ""] ?? "from-slate-500 to-slate-700";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/60">
      <Navbar />

      {/* Hero band */}
      <div className="relative bg-gradient-to-br from-[#0f0618] to-[#1a084a] pt-10 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-25" />
        <div className="absolute top-0 right-1/3 w-64 h-64 bg-violet-600/15 rounded-full blur-[80px]" />
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <div className="flex items-center gap-2 text-violet-300 text-sm font-medium mb-4">
            <LayoutDashboard className="w-4 h-4" /> Profile Settings
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Edit Your Profile</h1>
          <p className="text-slate-400 mt-1 text-sm">Keep your information up to date.</p>
        </div>
      </div>

      <main className="container mx-auto px-4 max-w-3xl -mt-20 relative z-10 pb-20 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSave} className="space-y-5">

            {/* Avatar + identity card */}
            <Card className="border-0 shadow-xl shadow-slate-200/60 rounded-2xl overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Avatar preview */}
                  <div className="relative shrink-0">
                    <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white text-3xl font-extrabold ring-4 ring-white shadow-lg overflow-hidden`}>
                      {preview ? (
                        <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                    {/* Camera button */}
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-8 h-8 bg-violet-600 hover:bg-violet-700 rounded-full flex items-center justify-center shadow-md transition-colors"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </div>

                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-extrabold text-slate-900">{user?.name}</h2>
                    <p className="text-slate-500 text-sm mt-0.5">{user?.email}</p>
                    <div className="mt-2 flex items-center justify-center sm:justify-start gap-2">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                        user?.role === "tutor" ? "bg-indigo-100 text-indigo-700" :
                        user?.role === "parent" ? "bg-violet-100 text-violet-700" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        {user?.role === "tutor" ? <GraduationCap className="w-3 h-3" /> : <Home className="w-3 h-3" />}
                        {roleLabel}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-500" /> Verified</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5">
                  <Camera className="w-3 h-3" /> Click the camera icon to upload a new profile photo (JPG, PNG, WebP)
                </p>
              </CardContent>
            </Card>

            {/* Personal details */}
            <Card className="border-0 shadow-xl shadow-slate-200/60 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-violet-50 to-purple-50/40 px-6 py-4 border-b border-violet-100/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-violet-600" /> Personal Information
                </h3>
              </div>
              <CardContent className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" /> Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your full name"
                    className="h-11 rounded-xl border-slate-200 focus:border-violet-400 focus:ring-violet-200"
                  />
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min={10}
                    max={90}
                    value={form.age}
                    onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                    placeholder="e.g. 28"
                    className="h-11 rounded-xl border-slate-200 focus:border-violet-400 focus:ring-violet-200"
                  />
                </div>

                {/* Email (read-only) */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
                  </Label>
                  <div className="h-11 flex items-center px-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-sm">
                    {user?.email}
                    <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded">Read only</span>
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 9876543210"
                    className="h-11 rounded-xl border-slate-200 focus:border-violet-400 focus:ring-violet-200"
                  />
                </div>

                {/* Bio – full width */}
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="bio" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    {user?.role === "tutor" ? "Teaching Bio / Expertise" : "About Yourself"}
                  </Label>
                  <Textarea
                    id="bio"
                    value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    placeholder={
                      user?.role === "tutor"
                        ? "E.g. 5 years of experience teaching Math and Physics for grades 9–12..."
                        : "E.g. Parent of two kids looking for experienced tutors in Science..."
                    }
                    rows={4}
                    className="rounded-xl border-slate-200 focus:border-violet-400 focus:ring-violet-200 resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <Link href={dashLink}>
                <Button type="button" variant="outline" className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100">
                  ← Back to Dashboard
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border-0 text-white shadow-lg shadow-violet-500/30 font-semibold px-8"
              >
                {saving ? (
                  <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</span>
                ) : (
                  <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</span>
                )}
              </Button>
            </div>

          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
