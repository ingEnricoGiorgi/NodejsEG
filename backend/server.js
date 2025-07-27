const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const SECRET = 'jwt_secret';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const data = JSON.parse(fs.readFileSync('users.json', 'utf8'));
    const user = data.users.find(u => u.name === username && u.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Credenziali errate' });
    }
    const token = jwt.sign({ username: user.name, id: user.id }, SECRET, { expiresIn: '5m' });
    res.json({ token });
});

app.listen(PORT, () => {
    console.log(`API JWT avviata su http://localhost:${PORT}`);
});