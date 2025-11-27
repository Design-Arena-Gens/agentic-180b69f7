'use server';

import { getOpenAIClient } from "@/lib/openai";
import { buildArticlePrompt, generationSchema, GenerationPayload } from "@/lib/prompt";
import { runSpellcheck } from "@/lib/spellcheck";
import { requestNanoBananaImage } from "@/lib/nanoBanana";
import { scrapeProduct } from "@/lib/productScraper";
import { z } from "zod";

export async function scrapeProductAction(productUrl: string) {
  try {
    const result = await scrapeProduct(productUrl);
    return {
      ok: true,
      data: result
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown scraping failure"
    };
  }
}

export async function generateArticleAction(payload: GenerationPayload) {
  const parsed = generationSchema.parse(payload);
  const client = getOpenAIClient();
  const prompt = buildArticlePrompt(parsed);

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    temperature: 0.4,
    max_tokens: 1800,
    messages: [
      {
        role: "system",
        content:
          "You are an elite SEO product review strategist who writes impeccable Markdown, respects factual accuracy, and supplies structured outputs for Discovery surfaces."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });

  const article =
    completion.choices[0]?.message?.content?.trim() ??
    "Generation failed: no content returned by the language model.";

  const spellIssues = await runSpellcheck(article);

  return {
    markdown: article,
    spellIssues
  };
}

const nanoBananaSchema = z.object({
  prompt: z.string().min(10),
  aspectRatio: z.string().min(3)
});

export async function nanoBananaAction(input: z.infer<typeof nanoBananaSchema>) {
  const parsed = nanoBananaSchema.parse(input);
  try {
    const job = await requestNanoBananaImage(parsed);
    return { ok: true, job };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Nano Banana request failed"
    };
  }
}

export async function spellcheckAction(markdown: string) {
  const issues = await runSpellcheck(markdown);
  return issues;
}
