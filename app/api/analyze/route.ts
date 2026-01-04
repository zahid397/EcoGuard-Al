import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs"; // IMPORTANT for Vercel

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const imagePart = {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: file.type,
      },
    };

    // Gemini call continues here...

  } catch (error) {
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}
