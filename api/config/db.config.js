const sql = require('mssql');
const dotenv = require("dotenv");
dotenv.config();

const config = {
  server: process.env.MSSQL_SERVER || 'localhost',
  database: process.env.MSSQL_DATABASE || 'NombreDeTuDB',
  user: process.env.MSSQL_USER || 'sa',
  password: process.env.MSSQL_PASSWORD || 'TuContraseña',
  port: parseInt(process.env.MSSQL_PORT) || 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Creamos un pool de conexiones
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("✅ Conexión exitosa a la base de datos");
    return pool;
  })
  .catch(err => {
    console.error("❌ Error al conectar a la base de datos:", err);
    throw err;
  });

async function testConnection() {
  try {
    const pool = await poolPromise;
    console.log("✅ Conexión probada con éxito");
  } catch (error) {
    console.error("❌ Error de conexión:", error);
  }
}

module.exports = { sql, poolPromise };

