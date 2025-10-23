const prisma = require('../utils/prisma');
const { Decimal } = require('@prisma/client/runtime/library');

// Get all transactions
exports.getTransactions = async (req, res) => {
    try {
        const { accountId, type, category, startDate, endDate } = req.query;

        // Vérifier que l'utilisateur possède le compte
        if (accountId) {
            const account = await prisma.account.findFirst({
                where: { id: accountId, userId: req.userId }
            });

            if (!account) {
                return res.status(404).json({ error: 'Compte non trouvé' });
            }
        }

        // Construire les filtres
        const where = {
            account: {
                userId: req.userId
            }
        };

        if (accountId) where.accountId = accountId;
        if (type) where.type = type;
        if (category) where.category = category;
        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        const transactions = await prisma.transaction.findMany({
            where,
            include: {
                account: {
                    select: {
                        id: true,
                        name: true,
                        type: true
                    }
                }
            },
            orderBy: { date: 'desc' }
        });

        res.json(transactions);
    } catch (error) {
        console.error('Erreur getTransactions:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des transactions' });
    }
};

// Create transaction
exports.createTransaction = async (req, res) => {
    try {
        const { accountId, amount, type, category, description, date } = req.body;

        // Validation
        if (!accountId || !amount || !type || !category) {
            return res.status(400).json({
                error: 'accountId, amount, type et category sont requis'
            });
        }

        if (!['INCOME', 'EXPENSE'].includes(type)) {
            return res.status(400).json({
                error: 'Type invalide (INCOME ou EXPENSE)'
            });
        }

        // Vérifier que l'utilisateur possède le compte
        const account = await prisma.account.findFirst({
            where: { id: accountId, userId: req.userId }
        });

        if (!account) {
            return res.status(404).json({ error: 'Compte non trouvé' });
        }

        // Calculer le nouveau solde
        const transactionAmount = new Decimal(amount);
        const newBalance = type === 'INCOME'
            ? account.balance.add(transactionAmount)
            : account.balance.sub(transactionAmount);

        // Vérifier le solde pour les dépenses
        if (type === 'EXPENSE' && newBalance.isNegative()) {
            return res.status(400).json({ error: 'Solde insuffisant' });
        }

        // Créer la transaction et mettre à jour le solde
        const transaction = await prisma.$transaction(async (tx) => {
            const newTransaction = await tx.transaction.create({
                data: {
                    accountId,
                    amount: transactionAmount,
                    type,
                    category,
                    description,
                    date: date ? new Date(date) : new Date()
                },
                include: {
                    account: {
                        select: {
                            id: true,
                            name: true,
                            type: true
                        }
                    }
                }
            });

            await tx.account.update({
                where: { id: accountId },
                data: { balance: newBalance }
            });

            return newTransaction;
        });

        res.status(201).json(transaction);
    } catch (error) {
        console.error('Erreur createTransaction:', error);
        res.status(500).json({ error: 'Erreur lors de la création de la transaction' });
    }
};

// Get statistics
exports.getStats = async (req, res) => {
    try {
        const { accountId, startDate, endDate } = req.query;

        const where = {
            account: {
                userId: req.userId
            }
        };

        if (accountId) where.accountId = accountId;
        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        // Récupérer toutes les transactions (comme avant)
        const transactions = await prisma.transaction.findMany({
            where
        });

        // Calculer les statistiques basées sur les transactions
        const stats = {
            totalIncome: 0,
            totalExpense: 0,
            balance: 0,
            transactionCount: transactions.length,
            byCategory: {}
        };

        transactions.forEach(t => {
            // t.amount est un Decimal ; on le convertit en float pour le calcul
            const amount = parseFloat(t.amount);

            if (t.type === 'INCOME') {
                stats.totalIncome += amount;
                stats.balance += amount;
            } else {
                stats.totalExpense += amount;
                stats.balance -= amount;
            }

            // Par catégorie
            if (!stats.byCategory[t.category]) {
                stats.byCategory[t.category] = {
                    total: 0,
                    count: 0,
                    type: t.type
                };
            }
            stats.byCategory[t.category].total += amount;
            stats.byCategory[t.category].count++;
        });

        // 🆕 Calculer la "balance totale" : somme de tous les soldes des comptes
        // Filtre selon le userId (et accountId si fourni)
        const accountWhere = { userId: req.userId };
        if (accountId) accountWhere.id = accountId;

        const totalBalanceAgg = await prisma.account.aggregate({
            _sum: { balance: true },
            where: accountWhere
        });

        // totalBalanceAgg._sum.balance peut être null ou Decimal
        const totalBalance = totalBalanceAgg._sum && totalBalanceAgg._sum.balance
            ? parseFloat(totalBalanceAgg._sum.balance)
            : 0;

        // Ajouter totalBalance au résultat renvoyé
        stats.totalBalance = totalBalance;

        res.json(stats);
    } catch (error) {
        console.error('Erreur getStats:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
};

// Transfer between accounts
exports.transfer = async (req, res) => {
    try {
        const { fromAccountId, toAccountId, amount, description } = req.body;

        if (!fromAccountId || !toAccountId || !amount) {
            return res.status(400).json({
                error: 'fromAccountId, toAccountId et amount sont requis'
            });
        }

        if (fromAccountId === toAccountId) {
            return res.status(400).json({
                error: 'Les comptes source et destination doivent être différents'
            });
        }

        // Vérifier que l'utilisateur possède les deux comptes
        const accounts = await prisma.account.findMany({
            where: {
                id: { in: [fromAccountId, toAccountId] },
                userId: req.userId
            }
        });

        if (accounts.length !== 2) {
            return res.status(404).json({ error: 'Un ou plusieurs comptes non trouvés' });
        }

        const fromAccount = accounts.find(a => a.id === fromAccountId);
        const toAccount = accounts.find(a => a.id === toAccountId);

        const transferAmount = new Decimal(amount);

        // Vérifier le solde
        if (fromAccount.balance.lessThan(transferAmount)) {
            return res.status(400).json({ error: 'Solde insuffisant' });
        }

        // Effectuer le transfert
        const result = await prisma.$transaction(async (tx) => {
            // Transaction de débit
            const debitTransaction = await tx.transaction.create({
                data: {
                    accountId: fromAccountId,
                    amount: transferAmount,
                    type: 'TRANSFER',
                    category: 'Virement',
                    description: description || `Virement vers ${toAccount.name}`
                }
            });

            // Transaction de crédit
            const creditTransaction = await tx.transaction.create({
                data: {
                    accountId: toAccountId,
                    amount: transferAmount,
                    type: 'TRANSFER',
                    category: 'Virement',
                    description: description || `Virement depuis ${fromAccount.name}`
                }
            });

            // Mettre à jour les soldes
            await tx.account.update({
                where: { id: fromAccountId },
                data: { balance: fromAccount.balance.sub(transferAmount) }
            });

            await tx.account.update({
                where: { id: toAccountId },
                data: { balance: toAccount.balance.add(transferAmount) }
            });

            return { debitTransaction, creditTransaction };
        });

        res.status(201).json({
            message: 'Virement effectué avec succès',
            ...result
        });
    } catch (error) {
        console.error('Erreur transfer:', error);
        res.status(500).json({ error: 'Erreur lors du virement' });
    }
};