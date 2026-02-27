import express from 'express';
import * as categoryController from "../controllers/category.js";
import { isAuth } from "../controllers/auth.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Multer konfigūracija nuotraukų įkėlimui
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './public/img/categories';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'category-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Tik nuotraukų failai leidžiami'));
  }
});

// PUBLIC - kategorijų sąrašas
router.get("/", categoryController.index);

// PUBLIC - kategorijos informacija pagal ID
router.get("/:id", categoryController.show);

// PROTECTED - kategorijos kūrimas
router.post("/", isAuth, categoryController.store);

// PROTECTED - kategorijos atnaujinimas pagal ID
router.put("/:id", isAuth, categoryController.update);

// PROTECTED - kategorijos nuotraukos įkėlimas
router.post("/:id/image", isAuth, upload.single('image'), categoryController.uploadImage);

// PROTECTED - kategorijos ištrinimas pagal ID
router.delete("/:id", isAuth, categoryController.destroy);

export default router;
