# EcoAction (React Native + Expo)

Application mobile de bénévolat environnemental en architecture MVC, avec Expo Router, NativeWind et TanStack Query, et une API simulée via JSON-Server.

## Installation
- Prérequis: Node.js, npm, Expo CLI.
- Installer les dépendances:
```bash
npm install
```

## Lancement
- Démarrer JSON-Server (API simulée):
```bash
npm run server
```
L’API est disponible sur `http://localhost:3001`.

- Démarrer l’application Expo:
```bash
npm run android
# ou
npm run ios
# ou
npm run web
```

## Architecture MVC
```
src/
├── models/           # Types métiers (Mission, User)
├── views/            # Écrans UI (Home, Détails, Mes Missions, Profil, Login)
├── controllers/      # Orchestration métier (missions, utilisateurs)
├── services/         # Accès API (fetch)
├── hooks/            # Hooks TanStack Query (useQuery/useMutation)
└── types/            # Types d’API (APIError, Registration)
```
La navigation est fournie par Expo Router via des fichiers dans `app/` qui importent les vues MVC.

## Données et endpoints
- Fichier de données: `db.json`
- Endpoints:
  - `GET /missions`
  - `GET /missions/:id`
  - `GET /users`
  - `GET /users/:id`
  - `GET /registrations`
  - `POST /registrations { userId, missionId }`
  - `DELETE /registrations/:id`

## TanStack Query
- Cache configuré avec `staleTime` et `gcTime` dans `app/_layout.tsx`.
- `useMissions` gère la recherche et le filtrage + calcul des places restantes.
- `useRegisterMission` implémente Optimistic UI pour l’inscription/annulation.

## Authentification simulée
- Écran Login avec validation locale.
- Profil utilisateur chargé depuis l’API simulée (`users/1`).

## Lint
```bash
npm run lint
```
