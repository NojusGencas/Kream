import express from 'express';
import * as productController from "../controllers/product.js";
import { isAuth } from "../controllers/auth.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Multer konfigūracija nuotraukų įkėlimui
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './public/img/products';
    // Sukurti aplanką jei neegzistuoja
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Tik nuotraukų failai leidžiami (jpeg, jpg, png, gif, webp)'));
  }
});

// PUBLIC routes
// produktų sąrašas
router.get("/", productController.index);

// produktai pagal kategoriją
router.get("/category/:categoryId", productController.byCategory);

// produkto informacija pagal ID
router.get("/:id", productController.show);

// PROTECTED routes (reikia auth)
// produkto kūrimas
router.post("/", isAuth, productController.store);

// produkto atnaujinimas pagal ID
router.put("/:id", isAuth, productController.update);

// atnaujinti tik is_active statusą
router.patch("/:id/toggle-active", isAuth, productController.toggleActive);

// produkto ištrinimas pagal ID
router.delete("/:id", isAuth, productController.destroy);

// Nuotraukų valdymas
router.post("/:id/images", isAuth, upload.single('image'), productController.uploadImage);
router.delete("/:id/images/:imageId", isAuth, productController.deleteImage);
router.put("/:id/images/:imageId/main", isAuth, productController.setMainImage);

export default router;