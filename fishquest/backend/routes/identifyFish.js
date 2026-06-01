import express from "express";
import OpenAI from "openai";

const router = express.Router();
const openAiApiKey = process.env.OPENAI_API_KEY?.trim();
const client = openAiApiKey ? new OpenAI({ apiKey: openAiApiKey }) : null;

function parseJsonResult(text) {
  if (!text) return null;

  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return JSON.parse(fenced ? fenced[1] : trimmed);
}

function getOpenAiErrorResponse(error) {
  const status = error?.status;
  const message = error?.message || "";
  const code = error?.code || error?.error?.code;
  const type = error?.type || error?.error?.type;

  console.error("identify-fish failed:", {
    status,
    code,
    type,
    message,
  });

  if (status === 400 && /image|url|download|fetch/i.test(message)) {
    return {
      status: 400,
      error:
        "OpenAI could not read the uploaded image. Try a JPG or PNG photo.",
    };
  }

  if (status === 401) {
    return {
      status: 500,
      error: "OpenAI API key is invalid or missing on the server.",
    };
  }

  if (status === 404 || /model/i.test(message)) {
    return {
      status: 500,
      error: "OpenAI model is unavailable or misconfigured on the server.",
    };
  }

  if (status === 429) {
    return {
      status: 503,
      error: "OpenAI rate limit or quota was reached. Try again later.",
    };
  }

  return {
    status: 500,
    error: "Fish identification failed",
  };
}

router.post("/identify-fish", async (req, res) => {
  try {
    const { imageUrl, state } = req.body;

    if (!client) {
      console.error("identify-fish failed: OPENAI_API_KEY is not configured");
      return res.status(500).json({
        error: "OpenAI API key is not configured on the server.",
      });
    }

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
      parsed = parseJsonResult(text);
    } catch (err) {
      console.error("AI returned non-JSON:", text?.slice(0, 500));
      return res.status(500).json({
        error: "AI returned invalid JSON",
      });
    }

    return res.json(parsed);
  } catch (error) {
    const failure = getOpenAiErrorResponse(error);
    return res.status(failure.status).json({
      error: failure.error,
    });
  }
});

export default router;
