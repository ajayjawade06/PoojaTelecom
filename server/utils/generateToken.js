import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Set JWT as HTTP-Only cookie
  const isDev = process.env.NODE_ENV === 'development';
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: !isDev, // true for production/anything else
    sameSite: isDev ? 'lax' : 'none', // 'none' for cross-domain support in production
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 Days
  });
};

export default generateToken;
