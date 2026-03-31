"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SkeletonTable } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/committee/shared/page-header";
import { Pagination } from "@/components/committee/shared/pagination";
import { EmptyState } from "@/components/committee/shared/empty-state";
import { PlayerDetailPanel, type PlayerFull } from "@/components/committee/registrar/player-detail-panel";
import { AddPlayerDialog } from "@/components/committee/registrar/add-player-dialog";
import { ImportPlayersDialog } from "@/components/committee/registrar/import-players-dialog";
import { useToastStore } from "@/lib/stores/toast-store";
import {
  Upload,
  Download,
  UserPlus,
  Search,
  Trash2,
  CheckCircle2,
  Users,
  X,
  Plus,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data — 50 realistic Australian players                        */
/* ------------------------------------------------------------------ */

type PlayerStatus = "Registered" | "EOI" | "Pending";

const MOCK_PLAYERS: PlayerFull[] = [
  { id: 1, firstName: "Liam", lastName: "Carter", dob: "15/03/2019", ageGroup: "U7", team: "Sharks", status: "Registered", ffaNumber: "FFA-20260001", guardianName: "Mary Carter", guardianEmail: "m.carter@email.com", guardianPhone: "0412 345 678", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "15 Jan 2026", position: "Forward", gradeScore: 5.4 },
  { id: 2, firstName: "Olivia", lastName: "Bennett", dob: "22/07/2017", ageGroup: "U9", team: "Dolphins", status: "Registered", ffaNumber: "FFA-20260002", guardianName: "Jane Bennett", guardianEmail: "j.bennett@email.com", guardianPhone: "0423 456 789", medicalNotes: "Mild asthma — carries inhaler", photoConsent: "Public Website", registeredDate: "16 Jan 2026", position: "Forward", gradeScore: 6.8 },
  { id: 3, firstName: "Noah", lastName: "Patel", dob: "03/11/2012", ageGroup: "U14", team: "Unallocated", status: "EOI", ffaNumber: "FFA-20260003", guardianName: "Sanjay Patel", guardianEmail: "s.patel@email.com", guardianPhone: "0434 567 890", medicalNotes: "None", photoConsent: "None", registeredDate: "—", position: "Defender", gradeScore: 7.5 },
  { id: 4, firstName: "Emma", lastName: "Nguyen", dob: "18/05/2014", ageGroup: "U12", team: "Sharks", status: "Registered", ffaNumber: "FFA-20260004", guardianName: "Tran Nguyen", guardianEmail: "t.nguyen@email.com", guardianPhone: "0445 678 901", medicalNotes: "Allergy to bee stings — EpiPen in kit bag", photoConsent: "Internal Only", registeredDate: "17 Jan 2026", position: "GK", gradeScore: 8.1 },
  { id: 5, firstName: "Oliver", lastName: "Smith", dob: "29/01/2010", ageGroup: "U16", team: "Thunder", status: "Pending", ffaNumber: "FFA-20260005", guardianName: "Andrew Smith", guardianEmail: "a.smith@email.com", guardianPhone: "0456 789 012", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "—", position: "Midfielder", gradeScore: 6.5 },
  { id: 6, firstName: "Charlotte", lastName: "Jones", dob: "11/09/2016", ageGroup: "U10", team: "Dolphins", status: "Registered", ffaNumber: "FFA-20260006", guardianName: "Rachel Jones", guardianEmail: "r.jones@email.com", guardianPhone: "0467 890 123", medicalNotes: "None", photoConsent: "Public Website", registeredDate: "18 Jan 2026", position: "Defender", gradeScore: 7.0 },
  { id: 7, firstName: "William", lastName: "Brown", dob: "25/04/2012", ageGroup: "U14", team: "Eagles", status: "Registered", ffaNumber: "FFA-20260007", guardianName: "Karen Brown", guardianEmail: "k.brown@email.com", guardianPhone: "0478 901 234", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "19 Jan 2026", position: "Forward", gradeScore: 8.3 },
  { id: 8, firstName: "Amelia", lastName: "Wilson", dob: "07/12/2014", ageGroup: "U12", team: "Unallocated", status: "EOI", ffaNumber: "FFA-20260008", guardianName: "David Wilson", guardianEmail: "d.wilson@email.com", guardianPhone: "0489 012 345", medicalNotes: "Diabetes Type 1 — insulin pump", photoConsent: "None", registeredDate: "—", position: "Midfielder", gradeScore: 6.9 },
  { id: 9, firstName: "James", lastName: "Taylor", dob: "14/08/2010", ageGroup: "U16", team: "Thunder", status: "Registered", ffaNumber: "FFA-20260009", guardianName: "Peter Taylor", guardianEmail: "p.taylor@email.com", guardianPhone: "0490 123 456", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "20 Jan 2026", position: "Defender", gradeScore: 7.8 },
  { id: 10, firstName: "Sophia", lastName: "Anderson", dob: "02/06/2016", ageGroup: "U10", team: "Dolphins", status: "Pending", ffaNumber: "FFA-20260010", guardianName: "Lisa Anderson", guardianEmail: "l.anderson@email.com", guardianPhone: "0401 234 567", medicalNotes: "None", photoConsent: "Internal Only", registeredDate: "—", position: "Forward", gradeScore: 6.2 },
  { id: 11, firstName: "Lucas", lastName: "Thomas", dob: "02/06/2014", ageGroup: "U12", team: "Sharks", status: "Registered", ffaNumber: "FFA-20260011", guardianName: "Mark Thomas", guardianEmail: "m.thomas@email.com", guardianPhone: "0412 345 111", medicalNotes: "None", photoConsent: "Public Website", registeredDate: "21 Jan 2026", position: "Midfielder", gradeScore: 7.4 },
  { id: 12, firstName: "Mia", lastName: "Jackson", dob: "19/10/2012", ageGroup: "U14", team: "Eagles", status: "Registered", ffaNumber: "FFA-20260012", guardianName: "Chris Jackson", guardianEmail: "c.jackson@email.com", guardianPhone: "0423 456 222", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "22 Jan 2026", position: "Defender", gradeScore: 7.1 },
  { id: 13, firstName: "Henry", lastName: "White", dob: "08/03/2017", ageGroup: "U9", team: "Unallocated", status: "EOI", ffaNumber: "FFA-20260013", guardianName: "James White", guardianEmail: "j.white@email.com", guardianPhone: "0434 567 333", medicalNotes: "None", photoConsent: "None", registeredDate: "—", position: "GK", gradeScore: 5.8 },
  { id: 14, firstName: "Harper", lastName: "Harris", dob: "26/12/2010", ageGroup: "U16", team: "Titans", status: "Registered", ffaNumber: "FFA-20260014", guardianName: "Beth Harris", guardianEmail: "b.harris@email.com", guardianPhone: "0445 678 444", medicalNotes: "None", photoConsent: "Public Website", registeredDate: "23 Jan 2026", position: "Forward", gradeScore: 8.0 },
  { id: 15, firstName: "Alexander", lastName: "Martin", dob: "13/09/2014", ageGroup: "U12", team: "Hawks", status: "Pending", ffaNumber: "FFA-20260015", guardianName: "Nicole Martin", guardianEmail: "n.martin@email.com", guardianPhone: "0456 789 555", medicalNotes: "None", photoConsent: "Internal Only", registeredDate: "—", position: "Defender", gradeScore: 6.7 },
  { id: 16, firstName: "Evelyn", lastName: "Garcia", dob: "05/07/2012", ageGroup: "U14", team: "Wolves", status: "Registered", ffaNumber: "FFA-20260016", guardianName: "Ricardo Garcia", guardianEmail: "r.garcia@email.com", guardianPhone: "0467 890 666", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "24 Jan 2026", position: "Midfielder", gradeScore: 7.6 },
  { id: 17, firstName: "Benjamin", lastName: "Martinez", dob: "21/01/2016", ageGroup: "U10", team: "Dolphins", status: "Registered", ffaNumber: "FFA-20260017", guardianName: "Gloria Martinez", guardianEmail: "g.martinez@email.com", guardianPhone: "0478 901 777", medicalNotes: "None", photoConsent: "Public Website", registeredDate: "25 Jan 2026", position: "Midfielder", gradeScore: 6.4 },
  { id: 18, firstName: "Abigail", lastName: "Robinson", dob: "16/04/2014", ageGroup: "U12", team: "Unallocated", status: "EOI", ffaNumber: "FFA-20260018", guardianName: "Frank Robinson", guardianEmail: "f.robinson@email.com", guardianPhone: "0489 012 888", medicalNotes: "None", photoConsent: "None", registeredDate: "—", position: "Forward", gradeScore: 7.3 },
  { id: 19, firstName: "Jack", lastName: "Clark", dob: "10/11/2010", ageGroup: "U16", team: "Storm", status: "Registered", ffaNumber: "FFA-20260019", guardianName: "Helen Clark", guardianEmail: "h.clark@email.com", guardianPhone: "0490 123 999", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "26 Jan 2026", position: "GK", gradeScore: 8.5 },
  { id: 20, firstName: "Emily", lastName: "Lewis", dob: "28/06/2012", ageGroup: "U14", team: "Eagles", status: "Pending", ffaNumber: "FFA-20260020", guardianName: "Wayne Lewis", guardianEmail: "w.lewis@email.com", guardianPhone: "0401 234 000", medicalNotes: "Knee brace — right knee", photoConsent: "Internal Only", registeredDate: "—", position: "Defender", gradeScore: 7.0 },
  { id: 21, firstName: "Cooper", lastName: "Murray", dob: "12/02/2019", ageGroup: "U7", team: "Lightning", status: "Registered", ffaNumber: "FFA-20260021", guardianName: "Sharon Murray", guardianEmail: "s.murray@email.com", guardianPhone: "0412 111 222", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "27 Jan 2026", position: "Forward", gradeScore: 5.0 },
  { id: 22, firstName: "Isla", lastName: "Campbell", dob: "04/08/2017", ageGroup: "U9", team: "Blaze", status: "Registered", ffaNumber: "FFA-20260022", guardianName: "Greg Campbell", guardianEmail: "g.campbell@email.com", guardianPhone: "0423 222 333", medicalNotes: "None", photoConsent: "Public Website", registeredDate: "28 Jan 2026", position: "Midfielder", gradeScore: 6.0 },
  { id: 23, firstName: "Ethan", lastName: "Mitchell", dob: "17/05/2015", ageGroup: "U11", team: "Hawks", status: "Registered", ffaNumber: "FFA-20260023", guardianName: "Dawn Mitchell", guardianEmail: "d.mitchell@email.com", guardianPhone: "0434 333 444", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "29 Jan 2026", position: "Defender", gradeScore: 7.2 },
  { id: 24, firstName: "Chloe", lastName: "Thompson", dob: "09/11/2013", ageGroup: "U13", team: "Wolves", status: "Registered", ffaNumber: "FFA-20260024", guardianName: "Ian Thompson", guardianEmail: "i.thompson@email.com", guardianPhone: "0445 444 555", medicalNotes: "None", photoConsent: "Internal Only", registeredDate: "30 Jan 2026", position: "Forward", gradeScore: 8.4 },
  { id: 25, firstName: "Riley", lastName: "O'Brien", dob: "23/03/2015", ageGroup: "U11", team: "Unallocated", status: "EOI", ffaNumber: "FFA-20260025", guardianName: "Fiona O'Brien", guardianEmail: "f.obrien@email.com", guardianPhone: "0456 555 666", medicalNotes: "Asthma — Ventolin inhaler", photoConsent: "None", registeredDate: "—", position: "Midfielder", gradeScore: 6.6 },
  { id: 26, firstName: "Zoe", lastName: "Kelly", dob: "30/07/2019", ageGroup: "U7", team: "Sharks", status: "Registered", ffaNumber: "FFA-20260026", guardianName: "Brian Kelly", guardianEmail: "b.kelly@email.com", guardianPhone: "0467 666 777", medicalNotes: "None", photoConsent: "Public Website", registeredDate: "31 Jan 2026", position: "Midfielder", gradeScore: 5.2 },
  { id: 27, firstName: "Max", lastName: "Sullivan", dob: "14/01/2013", ageGroup: "U13", team: "Storm", status: "Registered", ffaNumber: "FFA-20260027", guardianName: "Tanya Sullivan", guardianEmail: "t.sullivan@email.com", guardianPhone: "0478 777 888", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "01 Feb 2026", position: "GK", gradeScore: 7.9 },
  { id: 28, firstName: "Grace", lastName: "Wright", dob: "06/09/2016", ageGroup: "U10", team: "Blaze", status: "Pending", ffaNumber: "FFA-20260028", guardianName: "Paul Wright", guardianEmail: "p.wright@email.com", guardianPhone: "0489 888 999", medicalNotes: "None", photoConsent: "Internal Only", registeredDate: "—", position: "Defender", gradeScore: 6.1 },
  { id: 29, firstName: "Thomas", lastName: "Walker", dob: "20/04/2011", ageGroup: "U15", team: "Titans", status: "Registered", ffaNumber: "FFA-20260029", guardianName: "Denise Walker", guardianEmail: "d.walker@email.com", guardianPhone: "0490 999 000", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "02 Feb 2026", position: "Forward", gradeScore: 8.8 },
  { id: 30, firstName: "Ava", lastName: "Ryan", dob: "11/12/2015", ageGroup: "U11", team: "Hawks", status: "Registered", ffaNumber: "FFA-20260030", guardianName: "Kevin Ryan", guardianEmail: "k.ryan@email.com", guardianPhone: "0401 000 111", medicalNotes: "None", photoConsent: "Public Website", registeredDate: "03 Feb 2026", position: "Midfielder", gradeScore: 7.5 },
  { id: 31, firstName: "Sebastian", lastName: "Hughes", dob: "07/06/2019", ageGroup: "U7", team: "Lightning", status: "Pending", ffaNumber: "FFA-20260031", guardianName: "Mandy Hughes", guardianEmail: "m.hughes@email.com", guardianPhone: "0412 222 333", medicalNotes: "Peanut allergy — EpiPen required", photoConsent: "None", registeredDate: "—", position: "Forward", gradeScore: 5.6 },
  { id: 32, firstName: "Ruby", lastName: "Evans", dob: "25/10/2013", ageGroup: "U13", team: "Wolves", status: "EOI", ffaNumber: "FFA-20260032", guardianName: "Derek Evans", guardianEmail: "d.evans@email.com", guardianPhone: "0423 333 444", medicalNotes: "None", photoConsent: "None", registeredDate: "—", position: "Defender", gradeScore: 7.7 },
  { id: 33, firstName: "Charlie", lastName: "Hall", dob: "19/02/2011", ageGroup: "U15", team: "Storm", status: "Registered", ffaNumber: "FFA-20260033", guardianName: "Wendy Hall", guardianEmail: "w.hall@email.com", guardianPhone: "0434 444 555", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "04 Feb 2026", position: "Midfielder", gradeScore: 8.0 },
  { id: 34, firstName: "Lily", lastName: "Green", dob: "03/08/2017", ageGroup: "U9", team: "Blaze", status: "Registered", ffaNumber: "FFA-20260034", guardianName: "Simon Green", guardianEmail: "s.green@email.com", guardianPhone: "0445 555 666", medicalNotes: "None", photoConsent: "Public Website", registeredDate: "05 Feb 2026", position: "Forward", gradeScore: 6.3 },
  { id: 35, firstName: "Harrison", lastName: "King", dob: "28/05/2014", ageGroup: "U12", team: "Sharks", status: "Registered", ffaNumber: "FFA-20260035", guardianName: "Joanne King", guardianEmail: "j.king@email.com", guardianPhone: "0456 666 777", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "06 Feb 2026", position: "GK", gradeScore: 7.8 },
  { id: 36, firstName: "Matilda", lastName: "Baker", dob: "15/11/2015", ageGroup: "U11", team: "Unallocated", status: "EOI", ffaNumber: "FFA-20260036", guardianName: "Craig Baker", guardianEmail: "c.baker@email.com", guardianPhone: "0467 777 888", medicalNotes: "None", photoConsent: "None", registeredDate: "—", position: "Midfielder", gradeScore: 6.8 },
  { id: 37, firstName: "Archer", lastName: "Ward", dob: "22/09/2010", ageGroup: "U16", team: "Titans", status: "Registered", ffaNumber: "FFA-20260037", guardianName: "Louise Ward", guardianEmail: "l.ward@email.com", guardianPhone: "0478 888 999", medicalNotes: "None", photoConsent: "Internal Only", registeredDate: "07 Feb 2026", position: "Defender", gradeScore: 9.0 },
  { id: 38, firstName: "Sienna", lastName: "Watson", dob: "01/04/2012", ageGroup: "U14", team: "Eagles", status: "Registered", ffaNumber: "FFA-20260038", guardianName: "Nathan Watson", guardianEmail: "n.watson@email.com", guardianPhone: "0489 999 000", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "08 Feb 2026", position: "Forward", gradeScore: 8.6 },
  { id: 39, firstName: "Leo", lastName: "Brooks", dob: "16/01/2019", ageGroup: "U7", team: "Lightning", status: "Registered", ffaNumber: "FFA-20260039", guardianName: "Tracey Brooks", guardianEmail: "t.brooks@email.com", guardianPhone: "0490 000 111", medicalNotes: "None", photoConsent: "Public Website", registeredDate: "09 Feb 2026", position: "Midfielder", gradeScore: 5.2 },
  { id: 40, firstName: "Willow", lastName: "Stewart", dob: "08/07/2013", ageGroup: "U13", team: "Wolves", status: "Pending", ffaNumber: "FFA-20260040", guardianName: "Bruce Stewart", guardianEmail: "b.stewart@email.com", guardianPhone: "0401 111 222", medicalNotes: "None", photoConsent: "Internal Only", registeredDate: "—", position: "Defender", gradeScore: 7.3 },
  { id: 41, firstName: "Oscar", lastName: "Murphy", dob: "29/03/2011", ageGroup: "U15", team: "Storm", status: "Registered", ffaNumber: "FFA-20260041", guardianName: "Linda Murphy", guardianEmail: "l.murphy@email.com", guardianPhone: "0412 333 444", medicalNotes: "Contact lenses — spare pair in bag", photoConsent: "Social Media", registeredDate: "10 Feb 2026", position: "Forward", gradeScore: 9.2 },
  { id: 42, firstName: "Phoebe", lastName: "Cook", dob: "13/10/2017", ageGroup: "U9", team: "Blaze", status: "EOI", ffaNumber: "FFA-20260042", guardianName: "Adam Cook", guardianEmail: "a.cook@email.com", guardianPhone: "0423 444 555", medicalNotes: "None", photoConsent: "None", registeredDate: "—", position: "GK", gradeScore: 5.8 },
  { id: 43, firstName: "Hugo", lastName: "Morgan", dob: "05/12/2016", ageGroup: "U10", team: "Dolphins", status: "Registered", ffaNumber: "FFA-20260043", guardianName: "Kelly Morgan", guardianEmail: "k.morgan@email.com", guardianPhone: "0434 555 666", medicalNotes: "None", photoConsent: "Public Website", registeredDate: "11 Feb 2026", position: "Defender", gradeScore: 6.6 },
  { id: 44, firstName: "Ivy", lastName: "Bell", dob: "20/02/2014", ageGroup: "U12", team: "Hawks", status: "Registered", ffaNumber: "FFA-20260044", guardianName: "Steve Bell", guardianEmail: "s.bell@email.com", guardianPhone: "0445 666 777", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "12 Feb 2026", position: "Midfielder", gradeScore: 7.6 },
  { id: 45, firstName: "Finn", lastName: "Collins", dob: "18/06/2015", ageGroup: "U11", team: "Unallocated", status: "EOI", ffaNumber: "FFA-20260045", guardianName: "Paula Collins", guardianEmail: "p.collins@email.com", guardianPhone: "0456 777 888", medicalNotes: "None", photoConsent: "None", registeredDate: "—", position: "Forward", gradeScore: 6.4 },
  { id: 46, firstName: "Ella", lastName: "Reed", dob: "24/08/2010", ageGroup: "U16", team: "Titans", status: "Pending", ffaNumber: "FFA-20260046", guardianName: "Jason Reed", guardianEmail: "j.reed@email.com", guardianPhone: "0467 888 999", medicalNotes: "None", photoConsent: "Internal Only", registeredDate: "—", position: "Midfielder", gradeScore: 7.4 },
  { id: 47, firstName: "Lachlan", lastName: "Scott", dob: "10/04/2013", ageGroup: "U13", team: "Storm", status: "Registered", ffaNumber: "FFA-20260047", guardianName: "Diane Scott", guardianEmail: "d.scott@email.com", guardianPhone: "0478 999 000", medicalNotes: "None", photoConsent: "Social Media", registeredDate: "13 Feb 2026", position: "GK", gradeScore: 8.2 },
  { id: 48, firstName: "Scarlett", lastName: "Turner", dob: "02/01/2019", ageGroup: "U7", team: "Sharks", status: "Registered", ffaNumber: "FFA-20260048", guardianName: "Rob Turner", guardianEmail: "r.turner@email.com", guardianPhone: "0489 000 111", medicalNotes: "None", photoConsent: "Public Website", registeredDate: "14 Feb 2026", position: "Forward", gradeScore: 5.0 },
  { id: 49, firstName: "Jasper", lastName: "Phillips", dob: "27/09/2011", ageGroup: "U15", team: "Titans", status: "Pending", ffaNumber: "FFA-20260049", guardianName: "Mel Phillips", guardianEmail: "m.phillips@email.com", guardianPhone: "0490 111 222", medicalNotes: "Glasses — wears sports strap", photoConsent: "Internal Only", registeredDate: "—", position: "Defender", gradeScore: 7.0 },
  { id: 50, firstName: "Poppy", lastName: "Adams", dob: "14/05/2012", ageGroup: "U14", team: "Unallocated", status: "EOI", ffaNumber: "FFA-20260050", guardianName: "Gary Adams", guardianEmail: "g.adams@email.com", guardianPhone: "0401 222 333", medicalNotes: "None", photoConsent: "None", registeredDate: "—", position: "Midfielder", gradeScore: 9.5 },
];

const STATUS_VARIANT: Record<PlayerStatus, "success" | "info" | "warning"> = {
  Registered: "success",
  EOI: "info",
  Pending: "warning",
};

const AGE_GROUPS = ["All", "U7", "U9", "U10", "U11", "U12", "U13", "U14", "U15", "U16"];
const STATUSES = ["All", "Registered", "EOI", "Pending"];
const SORT_OPTIONS = [
  { label: "Name (A-Z)", value: "name-asc" },
  { label: "Name (Z-A)", value: "name-desc" },
  { label: "Grade (Highest First)", value: "grade-desc" },
  { label: "Grade (Lowest First)", value: "grade-asc" },
  { label: "Age Group", value: "age-group" },
];

const ageGroupOptions = AGE_GROUPS.map((ag) => ({ label: ag, value: ag }));
const statusOptions = STATUSES.map((s) => ({ label: s, value: s }));

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function toFivePoint(score10: number): number {
  return score10 / 2;
}

function gradeLabel(score5: number): string {
  if (score5 >= 4.0) return "Expert";
  if (score5 >= 3.0) return "Competent";
  if (score5 >= 2.0) return "Developing";
  return "Basic";
}

function gradeBadgeVariant(score5: number): "success" | "info" | "warning" | "danger" {
  if (score5 >= 4.0) return "success";
  if (score5 >= 3.0) return "info";
  if (score5 >= 2.0) return "warning";
  return "danger";
}

/** Generate a consistent colour from initials */
const AVATAR_COLORS = [
  "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500",
  "bg-violet-500", "bg-cyan-500", "bg-orange-500", "bg-teal-500",
  "bg-pink-500", "bg-indigo-500",
];

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function sortLabelFor(value: string): string {
  const opt = SORT_OPTIONS.find((o) => o.value === value);
  return opt ? opt.label : "";
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PlayerManagementPage() {
  const [search, setSearch] = useState("");
  const [ageFilter, setAgeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<PlayerFull | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [detailPlayer, setDetailPlayer] = useState<PlayerFull | null>(null);
  const [convertOpen, setConvertOpen] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const perPage = 50;

  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const result = MOCK_PLAYERS.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        p.guardianEmail.toLowerCase().includes(q);
      const matchAge = ageFilter === "All" || p.ageGroup === ageFilter;
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      return matchSearch && matchAge && matchStatus;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case "name-desc":
          return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
        case "grade-desc":
          return b.gradeScore - a.gradeScore;
        case "grade-asc":
          return a.gradeScore - b.gradeScore;
        case "age-group":
          return a.ageGroup.localeCompare(b.ageGroup);
        default:
          return 0;
      }
    });

    return result;
  }, [search, ageFilter, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  /* Selection handlers */
  const toggleRow = useCallback((id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    if (selected.size === paged.length && paged.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paged.map((p) => p.id)));
    }
  }, [paged, selected.size]);

  /* Count how many selected are EOI or Pending (convertible) */
  const selectedConvertible = useMemo(() => {
    return MOCK_PLAYERS.filter(
      (p) => selected.has(p.id) && (p.status === "EOI" || p.status === "Pending")
    ).length;
  }, [selected]);

  const handleExport = useCallback(() => {
    const headers = ["First Name","Last Name","DOB","Age Group","Team","Status","Position","Grade","FFA Number","Guardian Name","Guardian Email","Guardian Phone","Medical Notes","Photo Consent"];
    const rows = filtered.map((p) => [
      p.firstName, p.lastName, p.dob, p.ageGroup, p.team, p.status, p.position,
      (p.gradeScore / 2).toFixed(1), p.ffaNumber, p.guardianName, p.guardianEmail,
      p.guardianPhone, p.medicalNotes, p.photoConsent,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nickol_sc_players_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    addToast(`Exported ${filtered.length} players to CSV`, "success");
  }, [filtered, addToast]);

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      addToast(`${deleteTarget.firstName} ${deleteTarget.lastName} has been deleted`, "success");
      setDeleteTarget(null);
    }
  };

  const handleConvertConfirm = () => {
    addToast(`${selectedConvertible} player(s) converted to Registered`, "success");
    setSelected(new Set());
    setConvertOpen(false);
  };

  /* Active filter chips */
  const hasActiveFilters = ageFilter !== "All" || statusFilter !== "All" || sortBy !== "name-asc";

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Player Management"
        subtitle={`${filtered.length} players found`}
      >
        {/* Import — outlined with subtle hover fill */}
        <button
          onClick={() => setShowImport(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-400 hover:shadow-md active:scale-[0.97]"
        >
          <Upload className="h-4 w-4" />
          Import
        </button>

        {/* Export — generates and downloads CSV */}
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-400 hover:shadow-md active:scale-[0.97]"
        >
          <Download className="h-4 w-4" />
          Export
        </button>

        {/* Add Player — opens form dialog */}
        <button
          onClick={() => setShowAddPlayer(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-blue-600 hover:shadow-lg active:scale-[0.97]"
        >
          <Plus className="h-4 w-4" />
          Add Player
        </button>
      </PageHeader>

      {/* Player count badge + filter summary chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0B2545] px-3.5 py-1 text-sm font-semibold text-white">
          <Users className="h-3.5 w-3.5" />
          {filtered.length} players
        </span>

        {ageFilter !== "All" && (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {ageFilter}
            <button onClick={() => { setAgeFilter("All"); setPage(1); }} className="ml-0.5 rounded-full p-0.5 hover:bg-blue-100 transition-colors">
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {statusFilter !== "All" && (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {statusFilter}
            <button onClick={() => { setStatusFilter("All"); setPage(1); }} className="ml-0.5 rounded-full p-0.5 hover:bg-blue-100 transition-colors">
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {sortBy !== "name-asc" && (
          <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
            {sortLabelFor(sortBy)}
            <button onClick={() => { setSortBy("name-asc"); setPage(1); }} className="ml-0.5 rounded-full p-0.5 hover:bg-gray-200 transition-colors">
              <X className="h-3 w-3" />
            </button>
          </span>
        )}
      </div>

      {/* Filter bar — stacks vertically on mobile, horizontal on tablet+ */}
      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-end">
        <div className="relative w-full sm:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="w-full sm:w-auto">
            <label className="mb-1 block text-xs font-medium text-gray-500">Age Group</label>
            <Select options={ageGroupOptions} value={ageFilter} onChange={(e) => { setAgeFilter(e.target.value); setPage(1); }} />
          </div>
          <div className="w-full sm:w-auto">
            <label className="mb-1 block text-xs font-medium text-gray-500">Status</label>
            <Select options={statusOptions} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} />
          </div>
          <div className="w-full sm:w-auto">
            <label className="mb-1 block text-xs font-medium text-gray-500">Sort By</label>
            <Select options={SORT_OPTIONS} value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }} />
          </div>
        </div>
      </div>

      {/* Bulk action bar — modern floating bar */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#1D4ED8]/20 bg-white/80 px-5 py-3.5 shadow-lg backdrop-blur-md">
          <span className="text-sm font-semibold text-[#1D4ED8]">
            <Users className="mr-1.5 inline h-4 w-4" />
            {selected.size} selected
          </span>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            {selectedConvertible > 0 && (
              <button
                onClick={() => setConvertOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-emerald-700 hover:to-emerald-600 hover:shadow-lg active:scale-[0.97]"
              >
                <CheckCircle2 className="h-4 w-4" />
                Convert to Registered ({selectedConvertible})
              </button>
            )}

            {/* Delete Selected — outlined red */}
            <button
              onClick={() => {
                addToast(`${selected.size} player(s) deleted`, "success");
                setSelected(new Set());
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition-all hover:bg-red-50 hover:border-red-400 hover:shadow-md active:scale-[0.97]"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Data display */}
      {isLoading ? (
        <SkeletonTable rows={10} cols={7} />
      ) : paged.length === 0 ? (
        <EmptyState
          title="No players found"
          description="No players match the current filters. Try adjusting your search or filter criteria."
        />
      ) : (
        <>
          {/* ===== MOBILE CARD VIEW (< 640px) ===== */}
          <div className="block sm:hidden space-y-2">
            {/* Select-all bar on mobile */}
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2">
              <input
                type="checkbox"
                checked={selected.size === paged.length && paged.length > 0}
                onChange={toggleAll}
                className="rounded h-4 w-4"
              />
              <span className="text-xs font-medium text-gray-500">Select all</span>
            </div>

            {paged.map((player) => {
              const score5 = toFivePoint(player.gradeScore);
              const initials = player.firstName[0];
              const fullName = `${player.firstName} ${player.lastName}`;

              return (
                <div
                  key={player.id}
                  onClick={() => setDetailPlayer(player)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition-all active:scale-[0.99] cursor-pointer min-h-[56px]",
                    selected.has(player.id) && "border-blue-300 bg-blue-50/50"
                  )}
                >
                  {/* Checkbox */}
                  <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(player.id)}
                      onChange={() => toggleRow(player.id)}
                      className="rounded h-5 w-5"
                    />
                  </div>

                  {/* Avatar */}
                  <div className={cn("flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full text-white text-sm font-bold", avatarColor(fullName))}>
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0B2545] truncate">{fullName}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <Badge variant="info">{player.ageGroup}</Badge>
                      <Badge variant={STATUS_VARIANT[player.status]}>{player.status}</Badge>
                      <span className="text-xs text-gray-500">{player.team}</span>
                    </div>
                  </div>

                  {/* Delete */}
                  <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setDeleteTarget(player)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label={`Delete ${fullName}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ===== TABLET + DESKTOP TABLE VIEW (>= 640px) ===== */}
          <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#0B2545] text-left text-xs font-semibold uppercase tracking-wider text-white">
                  <th className="px-4 py-3 w-12">
                    <input
                      type="checkbox"
                      checked={selected.size === paged.length && paged.length > 0}
                      onChange={toggleAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Age Group</th>
                  <th className="px-4 py-3">Team</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Grade</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Guardian Email</th>
                  <th className="px-4 py-3 w-12">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paged.map((player, idx) => {
                  const score5 = toFivePoint(player.gradeScore);
                  const fullName = `${player.firstName} ${player.lastName}`;
                  const initials = player.firstName[0];

                  return (
                    <tr
                      key={player.id}
                      onClick={() => setDetailPlayer(player)}
                      className={cn(
                        "border-t border-gray-100 transition-colors hover:bg-blue-50/40 cursor-pointer",
                        idx % 2 === 1 && "bg-[#F8FAFC]",
                        selected.has(player.id) && "bg-blue-50"
                      )}
                    >
                      <td className="px-4 py-2 lg:py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.has(player.id)}
                          onChange={() => toggleRow(player.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-4 py-2 lg:py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={cn("flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full text-white text-xs font-bold", avatarColor(fullName))}>
                            {initials}
                          </div>
                          <span className="font-medium text-[#0B2545]">{fullName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 lg:py-3 text-gray-600">{player.ageGroup}</td>
                      <td className="px-4 py-2 lg:py-3 text-gray-600">{player.team}</td>
                      <td className="px-4 py-2 lg:py-3">
                        <Badge variant={STATUS_VARIANT[player.status]}>
                          {player.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 lg:py-3 hidden lg:table-cell">
                        <Badge variant={gradeBadgeVariant(score5)}>
                          {score5.toFixed(1)} {gradeLabel(score5)}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 lg:py-3 text-gray-500 hidden lg:table-cell">
                        {player.guardianEmail}
                      </td>
                      <td className="px-4 py-2 lg:py-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setDeleteTarget(player)}
                          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          aria-label={`Delete ${fullName}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pagination */}
      {!isLoading && filtered.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={filtered.length}
          perPage={perPage}
          onPageChange={setPage}
        />
      )}

      {/* Player detail slide-over panel */}
      <PlayerDetailPanel
        player={detailPlayer}
        open={detailPlayer !== null}
        onClose={() => setDetailPlayer(null)}
      />

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        onConfirm={handleDeleteConfirm}
        title="Delete Player"
        description={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.firstName} ${deleteTarget.lastName}? This action cannot be undone.`
            : ""
        }
        variant="danger"
        confirmLabel="Delete"
      />

      {/* Convert EOI confirmation dialog */}
      <ConfirmDialog
        open={convertOpen}
        onOpenChange={setConvertOpen}
        onConfirm={handleConvertConfirm}
        title="Convert to Registered"
        description={`Convert ${selectedConvertible} player(s) from EOI/Pending to Registered status? This will mark them as fully registered in the system.`}
        variant="accent"
        confirmLabel="Convert"
      />

      {/* Add Player dialog */}
      <AddPlayerDialog open={showAddPlayer} onOpenChange={setShowAddPlayer} />

      {/* Import Players dialog */}
      <ImportPlayersDialog open={showImport} onOpenChange={setShowImport} />
    </div>
  );
}
