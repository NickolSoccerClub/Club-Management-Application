"use client";

import { cn } from "@/lib/utils";

interface Sponsor {
  name: string;
  tier: "diamond" | "gold" | "silver" | "bronze";
}

const sponsors: Sponsor[] = [
  { name: "Pilbara Mining Corp", tier: "diamond" },
  { name: "North West Gas", tier: "diamond" },
  { name: "Karratha Auto Group", tier: "gold" },
  { name: "Red Earth Constructions", tier: "gold" },
  { name: "Pilbara Plumbing", tier: "gold" },
  { name: "Coast to Coast Transport", tier: "silver" },
  { name: "Nickol Bay Meats", tier: "silver" },
  { name: "Outback Electrical", tier: "silver" },
  { name: "Roebourne Hardware", tier: "silver" },
  { name: "Dampier Sports Physio", tier: "bronze" },
  { name: "Red Dog Cafe", tier: "bronze" },
  { name: "Pilbara Print Co", tier: "bronze" },
  { name: "Sunrise Bakery", tier: "bronze" },
  { name: "Iron Range Tyres", tier: "bronze" },
];

const tierConfig = {
  diamond: {
    label: "Diamond Sponsors",
    height: "h-28 sm:h-32",
    textSize: "text-base sm:text-lg font-bold",
    cols: "grid-cols-1 sm:grid-cols-2",
    bg: "bg-gradient-to-br from-navy to-navy-light text-white",
  },
  gold: {
    label: "Gold Sponsors",
    height: "h-20 sm:h-24",
    textSize: "text-sm sm:text-base font-semibold",
    cols: "grid-cols-2 sm:grid-cols-3",
    bg: "bg-amber-50 text-amber-900 border border-amber-200",
  },
  silver: {
    label: "Silver Sponsors",
    height: "h-16 sm:h-20",
    textSize: "text-sm font-medium",
    cols: "grid-cols-2 sm:grid-cols-4",
    bg: "bg-slate-50 text-slate-700 border border-slate-200",
  },
  bronze: {
    label: "Bronze Sponsors",
    height: "h-14 sm:h-16",
    textSize: "text-xs sm:text-sm font-medium",
    cols: "grid-cols-2 sm:grid-cols-5",
    bg: "bg-orange-50/60 text-orange-900/80 border border-orange-200/60",
  },
} as const;

const tiers: Array<"diamond" | "gold" | "silver" | "bronze"> = [
  "diamond",
  "gold",
  "silver",
  "bronze",
];

function MarqueeRow({ items, tier }: { items: Sponsor[]; tier: Sponsor["tier"] }) {
  const config = tierConfig[tier];
  // Duplicate items for seamless looping
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden sm:hidden">
      <div className="flex animate-[marquee_20s_linear_infinite] gap-4">
        {doubled.map((s, i) => (
          <div
            key={`${s.name}-${i}`}
            className={cn(
              "flex shrink-0 items-center justify-center rounded-lg px-6",
              config.height,
              config.textSize,
              config.bg
            )}
            style={{ minWidth: "200px" }}
          >
            {s.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Sponsors() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-navy sm:text-3xl">
          Our Sponsors
        </h2>

        <div className="mt-10 space-y-8">
          {tiers.map((tier) => {
            const tierSponsors = sponsors.filter((s) => s.tier === tier);
            if (tierSponsors.length === 0) return null;
            const config = tierConfig[tier];

            return (
              <div key={tier}>
                <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-navy/50">
                  {config.label}
                </p>

                {/* Mobile: marquee */}
                <MarqueeRow items={tierSponsors} tier={tier} />

                {/* Tablet/Desktop: grid */}
                <div className={cn("hidden gap-4 sm:grid", config.cols)}>
                  {tierSponsors.map((s) => (
                    <div
                      key={s.name}
                      className={cn(
                        "flex items-center justify-center rounded-lg px-4 text-center transition-transform hover:scale-[1.02]",
                        config.height,
                        config.textSize,
                        config.bg
                      )}
                    >
                      {s.name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
