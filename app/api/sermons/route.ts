import { NextRequest, NextResponse } from "next/server";
import { getSermons } from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const search = searchParams.get("search") || undefined;
  const seriesId = searchParams.get("seriesId") || undefined;
  const book = searchParams.get("book") || undefined;
  const pastor = searchParams.get("pastor") || undefined;
  const yearStr = searchParams.get("year");
  const year = yearStr ? parseInt(yearStr, 10) : undefined;

  const cursorDate = searchParams.get("cursorDate");
  const cursorId = searchParams.get("cursorId");
  const cursor =
    cursorDate && cursorId ? { date: cursorDate, id: cursorId } : undefined;

  try {
    const result = await getSermons({
      search,
      seriesId,
      book,
      pastor,
      year,
      cursor,
      limit: 12,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching sermons:", error);
    return NextResponse.json(
      { error: "Failed to fetch sermons" },
      { status: 500 }
    );
  }
}
