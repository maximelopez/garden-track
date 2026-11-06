# GardenTrack — API

API REST de GardenTrack : Express 5, MongoDB (Mongoose), TypeScript.
Les photos du piège photo arrivent par **MQTT** (broker EMQX) et sont enregistrées dans MongoDB.

Le TypeScript est exécuté **directement par Node.js** (≥ 22.18), sans compilation :
les imports se font avec l'extension `.ts` (`import { app } from './app.ts'`).

## Installation

```bash
cd api
npm install
cp .env.example .env   # puis renseigner MONGODB_URI et MQTT_PASSWORD
npm run seed           # remplit la base (espèces + photos de démo)
npm run dev            # http://localhost:3000
```

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Lance l'API en développement (redémarre à chaque modification) |
| `npm run seed` | Remplace les espèces et les photos de démo (les vraies photos du piège sont conservées) |
| `npm run typecheck` | Vérifie les types TypeScript |
| `npm test` | Lance les tests (`node:test`, sans base de données) |
| `npm start` | Lance l'API (production) |

## Routes

| Méthode | Route | Description |
|---|---|---|
| GET | `/health` | Vérifie que l'API répond |
| GET | `/species` | Toutes les espèces, avec `photoCount` et `lastSeenAt` |
| GET | `/species/:slug` | Une espèce |
| GET | `/species/:slug/photos?page=1&limit=30` | Photos d'une espèce (paginées, plus récentes d'abord) |
| GET | `/photos?speciesSlug=renard&page=1&limit=30` | Historique des photos (`speciesSlug=null` : animaux non identifiés) |
| GET | `/photos/latest` | Dernière photo prise |
| GET | `/photos/:id` | Une photo |
| PATCH | `/photos/:id` | Identifier / corriger l'espèce : `{ "speciesSlug": "chat" }` |

Il n'y a pas de route pour créer une photo : elles arrivent uniquement par MQTT.

## Réception des photos (MQTT)

- Broker : EMQX (TLS), topic `trackgarden/captures`, QoS 1.
- Session persistante (`clientId` fixe, `clean: false`) : le broker garde les messages
  pendant que l'API est arrêtée et les livre à la reconnexion.
- Chaque message JSON est enregistré tel quel dans la collection `photos`
  (`speciesSlug` vaut `null` si l'IA n'a pas identifié l'animal).
- Un message invalide (JSON incorrect, champ manquant) est ignoré et logué, sans arrêter le serveur.
- Les doublons (même `cloudinaryPublicId`) sont ignorés.

Espèces suivies (20, liste dans `src/constants/species.ts`) : `chat`, `chien`, `ecureuil`, `herisson`, `renard`, `lapin`, `mulot`, `blaireau`, `chevreuil`, `chauve-souris`, `mesange`, `rouge-gorge`, `pigeon-ramier`, `hibou`, `canard`, `grenouille`, `lezard`, `tortue`, `merle`, `pie`.

Pour tester sans le piège : publier un message d'exemple sur `trackgarden/captures` avec MQTTX.

## Organisation

```
src/
├── index.ts          → démarrage (connexion MongoDB + serveur)
├── app.ts            → application Express (middlewares, routes)
├── config/           → variables d'environnement, connexion MongoDB
├── constants/        → liste des espèces reconnues
├── mqtt/             → abonné MQTT (réception des photos du piège)
├── models/           → modèles Mongoose (Species, Photo)
├── routes/           → routes /species et /photos
├── middlewares/      → gestion des erreurs
├── app.test.ts       → tests de l'API
├── scripts/          → seed (données de départ)
└── utils/
```

## Intégration continue

À chaque push ou pull request qui modifie `api/`, GitHub Actions vérifie les types et lance les tests
(workflow : `.github/workflows/api-ci.yml`).
