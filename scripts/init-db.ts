import dotenv from "dotenv";
import { initDb } from "../src/lib/db";

dotenv.config();

async function main() {
  console.log("🌑 Crimson Blood Moon — Initializing Database Schema...");
  try {
    await initDb();
    console.log("✅ Database schema initialized successfully!");
    console.log("   Table 'links' and indexes are ready.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to initialize database schema:", error);
    process.exit(1);
  }
}

main();
