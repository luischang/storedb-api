// controllers/userController.js

const connection = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// CREATE
const createUser = (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Encriptar la contraseña con bcrypt antes de almacenarla
      const hashedPassword = await bcrypt.hash(user.Password, 10);

      // Crear el objeto de usuario con la contraseña encriptada
      const newUser = {
        FirstName: user.FirstName,
        LastName: user.LastName,
        DateOfBirth: user.DateOfBirth,
        Country: user.Country,
        Address: user.Address,
        Email: user.Email,
        Password: hashedPassword,
        IsActive: user.IsActive || true, // Si IsActive no se proporciona, se establece como true por defecto
        Type: user.Type || 'U' // Si Type no se proporciona, se establece como 'U' por defecto
      };

      // Insertar el nuevo usuario en la base de datos
      connection.query('INSERT INTO User SET ?', newUser, (err, results) => {
        if (err) reject(err);
        resolve(results.insertId);
      });
    } catch (error) {
      reject(error);
    }
  });
};

// READ (Obtener todos los usuarios)
const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM User', (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

// READ (Obtener un usuario por su ID)
const getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM User WHERE Id = ?', [userId], (err, results) => {
      if (err) reject(err);
      if (results.length === 0) resolve(null);
      resolve(results[0]);
    });
  });
};

// UPDATE
const updateUser = (userId, user) => {
  return new Promise((resolve, reject) => {
    connection.query('UPDATE User SET ? WHERE Id = ?', [user, userId], (err, results) => {
      if (err) reject(err);
      resolve(results.affectedRows > 0);
    });
  });
};

// DELETE
const deleteUser = (userId) => {
    return new Promise((resolve, reject) => {
      const updateUserQuery = 'UPDATE User SET IsActive = ? WHERE Id = ?';
      connection.query(updateUserQuery, [false, userId], (err, results) => {
        if (err) reject(err);
        resolve(results.affectedRows > 0);
      });
    });
  };

// Método para iniciar sesión (signIn)
const signIn = (email, password) => {
  return new Promise((resolve, reject) => {
    // Buscar al usuario por su email en la base de datos
    const query = 'SELECT * FROM User WHERE Email = ?';
    connection.query(query, [email], async (err, results) => {
      if (err) reject(err);
      
      if (results.length === 0) {
        resolve(null); // No se encontró el usuario, devolver null
      } else {
        const user = results[0];

        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        const passwordMatch = await bcrypt.compare(password, user.Password);
        if (passwordMatch) {
          // Si la contraseña coincide, generar un JWT con la información básica del usuario
          const token = jwt.sign({ userId: user.Id }, 'SK_ABC123EFG456HIJ789', { expiresIn: '1h' });

          // Devolver la información básica del usuario y el token JWT
          resolve({
            id: user.Id,
            firstName: user.FirstName,
            lastName: user.LastName,
            email: user.Email,
            token: token
          });
        } else {
          resolve(null); // La contraseña no coincide, devolver null
        }
      }
    });
  });
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  signIn,
};
