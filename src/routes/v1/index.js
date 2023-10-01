import express from "express";
import userRouter from "./user/user-router.js";
import booksRouter from "./book/book-router.js";
import xetraRouter from "./xetra/xetra-router.js";

const router = express.Router();

router.use("/users", userRouter);
router.use("/books", booksRouter);
router.use("/xetras", xetraRouter);

export default router;
