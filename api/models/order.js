import db from '../db/mysql.js';

const tableName = 'orders';

// Gauti visus užsakymus
export const selectAll = async () => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM ${tableName} 
      ORDER BY created_at DESC
    `);
    return rows;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// Gauti užsakymą pagal ID
export const selectById = async (id) => {
  try {
    const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id]);
    return rows[0];
  } catch (err) {
    console.log(err);
    return null;
  }
};

// Gauti užsakymus pagal statusą
export const selectByStatus = async (status) => {
  try {
    const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE status = ? ORDER BY created_at DESC`, [status]);
    return rows;
  } catch (err) {
    console.log(err);
    return null;
  }
};

// Sukurti naują užsakymą
export async function insert(data) {
  try {
    const [result] = await db.query(
      `INSERT INTO ${tableName} (name, email, phone, cake_type, cake_size, cake_flavor, decoration, delivery_date, delivery_time, message, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.email,
        data.phone || null,
        data.cake_type || null,
        data.cake_size || null,
        data.cake_flavor || null,
        data.decoration || null,
        data.delivery_date || null,
        data.delivery_time || null,
        data.message || null,
        data.status || 'new'
      ]
    );
    return result.insertId;
  } catch (err) {
    console.log(err);
    return null;
  }
}

// Atnaujinti užsakymo statusą
export async function updateStatus(id, status) {
  try {
    const [result] = await db.query(
      `UPDATE ${tableName} SET status = ?, updated_at = NOW() WHERE id = ?`,
      [status, id]
    );
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
}

// Atnaujinti visą užsakymą
export async function update(id, data) {
  try {
    const [result] = await db.query(
      `UPDATE ${tableName} SET 
        name = ?, email = ?, phone = ?, cake_type = ?, cake_size = ?, 
        cake_flavor = ?, decoration = ?, delivery_date = ?, delivery_time = ?, 
        message = ?, status = ?, updated_at = NOW() 
       WHERE id = ?`,
      [
        data.name, data.email, data.phone, data.cake_type, data.cake_size,
        data.cake_flavor, data.decoration, data.delivery_date, data.delivery_time,
        data.message, data.status, id
      ]
    );
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
}

// Ištrinti užsakymą
export async function destroy(id) {
  try {
    const [result] = await db.query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
}

// Ištrinti užsakymus pagal statusą
export async function deleteByStatus(status) {
  try {
    const [result] = await db.query(`DELETE FROM ${tableName} WHERE status = ?`, [status]);
    return result.affectedRows;
  } catch (err) {
    console.log(err);
    return null;
  }
}

// Statistika
export const getStats = async () => {
  try {
    const [total] = await db.query(`SELECT COUNT(*) as count FROM ${tableName}`);
    const [newOrders] = await db.query(`SELECT COUNT(*) as count FROM ${tableName} WHERE status = 'new'`);
    const [confirmed] = await db.query(`SELECT COUNT(*) as count FROM ${tableName} WHERE status = 'confirmed'`);
    const [completed] = await db.query(`SELECT COUNT(*) as count FROM ${tableName} WHERE status = 'completed'`);
    const [cancelled] = await db.query(`SELECT COUNT(*) as count FROM ${tableName} WHERE status = 'cancelled'`);
    
    // Paskutinių 7 dienų užsakymai
    const [recentOrders] = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count 
      FROM ${tableName} 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    return {
      total: total[0].count,
      new: newOrders[0].count,
      confirmed: confirmed[0].count,
      completed: completed[0].count,
      cancelled: cancelled[0].count,
      recentOrders
    };
  } catch (err) {
    console.log(err);
    return null;
  }
};
