"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Vote,
  Calendar,
  UserPlus,
  CheckCircle2,
  Clock,
  Trophy,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

type AGMStatus = "Not Started" | "In Progress" | "Completed";
type PositionStatus = "Completed" | "Voting" | "Pending";

interface Nominee {
  id: number;
  name: string;
  statement: string;
  votes?: number;
  isWinner?: boolean;
}

interface AGMPosition {
  id: number;
  title: string;
  status: PositionStatus;
  nominees: Nominee[];
  totalVotes?: number;
}

const MOCK_POSITIONS: AGMPosition[] = [
  {
    id: 1, title: "President", status: "Completed", totalVotes: 24,
    nominees: [
      { id: 1, name: "John Henderson", statement: "I have served as President for two years and wish to continue driving the club forward with our strategic plan.", votes: 18, isWinner: true },
      { id: 2, name: "Mark Sullivan", statement: "I bring fresh ideas and corporate governance experience from my role in local council.", votes: 6 },
    ],
  },
  {
    id: 2, title: "Vice President", status: "Completed", totalVotes: 23,
    nominees: [
      { id: 3, name: "Maria Santos", statement: "As current VP, I have established strong relationships with Football West and local sponsors.", votes: 23, isWinner: true },
    ],
  },
  {
    id: 3, title: "Secretary", status: "Completed", totalVotes: 22,
    nominees: [
      { id: 4, name: "Andrew Tran", statement: "I have streamlined our documentation and meeting processes over the past year.", votes: 15, isWinner: true },
      { id: 5, name: "Priya Sharma", statement: "With my background in administration, I can bring efficiency and organisation to the role.", votes: 7 },
    ],
  },
  {
    id: 4, title: "Treasurer", status: "Voting", totalVotes: 12,
    nominees: [
      { id: 6, name: "Rebecca Clarke", statement: "I have managed the club's finances for three years and implemented transparent reporting.", votes: 5 },
      { id: 7, name: "Daniel Cooper", statement: "As a qualified accountant, I will bring professional financial management to the club.", votes: 7 },
    ],
  },
  { id: 5, title: "Registrar", status: "Pending", nominees: [{ id: 8, name: "David Kim", statement: "Continuing to modernise our registration processes.", votes: 0 }] },
  { id: 6, title: "Development Officer", status: "Pending", nominees: [{ id: 9, name: "Sarah Mitchell", statement: "Focused on coach education and player pathways.", votes: 0 }] },
  { id: 7, title: "Communications Officer", status: "Pending", nominees: [] },
  { id: 8, title: "Sponsorship Coordinator", status: "Pending", nominees: [{ id: 10, name: "Lisa Patel", statement: "Will continue growing sponsor partnerships.", votes: 0 }] },
  { id: 9, title: "General Committee Member 1", status: "Pending", nominees: [] },
  { id: 10, title: "General Committee Member 2", status: "Pending", nominees: [] },
];

const agmStatus: AGMStatus = "In Progress";
const agmDate = "2026-11-14";

/* ------------------------------------------------------------------ */
/*  Position Card                                                      */
/* ------------------------------------------------------------------ */

function PositionCard({ position }: { position: AGMPosition }) {
  const [showWalkIn, setShowWalkIn] = useState(false);

  const maxVotes = Math.max(...position.nominees.map((n) => n.votes || 0), 1);

  return (
    <Card className={cn(
      "overflow-hidden",
      position.status === "Voting" && "border-[#1D4ED8] border-2",
      position.status === "Completed" && "border-[#15803D]/30"
    )}>
      <CardHeader className={cn(
        "pb-3",
        position.status === "Voting" && "bg-blue-50/50",
        position.status === "Completed" && "bg-green-50/30"
      )}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{position.title}</CardTitle>
          {position.status === "Completed" && (
            <Badge variant="success">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Completed
            </Badge>
          )}
          {position.status === "Voting" && (
            <Badge variant="info">
              <Vote className="mr-1 h-3 w-3" />
              Now Voting
            </Badge>
          )}
          {position.status === "Pending" && (
            <Badge>
              <Clock className="mr-1 h-3 w-3" />
              Pending
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {position.nominees.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">No nominees yet</p>
        ) : (
          position.nominees.map((nominee) => (
            <div
              key={nominee.id}
              className={cn(
                "rounded-lg border p-3",
                nominee.isWinner && "border-[#15803D]/30 bg-green-50/30",
                position.status === "Voting" && "border-gray-200"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
                    nominee.isWinner ? "bg-[#15803D]" : "bg-[#0B2545]"
                  )}>
                    {nominee.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#0B2545]">{nominee.name}</p>
                      {nominee.isWinner && (
                        <Trophy className="h-4 w-4 text-[#15803D]" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{nominee.statement}</p>
                  </div>
                </div>
              </div>

              {/* Vote bar */}
              {(position.status === "Voting" || position.status === "Completed") && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{nominee.votes} votes</span>
                    {position.totalVotes && position.totalVotes > 0 && (
                      <span className="font-medium text-[#0B2545]">
                        {Math.round(((nominee.votes || 0) / position.totalVotes) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        nominee.isWinner ? "bg-[#15803D]" : "bg-[#1D4ED8]"
                      )}
                      style={{ width: `${Math.max(((nominee.votes || 0) / maxVotes) * 100, 2)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Cast Vote button */}
              {position.status === "Voting" && (
                <div className="mt-2">
                  <Button variant="accent" size="sm" className="w-full">
                    Cast Vote
                  </Button>
                </div>
              )}
            </div>
          ))
        )}

        {/* Voting controls */}
        {position.status === "Voting" && (
          <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3">
            <Button variant="danger" size="sm">
              Close Voting for This Position
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowWalkIn(!showWalkIn)}
            >
              <UserPlus className="mr-1.5 h-3.5 w-3.5" />
              Add Walk-in Nominee
            </Button>
          </div>
        )}

        {/* Walk-in form */}
        {showWalkIn && (
          <div className="space-y-2 rounded-lg bg-gray-50 p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#0B2545]">Walk-in Nomination</p>
              <button onClick={() => setShowWalkIn(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <Input placeholder="Nominee name" />
            <textarea
              placeholder="Brief statement..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30"
              rows={2}
            />
            <Button variant="accent" size="sm">Add Nominee</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AGMPage() {
  const completed = MOCK_POSITIONS.filter((p) => p.status === "Completed");
  const voting = MOCK_POSITIONS.filter((p) => p.status === "Voting");
  const pending = MOCK_POSITIONS.filter((p) => p.status === "Pending");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0B2545]">Annual General Meeting</h2>
          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
            <Calendar className="h-3.5 w-3.5" />
            {agmDate}
          </p>
        </div>
        <Badge
          variant={agmStatus === "In Progress" ? "info" : agmStatus === "Completed" ? "success" : "default"}
          className="text-sm px-3 py-1"
        >
          {agmStatus}
        </Badge>
      </div>

      {/* Pre-AGM controls */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#0B2545]">AGM Controls</p>
            <p className="text-xs text-gray-500">
              {completed.length} of {MOCK_POSITIONS.length} positions elected
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <Calendar className="mr-1.5 h-3.5 w-3.5" />
              Set AGM Date
            </Button>
            <Button variant="accent" size="sm">Open Nominations</Button>
          </div>
        </CardContent>
      </Card>

      {/* Currently Voting */}
      {voting.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1D4ED8]">
            <Vote className="h-4 w-4" />
            Currently Voting
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {voting.map((p) => (
              <PositionCard key={p.id} position={p} />
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#15803D]">
            <CheckCircle2 className="h-4 w-4" />
            Elected Positions ({completed.length})
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {completed.map((p) => (
              <PositionCard key={p.id} position={p} />
            ))}
          </div>
        </div>
      )}

      {/* Pending */}
      {pending.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-500">
            <Clock className="h-4 w-4" />
            Pending Positions ({pending.length})
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pending.map((p) => (
              <PositionCard key={p.id} position={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
