# GardenTrack 🦊

Application qui recense les animaux qui passent dans le jardin. Un piège photo prend les animaux en photo (renard, hérisson, écureuil, chouette, merle…), les photos sont classées par espèce et consultables depuis une application mobile.

Projet réalisé dans le cadre du cours **Applications mobiles et connectées (IoT)**.

## Fonctionnement

1. Le **piège photo** (script Python) détecte l'animal avec une IA, envoie la photo sur **Cloudinary**,
   puis publie un message JSON sur le broker **MQTT** (EMQX, topic `trackgarden/captures`).
2. L'**API** est abonnée à ce topic : elle enregistre chaque capture dans **MongoDB**.
3. L'**application mobile** affiche les espèces du jardin sous forme de grille, puis la galerie de photos de chaque espèce.

## Avancement

- [x] Organisation du dépôt (`mobile/` + `api/`)
- [x] Application mobile : thème, navigation, écrans avec données fictives, illustrations
- [x] API REST Express + MongoDB Atlas, déployée sur Render
- [x] Intégration continue (GitHub Actions) et déploiement automatique
- [x] Branchement de l'application mobile sur l'API
- [x] Réception des photos du piège photo via MQTT
- [ ] Identification des animaux inconnus depuis l'application
- [ ] Finitions (états d'erreur, animations, build de l'application)

## Structure du dépôt

```
garden-track/
├── .github/workflows/  → intégration continue (GitHub Actions)
├── mobile/             → application mobile (Expo)
└── api/                → API REST (Express, MongoDB, MQTT)
```

## Application mobile

### Fonctionnalités

- **Accueil** : dernier visiteur photographié, statistiques (espèces observées, nombre de photos) et grille des 23 espèces, filtrable (*Tous / Observés / Jamais observés*). Les espèces jamais observées apparaissent grisées.
- **Fiche espèce** : illustration, nom scientifique, nombre de photos, dernière visite, description et galerie des photos prises par le capteur.
- **Photo plein écran** : photo en grand avec sa date et le capteur qui l'a prise.
- Galerie paginée (chargement automatique des photos suivantes en bas de liste).
- Mode clair / sombre automatique, rafraîchissement en tirant vers le bas et au retour dans l'app.

Les données viennent de l'API (par défaut l'API de production sur Render).
Pour utiliser une autre API (par exemple celle lancée sur ton PC), copier `mobile/.env.example` en `mobile/.env`
et modifier `EXPO_PUBLIC_API_URL`.

### Technologies

- [Expo](https://expo.dev) SDK 58, React Native, TypeScript
- [Expo Router](https://docs.expo.dev/router/introduction/) : navigation basée sur les fichiers
- [TanStack Query](https://tanstack.com/query) : chargement et cache des données
- [expo-image](https://docs.expo.dev/versions/latest/sdk/image/) : affichage des images
- Police Plus Jakarta Sans (`@expo-google-fonts/plus-jakarta-sans`)

### Organisation du code

```
mobile/
├── assets/animals/      → illustrations des espèces (WebP, fond transparent)
└── src/
    ├── app/             → écrans (Expo Router)
    │   ├── index.tsx          accueil
    │   ├── animal/[slug].tsx  fiche espèce
    │   └── photo/[id].tsx     photo plein écran
    ├── api/             → appels à l'API (client.ts) et hooks TanStack Query (queries.ts)
    ├── components/      → composants réutilisables (cartes, filtres…)
    ├── config/          → configuration (URL de l'API)
    ├── constants/       → thème (couleurs, typo, espacements) et illustrations
    ├── hooks/           → hooks (thème clair/sombre)
    ├── types/           → types TypeScript (Species, Photo)
    └── utils/           → formatage des dates
```

### Lancer l'application

```bash
cd mobile
npm install
npx expo start
```

Scanner le QR code avec l'application **Expo Go** (SDK 58).

## API

API REST en **Express 5 + MongoDB (Mongoose)**, en TypeScript exécuté directement par Node.js (≥ 22.18).
Elle reçoit les photos du piège par **MQTT** (abonnement au topic `trackgarden/captures`).
Détails des routes et de l'organisation : [`api/README.md`](api/README.md).

### Lancer l'API

```bash
cd api
npm install
cp .env.example .env   # puis renseigner MONGODB_URI et MQTT_PASSWORD
npm run seed           # espèces + photos de démonstration
npm run dev            # http://localhost:3000
```

## Intégration continue et déploiement

- **CI (GitHub Actions)** : à chaque push ou pull request qui modifie `api/`, le workflow
  [`api-ci.yml`](.github/workflows/api-ci.yml) vérifie les types (`npm run typecheck`) et lance les tests (`npm test`).
- **Déploiement (Render)** : l'API est hébergée sur Render (offre gratuite, région Frankfurt).
  Seul le dossier `api/` est déployé, et uniquement quand la CI est passée au vert
  (*Auto-Deploy : After CI Checks Pass*).
- **Base de données** : MongoDB Atlas.
- **Messagerie** : broker MQTT EMQX Serverless (TLS).

> Sur l'offre gratuite de Render, l'API se met en veille après 15 minutes sans requête :
> la première requête suivante peut prendre environ une minute.

## Crédits

Les illustrations des espèces ont été générées par IA (Microsoft Copilot), puis détourées et optimisées pour l'application.

## Équipe

- Application mobile & API : Maxime
- Capteur photo : _à compléter_
