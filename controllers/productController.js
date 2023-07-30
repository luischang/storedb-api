// controllers/productController.js

const connection = require('../db');

// CREATE (Crear un nuevo producto)
const createProduct = (product) => {
  return new Promise((resolve, reject) => {
    // Establecer IsActive en true por defecto
    const { Description, ImageUrl, Stock, Price, Discount, CategoryId, IsActive = true } = product;
    const newProduct = { Description, ImageUrl, Stock, Price, Discount, CategoryId, IsActive };
    connection.query('INSERT INTO Product SET ?', newProduct, (err, results) => {
      if (err) reject(err);
      resolve(results.insertId);
    });
  });
};

// READ (Obtener todos los productos con la información de categoría)
const getAllProducts = () => {
    return new Promise((resolve, reject) => {
      // Realizar un JOIN con la tabla Category para obtener la información de la categoría asociada a cada producto
      const query = 'SELECT p.Id, p.Description, p.ImageUrl, p.Stock, p.Price, p.Discount, c.Id AS CategoryId, c.Description AS Category FROM Product p LEFT JOIN Category c ON p.CategoryId = c.Id';
      connection.query(query, (err, results) => {
        if (err) reject(err);
  
        // Transformar el resultado para obtener el objeto Category con Id y Description
        const productsWithCategory = results.map((product) => {
          const { Id, Description, ImageUrl, Stock, Price, Discount, CategoryId, Category } = product;
          return {
            Id,
            Description,
            ImageUrl,
            Stock,
            Price,
            Discount,
            Category: {
              Id: CategoryId,
              Description: Category,
            },
          };
        });
  
        resolve(productsWithCategory);
      });
    });
  };

// READ (Obtener un producto por su ID)
const getProductById = (productId) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM Product WHERE Id = ?', [productId], (err, results) => {
      if (err) reject(err);
      if (results.length === 0) resolve(null);
      resolve(results[0]);
    });
  });
};

// UPDATE (Actualizar un producto existente)
const updateProduct = (productId, product) => {
  return new Promise((resolve, reject) => {
    const { Description, ImageUrl, Stock, Price, Discount, CategoryId } = product;
    connection.query(
      'UPDATE Product SET Description = ?, ImageUrl = ?, Stock = ?, Price = ?, Discount = ?, CategoryId = ? WHERE Id = ?',
      [Description, ImageUrl, Stock, Price, Discount, CategoryId, productId],
      (err, results) => {
        if (err) reject(err);
        resolve(results.affectedRows > 0);
      }
    );
  });
};

// DELETE (Eliminación lógica de un producto)
const deleteProduct = (productId) => {
  return new Promise((resolve, reject) => {
    const updatedProduct = { IsActive: false };
    connection.query('UPDATE Product SET ? WHERE Id = ?', [updatedProduct, productId], (err, results) => {
      if (err) reject(err);
      resolve(results.affectedRows > 0);
    });
  });
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
