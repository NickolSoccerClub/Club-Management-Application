import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { email, password, displayName, roleType } = await req.json();

  // Create auth user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) return NextResponse.json({ error: authError.message }, { status: 400 });

  // Create profile
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .insert({
      id: authData.user.id,
      email,
      display_name: displayName,
    });

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 });

  // Create role
  await supabaseAdmin
    .from("user_roles")
    .insert({
      user_id: authData.user.id,
      role_type: roleType || "committee",
      status: "active",
    });

  return NextResponse.json({ user: authData.user });
}
