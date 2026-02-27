import db from "../db/mysql.js";

const tableName = "categories";

export const selectAll = async () => {
  try {
    const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE is_active = 1 ORDER BY sort_order ASC`);
    return rows;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const selectById = async (id) => {
  try {
    const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [
      id,
    ]);
    return rows[0];
  } catch (err) {
    console.log(err);
    return null;
  }
};

export async function insert(data) {
  try {
    const [result] = await db.query(
      `INSERT INTO ${tableName} (name, slug, description, image, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?)`,
      [data.name, data.slug, data.description || '', data.image || null, data.sort_order || 0, data.is_active || 1]
    );
    return result.insertId;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function update(id, data) {
  try {
    const [result] = await db.query(
      `UPDATE ${tableName} SET name = ?, slug = ?, description = ?, image = ?, sort_order = ?, is_active = ? WHERE id = ?`,
      [data.name, data.slug, data.description || '', data.image || null, data.sort_order || 0, data.is_active || 1, id]
    );
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function updateImage(id, imagePath) {
  try {
    const [result] = await db.query(
      `UPDATE ${tableName} SET image = ? WHERE id = ?`,
      [imagePath, id]
    );
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function destroy(id) {
  try {
    const [result] = await db.query(`DELETE FROM ${tableName} WHERE id = ?`, [
      id,
    ]);
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
}
