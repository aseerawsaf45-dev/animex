import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const guestId = crypto.randomBytes(4).toString("hex");
    const guestEmail = `guest_${guestId}_${Date.now()}@animex.local`;
    const guestPassword = crypto.randomBytes(16).toString("hex");
    const hashedPassword = hashPassword(guestPassword);

    const guestUser = await prisma.user.create({
      data: {
        name: `Guest Explorer`,
        email: guestEmail,
        password: hashedPassword,
        isGuest: true,
      },
    });

    // Initialize default preference
    await prisma.userPreference.create({
      data: {
        userId: guestUser.id,
        onboardingDone: true, // Allow guests instant access to home & recommendations
      },
    }).catch((err) => {
      console.warn("Guest preference init warning:", err);
    });

    return NextResponse.json({
      success: true,
      email: guestEmail,
      password: guestPassword,
    });
  } catch (error: any) {
    console.error("Guest creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create guest session" },
      { status: 500 }
    );
  }
}
