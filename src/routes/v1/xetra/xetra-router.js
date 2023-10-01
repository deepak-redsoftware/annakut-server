import express from "express";
import { createXetra } from "../../../controllers/index.js";
import extractJwtFromHeaders from "../../../middlewares/extract-jwt-from-headers.js";
import isAdmin from "../../../middlewares/is-admin.js";

const router = express.Router();

router.post("/", extractJwtFromHeaders, isAdmin, createXetra);

export default router;
