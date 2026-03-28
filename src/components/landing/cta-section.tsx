"use client";

import { cn } from "@/lib/utils";

const eoiButtons = [
  { label: "Register a Player", href: "/eoi/player" },
  { label: "Become a Coach", href: "/eoi/coach" },
  { label: "Join the Committee", href: "/eoi/committee" },
];

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-navy-dark via-navy to-accent/80 py-16 sm:py-20">
      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/5" />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
          Join Us for 2026
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-white/70 sm:text-lg">
          Registrations are now open. Whether you are a player, coach, or
          volunteer — there is a place for you at Nickol SC.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10 sm:flex-row sm:justify-center sm:gap-5">
          {eoiButtons.map((btn, i) => (
            <a
              key={btn.label}
              href={btn.href}
              className={cn(
                "inline-flex w-full items-center justify-center rounded-lg px-8 py-4 text-base font-semibold transition-all duration-200 sm:w-auto sm:text-lg",
                i === 0
                  ? "bg-white text-navy shadow-lg hover:bg-white/90 active:scale-[0.98]"
                  : "border-2 border-white/60 text-white hover:border-white hover:bg-white/15 active:scale-[0.98]"
              )}
            >
              {btn.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
