import express from "express";
import {
  registerUser,
  loginUser,
  getAuthenticatedUser,
  resetPassword,
} from "../../../controllers/index.js";
import extractJwtFromHeaders from "../../../middlewares/extract-jwt-from-headers.js";

const router = express.Router();

router.get("/", extractJwtFromHeaders, getAuthenticatedUser);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/reset", resetPassword);

export default router;
