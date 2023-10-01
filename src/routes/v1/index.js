import express from "express";
import userRouter from "./user/user-router.js";
import booksRouter from "./book/book-router.js";

const router = express.Router();

router.use("/users", userRouter);
router.use("/books", booksRouter);

export default router;
