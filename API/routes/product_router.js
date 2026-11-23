const express = require('express');
const productController = require('../controllers/product_controller.js');
const { requireRole } = require('../middleware/auth_middleware.js');
const validate = require('../middleware/validate.js');
const productValidator = require('../validators/product_validator.js');

const router = express.Router();

router.get('/', productController.list);
router.get('/:id', validate(productValidator.id, 'params'), productController.getById);
router.post('/', requireRole('manager', 'admin'), validate(productValidator.create), productController.create);
router.patch('/:id', requireRole('manager', 'admin'), validate(productValidator.id, 'params'), validate(productValidator.update), productController.update);
router.delete('/:id', requireRole('admin'), validate(productValidator.id, 'params'), productController.delete);

module.exports = router;