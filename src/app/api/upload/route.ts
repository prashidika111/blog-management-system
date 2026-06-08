import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let buffer: Buffer;
    let originalExt = ".jpg";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { error: "No file provided" },
          { status: 400 }
        );
      }

      buffer = Buffer.from(await file.arrayBuffer());
      originalExt = path.extname(file.name) || ".jpg";
    } else if (contentType.includes("application/json")) {
      const { url } = await req.json();

      if (!url) {
        return NextResponse.json(
          { error: "No URL provided" },
          { status: 400 }
        );
      }

      const response = await fetch(url);

      if (!response.ok) {
        return NextResponse.json(
          { error: "Failed to fetch image" },
          { status: 400 }
        );
      }

      buffer = Buffer.from(await response.arrayBuffer());

      const fetchedContentType =
        response.headers.get("content-type");

      if (fetchedContentType) {
        if (fetchedContentType.includes("png")) {
          originalExt = ".png";
        } else if (fetchedContentType.includes("gif")) {
          originalExt = ".gif";
        } else if (fetchedContentType.includes("webp")) {
          originalExt = ".webp";
        } else if (fetchedContentType.includes("svg")) {
          originalExt = ".svg";
        }
      }
    } else {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 400 }
      );
    }

    const uniqueSuffix =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    const filename =
      `${uniqueSuffix}${originalExt}`;

    const uploadsDir =
      path.join(
        process.cwd(),
        "public",
        "uploads"
      );

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, {
        recursive: true,
      });
    }

    const filepath =
      path.join(uploadsDir, filename);

    await writeFile(filepath, buffer);

    const imageUrl =
      `/uploads/${filename}`;

    const imageRecord =
      await prisma.image.create({
        data: {
          filename,
          url: imageUrl,
        },
      });

    return NextResponse.json({
      id: imageRecord.id,
      url: imageUrl,
    });
  } catch (error) {
    console.error(
      "Error uploading image:",
      error
    );

    return NextResponse.json(
      { error: "Error uploading image" },
      { status: 500 }
    );
  }
}