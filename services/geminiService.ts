import { GoogleGenAI } from "@google/genai";
import { Framework, Language, TestConfig, GeneratedResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTestCode = async (config: TestConfig): Promise<GeneratedResult> => {
  const modelId = "gemini-3-pro-preview"; // Using Pro for better coding capabilities

  const prompt = `
    Act as a Senior QA Automation Engineer. 
    Write a standard, robust UI automated test based on the following requirements:
    
    Framework: ${config.framework}
    Language: ${config.language}
    Scenario Description: "${config.scenario}"
    
    Requirements:
    1. Use the Page Object Model (POM) pattern if applicable for a single file example, or write a clean standalone test if the scenario is simple.
    2. Include comments explaining the steps.
    3. Use best practices (e.g., waiting for elements, using resilient selectors like data-testid or role, avoiding hardcoded sleeps).
    4. Provide the output in a JSON format with two fields: "code" (the actual code string) and "explanation" (a brief summary of what the test does).
    
    Example JSON structure:
    {
      "code": "import ...",
      "explanation": "This test navigates to..."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // Using thinking config to ensure high quality code structure
        thinkingConfig: { thinkingBudget: 2048 } 
      }
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("No response from Gemini");
    }

    const parsed = JSON.parse(textResponse);
    return {
      code: parsed.code || "// No code generated",
      explanation: parsed.explanation || "No explanation provided"
    };

  } catch (error) {
    console.error("Error generating test:", error);
    throw new Error("Failed to generate test code. Please try again.");
  }
};