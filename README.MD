# 🏦 Pixel Bank

Application fullstack de gestion bancaire permettant de gérer ses comptes, effectuer des virements et suivre ses transactions avec des graphiques récapitulatifs.

## 📋 Description

Pixel Bank est une application web complète qui offre une expérience de banque en ligne simplifiée. Les utilisateurs peuvent créer un compte, se connecter, gérer plusieurs comptes bancaires, effectuer des virements entre comptes et visualiser leurs transactions via des graphiques interactifs.

## ✨ Fonctionnalités

- 🔐 Authentification sécurisée (inscription/connexion)
- 💳 Création et gestion de comptes bancaires multiples
- 💸 Virements entre comptes
- 📊 Dashboard avec graphiques récapitulatifs (Chart.js)
- 📝 Historique des transactions
- 🎨 Interface moderne et responsive

## 🛠️ Stack Technique

### Frontend
- **Framework** : Vue.js 3
- **Styling** : Tailwind CSS
- **Routing** : Vue Router
- **State Management** : Pinia
- **Graphiques** : Chart.js
- **HTTP Client** : Axios

### Backend
- **Runtime** : Node.js
- **Framework** : Express.js
- **ORM** : Prisma
- **Authentification** : JWT + bcryptjs

### Base de données
- **SGBD** : PostgreSQL
- **Hébergement** : Supabase

## 🚀 Déploiement

- **Frontend** : Netlify
- **Backend** : Render
- **Base de données** : Supabase

## 📦 Installation

### Prérequis
- Node.js
- PostgreSQL (ou compte Supabase)
- npm

### Backend
```bash
cd backend
npm install

# Configuration
cp .env.example .env
# Remplir les variables d'environnement

# Migration de la base de données
npx prisma migrate dev
npx prisma generate

# Démarrage
npm run dev
```

### Frontend
```bash
cd frontend
npm install

# Démarrage
npm run dev
```

## 🔧 Scripts disponibles

### Frontend
- `npm run dev` - Démarrage en mode développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualisation du build

### Backend
- `npm run dev` - Démarrage avec nodemon
- `npm start` - Démarrage en production
- `npx prisma studio` - Interface graphique de la base de données

## 📁 Structure du projet
```
pixel-bank/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── router/
│   │   ├── stores/
│   │   └── services/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   └── prisma/
│   └── package.json
└── README.md
```

## 🔐 Variables d'environnement

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@host:port/database"
DIRECT_URL="postgresql://user:password@host:port/database"
JWT_SECRET="votre_secret_jwt"
```

---

Simon TESSARD