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
      },
    ],
  },

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec, swaggerUi };