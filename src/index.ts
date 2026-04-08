import "dotenv/config";
import cors from "cors";
import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { initDb } from "./config/db";
import { swaggerSpec } from "./config/swagger";
import userRoutes from "./routes/userRoutes";

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173"];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api/users", userRoutes);
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
      console.error("DB init failed:", err.message || err);
      process.exit(1);
    });
}
