"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  X,
  Edit,
  User,
  Calendar,
  Mail,
  Phone,
  Shield,
  Heart,
  Hash,
  Users,
  Camera,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type PlayerStatus = "Registered" | "EOI" | "Pending";

export interface PlayerFull {
  id: number;
  firstName: string;
  lastName: string;
  dob: string;
  ageGroup: string;
  team: string;
  status: PlayerStatus;
  ffaNumber: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  medicalNotes: string;
  photoConsent: "None" | "Internal Only" | "Public Website" | "Social Media";
  registeredDate: string;
  position: string;
  gradeScore: number;
}

const STATUS_VARIANT: Record<PlayerStatus, "success" | "info" | "warning"> = {
  Registered: "success",
  EOI: "info",
  Pending: "warning",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface PlayerDetailPanelProps {
  player: PlayerFull | null;
  open: boolean;
  onClose: () => void;
}

export function PlayerDetailPanel({ player, open, onClose }: PlayerDetailPanelProps) {
  if (!player) return null;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:bg-transparent"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full sm:w-[450px] bg-white border-l border-gray-200 shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-[#0B2545]">
              {player.firstName} {player.lastName}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant={STATUS_VARIANT[player.status]}>{player.status}</Badge>
              <Badge variant="info">{player.ageGroup}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <Edit className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Close panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6">
          {/* Personal Information */}
          <section>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-[#0B2545] mb-3">
              <User className="h-4 w-4 text-[#1D4ED8]" />
              Personal Information
            </h4>
            <div className="space-y-3">
              <DetailRow label="Full Name" value={`${player.firstName} ${player.lastName}`} />
              <DetailRow label="Date of Birth" value={player.dob} icon={Calendar} />
              <DetailRow label="Age Group" value={player.ageGroup} />
              <DetailRow label="FFA Number" value={player.ffaNumber} icon={Hash} />
              <DetailRow label="Position" value={player.position} />
              <DetailRow label="Grade Score" value={`${player.gradeScore} / 10`} />
              <DetailRow label="Registered" value={player.registeredDate} icon={Calendar} />
            </div>
          </section>

          {/* Team Assignment */}
          <section>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-[#0B2545] mb-3">
              <Users className="h-4 w-4 text-[#1D4ED8]" />
              Team Assignment
            </h4>
            <div className="space-y-3">
              <DetailRow label="Team" value={player.team} />
            </div>
          </section>

          {/* Guardian Details */}
          <section>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-[#0B2545] mb-3">
              <Shield className="h-4 w-4 text-[#1D4ED8]" />
              Guardian Details
            </h4>
            <div className="space-y-3">
              <DetailRow label="Name" value={player.guardianName} />
              <DetailRow label="Email" value={player.guardianEmail} icon={Mail} />
              <DetailRow label="Phone" value={player.guardianPhone} icon={Phone} />
            </div>
          </section>

          {/* Medical & Consent */}
          <section>
            <h4 className="flex items-center gap-2 text-sm font-semibold text-[#0B2545] mb-3">
              <Heart className="h-4 w-4 text-[#1D4ED8]" />
              Medical & Consent
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Medical Notes</p>
                <p className="mt-0.5 text-sm text-[#0B2545] bg-gray-50 rounded-md px-3 py-2 border border-gray-100">
                  {player.medicalNotes || "No medical notes recorded"}
                </p>
              </div>
              <DetailRow label="Photo Consent" value={player.photoConsent} icon={Camera} />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail Row                                                         */
/* ------------------------------------------------------------------ */

function DetailRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="text-xs text-gray-500 flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </p>
      <p className="text-sm font-medium text-[#0B2545] text-right">{value}</p>
    </div>
  );
}
