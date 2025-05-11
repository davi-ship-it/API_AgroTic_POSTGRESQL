import jwt from 'jsonwebtoken';

// Verifica la validez del token enviado en Authorization header
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Palabra_clave');
    // Adjuntar datos del usuario decodificados al request
    req.user = {
      identificacion: decoded.identificacion,
      rol: decoded.rol,
      nombre: decoded.nombre
    };
    next();
  } catch (err) {
    console.error('Token inválido:', err);
    return res.status(401).json({ message: 'Token inválido' });
  }
};