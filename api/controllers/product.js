import * as productModel from "../models/product.js";
import fs from 'fs';
import path from 'path';

// GET /products
export const index = async (req, res, next) => {
  let products = await productModel.selectAll();
  res.json(products);      
};

// GET /products/category/:categoryId
export const byCategory = async (req, res, next) => {
  let products = await productModel.selectByCategory(req.params.categoryId);
  
  if (!products) {
    return res.status(500).json({ message: "Klaida gaunant produktus" });
  }
  
  res.json(products);
};

// GET /products/:id
export const show = async (req, res, next) => {
  let product = await productModel.selectByIdWithImages(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Produktas nerastas" });
  }

  res.json(product);
};

// POST /products
export const store = async (req, res, next) => {
  if (!req.body.name || !req.body.category_id) {
    return res.status(400).json({ message: "Trūksta duomenų" });
  }

  let productId = await productModel.insert(req.body);

  if (!productId) {
    return res.status(500).json({ message: "Klaida kuriant produktą" });
  }

  res.status(201).json({ id: productId });
};

// PUT /products/:id
export const update = async (req, res, next) => {
  if (!req.body.name || !req.body.category_id) {
    return res.status(400).json({ message: "Trūksta duomenų" });
  }

  let success = await productModel.update(req.params.id, req.body);

  if (!success) {
    return res.status(500).json({ message: "Klaida atnaujinant produktą" });
  }

  res.json({ message: "Produktas atnaujintas" });
};

// DELETE /products/:id
export const destroy = async (req, res, next) => {
  let success = await productModel.destroy(req.params.id);
  if (!success) {
    return res.status(500).json({ message: "Klaida trinant produktą" });
  }

  res.json({ message: "Produktas ištrintas" });
};

export const toggleActive = async (req, res, next) => {
  try {
    const product = await productModel.selectById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produktas nerastas" });
    }

    const newStatus = product.is_active === 1 ? 0 : 1;
    const success = await productModel.updateActive(req.params.id, newStatus);

    if (!success) {
      return res.status(500).json({ message: "Klaida keičiant statusą" });
    }

    res.json({ message: "Statusas pakeistas", is_active: newStatus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverio klaida" });
  }
};

export const uploadImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "Nuotrauka neįkelta" });
  }

  try {
    const imagePath = `/img/products/${req.file.filename}`;
    const isMain = req.body.is_main === 'true' || req.body.is_main === '1';
    
    const imageId = await productModel.insertImage(req.params.id, imagePath, isMain);

    if (!imageId) {
      fs.unlinkSync(req.file.path);
      return res.status(500).json({ message: "Klaida išsaugant nuotrauką" });
    }

    res.status(201).json({
      message: "Nuotrauka įkelta",
      image: {
        id: imageId,
        image_path: imagePath,
        is_main: isMain
      }
    });
  } catch (err) {
    console.error(err);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: "Serverio klaida" });
  }
};

export const deleteImage = async (req, res, next) => {
  try {
    const image = await productModel.getImageById(req.params.imageId);
    
    if (!image) {
      return res.status(404).json({ message: "Nuotrauka nerasta" });
    }

    const filePath = path.join('./public', image.image_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const success = await productModel.deleteImage(req.params.imageId);

    if (!success) {
      return res.status(500).json({ message: "Klaida trinant nuotrauką" });
    }

    res.json({ message: "Nuotrauka ištrinta" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverio klaida" });
  }
};

export const setMainImage = async (req, res, next) => {
  try {
    const success = await productModel.setMainImage(req.params.id, req.params.imageId);

    if (!success) {
      return res.status(500).json({ message: "Klaida nustatant pagrindinę nuotrauką" });
    }

    res.json({ message: "Pagrindinė nuotrauka nustatyta" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Serverio klaida" });
  }
};
