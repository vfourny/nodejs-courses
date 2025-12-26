# Cours Node.js - Corrigés

Ce dépôt contient les corrigés du cours Node.js avec une branche dédiée pour chaque chapitre.

## Structure du cours

Chaque chapitre du cours correspond à une branche Git :

| Branche | Chapitre |
|---------|----------|
| `01-introduction` | Introduction à Node.js |
| `02-modules` | Système de modules (CommonJS et ES Modules) |
| `03-typescript` | Configuration et utilisation de TypeScript |
| `04-http-server-bruno` | Création d'un serveur HTTP natif |
| `05-express` | Framework Express.js |
| `06-sqlite` | Base de données SQLite |
| `07-prisma` | ORM Prisma |
| `08-authentication` | Authentification (JWT, bcrypt) |
| `09-vitest` | Tests avec Vitest |
| `10-documentation` | Documentation API avec Swagger |
| `11-socket` | WebSockets avec Socket.io |
| `12-auth-socket` | Authentification avec Socket.io |
| `13-room-socket` | Gestion des rooms Socket.io |

## Navigation entre les chapitres

Pour accéder à un chapitre spécifique :

```bash
# Lister toutes les branches
git branch -a

# Changer de chapitre
git checkout 01-introduction
git checkout 02-modules
# etc.
```

Pour voir les différences entre deux chapitres :

```bash
git diff 01-introduction..02-modules
```

## Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn

## Installation

```bash
# Cloner le dépôt
git clone <url-du-depot>
cd nodejs-courses

# Installer les dépendances
npm install
```

## Commandes disponibles

### Développement

```bash
# Lancer le serveur en mode développement (hot reload)
npm run dev

# Compiler le code TypeScript
npm run build

# Lancer l'application compilée
npm start
```

### Base de données (Prisma)

```bash
# Générer le client Prisma
npm run db:generate

# Créer et appliquer les migrations
npm run db:migrate

# Peupler la base de données
npm run db:seed

# Ouvrir Prisma Studio
npm run db:studio

# Pousser le schéma sans créer de migration
npm run db:push

# Réinitialiser la base de données
npm run db:reset

# Configuration complète (generate + migrate + seed)
npm run db:setup
```

### Tests

```bash
# Lancer les tests
npm test

# Lancer les tests avec interface UI
npm run test:ui

# Lancer les tests avec couverture de code
npm run test:coverage
```

## Technologies utilisées

- **Runtime** : Node.js
- **Langage** : TypeScript
- **Framework web** : Express.js
- **Base de données** : SQLite avec Better SQLite3
- **ORM** : Prisma
- **Authentification** : JWT (jsonwebtoken) + bcrypt
- **WebSockets** : Socket.io
- **Tests** : Vitest + Supertest
- **Documentation** : Swagger UI Express
- **Utilitaires** : dotenv, chalk, mathjs

## Progression recommandée

Il est conseillé de suivre les chapitres dans l'ordre :

1. Commencer par `01-introduction` pour comprendre les bases
2. Progresser séquentiellement à travers les chapitres
3. Chaque branche contient le code complet du chapitre correspondant
4. Les chapitres s'appuient sur les connaissances des chapitres précédents

## Structure du projet

```
nodejs-courses/
├── src/              # Code source TypeScript
├── dist/             # Code compilé (généré)
├── prisma/           # Schémas et migrations Prisma
├── tests/            # Tests unitaires et d'intégration
├── package.json      # Configuration npm
└── tsconfig.json     # Configuration TypeScript
```

## Contribution

Ce dépôt est un support de cours. Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue.

## Licence

ISC
