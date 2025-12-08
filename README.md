#  Gestion des Comptes Payables - PhenixMation

Application web de gestion des factures et comptes payables développée avec React, TypeScript et Express.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8.svg)


##  Description

**Gestion des Comptes Payables** est une application web moderne permettant de gérer efficacement les factures fournisseurs. L'application offre une interface intuitive pour créer, modifier, consulter et rechercher des factures, avec un système d'authentification sécurisé et une gestion multi-utilisateurs.

### Caracteristique
-  Interface utilisateur moderne et responsive
-  Gestion complète du cycle de vie des factures
-  Système d'authentification sécurisé avec JWT
-  Support multilingue Français et Anglais
-  Calcul automatique des taxes et totaux
-  Gestion détaillée des articles par facture

---

##  Fonctionnalités

### Gestion des factures
-  **Créer** une nouvelle facture avec articles multiples
-  **Modifier** une facture existante
-  **Consulter** les détails d'une facture
-  **Rechercher** une facture par numéro
-  **Lister** toutes les factures avec pagination

### Gestion des articles
- Ajout , suppression d'articles dynamique
- Calcul automatique des totaux HT, TVA et TTC
- Support de multiples taux de TVA

### Authentification et sécurité
-  Connexion sécurisée avec JWT
-  Protection des routes
-  Gestion de session avec expiration automatique
-  Déconnexion automatique en cas de jeton invalide

### Interface utilisateur
-  Support bilingue Français et Anglais
-  Design responsive mobile, tablette, desktop
-  Interface moderne avec TailwindCSS
-  Navigation fluide avec React Router

---

##  Technologies utilisées

### Frontend
- **React 18** - Framework JavaScript
- **TypeScript** - Typage statique
- **React Router 6** - Navigation
- **Axios** - Requêtes HTTP
- **React-Intl** - Internationalisation
- **TailwindCSS** - Styling

### Backend (API)
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification

---

##  Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** version 18.x ou supérieure - [Télécharger](https://nodejs.org/)
- **npm** version 9.x ou supérieure - Inclus avec Node.js
- **MongoDB** version 6.x ou supérieure - [Télécharger](https://www.mongodb.com/try/download/community)
- **Git** - [Télécharger](https://git-scm.com/)

### Vérification des versions
```bash
node --version  # Devrait afficher v18.x ou supérieur
npm --version   # Devrait afficher 9.x ou supérieur
mongo --version # Devrait afficher 6.x ou supérieur
```

---

##  Installation

### 1. Cloner le projet

```bash
git clone https://github.com/votre-utilisateur/gestion-comptes-payables.git
cd gestion-comptes-payables
```

### 2. Installer les dépendances du Frontend

```bash
# Naviguer dans le dossier AutomatisationFacture
npm install
```

**Dépendances principales installées :**
- react
- react-dom
- react-router-dom
- axios
- react-intl
- typescript
- vite
- tailwindcss

### 3. Installer les dépendances du Backend

```bash
# Naviguer dans le dossier Projet Automatisation API
git clone a venir: 
cd gestion-comptes-payables-API
npm install
```

**Dépendances principales du backend :**
- express
- mongoose
- jsonwebtoken
- bcrypt
- cors
- dotenv

---

##  Configuration
```

###  Initialiser la base de données

```bash
# Démarrer MongoDB 
mongod

```

---

##  Démarrage

### Démarrer le Backend API

```bash
# Dans le dossier AutomatisationFacture
npm run dev


# Le serveur démarre sur http://localhost:3000
```

### Démarrer le Frontend

```bash
# À la racine du projet frontend
npm run dev

# L'application démarre sur http://localhost:5173
```

### Accéder à l'application

Ouvrir votre navigateur et accéder à :
```
http://localhost:5173
```

---

##  Informations d'authentification
# Exemple d 'utilisateur pour l authentification: 

### Comptes de test

Pour vous connecter à l'application, utilisez l'un des comptes suivants :


```
 # email: 'alice.dupont@entreprise.com',
 # motDePasse: 'motdepasse_hashé_admin',
```
```

### Notes importantes sur l'authentification

1. **Jeton JWT** : Le jeton d'authentification est stocké dans le `localStorage` du navigateur
2. **Durée de validité** : Le jeton expire après 24 heures (configurable dans `.env`)
3. **Déconnexion automatique** : L'application vous déconnecte automatiquement si le jeton est invalide ou expiré
4. **Sécurité** : En production, changez impérativement le `JWT_SECRET` dans le fichier `.env`



##  Utilisation

###  Connexion

1. Accéder à `http://localhost:5173/login`
2. Entrer vos identifiants voir section [Authentification](#-informations-dauthentification)
3. Cliquer sur "Se connecter"

###  Navigation

- **Liste des factures** : Vue d'ensemble de toutes les factures
- **Ajouter une facture** : Créer une nouvelle facture avec articles
- **Filtrer par numéro** : Rechercher une facture spécifique
- **Modifier** : Cliquer sur "Modifier" dans la liste ou les détails
- **Détails** : Cliquer sur "Détails" pour voir toutes les informations

### Créer une facture

1. Cliquer sur "➕ Ajouter une Facture"
2. Remplir les informations générales :
   - Date de facture
   - Date d'échéance
   - Statut (En attente, Payée, Annulée)
   - Mode de paiement
3. Ajouter des articles :
   - Description
   - Quantité
   - Prix unitaire HT
   - Taux de TVA
4. Les totaux se calculent automatiquement
5. Cliquer sur "Créer la Facture"

### 4. Modifier une facture

1. Trouver la facture dans la liste ou par recherche
2. Cliquer sur "Modifier"
3. Modifier les informations souhaitées
4. Cliquer sur "Sauvegarder et Mettre à Jour"

### 5. Changer de langue

Cliquer sur les boutons **FR** / **EN** dans la barre de navigation pour basculer entre le français et l'anglais.

---

##  Internationalisation

L'application supporte deux langues :

### Langues disponibles
- 🇫🇷 **Français** (par défaut)
- 🇬🇧 **English**

### Fichiers de traduction

Les traductions sont gérées avec **React-Intl** :
- `src/lang/fr.json` - Traductions françaises
- `src/lang/en.json` - Traductions anglaises

### Ajouter une nouvelle traduction

1. Ajouter la clé dans `fr.json` :
```json
{
  "nouvelle.cle": "Texte en français"
}
```

2. Ajouter la même clé dans `en.json` :
```json
{
  "nouvelle.cle": "Text in English"
}
```

3. Utiliser dans le code :
```tsx
<FormattedMessage 
  id="nouvelle.cle" 
  defaultMessage="Texte en français" 
/>
```

---

##  API Backend

### URL de base
```
http://localhost:3000/api
```

### Endpoints principaux

#### Authentification
```http
POST /api/generatetoken
Content-Type: application/json

{
  "userLogin": {
    "email": "alice.dupont@entreprise.com",
    "motDePasse": "motdepasse_hashé_admin"
  }
}
```

#### Factures
```http
# Liste toutes les factures
GET /api/factures
Authorization: Bearer <token>

# Récupère une facture par numéro
GET /api/factures/:numeroFacture
Authorization: Bearer <token>

# Créer une nouvelle facture
POST /api/factures
Authorization: Bearer <token>
Content-Type: application/json

# Mettre à jour une facture
PUT /api/factures
Authorization: Bearer <token>
Content-Type: application/json
```

#### Utilisateurs
```http
# Liste tous les utilisateurs
GET /api/utilisateurs
Authorization: Bearer <token>
```

### Format de données Facture

```json
{
  "facture": {
    "numeroFacture": 100029,
    "dateFacture": "2024-01-15",
    "dateEcheance": "2024-02-15",
    "fournisseurId": "60c72b2f9f1b2e0015b6d9e0",
    "utilisateurId": "60c72b2f9f1b2e0015b6d9e1",
    "montantHT": 1000.00,
    "montantTVA": 50.00,
    "montantTTC": 1050.00,
    "devise": "CAD",
    "statut": "En attente",
    "modePaiement": "Virement",
    "articles": [
      {
        "description": "Service de consultation",
        "quantite": 10,
        "prixUnitaire": 100.00,
        "tauxTVA": 5.0,
        "totalLigne": 1050.00
      }
    ],
    "notes": "Facture pour services de consultation"
  }
}
```

---

##  Dépannage

### Problèmes courants

####  Erreur de connexion à MongoDB
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution** : Assurez-vous que MongoDB est démarré
```bash
mongod
```

####  Erreur "Cannot find module 'react-intl'"
```bash
npm install react-intl
```

#### 3. Port déjà utilisé
```
Error: Port 3000 is already in use
```
**Solution** : Changer le port dans `.env` ou tuer le processus
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F


#### 4. Jeton JWT invalide
**Solution** : Déconnectez-vous et reconnectez-vous. Vérifiez que le `JWT_SECRET` est le même entre le frontend et le backend.

---

## Scripts disponibles

### Frontend
```bash
npm run dev          # Démarrer en mode développement

```

### Backend
```bash
npm run dev          # Démarrer avec nodemon 

```

---

## Déploiement en production

### 1. Construire le frontend
```bash
npm run build
```

### 2. Configurer les variables d'environnement
- Changer `JWT_SECRET` pour une valeur sécurisée
- Mettre à jour `MONGODB_URI` avec l'URL de production
- Configurer `NODE_ENV=production`

### 3. Déployer
Les fichiers de build se trouvent dans le dossier `dist/`

---

## Auteur
# bady pascal Fouowa
**PhenixMation**
- Projet: Gestion des Comptes Payables
- Cours: Développement Web 3 (420-5A5-VI)
- Institution: Cégep de Victoriaville

---

## Licence

Ce projet est développé dans un cadre pédagogique.

---

## Remerciements

- **React Team** pour le framework React
- **Vercel** pour Vite
- **TailwindCSS** pour le système de design
- **FormatJS** pour React-Intl
- **Cégep de Victoriaville** pour l'enseignement
- **Etienne Rivard pour le survie permanat**

---

## Support

Pour toute question ou problème :
1. Consultez la section [Dépannage](#-dépannage)
2. Vérifiez les logs du serveur backend
3. Vérifiez la console du navigateur 

---

**Dernière mise à jour** : Décembre 2025
**Version** : 1.0.0