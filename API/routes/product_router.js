const express = require('express');
const productController = require('../controllers/product_controller.js');
const { requireRole } = require('../middleware/auth_middleware.js');

const router = express.Router();

router.get('/', productController.list);
router.get('/:id', productController.getById);
router.post('/', requireRole('manager', 'admin'), productController.create);
router.patch('/:id', requireRole('manager', 'admin'), productController.update);
router.delete('/:id', requireRole('admin'), productController.delete);

module.exports = router;