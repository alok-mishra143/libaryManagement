import {
  addOrUpdateBook,
  deleteBookById,
  getAllBooks,
  getBookById,
} from "./../controllers/bookController";
import express from "express";

const bookRoute = express.Router();

bookRoute.post("/", addOrUpdateBook);
bookRoute.get("/", getAllBooks);
bookRoute.get("/:id", getBookById);
bookRoute.delete("/:id", deleteBookById);

export default bookRoute;
