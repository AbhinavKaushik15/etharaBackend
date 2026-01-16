import express from "express";
import connectToMongo from "./database/db.js";

const app = express();
const port = process.env.PORT || 5000;
connectToMongo();

app.listen(port, () => {
  console.log(`Example app listening the http://localhost:${port}`);
});
