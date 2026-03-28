"use client";

import * as React from "react";
import { TeamSelector, type CoachTeam } from "@/components/coach/team-selector";
import { Dashboard } from "@/components/coach/dashboard";

export default function CoachPage() {
  const [selectedTeam, setSelectedTeam] = React.useState<CoachTeam | null>(
    null
  );

  if (selectedTeam) {
    return (
      <Dashboard
        team={selectedTeam}
        onBack={() => setSelectedTeam(null)}
      />
    );
  }

  return <TeamSelector onSelectTeam={setSelectedTeam} />;
}
