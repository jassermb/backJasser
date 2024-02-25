// const bcrypt = require('bcrypt');

// const dbConnection = require("../config/db");



// const saltRounds = 10; // Nombre de rounds de salage pour bcrypt

// const createinstructeurTableQuery = `
//   CREATE TABLE IF NOT EXISTS participant (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     nom VARCHAR(255) NOT NULL,
//     prenom VARCHAR(255) NOT NULL,
//     email VARCHAR(255) UNIQUE NOT NULL,
//     tel VARCHAR(15) NOT NULL,
//     specialite VARCHAR(255) NOT NULL,
//     passw VARCHAR(255) NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
//   )
// `;

// dbConnection.query(createinstructeurTableQuery, (err, results, fields) => {
//   if (err) {
//     console.error('Error creating participant table: ' + err.stack);
//   } else {
//     console.log('participant table created or already exists.');
//   }
// });

// const Participant = {
//   register: (participantData, callback) => {
//     // Hash du mot de passe avant de l'insérer dans la base de données
//     bcrypt.hash(participantData.password, saltRounds, (err, hashedPassword) => {
//       if (err) {
//         return callback(err);
//       }

//       db.query(
//         'INSERT INTO participant (nom, prenom, email, password) VALUES (?, ?, ?, ?)',
//         [
//           participantData.nom,
//           participantData.prenom,
//           participantData.email,
//           hashedPassword, // Utilisez le mot de passe haché
//         ],
//         (error, result) => {
//           if (error) {
//             return callback(error);
//           }
//           return callback(null, result);
//         }
//       );
//     });
//   },

//   login: (email, password, callback) => {
//     db.query('SELECT * FROM participant WHERE email = ?', [email], (error, results) => {
//       if (error) {
//         return callback(error);
//       }
//       if (results.length > 0) {
//         // Utilisez bcrypt.compare pour comparer les mots de passe
//         bcrypt.compare(password, results[0].password, (err, passwordMatch) => {
//           if (err) {
//             return callback(err);
//           }
//           if (passwordMatch) {
//             return callback(null, results[0]);
//           } else {
//             return callback(null, null); // Mot de passe incorrect
//           }
//         });
//       } else {
//         return callback(null, null); // Utilisateur non trouvé
//       }
//     });
//   },
// };

// module.exports = Participant;
