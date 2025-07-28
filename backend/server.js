const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = 3000;
const SECRET = 'jwt_secret';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Serve i file statici da /HTML
app.use(express.static(path.join(__dirname, 'HTML')));

// LOGIN: riceve credenziali e reindirizza se OK
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const data = JSON.parse(fs.readFileSync('users.json', 'utf8'));
    const user = data.users.find(u => u.name === username && u.password === password);

    if (!user) {
        return res.status(401).send('Credenziali errate');
    }

    const token = jwt.sign({ username: user.name, id: user.id }, SECRET, { expiresIn: '5m' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/profilo.html');
});


// Middleware di verifica token
function verificaToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).send('Accesso negato');

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(403).send('Token JWT non valido o scaduto');
        req.user = decoded;
        next();
    });
}

// Proteggi profilo.html
app.get('/profilo.html', verificaToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'HTML', 'profilo.html'));
});

// Avvio server
app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});

app.get('/api/user-info', verificaToken, (req, res) => {
    const token = req.cookies.token;
    res.json({ username: req.user.username, id: req.user.id, token });
});


app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).send('Logout effettuato');
});
