const jwt = require('jsonwebtoken');

const secretKey = 'SK_ABC123EFG456HIJ789';

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso no autorizado. Token no proporcionado o inválido.' });
  }

  const token = authHeader.substring(7); // Elimina los primeros 7 caracteres ("Bearer ")

  try {
    console.log("antes " + token);
    const decodedToken = jwt.verify(token, secretKey);
    console.log(decodedToken)
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado. ' + error.message });
  }
};

module.exports = authMiddleware;
