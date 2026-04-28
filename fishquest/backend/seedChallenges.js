import "dotenv/config";
import "./db.js";
import ChallengeTemplate from "./models/ChallengeTemplate.js";
import challengeTemplates from "./config/challengeTemplates.config.js";

async function seedTemplates() {
  try {
    for (const template of challengeTemplates) {
      await ChallengeTemplate.updateOne(
        { id: template.id },
        { $set: template },
        { upsert: true },
      );
    }

    console.log(`Upserted ${challengeTemplates.length} challenge templates`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seedTemplates();
