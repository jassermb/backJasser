const bcrypt = require('bcrypt');
const util = require('util');
const dbConnection = require('../config/db');

const saltRounds = 10;
const query = util.promisify(dbConnection.query).bind(dbConnection);

const Instructeur = {
  register: async (instructeurData) => {
    try {
        const hashedpassw = await bcrypt.hash(instructeurData.passw, saltRounds);
        const result = await query(
            'INSERT INTO instructeur (nom, prenom, email, passw, tel, specialite) VALUES (?, ?, ?, ?, ?, ?)',
            [
                instructeurData.nom,
                instructeurData.prenom,
                instructeurData.email,
                hashedpassw,
                instructeurData.tel,
                instructeurData.specialite,
            ]
        );
        return result;
    } catch (error) {
        throw error;
    }
},
login: async (email, passw) => {
  try {
      const results = await query('SELECT * FROM instructeur WHERE email = ?', [email]);
      if (results.length > 0) {
          const passwMatch = await bcrypt.compare(passw, results[0].passw);
          return passwMatch ? results[0] : null;
      } else {
          return null; // User not found
      }
  } catch (error) {
      throw error;
  }
},

getInstructeurById: async (id) => {
    try {
        const results = await query('SELECT * FROM instructeur WHERE id = ?', [id]);
        return results.length > 0 ? results[0] : null;
    } catch (error) {
        throw error;
    }
},
   
  updateInstructeur: async (id, instructeurData) => {
      try {
          const { nom, prenom, email, tel, specialite, passw } = instructeurData;

          // Validation
          if (!nom || !prenom || !email || !tel || !specialite || !passw) {
              throw new Error('Tous les champs sont requis pour modifier un instructeur.');
          }

          const hashedpassw = await bcrypt.hash(passw, saltRounds);

          const updateQuery = `
              UPDATE instructeur
              SET nom = ?, prenom = ?, email = ?, tel = ?, specialite = ?, passw = ?
              WHERE id = ?
          `;

          const result = await query(updateQuery, [nom, prenom, email, tel, specialite, hashedpassw, id]);
          return result;
      } catch (error) {
          throw error;
      }
  },

  deleteInstructeur: async (id) => {
      try {
          const deleteQuery = 'DELETE FROM instructeur WHERE id = ?';
          const result = await query(deleteQuery, [id]);
          return result;
      } catch (error) {
          throw error;
      }
  },

  };

  module.exports = Instructeur;