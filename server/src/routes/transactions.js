const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const transactionController = require('../controllers/transactionController');

// Toutes les routes sont protégées
router.use(authMiddleware);

router.get('/', transactionController.getTransactions);
router.post('/', transactionController.createTransaction);
router.get('/stats', transactionController.getStats);
router.post('/transfer', transactionController.transfer);

module.exports = router;