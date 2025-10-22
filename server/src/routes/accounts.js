const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const accountController = require('../controllers/accountController');

// Toutes les routes sont protégées
router.use(authMiddleware);

router.get('/', accountController.getAccounts);
router.post('/', accountController.createAccount);
router.get('/:id', accountController.getAccountById);
router.get('/:id/balance', accountController.getBalance);

module.exports = router;