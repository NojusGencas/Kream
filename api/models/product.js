import db from "../db/mysql.js";

const tableName = "products";

export const selectAll = async () => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, 
             (SELECT pi.image_path FROM product_images pi 
              WHERE pi.product_id = p.id 
              ORDER BY pi.is_main DESC, pi.sort_order ASC LIMIT 1) as main_image 
      FROM ${tableName} p 
      ORDER BY p.is_active DESC, p.sort_order ASC
    `);
    return rows;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const selectById = async (id) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, 
              (SELECT pi.image_path FROM product_images pi 
               WHERE pi.product_id = p.id 
               ORDER BY pi.is_main DESC, pi.sort_order ASC LIMIT 1) as main_image
       FROM ${tableName} p 
       WHERE p.id = ?`, 
      [id]
    );
    if (rows[0]) {
      // Fetch all images
      const images = await getImages(id);
      rows[0].images = images;
    }
    return rows[0];
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const selectByCategory = async (categoryId) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM ${tableName} WHERE category_id = ? ORDER BY is_active DESC, sort_order ASC`,
      [categoryId]
    );
    return rows;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getImages = async (productId) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM product_images WHERE product_id = ? ORDER BY is_main DESC, sort_order ASC`,
      [productId]
    );
    return rows;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const selectByIdWithImages = async (id) => {
  try {
    const product = await selectById(id);
    if (!product) return null;
    
    const images = await getImages(id);
    product.images = images || [];
    return product;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export async function insert(data) {
  try {
    const [result] = await db.query(
      `INSERT INTO ${tableName} (category_id, name, slug, description, price_per_kg, sort_order, publish_date, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [data.category_id, data.name, data.slug, data.description || '', data.price_per_kg || 0, data.sort_order || 0, data.publish_date || new Date().toISOString().split('T')[0], data.is_active || 1]
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
      `UPDATE ${tableName} SET category_id = ?, name = ?, slug = ?, description = ?, price_per_kg = ?, sort_order = ?, is_active = ? WHERE id = ?`,
      [data.category_id, data.name, data.slug, data.description || '', data.price_per_kg || 0, data.sort_order || 0, data.is_active, id]
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

// Update only is_active status
export async function updateActive(id, isActive) {
  try {
    const [result] = await db.query(
      `UPDATE ${tableName} SET is_active = ? WHERE id = ?`,
      [isActive, id]
    );
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
}

// Image management
export async function insertImage(productId, imagePath, isMain = false) {
  try {
    // Jei nauja nuotrauka bus pagrindinė, pirmiausia nuimti is_main nuo kitų
    if (isMain) {
      await db.query(
        `UPDATE product_images SET is_main = 0 WHERE product_id = ?`,
        [productId]
      );
    }
    
    const [result] = await db.query(
      `INSERT INTO product_images (product_id, image_path, is_main, sort_order) VALUES (?, ?, ?, ?)`,
      [productId, imagePath, isMain ? 1 : 0, 0]
    );
    return result.insertId;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getImageById(imageId) {
  try {
    const [rows] = await db.query(
      `SELECT * FROM product_images WHERE id = ?`,
      [imageId]
    );
    return rows[0];
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function deleteImage(imageId) {
  try {
    const [result] = await db.query(
      `DELETE FROM product_images WHERE id = ?`,
      [imageId]
    );
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function setMainImage(productId, imageId) {
  try {
    // Pirmiausia nuimti is_main nuo visų produkto nuotraukų
    await db.query(
      `UPDATE product_images SET is_main = 0 WHERE product_id = ?`,
      [productId]
    );
    
    // Nustatyti naują pagrindinę
    const [result] = await db.query(
      `UPDATE product_images SET is_main = 1 WHERE id = ? AND product_id = ?`,
      [imageId, productId]
    );
    return result.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return null;
  }
}
