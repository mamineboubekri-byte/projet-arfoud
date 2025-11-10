# 📄 CDC Section III : Architecture Technique (MERN Zéro Budget)

## III.1. Choix Technologiques MERN

Nous utilisons la pile MERN (MongoDB, Express.js, React, Node.js) pour sa flexibilité et le fait que tous les composants sont Open Source et gratuits.

| Composant (Lettre MERN) | Technologie | Note (Gratuit & Open Source) |
| :--- | :--- | :--- |
| **M** (Database) | **MongoDB Community / Atlas Free Tier** | Base de données NoSQL flexible. |
| **E** (Backend Framework) | **Express.js** | Framework minimaliste pour créer notre API REST. |
| **R** (Frontend Library) | **React.js** | Librairie pour les trois interfaces (Client, Partenaire, Admin). |
| **N** (Backend Runtime) | **Node.js** | Environnement d'exécution JavaScript côté serveur. |
| **Contrôle de Version** | **Git & GitHub/GitLab (Tier Gratuit)** | Outil de collaboration et de suivi des tâches. |

## III.2. Architecture de Déploiement (Infrastructure Zéro Budget)

L'objectif est d'utiliser les offres "Free Tier" des fournisseurs cloud pour l'hébergement initial du MVP :

* **Frontend (React) :** **Vercel** ou **Netlify** (Gratuit, CDN, Déploiement continu).
* **Backend API (Node/Express) :** **Render** ou **Heroku** (Gratuit, attention aux limites et au "sommeil").
* **Database (MongoDB) :** **MongoDB Atlas** (Shared Cluster Gratuit, Cloud).

## III.3. Schéma de Base de Données Initial

Le schéma ci-dessous est le minimum nécessaire pour supporter les fonctionnalités standard et luxe (Extranet inclus).

| Collection MongoDB | Rôle Principal | Liens Clés |
| :--- | :--- | :--- |
| **`users`** | Authentification, Profils, **Rôles (Client, Partner, Admin)**. | -> `partners` (1:1), `bookings` (1:N), `reviews` (1:N) |
| **`partners`** | Informations de l'opérateur touristique (Statut, Paiements). | -> `users` (1:1), `products` (1:N) |
| **`products`** | Activités/Excursions (Données brutes, Prix, Disponibilité). | -> `partners` (N:1), `bookings` (1:N) |
| **`bookings`** | Réservations Offres Standard (Historique des transactions). | -> `products`, `users` |
| **`reviews`** | Avis clients. | -> `products`, `users` |
| **`leads_luxe`** | Demandes Sur-Mesure (Extranet/Admin : Suivi des leads). | -> `users` |
