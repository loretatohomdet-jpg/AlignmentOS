require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { prisma } = require('./src/prismaClient');
const { authMiddleware } = require('./src/middleware/auth');
const { errorHandler } = require('./src/middleware/errorHandler');
const authRoutes = require('./src/routes/auth');
const assessmentRoutes = require('./src/routes/assessment');
const habitRoutes = require('./src/routes/habits');
const userRoutes = require('./src/routes/user');
const leadRoutes = require('./src/routes/lead');
const adminRoutes = require('./src/routes/admin');
const agentRoutes = require('./src/routes/agent');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware — in production set CORS_ORIGIN to your frontend URL (e.g. https://app.alignmentos.com)
const corsOrigin = process.env.CORS_ORIGIN;
app.use(cors(corsOrigin ? { origin: corsOrigin } : undefined));
app.use(express.json());

// Health check
app.get('/health', async (_req, res) => {
  try {
    // Simple DB check
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    console.error('DB health check error', err);
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

// Public auth routes
app.use('/api/auth', authRoutes);

// Assessment routes
app.use('/api/assessment', assessmentRoutes);

// Habits (assigned + completion)
app.use('/api/habits', habitRoutes);

// Public lead capture (for ads / lander)
app.use('/api/lead', leadRoutes);

// User profile (GET + PATCH /api/me)
app.use('/api/me', userRoutes);

// Admin (auth + ADMIN role required)
app.use('/api/admin', adminRoutes);

// AI agent (auth required)
app.use('/api/agent', agentRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});

