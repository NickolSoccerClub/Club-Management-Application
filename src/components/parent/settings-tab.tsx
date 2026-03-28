"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Users,
  Camera,
  Bell,
  Shield,
  Smartphone,
  Monitor,
  Trash2,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  LogOut,
  Save,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Toggle {
  key: string;
  label: string;
  value: boolean;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const INITIAL_PROFILE = {
  name: "Sarah Richardson",
  email: "sarah.richardson@email.com",
  phone: "0412 345 678",
  address: "14 Nickol Way, Karratha WA 6714",
};

const CHILDREN = [
  { id: "child-1", name: "Emma Richardson", ageGroup: "Under 9s", team: "Nickol Thunder" },
  { id: "child-2", name: "Jack Richardson", ageGroup: "Under 12s", team: "Nickol Storm" },
];

const INITIAL_PHOTO_CONSENT: Record<string, { internalPortal: boolean; publicWebsite: boolean; socialMedia: boolean }> = {
  "child-1": { internalPortal: true, publicWebsite: true, socialMedia: false },
  "child-2": { internalPortal: true, publicWebsite: false, socialMedia: false },
};

const INITIAL_NOTIFICATION_TOGGLES: Toggle[] = [
  { key: "email", label: "Email Notifications", value: true },
  { key: "push", label: "Push Notifications", value: true },
  { key: "sms", label: "SMS Notifications (optional)", value: false },
];

const INITIAL_NOTIFICATION_TYPES: Toggle[] = [
  { key: "game-reminders", label: "Game Reminders", value: true },
  { key: "training-reminders", label: "Training Reminders", value: true },
  { key: "team-announcements", label: "Team Announcements", value: true },
  { key: "score-updates", label: "Score Updates", value: true },
  { key: "club-news", label: "Club News", value: false },
];

const ACTIVE_SESSIONS = [
  { id: "s1", device: "iPhone 14 Pro", browser: "Safari", lastActive: "Now", icon: Smartphone },
  { id: "s2", device: "MacBook Pro", browser: "Chrome", lastActive: "2 hours ago", icon: Monitor },
  { id: "s3", device: "iPad Air", browser: "Safari", lastActive: "Yesterday", icon: Monitor },
];

/* ------------------------------------------------------------------ */
/*  Toggle switch component                                            */
/* ------------------------------------------------------------------ */

function ToggleSwitch({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full min-h-[48px] items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-gray-50 active:bg-gray-100 transition-colors"
      onClick={onToggle}
      role="switch"
      aria-checked={checked}
      aria-label={label}
    >
      <span className="text-sm font-medium text-[#0B2545]">{label}</span>
      {checked ? (
        <ToggleRight className="h-7 w-7 shrink-0 text-[#1D4ED8]" />
      ) : (
        <ToggleLeft className="h-7 w-7 shrink-0 text-gray-400" />
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SettingsTab() {
  const [profile, setProfile] = React.useState(INITIAL_PROFILE);
  const [photoConsent, setPhotoConsent] = React.useState(INITIAL_PHOTO_CONSENT);
  const [notifToggles, setNotifToggles] = React.useState(INITIAL_NOTIFICATION_TOGGLES);
  const [notifTypes, setNotifTypes] = React.useState(INITIAL_NOTIFICATION_TYPES);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const togglePhotoConsent = (
    childId: string,
    field: "internalPortal" | "publicWebsite" | "socialMedia"
  ) => {
    setPhotoConsent((prev) => ({
      ...prev,
      [childId]: { ...prev[childId], [field]: !prev[childId][field] },
    }));
  };

  const toggleNotif = (key: string) => {
    setNotifToggles((prev) =>
      prev.map((t) => (t.key === key ? { ...t, value: !t.value } : t))
    );
  };

  const toggleNotifType = (key: string) => {
    setNotifTypes((prev) =>
      prev.map((t) => (t.key === key ? { ...t, value: !t.value } : t))
    );
  };

  return (
    <div className="space-y-6">
      {/* ---- Profile Section ---- */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <User className="h-5 w-5 text-[#0B2545]" />
          <h2 className="text-lg font-semibold text-[#0B2545]">Profile</h2>
        </div>
        <Card>
          <CardContent className="space-y-4 p-4">
            <Input
              label="Full Name"
              value={profile.name}
              onChange={(e) =>
                setProfile((p) => ({ ...p, name: e.target.value }))
              }
              className="min-h-[44px]"
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile((p) => ({ ...p, email: e.target.value }))
              }
              className="min-h-[44px]"
            />
            <Input
              label="Phone"
              type="tel"
              value={profile.phone}
              onChange={(e) =>
                setProfile((p) => ({ ...p, phone: e.target.value }))
              }
              className="min-h-[44px]"
            />
            <Input
              label="Address"
              value={profile.address}
              onChange={(e) =>
                setProfile((p) => ({ ...p, address: e.target.value }))
              }
              className="min-h-[44px]"
            />
          </CardContent>
        </Card>
      </section>

      {/* ---- Children Section ---- */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Users className="h-5 w-5 text-[#0B2545]" />
          <h2 className="text-lg font-semibold text-[#0B2545]">Children</h2>
        </div>
        <div className="space-y-2">
          {CHILDREN.map((child) => (
            <Card key={child.id}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1D4ED8] text-sm font-bold text-white">
                  {child.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-medium text-[#0B2545]">{child.name}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <Badge variant="info">{child.ageGroup}</Badge>
                    <Badge>{child.team}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---- Photo Consent (Critical) ---- */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Camera className="h-5 w-5 text-[#0B2545]" />
          <h2 className="text-lg font-semibold text-[#0B2545]">
            Photo Consent
          </h2>
        </div>
        <Card className="border-[#B45309]/30">
          <CardContent className="p-4">
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#B45309]" />
              <p className="text-sm text-[#B45309]">
                Photos of your child will only be used in the ways you approve
                below.
              </p>
            </div>

            {CHILDREN.map((child) => (
              <div key={child.id} className="mb-4 last:mb-0">
                <p className="mb-2 text-sm font-semibold text-[#0B2545]">
                  {child.name}
                </p>
                <div className="space-y-0.5 rounded-lg border border-gray-200 bg-white">
                  <ToggleSwitch
                    checked={photoConsent[child.id]?.internalPortal ?? false}
                    onToggle={() =>
                      togglePhotoConsent(child.id, "internalPortal")
                    }
                    label="Internal Portal Only"
                  />
                  <ToggleSwitch
                    checked={photoConsent[child.id]?.publicWebsite ?? false}
                    onToggle={() =>
                      togglePhotoConsent(child.id, "publicWebsite")
                    }
                    label="Public Website"
                  />
                  <ToggleSwitch
                    checked={photoConsent[child.id]?.socialMedia ?? false}
                    onToggle={() =>
                      togglePhotoConsent(child.id, "socialMedia")
                    }
                    label="Social Media"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* ---- Notification Preferences ---- */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#0B2545]" />
          <h2 className="text-lg font-semibold text-[#0B2545]">
            Notification Preferences
          </h2>
        </div>
        <Card>
          <CardContent className="p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
              Channels
            </p>
            <div className="mb-4 space-y-0.5 rounded-lg border border-gray-200 bg-white">
              {notifToggles.map((t) => (
                <ToggleSwitch
                  key={t.key}
                  checked={t.value}
                  onToggle={() => toggleNotif(t.key)}
                  label={t.label}
                />
              ))}
            </div>

            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
              Notification Types
            </p>
            <div className="space-y-0.5 rounded-lg border border-gray-200 bg-white">
              {notifTypes.map((t) => (
                <ToggleSwitch
                  key={t.key}
                  checked={t.value}
                  onToggle={() => toggleNotifType(t.key)}
                  label={t.label}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ---- Active Sessions ---- */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#0B2545]" />
          <h2 className="text-lg font-semibold text-[#0B2545]">
            Active Sessions
          </h2>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              {ACTIVE_SESSIONS.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3"
                >
                  <div className="flex items-center gap-3">
                    <session.icon className="h-5 w-5 shrink-0 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-[#0B2545]">
                        {session.device}
                      </p>
                      <p className="text-xs text-gray-400">
                        {session.browser} &middot; {session.lastActive}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="min-h-[44px] min-w-[44px] gap-1 text-[#B91C1C] border-[#B91C1C]/30 hover:bg-[#B91C1C]/5 hover:text-[#B91C1C]"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Log Out</span>
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="secondary"
              className="mt-3 min-h-[44px] w-full gap-2 text-[#B91C1C] border-[#B91C1C]/30 hover:bg-[#B91C1C]/5 hover:text-[#B91C1C]"
            >
              <LogOut className="h-4 w-4" />
              Log Out All Devices
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* ---- Delete My Data ---- */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-[#B91C1C]" />
          <h2 className="text-lg font-semibold text-[#B91C1C]">
            Delete My Data
          </h2>
        </div>
        <Card className="border-[#B91C1C]/20">
          <CardContent className="p-4">
            <div className="mb-3 flex items-start gap-2 rounded-lg bg-red-50 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#B91C1C]" />
              <p className="text-sm text-[#B91C1C]">
                This action is permanent. All your data, including children
                profiles, attendance history, and messages will be permanently
                deleted. This cannot be undone.
              </p>
            </div>
            {!showDeleteConfirm ? (
              <Button
                variant="secondary"
                className="min-h-[44px] w-full gap-2 border-[#B91C1C]/30 text-[#B91C1C] hover:bg-[#B91C1C]/5 hover:text-[#B91C1C]"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4" />
                Request Data Deletion
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-center text-sm font-medium text-[#B91C1C]">
                  Are you sure? This cannot be undone.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="min-h-[44px] flex-1"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="min-h-[44px] flex-1 bg-[#B91C1C] hover:bg-[#B91C1C]/90 text-white">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Everything
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* ---- Save Changes ---- */}
      <div className="pb-4">
        <Button className="min-h-[44px] w-full gap-2 bg-[#15803D] hover:bg-[#15803D]/90">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
