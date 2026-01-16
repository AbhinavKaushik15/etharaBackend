import express from "express";
import connectToMongo from "./database/db.js";
import cors from "cors";

const app = express();
const port = 5000;
connectToMongo();
app.use(cors());

app.listen(port, () => {
  console.log(`Example app listening the http://localhost:${port}`);
});
