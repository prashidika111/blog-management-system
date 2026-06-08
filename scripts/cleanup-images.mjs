import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
const dbPath = path.join(process.cwd(), "dev.db");
const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(dbPath)) {
  console.error("Database not found.");
  process.exit(1);
}
if (!fs.existsSync(uploadsDir)) {
  console.log("No uploads directory found.");
  process.exit(0);
}
const db = new Database(dbPath);
const records = db.prepare("SELECT url FROM Image").all();
const dbUrls = new Set(records.map(r => r.url));
const files = fs.readdirSync(uploadsDir);
let deletedCount = 0;
for (const file of files) {
  const fileUrl = `/uploads/${file}`;
  if (!dbUrls.has(fileUrl)) {
    console.log(`Deleting orphaned file: ${file}`);
    fs.unlinkSync(path.join(uploadsDir, file));
    deletedCount++;
  }
}
console.log(`Cleanup complete. Deleted ${deletedCount} orphaned files.`);
