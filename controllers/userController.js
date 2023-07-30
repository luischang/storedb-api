// controllers/userController.js

const connection = require('../db');

// CREATE
const createUser = (user) => {
  return new Promise((resolve, reject) => {
    // Agregar valores predeterminados para IsActive y Type
    const newUser = {
      ...user,
      IsActive: true,
      Type: 'U',
    };

    connection.query('INSERT INTO User SET ?', newUser, (err, results) => {
      if (err) reject(err);
      resolve(results.insertId);
    });
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

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
