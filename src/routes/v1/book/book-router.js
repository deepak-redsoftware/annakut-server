import express from "express";
import extractJwtFromHeaders from "../../../middlewares/extract-jwt-from-headers.js";
import isAdmin from "../../../middlewares/is-admin.js";
import { createMasterBooks } from "../../../controllers/index.js";

const router = express.Router();

router.post("/", extractJwtFromHeaders, isAdmin, createMasterBooks);

export default router;
