const express = require('express');
const userController = require('../controllers/user_controller.js');
const { requireRole } = require('../middleware/auth_middleware.js');

const router = express.Router();

router.post('/', requireRole('admin'), userController.create);
router.get('/:id', userController.getById);
router.delete('/:id', requireRole('admin'), userController.delete);
router.patch('/:id', requireRole('admin'), userController.update);

module.exports = router; 