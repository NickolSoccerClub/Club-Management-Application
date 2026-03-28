"use client";

import { cn } from "@/lib/utils";

const eoiButtons = [
  { label: "Register a Player", href: "/eoi/player" },
  { label: "Become a Coach", href: "/eoi/coach" },
  { label: "Join the Committee", href: "/eoi/committee" },
];

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Gradient background placeholder (replace with image later) */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-light" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 50%, rgba(29,78,216,0.4) 0%, transparent 50%), radial-gradient(circle at 75% 30%, rgba(29,78,216,0.3) 0%, transparent 50%)",
        }}
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-32 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          NICKOL SOCCER CLUB
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80 sm:mt-6 sm:text-xl md:text-2xl">
          Inspiring the next generation of footballers in the Pilbara
        </p>

        {/* EOI Buttons - Planning/Pre-season phase */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:mt-12 sm:flex-row sm:justify-center sm:gap-5">
          {eoiButtons.map((btn) => (
            <a
              key={btn.label}
              href={btn.href}
              className={cn(
                "inline-flex w-full items-center justify-center rounded-lg border-2 border-white/60 px-8 py-4",
                "text-base font-semibold text-white backdrop-blur-sm sm:w-auto sm:text-lg",
                "transition-all duration-200 hover:border-white hover:bg-white/15",
                "active:scale-[0.98]"
              )}
            >
              {btn.label}
            </a>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="h-10 w-6 rounded-full border-2 border-white/40 p-1">
          <div className="mx-auto h-2 w-1 rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  );
}
