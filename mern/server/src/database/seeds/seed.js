import { MongoClient } from "mongodb";
import { exampleModules, exampleLessons } from "./seedData.js";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

async function seedDatabase() {
  const uri = process.env.ATLAS_URI;

  if (!uri) {
    console.error("ATLAS_URI not found in config.env");
    process.exitCode = 1;
    return;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db("bear_db");

    for (const module of exampleModules) {
      await db.collection("modules").updateOne(
        { module_id: module.module_id },
        { $set: module },
        { upsert: true },
      );
    }

    for (const lesson of exampleLessons) {
      await db.collection("lessons").updateOne(
        { lesson_id: lesson.lesson_id },
        { $set: lesson },
        { upsert: true },
      );
    }

    console.log(
      `Seeded ${exampleModules.length} modules and ${exampleLessons.length} lessons.`,
    );
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

seedDatabase();
