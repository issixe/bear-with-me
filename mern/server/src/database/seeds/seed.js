import { MongoClient } from "mongodb";
import { exampleModules, exampleLessons } from "../seeds/seedData.js";
import dotenv from "dotenv";

// Load Atlas environment variable manually since this runs standalone
dotenv.config({ path: "./config.env" });

const uri = process.env.ATLAS_URI || "";

async function seedDatabase() {
  if (!uri) {
    console.error("Error: ATLAS_URI not found in config.env");
    process.exitCode = 1;
    return;
  }

  const client = new MongoClient(uri);

  try {
    console.log("Connecting to MongoDB Atlas...");
    await client.connect();

    // Target database
    const db = client.db("bear_db");
    const modulesCollection = db.collection("modules");
    const lessonsCollection = db.collection("lessons");

    // Clears existing data to reduce duplicates
    console.log("Clearing old module and lesson data...");
    await modulesCollection.deleteMany({});
    await lessonsCollection.deleteMany({});

    // Insert example modules array
    console.log(`Inserting ${exampleModules.length} default modules...`);
    const moduleResult = await modulesCollection.insertMany(exampleModules);
    // Insert example lessons array
    console.log(`Inserting ${exampleLessons.length} default lessons...`);
    const lessonResult = await lessonsCollection.insertMany(exampleLessons);

    console.log(
      `Success! Successfully seeded ${moduleResult.insertedCount} modules and ${lessonResult.insertedCount} lessons into Atlas.`,
    );
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

seedDatabase();
