import { Router } from "express";
import {health,dbHealth,} from "../controllers/health.controller.js";

const router = Router();

router.get("/health", health);
router.get("/health/db", dbHealth);

export default router;