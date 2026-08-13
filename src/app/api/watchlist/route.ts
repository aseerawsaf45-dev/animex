import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const animeIdStr = searchParams.get("animeId");

    if (animeIdStr) {
      const record = await prisma.userAnime.findUnique({
        where: {
          userId_animeId: {
            userId: session.user.id,
            animeId: Number(animeIdStr),
          },
        },
      });
      return NextResponse.json({ success: true, status: record?.status || null });
    }

    const list = await prisma.userAnime.findMany({
      where: { userId: session.user.id },
      include: { anime: true },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch watchlist" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { animeId, status } = await req.json();
    if (!animeId) {
      return NextResponse.json({ error: "animeId is required" }, { status: 400 });
    }

    const userId = session.user.id;
    const targetStatus = status || "PLAN_TO_WATCH"; // PLAN_TO_WATCH | COMPLETED | WATCHING

    // Check existing tracking
    const existing = await prisma.userAnime.findUnique({
      where: {
        userId_animeId: { userId, animeId: Number(animeId) }
      }
    });

    if (existing && existing.status === targetStatus) {
      // Toggle off (remove entry if user clicks same button again)
      await prisma.userAnime.delete({
        where: { id: existing.id }
      });
      return NextResponse.json({ success: true, action: "removed", status: null });
    }

    // Upsert status
    const record = await prisma.userAnime.upsert({
      where: {
        userId_animeId: { userId, animeId: Number(animeId) }
      },
      create: {
        userId,
        animeId: Number(animeId),
        status: targetStatus,
      },
      update: {
        status: targetStatus,
      }
    });

    return NextResponse.json({ success: true, action: "updated", status: record.status });
  } catch (error: any) {
    console.error("Watchlist tracking error:", error);
    return NextResponse.json({ error: error?.message || "Failed to update tracking" }, { status: 500 });
  }
}
