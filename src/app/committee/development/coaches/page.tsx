"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/committee/shared/page-header";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useToastStore } from "@/lib/stores/toast-store";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  GraduationCap,
  Clock,
  UserX,
  Search,
  Mail,
  Phone,
  ShieldCheck,
  Award,
  Edit,
  CheckCircle,
  XCircle,
  Users,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Mock Data                                                  */
/* ------------------------------------------------------------------ */

type WWCCStatus = "Valid" | "Expiring" | "Expired";

interface Coach {
  id: number;
  name: string;
  email: string;
  phone: string;
  teams: string[];
  ageGroup: string;
  wwccStatus: WWCCStatus;
  wwccExpiry: string;
  qualifications: string[];
  avatar: string;
}

interface EOI {
  id: number;
  name: string;
  email: string;
  phone: string;
  preferredRole: string;
  ageGroup: string;
  experience: string;
  wwccStatus: WWCCStatus;
  submittedDate: string;
  avatar: string;
}

const MOCK_COACHES: Coach[] = [
  { id: 1, name: "David Thompson", email: "d.thompson@email.com", phone: "0412 345 678", teams: ["Sharks"], ageGroup: "U12", wwccStatus: "Valid", wwccExpiry: "2027-03-15", qualifications: ["FFA C Licence", "First Aid"], avatar: "DT" },
  { id: 2, name: "Sarah Mitchell", email: "s.mitchell@email.com", phone: "0423 456 789", teams: ["Dolphins"], ageGroup: "U10", wwccStatus: "Valid", wwccExpiry: "2026-11-20", qualifications: ["FFA C Licence", "Grassroots Certificate"], avatar: "SM" },
  { id: 3, name: "Michael Chen", email: "m.chen@email.com", phone: "0434 567 890", teams: ["Eagles"], ageGroup: "U14", wwccStatus: "Expiring", wwccExpiry: "2026-05-01", qualifications: ["FFA B Licence", "First Aid", "Goalkeeping Certificate"], avatar: "MC" },
  { id: 4, name: "Lisa Rodriguez", email: "l.rodriguez@email.com", phone: "0445 678 901", teams: ["Thunder"], ageGroup: "U16", wwccStatus: "Valid", wwccExpiry: "2027-08-10", qualifications: ["FFA C Licence"], avatar: "LR" },
  { id: 5, name: "James O'Brien", email: "j.obrien@email.com", phone: "0456 789 012", teams: ["Sharks", "Eagles"], ageGroup: "U12/U14", wwccStatus: "Expired", wwccExpiry: "2026-01-15", qualifications: ["FFA D Licence", "First Aid"], avatar: "JO" },
  { id: 6, name: "Karen Williams", email: "k.williams@email.com", phone: "0467 890 123", teams: ["Dolphins"], ageGroup: "U10", wwccStatus: "Valid", wwccExpiry: "2027-06-30", qualifications: ["Grassroots Certificate", "First Aid"], avatar: "KW" },
];

const MOCK_EOIS: EOI[] = [
  { id: 101, name: "Robert Kim", email: "r.kim@email.com", phone: "0478 901 234", preferredRole: "Head Coach", ageGroup: "U12", experience: "5 years coaching junior soccer in Perth. Previously coached at Stirling Macedonia FC.", wwccStatus: "Valid", submittedDate: "2026-03-15", avatar: "RK" },
  { id: 102, name: "Angela Foster", email: "a.foster@email.com", phone: "0489 012 345", preferredRole: "Assistant Coach", ageGroup: "U10", experience: "2 years as team manager. Completed Grassroots coaching course. Parent of U10 player.", wwccStatus: "Expiring", submittedDate: "2026-03-20", avatar: "AF" },
  { id: 103, name: "Tom Nguyen", email: "t.nguyen@email.com", phone: "0490 123 456", preferredRole: "Goalkeeper Coach", ageGroup: "Any", experience: "Former semi-professional goalkeeper. FFA C Licence holder. Available weekends.", wwccStatus: "Valid", submittedDate: "2026-03-22", avatar: "TN" },
];

const WWCC_VARIANT: Record<WWCCStatus, "success" | "warning" | "danger"> = {
  Valid: "success",
  Expiring: "warning",
  Expired: "danger",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CoachManagementPage() {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "approve" | "decline";
    eoiName: string;
    eoiId: number;
  }>({ open: false, type: "approve", eoiName: "", eoiId: 0 });

  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const activeCount = MOCK_COACHES.length;
  const pendingCount = MOCK_EOIS.length;
  const unassigned = 0;

  const filteredCoaches = MOCK_COACHES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredEOIs = MOCK_EOIS.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleApproveClick = (eoi: EOI) => {
    setConfirmDialog({ open: true, type: "approve", eoiName: eoi.name, eoiId: eoi.id });
  };

  const handleDeclineClick = (eoi: EOI) => {
    setConfirmDialog({ open: true, type: "decline", eoiName: eoi.name, eoiId: eoi.id });
  };

  const handleConfirm = () => {
    if (confirmDialog.type === "approve") {
      addToast("Coach approved", "success");
    } else {
      addToast("Application declined", "success");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Coach Management" />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <GraduationCap className="h-5 w-5 text-[#1D4ED8]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0B2545]">{activeCount}</p>
              <p className="text-sm text-gray-500">Active Coaches</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Clock className="h-5 w-5 text-[#B45309]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0B2545]">{pendingCount}</p>
              <p className="text-sm text-gray-500">Pending EOIs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
              <UserX className="h-5 w-5 text-[#B91C1C]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0B2545]">{unassigned}</p>
              <p className="text-sm text-gray-500">Unassigned</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Input
          placeholder="Search coaches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        /* Tabs */
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Coaches</TabsTrigger>
            <TabsTrigger value="eoi">EOI Queue</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          {/* Active Coaches */}
          <TabsContent value="active">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredCoaches.map((coach) => (
                <Card key={coach.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0B2545] text-sm font-bold text-white">
                        {coach.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base">{coach.name}</CardTitle>
                        <p className="text-sm text-gray-500">
                          {coach.teams.join(", ")} &middot; {coach.ageGroup}
                        </p>
                      </div>
                      <Badge variant={WWCC_VARIANT[coach.wwccStatus]}>
                        <ShieldCheck className="mr-1 h-3 w-3" />
                        WWCC {coach.wwccStatus}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {coach.qualifications.map((q) => (
                        <Badge key={q} variant="info">
                          <Award className="mr-1 h-3 w-3" />
                          {q}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                        {coach.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                        {coach.phone}
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-xs text-gray-400">
                        WWCC Expires: {coach.wwccExpiry}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => addToast("Coach details saved", "success")}
                      >
                        <Edit className="mr-1.5 h-3.5 w-3.5" />
                        Edit Assignment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredCoaches.length === 0 && (
              <p className="py-12 text-center text-gray-400">No coaches match your search.</p>
            )}
          </TabsContent>

          {/* EOI Queue */}
          <TabsContent value="eoi">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredEOIs.map((eoi) => (
                <Card key={eoi.id} className="overflow-hidden border-l-4 border-l-[#B45309]">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-[#B45309]">
                        {eoi.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base">{eoi.name}</CardTitle>
                        <p className="text-sm text-gray-500">
                          {eoi.preferredRole} &middot; {eoi.ageGroup}
                        </p>
                      </div>
                      <Badge variant={WWCC_VARIANT[eoi.wwccStatus]}>
                        <ShieldCheck className="mr-1 h-3 w-3" />
                        WWCC {eoi.wwccStatus}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-3">{eoi.experience}</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                        {eoi.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-gray-400" />
                        {eoi.phone}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">Submitted: {eoi.submittedDate}</p>
                    <div className="flex gap-2 border-t border-gray-100 pt-3">
                      <Button
                        variant="accent"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleApproveClick(eoi)}
                      >
                        <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDeclineClick(eoi)}
                      >
                        <XCircle className="mr-1.5 h-3.5 w-3.5" />
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredEOIs.length === 0 && (
              <p className="py-12 text-center text-gray-400">No pending EOIs.</p>
            )}
          </TabsContent>

          {/* Archived */}
          <TabsContent value="archived">
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Users className="mb-3 h-10 w-10" />
              <p className="text-sm">No archived coaches.</p>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        onConfirm={handleConfirm}
        title={confirmDialog.type === "approve" ? "Approve Coach" : "Decline Application"}
        description={
          confirmDialog.type === "approve"
            ? `Are you sure you want to approve ${confirmDialog.eoiName} as a coach?`
            : `Are you sure you want to decline the application from ${confirmDialog.eoiName}?`
        }
        variant={confirmDialog.type === "approve" ? "accent" : "danger"}
        confirmLabel={confirmDialog.type === "approve" ? "Approve" : "Decline"}
      />
    </div>
  );
}
