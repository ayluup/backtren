import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Backtren API",
      version: "1.0.0",
      description: "Documentación de la API del sistema escolar",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
    tags: [
      {
        name: "Health",
        description: "Verificación del estado del API",
      },
      {
        name: "Users",
        description: "Gestión de usuarios y roles",
      },
      {
        name: "Subjects",
        description: "Gestión de materias",
      },
      {
        name: "Enrollments",
        description: "Gestión de inscripciones",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec, swaggerUi };