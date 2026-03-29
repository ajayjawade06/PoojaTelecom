import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Set JWT as HTTP-Only cookie
  const isProd = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: isProd, // true for production/any live environment
    sameSite: isProd ? 'none' : 'lax', // 'none' for cross-domain support in prod
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Days
  });

  return token;
};

export default generateToken;
