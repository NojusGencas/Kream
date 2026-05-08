import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'cakescatalog',
  port: process.env.DB_PORT || 3306,

  waitForConnections: true,
  connectionLimit: 20,
  maxIdle: 20,
  idleTimeout: 20000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export default pool;