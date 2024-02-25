const Instructeur = require('../models/instructeurModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const util = require('util');
const dbConnection = require('../config/db');

const saltRounds = 10;
const query = util.promisify(dbConnection.query).bind(dbConnection);

const errorHandler = (res, message) => {
    console.error(message);
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
};

const validateFields = (req, res) => {
    const { nom, prenom, email, tel, specialite, passw } = req.body;
    if (!nom || !prenom || !email || !tel || !specialite || !passw) {
        return res.status(400).json({ message: 'Tous les champs sont requis pour ajouter un instructeur.' });
    }
    return true;
};
const generateToken = (userId) => {
    // Replace 'YOUR_SECRET_KEY' with your actual secret key used for signing the token
    return jwt.sign({ userId }, 'instructeur', { expiresIn: '1h' });
};

const listerInstructeurs = async (req, res) => {
    try {
        const results = await query('SELECT * FROM instructeur');
        return res.status(200).json({ success: true, liste: results });
    } catch (err) {
        return errorHandler(res, err);
    }
};

const ajouterInstructeur = async (req, res) => {
    try {
        if (!validateFields(req, res)) {
            return; // Stop execution if fields are not valid
        }

        const { nom, prenom, email, tel, specialite, passw } = req.body;
        const instructeurData = { nom, prenom, email, tel, specialite, passw };

        try {
            const emailExists = await query('SELECT * FROM instructeur WHERE email = ?', [email]);

            if (emailExists.length > 0) {
                throw new Error('Email already exists');
            }

            const hashedpassw = await bcrypt.hash(passw, saltRounds);

            const result = await query(
                'INSERT INTO instructeur (nom, prenom, email, passw, tel, specialite) VALUES (?, ?, ?, ?, ?, ?)',
                [nom, prenom, email, hashedpassw, tel, specialite]
            );

            return res.status(200).json({
                message: 'Instructeur ajouté avec succès.',
                instructeur: result
            });
        } catch (error) {
            return errorHandler(res, error);
        }
    } catch (err) {
        return errorHandler(res, err);
    }
};

const modifierInstructeur = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, prenom, email, tel, specialite, passw } = req.body;

        // Check for the presence of the authorization header
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'Token manquant. Authentifiez-vous pour accéder à cette ressource.' });
        }

        // Verify the token
        try {
            // Replace 'YOUR_SECRET_KEY' with your actual secret key used for signing the token
            const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
            // Now you have the user information in decoded
            // You can use decoded.userId to identify the user
        } catch (error) {
            return res.status(401).json({ message: 'Token invalide. Authentifiez-vous pour accéder à cette ressource.' });
        }

        if (!id || !validateFields(req, res)) {
            return res.status(400).json({ message: 'ID et tous les champs sont requis pour modifier un instructeur.' });
        }

        const hashedpassw = await bcrypt.hash(passw, saltRounds);

        const updateQuery = `
            UPDATE instructeur
            SET nom = ?, prenom = ?, email = ?, tel = ?, specialite = ?, passw = ?
            WHERE id = ?
        `;

        const result = await query(updateQuery, [nom, prenom, email, tel, specialite, hashedpassw, id]);

        return res.status(200).json({
            message: 'Instructeur modifié avec succès.',
            instructeur: result
        });
    } catch (err) {
        return errorHandler(res, err);
    }
};

const register = async (req, res) => {
    const instructeurData = req.body;

    try {
        const result = await Instructeur.register(instructeurData);
        res.status(201).json({ success: true, message: 'Inscription réussie.', result });
    } catch (error) {
        errorHandler(res, 'Erreur lors de l\'inscription: ' + error.message);
    }
};

const login = async (req, res) => {
    const { email, passw } = req.body;

    try {
        const user = await Instructeur.login(email, passw);

        if (user) {
            const token = generateToken(user.id);
            res.status(200).json({ success: true, message: 'Connexion réussie.', user, token });
        } else {
            res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
        }
    } catch (error) {
        errorHandler(res, 'Erreur lors de la connexion: ' + error.message);
    }
};

const supprimerInstructeur = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'ID requis pour supprimer un instructeur.' });
        }

        const deleteQuery = 'DELETE FROM instructeur WHERE id = ?';

        const result = await query(deleteQuery, [id]);

        return res.status(200).json({ message: 'Instructeur supprimé avec succès.', result });
    } catch (err) {
        return errorHandler(res, err);
    }
};

module.exports = {
    listerInstructeurs,
    ajouterInstructeur,
    modifierInstructeur,
    supprimerInstructeur,
    register,
    login
};
