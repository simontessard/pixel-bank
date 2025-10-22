const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

// Register
exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Validation basique
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé' });
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'utilisateur avec un compte par défaut
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                accounts: {
                    create: {
                        name: 'Compte Courant',
                        type: 'CHECKING',
                        balance: 1000
                    }
                }
            },
            include: {
                accounts: true
            }
        });

        // Générer le token JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Retourner la réponse sans le mot de passe
        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Erreur register:', error);
        res.status(500).json({ error: 'Erreur lors de la création du compte' });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        // Trouver l'utilisateur
        const user = await prisma.user.findUnique({
            where: { email },
            include: { accounts: true }
        });

        if (!user) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        // Générer le token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Retourner sans le mot de passe
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            message: 'Connexion réussie',
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
};

// Get current user
exports.me = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            include: { accounts: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);

    } catch (error) {
        console.error('Erreur me:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
    }
};