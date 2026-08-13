import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateHybridRecommendations, getColdStartRecommendations } from "@/lib/recommendations/engine";


export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!session?.user?.id) {
      // Return popular/trending for guests
      const guestRecs = await getColdStartRecommendations(limit);
      return NextResponse.json({ success: true, data: guestRecs });
    }

    const recommendations = await generateHybridRecommendations(session.user.id, limit);

    return NextResponse.json({ success: true, data: recommendations });
  } catch (error: any) {
    console.error("Recommendations error:", error);
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
  }
}
