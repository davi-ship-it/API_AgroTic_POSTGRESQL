import bcrypt from 'bcrypt';
import { pool } from '../database/conexion.js';


import { transporter } from '../config/mailer.js';




import { createPasswordResetToken, validateResetToken } from '../services/tokenService.js';

export const forgotPassword = async (req, res) => {
  try {
    const { usu_correo } = req.body;
    // 1. Verificar existencia de usuario
    const { rows } = await pool.query(
      'SELECT pk_id_usuario FROM usuarios WHERE usu_correo = $1',
      [usu_correo]
    );
    if (!rows.length) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    const userId = rows[0].pk_id_usuario;

    // 2. Generar token JWT
    const token = createPasswordResetToken(userId);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // 3. Enviar correo
    await transporter.sendMail({
      from: `"AgroTic" <${process.env.SMTP_USER}>`,
      to: usu_correo,
      subject: 'Recupera tu contraseña',
      html: `
        <p>¡Hola ${rows[0].usu_nombres || ''}!</p>
        <p>Haz clic <a href="${resetLink}">aquí</a> para restablecer tu contraseña.</p>
        <p>El enlace expira en ${process.env.JWT_EXPIRES_IN}.</p>
      `
    });

    return res.status(200).json({ message: 'Email de recuperación enviado.' });
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    return res.status(500).json({ message: 'Error al procesar la solicitud', error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    // 1. Validar token y extraer userId
    const userId = validateResetToken(token);
    if (!userId) {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }

    // 2. Hashear nueva contraseña
    const hashed = await bcrypt.hash(password, 10);

    // 3. Actualizar contraseña en DB
    await pool.query(
  `UPDATE usuarios
     SET usu_password_h = $1
   WHERE pk_id_usuario = $2`,
  [hashed, userId]
);

    return res.status(200).json({ message: 'Contraseña actualizada con éxito.' });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    return res.status(500).json({ message: 'Error al procesar la solicitud', error: error.message });
  }
};
