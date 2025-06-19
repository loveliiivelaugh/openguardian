// src/mcp/embed.ts
import { supabase } from "@config/supabase.config";
import ollama from 'ollama';

export async function embedText(text: string): Promise<number[]> {
  const res = await ollama.embeddings({
    model: "mxbai-embed-large",
    prompt: text
  });

  if (!res?.embedding || !Array.isArray(res.embedding)) {
    throw new Error("Failed to generate valid embedding.");
  }

  return res.embedding;
}

export async function storeEmbedding(content: string, metadata: Record<string, any> = {}) {
  const embedding = await embedText(content);

  if (!embedding || !Array.isArray(embedding)) {
    console.error("🛑 Invalid embedding generated");
    throw new Error("Invalid embedding");
  }

  const { data, error } = await supabase.from("memories").insert([
    {
      id: crypto.randomUUID(),  // Optional but best practice for tracking
      agent: "guardianOS", 
      title: metadata?.title || "Untitled Memory",
      type: metadata?.type || "memory",
      content,
      embedding,
      tags: metadata?.tags || [],
      created_at: new Date().toISOString()
    }
  ]);

  if (error) {
    console.error("‼️ [storeEmbedding] Failed to store memory:", error.message);
    throw new Error(error.message);
  }

  return data;
}
