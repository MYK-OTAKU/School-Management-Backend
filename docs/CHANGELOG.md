# 📝 Changelog - School Management Backend

## [En développement] - 2025-10-12

### ✨ Ajouté
- Initialisation des fichiers TODO et CHANGELOG pour le suivi des développements
- Module SchoolYear complet (migration, modèle, service, contrôleur, routes)
- Module ClassRoom & ClassGroup (migrations, modèles, services, contrôleur, routes, permissions)
- Tests Jest dédiés aux modules SchoolYear et ClassRoom/ClassGroup (en attente d'environnement de test fonctionnel)

### 🔧 Modifié
- Rien pour le moment

### 🐛 Corrigé
- Aucun correctif à ce stade

### ⚠️ Problèmes connus
- Exécution globale de `npm test` échouée (absence de base de test disponible pour les suites Jest)
- Suites ClassRoom/ClassGroup bloquées pour la même raison

## [0.1.0] - 2025-10-12

### ✨ Initial
- Base MalianDevs Template Backend fonctionnelle
- Authentification JWT + 2FA active
- Système de rôles et permissions opérationnel
- Middlewares de sécurité et audit en place
