import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, LayoutDashboard, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getDashboardLink = () => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "tutor") return "/tutor/dashboard";
    return "/parent/dashboard";
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/posts", label: "Tuitions/Jobs" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  const roleColors: Record<string, string> = {
    admin: "bg-red-100 text-red-700",
    tutor: "bg-emerald-100 text-emerald-700",
    parent: "bg-violet-100 text-violet-700",
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-2xl shadow-md shadow-slate-200/50 border-b border-slate-200/60"
          : "bg-white/60 backdrop-blur-xl border-b border-slate-200/40"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <img src="/logo.png" alt="TutorSphere" className="h-12 w-auto object-contain transition-transform group-hover:scale-105" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location === link.href || (link.href !== "/" && location.startsWith(link.href))
                  ? "text-violet-700 bg-violet-50/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
            >
              {link.label}
              {(location === link.href || (link.href !== "/" && location.startsWith(link.href))) && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-violet-600" />
              )}
            </Link>
          ))}
        </nav>

        {/* Auth Controls */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 ring-2 ring-transparent hover:ring-violet-200 transition-all">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-60 rounded-2xl border border-slate-200/60 shadow-2xl shadow-slate-300/30 p-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal px-2 py-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                    <span className={`text-xs inline-block mt-1 px-2 py-0.5 rounded-full w-fit font-semibold capitalize ${roleColors[user.role] || "bg-slate-100 text-slate-600"}`}>
                      {user.role}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1 bg-slate-100" />
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2.5 hover:bg-violet-50 focus:bg-violet-50">
                    <UserCircle className="mr-2.5 h-4 w-4 text-violet-600" />
                    <span className="font-medium">Edit Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href={getDashboardLink()}>
                  <DropdownMenuItem className="cursor-pointer rounded-xl px-3 py-2.5 hover:bg-violet-50 focus:bg-violet-50">
                    <LayoutDashboard className="mr-2.5 h-4 w-4 text-violet-600" />
                    <span className="font-medium">Dashboard</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator className="my-1 bg-slate-100" />
                <DropdownMenuItem onClick={logout} className="cursor-pointer rounded-xl px-3 py-2.5 text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600">
                  <LogOut className="mr-2.5 h-4 w-4" />
                  <span className="font-medium">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="font-medium text-slate-700 hover:text-violet-700 hover:bg-violet-50 rounded-xl">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button className="font-semibold rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-md shadow-violet-500/25 text-white border-0 hover:-translate-y-px transition-all duration-200">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-2xl py-4 px-4 shadow-2xl absolute w-full left-0 top-16">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium py-2.5 px-3 rounded-xl transition-colors ${
                  location === link.href ? "bg-violet-50 text-violet-700" : "text-slate-700 hover:bg-slate-100"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href={getDashboardLink()}
                  className="text-sm font-medium text-slate-700 py-2.5 px-3 rounded-xl hover:bg-slate-100 flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4 text-violet-600" /> Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="text-left text-sm font-medium text-red-600 py-2.5 px-3 rounded-xl hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2 mt-2 border-t border-slate-100">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center rounded-xl">Log in</Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full justify-center rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0">Get Started</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
