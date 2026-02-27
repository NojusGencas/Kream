import db from '../db/mysql.js';

const tableName = 'users';

export const selectAll = async () => {
  try {
    const [rows] = await db.query(`SELECT id, email, role, status FROM ${tableName}`);
    return rows;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const selectById = async (id) => {
  try {
    const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id]);
    return rows[0];
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const selectByEmail = async (email) => {
  try {
    const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE email = ?`, [email]);
    return rows[0];
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function insert(data) {
  try {
    // Nauji vartotojai gauna "user" rolę pagal nutylėjimą
    const role = data.role || 'user';
    const [result] = await db.query(`INSERT INTO ${tableName} (email, password, role) VALUES (?, ?, ?)`, [data.email, data.password, role]);
    return result.insertId;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function update(id, data) {
  try {
    const [result] = await db.query(`UPDATE ${tableName} SET email = ?, password = ? WHERE id = ?`, [data.email, data.password, id]);
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function destroy(id) {
  try {
    const [result] = await db.query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function updatePassword(id, newPassword) {
  try {
    const [result] = await db.query(`UPDATE ${tableName} SET password = ? WHERE id = ?`, [newPassword, id]);
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function updateRole(id, role) {
  try {
    const [result] = await db.query(`UPDATE ${tableName} SET role = ? WHERE id = ?`, [role, id]);
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function updateStatus(id, status) {
  try {
    const [result] = await db.query(`UPDATE ${tableName} SET status = ? WHERE id = ?`, [status, id]);
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function updateEmail(id, email) {
  try {
    const [result] = await db.query(`UPDATE ${tableName} SET email = ? WHERE id = ?`, [email, id]);
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function adminResetPassword(id, newPassword) {
  try {
    const [result] = await db.query(`UPDATE ${tableName} SET password = ? WHERE id = ?`, [newPassword, id]);
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
} 