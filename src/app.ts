import express,{ Application, Request, Response } from "express";
import bookRoutes from './routes/book.routes';
import borrowRoutes from './routes/borrow.routes';
const app: Application = express();
app.use(express.json());
// Routes
app.use('/api', bookRoutes);
app.use('/api', borrowRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Library Management API is running' });
});

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     message: 'Route not found',
//     success: false,
//     error: `Cannot ${req.method} ${req.originalUrl}`
//   });
// });

// // Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error:', err);
  res.status(500).json({
    message: 'Internal server error',
    success: false,
    error: err.message
  });
});

export default app;