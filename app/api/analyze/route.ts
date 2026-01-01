import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY missing");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro", // ✅ stable + allowed
    });

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await model.generateContent([
      {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: file.type,
        },
      },
      {
        text: `
You are EcoGuard-AI, an environmental risk analyst.

Analyze the image and respond ONLY with raw JSON.
NO markdown. NO explanation.

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
    ]);

    let text = result.response.text();

    // 🛡️ safety cleanup
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsed = JSON.parse(text);

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("EcoGuard API error:", err);
    return NextResponse.json(
      { error: "AI analysis failed" },
      { status: 500 }
    );
  }
}
