import express, { response } from "express";
import path from "path";
import { db } from './db.js';

import { fileURLToPath } from "url";
import { request } from "http";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

app.use(express.static(path.join(process.cwd(), "public")));

app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "index.html"));
});

app.post("/new-highscore", (request, response) => {
    const { navn, score} = request.body;
    db.run(

        `INSERT INTO PoengTavle (Navn, Poeng) VALUES (?, ?)`,
        [navn, score]
     );
});

app.listen(port, () => {
    console.log(`Server kjører på http://localhost:${port}`);
});

