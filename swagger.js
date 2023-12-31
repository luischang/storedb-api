// swagger.js

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const environment = process.env.NODE_ENV || 'development';

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
        url: environment === 'production' ? 'https://storedb-api.onrender.com' : 'http://localhost:3000',
      },
    ],
    components: { // Agrega esta sección para especificar el esquema de autorización
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'], // Ruta donde están tus archivos de enrutamiento (puedes ajustarla según tus necesidades)
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
