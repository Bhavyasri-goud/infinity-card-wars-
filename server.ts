/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client Lazily & Safely on the backend
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('GEMINI_API_KEY is not defined. AI advisor responses will fallback to local tactical generation.');
        throw new Error('GEMINI_API_KEY not configured.');
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // 1. S.H.I.E.L.D Tactical AI Advisor proxy endpoint
  app.post('/api/shield-ai', async (req, res) => {
    try {
      const { prompt, context } = req.body;
      const client = getGeminiClient();

      const systemInstruction = `
        You are "H.O.M.E.R. v2", Stark Laboratories' premier Tactical Combat AI for S.H.I.E.L.D.
        You are analyzing the strategy card game "Avengers: Infinity Card Wars".
        Greet the agent with high-tech S.H.I.E.L.D protocol and authority.
        Keep responses highly thematic, filled with technological analysis, energy readings, and Marvel lore.
        Provide actionable strategy advice on team building, deck synergies, and how to counter opponent classes (Tech, Mystic, Power, Tactical, Cosmic).
        Keep the answer engaging, structured with clean bullet points, and under 250 words total. Mention current context: ${JSON.stringify(context || {})}.
      `;

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt || 'Analyze current Avengers card matchups and suggest a supreme cosmic strategy.',
        config: {
          systemInstruction,
          temperature: 0.8,
        },
      });

      const responseText = response.text || 'No tactical advice received from H.O.M.E.R. satellite uplink. Check core reactor status.';
      res.json({ success: true, advice: responseText });
    } catch (error: any) {
      console.error('Gemini API Error:', error.message);
      res.status(200).json({
        success: false,
        advice: `[AI DATA LINK OFFLINE] H.O.M.E.R Siphon Protocol failed. Error: ${error.message || 'Reactor offline'}.\n\nTactics advisory: Maintain high tactical shielding! Tech heroes should be paired with Cosmic energy to neutralize Thanos' high-attack output in standard universes. Keep training to unlock the Soul Stone for full-health reserves resurrect action!`
      });
    }
  });

  // 2. Health status API
  app.get('/api/health', (req, res) => {
    res.json({ status: 'active', timestamp: new Date().toISOString() });
  });

  // 3. Vite middleware for React asset hot bundling and UI serving
  if (process.env.NODE_ENV !== 'production' && process.env.DISABLE_HMR !== 'true') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind to 0.0.0.0 and port 3000 as requested
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AVENGERS ENGINE] Server humming on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
