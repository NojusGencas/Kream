import pool from './api/db/mysql.js';

async function test() {
  const [rows] = await pool.query('SELECT id, name, category_id FROM products');
  const [cats] = await pool.query('SELECT id, name FROM categories');
  console.log("Products:");
  console.log(rows);
  console.log("Categories:");
  console.log(cats);
  process.exit(0);
}
test().catch(console.error);
