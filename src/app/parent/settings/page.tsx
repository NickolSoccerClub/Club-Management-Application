"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  User,
  Camera,
  Bell,
  Shield,
  Database,
  Smartphone,
  Monitor,
  Tablet,
  Trash2,
  Download,
  LogOut,
  Save,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ConsentLevel = "none" | "internal" | "public" | "social";

interface ChildConsent {
  id: string;
  name: string;
  ageGroup: string;
  team: string;
  consent: ConsentLevel;
}

interface NotifPref {
  key: string;
  label: string;
  enabled: boolean;
}

interface SessionDevice {
  id: string;
  device: string;
  browser: string;
  lastActive: string;
  icon: React.ElementType;
  current: boolean;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const INITIAL_PROFILE = {
  name: "Sarah Richardson",
  email: "sarah.richardson@email.com",
  phone: "0412 345 678",
};

const INITIAL_CHILDREN_CONSENT: ChildConsent[] = [
  { id: "child-1", name: "Emma Richardson", ageGroup: "Under 9s", team: "Nickol Thunder", consent: "public" },
  { id: "child-2", name: "Jack Richardson", ageGroup: "Under 12s", team: "Nickol Storm", consent: "internal" },
];

const CONSENT_OPTIONS: { value: ConsentLevel; label: string; description: string }[] = [
  { value: "none", label: "No Photos", description: "No photos of this child may be taken or published" },
  { value: "internal", label: "Internal Only", description: "Photos visible only within the club portal" },
  { value: "public", label: "Public Website", description: "Photos may appear on the club website" },
  { value: "social", label: "Social Media", description: "Photos may be shared on club social media channels" },
];

const INITIAL_CHANNELS: NotifPref[] = [
  { key: "email", label: "Email", enabled: true },
  { key: "push", label: "Push Notifications", enabled: true },
  { key: "sms", label: "SMS", enabled: false },
];

const INITIAL_NOTIF_TYPES: NotifPref[] = [
  { key: "game-reminders", label: "Game Reminders", enabled: true },
  { key: "training-updates", label: "Training Updates", enabled: true },
  { key: "team-announcements", label: "Team Announcements", enabled: true },
  { key: "results", label: "Results", enabled: true },
  { key: "club-news", label: "Club News", enabled: false },
];

const ACTIVE_SESSIONS: SessionDevice[] = [
  { id: "s1", device: "iPhone 14 Pro", browser: "Safari", lastActive: "Now", icon: Smartphone, current: true },
  { id: "s2", device: "MacBook Pro", browser: "Chrome", lastActive: "2 hours ago", icon: Monitor, current: false },
  { id: "s3", device: "iPad Air", browser: "Safari", lastActive: "Yesterday", icon: Tablet, current: false },
];

/* ------------------------------------------------------------------ */
/*  Toggle switch                                                      */
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
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function ParentSettingsPage() {
  const [loading, setLoading] = React.useState(true);
  const [profile, setProfile] = React.useState(INITIAL_PROFILE);
  const [childrenConsent, setChildrenConsent] = React.useState(INITIAL_CHILDREN_CONSENT);
  const [channels, setChannels] = React.useState(INITIAL_CHANNELS);
  const [notifTypes, setNotifTypes] = React.useState(INITIAL_NOTIF_TYPES);
  const [consentDialogOpen, setConsentDialogOpen] = React.useState(false);
  const [consentPendingChild, setConsentPendingChild] = React.useState<string | null>(null);
  const [consentPendingLevel, setConsentPendingLevel] = React.useState<ConsentLevel>("none");
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [signOutAllDialogOpen, setSignOutAllDialogOpen] = React.useState(false);
  const { addToast } = useToastStore();

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  /* ---- Consent handlers ---- */
  const handleConsentChange = (childId: string, newLevel: ConsentLevel) => {
    setConsentPendingChild(childId);
    setConsentPendingLevel(newLevel);
    setConsentDialogOpen(true);
  };

  const confirmConsentChange = () => {
    if (!consentPendingChild) return;
    setChildrenConsent((prev) =>
      prev.map((c) =>
        c.id === consentPendingChild ? { ...c, consent: consentPendingLevel } : c
      )
    );
    addToast("Photo consent updated", "success");
    setConsentPendingChild(null);
  };

  /* ---- Toggle handlers ---- */
  const toggleChannel = (key: string) => {
    setChannels((prev) =>
      prev.map((c) => (c.key === key ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const toggleNotifType = (key: string) => {
    setNotifTypes((prev) =>
      prev.map((t) => (t.key === key ? { ...t, enabled: !t.enabled } : t))
    );
  };

  /* ---- Save ---- */
  const handleSave = () => {
    addToast("Settings saved", "success");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ---- Section 1: Profile ---- */}
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
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              className="min-h-[44px]"
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              className="min-h-[44px]"
            />
            <Input
              label="Phone"
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              className="min-h-[44px]"
            />
            <Button
              variant="accent"
              className="w-full min-h-[44px] gap-2"
              onClick={handleSave}
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* ---- Section 2: Photo Consent (per child) ---- */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Camera className="h-5 w-5 text-[#0B2545]" />
          <h2 className="text-lg font-semibold text-[#0B2545]">
            Photo Consent
          </h2>
        </div>

        {/* Privacy warning */}
        <div className="mb-3 flex items-start gap-2 rounded-lg border border-[#B45309]/30 bg-amber-50 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#B45309]" />
          <p className="text-sm text-[#B45309]">
            Your child&apos;s privacy matters. Photos will only be used in the ways you explicitly approve below. You can change these settings at any time.
          </p>
        </div>

        <div className="space-y-3">
          {childrenConsent.map((child) => (
            <Card key={child.id} className="border-[#B45309]/20">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1D4ED8] text-sm font-bold text-white">
                    {child.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium text-[#0B2545]">{child.name}</p>
                    <div className="mt-0.5 flex gap-1">
                      <Badge variant="info">{child.ageGroup}</Badge>
                      <Badge>{child.team}</Badge>
                    </div>
                  </div>
                </div>

                {/* Consent level selector */}
                <div className="relative">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Consent Level
                  </label>
                  <div className="relative">
                    <select
                      value={child.consent}
                      onChange={(e) =>
                        handleConsentChange(child.id, e.target.value as ConsentLevel)
                      }
                      className="flex h-11 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/30 focus-visible:ring-offset-1 min-h-[44px]"
                    >
                      {CONSENT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500">
                    {CONSENT_OPTIONS.find((o) => o.value === child.consent)?.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---- Section 3: Notification Preferences ---- */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#0B2545]" />
          <h2 className="text-lg font-semibold text-[#0B2545]">
            Notification Preferences
          </h2>
        </div>
        <Card>
          <CardContent className="p-4">
            {/* Channels */}
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
              Channels
            </p>
            <div className="mb-4 space-y-0.5 rounded-lg border border-gray-200 bg-white">
              {channels.map((ch) => (
                <ToggleSwitch
                  key={ch.key}
                  checked={ch.enabled}
                  onToggle={() => toggleChannel(ch.key)}
                  label={ch.label}
                />
              ))}
            </div>

            {/* Notification types */}
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
              Notification Types
            </p>
            <div className="space-y-0.5 rounded-lg border border-gray-200 bg-white">
              {notifTypes.map((nt) => (
                <ToggleSwitch
                  key={nt.key}
                  checked={nt.enabled}
                  onToggle={() => toggleNotifType(nt.key)}
                  label={nt.label}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ---- Section 4: Active Sessions ---- */}
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
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#0B2545]">
                          {session.device}
                        </p>
                        {session.current && (
                          <Badge variant="success">Current</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {session.browser} &middot; {session.lastActive}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="min-h-[44px] min-w-[44px] gap-1 text-[#B91C1C] border-[#B91C1C]/30 hover:bg-[#B91C1C]/5 hover:text-[#B91C1C]"
                      onClick={() => addToast("Session signed out", "success")}
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:inline">Sign Out</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              variant="secondary"
              className="mt-3 min-h-[44px] w-full gap-2 text-[#B91C1C] border-[#B91C1C]/30 hover:bg-[#B91C1C]/5 hover:text-[#B91C1C]"
              onClick={() => setSignOutAllDialogOpen(true)}
            >
              <LogOut className="h-4 w-4" />
              Sign Out All Devices
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* ---- Section 5: Data Management ---- */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Database className="h-5 w-5 text-[#0B2545]" />
          <h2 className="text-lg font-semibold text-[#0B2545]">
            Data Management
          </h2>
        </div>
        <Card>
          <CardContent className="space-y-3 p-4">
            <Button
              variant="secondary"
              className="w-full min-h-[44px] gap-2"
              onClick={() => addToast("Data export started — you'll receive an email shortly", "info")}
            >
              <Download className="h-4 w-4" />
              Download My Data
            </Button>
            <Button
              variant="secondary"
              className="w-full min-h-[44px] gap-2 border-[#B91C1C]/30 text-[#B91C1C] hover:bg-[#B91C1C]/5 hover:text-[#B91C1C]"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete My Account
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* ---- Confirm Dialogs ---- */}
      <ConfirmDialog
        open={consentDialogOpen}
        onOpenChange={setConsentDialogOpen}
        onConfirm={confirmConsentChange}
        title="Update Photo Consent"
        description={`Are you sure you want to change the photo consent level for ${
          childrenConsent.find((c) => c.id === consentPendingChild)?.name ?? "this child"
        }? This will take effect immediately.`}
        confirmLabel="Update Consent"
        variant="primary"
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => addToast("Account deletion requested — you will receive a confirmation email", "warning")}
        title="Delete Account"
        description="This action is permanent. All your data, including children profiles, attendance history, messages, and uploaded photos will be permanently deleted. This cannot be undone."
        confirmLabel="Delete Everything"
        variant="danger"
      />

      <ConfirmDialog
        open={signOutAllDialogOpen}
        onOpenChange={setSignOutAllDialogOpen}
        onConfirm={() => addToast("All devices signed out", "success")}
        title="Sign Out All Devices"
        description="You will be signed out of all devices except this one. You will need to sign in again on each device."
        confirmLabel="Sign Out All"
        variant="danger"
      />
    </div>
  );
}
