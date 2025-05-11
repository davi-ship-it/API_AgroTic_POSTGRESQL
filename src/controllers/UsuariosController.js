// controllers/usuarios_controller.js
import { pool } from '../database/conexion.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//  Validar usuario y generar JWT (PostgreSQL)
export const validarUsuario = async (req, res) => {
  try {
    const { usu_dni, usu_password } = req.body;
    const result = await pool.query(
      'SELECT pk_id_usuario, usu_dni, usu_nombres, usu_apellidos, usu_password_h FROM usuarios WHERE usu_dni = $1',
      [usu_dni]
    );
    const rows = result.rows;
    if (rows.length === 0) {
      return res.status(404).json({ message: 'El usuario no existe' });
    }
    const user = rows[0];
    const match = await bcrypt.compare(usu_password, user.usu_password_h);
    if (!match) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const token = jwt.sign(
      {
        id: user.pk_id_usuario,
        dni: user.usu_dni,
        nombres: user.usu_nombres
      },
      process.env.JWT_SECRET || 'Palabra_clave',
      { expiresIn: '24h' }
    );
    return res.status(200).json({
      usuario: {
        id: user.pk_id_usuario,
        dni: user.usu_dni,
        nombres: user.usu_nombres,
        apellidos: user.usu_apellidos
      },
      token
    });
  } catch (error) {
    console.error('Error validando usuario:', error);
    return res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

//  Registrar usuario (PostgreSQL)
export const setUsuario = async (req, res) => {
  try {
    const {
      usu_nombres,
      usu_apellidos,
      usu_password,
      usu_telefono,
      usu_correo,
      usu_rol,
      usu_dni
    } = req.body;

    const hashed = await bcrypt.hash(usu_password, 10);
    const sql = `
      INSERT INTO usuarios
        (usu_nombres, usu_apellidos, usu_password_h, usu_telefono, usu_correo, usu_rol, usu_dni)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING pk_id_usuario
    `;
    const result = await pool.query(sql, [
      usu_nombres,
      usu_apellidos,
      hashed,
      usu_telefono,
      usu_correo,
      usu_rol,
      usu_dni
    ]);

    const newId = result.rows[0]?.pk_id_usuario;
    return res.status(201).json({ message: 'Usuario creado con éxito', id: newId });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
};

//  Listar todos los usuarios (PostgreSQL)
export const getUsuarios = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT pk_id_usuario, usu_dni, usu_nombres, usu_apellidos, usu_telefono, usu_correo, usu_rol FROM usuarios'
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

// RF3: Actualizar usuario (PostgreSQL)
export const putUsuarios = async (req, res) => {
  try {
    const {
      usu_dni,
      usu_nombres,
      usu_apellidos,
      usu_password,
      usu_telefono,
      usu_correo,
      usu_rol
    } = req.body;

    let idx = 1;
    const fields = [];
    const params = [];

    if (usu_nombres) {
      fields.push(`usu_nombres = $${idx++}`);
      params.push(usu_nombres);
    }
    if (usu_apellidos) {
      fields.push(`usu_apellidos = $${idx++}`);
      params.push(usu_apellidos);
    }
    if (usu_telefono !== undefined) {
      fields.push(`usu_telefono = $${idx++}`);
      params.push(usu_telefono);
    }
    if (usu_correo) {
      fields.push(`usu_correo = $${idx++}`);
      params.push(usu_correo);
    }
    if (usu_rol) {
      fields.push(`usu_rol = $${idx++}`);
      params.push(usu_rol);
    }
    if (usu_password) {
      const hashed = await bcrypt.hash(usu_password, 10);
      fields.push(`usu_password_h = $${idx++}`);
      params.push(hashed);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No hay campos para actualizar' });
    }

    params.push(usu_dni);
    const sql = `
      UPDATE usuarios
      SET ${fields.join(', ')}
      WHERE usu_dni = $${idx}
    `;
    const result = await pool.query(sql, params);

    if (result.rowCount > 0) {
      return res.status(200).json({ message: 'Usuario actualizado con éxito' });
    }
    return res.status(400).json({ message: 'No se encontró el usuario a actualizar' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

//  Eliminar usuario (PostgreSQL)
export const deleteUsuarios = async (req, res) => {
  try {
    const { usu_dni } = req.body;
    const sql = 'DELETE FROM usuarios WHERE usu_dni = $1';
    const result = await pool.query(sql, [usu_dni]);

    if (result.rowCount > 0) {
      return res.status(200).json({ message: 'Usuario eliminado con éxito' });
    }
    return res.status(400).json({ message: 'No se encontró el usuario a eliminar' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};
