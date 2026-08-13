import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { EventType } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { animeId, eventType, metadata } = body;

    if (!eventType || !Object.values(EventType).includes(eventType)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    const event = await prisma.userEvent.create({
      data: {
        userId: session.user.id,
        animeId: animeId ? parseInt(animeId) : null,
        eventType,
        metadata: metadata || {},
      }
    });

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error("Failed to track event:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
