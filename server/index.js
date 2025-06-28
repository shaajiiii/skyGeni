import express from "express";
import dashboardRouter from "./routes/dashboard.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/dashboard", dashboardRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
