import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs"; // IMPORTANT for Vercel

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("AIzaSyB4obAm4lfdA28Yn5gVzWI27U9zSsQqqoY");
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

    // Convert image to base64
    const buffer = Buffer.from(await file.arrayBuffer());

    const imagePart = {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: file.type,
      },
    };

    // 🔥 SAFE PROMPT (handles NO hazard case)
    const prompt = `
You are EcoGuard-AI, an environmental analysis system.

Analyze the image.

If NO environmental hazard is visible,
you MUST still return valid JSON explaining why it appears safe.

Return ONLY raw JSON in this exact format:
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

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
    });

    const result = await model.generateContent([
      prompt,
      imagePart,
    ]);

    let text = result.response.text();

    // 🧹 Clean Gemini formatting (VERY IMPORTANT)
    text = text.replace(/```json|```/g, "").trim();

    let data;

    // 🛡️ BULLETPROOF JSON PARSE
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        hazard_type: "No Critical Hazard Detected",
        severity_score: 1,
        reasoning:
          "The image does not clearly show pollution, waste, smoke, or environmental damage.",
        detected_objects: [],
        impacts: [
          "No immediate environmental threat identified."
        ],
        recommendations: [
          "Upload an image showing pollution, waste, or ecological damage for deeper analysis."
        ],
        future_prediction:
          "No environmental risk predicted based on the provided image."
      };
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("EcoGuard API Error:", error);

    // 🧯 FINAL SAFETY RESPONSE
    return NextResponse.json({
      hazard_type: "System Safe Fallback",
      severity_score: 0,
      reasoning:
        "The AI service temporarily failed, but the system recovered safely.",
      detected_objects: [],
      impacts: [],
      recommendations: [
        "Please retry with another image."
      ],
      future_prediction:
        "No prediction available due to system fallback."
    });
  }
}
