const express = require('express');
const router = express.Router();
const produkController = require('../controller/produkController');
const apiKeyMiddleware = require('../middleware/apiKeyMiddleware');

router.use(apiKeyMiddleware);

router.get('/', produkController.getAllProduk);
router.get('/:id', produkController.getProdukById);
router.post('/', produkController.createProduk);
router.put('/:id', produkController.updateProduk);
router.delete('/:id', produkController.deleteProduk);

module.exports = router;
