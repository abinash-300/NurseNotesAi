import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

function buildAnthropicClient() {
  if (process.env.ANTHROPIC_API_KEY) {
    return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  // In Claude Code remote environments the session ingress token provides
  // authenticated access via Bearer auth — no user-supplied key needed.
  const tokenFile = process.env.CLAUDE_SESSION_INGRESS_TOKEN_FILE;
  if (tokenFile) {
    const authToken = readFileSync(tokenFile, 'utf8').trim();
    return new Anthropic({
      apiKey: 'not-required',
      defaultHeaders: {
        'x-api-key': null,
        Authorization: `Bearer ${authToken}`,
      },
    });
  }
  return new Anthropic({ apiKey: 'not-configured' });
}

const anthropic = buildAnthropicClient();

app.post('/api/generate-soap', async (req, res) => {
  const { transcript } = req.body;

  if (!transcript || transcript.trim() === '') {
    return res.status(400).json({ error: 'Transcript is required' });
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: `You are an expert clinical documentation assistant specializing in nursing notes.
Convert the nurse's verbal report into a structured SOAP note.
Return ONLY a valid JSON object with exactly these four keys: "subjective", "objective", "assessment", "plan"
Each value should be a clear, concise clinical paragraph (2-5 sentences).
Use proper medical terminology. Be factual — only document what was stated.
Do not add assumptions. Do not include any text outside the JSON object.`,
      messages: [
        {
          role: 'user',
          content: `Convert this nurse's verbal report into a SOAP note:\n\n${transcript}`,
        },
      ],
    });

    let responseText = message.content[0].text;
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const soapNote = JSON.parse(responseText);
    res.json(soapNote);
  } catch (error) {
    console.error('Error generating SOAP note:', error);
    if (error instanceof SyntaxError) {
      res.status(500).json({ error: 'Failed to parse AI response as JSON' });
    } else {
      res.status(500).json({ error: error.message || 'Failed to generate SOAP note' });
    }
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`NurseNote AI server running on http://localhost:${PORT}`);
});
