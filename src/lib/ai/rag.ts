import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ---- Chunk text into ~500 word segments with overlap ----
export function chunkText(text: string, maxWords: number = 500, overlap: number = 50): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let start = 0;
  while (start < words.length) {
    const end = Math.min(start + maxWords, words.length);
    chunks.push(words.slice(start, end).join(" "));
    start = end - overlap;
    if (start >= words.length) break;
  }
  return chunks.filter(c => c.trim().length > 50); // skip tiny chunks
}

// ---- Generate embedding for text using Gemini ----
export async function generateEmbedding(text: string): Promise<number[]> {
  // Use Gemini's embedding model
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

// ---- Ingest a document: chunk, embed, store ----
export async function ingestDocument(params: {
  documentId: string;
  text: string;
  documentName: string;
}): Promise<{ chunksCreated: number }> {
  const chunks = chunkText(params.text);
  let created = 0;

  for (let i = 0; i < chunks.length; i++) {
    try {
      // For now, store without embedding vector (pgvector may not be enabled)
      // The embedding column will be populated when pgvector is enabled
      const { error } = await supabase.from("kb_embeddings").insert({
        document_id: params.documentId,
        chunk_text: chunks[i],
        chunk_index: i,
      });

      if (!error) created++;
    } catch (e) {
      console.error(`Failed to store chunk ${i}:`, e);
    }
  }

  // Update document status and chunk count
  await supabase
    .from("kb_documents")
    .update({ status: "ready", chunks_generated: created })
    .eq("id", params.documentId);

  return { chunksCreated: created };
}

// ---- Retrieve relevant chunks for a query (text-based search fallback) ----
// When pgvector is enabled, this will use vector similarity search
export async function retrieveRelevantChunks(query: string, limit: number = 5): Promise<string[]> {
  // Text-based search using PostgreSQL full-text search
  // Split query into keywords
  const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);

  if (keywords.length === 0) return [];

  // Search chunks containing the keywords using ilike
  const searchTerms = keywords.slice(0, 5); // limit to 5 keywords

  let queryBuilder = supabase
    .from("kb_embeddings")
    .select("chunk_text")
    .limit(limit);

  // Use OR conditions for keyword matching
  const orConditions = searchTerms.map(term => `chunk_text.ilike.%${term}%`).join(",");
  queryBuilder = queryBuilder.or(orConditions);

  const { data, error } = await queryBuilder;

  if (error || !data) return [];

  return data.map(row => row.chunk_text);
}

// ---- Build RAG context for a prompt ----
export async function buildRAGContext(query: string): Promise<string> {
  const chunks = await retrieveRelevantChunks(query, 5);

  if (chunks.length === 0) return "";

  return `
--- COACHING KNOWLEDGE (Retrieved from club's coaching library) ---
${chunks.map((chunk, i) => `[Source ${i + 1}]:\n${chunk}`).join("\n\n")}
--- END COACHING KNOWLEDGE ---
`;
}
