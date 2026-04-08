import "dotenv/config";
import cors from "cors";
import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { initDb } from "./config/db";
import { swaggerSpec } from "./config/swagger";
import userRoutes from "./routes/userRoutes";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api/users", userRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
