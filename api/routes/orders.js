import express from 'express';
import * as orderController from "../controllers/order.js";
import { isAuth, isAdmin } from "../controllers/auth.js";

const router = express.Router();

// GET /orders - visi užsakymai (tik admin)
router.get("/", isAuth, orderController.index);

// GET /orders/stats - statistika (tik admin)
router.get("/stats", isAuth, orderController.stats);

// GET /orders/:id - užsakymas pagal ID (tik admin)
router.get("/:id", isAuth, orderController.show);

// POST /orders - sukurti užsakymą (public - iš front formos)
router.post("/", orderController.orderValidator(), orderController.store);

// PUT /orders/:id/status - atnaujinti statusą (tik admin)
router.put("/:id/status", isAuth, orderController.statusValidator(), orderController.updateStatus);

// DELETE /orders/status/:status - ištrinti visus pagal statusą (tik admin)
// SVARBU: ši route turi būti PRIEŠ /:id route
router.delete("/status/:status", isAuth, orderController.deleteByStatus);

// DELETE /orders/:id - ištrinti (tik admin)
router.delete("/:id", isAuth, orderController.destroy);

export default router;
