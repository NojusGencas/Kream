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

// Handle connection errors without crashing
pool.on('error', (err) => {
  console.error('MySQL Pool Error:', err.message);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') console.error('Database connection was closed.');
  if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') console.error('Database had a fatal error.');
  if (err.code === 'PROTOCOL_ENQUEUE_AFTER_DESTROY') console.error('Database connection was destroyed.');
});

export default pool;