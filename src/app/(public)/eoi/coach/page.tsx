"use client";

import { useState } from "react";
import { ClipboardList, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

const ageGroups = ["U7", "U8", "U9", "U10", "U11", "U12", "U13", "U14", "U15", "U16", "U17"];
const experienceOptions = ["0-1 years", "2-5 years", "5-10 years", "10+ years"];
const roleOptions = ["Head Coach", "Assistant Coach", "Team Manager"];

export default function CoachEOIPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    ageGroups: [] as string[],
    experience: "",
    qualifications: "",
    wwcc: "",
    motivation: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleAgeGroup(ag: string) {
    setForm((prev) => ({
      ...prev,
      ageGroups: prev.ageGroups.includes(ag)
        ? prev.ageGroups.filter((a) => a !== ag)
        : [...prev.ageGroups, ag],
    }));
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
                  Thank You for Your Interest!
                </h2>
                <p className="mt-3 text-gray-600 leading-relaxed max-w-md">
                  We&apos;ve received your expression of interest, <span className="font-semibold">{form.fullName}</span>.
                  Our committee will review your application and be in touch at{" "}
                  <span className="font-semibold">{form.email}</span> shortly.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button variant="primary" onClick={() => window.location.href = "/"}>
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
              <ClipboardList className="h-7 w-7 text-[#1D4ED8]" />
            </div>
            <h1 className="mt-4 text-3xl font-bold text-[#0B2545] sm:text-4xl">
              Coach &amp; Manager EOI
            </h1>
            <p className="mt-3 text-gray-600 leading-relaxed max-w-lg mx-auto">
              Interested in coaching or managing a team this season? Fill out the form below
              and our committee will be in touch with available opportunities.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Details</CardTitle>
              <CardDescription>All fields are required unless marked optional.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Full Name"
                  placeholder="e.g. Michael Johnson"
                  required
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="michael@example.com"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    placeholder="04XX XXX XXX"
                    required
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </div>

                {/* Role Interest */}
                <div className="w-full">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Role Interest
                  </label>
                  <select
                    required
                    value={form.role}
                    onChange={(e) => update("role", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/30 focus-visible:ring-offset-1"
                  >
                    <option value="">Select a role</option>
                    {roleOptions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {/* Age Groups - multi-select checkboxes */}
                <div className="w-full">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Preferred Age Group(s)
                  </label>
                  <p className="mb-3 text-xs text-gray-500">Select all that apply.</p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                    {ageGroups.map((ag) => (
                      <label
                        key={ag}
                        className={cn(
                          "flex cursor-pointer items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-all",
                          form.ageGroups.includes(ag)
                            ? "border-[#1D4ED8] bg-[#1D4ED8]/10 text-[#1D4ED8]"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                        )}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={form.ageGroups.includes(ag)}
                          onChange={() => toggleAgeGroup(ag)}
                        />
                        {ag}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div className="w-full">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Years of Experience
                  </label>
                  <select
                    required
                    value={form.experience}
                    onChange={(e) => update("experience", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/30 focus-visible:ring-offset-1"
                  >
                    <option value="">Select experience</option>
                    {experienceOptions.map((exp) => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
                </div>

                {/* Qualifications */}
                <div className="w-full">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Do you hold any coaching qualifications?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. FFA C Licence, Grassroots Certificate, first aid training..."
                    value={form.qualifications}
                    onChange={(e) => update("qualifications", e.target.value)}
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/30 focus-visible:ring-offset-1"
                  />
                </div>

                {/* WWCC */}
                <div className="w-full">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Working With Children Check
                  </label>
                  <div className="mt-2 flex flex-wrap gap-4">
                    {[
                      { value: "yes", label: "Yes, I have one" },
                      { value: "pending", label: "Pending / In progress" },
                      { value: "no", label: "No, not yet" },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="radio"
                          name="wwcc"
                          value={opt.value}
                          required
                          checked={form.wwcc === opt.value}
                          onChange={(e) => update("wwcc", e.target.value)}
                          className="h-4 w-4 accent-[#1D4ED8]"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Motivation */}
                <div className="w-full">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Why do you want to coach?
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what motivates you to get involved..."
                    value={form.motivation}
                    onChange={(e) => update("motivation", e.target.value)}
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/30 focus-visible:ring-offset-1"
                  />
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
