// controllers/categoryController.js

const connection = require('../db');

// READ (Obtener todas las categorías)
const getAllCategories = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM Category', (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

// READ (Obtener una categoría por su ID con los productos asociados)
const getCategoryWithProducts = (categoryId) => {
    return new Promise((resolve, reject) => {
      // Realizar un JOIN con la tabla Product para obtener los productos asociados a la categoría
      const query = 'SELECT c.Id, c.Description, p.Id AS ProductId, p.Description AS ProductDescription FROM Category c LEFT JOIN Product p ON c.Id = p.CategoryId WHERE c.Id = ?';
      connection.query(query, [categoryId], (err, results) => {
        if (err) reject(err);
  
        // Verificar si la categoría existe en la base de datos
        if (results.length === 0) {
          resolve(null); // Retornar null si la categoría no existe
        } else {
          // Transformar el resultado para obtener los productos asociados en un array
          const categoryWithProducts = {
            Id: results[0].Id,
            Description: results[0].Description,
            Products: results.map((product) => ({
              Id: product.ProductId,
              Description: product.ProductDescription,
            })),
          };
    
          resolve(categoryWithProducts);
        }
      });
    });
  };

// READ (Obtener una categoría por su ID)
const getCategoryById = (categoryId) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM Category WHERE Id = ?', [categoryId], (err, results) => {
      if (err) reject(err);
      if (results.length === 0) resolve(null);
      resolve(results[0]);
    });
  });
};

// CREATE (Crear una nueva categoría)
const createCategory = (category) => {
  return new Promise((resolve, reject) => {
    // Establecer IsActive en true por defecto si no se proporciona en el cuerpo de la solicitud
    const { Description, IsActive = true } = category;
    const newCategory = { Description, IsActive };
    connection.query('INSERT INTO Category SET ?', newCategory, (err, results) => {
      if (err) reject(err);
      resolve(results.insertId);
    });
  });
};

// UPDATE (Actualizar una categoría existente)
const updateCategory = (categoryId, category) => {
  return new Promise((resolve, reject) => {
    const { Description, IsActive = true } = category;
    const updatedCategory = { Description, IsActive };
    connection.query('UPDATE Category SET ? WHERE Id = ?', [updatedCategory, categoryId], (err, results) => {
      if (err) reject(err);
      resolve(results.affectedRows > 0);
    });
  });
};

// DELETE (Eliminación lógica de una categoría)
const deleteCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    const updatedCategory = { IsActive: false };
    connection.query('UPDATE Category SET ? WHERE Id = ?', [updatedCategory, categoryId], (err, results) => {
      if (err) reject(err);
      resolve(results.affectedRows > 0);
    });
  });
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryWithProducts
};
