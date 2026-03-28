"use client";

import {
  Heart,
  TrendingUp,
  Shield,
  Smile,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const values = [
  {
    icon: Users,
    title: "Community",
    description: "Building connections that extend beyond the pitch across the Pilbara.",
  },
  {
    icon: TrendingUp,
    title: "Development",
    description: "Growing skills and confidence at every level, from juniors to seniors.",
  },
  {
    icon: Shield,
    title: "Respect",
    description: "Fair play, sportsmanship, and respect for all on and off the field.",
  },
  {
    icon: Smile,
    title: "Fun",
    description: "Keeping the joy of the game at the heart of everything we do.",
  },
  {
    icon: Heart,
    title: "Inclusion",
    description: "A welcoming club for everyone, regardless of ability or background.",
  },
];

export function ClubValues() {
  return (
    <section id="about" className="bg-navy py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
          Our Values
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-white/60 sm:text-base">
          The principles that guide Nickol Soccer Club on and off the field
        </p>

        {/* Horizontal scroll on mobile, 5-col grid on desktop */}
        <div className="-mx-4 mt-10 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 sm:pb-0">
          <div className="flex gap-4 sm:grid sm:grid-cols-3 lg:grid-cols-5">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className={cn(
                    "min-w-[200px] shrink-0 rounded-xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm",
                    "transition-colors hover:bg-white/10 sm:min-w-0"
                  )}
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                    <Icon className="h-6 w-6 text-accent-light" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-white">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/60 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
