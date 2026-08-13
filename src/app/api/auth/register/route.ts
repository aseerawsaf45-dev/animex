import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const { name, email, password } = body;

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email address already exists. Please sign in instead." }, { status: 400 });
    }

    const hashedPassword = hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name?.trim() || cleanEmail.split("@")[0],
        email: cleanEmail,
        password: hashedPassword,
      }
    });

    // Safely initialize default preference
    await prisma.userPreference.create({
      data: {
        userId: user.id,
        onboardingDone: false,
      }
    }).catch((prefErr) => {
      console.warn("UserPreference creation warning:", prefErr);
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error: any) {
    console.error("Detailed registration error:", error);
    const message = error?.message || "Registration failed due to a server error. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
