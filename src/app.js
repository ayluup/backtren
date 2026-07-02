// Configuración de Express
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import healthRoutes from "./routes/heal.routes.js";
import usersRoutes from "./routes/user.routes.js";
import materiasRoutes from "./routes/subjects.routes.js";
import enrollmentsRoutes from "./routes/enrollments.routes.js";
import { swaggerSpec, swaggerUi } from "./swagger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Rutas
app.use("/api", healthRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/subjects", materiasRoutes);
app.use("/api/enrollments", enrollmentsRoutes);

// Interfaz simple para probar la API
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "interface.html"));
});

// Documentación Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;