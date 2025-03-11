import {
  addBook,
  deleteBookById,
  getAllBooks,
  getBookById,
  updateBook,
} from "./../controllers/bookController";
import express from "express";

const bookRoute = express.Router();

bookRoute.post("/", addBook);
bookRoute.post("/:id", updateBook);
bookRoute.get("/", getAllBooks);
bookRoute.get("/:id", getBookById);
bookRoute.delete("/:id", deleteBookById);

export default bookRoute;
