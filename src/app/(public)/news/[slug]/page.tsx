"use client";

import { useParams } from "next/navigation";
import { CalendarDays, ArrowLeft, ArrowRight, User } from "lucide-react";
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
  body: string;
}

const articles: Article[] = [
  {
    slug: "2026-season-registrations-open",
    title: "2026 Season Registrations Now Open",
    excerpt: "Registrations for the 2026 season are officially open.",
    date: "2026-03-25",
    category: "Registrations",
    gradient: "from-[#1D4ED8] to-[#0B2545]",
    body: `We're thrilled to announce that registrations for the 2026 Nickol Soccer Club season are now officially open! Whether your child is a returning player or new to the sport, there's a place for everyone at Nickol SC.

This season, we're offering teams across age groups from U7 through to U17, with both boys and girls welcome in all divisions. Our focus remains on development, fun, and community — giving every child the chance to grow as a player and a person.

To register, simply head to our Expression of Interest page and fill out the online form. Once we've received enough expressions of interest for each age group, our committee will begin confirming team allocations, training schedules, and match fixtures.

Registration fees for the 2026 season will be confirmed shortly and will include a full playing kit (jersey, shorts, and socks), insurance, and Football West registration. We're also exploring subsidy options for families who may need financial assistance — no child should miss out on playing.

Key dates to remember:
- EOI Closing Date: 15 April 2026
- Team Allocations Announced: 22 April 2026
- Pre-Season Training Begins: 28 April 2026
- Round 1 Fixtures: 10 May 2026

We encourage all parents and guardians to register early, as spots fill quickly in our most popular age groups. If you have any questions about the registration process, please don't hesitate to reach out via our contact page or social media channels.

Let's make this the biggest and best season yet for Nickol Soccer Club!`,
  },
  {
    slug: "new-coaching-staff-announced",
    title: "New Coaching Staff Announced for U13s & U15s",
    excerpt: "Two experienced coaches are joining the club this season.",
    date: "2026-03-20",
    category: "Club News",
    gradient: "from-[#0B2545] to-[#1a3a6b]",
    body: `The Nickol Soccer Club committee is delighted to announce the appointment of two experienced coaches who will be leading our U13 and U15 squads for the 2026 season.

Mark Thompson, a former semi-professional player with over 15 years of coaching experience, will take charge of the U15s. Mark holds an FFA B Licence and has previously coached at regional level with Karratha FC. His philosophy centres on building technical skills while fostering a positive team culture.

Joining Mark is Sarah Chen, who will be coaching our U13 squad. Sarah brings a wealth of experience from her time coaching junior football in Perth before relocating to the Pilbara. She holds an FFA C Licence and is passionate about developing young players' confidence both on and off the pitch.

Both coaches have current Working With Children checks and have completed the club's mandatory safeguarding training. They will be supported by assistant coaches and team managers who will be announced in the coming weeks.

We're also still looking for volunteers to assist with other age groups. If you're interested in coaching, managing, or helping out on game days, please submit an expression of interest through our website.

The committee would like to thank all applicants who put their hand up for coaching roles this season. The quality and enthusiasm of our volunteer base is what makes Nickol SC such a special club.

Welcome aboard, Mark and Sarah!`,
  },
  {
    slug: "pre-season-training-schedule",
    title: "Pre-Season Training Schedule Released",
    excerpt: "Training kicks off next week across all age groups.",
    date: "2026-03-15",
    category: "Training",
    gradient: "from-[#059669] to-[#0B2545]",
    body: `Pre-season training for the 2026 Nickol SC season kicks off next week and we couldn't be more excited to get the boots back on the field!

Below is the training schedule for all age groups. Please note that all sessions are held at Nickol West Oval unless otherwise stated.

Monday: U7s & U9s — 4:30 PM to 5:30 PM
Tuesday: U11s & U13s — 4:30 PM to 5:45 PM
Wednesday: U15s & U17s — 5:00 PM to 6:15 PM
Thursday: Skills clinics (all ages) — 4:30 PM to 5:30 PM

What to bring: Shin guards, boots (or runners for younger age groups), a water bottle, hat, and sunscreen. Players should arrive at least 10 minutes before session start time.

The first two weeks of training will focus on fitness, ball skills, and getting to know your teammates and coaches. From week three, we'll begin more tactical work and trial games in preparation for Round 1.

Parents are welcome to stay and watch from the sideline area. We ask that spectators remain off the playing surface during training sessions for safety reasons.

If your child has any medical conditions or injuries that coaches should be aware of, please make sure this has been noted on your registration form or speak directly with the team coach before the first session.

We look forward to seeing everyone out there!`,
  },
  {
    slug: "annual-presentation-night",
    title: "Save the Date: Annual Presentation Night",
    excerpt: "Mark your calendars for our end-of-season celebrations.",
    date: "2026-03-10",
    category: "Events",
    gradient: "from-[#7C3AED] to-[#1D4ED8]",
    body: `It might feel like the season has only just begun, but it's never too early to save the date for one of the highlights of the Nickol SC calendar — our Annual Presentation Night!

This year's event will be held on Saturday, 12 September 2026 at the Karratha International Hotel function room. Doors open at 5:00 PM with the formal proceedings kicking off at 6:00 PM.

The evening will include award presentations for every age group, special recognition for our volunteer coaches and managers, and the announcement of our Club Champion awards. There will be food, drinks, and plenty of time to celebrate a great season with your Nickol SC family.

Awards to be presented include: Best and Fairest, Most Improved, Coach's Award, Golden Boot (top scorer), and the Spirit of the Club award for each age group.

Tickets will be on sale closer to the date. We'll keep pricing family-friendly as always, with under-16s free of charge.

If you have any questions or would like to help with event planning, please contact our Events Coordinator through the committee page on our website.

We can't wait to celebrate with you all!`,
  },
  {
    slug: "uniform-collection-details",
    title: "Uniform Collection Days Confirmed",
    excerpt: "Collect your uniforms on the scheduled dates below.",
    date: "2026-03-05",
    category: "Information",
    gradient: "from-[#EA580C] to-[#B91C1C]",
    body: `Great news — our 2026 playing kits have arrived and we've locked in collection dates for all registered players.

Uniform collection will take place at the Nickol West Oval clubrooms on the following dates:

Saturday, 19 April 2026: 9:00 AM - 12:00 PM (all age groups)
Wednesday, 22 April 2026: 4:00 PM - 6:00 PM (all age groups)
Saturday, 26 April 2026: 9:00 AM - 11:00 AM (final collection day)

Please bring your registration confirmation email or receipt when collecting your kit. Each registered player will receive a playing jersey, shorts, and a pair of club socks.

If you're unable to attend any of the scheduled collection days, please contact our Equipment Coordinator to arrange an alternative pickup time. We want to make sure every player is kitted out and ready for Round 1!

A few notes on kit care: Please wash jerseys in cold water and hang dry — do not tumble dry or iron directly on the printed numbers and logos. Taking care of your kit will help it last the entire season and beyond.

Returning players from the 2025 season may continue to use their existing kit if it still fits. If you need a replacement in a different size, please let us know during collection.

See you there!`,
  },
  {
    slug: "community-fundraiser-success",
    title: "Community Fundraiser Raises $3,500",
    excerpt: "Thank you to everyone who supported our fundraiser.",
    date: "2026-02-28",
    category: "Community",
    gradient: "from-[#1D4ED8] to-[#7C3AED]",
    body: `What an incredible day! Our community fundraiser at Karratha Shopping Centre last Saturday was a massive success, raising over $3,500 for the club.

The funds raised will go directly toward purchasing new training equipment, including goals, cones, bibs, and ball bags for all age groups. We'll also be investing in a portable shade structure for our younger players' training sessions during the warmer months.

A huge thank you to everyone who stopped by for a sausage sizzle, bought raffle tickets, or simply showed support by saying hello. The Pilbara community's generosity and love for grassroots sport never ceases to amaze us.

Congratulations to our raffle winners: First prize (Weber BBQ) — the Martinez family, Second prize ($200 Coles voucher) — David Chen, Third prize (Nickol SC merchandise pack) — Emily Thompson.

Special thanks to our sponsors who donated prizes and supplies: Pilbara Hardware, Karratha Fresh, and Northwest Signs. Your support makes events like this possible.

We'd also like to acknowledge the army of volunteers who gave up their Saturday to cook, sell, set up, and pack down. Running a community club takes a village, and we're so grateful for ours.

Stay tuned for details on our next fundraising event — we're planning something special for the mid-season break!`,
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NewsArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const article = articles.find((a) => a.slug === slug);
  const related = articles.filter((a) => a.slug !== slug).slice(0, 3);

  if (!article) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-20 pb-16">
          <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-[#0B2545]">Article Not Found</h1>
            <p className="mt-2 text-gray-600">The article you&apos;re looking for doesn&apos;t exist.</p>
            <Button variant="accent" className="mt-6" onClick={() => window.location.href = "/news"}>
              Back to News
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20 pb-16">
        {/* Cover image */}
        <div className={cn("relative h-56 bg-gradient-to-br sm:h-72 md:h-80", article.gradient)}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-extrabold text-white/10 sm:text-8xl">NSC</span>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <div className="pt-6">
            <a
              href="/news"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1D4ED8] hover:text-[#0B2545] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to News
            </a>
          </div>

          {/* Article header */}
          <div className="mt-6">
            <Badge variant="info">{article.category}</Badge>
            <h1 className="mt-3 text-2xl font-bold text-[#0B2545] sm:text-3xl md:text-4xl leading-tight">
              {article.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                <span>{formatDate(article.date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>The Committee</span>
              </div>
            </div>
          </div>

          {/* Article body */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <div className="prose prose-gray max-w-none">
              {article.body.split("\n\n").map((paragraph, i) => (
                <p key={i} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Related articles */}
          <div className="mt-16 border-t border-gray-200 pt-10">
            <h2 className="text-xl font-bold text-[#0B2545]">Related Articles</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((rel) => (
                <a key={rel.slug} href={`/news/${rel.slug}`} className="group">
                  <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                    <div className={cn("h-28 bg-gradient-to-br", rel.gradient)}>
                      <div className="flex h-full items-center justify-center">
                        <span className="text-2xl font-extrabold text-white/20">NSC</span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-xs text-gray-500">{formatDate(rel.date)}</p>
                      <h3 className="mt-1 text-sm font-semibold text-[#0B2545] leading-snug group-hover:text-[#1D4ED8] transition-colors line-clamp-2">
                        {rel.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-1 text-xs font-medium text-[#1D4ED8]">
                        Read More
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
