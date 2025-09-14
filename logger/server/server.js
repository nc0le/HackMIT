// server.js
import express from "express";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());

const LOG_FILE = path.join(process.cwd(), "user_commands.log");

// Endpoint to receive logs
app.post("/log", (req, res) => {
    const payload = req.body;
    console.log("Received command:", payload);
    fs.appendFileSync(LOG_FILE, JSON.stringify(payload) + "\n");
    res.sendStatus(200);
});

// Landing page
app.get("/", (req, res) => {
    let html = "<h1>PTY Logging Server</h1>";

    // Read last 20 lines of the log
    let lines = [];
    if (fs.existsSync(LOG_FILE)) {
        lines = fs
            .readFileSync(LOG_FILE, "utf-8")
            .split("\n")
            .filter(Boolean)
            .slice(-20);
    }

    html += "<h2>Recent Commands</h2><ul>";
    for (const line of lines) {
        html += `<li>${line}</li>`;
    }
    html += "</ul>";
    res.send(html);
});

// Start server
const PORT = 8000;
app.listen(PORT, () =>
    console.log(`Server listening on http://localhost:${PORT}`)
);
