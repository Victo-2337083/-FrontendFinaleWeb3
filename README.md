# Gestion des Comptes Payables – PhenixMation

Application web de gestion des factures et des comptes payables, développée avec **React**, **TypeScript** et une **API Express sécurisée**.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8.svg)

---

## Description

**Gestion des Comptes Payables – PhenixMation** est une application web moderne destinée à la gestion des factures fournisseurs et des comptes payables. Elle offre une interface claire, performante et sécurisée permettant de gérer l’ensemble du cycle de vie des factures, de leur création jusqu’à leur consultation et mise à jour.

L’application repose sur une architecture client–serveur, avec un frontend React et une API REST sécurisée par JWT.
Exemple d utilisateur pret pour la connexion:
# url: en production https://frontendfinaleweb3-ad4m.onrender.com/login
{
  "userLogin": {
    "email": "ecomptable@api.com",
    "motDePasse": "ComptaPass123"
  }
}
# generer token : https://api-web3-2ww0.onrender.com/api/generatetoken

###  Caractéristiques principales
- Interface utilisateur moderne et responsive
- Gestion complète du cycle de vie des factures
- Authentification sécurisée par jetons JWT
- Gestion multi‑utilisateurs avec rôles
- Support multilingue (Français et Anglais)
- Calcul automatique des taxes et montants totaux
- Gestion détaillée des articles par facture

---

##  Fonctionnalités

### Gestion des factures
- Création de nouvelles factures avec articles multiples
- Modification des factures existantes
- Consultation détaillée des factures
- Recherche par numéro de facture
- Liste paginée des factures

### Gestion des articles
- Ajout et suppression dynamique d’articles
- Calcul automatique des montants HT, TVA et TTC
- Support de multiples taux de TVA

### Authentification et sécurité
- Connexion sécurisée par JWT
- Protection des routes sensibles
- Expiration automatique des sessions
- Déconnexion automatique en cas de jeton invalide ou expiré

### Interface utilisateur
- Support bilingue (FR et  EN)
- Design responsive 
- Interface moderne avec TailwindCSS
- Navigation fluide avec React Router

---

##  Technologies utilisées

### Frontend
- **React 18** – Bibliothèque UI
- **TypeScript** – Typage statique
- **React Router 6** – Navigation
- **Axios** – Requêtes HTTP
- **React‑Intl** – Internationalisation
- **TailwindCSS** – Mise en forme

### Backend (API)
- **Node.js** – Runtime JavaScript
- **Express** – Framework web
- **MongoDB** – Base de données NoSQL
- **Mongoose** – ODM MongoDB
- **JWT** – Authentification

---

##  Prérequis

 Logiciel

 Node.js  18.x 
 npm  9.x 
 MongoDB  6.x 
 Git  Dernière version 

### Vérification
```bash
node --version
npm --version
mongod --version
```

---

##  Installation

### 1. Cloner le projet frontend

```bash
git clone https://github.com/Victo-2337083/-FrontendFinaleWeb3.git
cd -FrontendFinaleWeb3
```

### 2. Installer les dépendances frontend

```bash
npm install
```

demarrage de l application: 
npm run dev


