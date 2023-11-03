// app.js

const express = require('express');
const app = express();
const cors = require('cors'); // Importa el paquete CORS
const moment = require('moment-timezone');

// Establecer la zona horaria global
moment.tz.setDefault('America/Lima'); // Reemplaza 'America/Lima' con la zona horaria que corresponda a Perú

const { specs, swaggerUi } = require('./swagger');

app.use(express.json());
app.use(cors());

// Importa los enrutadores de cada entidad
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const categoryRouter = require('./routes/category');
const participantRouter = require('./routes/participant');
const turnTypeRouter = require('./routes/turntype');
const assignmentRouter = require('./routes/assignment');
// Otros enrutadores para cada entidad...

// Usa los enrutadores
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use('/participants', participantRouter);
app.use('/turntype', turnTypeRouter);
app.use('/assignment', assignmentRouter);
// Otros enrutadores para cada entidad...

// Configuración de Swagger
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
