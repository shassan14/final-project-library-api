import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import projectRoutes from './routes/projectRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

// register your Project routes here
app.use('/projects', projectRoutes);

// 404 handler (keep this AFTER routes)
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler (keep this LAST)
app.use((err, req, res, next) => {
  console.log(err.stack);
  if (!err.status) {
    err.status = 500;
    err.message = 'Internal Server Error';
  }
  res.status(err.status).json({ error: { message: err.message } });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
