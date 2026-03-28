"use client";

import { useState } from "react";
import { UserPlus, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

const ageGroups = ["U7", "U8", "U9", "U10", "U11", "U12", "U13", "U14", "U15", "U16", "U17"];

export default function PlayerEOIPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    ageGroup: "",
    guardianName: "",
    guardianEmail: "",
    guardianPhone: "",
    medicalNotes: "",
    playedBefore: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 pt-20 pb-16">
          <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
            <Card className="mt-8">
              <CardContent className="flex flex-col items-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-[#0B2545]">
                  Expression of Interest Submitted!
                </h2>
                <p className="mt-3 text-gray-600 leading-relaxed max-w-md">
                  Thank you for registering <span className="font-semibold">{form.firstName} {form.lastName}</span>.
                  We&apos;ll be in touch at <span className="font-semibold">{form.guardianEmail}</span> with next steps
                  once team allocations are confirmed.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button variant="primary" onClick={() => { setSubmitted(false); setForm({ firstName: "", lastName: "", dob: "", gender: "", ageGroup: "", guardianName: "", guardianEmail: "", guardianPhone: "", medicalNotes: "", playedBefore: "" }); }}>
                    Register Another Player
                  </Button>
                  <Button variant="secondary" onClick={() => window.location.href = "/"}>
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
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
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="pt-8 pb-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1D4ED8]/10">
              <UserPlus className="h-7 w-7 text-[#1D4ED8]" />
            </div>
            <h1 className="mt-4 text-3xl font-bold text-[#0B2545] sm:text-4xl">
              Register Your Player
            </h1>
            <p className="mt-3 text-gray-600 leading-relaxed max-w-lg mx-auto">
              Submit an expression of interest to register your child for the upcoming season.
              This is not a final registration &mdash; our team will follow up with details on
              team placements, fees, and training schedules.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Player Details</CardTitle>
              <CardDescription>All fields are required unless marked optional.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Player name row */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Player First Name"
                    placeholder="e.g. Jordan"
                    required
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                  />
                  <Input
                    label="Player Last Name"
                    placeholder="e.g. Smith"
                    required
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                  />
                </div>

                {/* DOB and Gender */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Date of Birth"
                    type="date"
                    required
                    value={form.dob}
                    onChange={(e) => update("dob", e.target.value)}
                  />
                  <div className="w-full">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      required
                      value={form.gender}
                      onChange={(e) => update("gender", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/30 focus-visible:ring-offset-1"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Age Group */}
                <div className="w-full">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Preferred Age Group
                  </label>
                  <select
                    required
                    value={form.ageGroup}
                    onChange={(e) => update("ageGroup", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/30 focus-visible:ring-offset-1"
                  >
                    <option value="">Select age group</option>
                    {ageGroups.map((ag) => (
                      <option key={ag} value={ag}>{ag}</option>
                    ))}
                  </select>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-base font-semibold text-[#0B2545]">Guardian / Parent Details</h3>
                </div>

                <Input
                  label="Guardian Full Name"
                  placeholder="e.g. Sarah Smith"
                  required
                  value={form.guardianName}
                  onChange={(e) => update("guardianName", e.target.value)}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Guardian Email"
                    type="email"
                    placeholder="sarah@example.com"
                    required
                    value={form.guardianEmail}
                    onChange={(e) => update("guardianEmail", e.target.value)}
                  />
                  <Input
                    label="Guardian Phone"
                    type="tel"
                    placeholder="04XX XXX XXX"
                    required
                    value={form.guardianPhone}
                    onChange={(e) => update("guardianPhone", e.target.value)}
                  />
                </div>

                {/* Medical Notes */}
                <div className="w-full">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Medical Notes <span className="text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Any allergies, conditions, or information the club should be aware of..."
                    value={form.medicalNotes}
                    onChange={(e) => update("medicalNotes", e.target.value)}
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/30 focus-visible:ring-offset-1"
                  />
                </div>

                {/* Played Before */}
                <div className="w-full">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Has your child played before?
                  </label>
                  <div className="mt-2 flex gap-6">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="playedBefore"
                        value="yes"
                        required
                        checked={form.playedBefore === "yes"}
                        onChange={(e) => update("playedBefore", e.target.value)}
                        className="h-4 w-4 text-[#1D4ED8] accent-[#1D4ED8]"
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="playedBefore"
                        value="no"
                        checked={form.playedBefore === "no"}
                        onChange={(e) => update("playedBefore", e.target.value)}
                        className="h-4 w-4 text-[#1D4ED8] accent-[#1D4ED8]"
                      />
                      No
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" variant="accent" size="lg" className="w-full sm:w-auto">
                    Submit Expression of Interest
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
