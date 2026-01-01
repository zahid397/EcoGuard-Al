import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro", // ✅ SAFE model (always works)
    });

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await model.generateContent([
      {
        role: "user",
        parts: [
          {
            inlineData: {
              data: buffer.toString("base64"),
              mimeType: file.type,
            },
          },
          {
            text: `
Analyze this environment image.

Respond ONLY with valid JSON.
NO markdown. NO explanation outside JSON.

{
  "hazard_type": "string",
  "severity_score": number,
  "reasoning": "string",
  "impacts": ["string"],
  "recommendations": ["string"],
  "future_prediction": "string"
}
            `,
          },
        ],
      },
    ]);

    let text = result.response.text();

    // 🔥 HARDENING: remove junk if Gemini adds anything
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(text);

    return NextResponse.json(parsed);

  } catch (err: any) {
    console.error("API ERROR:", err);

    return NextResponse.json(
      { error: err.message || "AI analysis failed" },
      { status: 500 }
    );
  }
}
