# 🚀 MalianDevs Template Backend

## 📋 Table des matières
- [Description](#-description)
- [Architecture du Projet](#-architecture-du-projet)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Démarrage](#-démarrage)
- [Fonctionnalités](#-fonctionnalités)
- [Endpoints API](#-endpoints-api)
- [Exemples CRUD](#-exemples-crud)
- [Comprendre le Projet](#-comprendre-le-projet)
- [Structure des Fichiers](#-structure-des-fichiers)
- [Tests](#-tests)
- [Dépannage](#-dépannage)
[![zread](https://img.shields.io/badge/Ask_Zread-_.svg?style=flat&color=00b0aa&labelColor=000000&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQuOTYxNTYgMS42MDAxSDIuMjQxNTZDMS44ODgxIDEuNjAwMSAxLjYwMTU2IDEuODg2NjQgMS42MDE1NiAyLjI0MDFWNC45NjAxQzEuNjAxNTYgNS4zMTM1NiAxLjg4ODEgNS42MDAxIDIuMjQxNTYgNS42MDAxSDQuOTYxNTZDNS4zMTUwMiA1LjYwMDEgNS42MDE1NiA1LjMxMzU2IDUuNjAxNTYgNC45NjAxVjIuMjQwMUM1LjYwMTU2IDEuODg2NjQgNS4zMTUwMiAxLjYwMDEgNC45NjE1NiAxLjYwMDFaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00Ljk2MTU2IDEwLjM5OTlIMi4yNDE1NkMxLjg4ODEgMTAuMzk5OSAxLjYwMTU2IDEwLjY4NjQgMS42MDE1NiAxMS4wMzk5VjEzLjc1OTlDMS42MDE1NiAxNC4xMTM0IDEuODg4MSAxNC4zOTk5IDIuMjQxNTYgMTQuMzk5OUg0Ljk2MTU2QzUuMzE1MDIgMTQuMzk5OSA1LjYwMTU2IDE0LjExMzQgNS42MDE1NiAxMy43NTk5VjExLjAzOTlDNS42MDE1NiAxMC42ODY0IDUuMzE1MDIgMTAuMzk5OSA0Ljk2MTU2IDEwLjM5OTlaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik0xMy43NTg0IDEuNjAwMUgxMS4wMzg0QzEwLjY4NSAxLjYwMDEgMTAuMzk4NCAxLjg4NjY0IDEwLjM5ODQgMi4yNDAxVjQuOTYwMUMxMC4zOTg0IDUuMzEzNTYgMTAuNjg1IDUuNjAwMSAxMS4wMzg0IDUuNjAwMUgxMy43NTg0QzE0LjExMTkgNS42MDAxIDE0LjM5ODQgNS4zMTM1NiAxNC4zOTg0IDQuOTYwMVYyLjI0MDFDMTQuMzk4NCAxLjg4NjY0IDE0LjExMTkgMS42MDAxIDEzLjc1ODQgMS42MDAxWiIgZmlsbD0iI2ZmZiIvPgo8cGF0aCBkPSJNNCAxMkwxMiA0TDQgMTJaIiBmaWxsPSIjZmZmIi8%2BCjxwYXRoIGQ9Ik00IDEyTDEyIDQiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K&logoColor=ffffff)](https://zread.ai/MYK-OTAKU/MalianDevs-Template-Backend)
---

## 📖 Description

**MalianDevs Template Backend** est un backend complet, sécurisé et modulaire conçu pour servir de base universelle à tous types d'applications métiers (restaurant, école, gaming center, e-commerce, etc.). Il offre une architecture moderne basée sur Node.js, Express et Sequelize.

Ce template est **prêt à l'emploi** et contient toutes les fonctionnalités essentielles pour démarrer rapidement un nouveau projet.

### 🎯 Points forts
- ✅ **Authentification complète** : JWT, 2FA (authentification à deux facteurs)
- ✅ **Gestion des rôles et permissions** : Système hiérarchique flexible (Administrateur > Manager > Utilisateur)
- ✅ **Audit et monitoring** : Traçage complet des activités utilisateurs
- ✅ **Sessions utilisateur** : Gestion sécurisée des sessions avec tracking IP
- ✅ **Paramètres dynamiques** : Configuration personnalisable par utilisateur et globale
- ✅ **Architecture SOLID** : Code maintenable, modulaire et évolutif
- ✅ **Multi-base de données** : Support PostgreSQL, MySQL, SQLite
- ✅ **Exemples CRUD complets** : Produits (simple) et Commandes (relationnel)
- ✅ **Documentation complète** : Chaque fichier est documenté et expliqué
- ✅ **Script de seed** : Initialisation automatique avec admin, rôles et permissions

---

## 🏗️ Architecture du Projet

Ce projet suit une architecture **MVC (Model-View-Controller)** avec une séparation claire des responsabilités :

```
Backend
│
├── Models (Modèles)      → Définition de la structure des données
├── Controllers           → Logique métier et traitement des requêtes
├── Services              → Logique réutilisable et opérations complexes
├── Routes                → Définition des endpoints API
├── Middlewares           → Fonctions intermédiaires (auth, validation, etc.)
└── Utils                 → Fonctions utilitaires
```

---

## 🔧 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** version 16 ou supérieure ([Télécharger](https://nodejs.org/))
- **npm** ou **yarn** (inclus avec Node.js)
- **PostgreSQL** (optionnel, si vous n'utilisez pas SQLite) ([Télécharger](https://www.postgresql.org/download/))
- Un éditeur de code (VS Code recommandé)

---

## 📦 Installation

### 1️⃣ Cloner le dépôt

```bash
git clone https://github.com/MYK-OTAKU/MalianDevs-Template-Backend.git
cd MalianDevs-Template-Backend
```

### 2️⃣ Installer les dépendances

```bash
npm install
```

Cette commande installe toutes les dépendances nécessaires listées dans `package.json`.

---

## ⚙️ Configuration

### 1️⃣ Créer le fichier de configuration

Copiez le fichier d'exemple `.env.example` et renommez-le en `.env` :

```bash
cp .env.example .env
```

### 2️⃣ Configurer les variables d'environnement

Ouvrez le fichier `.env` et modifiez les valeurs selon votre environnement :

#### **Configuration de base**
```env
# Type de base de données : 'sqlite' ou 'postgres'
DB_TYPE=sqlite

# Port du serveur
PORT=3000

# Environnement : 'development' ou 'production'
NODE_ENV=development

# Configuration JWT (Tokens d'authentification)
JWT_SECRET=votre_cle_secrete_super_longue_et_complexe
JWT_EXPIRES_IN=24h

# CORS - Autoriser les requêtes depuis votre frontend
CORS_ORIGIN=http://localhost:5173
```

#### **Option A : SQLite (Base de données locale - Recommandé pour débuter)**
```env
DB_TYPE=sqlite
SQLITE_PATH=./database.sqlite
```

#### **Option B : PostgreSQL (Production - Neon, Supabase, etc.)**
```env
DB_TYPE=postgres
DATABASE_URL=postgresql://user:password@host:5432/database_name

# OU configuration détaillée
DB_NAME=dashboard_template_db
DB_USER=votre_username
DB_PASSWORD=votre_password
DB_HOST=localhost
DB_PORT=5432
```

#### **Configuration Email (Optionnel)**
Pour l'envoi d'emails (réinitialisation de mot de passe, notifications) :
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_application
```

---

## 🚀 Démarrage

### 1️⃣ Initialiser la base de données

Avant le premier lancement, exécutez le script de seed pour créer l'admin, les rôles et permissions :

```bash
npm run seed
```

Vous obtiendrez :
```
🎉 Peuplement terminé avec succès!

📋 Récapitulatif:
   - Rôles: Administrateur, Manager, Utilisateur
   - Permissions: Toutes les permissions de base
   - Admin: admin / Admin123!
```

**Identifiants par défaut** :
- Username: `admin`
- Password: `Admin123!`
- Email: `admin@maliandevs.com`

### 2️⃣ Mode développement (avec rechargement automatique)

```bash
npm run dev
```

Cette commande démarre le serveur avec **nodemon** qui redémarre automatiquement le serveur à chaque modification de code.

### 3️⃣ Mode production

```bash
npm start
```

### Vérifier que le serveur fonctionne

Une fois démarré, vous devriez voir dans la console :

```
🚀 [APP] Serveur démarré avec succès sur http://localhost:3000
✅ [APP] Toutes les initialisations terminées
📊 [APP] Application prête à recevoir des requêtes
```

Testez avec :
```bash
curl http://localhost:3000/
```

Réponse attendue :
```json
{
  "success": true,
  "message": "🚀 MalianDevs Template Backend is running successfully",
  "version": "1.0.0",
  "environment": "development"
}
```

---

## ✨ Fonctionnalités

### 1. **Authentification et Sécurité**
- Inscription et connexion utilisateur
- JWT (JSON Web Tokens) pour l'authentification
- Authentification à deux facteurs (2FA) avec Google Authenticator
- Gestion sécurisée des sessions
- Déconnexion et invalidation des tokens

### 2. **Gestion des Utilisateurs**
- CRUD complet (Create, Read, Update, Delete)
- Profils utilisateurs
- Activation/Désactivation de comptes
- Changement de rôles (avec contrôle hiérarchique)

### 3. **Système de Rôles et Permissions**
- Rôles hiérarchiques : Administrateur > Manager > Employé
- Permissions granulaires
- Attribution dynamique de permissions aux rôles
- Contrôle d'accès basé sur les rôles (RBAC)

### 4. **Monitoring et Audit**
- Logs d'activité détaillés
- Suivi des sessions actives
- Historique des connexions
- Statistiques d'utilisation
- Traçabilité complète des actions

### 5. **Paramètres Dynamiques**
- Configuration globale de l'application
- Préférences utilisateur
- Paramètres publics et privés

---

## 🔌 Endpoints API

Tous les endpoints sont préfixés par `/api`. Voici la liste complète organisée par module :

### 🔐 Authentification (`/api/auth`)

| Méthode | Endpoint | Description | Auth requise |
|---------|----------|-------------|--------------|
| `POST` | `/api/auth/login` | Connexion utilisateur | ❌ Non |
| `POST` | `/api/auth/verify-2fa` | Vérification du code 2FA | ❌ Non |
| `POST` | `/api/auth/logout` | Déconnexion | ✅ Oui |
| `POST` | `/api/auth/register` | Inscription (admin uniquement) | ✅ Oui + Permission |
| `GET` | `/api/auth/2fa/status` | Statut 2FA de l'utilisateur | ✅ Oui |
| `POST` | `/api/auth/2fa/enable` | Activer le 2FA | ✅ Oui |
| `POST` | `/api/auth/2fa/disable` | Désactiver le 2FA | ✅ Oui |
| `POST` | `/api/auth/2fa/regenerate` | Régénérer le secret 2FA | ✅ Oui |

#### Exemples de requêtes :

**Connexion**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin123!"
}

# Réponse
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 28800,
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": {
        "name": "Administrateur",
        "permissions": ["USERS_ADMIN", "ROLES_VIEW", ...]
      }
    }
  }
}
```

**Vérification 2FA**
```bash
POST /api/auth/verify-2fa
Content-Type: application/json

{
  "userId": 1,
  "code": "123456"
}
```

---

### 👥 Gestion des Utilisateurs (`/api/users`)

| Méthode | Endpoint | Description | Permission |
|---------|----------|-------------|------------|
| `GET` | `/api/users/profile` | Profil de l'utilisateur connecté | Authentifié |
| `GET` | `/api/users` | Liste de tous les utilisateurs | `USERS_VIEW` |
| `GET` | `/api/users/:id` | Détails d'un utilisateur | `USERS_VIEW` |
| `POST` | `/api/users` | Créer un utilisateur | `USERS_ADMIN` |
| `PUT` | `/api/users/:id` | Modifier un utilisateur | `USERS_ADMIN` |
| `DELETE` | `/api/users/:id` | Supprimer un utilisateur | `USERS_ADMIN` |
| `PUT` | `/api/users/:id/activate` | Activer un compte | `USERS_ADMIN` |
| `PUT` | `/api/users/:id/deactivate` | Désactiver un compte | `USERS_ADMIN` |
| `POST` | `/api/users/change-role` | Changer le rôle d'un utilisateur | `USERS_ADMIN` |

#### Exemples :

**Récupérer son profil**
```bash
GET /api/users/profile
Authorization: Bearer <votre_token>

# Réponse
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "firstName": "Admin",
    "lastName": "System",
    "email": "admin@example.com",
    "role": {
      "name": "Administrateur"
    }
  }
}
```

**Créer un utilisateur**
```bash
POST /api/users
Authorization: Bearer <votre_token>
Content-Type: application/json

{
  "username": "nouveau_user",
  "password": "Password123!",
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@example.com",
  "roleId": 2
}
```

---

### 🛡️ Gestion des Rôles (`/api/roles`)

| Méthode | Endpoint | Description | Permission |
|---------|----------|-------------|------------|
| `GET` | `/api/roles` | Liste des rôles | `ROLES_VIEW` |
| `GET` | `/api/roles/:id` | Détails d'un rôle | `ROLES_VIEW` |
| `GET` | `/api/roles/:id/permissions` | Permissions d'un rôle | `ROLES_VIEW` |
| `POST` | `/api/roles` | Créer un rôle | Administrateur |
| `PUT` | `/api/roles/:id` | Modifier un rôle | Administrateur |
| `DELETE` | `/api/roles/:id` | Supprimer un rôle | Administrateur |
| `POST` | `/api/roles/:id/permissions` | Assigner des permissions | Administrateur |

#### Exemple :

**Lister les rôles**
```bash
GET /api/roles
Authorization: Bearer <votre_token>

# Réponse
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Administrateur",
      "description": "Accès complet au système"
    },
    {
      "id": 2,
      "name": "Manager",
      "description": "Gestion d'équipe et opérations"
    }
  ]
}
```

---

### 🔑 Gestion des Permissions (`/api/permissions`)

| Méthode | Endpoint | Description | Permission |
|---------|----------|-------------|------------|
| `GET` | `/api/permissions` | Liste des permissions | `PERMISSIONS_VIEW` |
| `GET` | `/api/permissions/:id` | Détails d'une permission | `PERMISSIONS_VIEW` |
| `POST` | `/api/permissions` | Créer une permission | Administrateur |
| `PUT` | `/api/permissions/:id` | Modifier une permission | Administrateur |
| `DELETE` | `/api/permissions/:id` | Supprimer une permission | Administrateur |

---

### 📊 Monitoring (`/api/monitoring`)

| Méthode | Endpoint | Description | Permission |
|---------|----------|-------------|------------|
| `GET` | `/api/monitoring/sessions` | Sessions actives | `ADMIN` |
| `DELETE` | `/api/monitoring/sessions/:sessionId` | Terminer une session | `ADMIN` |
| `GET` | `/api/monitoring/activities` | Logs d'activité | `ADMIN` |
| `GET` | `/api/monitoring/activities/stats` | Statistiques d'activité | `ADMIN` |
| `GET` | `/api/monitoring/activities/actions` | Actions disponibles | `ADMIN` |
| `GET` | `/api/monitoring/users/:userId/connections` | Historique connexions | `ADMIN` |
| `GET` | `/api/monitoring/users/:userId/activities` | Activités utilisateur | `ADMIN` |
| `GET` | `/api/monitoring/dashboard/stats` | Stats du dashboard | `ADMIN` |

#### Exemple :

**Récupérer les sessions actives**
```bash
GET /api/monitoring/sessions
Authorization: Bearer <votre_token>

# Réponse
{
  "success": true,
  "data": {
    "activeSessions": [
      {
        "id": 1,
        "userId": 1,
        "user": {
          "username": "admin",
          "firstName": "Admin"
        },
        "ipAddress": "127.0.0.1",
        "userAgent": "Mozilla/5.0...",
        "createdAt": "2024-10-06T10:30:00.000Z",
        "isActive": true
      }
    ],
    "total": 1
  }
}
```

---

### ⚙️ Paramètres (`/api/settings`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `GET` | `/api/settings/public` | Paramètres publics | ❌ Non |
| `GET` | `/api/settings/user/preferences` | Préférences utilisateur | ✅ Oui |
| `PUT` | `/api/settings/user/preferences` | Modifier préférences | ✅ Oui |
| `GET` | `/api/settings/admin/all` | Tous les paramètres | Admin + Permission |
| `POST` | `/api/settings/admin` | Créer un paramètre | Admin + Permission |
| `POST` | `/api/settings/admin/bulk` | Créer plusieurs paramètres | Admin + Permission |
| `PUT` | `/api/settings/admin/:key` | Modifier un paramètre | Admin + Permission |
| `DELETE` | `/api/settings/admin/:key` | Supprimer un paramètre | Admin + Permission |

### 📦 Gestion des Catégories (`/api/categories`)

| Méthode | Endpoint | Description | Permission |
|---------|----------|-------------|------------|
| `GET` | `/api/categories` | Liste des catégories | `CATEGORIES_VIEW` |
| `GET` | `/api/categories/:id` | Détails d'une catégorie | `CATEGORIES_VIEW` |
| `POST` | `/api/categories` | Créer une catégorie | `CATEGORIES_CREATE` |
| `PUT` | `/api/categories/:id` | Modifier une catégorie | `CATEGORIES_UPDATE` |
| `DELETE` | `/api/categories/:id` | Supprimer une catégorie | `CATEGORIES_DELETE` |
| `PATCH` | `/api/categories/:id/toggle` | Activer/Désactiver | `CATEGORIES_UPDATE` |
| `PUT` | `/api/categories/reorder` | Réorganiser l'ordre | `CATEGORIES_UPDATE` |

#### Exemples :

**Lister les catégories**
```bash
GET /api/categories
Authorization: Bearer <votre_token>

# Réponse
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Électronique",
        "description": "Appareils électroniques",
        "icon": "📱",
        "color": "#3B82F6",
        "isActive": true,
        "productsCount": 15
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "totalPages": 1
    }
  }
}
```

### 🛍️ Gestion des Produits (`/api/products`)

| Méthode | Endpoint | Description | Permission |
|---------|----------|-------------|------------|
| `GET` | `/api/products` | Liste des produits | `PRODUCTS_VIEW` |
| `GET` | `/api/products/:id` | Détails d'un produit | `PRODUCTS_VIEW` |
| `POST` | `/api/products` | Créer un produit | `PRODUCTS_CREATE` |
| `PUT` | `/api/products/:id` | Modifier un produit | `PRODUCTS_UPDATE` |
| `DELETE` | `/api/products/:id` | Supprimer un produit | `PRODUCTS_DELETE` |
| `PATCH` | `/api/products/:id/stock` | Mettre à jour le stock | `PRODUCTS_UPDATE` |

---

## 🎓 Exemples CRUD

Le template inclut trois exemples complets de CRUD pour vous aider à comprendre comment implémenter vos propres fonctionnalités.

### 📦 Exemple 1 : Categories (CRUD Simple)

Cet exemple montre un CRUD complet basique avec toutes les opérations standards pour la gestion des catégories.

**Endpoints disponibles** :
- `GET /api/categories` - Liste toutes les catégories (avec pagination, filtres)
- `GET /api/categories/:id` - Récupère une catégorie
- `POST /api/categories` - Crée une catégorie
- `PUT /api/categories/:id` - Modifie une catégorie
- `DELETE /api/categories/:id` - Supprime une catégorie
- `PATCH /api/categories/:id/toggle` - Active/désactive une catégorie
- `PUT /api/categories/reorder` - Réorganise l'ordre des catégories

**Fichiers concernés** :
- Model : `models/Category.js`
- Controller : `controllers/CategoryController.js`
- Routes : `routes/CategoryRoutes.js`

**Exemple de création de catégorie** :
```bash
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Électronique",
  "description": "Appareils électroniques et gadgets",
  "icon": "📱",
  "color": "#3B82F6",
  "isActive": true
}
```

### 🛍️ Exemple 2 : Products (CRUD Relationnel)

Cet exemple montre un CRUD avec relations (Product → Category) et gestion avancée.

**Endpoints disponibles** :
- `GET /api/products` - Liste tous les produits (avec pagination, filtres)
- `GET /api/products/:id` - Récupère un produit
- `POST /api/products` - Crée un produit
- `PUT /api/products/:id` - Modifie un produit
- `DELETE /api/products/:id` - Supprime un produit
- `PATCH /api/products/:id/stock` - Met à jour le stock

**Fichiers concernés** :
- Model : `models/Product.js`
- Service : `services/ProductService.js`
- Controller : `controllers/ProductController.js`
- Routes : `routes/ProductRoutes.js`

**Exemple de création de produit** :
```bash
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "description": "Smartphone Apple dernière génération",
  "price": 1199.99,
  "stock": 25,
  "categoryId": 1,
  "imageUrl": "https://example.com/iphone15.jpg",
  "isActive": true
}
```

### 🛒 Exemple 3 : Orders (CRUD Relationnel)

Cet exemple montre un CRUD avec relations (Order → OrderItems → Products).
Démontre comment gérer des entités liées avec transactions.

**Endpoints disponibles** :
- `GET /api/orders` - Liste toutes les commandes (avec produits inclus)
- `GET /api/orders/:id` - Récupère une commande détaillée
- `POST /api/orders` - Crée une commande avec produits
- `PATCH /api/orders/:id/status` - Change le statut
- `DELETE /api/orders/:id` - Supprime une commande
- `GET /api/orders/user/my-orders` - Mes commandes

**Fichiers concernés** :
- Models : `models/Order.js`, `models/OrderItem.js`
- Service : `services/OrderService.js`
- Controller : `controllers/OrderController.js`
- Routes : `routes/OrderRoutes.js`

**Exemple de création de commande** :
```bash
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "uuid-du-produit-1",
      "quantity": 2
    },
    {
      "productId": "uuid-du-produit-2",
      "quantity": 1
    }
  ],
  "notes": "Livraison express"
}
```

**Caractéristiques du CRUD Order** :
- Gestion automatique du stock produit
- Calcul automatique du total
- Génération de numéro de commande unique
- Gestion des statuts (pending, confirmed, processing, shipped, delivered, cancelled)
- Restauration du stock en cas d'annulation
- Inclusions automatiques (user, products) dans les réponses

### 🔧 Comment utiliser ces exemples

Ces exemples sont **complètement fonctionnels** et **protégés par permissions**. Vous pouvez :

1. **Les utiliser tels quels** dans votre application
2. **Les dupliquer** pour créer de nouvelles entités similaires
3. **Les étudier** pour comprendre les patterns utilisés
4. **Les modifier** selon vos besoins spécifiques

**Pour créer une nouvelle entité basée sur ces exemples** :
1. Copiez les fichiers (model, service, controller, routes)
2. Remplacez les noms (Product → YourEntity)
3. Ajoutez les permissions dans `utils/permissionsInit.js`
4. Enregistrez les routes dans `app.js`
5. Exécutez `npm run seed` pour créer les permissions

---

## 📚 Comprendre le Projet

Cette section explique en détail chaque composant du projet pour les débutants.

### 🗂️ Models (Modèles)

Les **models** définissent la structure de vos données et comment elles sont stockées dans la base de données.

**Localisation** : `/models/`

#### Modèles disponibles :

1. **User.js** - Utilisateurs
   - Contient : username, password, email, firstName, lastName, roleId, etc.
   - Relation : Un utilisateur appartient à un rôle

2. **Role.js** - Rôles
   - Contient : name, description
   - Exemple : "Administrateur", "Manager", "Employé"

3. **Permission.js** - Permissions
   - Contient : name, description
   - Exemple : "USERS_VIEW", "USERS_ADMIN", "ROLES_VIEW"

4. **RolePermission.js** - Table de liaison
   - Relie les rôles aux permissions (relation many-to-many)

5. **UserSession.js** - Sessions utilisateur
   - Suit les connexions : token, ipAddress, userAgent, isActive

6. **ActivityLog.js** - Logs d'activité
   - Enregistre toutes les actions : action, userId, resourceType, details

7. **Settings.js** - Paramètres
   - Configuration dynamique : key, value, type, scope

**Exemple simple** :
```javascript
// Un modèle User simplifié
{
  id: 1,
  username: "john_doe",
  email: "john@example.com",
  roleId: 2, // Référence au rôle
  isActive: true
}
```

---

### 🎮 Controllers (Contrôleurs)

Les **controllers** contiennent la logique métier. Ils traitent les requêtes HTTP, appellent les services si nécessaire, et retournent les réponses.

**Localisation** : `/controllers/`

#### Contrôleurs disponibles :

1. **AuthController.js** - Authentification
   - `login()` : Vérifie les identifiants et génère un token JWT
   - `register()` : Crée un nouveau compte
   - `logout()` : Invalide la session
   - `enableTwoFactor()` : Active le 2FA
   - `verifyTwoFactor()` : Vérifie le code 2FA

2. **userController.js** - Gestion utilisateurs
   - `getAllUsers()` : Liste tous les utilisateurs
   - `getUserById()` : Récupère un utilisateur spécifique
   - `createUser()` : Crée un utilisateur
   - `updateUser()` : Modifie un utilisateur
   - `deleteUser()` : Supprime un utilisateur
   - `changeUserRole()` : Change le rôle

3. **RoleController.js** - Gestion des rôles
   - `getAllRoles()` : Liste les rôles
   - `createRole()` : Crée un rôle
   - `assignPermissionsToRole()` : Assigne des permissions

4. **PermissionController.js** - Gestion des permissions
   - CRUD complet des permissions

5. **MonitoringController.js** - Surveillance
   - `getActiveSessions()` : Sessions actives
   - `getActivityLogs()` : Logs d'activité
   - `getUserConnectionHistory()` : Historique des connexions

6. **SettingsController.js** - Paramètres
   - `getPublicSettings()` : Paramètres publics
   - `getUserPreferences()` : Préférences utilisateur
   - `updateSetting()` : Modifier un paramètre

**Comment ça fonctionne** :
```javascript
// Exemple simplifié d'un controller
async login(req, res) {
  // 1. Récupérer les données de la requête
  const { username, password } = req.body;
  
  // 2. Appeler le service pour la logique métier
  const result = await AuthService.login(username, password);
  
  // 3. Retourner la réponse
  return res.status(200).json({
    success: true,
    data: result
  });
}
```

---

### 🔧 Services

Les **services** contiennent la logique métier complexe et réutilisable. Ils sont appelés par les controllers.

**Localisation** : `/services/`

#### Services disponibles :

1. **AuthService.js** - Service d'authentification
   - Logique de connexion, validation des mots de passe
   - Génération et vérification des tokens JWT
   - Gestion du 2FA (génération de secrets, QR codes)
   - Hachage sécurisé des mots de passe avec bcrypt

2. **AuditService.js** - Service d'audit
   - Enregistrement des activités dans ActivityLog
   - Création et gestion des sessions utilisateur
   - Nettoyage des sessions inactives
   - Traçabilité complète des actions

3. **NotificationService.js** - Service de notifications
   - Envoi de notifications (à développer)
   - Gestion des emails

**Principe de séparation** :
- **Controller** : Gère la requête HTTP
- **Service** : Contient la logique métier
- **Model** : Structure les données

**Exemple** :
```javascript
// Service AuthService
class AuthService {
  static async login(username, password, ipAddress, userAgent) {
    // 1. Chercher l'utilisateur
    const user = await User.findOne({ where: { username } });
    
    // 2. Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    // 3. Générer le token JWT
    const token = generateToken({ userId: user.id });
    
    // 4. Créer la session
    await AuditService.createSession(user.id, token, ipAddress, userAgent);
    
    return { token, user };
  }
}
```

---

### 🛣️ Routes

Les **routes** définissent les endpoints de votre API et les associent aux controllers.

**Localisation** : `/routes/`

**Structure d'une route** :
```javascript
// Exemple de AuthRoutes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { authenticate } = require('../middlewares/auth');

// Route publique (pas d'auth requise)
router.post('/login', AuthController.login);

// Route protégée (auth requise)
router.post('/logout', authenticate, AuthController.logout);

module.exports = router;
```

**Middlewares sur les routes** :
- `authenticate` : Vérifie que l'utilisateur est connecté
- `hasPermission('USERS_VIEW')` : Vérifie une permission spécifique
- `hasRole('Administrateur')` : Vérifie un rôle spécifique

---

### 🔐 Middlewares

Les **middlewares** sont des fonctions qui s'exécutent entre la requête et le controller.

**Localisation** : `/middlewares/`

#### Middlewares disponibles :

1. **auth.js** - Authentification
   - `authenticate` : Vérifie le token JWT
   - `hasPermission(permission)` : Vérifie une permission
   - `hasRole(role)` : Vérifie un rôle
   - `canManageUser()` : Vérifie la hiérarchie des rôles

2. **audit.js** - Audit
   - `trackUserSession` : Enregistre les activités
   - `logResourceActivity(resourceType)` : Log les actions sur une ressource

3. **sessionCheck.js** - Vérification de session
   - `checkActiveSession` : Vérifie que la session est active

4. **permissions.js** - Permissions
   - `checkPermission(permission)` : Alternative pour vérifier les permissions

5. **cors.js** - CORS
   - Configure les origines autorisées pour les requêtes

6. **responseSanitizer.js** - Nettoyage des réponses
   - Supprime les données sensibles des réponses

**Flux d'une requête avec middlewares** :
```
Requête HTTP
    ↓
[cors] - Vérifie l'origine
    ↓
[authenticate] - Vérifie le token
    ↓
[hasPermission] - Vérifie la permission
    ↓
[Controller] - Traite la requête
    ↓
[responseSanitizer] - Nettoie la réponse
    ↓
Réponse HTTP
```

---

### 🛠️ Utils (Utilitaires)

Les **utils** contiennent des fonctions utilitaires réutilisables.

**Localisation** : `/utils/`

#### Utilitaires disponibles :

1. **errorHandler.js** - Gestion des erreurs
   - Classe `AppError` pour les erreurs personnalisées
   - `ErrorTypes` : Erreurs standardisées avec codes
   - `errorMiddleware` : Middleware de gestion d'erreurs

2. **responseHandler.js** - Standardisation des réponses
   - Format uniforme pour toutes les réponses API

3. **jwt.js** - JWT
   - `generateToken(payload)` : Génère un token JWT
   - `verifyToken(token)` : Vérifie et décode un token

4. **permissionsInit.js** - Initialisation
   - `initDefaultRolesAndPermissions()` : Crée les rôles et permissions par défaut

5. **dataSanitizer.js** - Nettoyage des données
   - Supprime les données sensibles avant envoi

---

### ⚙️ Configuration

**Localisation** : `/config/`

1. **sequelize.js** - Configuration de la base de données
   - Connexion PostgreSQL ou SQLite
   - Export de l'instance Sequelize

2. **jwt.js** - Configuration JWT
   - Secret et durée d'expiration des tokens

---

## 📂 Structure des Fichiers

```
MalianDevs-Template-Backend/
│
├── 📁 config/              # Configuration (DB, JWT, etc.)
│   ├── sequelize.js
│   └── jwt.js
│
├── 📁 controllers/         # Contrôleurs (logique métier)
│   ├── AuthController.js
│   ├── userController.js
│   ├── RoleController.js
│   ├── PermissionController.js
│   ├── CategoryController.js
│   ├── ProductController.js
│   ├── OrderController.js
│   ├── MonitoringController.js
│   └── SettingsController.js
│
├── 📁 models/              # Modèles de données (Sequelize)
│   ├── User.js
│   ├── Role.js
│   ├── Permission.js
│   ├── RolePermission.js
│   ├── UserSession.js
│   ├── ActivityLog.js
│   ├── Settings.js
│   ├── Category.js
│   ├── Product.js
│   ├── Order.js
│   ├── OrderItem.js
│   └── index.js
│
├── 📁 routes/              # Routes API
│   ├── AuthRoutes.js
│   ├── userRoutes.js
│   ├── RoleRoutes.js
│   ├── PermissionRoutes.js
│   ├── CategoryRoutes.js
│   ├── ProductRoutes.js
│   ├── OrderRoutes.js
│   ├── MonitoringRoutes.js
│   └── SettingsRoutes.js
│
├── 📁 services/            # Services (logique réutilisable)
│   ├── AuthService.js
│   ├── AuditService.js
│   └── NotificationService.js
│
├── 📁 middlewares/         # Middlewares (auth, validation, etc.)
│   ├── auth.js
│   ├── audit.js
│   ├── sessionCheck.js
│   ├── permissions.js
│   ├── cors.js
│   └── responseSanitizer.js
│
├── 📁 utils/               # Fonctions utilitaires
│   ├── errorHandler.js
│   ├── responseHandler.js
│   ├── jwt.js
│   ├── dataSanitizer.js
│   └── permissionsInit.js
│
├── 📁 migrations/          # Migrations de base de données
├── 📁 tests/               # Tests unitaires et d'intégration
├── 📁 scripts/             # Scripts utilitaires
│
├── 📄 app.js               # Point d'entrée de l'application
├── 📄 initAndStart.js      # Script d'initialisation
├── 📄 package.json         # Dépendances et scripts
├── 📄 .env.example         # Exemple de configuration
├── 📄 .gitignore           # Fichiers à ignorer par Git
└── 📄 README.md            # Ce fichier
```

---

## 🧪 Tests

Le projet utilise **Jest** pour les tests.

### Exécuter les tests

```bash
# Tous les tests
npm test

# Tests avec surveillance (rerun automatique)
npm run test:watch

# Tests avec couverture de code
npm run test:coverage
```

### Structure des tests

Les tests sont dans le dossier `/tests/` et suivent la même structure que le code source.

---

## 🐛 Dépannage

### Problème : "Module not found"

**Solution** : Réinstallez les dépendances
```bash
rm -rf node_modules
npm install
```

### Problème : "Cannot connect to database"

**Solutions** :
1. Vérifiez votre fichier `.env`
2. Pour PostgreSQL : Vérifiez que la base de données existe
3. Pour SQLite : Vérifiez les permissions d'écriture

### Problème : "JWT Secret not configured"

**Solution** : Ajoutez `JWT_SECRET` dans votre `.env`
```env
JWT_SECRET=votre_cle_secrete_super_longue_et_complexe
```

### Problème : Port déjà utilisé

**Solution** : Changez le port dans `.env`
```env
PORT=3001
```

Ou arrêtez le processus qui utilise le port :
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Problème : "Permission denied" sur les routes

**Solution** : Vérifiez que :
1. Votre token est valide
2. Votre rôle a les permissions nécessaires
3. Le header Authorization est bien présent : `Bearer <token>`

---

## 📞 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Consultez la documentation des dépendances
- Vérifiez les logs dans la console

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commitez vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Pushez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

---

## 📄 Licence

ISC License

---

## 🎓 Concepts Clés pour Débutants

### Qu'est-ce qu'une API REST ?

Une **API REST** (Representational State Transfer) est une interface qui permet à des applications de communiquer entre elles via HTTP.

**Principes** :
- **Ressources** : Utilisateurs, Rôles, etc.
- **Méthodes HTTP** :
  - `GET` : Récupérer des données
  - `POST` : Créer des données
  - `PUT` : Modifier des données
  - `DELETE` : Supprimer des données
- **Stateless** : Chaque requête est indépendante
- **JSON** : Format d'échange de données

### Qu'est-ce que JWT ?

**JWT (JSON Web Token)** est un standard pour créer des tokens d'authentification.

**Structure** : `header.payload.signature`

**Exemple** :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYzMDAwMDAwMH0.signature
```

**Utilisation** :
1. L'utilisateur se connecte avec username/password
2. Le serveur génère un JWT
3. Le client envoie le JWT dans le header `Authorization: Bearer <token>`
4. Le serveur vérifie le JWT pour chaque requête

### Qu'est-ce que le 2FA ?

**2FA (Two-Factor Authentication)** ajoute une couche de sécurité en demandant un code temporaire en plus du mot de passe.

**Fonctionnement** :
1. L'utilisateur active le 2FA
2. Un QR code est généré (à scanner avec Google Authenticator)
3. À chaque connexion, l'utilisateur doit entrer le code à 6 chiffres

### Qu'est-ce que Sequelize ?

**Sequelize** est un ORM (Object-Relational Mapping) pour Node.js.

**Avantages** :
- Écrire du JavaScript au lieu de SQL
- Gestion automatique des relations
- Support de plusieurs bases de données

**Exemple** :
```javascript
// Au lieu de SQL : SELECT * FROM users WHERE id = 1
const user = await User.findByPk(1);
```

### Qu'est-ce que les Middlewares ?

Les **middlewares** sont des fonctions qui s'exécutent avant ou après le traitement d'une requête.

**Exemple** :
```javascript
// Middleware d'authentification
const authenticate = (req, res, next) => {
  // Vérifier le token
  if (!token) {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  // Continuer vers le controller
  next();
};
```

---

## 🚀 Aller Plus Loin

### Améliorations possibles

1. **Notifications en temps réel** avec Socket.io
2. **Upload de fichiers** (photos de profil)
3. **Réinitialisation de mot de passe** par email
4. **Rate limiting** pour prévenir les attaques
5. **Pagination** sur les listes
6. **Filtres avancés** sur les requêtes
7. **Exports** (CSV, PDF) des données

### Ressources d'apprentissage

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/fr/)
- [Sequelize Documentation](https://sequelize.org/)
- [JWT.io](https://jwt.io/)
- [REST API Best Practices](https://restfulapi.net/)

---

**Développé avec ❤️ par MalianDevs**

