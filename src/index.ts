import "dotenv/config";
import cors from "cors";
import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { initDb } from "./config/db";
import { swaggerSpec } from "./config/swagger";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "https://testapp-node.vercel.app"];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
// Serve built client files from the project root so the path works
// both locally and inside Vercel serverless function bundles.
app.use(express.static(path.join(process.cwd(), "client")));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export { app, initDb };

// Only start the HTTP server when running locally (not on Vercel)
if (!process.env.VERCEL) {
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  initDb()
    .then(() => {
      app.listen(port, () =>
        console.log(`Server running at http://localhost:${port}`)
      );
    })
    .catch((err) => {
      console.warn("DB init failed; starting server without DB:", err.message || err);
      app.listen(port, () =>
        console.log(`Server running at http://localhost:${port} (DB unavailable)`)
      );
    });
}
