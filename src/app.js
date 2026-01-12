import express from "express";

const app = express();

// Middlewares
app.use(express.json());

// Routes will go here later
// app.use('/api/users', userRoutes);

export default app;
