// ─────────────────────────────────────────
//  server.js — Campagne Hélène Boudreau
// ─────────────────────────────────────────
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path    = require('path');
const fs      = require('fs');
const nodemailer = require('nodemailer');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Email transporter (Gmail) ─────────────
const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'dieppevotehelene@gmail.com',
    pass: process.env.GMAIL_PASS || 'VOTRE_MOT_DE_PASSE_APP'
    // ⚠️  Utilisez un "App Password" Gmail, pas votre vrai mot de passe
    // Guide: myaccount.google.com → Sécurité → Mots de passe des applications
  }
});

// ── Middleware ────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/locales', express.static(path.join(__dirname, 'locales')));
app.use('/admin/assets', express.static(path.join(__dirname, 'admin')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'helene-dieppe-2026-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 }
}));

// ── Routes ────────────────────────────────
const apiRoutes   = require('./routes/api');
const adminRoutes = require('./routes/admin');

// Inject mailer into routes
app.set('mailer', mailer);

app.use('/api',   apiRoutes);
app.use('/admin', adminRoutes);

// ── Public site ───────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start ─────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n ✅  Serveur démarré`);
  console.log(` 🌐  Site public  →  http://localhost:${PORT}`);
  console.log(` 🔐  Admin        →  http://localhost:${PORT}/admin`);
  console.log(`\n     Login: admin / dieppe2026\n`);
});
