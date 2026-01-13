import express from "express";
import  router from "./routes/auth.routes.js";

const app = express();

// Middlewares
app.use(express.json());

// Routes will go here later
app.use("/api/auth",  router);


export default app;
