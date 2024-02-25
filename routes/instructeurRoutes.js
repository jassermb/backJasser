const express = require('express');
const router = express.Router();
const instructeurController = require('../controllers/instructeurController');

router.get('/', instructeurController.listerInstructeurs);
router.post('/ajouter', instructeurController.ajouterInstructeur);
router.post('/register', instructeurController.register);
router.post('/login', instructeurController.login);

router.put('/modifier/:id', instructeurController.modifierInstructeur); // Added :id parameter
router.delete('/supprimer/:id', instructeurController.supprimerInstructeur);

module.exports = router;
