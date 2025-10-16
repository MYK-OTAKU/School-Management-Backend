const express = require('express');
const router = express.Router();
const ClassRoomController = require('../controllers/ClassRoomController');
const { authenticate, hasPermission } = require('../middlewares/auth');
const { trackUserSession, logResourceActivity } = require('../middlewares/audit');

router.use(authenticate);
router.use(trackUserSession);

router.get('/',
  hasPermission('CLASSES_VIEW'),
  logResourceActivity('CLASSROOM'),
  ClassRoomController.list
);

router.get('/:id',
  hasPermission('CLASSES_VIEW'),
  logResourceActivity('CLASSROOM'),
  ClassRoomController.getById
);

router.post('/',
  hasPermission('CLASSES_CREATE'),
  logResourceActivity('CLASSROOM'),
  ClassRoomController.create
);

router.put('/:id',
  hasPermission('CLASSES_UPDATE'),
  logResourceActivity('CLASSROOM'),
  ClassRoomController.update
);

router.delete('/:id',
  hasPermission('CLASSES_DELETE'),
  logResourceActivity('CLASSROOM'),
  ClassRoomController.delete
);

router.post('/:id/groups',
  hasPermission('CLASSES_UPDATE'),
  logResourceActivity('CLASSGROUP'),
  ClassRoomController.createGroup
);

router.put('/groups/:groupId',
  hasPermission('CLASSES_UPDATE'),
  logResourceActivity('CLASSGROUP'),
  ClassRoomController.updateGroup
);

router.delete('/groups/:groupId',
  hasPermission('CLASSES_UPDATE'),
  logResourceActivity('CLASSGROUP'),
  ClassRoomController.deleteGroup
);

module.exports = router;
