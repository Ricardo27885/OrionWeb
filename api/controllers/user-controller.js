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
      const { username, password, idRol, activo } = req.body;
  
      if (!username || !password || !idRol) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
      }
  
      // Hashear la contraseña antes de guardarla
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const success = await UserModel.createUser(username, hashedPassword, idRol, activo);
      
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
  
  async function updateUser(req, res) {
    try {
      const { idUsuario, username, password, idRol, activo } = req.body;
  
      if (!idUsuario || !username || !password || !idRol || activo === undefined) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
      }
  
      // Hashear la nueva contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const success = await UserModel.updateUser(idUsuario, username, hashedPassword, idRol, activo);
  
      if (success) {
        return res.status(200).json({ message: "Usuario actualizado exitosamente" });
      } else {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error("Error en updateUser:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
  
  module.exports = { getAllUsers, getUserById, createUser, updateUser };