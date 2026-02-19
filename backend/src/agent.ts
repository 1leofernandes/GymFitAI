import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildSystemPrompt, buildUserPrompt } from "./prompt.js";
import type { DietPlanRequest } from "./types";
import fs from "fs";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)

export async function* generateDietPlan(input: DietPlanRequest): AsyncIterable<string> {
    try {
        const diretrizes = fs.readFileSync("knowledge/diretrizes.md", "utf-8");
        
        const model = client.getGenerativeModel({ 
            model: "gemini-2.5-flash-lite",
            generationConfig: {
                temperature: 0.6,
                maxOutputTokens: 4096,
            },
        });

        const fullPrompt = `${buildSystemPrompt()}\n\n${buildUserPrompt(input)}`;
        
        const result = await model.generateContentStream(fullPrompt);

        // Itera sobre o stream do Gemini e vai enviando cada chunk
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            yield chunkText; // Envia o chunk para o cliente
        }
        
    } catch (error) {
        console.error("Erro ao gerar plano alimentar:", error);
        throw error;
    }
}