import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

export const createPasswordResetToken = (userId) => {
  // Genera un JWT que contiene { userId } y expira según JWT_EXPIRES_IN
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const validateResetToken = (token) => {
  try {
    const { userId } = jwt.verify(token, JWT_SECRET);
    return userId;
  } catch (err) {
    return null;
  }
};
export const createRoleChangeToken = (aprendizDni) => {
  return jwt.sign(
    { aprendizDni },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Valida el token y extrae aprendizDni.
 * Devuelve null si falla o expira.
 */
export const validateRoleChangeToken = (token) => {
  try {
    const { aprendizDni } = jwt.verify(token, JWT_SECRET);
    if (!aprendizDni) return null;
    return aprendizDni;
  } catch (err) {
    return null;
  }
};