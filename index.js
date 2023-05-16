import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";

import userRouter from "./routes/userRoutes.js";
import teacherRouter from "./routes/teacherRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
const app = new express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running ...");
});
app.use("/users", userRouter);
app.use("/teachers", teacherRouter);
app.use("/reviews", reviewRouter);

app.listen(
  PORT,
  console.log(`Server Running in ${process.env.NODE_ENV} mode on Port ${PORT}`)
);
