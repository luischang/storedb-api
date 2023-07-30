// app.js

const express = require('express');
const app = express();

const { specs, swaggerUi } = require('./swagger');

app.use(express.json());

// Importa los enrutadores de cada entidad
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const categoryRouter = require('./routes/category');
// Otros enrutadores para cada entidad...

// Usa los enrutadores
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
// Otros enrutadores para cada entidad...

// Configuración de Swagger
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
