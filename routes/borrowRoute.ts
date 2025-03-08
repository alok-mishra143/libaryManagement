import express from "express";
import { addBorrow, returnBorrow } from "../controllers/borrowController";
const borrowRoute = express.Router();

borrowRoute.post("/", addBorrow);
borrowRoute.patch("/:id", returnBorrow);

export default borrowRoute;
