import express from "express";
import { createVillage } from "../../../controllers/index.js";
import extractJwtFromHeaders from "../../../middlewares/extract-jwt-from-headers.js";
import isAdmin from "../../../middlewares/is-admin.js";

const router = express.Router();

router.post("/", extractJwtFromHeaders, isAdmin, createVillage);

export default router;
