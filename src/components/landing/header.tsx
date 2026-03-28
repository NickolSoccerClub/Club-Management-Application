"use client";

import { useState, useEffect } from "react";
import { Menu, X, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Schedule", href: "/schedule" },
  { label: "Results", href: "/results" },
  { label: "News", href: "/news" },
  { label: "About", href: "#about" },
];

const mobileNavLinks = [
  { label: "Schedule", href: "/schedule" },
  { label: "Results", href: "/results" },
  { label: "News", href: "/news" },
  { label: "Login", href: "/login" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-navy shadow-lg h-14 md:h-16"
            : "bg-transparent h-14 md:h-16"
        )}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Club name */}
          <a href="#" className="text-lg font-extrabold tracking-wider text-white md:text-xl">
            NICKOL SC
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop login button */}
          <a
            href="/login"
            className="hidden items-center gap-2 rounded-md border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/20 md:inline-flex"
          >
            <LogIn className="h-4 w-4" />
            Member Login
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile slide-out drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-72 bg-navy shadow-2xl transition-transform duration-300 ease-in-out md:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <span className="text-lg font-extrabold tracking-wider text-white">
            NICKOL SC
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-md p-2 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-4">
          {mobileNavLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-4 py-3 text-base font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
