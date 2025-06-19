import axios from 'axios';
import ollama from 'ollama';
import { QdrantClient } from '@qdrant/js-client-rest';
import { encode } from 'js-base64';
import { GoogleGenAI } from "@google/genai";
import { Client } from '@notionhq/client';

export { ollama };
export const notion = new Client({ auth: Bun.env.NOTION_API_KEY });
export const gemini2_5 = new GoogleGenAI({ apiKey: Bun.env.GOOGLE_GENAI_KEY });
export const qdrantClient = new QdrantClient({ url: "http://localhost:6333" });

export const n8nClient = axios.create({
    baseURL: Bun.env.N8N_BASE_URL || "http://localhost:5678/api/v1",
    headers: {
      "Content-Type": "application/json",
      "X-N8N-API-KEY": Bun.env.N8N_API_KEY
    }
});

const authHeader = 'Basic ' + encode(Bun.env.WORDPRESS_BASIC as string);
export const wordpressClient = axios.create({
    baseURL: Bun.env.WORDPRESS_HOSTNAME,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
    }
});

export const slackClient = axios.create({
    baseURL: "https://slack.com/api",
    decompress: false, // Disable automatic Brotli/gzip decompress
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Bun.env.SLACK_BOT_TOKEN}`,
        'Accept-Encoding': 'gzip, deflate' // ❌ no br
    }
});

export const homeAssistantClient = axios.create({
    baseURL: 'http://127.0.0.1:8123/api',
    headers: {
      'X-HA-Access': Bun.env.HOME_ASSISTANT_ACCESS_TOKEN
    }
});