import express from 'express';
import * as projectController from "../controllers/project.js";
const router = express.Router();

// projektų sąrašas
router.get("/", projectController.index);

// projekto informacija pagal ID
router.get("/:id", projectController.show);

// projekto kūrimas
router.post("/", projectController.store);

// projekto atnaujinimas pagal ID
router.put("/:id", projectController.update);

// projekto ištrinimas pagal ID
router.delete("/:id", projectController.destroy);

export default router;