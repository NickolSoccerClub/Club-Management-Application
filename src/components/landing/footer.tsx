"use client";

import { Facebook, Instagram, Mail, MapPin } from "lucide-react";

const quickLinks = [
  { label: "Schedule", href: "/schedule" },
  { label: "Results", href: "/results" },
  { label: "News", href: "/news" },
  { label: "Register", href: "/eoi/player" },
  { label: "Member Login", href: "/login" },
];

const socialLinks = [
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "Email", icon: Mail, href: "mailto:info@nickolsc.com.au" },
];

export function Footer() {
  return (
    <footer className="bg-navy-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* About column */}
          <div>
            <h3 className="text-lg font-extrabold tracking-wider">
              NICKOL SC
            </h3>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              A grassroots soccer club based in the Pilbara region of Western
              Australia, dedicated to inspiring the next generation of
              footballers through community, development, and fun.
            </p>
            <div className="mt-4 flex items-start gap-2 text-sm text-white/50">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Nickol West Oval, Karratha WA 6714</span>
            </div>
          </div>

          {/* Quick Links column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect column */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40">
              Connect
            </h4>
            <div className="mt-4 flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
            <p className="mt-6 text-sm text-white/50">
              Follow us for match updates, club news, and community events.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Nickol Soccer Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
