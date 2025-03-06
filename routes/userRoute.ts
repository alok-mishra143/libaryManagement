import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  loginUser,
  updateUser,
} from "../controllers/userController";
const userRoute = express.Router();

userRoute.post("/signup", createUser);
userRoute.post("/login", loginUser);
userRoute.get("/:id", getUserById);
userRoute.patch("/:id", updateUser);
userRoute.delete("/:id", deleteUser);
userRoute.get("/", getAllUsers);

export default userRoute;
