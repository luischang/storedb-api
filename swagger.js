// swagger.js

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shopping App',
      version: '1.0.0',
      description: 'API para un ecommerce',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Cambia esto a la URL de tu servidor
      },
    ],
  },
  apis: ['./routes/*.js'], // Ruta donde están tus archivos de enrutamiento (puedes ajustarla según tus necesidades)
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
