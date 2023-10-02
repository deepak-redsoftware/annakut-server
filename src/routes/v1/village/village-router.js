import express from "express";
import { createVillage } from "../../../controllers/index.js";
import extractJwtFromHeaders from "../../../middlewares/extract-jwt-from-headers.js";
import isITNirikshakOrAdmin from "../../../middlewares/is-it-nirikshak-or-admin.js";

const router = express.Router();

router.post("/", extractJwtFromHeaders, isITNirikshakOrAdmin, createVillage);

export default router;
