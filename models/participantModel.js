const bcrypt = require('bcrypt');



      db.query(
        'INSERT INTO user (nom, prenom, email, password) VALUES (?, ?, ?, ?)',
        [
          participantData.nom,
          participantData.prenom,
          participantData.email,
          hashedPassword, // Utilisez le mot de passe haché
        ],
        (error, result) => {
          if (error) {
            return callback(error);
          }
          return callback(null, result);
        }
      );
    });
  },

  login: (email, password, callback) => {
    db.query('SELECT * FROM user WHERE email = ?', [email], (error, results) => {
      if (error) {
        return callback(error);
      }
      if (results.length > 0) {
        // Utilisez bcrypt.compare pour comparer les mots de passe
        bcrypt.compare(password, results[0].password, (err, passwordMatch) => {
          if (err) {
            return callback(err);
          }
          if (passwordMatch) {
            return callback(null, results[0]);
          } else {
            return callback(null, null); // Mot de passe incorrect
          }
        });
      } else {
        return callback(null, null); // Utilisateur non trouvé
      }
    });
  },
};

module.exports = Participant;
