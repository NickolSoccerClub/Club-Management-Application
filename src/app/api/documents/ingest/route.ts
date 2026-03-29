import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ingestDocument } from "@/lib/ai/rag";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { name, text, category } = await req.json();

  // Validate
  if (!name || !text) {
    return NextResponse.json({ error: "name and text are required" }, { status: 400 });
  }

  // Create document record
  // Need a user_id for uploaded_by - use a system user approach
  // For now, get the first admin user
  const { data: adminRole } = await supabase
    .from("user_roles")
    .select("user_id")
    .eq("role_type", "admin")
    .eq("status", "active")
    .single();

  const uploadedBy = adminRole?.user_id;
  if (!uploadedBy) {
    return NextResponse.json({ error: "No admin user found" }, { status: 500 });
  }

  const { data: doc, error: docError } = await supabase
    .from("kb_documents")
    .insert({
      name,
      file_url: `ingested://${name}`,
      file_size: text.length,
      page_count: Math.ceil(text.length / 3000), // rough estimate
      status: "processing",
      category: category || "Coaching Manual",
      uploaded_by: uploadedBy,
    })
    .select()
    .single();

  if (docError || !doc) {
    return NextResponse.json({ error: docError?.message || "Failed to create document" }, { status: 500 });
  }

  // Ingest (chunk and store)
  const result = await ingestDocument({
    documentId: doc.id,
    text,
    documentName: name,
  });

  return NextResponse.json({
    message: `Document "${name}" ingested successfully`,
    documentId: doc.id,
    chunksCreated: result.chunksCreated,
  });
}
