import { NextRequest, NextResponse } from "next/server";
import FirecrawlApp from "@mendable/firecrawl-js";

/* ------------------------------------------------------------------ */
/*  POST /api/scrape                                                   */
/*  Accepts { url } and returns scraped markdown content via Firecrawl */
/* ------------------------------------------------------------------ */

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY!,
});

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    // --- Validate input ------------------------------------------------
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Missing required field: url" },
        { status: 400 }
      );
    }

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL format. Must be a valid http or https URL." },
        { status: 400 }
      );
    }

    // --- Check API key -------------------------------------------------
    if (!process.env.FIRECRAWL_API_KEY) {
      return NextResponse.json(
        { error: "Firecrawl API key is not configured." },
        { status: 500 }
      );
    }

    // --- Scrape the URL ------------------------------------------------
    const scrapeResult = await firecrawl.scrape(url, {
      formats: ["markdown"],
    });

    const content = scrapeResult.markdown ?? "";
    const title = (scrapeResult.metadata as Record<string, string>)?.title ?? "";

    return NextResponse.json({
      content,
      title,
      url,
    });
  } catch (error) {
    console.error("[Scrape API] Error:", error);

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";

    return NextResponse.json(
      { error: `Scrape failed: ${message}` },
      { status: 500 }
    );
  }
}
