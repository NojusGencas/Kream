import pool from './api/db/mysql.js';

async function test() {
  const [rows] = await pool.query('SELECT id, name, slug, main_image FROM (SELECT p.*, (SELECT pi.image_path FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.is_main DESC, pi.sort_order ASC LIMIT 1) as main_image FROM products p) p_wrapped');
  console.log(rows);
  process.exit(0);
}
test().catch(console.error);
