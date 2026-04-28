import "dotenv/config";
import "./db.js";
import ChallengeTemplate from "./models/ChallengeTemplate.js";
import challengeTemplates from "./config/challengeTemplates.config.js";

async function seedTemplates() {
  try {
    console.log(
      "CONFIG DIFFICULTIES:",
      challengeTemplates.map((c) => ({
        id: c.id,
        difficulty: c.difficulty,
      })),
    );

    for (const template of challengeTemplates) {
      await ChallengeTemplate.updateOne(
        { id: template.id },
        { $set: template },
        { upsert: true },
      );
    }

    const savedTemplates = await ChallengeTemplate.find({}).select(
      "id title difficulty",
    );

    console.log(
      "SAVED DIFFICULTIES:",
      savedTemplates.map((c) => ({
        id: c.id,
        difficulty: c.difficulty,
      })),
    );

    console.log(`Upserted ${challengeTemplates.length} challenge templates`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seedTemplates();
