import { supabase } from "@config/supabase.config";
import { embedText } from "@lib/embed";
import { qdrantClient } from "@config/clients";

function sanitizePayload(payload: Record<string, any>) {
  const sanitized: Record<string, any> = {};
  for (const key in payload) {
    const val = payload[key];
    if (val === undefined || typeof val === "function") continue;
    try {
      JSON.stringify(val);
      sanitized[key] = val;
    } catch {
      sanitized[key] = String(val);
    }
  }
  return sanitized;
}

export type MemoryInput = {
  id: string;
  agent: string;
  title?: string;
  content: string;
  summary: string;
  type?: string;
  tags?: string[];
  project?: string;
  created_at: string;
  source: string;
  source_id: string;
  is_bloggable?: boolean;
  blog_used?: boolean;
  is_public?: boolean;
  collection?: string;
  metadata?: Record<string, any>;
  additionalPayload?: Record<string, any>;
};

export async function addMemory(input: MemoryInput) {
  const {
    id,
    agent,
    content,
    title = "Untitled Memory",
    type = "memory",
    tags = [],
    project,
    summary,
    created_at,
    source,
    source_id,
    is_bloggable = false,
    blog_used = false,
    is_public = false,
    collection = "memory",
    metadata = {},
    additionalPayload = {}
  } = input;

  if (!content || !source || !source_id) return;

  const memoryId = id || crypto.randomUUID();

  const { data: existing } = await supabase
    .from("memories")
    .select("id")
    .eq("source", source)
    .eq("source_id", source_id)
    .maybeSingle();

  if (existing) return;

  const embedding = await embedText(content);
  if (!embedding) return;

  await qdrantClient.upsert(collection, {
    points: [
      {
        id: memoryId,
        vector: embedding,
        payload: sanitizePayload({
          agent,
          title,
          type,
          content,
          tags,
          project,
          summary,
          created_at,
          source,
          source_id,
          is_bloggable,
          blog_used,
          is_public,
          metadata,
          ...additionalPayload
        })
      }
    ]
  });

  await supabase.from("memories").insert({
    id: memoryId,
    agent,
    title,
    type,
    vector: embedding,
    payload: {
      content,
      tags,
      project,
      summary,
      created_at,
      source,
      source_id,
      is_bloggable,
      blog_used,
      is_public,
      metadata,
      ...additionalPayload
    },
    created_at
  });

  return memoryId;
}
