// routes/api.js
const express = require('express');
const router  = express.Router();
const fs      = require('fs');
const path    = require('path');
const DB      = path.join(__dirname, '../data/db.json');

const read  = ()    => JSON.parse(fs.readFileSync(DB, 'utf8'));
const write = data  => fs.writeFileSync(DB, JSON.stringify(data, null, 2));
const newId = arr   => arr.length ? Math.max(...arr.map(i => i.id)) + 1 : 1;
const today = ()    => new Date().toISOString().split('T')[0];

// ── GET actualités publiques ──────────────
router.get('/actualites', (req, res) => {
  const db = read();
  res.json(db.actualites.filter(a => a.visible).sort((a,b) => b.date.localeCompare(a.date)));
});

// ── GET config publique ───────────────────
router.get('/config', (req, res) => res.json(read().config));

// ── POST bénévole ─────────────────────────
router.post('/benevole', async (req, res) => {
  const { fname, lname, email, phone, role, message } = req.body;
  if (!fname || !email) return res.status(400).json({ error: 'Champs requis manquants' });

  const db = read();
  const entry = {
    id: newId(db.benevoles),
    nom: `${fname} ${lname}`.trim(),
    email, phone: phone || '', role: role || '', message: message || '',
    date: today(), lu: false
  };
  db.benevoles.push(entry);
  write(db);

  // Email notification
  try {
    const mailer = req.app.get('mailer');
    await mailer.sendMail({
      from: '"Campagne Hélène Boudreau" <dieppevotehelene@gmail.com>',
      to:   'dieppevotehelene@gmail.com',
      subject: `Nouveau bénévole : ${entry.nom}`,
      html: `
        <h2 style="color:#1b3a2d;">Nouvelle inscription bénévole</h2>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;">
          <tr><td style="padding:6px 12px;color:#666;">Nom</td><td style="padding:6px 12px;"><strong>${entry.nom}</strong></td></tr>
          <tr><td style="padding:6px 12px;color:#666;">Courriel</td><td style="padding:6px 12px;"><a href="mailto:${entry.email}">${entry.email}</a></td></tr>
          <tr><td style="padding:6px 12px;color:#666;">Téléphone</td><td style="padding:6px 12px;">${entry.phone || '—'}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;">Rôle souhaité</td><td style="padding:6px 12px;">${entry.role || '—'}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;">Message</td><td style="padding:6px 12px;">${entry.message || '—'}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;">Date</td><td style="padding:6px 12px;">${entry.date}</td></tr>
        </table>
        <p style="margin-top:20px;font-size:12px;color:#999;">Gérer depuis <a href="/admin">le panneau admin</a></p>
      `
    });
  } catch (err) { console.warn('Email non envoyé:', err.message); }

  res.json({ success: true });
});

// ── POST contact ──────────────────────────
router.post('/contact', async (req, res) => {
  const { fname, lname, email, subject, message } = req.body;
  if (!email || !message) return res.status(400).json({ error: 'Champs requis manquants' });

  const db = read();
  const entry = {
    id: newId(db.messages),
    nom: `${fname||''} ${lname||''}`.trim() || email,
    email, sujet: subject || 'Question générale',
    message, date: today(), lu: false
  };
  db.messages.push(entry);
  write(db);

  // Email notification
  try {
    const mailer = req.app.get('mailer');
    await mailer.sendMail({
      from: '"Site Campagne" <dieppevotehelene@gmail.com>',
      to:   'dieppevotehelene@gmail.com',
      subject: `Message : ${entry.sujet} — ${entry.nom}`,
      html: `
        <h2 style="color:#1b3a2d;">Nouveau message de contact</h2>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;">
          <tr><td style="padding:6px 12px;color:#666;">De</td><td style="padding:6px 12px;"><strong>${entry.nom}</strong> &lt;${entry.email}&gt;</td></tr>
          <tr><td style="padding:6px 12px;color:#666;">Sujet</td><td style="padding:6px 12px;">${entry.sujet}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;">Message</td><td style="padding:6px 12px;">${entry.message}</td></tr>
          <tr><td style="padding:6px 12px;color:#666;">Date</td><td style="padding:6px 12px;">${entry.date}</td></tr>
        </table>
      `
    });
  } catch (err) { console.warn('Email non envoyé:', err.message); }

  res.json({ success: true });
});

module.exports = router;
