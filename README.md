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
