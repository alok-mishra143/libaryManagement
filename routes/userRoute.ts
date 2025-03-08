import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  loginUser,
  logOutUser,
  updateUser,
} from "../controllers/userController";
const userRoute = express.Router();

userRoute.post("/signup", createUser);
userRoute.post("/login", loginUser);
userRoute.post("/logout", logOutUser);
userRoute.get("/:id", getUserById);
userRoute.patch("/:id", updateUser);
userRoute.delete("/:id", deleteUser);
userRoute.get("/", getAllUsers);

export default userRoute;
