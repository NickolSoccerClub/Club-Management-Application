"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SkeletonCard } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/committee/shared/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToastStore } from "@/lib/stores/toast-store";
import { z } from "zod";
import {
  Plus,
  Handshake,
  Upload,
  Calendar,
  DollarSign,
  ExternalLink,
  Edit2,
  Mail,
  Trash2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Zod validation schema                                              */
/* ------------------------------------------------------------------ */

const sponsorFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  tier: z.string().min(1, "Tier is required"),
});

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

type Tier = "Platinum" | "Gold" | "Silver" | "Bronze";
type SponsorStatus = "Active" | "Pending Renewal" | "Expired";

interface Sponsor {
  id: number;
  name: string;
  tier: Tier;
  amount: number;
  contractStart: string;
  contractEnd: string;
  contactName: string;
  contactEmail: string;
  status: SponsorStatus;
  logoInitial: string;
  color: string;
}

const MOCK_SPONSORS: Sponsor[] = [
  { id: 1, name: "ABC Corp", tier: "Gold", amount: 2500, contractStart: "01 Jan 2026", contractEnd: "31 Dec 2026", contactName: "John Matthews", contactEmail: "john@abccorp.com.au", status: "Active", logoInitial: "A", color: "from-blue-500 to-blue-700" },
  { id: 2, name: "Pilbara Mining Co", tier: "Silver", amount: 1500, contractStart: "01 Feb 2026", contractEnd: "31 Jan 2027", contactName: "Rebecca Stone", contactEmail: "r.stone@pilbaramining.com.au", status: "Active", logoInitial: "P", color: "from-amber-500 to-amber-700" },
  { id: 3, name: "Karratha Auto Services", tier: "Bronze", amount: 500, contractStart: "01 Mar 2026", contractEnd: "28 Feb 2027", contactName: "Mike Turner", contactEmail: "mike@karrathauto.com.au", status: "Active", logoInitial: "K", color: "from-green-500 to-green-700" },
  { id: 4, name: "Nickol Hardware & Garden", tier: "Bronze", amount: 500, contractStart: "01 Mar 2026", contractEnd: "28 Feb 2027", contactName: "Sarah Blake", contactEmail: "sarah@nickolhw.com.au", status: "Active", logoInitial: "N", color: "from-purple-500 to-purple-700" },
  { id: 5, name: "Dampier Port Authority", tier: "Platinum", amount: 5000, contractStart: "01 Jan 2025", contractEnd: "31 Mar 2026", contactName: "David Wright", contactEmail: "d.wright@dampierport.gov.au", status: "Pending Renewal", logoInitial: "D", color: "from-red-500 to-red-700" },
  { id: 6, name: "Roebourne Transport", tier: "Silver", amount: 1500, contractStart: "01 Jun 2024", contractEnd: "31 May 2025", contactName: "Tim Black", contactEmail: "tim@roetransport.com.au", status: "Expired", logoInitial: "R", color: "from-gray-500 to-gray-700" },
];

const TIER_COLORS: Record<Tier, string> = {
  Platinum: "bg-gray-100 text-gray-800",
  Gold: "bg-yellow-50 text-yellow-800",
  Silver: "bg-gray-50 text-gray-600",
  Bronze: "bg-orange-50 text-orange-800",
};

const STATUS_VARIANT: Record<SponsorStatus, "success" | "warning" | "danger"> = {
  Active: "success",
  "Pending Renewal": "warning",
  Expired: "danger",
};

const TIER_OPTIONS = [
  { label: "Platinum", value: "Platinum" },
  { label: "Gold", value: "Gold" },
  { label: "Silver", value: "Silver" },
  { label: "Bronze", value: "Bronze" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SponsorshipPage() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);
  const [sponsorToRemove, setSponsorToRemove] = useState<Sponsor | null>(null);
  const { addToast } = useToastStore();

  // Form state
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [tier, setTier] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const totalValue = MOCK_SPONSORS.filter((s) => s.status === "Active").reduce((sum, s) => sum + s.amount, 0);
  const activeCount = MOCK_SPONSORS.filter((s) => s.status === "Active").length;
  const renewalCount = MOCK_SPONSORS.filter((s) => s.status === "Pending Renewal").length;

  const handleSaveSponsor = () => {
    const result = sponsorFormSchema.safeParse({ companyName, contactName, tier });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[issue.path[0] as string] = issue.message;
      });
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    addToast("Sponsor added", "success");
    setShowForm(false);
    setCompanyName("");
    setContactName("");
    setTier("");
  };

  const handleEditSponsor = () => {
    addToast("Sponsor updated", "success");
  };

  const handleRemoveSponsor = (sponsor: Sponsor) => {
    setSponsorToRemove(sponsor);
    setConfirmRemoveOpen(true);
  };

  const confirmRemoveSponsor = () => {
    addToast("Sponsor removed", "success");
    setSponsorToRemove(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Sponsorship Management"
          subtitle="Manage sponsors, contracts, and partnership details"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Sponsorship Management"
        subtitle="Manage sponsors, contracts, and partnership details"
      >
        <Button variant="accent" size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-1.5 h-4 w-4" /> Add Sponsor
        </Button>
      </PageHeader>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0FDF4]">
            <DollarSign className="h-5 w-5 text-[#15803D]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Active Value</p>
            <p className="text-xl font-bold text-[#15803D]">${totalValue.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF]">
            <Handshake className="h-5 w-5 text-[#1D4ED8]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Active Sponsors</p>
            <p className="text-xl font-bold text-[#1D4ED8]">{activeCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFFBEB]">
            <Calendar className="h-5 w-5 text-[#B45309]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Pending Renewal</p>
            <p className="text-xl font-bold text-[#B45309]">{renewalCount}</p>
          </div>
        </div>
      </div>

      {/* Add Sponsor form */}
      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base">Add New Sponsor</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Company Name"
                placeholder="Sponsor name..."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                error={formErrors.companyName}
              />
              <Select
                label="Tier"
                options={TIER_OPTIONS}
                placeholder="Select tier..."
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                error={formErrors.tier}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input label="Annual Amount ($)" type="number" placeholder="0.00" />
              <Input label="Contract Start" type="date" />
              <Input label="Contract End" type="date" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Contact Name"
                placeholder="Primary contact..."
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                error={formErrors.contactName}
              />
              <Input label="Contact Email" type="email" placeholder="email@company.com" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Sponsor Logo</label>
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">Upload logo (PNG, SVG)</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button variant="accent" size="sm" onClick={handleSaveSponsor}>Save Sponsor</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sponsor cards by tier */}
      {(["Platinum", "Gold", "Silver", "Bronze"] as Tier[]).map((tierName) => {
        const tierSponsors = MOCK_SPONSORS.filter((s) => s.tier === tierName);
        if (tierSponsors.length === 0) return null;

        return (
          <div key={tierName}>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", TIER_COLORS[tierName])}>{tierName}</span>
              <span>{tierSponsors.length} sponsor{tierSponsors.length !== 1 ? "s" : ""}</span>
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {tierSponsors.map((sponsor) => (
                <Card key={sponsor.id} className="overflow-hidden">
                  <div className="flex items-start gap-4 p-5">
                    <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xl font-bold text-white", sponsor.color)}>
                      {sponsor.logoInitial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-[#0B2545]">{sponsor.name}</h4>
                        <Badge variant={STATUS_VARIANT[sponsor.status]}>{sponsor.status}</Badge>
                      </div>
                      <p className="mt-1 text-lg font-bold text-[#15803D]">${sponsor.amount.toLocaleString()}/yr</p>
                      <div className="mt-2 space-y-1 text-xs text-gray-500">
                        <p className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {sponsor.contractStart} - {sponsor.contractEnd}
                        </p>
                        <p className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {sponsor.contactName}
                        </p>
                      </div>
                      <div className="mt-3 flex gap-1">
                        <button
                          className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#1D4ED8]"
                          onClick={handleEditSponsor}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#1D4ED8]">
                          <Mail className="h-4 w-4" />
                        </button>
                        <button className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#1D4ED8]">
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button
                          className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#B91C1C]"
                          onClick={() => handleRemoveSponsor(sponsor)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {/* Confirm delete dialog */}
      <ConfirmDialog
        open={confirmRemoveOpen}
        onOpenChange={(open) => {
          setConfirmRemoveOpen(open);
          if (!open) setSponsorToRemove(null);
        }}
        onConfirm={confirmRemoveSponsor}
        title="Remove Sponsor"
        description={`Are you sure you want to remove ${sponsorToRemove?.name ?? "this sponsor"}? This action cannot be undone.`}
        variant="danger"
        confirmLabel="Delete"
      />
    </div>
  );
}
