import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/app/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();
    
    // First ensure user exists
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      // Create user if they don't exist
      await prisma.user.create({
        data: {
          email: session.user.email,
          id: session.user.id || undefined
        }
      });
    }

    // Create the map
    const newMap = await prisma.map.create({
      data: {
        name,
        email: session.user.email
      }
    });

    return NextResponse.json({ id: newMap.id });
  } catch (error) {
    console.error("Error creating map:", error);
    return NextResponse.json(
      { error: "Failed to create map" },
      { status: 500 }
    );
  }
}
