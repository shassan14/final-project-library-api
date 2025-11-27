import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/tasks.js';
import commentRoutes from './routes/commentRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/', taskRoutes);
app.use('/', commentRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 🔹 NEW home page
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
      <h1 style="color: #2c3e50;">Welcome To The Task Tracker API </h1>
      <p style="font-size: 18px; color: #555;">
        Our API is live and running successfully on Render.
      </p>
      <p style="margin-top: 20px;">
        <a href="/docs" 
           style="display: inline-block; 
                  padding: 10px 20px; 
                  background-color: #4CAF50; 
                  color: white; 
                  text-decoration: none; 
                  border-radius: 5px;
                  font-weight: bold;">
          View Swagger Documentation
        </a>
      </p>
    </div>
  `);
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (!err.status) {
    err.status = 500;
    err.message = 'Internal Server Error';
  }
  res.status(err.status).json({ error: { message: err.message } });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/docs`);
});

export default app;


