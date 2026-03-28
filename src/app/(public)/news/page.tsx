"use client";

import { useState } from "react";
import { CalendarDays, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  gradient: string;
}

const allArticles: Article[] = [
  {
    slug: "2026-season-registrations-open",
    title: "2026 Season Registrations Now Open",
    excerpt:
      "Registrations for the 2026 season are officially open. Get your player signed up early to secure a spot in their preferred age group.",
    date: "2026-03-25",
    category: "Registrations",
    gradient: "from-[#1D4ED8] to-[#0B2545]",
  },
  {
    slug: "new-coaching-staff-announced",
    title: "New Coaching Staff Announced for U13s & U15s",
    excerpt:
      "The committee is pleased to announce two experienced coaches joining the club this season to lead our U13 and U15 squads.",
    date: "2026-03-20",
    category: "Club News",
    gradient: "from-[#0B2545] to-[#1a3a6b]",
  },
  {
    slug: "pre-season-training-schedule",
    title: "Pre-Season Training Schedule Released",
    excerpt:
      "Training kicks off next week across all age groups. Check out the full schedule including times, venues, and what to bring.",
    date: "2026-03-15",
    category: "Training",
    gradient: "from-[#059669] to-[#0B2545]",
  },
  {
    slug: "annual-presentation-night",
    title: "Save the Date: Annual Presentation Night",
    excerpt:
      "Mark your calendars for our end-of-season presentation night. Awards, celebrations, and a chance to thank our incredible volunteers.",
    date: "2026-03-10",
    category: "Events",
    gradient: "from-[#7C3AED] to-[#1D4ED8]",
  },
  {
    slug: "uniform-collection-details",
    title: "Uniform Collection Days Confirmed",
    excerpt:
      "New and returning players can collect their uniforms on the scheduled dates below. Please bring your registration confirmation.",
    date: "2026-03-05",
    category: "Information",
    gradient: "from-[#EA580C] to-[#B91C1C]",
  },
  {
    slug: "community-fundraiser-success",
    title: "Community Fundraiser Raises $3,500",
    excerpt:
      "A huge thank you to everyone who supported our sausage sizzle and raffle at Karratha Shopping Centre. Funds will go toward new equipment.",
    date: "2026-02-28",
    category: "Community",
    gradient: "from-[#1D4ED8] to-[#7C3AED]",
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NewsPage() {
  const [visibleCount, setVisibleCount] = useState(6);
  const visible = allArticles.slice(0, visibleCount);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="pt-8 pb-8">
            <h1 className="text-3xl font-bold text-[#0B2545] sm:text-4xl">Club News</h1>
            <p className="mt-2 text-gray-600">
              Stay up to date with the latest announcements, events, and stories from Nickol Soccer Club.
            </p>
          </div>

          {/* Article grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((article) => (
              <a key={article.slug} href={`/news/${article.slug}`} className="group">
                <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                  {/* Gradient placeholder image */}
                  <div
                    className={cn(
                      "relative h-44 bg-gradient-to-br sm:h-48",
                      article.gradient
                    )}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-extrabold text-white/20">NSC</span>
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge variant="info" className="bg-white/20 text-white backdrop-blur-sm">
                        {article.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>{formatDate(article.date)}</span>
                    </div>
                    <h2 className="mt-2 text-base font-semibold text-[#0B2545] leading-snug group-hover:text-[#1D4ED8] transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#1D4ED8] group-hover:gap-2 transition-all">
                      Read More
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>

          {/* Load more */}
          {visibleCount < allArticles.length && (
            <div className="mt-10 text-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setVisibleCount((prev) => prev + 6)}
              >
                Load More Articles
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
