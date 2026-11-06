# GardenTrack — API

API REST de GardenTrack : Express 5, MongoDB (Mongoose), TypeScript.

Le TypeScript est exécuté **directement par Node.js** (≥ 22.18), sans compilation :
les imports se font avec l'extension `.ts` (`import { app } from './app.ts'`).

## Installation

```bash
cd api
npm install
cp .env.example .env   # puis renseigner MONGODB_URI
npm run seed           # remplit la base (espèces + photos de démo)
npm run dev            # http://localhost:3000
```

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Lance l'API en développement (redémarre à chaque modification) |
| `npm run seed` | Vide et remplit la base avec les données de départ |
| `npm run typecheck` | Vérifie les types TypeScript |
| `npm start` | Lance l'API (production) |

## Routes

| Méthode | Route | Description |
|---|---|---|
| GET | `/health` | Vérifie que l'API répond |
| GET | `/species` | Toutes les espèces, avec `photoCount` et `lastSeenAt` |
| GET | `/species/:slug` | Une espèce |
| GET | `/species/:slug/photos?page=1&limit=30` | Photos d'une espèce (paginées, plus récentes d'abord) |
| GET | `/photos/latest` | Dernière photo prise |
| GET | `/photos/:id` | Une photo |

## Organisation

```
src/
├── index.ts          → démarrage (connexion MongoDB + serveur)
├── app.ts            → application Express (middlewares, routes)
├── config/           → variables d'environnement, connexion MongoDB
├── models/           → modèles Mongoose (Species, Photo)
├── routes/           → routes /species et /photos
├── middlewares/      → gestion des erreurs
├── scripts/          → seed (données de départ)
└── utils/
```
