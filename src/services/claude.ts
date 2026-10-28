import { VidFlowProject, AspectRatio } from "../types/schema";
import { extractAndParseJSON, sanitizeAndValidateProject } from "./projectSanitizer";

export async function generateMotionWithClaude(
  prompt: string,
  aspectRatio: AspectRatio,
  apiKey: string,
  systemPrompt: string,
  modelName: string = "argon-4"
): Promise<VidFlowProject> {
  const url = "https://api.anthropic.com/v1/messages";

  const tryCall = async (model: string, timeoutMs: number = 35000) => {
    const requestBody = {
      model,
      max_tokens: 8192,
      system: `${systemPrompt}\nYou must output ONLY the raw JSON adhering strictly to the VidFlowProject schema without any conversational prose, explanations, or markdown fences.`,
      messages: [
        {
          role: "user",
          content: `Create a professional motion graphics project for: ${prompt}\nAspect Ratio: ${aspectRatio}`,
        },
      ],
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const msg = errorData.error?.message || `Claude/Argon API error: ${response.status} ${response.statusText}`;
        throw new Error(msg);
      }

      const data = await response.json();
      const textContent = data.content?.[0]?.text || "";

      if (!textContent) {
        throw new Error("No response content received from Claude / Argon.");
      }

      const parsed = extractAndParseJSON(textContent);
      return sanitizeAndValidateProject(parsed, aspectRatio, prompt);
    } catch (err: unknown) {
      clearTimeout(timer);
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error(`Argon/Claude request timed out after ${timeoutMs / 1000}s.`);
      }
      throw err;
    }
  };

  try {
    const targetModel = modelName === "argon-4" ? "claude-3-5-sonnet-20241022" : modelName;
    return await tryCall(targetModel);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("not_found") || msg.includes("model")) {
      return await tryCall("claude-3-5-sonnet-20241022", 25000);
    }
    throw err;
  }
}
