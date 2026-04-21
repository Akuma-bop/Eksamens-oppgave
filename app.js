
// HOPPFIKS - SERVER (app.js)

// Dette er hovedfilen som kjører serveren
// Her settes opp rutene for innlogging og PC-administrasjon

import express from "express";
import path from "node:path";
import { db } from './db.js'; // Importerer databasen
import session from 'express-session'; // For bruker-sessions

import { fileURLToPath } from "url";
import { request } from "http";

// Sette opp filsti-variabler
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Opprett Express-app og sett port
const app = express();
const port = 3000; // Serveren kjører på port 3000



// Håndterer forespørsler

app.use(express.json()); // Tolker JSON-data
app.use(express.urlencoded({ extended: true })); // Tolker form-data


// Session middleware for å holde brukere innlogget
app.use(session({
    secret: 'hoppfiks-secret-key-2026', // Skift dette er ikke trygt 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Sett til true med HTTPS
}));

// Serve statiske filer fra public-mappen
app.use(express.static(path.join(process.cwd(), "public")));


// ENKEL AUTENTISERING


// Beskytte ruter som krever innlogging
function requireAuth(req, res, next) {
    if (req.session.isLoggedIn) {
        return next(); // Bruker er innlogget, fortsett
    }
    res.redirect('/'); // Ikke innlogget, send til innloggingsside
}




// Vis innloggingssiden når bruker går til /
app.get("/", (request, response) => {
    response.sendFile(path.join(__dirname, "index.html"));
});


// Vis oversiktssiden når bruker går til /login (krever innlogging)
app.get("/login", requireAuth, (request, response) => {
    response.sendFile(path.join(__dirname, "oversikt.html"));
});



// Håndter innlogging (POST-forespørsel fra skjemaet)
app.post("/login", (request, response) => {
    const { brukernavn, passord } = request.body;


    // Enkel autentisering: admin/admin
    if (brukernavn === 'admin' && passord === 'admin') {
        // Innlogging vellykket - lag session
        request.session.isLoggedIn = true;
        request.session.username = 'admin';
        response.redirect("/login");
    } else {

        // Feil brukernavn eller passord
        response.send(`
            <h1>Innlogging feilet</h1>
            <p>Feil brukernavn eller passord.</p>
            <a href="/">Prøv igjen</a>
        `);
    }
});




// Håndter utlogging
app.post("/logout", (request, response) => {
    request.session.destroy((err) => {
        if (err) {
            console.error('Feil ved utlogging:', err);
            response.status(500).send('Feil ved utlogging');
        } else {
            response.redirect("/");
        }
    });
});


// HENT alle PC-er fra databasen
app.get("/api/pcs", requireAuth, (req, res) => {
    db.all("SELECT * FROM pcs", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// LEGG TIL ny PC i databasen
app.post("/api/pcs", requireAuth, (req, res) => {
    // Hent data fra skjemaet
    const { modell, status, tilstand } = req.body;
    db.run("INSERT INTO pcs (modell, status, tilstand) VALUES (?, ?, ?)", [modell, status, tilstand], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

// SLETT en PC fra databasen
app.delete("/api/pcs/:id", requireAuth, (req, res) => {
    
    const id = req.params.id;
    db.run("DELETE FROM pcs WHERE id = ?", [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ deleted: this.changes });
    });
});

// OPPDATER en PC i databasen
app.put("/api/pcs/:id", requireAuth, (req, res) => {
    const id = req.params.id;
    const { modell, status, tilstand } = req.body;
    db.run("UPDATE pcs SET modell = ?, status = ?, tilstand = ? WHERE id = ?", [modell, status, tilstand, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ updated: this.changes });
    });
});

app.listen(port, () => {
    console.log(`Server kjører på http://localhost:${port}`);
});

