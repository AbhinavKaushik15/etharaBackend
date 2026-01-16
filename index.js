import express from "express";
import connectToMongo from "./database/db.js";
import AttendanceManagement from './../ethara.ai/src/pages/AttendanceManagement';

const app = express();
const port = 5000;
connectToMongo();

app.use("/api/attendance", attendance)

app.listen(port, () => {
  console.log(`Example app listening the http://localhost:${port}`);
});
