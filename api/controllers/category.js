import * as categoryModel from "../models/category.js";
import fs from 'fs';
import path from 'path';

// GET /categories
export const index = async (req, res, next) => {
  let categories = await categoryModel.selectAll();
  res.json(categories);      
};

// GET /categories/:id
export const show = async (req, res, next) => {
  let category = await categoryModel.selectById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Kategorija nerasta" });
  }

  res.json(category);
};

// POST /categories
export const store = async (req, res, next) => {
  if (!req.body.name || !req.body.slug) {
    return res.status(400).json({ message: "Trūksta duomenų: name ir slug yra privalomi" });
  }

  let categoryId = await categoryModel.insert(req.body);

  if (!categoryId) {
    return res.status(500).json({ message: "Klaida kuriant kategoriją" });
  }

  res.status(201).json({ id: categoryId });
};

// PUT /categories/:id
export const update = async (req, res, next) => {
  if (!req.body.name || !req.body.slug) {
    return res.status(400).json({ message: "Trūksta duomenų: name ir slug yra privalomi" });
  }

  let success = await categoryModel.update(req.params.id, req.body);

  if (!success) {
    return res.status(500).json({ message: "Klaida atnaujinant kategoriją" });
  }

  res.json({ message: "Kategorija atnaujinta" });
};

// DELETE /categories/:id
export const destroy = async (req, res, next) => {
  let success = await categoryModel.destroy(req.params.id);
  if (!success) {
    return res.status(500).json({ message: "Klaida trinant kategoriją" });
  }

  res.json({ message: "Kategorija ištrinta" });
};

export const uploadImage = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "Nuotrauka neįkelta" });
  }

  try {
    const category = await categoryModel.selectById(req.params.id);
    if (!category) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Kategorija nerasta" });
    }

    if (category.image) {
      const oldPath = path.join('./public', category.image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const imagePath = `/img/categories/${req.file.filename}`;
    const success = await categoryModel.updateImage(req.params.id, imagePath);

    if (!success) {
      fs.unlinkSync(req.file.path);
      return res.status(500).json({ message: "Klaida išsaugant nuotrauką" });
    }

    res.json({
      message: "Nuotrauka įkelta",
      image: imagePath
    });
  } catch (err) {
    console.error(err);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: "Serverio klaida" });
  }
};
