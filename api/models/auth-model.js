const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sql, poolPromise } = require("../config/db.config");
const dotenv = require("dotenv");
dotenv.config();



async function loginUser(username, password) {
    try {
      if (!username || !password) {
        throw new Error("El nombre de usuario y la contraseña son requeridos");
      }
  
      const pool = await poolPromise;
      const result = await pool.request()
        .input("username", sql.VarChar, username)
        .query("SELECT * FROM Usuarios WHERE username = @username");
  
      const user = result.recordset[0];
  
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
  
      if (!user.activo) {
        throw new Error("El usuario está inactivo, contacte al administrador");
      }
  
      // Comparar la contraseña ingresada con la almacenada en la BD
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
      throw new Error("Contraseña incorrecta");
     }
  
      const payload = {
        idUsuario: user.idUsuario,
        username: user.username,
        idRol: user.idRol,
      };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "12h" });
  
      return { token, message: "Login exitoso" };
  
    } catch (error) {
      throw new Error(error.message || "Error en el inicio de sesión");
    }
  }


module.exports = { loginUser};