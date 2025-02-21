const bcrypt = require("bcryptjs");
const UserModel = require("../models/user.model");

// Controlador para obtener todos los usuarios
const getAllUsers = async (req, res) => {
    try {
      const users = await UserModel.getAllUsers(); // O usa getAllUsers() si no usas SP
      res.status(200).json(users);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
  };
  
  // Controlador para obtener un usuario por ID
  const getUserById = async (req, res) => {
    const { idUsuario } = req.params;
    try {
      const user = await UserModel.getUserById(idUsuario);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      res.status(500).json({ message: 'Error al obtener el usuario' });
    }
  };

  async function createUser(req, res) {
    try {
      const { idUsuario, username, password, idRol, activo } = req.body;
  
      if (!username || !idRol || !activo) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
      }
  
      // Hashear la contraseña antes de guardarla
      let hashedPassword = null;
      if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
      }
      
      const success = await UserModel.createUser(idUsuario, username, hashedPassword, idRol, activo);
      
      if (success) {
        return res.status(201).json({ message: "Usuario creado exitosamente" });
      } else {
        return res.status(500).json({ message: "Error al crear usuario" });
      }
    } catch (error) {
      console.error("Error en createUser:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  
  
  
  module.exports = { getAllUsers, createUser };