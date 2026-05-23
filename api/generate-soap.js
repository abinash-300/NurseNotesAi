import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { transcript } = req.body || {};

  if (!transcript || transcript.trim() === '') {
    return res.status(400).json({ error: 'Transcript is required' });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
    console.error('Vercel function error:', error);
    if (error instanceof SyntaxError) {
      res.status(500).json({ error: 'Failed to parse AI response as JSON' });
    } else {
      res.status(500).json({ error: error.message || 'Failed to generate SOAP note' });
    }
  }
}
