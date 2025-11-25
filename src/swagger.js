// src/swagger.js
const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Tracker API",
      version: "1.0.0",
      description:
        "REST API for managing projects, tasks, and comments with JWT authentication.",
    },
    servers: [
      {
        // Local dev; on Render set BASE_URL env var
        url: process.env.BASE_URL || "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    // By default, require bearer token unless overridden in YAML
    security: [{ bearerAuth: [] }],
  },
  // Load all YAML docs from src/docs
  apis: [path.join(__dirname, "docs/*.yaml")],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = { swaggerSpec };
