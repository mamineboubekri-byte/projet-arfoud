# 📄 CDC Section IV : Plan de Travail Détaillé & Jalons (MVP)

## IV.1. Définition des Jalons (Phases du Projet)

Ce plan segmente le développement du Produit Minimum Viable (MVP) en quatre phases MERN logiques.

| Jalon (Phase) | Objectif Principal | Livrable du Jalon | Durée Estimée (Indicative) |
| :--- | :--- | :--- | :--- |
| **Jalon 1 : Fondation & Infrastructure** | Mise en place de l'environnement de développement et de la couche sécurité. | **API d'Authentification Fonctionnelle** (avec rôles Client/Partenaire/Admin). | 2 Semaines |
| **Jalon 2 : Cœur de Produit (API REST)** | Développement de la logique métier (CRUD) pour les offres Standard et Luxe. | **API REST Complète** (Gestion des Produits, Réservations, Leads Luxe). | 3 Semaines |
| **Jalon 3 : Frontend (Espace Client)** | Développement de l'interface utilisateur publique. | **Interface Client Fonctionnelle** (Recherche, Détail Produit, Workflow de Réservation). | 4 Semaines |
| **Jalon 4 : Extranet & Administration** | Création des interfaces de gestion pour les partenaires et l'équipe Arfoud. | **Extranet Partenaire & Dashboard Admin** (Gestion d'inventaire et suivi des commandes/leads). | 4 Semaines |

## IV.2. Le Kanban du Démarrage (Tâches Initiales)

Ces tâches sont à ouvrir comme des 'Issues' dans notre dépôt Git pour commencer le travail.

| Tâche (Code) | Catégorie | Description de la Tâche | Assignation (Initial) | Jalon Cible |
| :--- | :--- | :--- | :--- | :--- |
| **T.ADM.01** | Documentation | Créer le dépôt Git (Init) et copier-coller les documents du CdC (`.md`). | Fondateur (Vous) | 1 |
| **T.INF.01** | Infrastructure | Créer les comptes Free Tier (MongoDB Atlas, Vercel/Netlify, Render) et obtenir les clés. | Fondateur (Vous) | 1 |
| **T.INF.02** | Infrastructure | Initier le projet Node.js (`npm init`) et installer les dépendances clés (Express.js, dotenv). | Développeur | 1 |
| **T.DB.01** | Base de Données | Connecter l'application Express à MongoDB Atlas. | Développeur | 1 |
| **T.AUTH.01** | Backend (API) | Implémenter le hachage des mots de passe avec **bcrypt.js** (Open Source). | Développeur | 1 |
| **T.AUTH.02** | Backend (API) | Créer le service d'enregistrement des utilisateurs (`users` collection), en incluant le champ `role` (Client, Partner, Admin). | Développeur | 1 |
| **T.AUTH.03** | Backend (API) | Implémenter le service de connexion et la génération de tokens JWT (JSON Web Tokens) pour la sécurité. | Développeur | 1 |
| **T.ADM.02** | Qualité de Code | Mettre en place **ESLint** et **Prettier** pour uniformiser le style de code de l'équipe (Open Source). | Développeur | 1 |

## IV.3. Directives pour l'Intégration d'Équipe

### Intégration Technique
* **Uniformité :** Utilisation obligatoire d'ESLint et Prettier.
* **Branches :** Utiliser la stratégie Git : `main` (production), `develop` (intégration), `feature/X` (nouvelles tâches).
* **Lancement :** Le `README.md` doit contenir des instructions claires pour lancer l'application (`npm install`, `npm start`).

### Intégration Commerciale
* **Référence Fonctionnelle :** Le document `CDC_Section_II_Fonctionnel.md` est le document de référence du produit.
* **Suivi :** L'avancement est suivi via le **Kanban/Issues** dans le dépôt Git.

### Note de Trésorerie
* **Statut :** Budget Actuel : **0 €**. (Toute solution doit être Free Tier/Open Source).
