import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://emedshub.vercel.app"],
    credentials: true,
  })
);

// Route Imports
import AuthRoutes from "./routes/auth.route.js";
import GenericRoutes from "./routes/generic.routes.js";
import PharmaceuticalRoutes from "./routes/pharmaceutical.route.js";
import brandRoutes from "./routes/brand.routes.js";
import newsRoutes from "./routes/news.routes.js";
import advertisementRoutes from "./routes/advertisement.routes.js";
import doctorAdviceRoutes from "./routes/doctorAdvice.routes.js";
import leaderRoutes from "./routes/leader.routes.js"
import medicalRoutes from "./routes/medicalTest.routes.js"
import trustedCenterRoutes from "./routes/trustedCenter.routes.js"

// APIs
app.get("/", (req, res) => {
  res.send("Server is running at", PORT);
});

app.use("/api/auth", AuthRoutes);
app.use("/api/generic", GenericRoutes);
app.use("/api/pharma", PharmaceuticalRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/advertisement", advertisementRoutes);
app.use("/api/doctoradvice", doctorAdviceRoutes);
app.use("/api/leader", leaderRoutes)
app.use("/api/medicaltest", medicalRoutes)
app.use("/api/trustedCenter", trustedCenterRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on the PORT: ${PORT}`);
});

// test live