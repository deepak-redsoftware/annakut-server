import express from "express";
import {
  registerUser,
  loginUser,
  getAuthenticatedUser,
  resetPassword,
  registerSevak,
} from "../../../controllers/index.js";
import extractJwtFromHeaders from "../../../middlewares/extract-jwt-from-headers.js";
import isAdmin from "../../../middlewares/is-admin.js";
import isITNirikshakOrAdmin from "../../../middlewares/is-it-nirikshak-or-admin.js";

const router = express.Router();

router.get("/", extractJwtFromHeaders, getAuthenticatedUser);

router.post("/register", extractJwtFromHeaders, isAdmin, registerUser);
router.post(
  "/registerSevak",
  extractJwtFromHeaders,
  isITNirikshakOrAdmin,
  registerSevak
);
router.post("/login", loginUser);
router.post("/reset", resetPassword);

export default router;
