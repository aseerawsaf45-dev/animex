import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pref = await prisma.userPreference.findUnique({
      where: { userId: session.user.id }
    });

    return NextResponse.json({ success: true, data: pref });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { preferences, onboardingCompleted } = await req.json();

    const updated = await prisma.userPreference.upsert({
      where: { userId: session.user.id },
      update: {
        ...(preferences?.genres && { genreWeights: preferences.genres }),
        ...(preferences?.themes && { themeWeights: preferences.themes }),
        ...(preferences?.eras && { preferredEras: preferences.eras }),
        ...(preferences?.moods && { moodPreferences: preferences.moods }),
        ...(onboardingCompleted !== undefined && { onboardingDone: onboardingCompleted }),
      },
      create: {
        userId: session.user.id,
        genreWeights: preferences?.genres || [],
        themeWeights: preferences?.themes || [],
        preferredEras: preferences?.eras || [],
        moodPreferences: preferences?.moods || [],
        onboardingDone: onboardingCompleted || false,
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
  }
}
