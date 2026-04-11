const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ZodError } = require('zod');
const { prisma } = require('../prismaClient');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validation/authSchemas');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const TOKEN_EXPIRES_IN = '1h';
const APP_URL = process.env.APP_URL || 'http://localhost:5173';

async function sendPasswordResetEmail(email, resetToken) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || 'Alignment OS <onboarding@resend.dev>';
  if (!apiKey) return;
  try {
    const { Resend } = require('resend');
    const resend = new Resend(apiKey);
    const link = `${APP_URL}/reset-password?token=${encodeURIComponent(resetToken)}`;
    await resend.emails.send({
      from,
      to: email,
      subject: 'Reset your Alignment OS password',
      html: `<p>You requested a password reset. Click the link below to set a new password (link expires in 1 hour):</p><p><a href="${link}">${link}</a></p><p>If you didn't request this, you can ignore this email.</p><p>— Alignment OS</p>`,
    });
  } catch (err) {
    console.error('Password reset email failed:', err.message);
  }
}

function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  );
}

async function register(req, res, next) {
  try {
    const raw = {
      email: typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : req.body.email,
      name: typeof req.body.name === 'string' ? req.body.name.trim() : req.body.name,
      password: req.body.password,
    };
    const data = registerSchema.parse(raw);

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: passwordHash,
      },
    });

    const token = signToken(user);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
        plan: user.plan,
      },
    });
  } catch (err) {
    if (err instanceof ZodError) {
      const firstMsg = err.errors[0]?.message || 'Invalid data';
      return res.status(400).json({ message: firstMsg, errors: err.errors });
    }
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const raw = {
      email: typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : req.body.email,
      password: req.body.password,
    };
    const data = loginSchema.parse(raw);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.suspendedAt) {
      return res.status(403).json({ message: 'This account has been suspended.' });
    }

    const token = signToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role,
        plan: user.plan,
      },
    });
  } catch (err) {
    if (err instanceof ZodError) {
      const firstMsg = err.errors[0]?.message || 'Invalid email or password';
      return res.status(400).json({ message: firstMsg, errors: err.errors });
    }
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const data = forgotPasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: data.email.trim().toLowerCase() },
    });
    if (user) {
      const resetToken = jwt.sign(
        { sub: user.id, purpose: 'password_reset' },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      sendPasswordResetEmail(user.email, resetToken).catch((err) =>
        console.error('Password reset email failed:', err.message)
      );
    }
    res.json({ message: 'If that email is registered, we sent a reset link.' });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: 'Invalid email', errors: err.errors });
    }
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const data = resetPasswordSchema.parse(req.body);
    let payload;
    try {
      payload = jwt.verify(data.token, JWT_SECRET);
    } catch (_) {
      return res.status(400).json({ message: 'Invalid or expired reset link. Request a new one.' });
    }
    if (payload.purpose !== 'password_reset' || !payload.sub) {
      return res.status(400).json({ message: 'Invalid reset link.' });
    }
    const passwordHash = await bcrypt.hash(data.newPassword, 10);
    await prisma.user.update({
      where: { id: payload.sub },
      data: { password: passwordHash },
    });
    res.json({ message: 'Password updated. You can sign in with your new password.' });
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: err.errors[0]?.message || 'Invalid data', errors: err.errors });
    }
    next(err);
  }
}

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};

