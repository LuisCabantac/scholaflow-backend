import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";

import userRouter from "./routes/users";
import classroomsRouter from "./routes/classrooms";
import accountsController from "./routes/accounts";

const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [process.env.FRONTEND_APP_URL!]
        : [process.env.FRONTEND_APP_URL!, process.env.LOCALHOST_APP_URL ?? ""],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({
    message: "ScholaFlow Backend API",
    version: "1.0.0",
    status: "running",
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/v1/api/users", userRouter);

app.use("/v1/api/accounts", accountsController);

app.use("/v1/api/classrooms", classroomsRouter);

export default app;
