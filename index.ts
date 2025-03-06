import express from "express";

import type { Request, Response } from "express";
import userRoute from "./routes/userRoute";

const app = express();
const port = process.env.PORT || 7000;

app.use(express.json());

app.use("/users", userRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
