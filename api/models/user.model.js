const { sql, poolPromise } = require("../config/db.config");

class UserModel {

  static  getAllUsers = async () => {
    try {
      const pool = await poolPromise;
      const result = await  pool.request().query('SELECT idUsuario, username, idRol, activo FROM Usuarios');
      return result.recordset; // Devuelve los usuarios obtenidos
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error; // Lanza el error para que sea manejado en el controlador
    }
  };

 
  static async createUser(username, password, idRol, activo = 1) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input("username", sql.VarChar, username)
        .input("password", sql.VarChar, password)
        .input("idRol", sql.Int, idRol)
        .input("activo", sql.Bit, activo)
        .query("INSERT INTO Usuarios (username, password, idRol, activo) VALUES (@username, @password, @idRol, @activo)");
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw error;
    }
  }
  
  static async createUser(idUsuario, username, password, idRol, activo = 1) {
    try {
      const pool = await poolPromise;
  
      // Si el idUsuario no existe, se realiza la validación para asegurarse de que el username no esté repetido.
      if (!idUsuario) {
        // Verificar si el nombre de usuario ya existe solo al insertar
        const checkUsername = await pool.request()
          .input("username", sql.VarChar, username)
          .query("SELECT COUNT(1) AS usernameExists FROM Usuarios WHERE username = @username");
  
        // Si el username ya existe, no realizamos ninguna acción
        if (checkUsername.recordset[0].usernameExists > 0) {
          throw new Error("El nombre de usuario ya existe.");
        }
      }
  
      // Si el idUsuario ya existe, actualizamos el usuario
      if (idUsuario) {
        
        // Construir la consulta dinámica para no actualizar la contraseña si es nula
        let query = `
          UPDATE Usuarios
          SET username = @username, idRol = @idRol, activo = @activo
          WHERE idUsuario = @idUsuario
        `;
        
        // Si la contraseña no es nula o vacía, agregarla a la consulta
        if (password) {
          query = `
            UPDATE Usuarios
            SET username = @username, password = @password, idRol = @idRol, activo = @activo
            WHERE idUsuario = @idUsuario
          `;
        }
  
        // Ejecutar la consulta
        const updateUser = await pool.request()
          .input("idUsuario", sql.Int, idUsuario)
          .input("username", sql.VarChar, username)
          .input("idRol", sql.Int, idRol)
          .input("activo", sql.Bit, activo);
  
        // Solo agregar la contraseña si es válida
        if (password) {
          updateUser.input("password", sql.VarChar, password);
        }
  
        const result = await updateUser.query(query);
        return result.rowsAffected[0] > 0;
  
      } else {
        // Insertar nuevo usuario
        const insertUser = await pool.request()
          .input("username", sql.VarChar, username)
          .input("password", sql.VarChar, password)
          .input("idRol", sql.Int, idRol)
          .input("activo", sql.Bit, activo)
          .query(`
            INSERT INTO Usuarios (username, password, idRol, activo)
            VALUES (@username, @password, @idRol, @activo)
          `);
  
        return insertUser.rowsAffected[0] > 0;
      }
  
    } catch (error) {
      throw error;
    }
  }
  
}

module.exports = UserModel;
