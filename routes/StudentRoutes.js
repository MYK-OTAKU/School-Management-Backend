const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/StudentController');
const { authenticate, hasPermission } = require('../middlewares/auth');
const { trackUserSession, logResourceActivity } = require('../middlewares/audit');

router.use(authenticate);
router.use(trackUserSession);

router.get(
  '/',
  hasPermission('STUDENTS_VIEW'),
  logResourceActivity('STUDENT'),
  StudentController.list
);

router.get(
  '/:id',
  hasPermission('STUDENTS_VIEW'),
  logResourceActivity('STUDENT'),
  StudentController.getById
);

router.post(
  '/',
  hasPermission('STUDENTS_CREATE'),
  logResourceActivity('STUDENT'),
  StudentController.create
);

router.put(
  '/:id',
  hasPermission('STUDENTS_UPDATE'),
  logResourceActivity('STUDENT'),
  StudentController.update
);

router.delete(
  '/:id',
  hasPermission('STUDENTS_DELETE'),
  logResourceActivity('STUDENT'),
  StudentController.remove
);

router.post(
  '/:id/enroll',
  hasPermission('ENROLLMENTS_MANAGE'),
  logResourceActivity('ENROLLMENT'),
  StudentController.enroll
);

module.exports = router;
