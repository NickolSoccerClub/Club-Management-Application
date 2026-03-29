import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * One-time seed endpoint to create the initial admin user.
 * POST /api/auth/seed-admin
 *
 * After running once, this should be disabled or deleted.
 */
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  const email = "admin@nickolsoccerclub.com";
  const password = "NickolSC2026!";
  const displayName = "Josh Henderson";

  try {
    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((u) => u.email === email);

    if (existing) {
      return NextResponse.json({
        message: "Admin user already exists",
        email,
        userId: existing.id,
      });
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;

    // Create profile
    await supabaseAdmin.from("profiles").insert({
      id: userId,
      email,
      display_name: displayName,
    });

    // Create season
    const { data: season } = await supabaseAdmin
      .from("seasons")
      .insert({
        name: "Season 2026",
        year: 2026,
        start_date: "2026-03-01",
        end_date: "2026-09-30",
        phase: "pre_season",
        is_current: true,
      })
      .select()
      .single();

    // Create admin + committee roles
    await supabaseAdmin.from("user_roles").insert([
      {
        user_id: userId,
        role_type: "admin",
        season_id: season?.id,
        status: "active",
      },
      {
        user_id: userId,
        role_type: "committee",
        season_id: season?.id,
        status: "active",
      },
    ]);

    return NextResponse.json({
      message: "Admin user created successfully",
      email,
      password: "NickolSC2026!",
      userId,
      seasonId: season?.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
