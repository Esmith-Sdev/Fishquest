import "dotenv/config";
import "./db.js";
import ChallengeTemplate from "./models/ChallengeTemplate.js";
import challengeTemplates from "./config/challengeTemplates.config.js";

async function seedTemplates() {
  try {
    await ChallengeTemplate.deleteMany({});

    await ChallengeTemplate.insertMany(challengeTemplates);

    console.log(`Seeded ${challengeTemplates.length} challenge templates`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seedTemplates();
