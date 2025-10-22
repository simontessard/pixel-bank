const prisma = require('../utils/prisma');

// Get all accounts
exports.getAccounts = async (req, res) => {
    try {
        const accounts = await prisma.account.findMany({
            where: { userId: req.userId },
            include: {
                _count: {
                    select: { transactions: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(accounts);
    } catch (error) {
        console.error('Erreur getAccounts:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des comptes' });
    }
};

// Get account by ID
exports.getAccountById = async (req, res) => {
    try {
        const account = await prisma.account.findFirst({
            where: {
                id: req.params.id,
                userId: req.userId
            },
            include: {
                transactions: {
                    orderBy: { date: 'desc' },
                    take: 50
                }
            }
        });

        if (!account) {
            return res.status(404).json({ error: 'Compte non trouvé' });
        }

        res.json(account);
    } catch (error) {
        console.error('Erreur getAccountById:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du compte' });
    }
};

// Create account
exports.createAccount = async (req, res) => {
    try {
        const { name, type } = req.body;

        if (!name || !type) {
            return res.status(400).json({ error: 'Nom et type requis' });
        }

        if (!['CHECKING', 'SAVINGS'].includes(type)) {
            return res.status(400).json({ error: 'Type invalide (CHECKING ou SAVINGS)' });
        }

        const account = await prisma.account.create({
            data: {
                name,
                type,
                userId: req.userId,
                balance: 0
            }
        });

        res.status(201).json(account);
    } catch (error) {
        console.error('Erreur createAccount:', error);
        res.status(500).json({ error: 'Erreur lors de la création du compte' });
    }
};

// Get account balance
exports.getBalance = async (req, res) => {
    try {
        const account = await prisma.account.findFirst({
            where: {
                id: req.params.id,
                userId: req.userId
            },
            select: {
                id: true,
                name: true,
                balance: true,
                currency: true
            }
        });

        if (!account) {
            return res.status(404).json({ error: 'Compte non trouvé' });
        }

        res.json(account);
    } catch (error) {
        console.error('Erreur getBalance:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du solde' });
    }
};