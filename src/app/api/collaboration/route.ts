import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/db";
import { auth } from "@/auth";
import { CollaboratorRole } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mapId, userEmail, role } = await req.json();

    // Check if the user has permission to share the map
    const map = await prisma.map.findFirst({
      where: {
        id: mapId,
        email: session.user.email,
      },
    });

    if (!map) {
      return NextResponse.json(
        { error: "Map not found or you don't have permission" },
        { status: 404 }
      );
    }

    // Find the user to share with
    const userToShare = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!userToShare) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create or update collaboration
    const collaboration = await prisma.mapCollaborator.upsert({
      where: {
        userId_mapId: {
          userId: userToShare.id,
          mapId: mapId,
        },
      },
      update: {
        role: role as CollaboratorRole,
      },
      create: {
        userId: userToShare.id,
        mapId: mapId,
        role: role as CollaboratorRole,
      },
    });

    return NextResponse.json(collaboration);
  } catch (error) {
    console.error("Error sharing map:", error);
    return NextResponse.json(
      { error: "Failed to share map" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const mapId = url.searchParams.get("mapId");

    if (!mapId) {
      return NextResponse.json(
        { error: "Map ID is required" },
        { status: 400 }
      );
    }

    const collaborators = await prisma.mapCollaborator.findMany({
      where: {
        mapId: mapId,
      },
      include: {
        user: {
          select: {
            email: true,
            id: true,
          },
        },
      },
    });

    return NextResponse.json(collaborators);
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return NextResponse.json(
      { error: "Failed to fetch collaborators" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mapId, userId } = await req.json();

    // Check if the user has permission to remove collaborators
    const map = await prisma.map.findFirst({
      where: {
        id: mapId,
        email: session.user.email,
      },
    });

    if (!map) {
      return NextResponse.json(
        { error: "Map not found or you don't have permission" },
        { status: 404 }
      );
    }

    await prisma.mapCollaborator.delete({
      where: {
        userId_mapId: {
          userId: userId,
          mapId: mapId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing collaborator:", error);
    return NextResponse.json(
      { error: "Failed to remove collaborator" },
      { status: 500 }
    );
  }
}
