import { supabase } from "@config/supabase.config";
import { embedText } from "@lib/embed";
import { qdrantClient } from "@config/clients";

export async function retrieveMemory({
  query,
  topK = 5,
  tags = [],
  agent,
  collection = "memory"
}: {
  query: string;
  topK?: number;
  tags?: string[];
  agent?: string;
  collection?: string;
}) {
  if (!query || typeof query !== "string" || !query.trim()) {
    console.warn("🧠 retrieveMemory: Invalid query");
    return { results: [] };
  }

  try {
    const embedding = await embedText(query);
    if (!embedding) return { results: [] };

    const filter: any = { must: [] };

    if (agent) {
      filter.must.push({ key: "agent", match: { value: agent } });
    }

    if (tags.length) {
      filter.must.push({ key: "tags", match: { any: tags } });
    }

    const qdrantRes = await qdrantClient.search(collection, {
      vector: embedding,
      limit: topK,
      filter: filter.must.length ? filter : undefined
    });

    const results = qdrantRes.map(({ payload, score }: any) => ({
      id: payload.id,
      title: payload.title,
      content: payload.content,
      summary: payload.summary,
      type: payload.type,
      tags: payload.tags,
      created_at: payload.created_at,
      agent: payload.agent,
      source: payload.source,
      source_id: payload.source_id,
      score
    }));

    return { results };
  } catch (err: any) {
    console.error("❌ retrieveMemory error:", err.message || err);
    return { results: [] };
  }
}

export async function getRandomMemory({
  type,
  tags = [],
  is_bloggable = true,
  limit = 50
}: {
  type?: string | string[];
  tags?: string[];
  is_bloggable?: boolean;
  limit?: number;
} = {}) {
  let query = supabase.from("memories").select("*").order("created_at", { ascending: false }).limit(limit);

  if (type) {
    const types = Array.isArray(type) ? type : [type];
    query = query.in("type", types);
  }

  if (tags.length) {
    query = query.contains("tags", tags);
  }

  if (is_bloggable !== undefined) {
    query = query.eq("is_bloggable", is_bloggable);
  }

  const { data, error } = await query;

  if (error || !data?.length) {
    console.warn("🧠 getRandomMemory: No valid memory found", { error });
    return null;
  }

  return data[Math.floor(Math.random() * data.length)];
}
