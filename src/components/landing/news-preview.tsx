"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
}

const mockNews: NewsItem[] = [
  {
    id: 1,
    title: "2026 Season Registration Now Open",
    excerpt: "Register your interest for the upcoming season. Player, coach, and committee positions available for all age groups.",
    date: "25 Mar 2026",
  },
  {
    id: 2,
    title: "Pre-Season Training Schedule Released",
    excerpt: "Check out the pre-season training times for all junior and senior squads starting in April at Nickol West Oval.",
    date: "20 Mar 2026",
  },
  {
    id: 3,
    title: "New Partnership with Pilbara Mining Corp",
    excerpt: "We are proud to announce Pilbara Mining Corp as our new Diamond sponsor for the 2026 season and beyond.",
    date: "15 Mar 2026",
  },
];

export function NewsPreview() {
  return (
    <section className="bg-muted py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">
            Latest News
          </h2>
          <a
            href="/news"
            className="hidden items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-accent-light sm:inline-flex"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Horizontal scroll on mobile, 3-col grid on desktop */}
        <div className="-mx-4 mt-8 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 sm:pb-0">
          <div className="flex gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3">
            {mockNews.map((item) => (
              <article
                key={item.id}
                className={cn(
                  "group min-w-[280px] shrink-0 overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md sm:min-w-0"
                )}
              >
                {/* Placeholder image area */}
                <div className="aspect-[16/9] bg-gradient-to-br from-navy/80 to-accent/60" />

                <div className="p-5">
                  <time className="text-xs font-medium text-navy/50">
                    {item.date}
                  </time>
                  <h3 className="mt-1.5 text-base font-bold text-navy leading-snug line-clamp-2 sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {item.excerpt}
                  </p>
                  <a
                    href={`/news/${item.id}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-accent-light"
                  >
                    Read More
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Mobile "View All" link */}
        <div className="mt-6 text-center sm:hidden">
          <a
            href="/news"
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent"
          >
            View All News
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
