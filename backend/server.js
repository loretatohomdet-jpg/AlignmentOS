require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const { prisma } = require('./src/prismaClient');
const { errorHandler } = require('./src/middleware/errorHandler');
const authRoutes = require('./src/routes/auth');
const assessmentRoutes = require('./src/routes/assessment');
const habitRoutes = require('./src/routes/habits');
const userRoutes = require('./src/routes/user');
const leadRoutes = require('./src/routes/lead');
const adminRoutes = require('./src/routes/admin');
const agentRoutes = require('./src/routes/agent');
const { getPublic: getPublicShare } = require('./src/controllers/shareController');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

const corsOriginRaw = process.env.CORS_ORIGIN;
const corsOrigins = corsOriginRaw
  ? corsOriginRaw.split(',').map((s) => s.trim()).filter(Boolean)
  : [];
const corsOptions =
  corsOrigins.length === 0
    ? undefined
    : corsOrigins.length === 1
      ? { origin: corsOrigins[0] }
      : { origin: corsOrigins };
app.use(cors(corsOptions));
app.use(express.json({ limit: '120kb' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
});
const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});
const sharePublicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});
const apiSoftLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 800,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiSoftLimiter);

// Health check
app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    console.error('DB health check error', err);
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

app.get('/api/public/share/:token', sharePublicLimiter, getPublicShare);

// Public auth routes
app.use('/api/auth', authLimiter, authRoutes);

// Assessment routes
app.use('/api/assessment', assessmentRoutes);

// Habits (assigned + completion)
app.use('/api/habits', habitRoutes);

// Public lead capture (for ads / lander)
app.use('/api/lead', leadLimiter, leadRoutes);

// User profile (GET + PATCH /api/me)
app.use('/api/me', userRoutes);

// Admin (auth + ADMIN role required)
app.use('/api/admin', adminRoutes);

// AI agent (auth required)
app.use('/api/agent', agentRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
  });
}

module.exports = { app };
