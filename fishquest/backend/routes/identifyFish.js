import express from "express";
import OpenAI from "openai";

const router = express.Router();
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/identify-fish", async (req, res) => {
  try {
    const { imageUrl, state } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "imageUrl is required" });
    }

    const prompt = `
You are identifying a fish from a user-submitted catch photo for a fishing log app.

Return valid JSON only with this exact shape:
{
  "isFishVisible": true,
  "speciesId": "string or null",
  "speciesName": "string or null",
  "confidence": 0.0,
  "alternatives": [
    {
      "speciesId": "string",
      "speciesName": "string",
      "confidence": 0.0
    }
  ],
  "notes": "short explanation"
}

Rules:
- If no fish is clearly visible, set isFishVisible to false.
- Confidence must be between 0 and 1.
- Give up to 3 alternatives.
- Use likely common freshwater sportfish names.
- User state: ${state || "unknown"}
`;

    const response = await client.responses.create({
      model: "gpt-5.4-mini",
      input: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Identify the fish in this image.",
            },
            {
              type: "input_image",
              image_url: imageUrl,
            },
          ],
        },
      ],
    });

    const text = response.output_text;

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("AI returned non-JSON");
      return res.status(500).json({
        error: "AI returned invalid JSON",
      });
    }

    return res.json(parsed);
  } catch (error) {
    console.error("identify-fish failed:", error.message);
    return res.status(500).json({
      error: "Fish identification failed",
    });
  }
});

export default router;
