import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY as string
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
    });

    const prompt = `
You are EcoGuard-AI.

Analyze the image and return ONLY valid JSON:
{
  "hazard_type": "string",
  "severity_score": number,
  "reasoning": "string",
  "detected_objects": ["string"],
  "impacts": ["string"],
  "recommendations": ["string"],
  "future_prediction": "string"
}
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: file.type,
        },
      },
    ]);

    let text = result.response.text();
    text = text.replace(/```json|```/g, "").trim();

    return NextResponse.json(JSON.parse(text));
  } catch (err: any) {
    console.error("Gemini error:", err.message);
    return NextResponse.json(
      { error: "Gemini analysis failed" },
      { status: 500 }
    );
  }
}
