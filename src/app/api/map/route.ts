import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/app/db";
import { uploadToS3 } from "@/lib/s3";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const imageData = formData.get("image") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!imageData) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert image to buffer and upload to S3
    const buffer = Buffer.from(await imageData.arrayBuffer());
    const fileName = `${session.user.email}/${Date.now()}-${imageData.name}`;
    const imageUrl = await uploadToS3(buffer, fileName);

    // Create map in database with S3 URL
    const map = await prisma.map.create({
      data: {
        title,
        description,
        imageUrl,
        email: session.user.email,
      },
    });

    return NextResponse.json(map);
  } catch (error) {
    console.error("Error creating map:", error);
    return NextResponse.json(
      { error: "Failed to create map" },
      { status: 500 }
    );
  }
}
