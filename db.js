import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

sqlite3.verbose();

const dbDir = path.join(process.cwd(), "database");
const dbPath = path.join(dbDir, "pcTable.db");

// Opprett mappe hvis den ikke finnes
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("DB error:", err);
        return;
    }

    db.exec(`
    CREATE TABLE IF NOT EXISTS "PoengTavle" (
        "IDpt" INTEGR,
        "Navn" TEXT,
        "Poeng" INTEGR,
        "Dato" TEXT,
        PRIMARY KEY ("IDpt")
    );
    `, (err) => {
        if (err) {
            console.error("Schema error:", err);
        }
    });
});