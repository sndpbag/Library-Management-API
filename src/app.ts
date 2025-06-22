// import express,{ Application, Request, Response } from "express";
// import bookRoutes from './routes/book.routes';
// import borrowRoutes from './routes/borrow.routes';
// import mongoose from "mongoose";
// const app: Application = express();
// app.use(express.json());
// // Routes
// app.use('/api', bookRoutes);
// app.use('/api', borrowRoutes);

// // Health check
// app.get('/', (req, res) => {
//   res.json({ status: 'OK', message: 'Library Management API is running' });
// });

// app.get('/api/health', async (req, res) => {
//   const dbState = mongoose.connection.readyState;
//   res.json({
//     status: 'OK',
//     dbConnection: dbState === 1 ? 'Connected' : 'Not Connected',
//     time: new Date()
//   });
// });


// // // 404 handler
// // app.use('*', (req, res) => {
// //   res.status(404).json({
// //     message: 'Route not found',
// //     success: false,
// //     error: `Cannot ${req.method} ${req.originalUrl}`
// //   });
// // });

// // // Global error handler
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.error('Global error:', err);
//   res.status(500).json({
//     message: 'Internal server error',
//     success: false,
//     error: err.message
//   });
// });

// export default app;

import express, { Application, Request, Response } from "express";
import bookRoutes from './routes/book.routes';
import borrowRoutes from './routes/borrow.routes';
import connectDB from './utils/db';
import mongoose from "mongoose";

const app: Application = express();
app.use(express.json());

// Database connection middleware for API routes
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Database connection failed'
    });
  }
});

// Routes
app.use('/api', bookRoutes);
app.use('/api', borrowRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Library Management API is running' });
});

app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    const dbState = mongoose.connection.readyState;
    res.json({
      status: 'OK',
      dbConnection: dbState === 1 ? 'Connected' : 'Not Connected',
      time: new Date()
    });
  } catch (error) {
    res.json({
      status: 'ERROR',
      dbConnection: 'Failed',
      error: error.message,
      time: new Date()
    });
  }
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error:', err);
  res.status(500).json({
    message: 'Internal server error',
    success: false,
    error: err.message
  });
});

export default app;