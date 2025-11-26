import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';

const baseUrl =
  process.env.BASE_URL ||
  (isProduction
    ? 'https://final-project-library-api-u505.onrender.com'
    : 'http://localhost:3000');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Tracker API',
      version: '1.0.0',
      description:
        'REST API for managing projects, tasks, and comments with JWT authentication.',
    },
    servers: [
      {
        url: baseUrl,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [path.join(__dirname, 'docs/*.yaml')],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
export default swaggerSpec;
