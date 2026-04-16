
// DATABASE KONFIGURERING (db.js)

// Dette fila setter opp SQLite-databasen
// Alle PC-data lagres her

import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

sqlite3.verbose(); // Vis SQL-kommandoer i konsollen

// Bestem hvor databasen skal lagres
const dbDir = path.join(process.cwd(), "database");
const dbPath = path.join(dbDir, "pcTable.db");

// Lag "database"-mappen hvis den ikke finnes
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Åpne eller opprett databasen
export const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Feil ved åpning av database:", err);
        return;
    }

    // Lag tabellen "pcs" hvis den ikke finnes
    // Denne tabellen lagrer alle PC-ene
    db.exec(`
        CREATE TABLE IF NOT EXISTS pcs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        modell TEXT,
        status TEXT,
        tilstand TEXT
    );
    `, (err) => {
        if (err) {
            console.error("Schema error:", err);
        }
    });

    
    // Lag tabellen "users" hvis den ikke finnes
    // Denne tabellen lagrer brukerinformasjon for autentisering
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    `, (err) => {
        if (err) {
            console.error("Feil ved oppretting av users-tabell:", err);
        }
    });});