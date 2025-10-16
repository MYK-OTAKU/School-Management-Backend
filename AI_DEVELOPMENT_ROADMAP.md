Basé sur l'analyse du document README existant et de la description détaillée du cahier des charges que vous avez fournie, je vais créer une feuille de route complète pour les IA de développement. Voici le fichier `.md` complet avec les instructions :

# 🧠 AI Development Roadmap - MINDEVS School Management Backend

> **INSTRUCTIONS CRITIQUES POUR L'IA :**
> 
> Ce fichier sert de feuille de route pour continuer le développement du backend de gestion d'école basé sur le **MalianDevs Template Backend**. 
> 
> **⚠️ RÈGLES IMPÉRATIVES :**
> - NE JAMAIS modifier les modules d'authentification, rôles, permissions existants
> - TOUJOURS respecter l'architecture MVC existante
> - METTRE À JOUR les fichiers `docs/TODO.md` et `docs/CHANGELOG.md` après chaque implémentation
> - SUIVRE les principes SOLID et Clean Architecture
> - DOCUMENTER chaque fichier créé avec son rôle et ses dépendances

---

## 📋 Contexte du projet

**Objectif :** Étendre le MalianDevs Template Backend pour créer une API complète de gestion d'école (primaire/collège/lycée).

**Base technique existante :**
- Node.js + Express.js
- Sequelize ORM (PostgreSQL/SQLite)
- JWT Authentication + 2FA
- Système de rôles et permissions fonctionnel
- Middlewares de sécurité et audit
- Structure MVC modulaire

**Architecture actuelle préservée :**
```
├── controllers/          ✅ Ne pas modifier AuthController, userController, etc.
├── models/              ✅ Ne pas modifier User, Role, Permission, etc.
├── services/            ✅ Ne pas modifier AuthService, AuditService
├── middlewares/         ✅ Ne pas modifier auth.js, permissions.js
├── routes/              ✅ Ne pas modifier AuthRoutes, userRoutes
├── utils/               ✅ Ne pas modifier errorHandler, jwt, etc.
└── config/              ✅ Ne pas modifier les configurations existantes
```

---

## 🎯 Règles de développement obligatoires

### 🚫 INTERDICTIONS ABSOLUES

1. **Ne jamais modifier :**
   - Les modules d'authentification (`AuthController`, `AuthService`, `AuthRoutes`)
   - La gestion des rôles et permissions existante
   - Les middlewares de sécurité (`auth.js`, `authorize.js`, `sessionCheck.js`)
   - Les utilitaires JWT et gestion d'erreurs
   - Le point d'entrée principal (`app.js`, `initAndStart.js`)

2. **Ne jamais supprimer :**
   - Aucun fichier existant du template
   - Aucune route ou endpoint existant
   - Aucune permission ou rôle déjà défini

### ✅ OBLIGATIONS STRICTES

1. **Méthodologie de développement continu :**
   - Créer et maintenir `docs/TODO.md` avec toutes les tâches
   - Créer et maintenir `docs/CHANGELOG.md` avec l'historique
   - Mettre à jour ces fichiers après CHAQUE implémentation de fonctionnalité
   - Format TODO : `[ ]` à faire, `[x]` terminé, avec date et description

2. **Architecture et code :**
   - Respecter STRICTEMENT l'architecture MVC existante
   - Appliquer les principes SOLID
   - Séparer la logique métier dans les services
   - Utiliser Sequelize ORM uniquement (aucune requête SQL brute)
   - Commenter CHAQUE fichier avec son rôle et ses dépendances

3. **Conventions de nommage :**
   - Fichiers : `student.controller.js`, `payment.service.js`
   - Classes : `StudentService`, `PaymentController`
   - Variables : `camelCase` (`studentId`, `totalAmount`)
   - Modèles : `PascalCase` (`Student`, `ClassRoom`)

4. **Tests et documentation :**
   - Créer des tests Jest pour chaque nouveau module
   - Documenter les endpoints avec Swagger
   - Fournir des exemples d'utilisation

---

## 🏗️ Architecture cible - Modules École

### 📚 Entités principales à implémenter

```
School Management System
│
├── 🎓 Académique
│   ├── SchoolYear (années scolaires)
│   ├── ClassRoom (classes: CE1, CM1, 6è)
│   ├── ClassGroup (groupes: CE1-A, CE1-B)
│   ├── Student (élèves)
│   ├── Enrollment (inscriptions par année)
│   ├── Teacher (professeurs)
│   ├── Subject (matières)
│   └── Timetable (emplois du temps)
│
├── 📊 Évaluation et Suivi
│   ├── Attendance (présences/absences)
│   ├── Grade (notes et évaluations)
│   └── Document (bulletins, attestations)
│
├── 💰 Finance
│   ├── Payment (paiements élèves)
│   ├── Receipt (reçus)
│   ├── Expense (dépenses école)
│   └── Payroll (salaires professeurs)
│
├── 🚌 Services
│   ├── Transport (bus scolaires)
│   ├── TransportAssignment (affectations transport)
│   └── Complaint (réclamations)
│
└── 📋 Administration
    ├── School (informations établissement)
    └── Settings (paramètres dynamiques)
```

### 🔐 Rôles et permissions à ajouter

```javascript
// À ajouter dans utils/permissionsInit.js
const SCHOOL_PERMISSIONS = [
  // Gestion élèves
  'STUDENTS_VIEW', 'STUDENTS_CREATE', 'STUDENTS_UPDATE', 'STUDENTS_DELETE',
  'ENROLLMENTS_MANAGE',
  
  // Gestion professeurs
  'TEACHERS_VIEW', 'TEACHERS_CREATE', 'TEACHERS_UPDATE', 'TEACHERS_DELETE',
  
  // Gestion classes
  'CLASSES_VIEW', 'CLASSES_CREATE', 'CLASSES_UPDATE', 'CLASSES_DELETE',
  'SUBJECTS_MANAGE', 'TIMETABLES_MANAGE',
  
  // Finance
  'PAYMENTS_VIEW', 'PAYMENTS_CREATE', 'PAYMENTS_UPDATE',
  'EXPENSES_VIEW', 'EXPENSES_CREATE', 'EXPENSES_UPDATE',
  'RECEIPTS_GENERATE', 'FINANCIAL_REPORTS',
  
  // Évaluation
  'GRADES_VIEW', 'GRADES_CREATE', 'GRADES_UPDATE',
  'ATTENDANCE_VIEW', 'ATTENDANCE_MARK',
  
  // Transport et services
  'TRANSPORT_MANAGE', 'COMPLAINTS_VIEW', 'COMPLAINTS_RESPOND',
  
  // Documents
  'DOCUMENTS_GENERATE', 'BULLETINS_CREATE',
  
  // Administration
  'SCHOOL_SETTINGS', 'SCHOOL_YEARS_MANAGE'
];

const SCHOOL_ROLES = [
  {
    name: 'Directeur',
    permissions: ['manage_all', ...SCHOOL_PERMISSIONS]
  },
  {
    name: 'Secrétaire',
    permissions: ['STUDENTS_VIEW', 'STUDENTS_CREATE', 'STUDENTS_UPDATE', 
                  'ENROLLMENTS_MANAGE', 'PAYMENTS_VIEW', 'PAYMENTS_CREATE']
  },
  {
    name: 'Comptable',
    permissions: ['PAYMENTS_VIEW', 'EXPENSES_VIEW', 'EXPENSES_CREATE',
                  'RECEIPTS_GENERATE', 'FINANCIAL_REPORTS']
  },
  {
    name: 'Professeur',
    permissions: ['GRADES_VIEW', 'GRADES_CREATE', 'ATTENDANCE_VIEW',
                  'ATTENDANCE_MARK', 'STUDENTS_VIEW']
  },
  {
    name: 'Parent',
    permissions: ['view_child_profile', 'view_receipts', 'download_documents']
  }
];
```

---

## 📊 Logique métier globale

### 🔄 Règle fondamentale : Multi-année scolaire

**CRITIQUE :** Toutes les données sont liées à une `schoolYearId`. Chaque requête DOIT filtrer par année scolaire active.

```javascript
// Exemple de service avec filtrage annuel
class StudentService {
  static async findAll(filters = {}) {
    const { schoolYearId = await getActiveSchoolYearId() } = filters;
    
    return Student.findAll({
      where: { schoolYearId, ...filters },
      include: [ClassGroup, ClassRoom]
    });
  }
}
```

### 🏫 Hiérarchie des entités

```
School (établissement)
└── SchoolYear (2024-2025)
    ├── ClassRoom (CE1, CM1, 6è)
    │   └── ClassGroup (CE1-A, CE1-B)
    │       └── Student (élèves)
    │           ├── Enrollment (inscription)
    │           ├── Payment (paiements)
    │           ├── Grade (notes)
    │           └── Attendance (présences)
    ├── Teacher (professeurs)
    │   ├── Subject (matières)
    │   └── Timetable (emploi du temps)
    └── Expense (dépenses)
```

### 💰 Logique de paiement

```javascript
// Calcul automatique des montants
calculatePaymentAmount(student, paymentType) {
  const baseAmount = student.ClassRoom.monthlyFee || 0;
  const discount = student.reductionPercent || 0;
  return baseAmount * (1 - discount / 100);
}

// Génération automatique de reçu
async createPayment(paymentData) {
  const payment = await Payment.create(paymentData);
  const receipt = await Receipt.create({
    paymentId: payment.id,
    fileUrl: await generateReceiptPDF(payment)
  });
  return { payment, receipt };
}
```

---

## 📁 Structure de fichiers à créer

### 🗃️ Modèles Sequelize (models/)

```javascript
// models/SchoolYear.js
module.exports = (sequelize, DataTypes) => {
  const SchoolYear = sequelize.define('SchoolYear', {
    name: { type: DataTypes.STRING, allowNull: false }, // "2024-2025"
    startDate: { type: DataTypes.DATE },
    endDate: { type: DataTypes.DATE },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: false }
  });
  return SchoolYear;
};

// models/Student.js
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    matricule: { type: DataTypes.STRING, unique: true },
    dob: { type: DataTypes.DATEONLY },
    gender: { type: DataTypes.ENUM('M','F','O') },
    reductionPercent: { type: DataTypes.FLOAT, defaultValue: 0 },
    status: { type: DataTypes.ENUM('active','graduated','inactive'), defaultValue: 'active' },
    schoolYearId: { type: DataTypes.INTEGER, allowNull: false },
    classGroupId: { type: DataTypes.INTEGER },
    classroomId: { type: DataTypes.INTEGER }
  });
  return Student;
};

// models/Payment.js
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    studentId: { type: DataTypes.INTEGER, allowNull: false },
    schoolYearId: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    type: { type: DataTypes.ENUM('inscription','mensualite','transport','autre') },
    method: { type: DataTypes.STRING },
    reference: { type: DataTypes.STRING },
    appliedDiscount: { type: DataTypes.FLOAT, defaultValue: 0 },
    balanceRemaining: { type: DataTypes.FLOAT, defaultValue: 0 },
    status: { type: DataTypes.ENUM('paid','partial','pending'), defaultValue: 'paid' }
  });
  return Payment;
};
```

### 🔧 Services (services/)

```javascript
// services/StudentService.js
/**
 * Service de gestion des élèves
 * Responsabilités : CRUD élèves, inscriptions, logique métier
 * Dépendances : models/Student, models/Enrollment, AuditService
 */
class StudentService {
  /**
   * Créer un élève et son inscription
   * @param {Object} studentData - Données de l'élève
   * @param {number} createdBy - ID de l'utilisateur créateur
   * @returns {Promise<Object>} - Élève créé avec inscription
   */
  static async createStudentWithEnrollment(studentData, createdBy) {
    const transaction = await sequelize.transaction();
    try {
      // Générer matricule automatique
      const matricule = await this.generateMatricule(studentData.schoolYearId);
      
      // Créer l'élève
      const student = await Student.create({
        ...studentData,
        matricule
      }, { transaction });
      
      // Créer l'inscription
      await Enrollment.create({
        studentId: student.id,
        schoolYearId: studentData.schoolYearId,
        classGroupId: studentData.classGroupId,
        classroomId: studentData.classroomId
      }, { transaction });
      
      await transaction.commit();
      
      // Log de l'activité
      await AuditService.logActivity(createdBy, 'CREATE_STUDENT', 'Student', student.id);
      
      return student;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  
  static async generateMatricule(schoolYearId) {
    const year = await SchoolYear.findByPk(schoolYearId);
    const yearCode = year.name.split('-')[0].slice(-2); // "24" pour 2024-2025
    const count = await Student.count({ where: { schoolYearId } });
    return `STU${yearCode}${String(count + 1).padStart(4, '0')}`; // STU240001
  }
}

module.exports = StudentService;
```

### 🎮 Contrôleurs (controllers/)

```javascript
// controllers/StudentController.js
/**
 * Contrôleur de gestion des élèves
 * Responsabilités : Gestion des requêtes HTTP, validation, réponses
 * Dépendances : StudentService, responseHandler, errorHandler
 */
const StudentService = require('../services/StudentService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

class StudentController {
  /**
   * Créer un nouvel élève
   * POST /api/students
   * Permission : STUDENTS_CREATE
   */
  static async create(req, res, next) {
    try {
      const studentData = req.body;
      const createdBy = req.user.id;
      
      // Validation des données requises
      if (!studentData.firstName || !studentData.lastName || !studentData.schoolYearId) {
        return errorResponse(res, 'Données manquantes', 400);
      }
      
      const student = await StudentService.createStudentWithEnrollment(studentData, createdBy);
      
      return successResponse(res, student, 'Élève créé avec succès', 201);
    } catch (error) {
      next(error);
    }
  }
  
  /**
   * Lister les élèves avec filtres
   * GET /api/students?schoolYearId=1&classGroupId=2&search=nom
   * Permission : STUDENTS_VIEW
   */
  static async list(req, res, next) {
    try {
      const { schoolYearId, classGroupId, search, page = 1, limit = 20 } = req.query;
      
      const filters = {};
      if (schoolYearId) filters.schoolYearId = schoolYearId;
      if (classGroupId) filters.classGroupId = classGroupId;
      if (search) filters.search = search;
      
      const result = await StudentService.findAll(filters, { page, limit });
      
      return successResponse(res, result, 'Liste des élèves récupérée');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = StudentController;
```

### 🛣️ Routes (routes/)

```javascript
// routes/student.routes.js
/**
 * Routes de gestion des élèves
 * Toutes les routes sont protégées par authentification et permissions
 */
const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/StudentController');
const { authenticate } = require('../middlewares/auth');
const { hasPermission } = require('../middlewares/permissions');
const { trackUserSession } = require('../middlewares/audit');

// Middleware global pour toutes les routes étudiants
router.use(authenticate);
router.use(trackUserSession);

// Routes CRUD
router.get('/', hasPermission('STUDENTS_VIEW'), StudentController.list);
router.get('/:id', hasPermission('STUDENTS_VIEW'), StudentController.getById);
router.post('/', hasPermission('STUDENTS_CREATE'), StudentController.create);
router.put('/:id', hasPermission('STUDENTS_UPDATE'), StudentController.update);
router.delete('/:id', hasPermission('STUDENTS_DELETE'), StudentController.delete);

// Routes spécifiques
router.post('/:id/enroll', hasPermission('ENROLLMENTS_MANAGE'), StudentController.enroll);
router.get('/:id/payments', hasPermission('PAYMENTS_VIEW'), StudentController.getPayments);
router.get('/:id/grades', hasPermission('GRADES_VIEW'), StudentController.getGrades);

module.exports = router;
```

---

## 📝 Fonctionnalités à implémenter par priorité

### 🥇 Priorité 1 - Fondamentaux (obligatoires)

**Statut initial : [ ] À faire**

- [ ] **SchoolYear Management**
  - Fichiers : `models/SchoolYear.js`, `services/SchoolYearService.js`, `controllers/SchoolYearController.js`, `routes/schoolYear.routes.js`
  - Fonctionnalités : CRUD années scolaires, activation/désactivation
  - Tests : `tests/schoolYear.test.js`

- [ ] **ClassRoom & ClassGroup**
  - Fichiers : `models/ClassRoom.js`, `models/ClassGroup.js`, services et controllers correspondants
  - Fonctionnalités : Gestion classes et groupes, affectation professeurs

- [ ] **Student Management**
  - Fichiers : Modèles, services, contrôleurs, routes étudiants
  - Fonctionnalités : CRUD élèves, inscription automatique, génération matricule

- [ ] **Payment System**
  - Fichiers : `models/Payment.js`, `models/Receipt.js`, services paiements
  - Fonctionnalités : Paiements avec réductions, génération reçus PDF

### 🥈 Priorité 2 - Fonctionnalités métier

- [ ] **Teacher Management**
- [ ] **Subject & Timetable**
- [ ] **Attendance System**
- [ ] **Grades Management**
- [ ] **Expense Tracking**

### 🥉 Priorité 3 - Fonctionnalités avancées

- [ ] **Transport Management**
- [ ] **Document Generation (Bulletins)**
- [ ] **Complaint System**
- [ ] **Financial Reports & Exports**
- [ ] **Dashboard Analytics**

---

## 🔨 Scripts et utilitaires à créer

### 📊 Script de seed pour l'école

```javascript
// scripts/seedSchoolData.js
/**
 * Script d'initialisation des données école
 * Crée : années scolaires, classes, groupes, quelques élèves et professeurs
 */
const { SchoolYear, ClassRoom, ClassGroup, Teacher, Student } = require('../models');

async function seedSchoolData() {
  try {
    console.log('🏫 Initialisation des données école...');
    
    // Créer année scolaire active
    const schoolYear = await SchoolYear.create({
      name: '2024-2025',
      startDate: '2024-09-01',
      endDate: '2025-06-30',
      isActive: true
    });
    
    // Créer des classes
    const ce1 = await ClassRoom.create({
      name: 'CE1',
      level: 'primaire',
      schoolYearId: schoolYear.id
    });
    
    // Créer des groupes
    const ce1GroupA = await ClassGroup.create({
      name: 'Groupe A',
      classroomId: ce1.id,
      capacity: 30
    });
    
    // Créer des professeurs
    const teacher = await Teacher.create({
      firstName: 'Awa',
      lastName: 'Traore',
      salaryType: 'monthly',
      salaryAmount: 200000
    });
    
    // Créer quelques élèves
    await Student.bulkCreate([
      {
        firstName: 'Mamadou',
        lastName: 'Diallo',
        matricule: 'STU240001',
        classGroupId: ce1GroupA.id,
        classroomId: ce1.id,
        schoolYearId: schoolYear.id
      },
      {
        firstName: 'Fatoumata',
        lastName: 'Keita',
        matricule: 'STU240002',
        classGroupId: ce1GroupA.id,
        classroomId: ce1.id,
        schoolYearId: schoolYear.id
      }
    ]);
    
    console.log('✅ Données école créées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
  }
}

module.exports = seedSchoolData;
```

### 📈 Générateur de rapports

```javascript
// utils/reportGenerator.js
/**
 * Générateur de rapports financiers et statistiques
 * Formats : PDF, Excel, CSV
 */
const ExcelJS = require('exceljs');
const puppeteer = require('puppeteer');

class ReportGenerator {
  static async generatePaymentReport(filters) {
    const payments = await Payment.findAll({
      where: filters,
      include: [Student, SchoolYear]
    });
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Paiements');
    
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Élève', key: 'student', width: 30 },
      { header: 'Montant', key: 'amount', width: 15 },
      { header: 'Type', key: 'type', width: 20 }
    ];
    
    payments.forEach(payment => {
      worksheet.addRow({
        date: payment.date,
        student: `${payment.Student.firstName} ${payment.Student.lastName}`,
        amount: payment.amount,
        type: payment.type
      });
    });
    
    return workbook;
  }
}
```

---

## 📋 Fichiers de suivi obligatoires

### docs/TODO.md

```markdown
# 📋 TODO - School Management Backend

## ⚡ En cours
- [ ] Implémentation du module Student
  - Assigné : IA
  - Date début : 2024-10-12
  - Estimation : 2h

## 🎯 À faire - Priorité 1
- [ ] Modèle SchoolYear + Service + Controller + Routes
- [ ] Modèle ClassRoom + ClassGroup
- [ ] Système de paiements avec génération PDF
- [ ] Tests unitaires pour les modules principaux

## 🎯 À faire - Priorité 2
- [ ] Teacher Management
- [ ] Subject & Timetable
- [ ] Attendance System
- [ ] Grades Management

## ✅ Terminé
- [x] Analyse de l'architecture existante (2024-10-12)
- [x] Création de la roadmap (2024-10-12)
```

### docs/CHANGELOG.md

```markdown
# 📝 Changelog - School Management Backend

## [En développement] - 2024-10-12

### ✨ Ajouté
- Roadmap complète pour le développement
- Structure des modèles école planifiée
- Définition des permissions et rôles

### 🔧 Modifié
- Rien encore

### 🐛 Corrigé
- Rien encore

## [0.1.0] - 2024-10-12

### ✨ Initial
- Base MalianDevs Template Backend fonctionnelle
- Authentification JWT + 2FA
- Système de rôles et permissions
- Middleware de sécurité et audit
```

---

## 🧪 Tests obligatoires

### Exemple de test unitaire

```javascript
// tests/student.test.js
/**
 * Tests unitaires pour le module Student
 */
const request = require('supertest');
const app = require('../app');
const { Student, SchoolYear } = require('../models');

describe('Student Management', () => {
  let authToken;
  let schoolYear;
  
  beforeAll(async () => {
    // Authentification admin pour les tests
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'Admin123!' });
    authToken = response.body.data.token;
    
    // Créer année scolaire test
    schoolYear = await SchoolYear.create({
      name: '2024-2025-TEST',
      isActive: true
    });
  });
  
  describe('POST /api/students', () => {
    it('should create a student with valid data', async () => {
      const studentData = {
        firstName: 'Test',
        lastName: 'Student',
        schoolYearId: schoolYear.id
      };
      
      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send(studentData);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe('Test');
      expect(response.body.data.matricule).toMatch(/STU\d{6}/);
    });
    
    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ firstName: 'Test' }); // lastName manquant
      
      expect(response.status).toBe(400);
    });
  });
});
```

---

## 🎯 Instructions finales pour l'IA

### 📐 Processus de développement

1. **Avant toute implémentation :**
   - Lire et comprendre cette roadmap complètement
   - Vérifier la structure existante du projet
   - Mettre à jour `docs/TODO.md` avec la tâche en cours

2. **Pendant l'implémentation :**
   - Suivre STRICTEMENT l'architecture MVC
   - Commencer par les modèles, puis services, puis contrôleurs, puis routes
   - Tester chaque module individuellement
   - Documenter chaque fonction avec JSDoc

3. **Après chaque fonctionnalité :**
   - Mettre à jour `docs/TODO.md` (marquer comme terminé)
   - Mettre à jour `docs/CHANGELOG.md` avec les modifications
   - Créer ou mettre à jour les tests correspondants
   - Vérifier que l'authentification et les permissions fonctionnent

### 🔍 Vérifications qualité

Avant de considérer une fonctionnalité comme terminée :

- [ ] Le code respecte les conventions de nommage
- [ ] Les erreurs sont gérées correctement
- [ ] Les logs d'audit sont en place
- [ ] Les permissions sont vérifiées
- [ ] Les données sont validées
- [ ] Les tests passent
- [ ] La documentation est à jour

### 🚨 Signaux d'alerte

Arrêter immédiatement et demander clarification si :
- Une modification des modules d'auth est nécessaire
- Les tests existants échouent après modifications
- Les permissions ou rôles existants doivent être modifiés
- L'architecture MVC n'est pas respectée

---

**💡 Note finale :** Cette roadmap est un document vivant. L'IA doit la mettre à jour au fur et à mesure du développement pour refléter l'état actuel du projet et les décisions prises.

---

# 🤖 Prompt de lancement pour l'IA

Voici le prompt à utiliser pour démarrer le développement avec n'importe quelle IA :

```
Tu es une IA experte en développement backend Node.js/Express/Sequelize.

CONTEXTE :
- Je travaille sur un backend de gestion d'école basé sur le "MalianDevs Template Backend"
- Le système d'authentification, rôles, permissions et middlewares est DÉJÀ FONCTIONNEL
- Tu NE DOIS JAMAIS modifier les modules existants d'auth, rôles, permissions

MISSION :
Implémente le système de gestion d'école en suivant EXACTEMENT le fichier "AI_DEVELOPMENT_ROADMAP.md" que je vais te fournir.

RÈGLES OBLIGATOIRES :
1. Respecte l'architecture MVC existante
2. Ne modifie AUCUN fichier d'authentification existant
3. Utilise Sequelize ORM uniquement
4. Applique les principes SOLID et Clean Code
5. Mets à jour docs/TODO.md et docs/CHANGELOG.md après chaque implémentation
6. Crée des tests Jest pour chaque module
7. Documente chaque fichier avec son rôle et dépendances

COMMENCE PAR :
1. Analyser la structure existante du projet
2. Créer les dossiers docs/ avec TODO.md et CHANGELOG.md
3. Implémenter le module SchoolYear (modèle + service + contrôleur + routes)
4. Tester le module avant de passer au suivant

Confirme que tu as compris ces instructions et demande-moi de te fournir la roadmap complète.
```

Ce prompt garantit que l'IA comprendra le contexte, les contraintes et la méthodologie à suivre pour développer le backend de manière professionnelle et cohérente.