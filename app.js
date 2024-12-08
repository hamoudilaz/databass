import express from "express";
import router from "./routes/bookroutes.js";

const app = express();

app.use(express.json());
app.use("/", router);
app.use(express.static("public"));

export default app;
