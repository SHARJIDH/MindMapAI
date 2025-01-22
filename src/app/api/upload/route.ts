import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadToS3 } from "@/lib/s3";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const fileName = formData.get("fileName") as string;

        if (!file || !fileName) {
            console.error('Missing file or fileName:', { file: !!file, fileName: !!fileName });
            return NextResponse.json(
                { error: 'File and fileName are required' },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const url = await uploadToS3(buffer, fileName);

        return NextResponse.json({ url });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { error: "Failed to upload file", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
