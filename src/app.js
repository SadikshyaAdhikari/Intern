import express from "express";
import  router from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser())


// Routes will go here later
app.use("/api/auth",  router);


export default app;
