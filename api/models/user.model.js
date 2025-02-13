const { sql, poolPromise } = require("../config/db.config");

class UserModel {

  static  getAllUsers = async () => {
    try {
      const pool = await poolPromise;
      const result = await  pool.request().query('SELECT idUsuario as id, username as Nombre, idRol as Rol FROM Usuarios');
      return result.recordset; // Devuelve los usuarios obtenidos
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error; // Lanza el error para que sea manejado en el controlador
    }
  };

  static async getAllUsers() {
    try {
        // Se obtiene el pool de conexiones
        const pool = await poolPromise;

        // Realizar la consulta
        const result = await pool.request().query('SELECT idKeko, nombre as Nombre FROM Kekos');
        return result.recordset; // Acceder al resultado de la consulta

    } catch (error) {
        console.error("Error al obtener Kekos:", error);
        throw new Error("Error al obtener Kekos");
    }
}


  static getUserById = async (idUsuario) => {
    try {
      const pool = await poolPromise;
      const result = await  pool.request().query(`EXEC sp_get_user_by_id @idUsuario = ${idUsuario}`);
      return result.recordset[0]; // Devuelve el primer usuario si existe
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
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
  
  static async updateUser(idUsuario, username, password, idRol, activo) {
    try {
      const pool = await poolPromise;
      const result = await pool.request()
        .input("idUsuario", sql.Int, idUsuario)
        .input("username", sql.VarChar, username)
        .input("password", sql.VarChar, password)
        .input("idRol", sql.Int, idRol)
        .input("activo", sql.Bit, activo)
        .query("UPDATE Usuarios SET username = @username, password = @password, idRol = @idRol, activo = @activo WHERE idUsuario = @idUsuario");
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserModel;
