import express from "express";
import router from "./routes";

const app = express();
const port = process.env.PORT || 7000;

app.use(express.json());

app.use("/", router);

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
