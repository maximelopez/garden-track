# GardenTrack 🦊

Un « pokédex » des animaux du jardin. Un capteur photographie les animaux qui passent (écureuil, chat, hibou, renard, moineau…), les photos sont classées par espèce et consultables depuis une application mobile.

Projet réalisé dans le cadre du cours **Applications mobiles et connectées (IoT)**.

## Structure du dépôt

```
garden-track/
├── mobile/   → application mobile (Expo SDK 58, Expo Router, TypeScript)
└── api/      → API REST (Express, MongoDB, Cloudinary)
```

## Fonctionnement

1. Le **capteur** prend une photo et l'envoie à l'API (`POST /photos`).
2. L'**API** stocke l'image sur Cloudinary et enregistre ses informations (espèce, date, URL) dans MongoDB.
3. L'**application mobile** affiche la liste des espèces sous forme de grille, puis la galerie de photos de chaque espèce.

## Lancer l'application mobile

```bash
cd mobile
npm install
npx expo start
```

Scanner le QR code avec l'application **Expo Go** (SDK 58).

## Lancer l'API

_À venir._

## Équipe

- Application mobile & API : Maxime
- Capteur photo : _à compléter_
