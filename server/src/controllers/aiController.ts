import { Request, Response } from "express";
import { cloudDb } from "../models/store";

export const generateAIProject = async (req: Request, res: Response) => {
  const { prompt, aspectRatio = "9:16", model = "gemini-3.8-flash", licenseKey } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, message: "Prompt is required." });
  }

  // Verify license key
  if (licenseKey) {
    const license = cloudDb.findLicenseByKey(licenseKey);
    if (!license || license.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Active VidFlow License required to use Cloud AI generation.",
      });
    }

    // Check credits
    if (license.aiCreditsUsed >= license.aiCreditsPerMonth && license.tier !== "lifetime") {
      return res.status(429).json({
        success: false,
        message: "Monthly AI generation credits exhausted. Please upgrade your plan.",
      });
    }

    // Deduct 1 credit
    license.aiCreditsUsed = (license.aiCreditsUsed || 0) + 1;
    cloudDb.saveLicense(license);
  }

  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    return res.status(500).json({
      success: false,
      message: "Server AI API key is not configured in .env. Please set GEMINI_API_KEY on the server.",
    });
  }

  const systemPrompt = `You are the world's most elite Motion Graphics Art Director and Technical Director inside VidFlow.
Generate a complete, mathematically precise, visually stunning motion graphics project represented strictly in the VidFlowProject JSON schema.
Ensure accurate Bangla typography ("Hind Siliguri") for Bengali and "Outfit" for English.
Produce valid raw JSON matching VidFlowProject schema.`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemPrompt}\n\nUser Request: ${prompt}\nAspect Ratio: ${aspectRatio}\nPlease output ONLY valid raw JSON adhering strictly to the VidFlowProject schema without markdown.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      return res.status(geminiRes.status).json({
        success: false,
        message: "Gemini Cloud API Error: " + err,
      });
    }

    const data = await geminiRes.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const project = JSON.parse(rawText);

    return res.json({
      success: true,
      project,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({
      success: false,
      message: "AI Generation server error: " + errorMsg,
    });
  }
};
