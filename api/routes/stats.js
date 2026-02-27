import express from 'express';
import * as statsController from "../controllers/stats.js";
import { isAuth } from "../controllers/auth.js";

const router = express.Router();

// GET /stats - dashboard statistika
router.get("/", isAuth, statsController.getDashboardStats);

export default router;
