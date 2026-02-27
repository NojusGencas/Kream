import express from "express";
const router = express.Router();

import * as userController from "../controllers/auth.js";

// Vartotojo autentifikacija
router.post("/login", userController.authValidator(), userController.login);

// Vartotojo registracija
router.post("/register", userController.authValidator(), userController.register);

export default router;
