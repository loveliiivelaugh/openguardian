create table public.memories (
  id text primary key default gen_random_uuid(),
  content text not null,
  type text,                        -- e.g., "Observation", "Reflection"
  tags text[],                      -- for filtering
  created_at timestamp with time zone default now(),
  vector vector,                    -- for Qdrant similarity search
  metadata jsonb,                   -- flexible for agent/user info
  source text,                      -- optional (e.g. "notion", "github")
  source_id text                    -- optional ID from source
);

-- Indexes
create unique index if not exists unique_memory_source_pair on public.memories (source, source_id);
create index if not exists idx_memories_created_at on public.memories (created_at desc);
create index if not exists idx_memories_tags on public.memories using gin (tags);
