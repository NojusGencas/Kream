import db from "../db/mysql.js";

const tableName = "projects";

export const selectAll = async () => {
  try {
    const [rows] = await db.query(`SELECT * FROM ${tableName} ORDER BY sort_order ASC`);
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
      `INSERT INTO ${tableName} (title, description) VALUES (?, ?)`,
      [data.title, data.description]
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
      `UPDATE ${tableName} SET title = ?, description = ?, sort_order = ?, publish_date = ? WHERE id = ?`,
      [data.title, data.description, data.sort_order, data.publish_date, id]
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
