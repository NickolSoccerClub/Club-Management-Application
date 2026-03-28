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
import { Badge } from "@/components/ui/badge";
import { useToastStore } from "@/lib/stores/toast-store";
import { Settings } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AgeGroupCap {
  ageGroup: string;
  maxPerTeam: number;
  currentTeams: number;
  totalPlayers: number;
}

interface AgeGroupSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caps: AgeGroupCap[];
  onSave: (caps: AgeGroupCap[]) => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AgeGroupSettings({ open, onOpenChange, caps, onSave }: AgeGroupSettingsProps) {
  const [localCaps, setLocalCaps] = useState<AgeGroupCap[]>(caps);
  const addToast = useToastStore((s) => s.addToast);

  const updateCap = (ageGroup: string, maxPerTeam: number) => {
    setLocalCaps((prev) =>
      prev.map((c) => (c.ageGroup === ageGroup ? { ...c, maxPerTeam } : c))
    );
  };

  const handleSave = () => {
    onSave(localCaps);
    addToast("Age group settings saved", "success");
    onOpenChange(false);
  };

  // Reset local state when dialog opens
  React.useEffect(() => {
    if (open) setLocalCaps(caps);
  }, [open, caps]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-[#1D4ED8]" />
          Age Group Settings
        </DialogTitle>
        <DialogDescription>
          Configure the maximum number of players per team for each age group. Teams will be auto-created when registrations exceed capacity.
        </DialogDescription>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase text-gray-500">
                <th className="pb-3 pr-4">Age Group</th>
                <th className="pb-3 pr-4">Max Per Team</th>
                <th className="pb-3 pr-4">Current Teams</th>
                <th className="pb-3 pr-4">Total Players</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {localCaps.map((cap) => {
                const neededTeams = Math.ceil(cap.totalPlayers / cap.maxPerTeam);
                const overflow = neededTeams > cap.currentTeams;
                return (
                  <tr key={cap.ageGroup} className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-medium text-[#0B2545]">{cap.ageGroup}</td>
                    <td className="py-3 pr-4">
                      <Input
                        type="number"
                        value={cap.maxPerTeam}
                        onChange={(e) => updateCap(cap.ageGroup, Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 h-8 text-center"
                      />
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{cap.currentTeams}</td>
                    <td className="py-3 pr-4 text-gray-600">{cap.totalPlayers}</td>
                    <td className="py-3">
                      {overflow ? (
                        <Badge variant="warning">Need {neededTeams - cap.currentTeams} more team(s)</Badge>
                      ) : (
                        <Badge variant="success">OK</Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <DialogFooter>
          <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="accent" size="sm" onClick={handleSave}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
