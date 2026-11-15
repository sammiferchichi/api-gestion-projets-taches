# API REST de Gestion de Projets et Tâches

**DS1 – Mini-Projet – ISIDS**
**Auteur :** Sami Ferchichi
**Travail :** Monôme

API REST permettant à des utilisateurs authentifiés de gérer leurs projets
et les tâches associées.

## Stack technique

- Node.js / Express 5
- MongoDB + Mongoose
- Authentification JWT
- Hashage des mots de passe avec bcrypt

## Prérequis

- Node.js 
- MongoDB


## Choix d'architecture

<img width="958" height="552" alt="image" src="https://github.com/user-attachments/assets/bbf397e9-4eee-488f-9b7f-5b91c5ce8abc" />


Le projet suit une **architecture en couches** : présentation / logique / accès aux
données. C'est un découpage classique des applications web, où chaque couche a
une responsabilité unique.

| Dossier | Couche | Responsabilité |
|---|---|---|
| `src/routes/` | présentation | associe une URL + une méthode HTTP à une fonction |
| `src/controllers/` | présentation | lit `req`, choisit le code HTTP, renvoie `res.json` |
| `src/models/` | données | schémas Mongoose, validation, accès à MongoDB |
| `src/middlewares/` | transverse | authentification JWT et contrôle des rôles |
| `src/config/`, `src/utils/` | infrastructure | connexion à la base, génération de token |

### Référence

1. **MDN Web Docs**, *Express Tutorial Part 4: Routes and controllers*
   <https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/routes>

## Installation

```bash
npm install
```

Créer ensuite le fichier `.env` à la racine du projet à partir du modèle fourni :

```bash
cp .env.example .env
```

Sous Windows (PowerShell) :

```powershell
Copy-Item .env.example .env
```

Puis renseigner les valeurs réelles dans ce fichier `.env`.

## Variables d'environnement

Le fichier `.env` n'est **pas** versionné. Il contient :

| Variable | Description | Exemple |
|---|---|---|
| `PORT` | port d'écoute du serveur | `3000` |
| `MONGO_URI` | URI de connexion à MongoDB | `mongodb://127.0.0.1:27017/api_projets_taches` |
| `JWT_SECRET` | clé secrète de signature des tokens | `change_me` |
| `JWT_EXPIRES_IN` | durée de validité du token | `7d` |

## Lancement

```bash
npm run dev     # avec nodemon (rechargement automatique)
npm start       # sans nodemon
```

Vérification rapide que le serveur répond : `GET http://localhost:3000/conn`

## Authentification

Les routes protégées exigent l'en-tête :

```
Authorization: Bearer <token>
```

Le token s'obtient via `POST /api/auth/login`, et doit être renvoyé dans chaque
requête protégée.

## Rôles

| Rôle | Droits |
|---|---|
| `user` | gère ses propres projets, voit les tâches de ses projets et celles qui lui sont affectées |
| `manager` | voit **tous** les projets et **toutes** les tâches, et peut affecter une tâche à un utilisateur |

## Routes

### Authentification

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/auth/register` | public | inscription |
| POST | `/api/auth/login` | public | connexion, renvoie un token |
| GET | `/api/auth/me` | privé | utilisateur connecté |

### Projets

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/projets` | privé | créer un projet |
| GET | `/api/projets` | privé | liste (filtrée selon le rôle) |
| GET | `/api/projets/:id` | propriétaire ou manager | détail |
| PUT | `/api/projets/:id` | propriétaire ou manager | modifier |
| DELETE | `/api/projets/:id` | propriétaire ou manager | supprimer (et ses tâches) |

### Tâches

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/api/taches` | privé | créer une tâche |
| GET | `/api/taches` | privé | liste (filtrée selon le rôle) |
| GET | `/api/taches/:id` | propriétaire du projet ou manager | détail |
| PUT | `/api/taches/:id` | propriétaire du projet ou manager | modifier |
| DELETE | `/api/taches/:id` | propriétaire du projet ou manager | supprimer |
| PATCH | `/api/taches/:id/assign` | **manager** | affecter la tâche à un utilisateur |

## Recherche et tri

Paramètres disponibles sur `GET /api/projets` et `GET /api/taches` :

| Paramètre | Description | Exemple |
|---|---|---|
| `search` | recherche sur le nom/titre et la description | `?search=site` |
| `statut` | filtre par statut | `?statut=doing` |
| `projet` | (tâches) filtre par projet | `?projet=<id>` |
| `sort` | champ de tri | `?sort=nom` |
| `order` | `asc` ou `desc` (défaut) | `?order=asc` |

Exemple : `GET /api/projets?search=site&sort=nom&order=asc`

## Valeurs autorisées

- **Statut d'un projet** : `en cours`, `termine`, `en pause`
- **Statut d'une tâche** : `todo`, `doing`, `done`
- **Rôle** : `user`, `manager`

## Codes de réponse

| Code | Signification |
|---|---|
| 200 / 201 | succès |
| 400 | données invalides (champ manquant, statut inconnu, doublon) |
| 401 | token absent ou invalide |
| 403 | droits insuffisants |
| 404 | ressource introuvable |
| 500 | erreur interne |
