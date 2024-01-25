// app.js

const express = require('express');
const app = express();
const cors = require('cors');
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
const requestChangeTurnRouter = require('./routes/requestchangeturn');

// Otros enrutadores para cada entidad...

// Crea un enrutador para la API Node.js con la ruta base '/node-api'
const nodeApiRouter = express.Router();
nodeApiRouter.use('/users', userRouter);
nodeApiRouter.use('/products', productRouter);
nodeApiRouter.use('/categories', categoryRouter);
nodeApiRouter.use('/participants', participantRouter);
nodeApiRouter.use('/turntype', turnTypeRouter);
nodeApiRouter.use('/assignment', assignmentRouter);
nodeApiRouter.use('/requestchangeturn', requestChangeTurnRouter);
// Otros enrutadores para cada entidad...

// Agrega el enrutador de la API Node.js a la ruta base '/node-api'
app.use('/node-api', nodeApiRouter);

// Configuración de Swagger
app.use('/node-api/swagger', swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
