import express from "express";
import authRoutes from "#features/auth/auth.routes";
import businessRoutes from "#features/business/business.routes"
import userRoutes from "#features/users/users.routes"
import cookieParser from "cookie-parser";
import { errorMiddleware } from "#middleware/error.middleware";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.use("/auth", authRoutes);
app.use("/users", userRoutes)
app.use("/business", businessRoutes);



app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    timeStamp: new Date().toISOString(),
  });
});

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// global error handler

app.use(errorMiddleware);
