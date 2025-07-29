import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import noteRoutes from "./routes/noteRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();
const app = express();

// const allowedrigins = [
//   "http://localhost:5173",
//   "http://localhost:5174",
//   "https://notely-client-iota.vercel.app",
//   "https://notely-client-side.vercel.app",
//   "https://notely-client-side-qesz.vercel.app/",
// ];

app.use(
  cors({
    origin: "https://notely-client-side.vercel.app/", // frontend URL
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
