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

    const genres: string[] = preferences?.genres || [];
    const themesCombined: string[] = [
      ...(preferences?.themes || []),
      ...(preferences?.pacing ? [`pacing:${preferences.pacing}`] : []),
      ...(preferences?.protagonist ? [`protagonist:${preferences.protagonist}`] : []),
      ...(preferences?.atmosphere ? [`atmosphere:${preferences.atmosphere}`] : []),
      ...(preferences?.payoff ? [`payoff:${preferences.payoff}`] : []),
    ].filter(Boolean);

    const eras: string[] = preferences?.eras || [];
    const experience: string = preferences?.experience || "";

    const rawAnswers = {
      genres,
      pacing: preferences?.pacing || "",
      protagonist: preferences?.protagonist || "",
      atmosphere: preferences?.atmosphere || "",
      payoff: preferences?.payoff || "",
      eras,
      experience,
    };

    const updated = await prisma.userPreference.upsert({
      where: { userId: session.user.id },
      update: {
        genreWeights: genres,
        themeWeights: themesCombined,
        preferredEras: eras,
        moodPreferences: rawAnswers,
        preferredSources: experience ? [experience] : [],
        ...(onboardingCompleted !== undefined && { onboardingDone: onboardingCompleted }),
      },
      create: {
        userId: session.user.id,
        genreWeights: genres,
        themeWeights: themesCombined,
        preferredEras: eras,
        moodPreferences: rawAnswers,
        preferredSources: experience ? [experience] : [],
        onboardingDone: onboardingCompleted || false,
      }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Preferences update error:", error);
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
  }
}
