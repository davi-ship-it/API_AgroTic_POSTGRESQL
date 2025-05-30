import { createRoleChangeToken, validateRoleChangeToken } from '../../../services/tokenService.js';
import { transporter } from '../../../config/mailer.js';
import { pool } from '../../../database/conexion.js';



const { JWT_EXPIRES_IN } = process.env;

export const requestRoleChange = async (req, res) => {
  try {
    const { aprendiz_dni, instructor_correo } = req.body;
    const token = createRoleChangeToken(aprendiz_dni);
    const acceptLink = `${process.env.FRONTEND_URL}/role-change/accept?token=${token}`;

    await transporter.sendMail({
      from: `"AgroTic" <${process.env.SMTP_USER}>`,
      to: instructor_correo,
      subject: 'Solicitud de cambio de rol',
      html: `
        <p>El aprendiz <strong>${aprendiz_dni}</strong> solicita ser Instructor.</p>
        <p>Para aceptar, haz clic <a href="${acceptLink}">aquí</a>. El enlace expira en ${JWT_EXPIRES_IN}.</p>
      `
    });

    return res.status(200).json({ message: 'Solicitud enviada por email.' });
  } catch (error) {
    console.error('requestRoleChange error:', error);
    return res.status(500).json({ message: 'Error enviando solicitud', error: error.message });
  }
};

export const acceptRoleChange = async (req, res) => {
  try {
    const { token } = req.query;
    const aprendizDni = validateRoleChangeToken(token);


    if (!aprendizDni) {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }

    // Aquí fijamos en “Instructor” de manera fija:
    const updatedUser = await updateRol(aprendizDni);

    return res.status(200).json({
      message: 'Rol actualizado a Instructor con éxito.'
    });
  } catch (error) {
    console.error('acceptRoleChange error:', error);
    return res.status(500).json({ message: 'Error procesando aceptación', error: error.message });
  }
};

// Función para actualizar el rol
const updateRol = async (usu_dni) => {
  const sql = 'UPDATE usuarios SET usu_rol = $1 WHERE usu_dni = $2 RETURNING *';
  const result = await pool.query(sql, ["Instru", usu_dni]);
  return result.rows[0];
};
