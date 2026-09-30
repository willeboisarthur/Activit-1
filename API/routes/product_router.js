const express = require('express');
const productController = require('../controllers/product_controller.js')

const router = express.Router();

router.get('/', productController.list);
router.post('/', productController.create);
router.get('/:id', productController.getById);
router.delete('/:id', productController.delete);
router.patch('/:id', productController.update);

module.exports = router; 