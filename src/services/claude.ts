import { VidFlowProject, AspectRatio } from "../types/schema";
import { generateMotionWithGemini } from "./gemini";

/**
 * Legacy compatibility export - redirects to Google Gemini engine.
 * Both Gemini 3.8 Flash and Argon 4 are powered by Google Gemini.
 */
export async function generateMotionWithClaude(
  prompt: string,
  aspectRatio: AspectRatio,
  apiKey: string,
  systemPrompt: string,
  _modelName: string = "argon-4"
): Promise<VidFlowProject> {
  return generateMotionWithGemini(prompt, aspectRatio, apiKey, systemPrompt, "argon-4");
}
