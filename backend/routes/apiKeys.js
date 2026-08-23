const express = require('express');
const router = express.Router();
const apiKeyController = require('../controller/apiKeyController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', apiKeyController.generateApiKey);
router.get('/', apiKeyController.getApiKeys);
router.delete('/:id', apiKeyController.deleteApiKey);

module.exports = router;
