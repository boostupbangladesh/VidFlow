import { VidFlowProject, AspectRatio } from "../types/schema";
import { extractAndParseJSON, sanitizeAndValidateProject } from "./projectSanitizer";

export async function generateMotionWithGemini(
  prompt: string,
  aspectRatio: AspectRatio,
  apiKey: string,
  systemPrompt: string,
  modelName: string = "gemini-3.8-flash"
): Promise<VidFlowProject> {
  const tryModel = async (model: string, timeoutMs: number = 35000) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${systemPrompt}\n\nUser Request: ${prompt}\nAspect Ratio: ${aspectRatio}\nPlease output ONLY valid raw JSON adhering strictly to the VidFlowProject schema. Do not wrap in markdown or backticks.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const msg = errorData.error?.message || `Gemini API error: ${response.status} ${response.statusText}`;
        throw new Error(msg);
      }

      const data = await response.json();
      const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (!textContent) {
        throw new Error("No response content received from Gemini.");
      }

      // Robust extraction, auto-repair, and sanitization
      const parsed = extractAndParseJSON(textContent);
      return sanitizeAndValidateProject(parsed, aspectRatio, prompt);
    } catch (err: unknown) {
      clearTimeout(timer);
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error(`Gemini request timed out after ${timeoutMs / 1000}s. Server was busy generating deep blueprint.`);
      }
      throw err;
    }
  };

  try {
    return await tryModel(modelName);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    // If specific model is deprecated or not found, try fallback model
    if (
      msg.includes("not found") ||
      msg.includes("no longer available") ||
      msg.includes("is not supported") ||
      msg.includes("404")
    ) {
      if (modelName === "gemini-3.8-flash") {
        return await tryModel("gemini-1.5-flash", 25000);
      }
    }
    throw err;
  }
}
