import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filePart = {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: file.type,
      },
    };

    // V2 Prompt: Enhanced for Hackathon Judges
    const prompt = `
      You are EcoGuard-AI, an expert environmental analyst powered by Gemini 3.
      Analyze the uploaded image strictly.

      Output MUST be a valid JSON object with this exact structure:
      {
        "hazard_type": "Short title of the issue (e.g., Industrial Water Pollution)",
        "severity_score": number (1-10),
        "reasoning": "Scientific explanation of why this is hazardous based on visual evidence.",
        "impacts": ["List 3 distinct negative impacts on health or ecosystem"],
        "recommendations": ["List 3 actionable solutions for local authorities or citizens"],
        "future_prediction": "A concise prediction of what happens in 1 year if ignored (e.g., 'Groundwater toxicity will increase by 40%...')."
      }
      Do not include markdown formatting like \`\`\`json. Just return the raw JSON.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
    
    const result = await model.generateContent([prompt, filePart]);
    const response = result.response;
    
    // Clean up the text just in case Gemini adds markdown
    let text = response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return NextResponse.json(JSON.parse(text));

  } catch (error) {
    console.error("Error analyzing image:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
