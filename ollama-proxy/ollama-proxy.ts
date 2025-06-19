// ollama-proxy.ts
import express from 'express';
import bodyParser from 'body-parser';
import { Database } from 'sqlite3';
import system from 'systeminformation';
import ollama from 'ollama';

const app = express();
const port = 3456;
const queueDB = new Database('./queue.sqlite');
app.use(bodyParser.json());

// ------------------------------
// TASK TYPE
// ------------------------------
type Task = {
  id: string;
  input: any;
  createdAt: number;
};

let processing = false;
const CPU_USAGE_LIMIT = 80;
const TEMP_LIMIT_C = 80;
const INFERENCE_DELAY_MS = 200;
const COOLDOWN_MS = 30000;

// ------------------------------
// DB SETUP
// ------------------------------
queueDB.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    input TEXT NOT NULL,
    createdAt INTEGER NOT NULL
  )
`);

function addTaskToDB(task: Task) {
  queueDB.run(
    'INSERT INTO tasks (id, input, createdAt) VALUES (?, ?, ?)',
    [task.id, JSON.stringify(task.input), task.createdAt]
  );
}

function deleteTaskFromDB(id: string) {
  queueDB.run('DELETE FROM tasks WHERE id = ?', [id]);
}

function getNextTaskFromDB(): Promise<Task | null> {
  return new Promise((resolve) => {
    queueDB.get('SELECT * FROM tasks ORDER BY createdAt ASC LIMIT 1', [], (err, row: any) => {
      if (err || !row) return resolve(null);
      resolve({ id: row.id, input: JSON.parse(row.input), createdAt: row.createdAt });
    });
  });
}

// ------------------------------
// METRICS + ALERTING
// ------------------------------
async function getCpuLoad(): Promise<number> {
  const load = await system.currentLoad();
  return load.currentLoad;
}

async function getSystemTemp(): Promise<number> {
  const temp = await system.cpuTemperature();
  return temp.main || 0;
}

async function reportToGuardian(event: string, payload: any = {}) {
  console.log(`🛰️ Guardian Event: ${event}`, payload);
}

async function sendSlackAlert(message: string) {
  console.log(`🔔 Slack Alert: ${message}`);
}
// ------------------------------
// QUEUE PROCESSOR (Passthrough w/ Response)
// ------------------------------

async function processQueue(taskOverride?: Task): Promise<any | null> {
    if (processing) return null;
    processing = true;
  
    const task = taskOverride || await getNextTaskFromDB();
    if (!task) {
      processing = false;
      return null;
    }
  
    const { id, input } = task;
    const { model, messages, format } = input;
  
    try {
      const cpu = await getCpuLoad();
      const temp = await getSystemTemp();
  
      if (cpu > CPU_USAGE_LIMIT || temp > TEMP_LIMIT_C) {
        console.log(`⚠️ High load (CPU: ${cpu.toFixed(1)}%, Temp: ${temp}°C)`);
        processing = false;
        setTimeout(() => processQueue(), COOLDOWN_MS);
        return null;
      }
  
      console.log("Processing task: ", task, model, messages, format);
      // Run Ollama chat and capture result
      const response = await ollama.chat({
        model: model || "llama3.1:latest",
        messages,
        ...(format && { format }),
      });
  
      // Clean up + report
      await deleteTaskFromDB(id);
      await reportToGuardian('inference.success', { taskId: id });
  
      setTimeout(() => {
        processing = false;
        processQueue();
      }, INFERENCE_DELAY_MS);
  
      return response;
    } catch (err: any) {
      await reportToGuardian('inference.failed', { taskId: id, error: err.message });
      processing = false;
      setTimeout(() => processQueue(), INFERENCE_DELAY_MS);
      return null;
    }
}  

// ------------------------------
// ROUTE
// ------------------------------
app.post('/proxy/chat', async (req, res) => {
  const id = crypto.randomUUID();
  const input = req.body;
  const task: Task = { id, input, createdAt: Date.now() };

  addTaskToDB(task);
  await reportToGuardian('inference.queued', { taskId: id });

  const result = await processQueue(task); // wait for completion and return response

  if (!result) {
    return res.status(500).json({ error: 'Inference failed or system overloaded' });
  }

  res.json(result); // this must match ollama.chat() format
});

app.listen(port, () => {
  console.log(`🧠 Ollama Proxy Server running at http://localhost:${port}`);
});
