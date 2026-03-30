import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const USERS_TO_CREATE = [
  {
    email: "coach@nickolsoccerclub.com",
    password: "CoachNSC2026!",
    displayName: "Sarah Mitchell",
    roles: ["coach"],
  },
  {
    email: "parent@nickolsoccerclub.com",
    password: "ParentNSC2026!",
    displayName: "Mary Carter",
    roles: ["parent"],
  },
];

export async function POST() {
  try {
    // Get current season
    const { data: season } = await supabase
      .from("seasons")
      .select("id")
      .eq("is_current", true)
      .single();

    const results = [];

    for (const user of USERS_TO_CREATE) {
      // Check if user already exists
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existing = existingUsers?.users?.find((u) => u.email === user.email);

      if (existing) {
        results.push({ email: user.email, status: "already exists", userId: existing.id });
        continue;
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
      });

      if (authError) {
        results.push({ email: user.email, status: "error", error: authError.message });
        continue;
      }

      const userId = authData.user.id;

      // Create profile
      await supabase.from("profiles").insert({
        id: userId,
        email: user.email,
        display_name: user.displayName,
      });

      // Create roles
      for (const role of user.roles) {
        await supabase.from("user_roles").insert({
          user_id: userId,
          role_type: role,
          season_id: season?.id,
          status: "active",
        });
      }

      results.push({
        email: user.email,
        password: user.password,
        displayName: user.displayName,
        roles: user.roles,
        status: "created",
        userId,
      });
    }

    return NextResponse.json({ message: "Users seeded", results });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
