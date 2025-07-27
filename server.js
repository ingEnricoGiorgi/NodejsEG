const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = 3000;

const users = JSON.parse(fs.readFileSync("./users.json"));
const JWT_SECRET = "la_mia_chiave_segreta";

// Middleware per JSON
app.use(express.json());

// CORS per frontend statico da Nginx
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Login POST
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.users.find(u => u.name === username && u.password === password);
  if (!user) return res.status(401).json({ error: "Credenziali non valide" });

  const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, {
    expiresIn: "1h"
  });

  res.json({ token });
});

app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});