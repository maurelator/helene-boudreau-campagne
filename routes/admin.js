// routes/admin.js
const express = require('express');
const router  = express.Router();
const fs      = require('fs');
const path    = require('path');
const multer  = require('multer');

const DB      = path.join(__dirname, '../data/db.json');
const UPLOADS = path.join(__dirname, '../public/images/uploads');
if (!fs.existsSync(UPLOADS)) fs.mkdirSync(UPLOADS, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s/g,'-')}`)
});
const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 } });

const read  = ()    => JSON.parse(fs.readFileSync(DB, 'utf8'));
const write = data  => fs.writeFileSync(DB, JSON.stringify(data, null, 2));
const newId = arr   => arr.length ? Math.max(...arr.map(i => i.id)) + 1 : 1;

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'dieppe2026';

function auth(req, res, next) {
  if (req.session?.admin) return next();
  res.redirect('/admin/login');
}

// ── Auth ──────────────────────────────────
router.get('/login',  (req, res) => res.sendFile(path.join(__dirname, '../admin/login.html')));
router.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/admin/login'); });
router.post('/login', (req, res) => {
  if (req.body.username === ADMIN_USER && req.body.password === ADMIN_PASS) {
    req.session.admin = true;
    return res.redirect('/admin/dashboard');
  }
  res.redirect('/admin/login?error=1');
});

router.get('/',          auth, (req, res) => res.redirect('/admin/dashboard'));
router.get('/dashboard', auth, (req, res) => res.sendFile(path.join(__dirname, '../admin/dashboard.html')));

// ── Stats ──────────────────────────────────
router.get('/api/stats', auth, (req, res) => {
  const db = read();
  res.json({
    actualites: db.actualites.length,
    benevoles:  db.benevoles.length,
    messages:   db.messages.length,
    nonLusMsg:  db.messages.filter(m=>!m.lu).length,
    nonLusBen:  db.benevoles.filter(b=>!b.lu).length,
  });
});

// ── Actualités ────────────────────────────
router.get('/api/actualites', auth, (req, res) => res.json(read().actualites));
router.post('/api/actualites', auth, upload.single('image'), (req, res) => {
  const db = read();
  db.actualites.push({
    id: newId(db.actualites),
    titre:   req.body.titre   || '',
    date:    req.body.date    || new Date().toISOString().split('T')[0],
    contenu: req.body.contenu || '',
    image:   req.file ? `/images/uploads/${req.file.filename}` : (req.body.image || ''),
    visible: req.body.visible === 'true'
  });
  write(db);
  res.json({ success: true });
});
router.put('/api/actualites/:id', auth, upload.single('image'), (req, res) => {
  const db  = read();
  const idx = db.actualites.findIndex(a => a.id === +req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'Non trouvé' });
  db.actualites[idx] = {
    ...db.actualites[idx], ...req.body,
    visible: req.body.visible === 'true',
    image: req.file ? `/images/uploads/${req.file.filename}` : db.actualites[idx].image
  };
  write(db);
  res.json({ success: true });
});
router.delete('/api/actualites/:id', auth, (req, res) => {
  const db = read();
  db.actualites = db.actualites.filter(a => a.id !== +req.params.id);
  write(db);
  res.json({ success: true });
});

// ── Galerie communautaire ─────────────────
router.get('/api/galerie', auth, (req, res) => res.json(read().galerie || []));
router.post('/api/galerie', auth, upload.single('image'), (req, res) => {
  const db = read();
  if (!db.galerie) db.galerie = [];
  db.galerie.push({
    id: newId(db.galerie),
    titre:    req.body.titre  || '',
    legende:  req.body.legende || '',
    image:    req.file ? `/images/uploads/${req.file.filename}` : '',
    visible:  true,
    date:     new Date().toISOString().split('T')[0]
  });
  write(db);
  res.json({ success: true });
});
router.delete('/api/galerie/:id', auth, (req, res) => {
  const db = read();
  db.galerie = (db.galerie||[]).filter(g => g.id !== +req.params.id);
  write(db);
  res.json({ success: true });
});

// ── Bénévoles ─────────────────────────────
router.get('/api/benevoles', auth, (req, res) => res.json(read().benevoles));
router.put('/api/benevoles/:id/lu', auth, (req, res) => {
  const db = read();
  const b  = db.benevoles.find(x => x.id === +req.params.id);
  if (b) { b.lu = true; write(db); }
  res.json({ success: true });
});
router.delete('/api/benevoles/:id', auth, (req, res) => {
  const db = read();
  db.benevoles = db.benevoles.filter(b => b.id !== +req.params.id);
  write(db);
  res.json({ success: true });
});

// ── Messages ──────────────────────────────
router.get('/api/messages', auth, (req, res) => res.json(read().messages));
router.put('/api/messages/:id/lu', auth, (req, res) => {
  const db = read();
  const m  = db.messages.find(x => x.id === +req.params.id);
  if (m) { m.lu = true; write(db); }
  res.json({ success: true });
});
router.delete('/api/messages/:id', auth, (req, res) => {
  const db = read();
  db.messages = db.messages.filter(m => m.id !== +req.params.id);
  write(db);
  res.json({ success: true });
});

// ── Config ────────────────────────────────
router.get('/api/config', auth, (req, res) => res.json(read().config));
router.put('/api/config', auth, (req, res) => {
  const db = read();
  db.config = { ...db.config, ...req.body };
  write(db);
  res.json({ success: true });
});

// ── Upload photo candidat ─────────────────
router.post('/api/upload-photo', auth, upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Pas de fichier' });
  const db = read();
  db.config.photo_candidate = `/images/uploads/${req.file.filename}`;
  write(db);
  res.json({ success: true, url: db.config.photo_candidate });
});

module.exports = router;
