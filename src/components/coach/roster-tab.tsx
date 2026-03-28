"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  X,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Player {
  id: string;
  jerseyNumber: number;
  name: string;
  age: number;
  position: string;
  medicalAlert: boolean;
  medicalNote?: string;
  rsvpStatus: "confirmed" | "maybe" | "unavailable" | "pending";
  parentName: string;
  parentPhone: string;
}

const MOCK_PLAYERS: Player[] = [
  {
    id: "p1",
    jerseyNumber: 1,
    name: "Liam Johnson",
    age: 8,
    position: "Goalkeeper",
    medicalAlert: false,
    rsvpStatus: "confirmed",
    parentName: "Sarah Johnson",
    parentPhone: "0412 345 678",
  },
  {
    id: "p2",
    jerseyNumber: 5,
    name: "Noah Williams",
    age: 9,
    position: "Defender",
    medicalAlert: true,
    medicalNote: "Asthma - carries puffer",
    rsvpStatus: "confirmed",
    parentName: "Mark Williams",
    parentPhone: "0423 456 789",
  },
  {
    id: "p3",
    jerseyNumber: 7,
    name: "Oliver Smith",
    age: 8,
    position: "Midfielder",
    medicalAlert: false,
    rsvpStatus: "maybe",
    parentName: "Jenny Smith",
    parentPhone: "0434 567 890",
  },
  {
    id: "p4",
    jerseyNumber: 9,
    name: "Ethan Brown",
    age: 9,
    position: "Forward",
    medicalAlert: false,
    rsvpStatus: "unavailable",
    parentName: "David Brown",
    parentPhone: "0445 678 901",
  },
  {
    id: "p5",
    jerseyNumber: 3,
    name: "Lucas Davis",
    age: 8,
    position: "Defender",
    medicalAlert: true,
    medicalNote: "Bee sting allergy - EpiPen in bag",
    rsvpStatus: "confirmed",
    parentName: "Karen Davis",
    parentPhone: "0456 789 012",
  },
  {
    id: "p6",
    jerseyNumber: 11,
    name: "Jack Wilson",
    age: 9,
    position: "Forward",
    medicalAlert: false,
    rsvpStatus: "pending",
    parentName: "Tom Wilson",
    parentPhone: "0467 890 123",
  },
];

function RsvpBadge({ status }: { status: Player["rsvpStatus"] }) {
  const config = {
    confirmed: { variant: "success" as const, label: "Available", Icon: CheckCircle },
    maybe: { variant: "warning" as const, label: "Maybe", Icon: HelpCircle },
    unavailable: { variant: "danger" as const, label: "Unavailable", Icon: X },
    pending: { variant: "default" as const, label: "No Reply", Icon: HelpCircle },
  }[status];

  return (
    <Badge variant={config.variant} className="gap-1">
      <config.Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

export function RosterTab() {
  const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(
    null
  );

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {MOCK_PLAYERS.length} players registered
        </p>
        <Button variant="secondary" size="sm">
          + Add Player
        </Button>
      </div>

      {/* Player card grid */}
      <div className="grid gap-3 md:grid-cols-2">
        {MOCK_PLAYERS.map((player) => (
          <button
            key={player.id}
            type="button"
            className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]/40 rounded-lg"
            onClick={() => setSelectedPlayer(player)}
          >
            <Card className="cursor-pointer transition-all hover:shadow-md active:scale-[0.98] h-full">
              <CardContent className="flex items-center gap-4 p-4">
                {/* Jersey number circle */}
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold",
                    "bg-[#0B2545] text-white"
                  )}
                >
                  {player.jerseyNumber}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold text-[#0B2545]">
                      {player.name}
                    </span>
                    {player.medicalAlert && (
                      <AlertTriangle className="h-4 w-4 shrink-0 text-[#B45309]" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Age {player.age} &middot; {player.position}
                  </p>
                  <div className="mt-1.5">
                    <RsvpBadge status={player.rsvpStatus} />
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 shrink-0 text-gray-300" />
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      {/* Player detail drawer / dialog */}
      <Dialog
        open={selectedPlayer !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedPlayer(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          {selectedPlayer && (
            <>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0B2545] text-2xl font-bold text-white">
                  {selectedPlayer.jerseyNumber}
                </div>
                <div>
                  <DialogTitle>{selectedPlayer.name}</DialogTitle>
                  <DialogDescription>
                    Age {selectedPlayer.age} &middot;{" "}
                    {selectedPlayer.position}
                  </DialogDescription>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {/* RSVP */}
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                    RSVP Status (Next Event)
                  </p>
                  <RsvpBadge status={selectedPlayer.rsvpStatus} />
                </div>

                {/* Medical */}
                {selectedPlayer.medicalAlert && (
                  <div className="rounded-lg border border-[#B45309]/30 bg-[#FFFBEB] p-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#B45309]">
                      <AlertTriangle className="h-4 w-4" />
                      Medical Alert
                    </div>
                    <p className="mt-1 text-sm text-[#92400E]">
                      {selectedPlayer.medicalNote}
                    </p>
                  </div>
                )}

                {/* Parent contact */}
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                    Parent / Guardian
                  </p>
                  <p className="text-sm font-medium text-[#0B2545]">
                    {selectedPlayer.parentName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedPlayer.parentPhone}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button variant="accent" size="lg" className="flex-1 min-h-[44px]">
                  Message Parent
                </Button>
                <Button variant="secondary" size="lg" className="flex-1 min-h-[44px]">
                  Edit Player
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
