/**
 * Données de départ : les espèces du jardin
 * + quelques photos de démonstration (images picsum.photos, pas des vrais animaux).
 * Les slugs doivent correspondre à SPECIES_SLUGS (src/constants/species.ts).
 */
import type { SpeciesSlug } from '../constants/species.ts';

export const speciesSeed: {
  number: number;
  slug: SpeciesSlug;
  name: string;
  scientificName: string;
  description: string;
  emoji: string;
}[] = [
  {
    number: 1,
    slug: 'chat',
    name: "Chat",
    scientificName: "Felis catus",
    description: "Visiteur nocturne régulier, souvent les chats du voisinage.",
    emoji: '🐈',
  },
  {
    number: 2,
    slug: 'ecureuil',
    name: "Écureuil roux",
    scientificName: "Sciurus vulgaris",
    description: "Actif le matin, amateur de noisettes et de graines.",
    emoji: '🐿️',
  },
  {
    number: 3,
    slug: 'herisson',
    name: "Hérisson",
    scientificName: "Erinaceus europaeus",
    description: "Discret, se déplace la nuit au ras du sol.",
    emoji: '🦔',
  },
  {
    number: 4,
    slug: 'renard',
    name: "Renard roux",
    scientificName: "Vulpes vulpes",
    description: "Passe surtout au crépuscule et pendant la nuit.",
    emoji: '🦊',
  },
  {
    number: 5,
    slug: 'fouine',
    name: "Fouine",
    scientificName: "Martes foina",
    description: "Petit carnivore nocturne et agile, reconnaissable à sa bavette blanche.",
    emoji: '🐾',
  },
  {
    number: 6,
    slug: 'lapin',
    name: "Lapin de garenne",
    scientificName: "Oryctolagus cuniculus",
    description: "Peut venir grignoter le potager.",
    emoji: '🐇',
  },
  {
    number: 7,
    slug: 'mulot',
    name: "Mulot sylvestre",
    scientificName: "Apodemus sylvaticus",
    description: "Petit rongeur nocturne, très rapide.",
    emoji: '🐁',
  },
  {
    number: 8,
    slug: 'blaireau',
    name: "Blaireau",
    scientificName: "Meles meles",
    description: "Mammifère nocturne qui creuse à la recherche de vers.",
    emoji: '🦡',
  },
  {
    number: 9,
    slug: 'chevreuil',
    name: "Chevreuil",
    scientificName: "Capreolus capreolus",
    description: "Visite les jardins proches des bois, à l'aube.",
    emoji: '🦌',
  },
  {
    number: 10,
    slug: 'merle',
    name: "Merle noir",
    scientificName: "Turdus merula",
    description: "Fouille la pelouse à la recherche de vers, surtout le matin.",
    emoji: '🐦‍⬛',
  },
  {
    number: 11,
    slug: 'mesange',
    name: "Mésange charbonnière",
    scientificName: "Parus major",
    description: "Habituée des mangeoires, reconnaissable à son ventre jaune.",
    emoji: '🐤',
  },
  {
    number: 12,
    slug: 'rouge-gorge',
    name: "Rouge-gorge",
    scientificName: "Erithacus rubecula",
    description: "Petit oiseau curieux, fidèle à son territoire.",
    emoji: '🐦',
  },
  {
    number: 13,
    slug: 'moineau',
    name: "Moineau domestique",
    scientificName: "Passer domesticus",
    description: "Le plus commun des oiseaux des jardins, souvent en petits groupes.",
    emoji: '🐦',
  },
  {
    number: 14,
    slug: 'pie',
    name: "Pie bavarde",
    scientificName: "Pica pica",
    description: "Oiseau noir et blanc très curieux, souvent bruyant.",
    emoji: '🐦‍⬛',
  },
  {
    number: 15,
    slug: 'geai',
    name: "Geai des chênes",
    scientificName: "Garrulus glandarius",
    description: "Oiseau coloré à la tache bleue sur l'aile, grand amateur de glands.",
    emoji: '🐦',
  },
  {
    number: 16,
    slug: 'pic-vert',
    name: "Pic vert",
    scientificName: "Picus viridis",
    description: "Cherche les fourmis au sol, reconnaissable à sa calotte rouge.",
    emoji: '🐦',
  },
  {
    number: 17,
    slug: 'pigeon-ramier',
    name: "Pigeon ramier",
    scientificName: "Columba palumbus",
    description: "Grand pigeon souvent posé sur la pelouse.",
    emoji: '🕊️',
  },
  {
    number: 18,
    slug: 'tourterelle',
    name: "Tourterelle turque",
    scientificName: "Streptopelia decaocto",
    description: "Très commune, porte un fin collier noir sur la nuque.",
    emoji: '🕊️',
  },
  {
    number: 19,
    slug: 'chouette',
    name: "Chouette hulotte",
    scientificName: "Strix aluco",
    description: "Rapace nocturne le plus commun des jardins, connue pour son « hou-hou ».",
    emoji: '🦉',
  },
  {
    number: 20,
    slug: 'canard',
    name: "Canard colvert",
    scientificName: "Anas platyrhynchos",
    description: "Peut faire escale près d'un point d'eau.",
    emoji: '🦆',
  },
  {
    number: 21,
    slug: 'grenouille',
    name: "Grenouille verte",
    scientificName: "Pelophylax kl. esculentus",
    description: "Fréquente les mares et les zones humides.",
    emoji: '🐸',
  },
  {
    number: 22,
    slug: 'lezard',
    name: "Lézard des murailles",
    scientificName: "Podarcis muralis",
    description: "Se chauffe au soleil sur les murets.",
    emoji: '🦎',
  },
  {
    number: 23,
    slug: 'tortue',
    name: "Tortue d'Hermann",
    scientificName: "Testudo hermanni",
    description: "Tortue terrestre, active les jours chauds.",
    emoji: '🐢',
  },
];

/**
 * Photos de démonstration à générer : [espèce (null = non identifiée), nombre, date de la plus récente]
 */
export const demoPhotos: [slug: SpeciesSlug | null, count: number, lastTakenAt: string][] = [
  ['chat', 24, '2026-11-05T22:14:00.000Z'],
  ['ecureuil', 12, '2026-11-06T08:02:00.000Z'],
  ['herisson', 2, '2026-10-28T23:09:00.000Z'],
  ['renard', 5, '2026-11-03T05:47:00.000Z'],
  ['mesange', 41, '2026-11-06T10:31:00.000Z'],
  ['rouge-gorge', 18, '2026-11-06T07:45:00.000Z'],
  ['pigeon-ramier', 31, '2026-11-05T16:20:00.000Z'],
  ['lezard', 3, '2026-10-21T13:12:00.000Z'],
  ['merle', 9, '2026-11-06T06:58:00.000Z'],
  ['fouine', 4, '2026-11-04T23:30:00.000Z'],
  ['moineau', 15, '2026-11-06T11:05:00.000Z'],
  [null, 3, '2026-11-06T02:40:00.000Z'],
];
