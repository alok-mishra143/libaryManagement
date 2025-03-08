import bookRoute from "./bookRoutes";
import borrowRoute from "./borrowRoute";
import userRoute from "./userRoute";
import { Router } from "express";

const router = Router();

const allRoutes = [
  { path: "/users", route: userRoute },
  { path: "/books", route: bookRoute },
  { path: "/borrows", route: borrowRoute },
];

allRoutes.forEach(({ path, route }) => {
  router.use(path, route);
  console.log(`✅ Route registered: ${path}`);
});

export default router;
