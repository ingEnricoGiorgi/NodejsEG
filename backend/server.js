require('dotenv').config();
const crypto = require('crypto');
const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = 3000;
const SECRET = process.env.JWT_SECRET;


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Serve file statici da /HTML
app.use(express.static(path.join(__dirname, 'HTML')));

// Middleware per verificare il token JWT
function verificaToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).send('Accesso negato');

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).send('Token JWT non valido o scaduto');

    try {
      const userData = JSON.parse(decrypt(decoded.data));
      req.user = userData;
      next();
    } catch (decryptionError) {
      return res.status(403).send('Errore nella decodifica del token');
    }
  });
}


// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const data = JSON.parse(fs.readFileSync('users.json', 'utf8'));
  const user = data.users.find(u => u.name === username && u.password === password);

  if (!user) {
    return res.status(401).send('Credenziali errate');
  }

const userData = JSON.stringify({ username: user.name, id: user.id });
const encryptedData = encrypt(userData);

const token = jwt.sign({ data: encryptedData }, SECRET, { expiresIn: '1m' });


  // Cookie httpOnly
  res.cookie('token', token, { httpOnly: true });
  res.redirect('/profilo.html');
});

// Pagina protetta: profilo
app.get('/profilo.html', verificaToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'HTML', 'profilo.html'));
});

// API per ottenere info utente (incluso il token)
app.get('/api/user-info', verificaToken, (req, res) => {
  const token = req.cookies.token;
  res.json({
    username: req.user.username,
    id: req.user.id,
    token
  });
});

// Logout: cancella il cookie
app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).send('Logout effettuato');
});

// Pagina /test per verificare HTTPS e token
app.get('/test', verificaToken, (req, res) => {
  const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
  const clientIp = req.headers['x-real-ip'] || req.ip;

  res.send(`
    <h1>Test HTTPS</h1>
    <p>Protocollo usato: ${isSecure ? 'HTTPS ✅' : 'HTTP ❌'}</p>
    <p>Utente: ${req.user.username}</p>
    <p>IP: ${clientIp}</p>
    <a href="/profilo.html">⬅ Torna al profilo</a>
  `);
});

// Avvio server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.ENC_SECRET), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    iv: iv.toString('hex'),
    content: encrypted
  };
}

function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.ENC_SECRET),
    Buffer.from(encrypted.iv, 'hex')
  );
  let decrypted = decipher.update(encrypted.content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}