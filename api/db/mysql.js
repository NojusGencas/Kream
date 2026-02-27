import mysql from 'mysql2/promise';

export default mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'cakescatalog',
  port: '3306',

  waitForConnections: true,
  connectionLimit: 20,
  maxIdle: 20,
  idleTimeout: 20000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});