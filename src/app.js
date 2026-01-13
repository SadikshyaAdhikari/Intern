import express from "express";
import  router from "./routes/auth.routes.js";

const app = express();

// Middlewares
app.use(express.json());

app.use("/api/auth",  router);

// Routes will go here later
// app.use('/api/users', userRoutes);

export default app;
