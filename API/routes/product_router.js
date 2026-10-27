const express = require('express');
const productController = require('../controllers/product_controller.js');
const { requireRole } = require('../middleware/auth_middleware.js');

const router = express.Router();

router.get('/', productController.list);
router.post('/', requireRole('admin'), productController.create);
router.get('/:id', productController.getById);
router.delete('/:id', requireRole('admin'), productController.delete);
router.patch('/:id', requireRole('admin'), productController.update);

module.exports = router; 