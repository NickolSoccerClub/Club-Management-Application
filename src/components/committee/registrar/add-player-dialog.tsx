"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToastStore } from "@/lib/stores/toast-store";
import { UserPlus, Loader2 } from "lucide-react";
import { z } from "zod";

const playerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  ageGroup: z.string().min(1, "Age group is required"),
  position: z.string().min(1, "Position is required"),
  guardianName: z.string().min(2, "Guardian name is required"),
  guardianEmail: z.string().email("Valid email is required"),
  guardianPhone: z.string().min(8, "Phone number is required"),
  medicalNotes: z.string().optional(),
  photoConsent: z.string().min(1, "Photo consent is required"),
});

type PlayerForm = z.infer<typeof playerSchema>;

const INITIAL_FORM: PlayerForm = {
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  ageGroup: "",
  position: "",
  guardianName: "",
  guardianEmail: "",
  guardianPhone: "",
  medicalNotes: "",
  photoConsent: "none",
};

const AGE_GROUP_OPTIONS = [
  { label: "U7", value: "U7" },
  { label: "U9", value: "U9" },
  { label: "U10", value: "U10" },
  { label: "U11", value: "U11" },
  { label: "U12", value: "U12" },
  { label: "U13", value: "U13" },
  { label: "U14", value: "U14" },
  { label: "U15", value: "U15" },
  { label: "U16", value: "U16" },
];

const POSITION_OPTIONS = [
  { label: "Goalkeeper", value: "Goalkeeper" },
  { label: "Defender", value: "Defender" },
  { label: "Midfielder", value: "Midfielder" },
  { label: "Forward", value: "Forward" },
];

const GENDER_OPTIONS = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

const CONSENT_OPTIONS = [
  { label: "No Photos", value: "none" },
  { label: "Internal Only", value: "Internal Only" },
  { label: "Public Website", value: "Public Website" },
  { label: "Social Media", value: "Social Media" },
];

interface AddPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPlayerDialog({ open, onOpenChange }: AddPlayerDialogProps) {
  const [form, setForm] = useState<PlayerForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof PlayerForm, string>>>({});
  const [saving, setSaving] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const updateField = (field: keyof PlayerForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const result = playerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof PlayerForm, string>> = {};
      result.error.errors.forEach((e) => {
        const field = e.path[0] as keyof PlayerForm;
        fieldErrors[field] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);

    addToast(`${form.firstName} ${form.lastName} added successfully`, "success");
    setForm(INITIAL_FORM);
    setErrors({});
    onOpenChange(false);
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 text-white">
            <UserPlus className="h-4 w-4" />
          </div>
          Add New Player
        </DialogTitle>
        <DialogDescription>
          Enter the player and guardian details below. Fields marked with * are required.
        </DialogDescription>

        <div className="mt-4 space-y-6">
          {/* Player Details */}
          <div>
            <h4 className="text-sm font-semibold text-[#0B2545] mb-3">Player Details</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="First Name *" value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} error={errors.firstName} placeholder="Enter first name" />
              <Input label="Last Name *" value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} error={errors.lastName} placeholder="Enter last name" />
              <Input label="Date of Birth *" type="date" value={form.dob} onChange={(e) => updateField("dob", e.target.value)} error={errors.dob} />
              <Select label="Gender *" options={GENDER_OPTIONS} value={form.gender} onChange={(e) => updateField("gender", e.target.value)} error={errors.gender} placeholder="Select gender" />
              <Select label="Age Group *" options={AGE_GROUP_OPTIONS} value={form.ageGroup} onChange={(e) => updateField("ageGroup", e.target.value)} error={errors.ageGroup} placeholder="Select age group" />
              <Select label="Preferred Position *" options={POSITION_OPTIONS} value={form.position} onChange={(e) => updateField("position", e.target.value)} error={errors.position} placeholder="Select position" />
            </div>
          </div>

          {/* Guardian Details */}
          <div>
            <h4 className="text-sm font-semibold text-[#0B2545] mb-3">Guardian Details</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Guardian Name *" value={form.guardianName} onChange={(e) => updateField("guardianName", e.target.value)} error={errors.guardianName} placeholder="Full name" />
              <Input label="Email *" type="email" value={form.guardianEmail} onChange={(e) => updateField("guardianEmail", e.target.value)} error={errors.guardianEmail} placeholder="email@example.com" />
              <Input label="Phone *" type="tel" value={form.guardianPhone} onChange={(e) => updateField("guardianPhone", e.target.value)} error={errors.guardianPhone} placeholder="0412 345 678" />
              <Select label="Photo Consent *" options={CONSENT_OPTIONS} value={form.photoConsent} onChange={(e) => updateField("photoConsent", e.target.value)} error={errors.photoConsent} />
            </div>
          </div>

          {/* Medical */}
          <div>
            <h4 className="text-sm font-semibold text-[#0B2545] mb-3">Medical Information</h4>
            <Textarea label="Medical Notes (optional)" value={form.medicalNotes} onChange={(e) => updateField("medicalNotes", e.target.value)} placeholder="Any allergies, conditions, or medication details..." rows={3} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" size="sm" onClick={handleClose} disabled={saving}>
            Cancel
          </Button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:from-blue-700 hover:to-blue-600 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            {saving ? "Saving..." : "Add Player"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
