# GardenTrack 🦊

Application qui recense les animaux qui passent dans le jardin. Un capteur photo prend les animaux en photo (renard, hérisson, écureuil, mésange, merle…), les photos sont classées par espèce et consultables depuis une application mobile.

Projet réalisé dans le cadre du cours **Applications mobiles et connectées (IoT)**.

## Fonctionnement

1. Le **capteur** prend une photo et l'envoie à l'API (`POST /photos`).
2. L'**API** stocke l'image sur Cloudinary et enregistre ses informations (espèce, date, URL) dans MongoDB.
3. L'**application mobile** affiche les espèces du jardin sous forme de grille, puis la galerie de photos de chaque espèce.

## Structure du dépôt

```
garden-track/
├── mobile/   → application mobile (Expo)
└── api/      → API REST (Express, MongoDB)
```

## Application mobile

### Fonctionnalités

- **Accueil** : dernier visiteur photographié, statistiques (espèces observées, nombre de photos) et grille des 20 espèces, filtrable (*Tous / Observés / Jamais observés*). Les espèces jamais observées apparaissent grisées.
- **Fiche espèce** : illustration, nom scientifique, nombre de photos, dernière visite, description et galerie des photos prises par le capteur.
- **Photo plein écran** : photo en grand avec sa date et le capteur qui l'a prise.
- Mode clair / sombre automatique, rafraîchissement en tirant vers le bas.

> Pour l'instant, l'app utilise des **données fictives** (`src/data/mock.ts`). Elle sera branchée sur l'API à l'étape suivante.

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
    ├── api/queries.ts   → accès aux données (hooks TanStack Query)
    ├── components/      → composants réutilisables (cartes, filtres…)
    ├── constants/       → thème (couleurs, typo, espacements) et illustrations
    ├── data/mock.ts     → données fictives
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
Détails des routes et de l'organisation : [`api/README.md`](api/README.md).

### Lancer l'API

```bash
cd api
npm install
cp .env.example .env   # puis renseigner MONGODB_URI (MongoDB Atlas)
npm run seed           # espèces + photos de démonstration
npm run dev            # http://localhost:3000
```

## Crédits

Les illustrations des espèces ont été générées par IA (Microsoft Copilot), puis détourées et optimisées pour l'application.

## Équipe

- Application mobile & API : Maxime
- Capteur photo : _à compléter_
