# 🗳️ Site Campagne — Hélène Boudreau · Dieppe 2025
## Guide complet d'installation et de déploiement

---

## 📁 Structure du projet

```
helene-v4/
├── server.js              ← Serveur Node.js principal
├── package.json
├── data/
│   └── db.json            ← Base de données locale (JSON)
├── routes/
│   ├── api.js             ← API publique (bénévoles, contact, news)
│   └── admin.js           ← Routes admin protégées
├── locales/
│   ├── fr.json            ← Traductions françaises
│   └── en.json            ← Traductions anglaises
├── public/
│   ├── index.html         ← Site public bilingue
│   └── images/uploads/    ← Photos téléversées via l'admin
└── admin/
    ├── login.html         ← Page de connexion
    └── dashboard.html     ← Tableau de bord admin
```

---

## 🚀 ÉTAPE 1 — Démarrage local (localhost)

### Prérequis
- Node.js v18+ → https://nodejs.org (téléchargez la version LTS)
- Terminal (Terminal sur Mac, PowerShell sur Windows)

### Commandes
```bash
# 1. Entrez dans le dossier
cd helene-v4

# 2. Installez les dépendances (une seule fois)
npm install

# 3. Démarrez le serveur en mode développement
npm run dev
```

### Accès
| URL | Description |
|-----|-------------|
| http://localhost:3000 | Site public |
| http://localhost:3000/admin | Admin (redirige vers login) |
| http://localhost:3000/admin/login | Page de connexion |

**Identifiants :** `admin` / `dieppe2025`

---

## 📧 ÉTAPE 2 — Configurer les emails (Gmail)

Les formulaires de bénévoles et de contact envoient automatiquement
un email à **dieppevotehelene@gmail.com**. 

Pour activer cela :

1. Connectez-vous à ce compte Gmail
2. Allez dans : **Compte Google → Sécurité → Validation en 2 étapes** (activer si pas fait)
3. Puis : **Sécurité → Mots de passe des applications**
4. Créez un mot de passe pour "Autre application" → nommez-le "Campagne Site"
5. Copiez le mot de passe généré (16 caractères)
6. Dans `server.js`, remplacez `VOTRE_MOT_DE_PASSE_APP` par ce mot de passe

Ou mieux, utilisez les **variables d'environnement** (voir Étape 4).

---

## 🔐 ÉTAPE 3 — Changer le mot de passe admin

Dans `routes/admin.js`, ligne 13-14, changez :
```javascript
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'dieppe2025';  // ← changez ceci !
```

Pour la production, utilisez des variables d'environnement (voir ci-dessous).

---

## ☁️ ÉTAPE 4 — Déploiement en ligne (Railway — gratuit)

### 4.1 — Créer un dépôt GitHub

```bash
# Dans le dossier helene-v4 :
git init
git add .
git commit -m "Initial commit — Campagne Hélène Boudreau"
```

Créez un compte sur https://github.com  
Créez un nouveau dépôt (ex: `helene-boudreau-campagne`)  
Suivez les instructions pour pousser votre code.

### 4.2 — Déployer sur Railway

1. Créez un compte sur https://railway.app (gratuit)
2. Cliquez "New Project" → "Deploy from GitHub repo"
3. Sélectionnez votre dépôt
4. Railway détecte Node.js automatiquement

### 4.3 — Variables d'environnement (Railway → Settings → Variables)

```
GMAIL_USER   = dieppevotehelene@gmail.com
GMAIL_PASS   = votre_app_password_gmail
ADMIN_USER   = admin
ADMIN_PASS   = MotDePasseSécurisé2025!
SESSION_SECRET = une_longue_chaine_aleatoire_ici
PORT         = 3000
```

---

## 🌐 ÉTAPE 5 — Nom de domaine personnalisé

### Acheter le domaine

1. Allez sur **https://www.namecheap.com** (recommandé) ou https://godaddy.com
2. Cherchez : `heleneboudreaucampagne.ca`
3. Prix typique : ~15-20$/an pour un `.ca`
4. Achetez-le !

### Connecter au site Railway

1. Dans Railway → votre projet → **Settings → Domains**
2. Cliquez "Add Custom Domain"
3. Entrez : `heleneboudreaucampagne.ca`
4. Railway vous donne un enregistrement DNS à configurer

### Configurer le DNS chez Namecheap

1. Namecheap → Domain List → Manage → Advanced DNS
2. Ajoutez un enregistrement **CNAME** :
   - Host : `@` (ou `www`)
   - Value : l'adresse Railway fournie (ex: `helene-xxxx.railway.app`)
3. Attendez 10-30 minutes → votre site est en ligne !

---

## 🖼️ Ajouter la photo d'Hélène

Depuis le panneau admin :
1. Allez dans **Paramètres**
2. Section "Photo de la candidate"
3. Téléversez la photo officielle

Ou dans `public/index.html`, recherchez :
```html
<!-- TO REPLACE: <img src="images/helene-boudreau.jpg" ...> -->
```
Remplacez par :
```html
<img src="images/helene-boudreau.jpg" alt="Hélène Boudreau">
```
Et placez la photo dans `public/images/`.

---

## 🎛️ Utilisation du panneau Admin

| Section | Ce que vous pouvez faire |
|---------|--------------------------|
| **Vue d'ensemble** | Statistiques en temps réel |
| **Actualités** | Créer/publier/supprimer des articles avec photo |
| **Galerie photos** | Ajouter des photos d'engagement communautaire |
| **Bénévoles** | Voir inscriptions, marquer lu, exporter CSV |
| **Messages** | Lire et gérer les messages de contact |
| **Paramètres** | Slogan FR/EN, contacts, réseaux sociaux, photo |

---

## 📱 Le site est responsive

Le site est optimisé pour mobile. Testez sur votre téléphone en accédant à :
`http://[votre-ip-locale]:3000`

Pour trouver votre IP locale :
- Mac : `ifconfig | grep inet`  
- Windows : `ipconfig`

---

## 🔄 Mise à jour du contenu

Tout peut être mis à jour depuis le panneau admin **sans toucher au code** :
- Actualités de campagne avec photos
- Galerie d'engagement communautaire
- Slogan en français ET en anglais
- Informations de contact
- Photo officielle de la candidate

Pour les textes plus profonds (sections biographie, programme, etc.),
modifiez les fichiers `locales/fr.json` et `locales/en.json`.

---

*Site développé pour la campagne électorale d'Hélène Boudreau, Dieppe 2025.*
