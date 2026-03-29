import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import { sendVerificationEmail, sendResetPasswordEmail } from '../utils/emailService.js';

// Strict email validator
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      addresses: user.addresses || [],
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user & send OTP
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Server-side strict email validation
  if (!isValidEmail(email)) {
    res.status(400);
    throw new Error('Please enter a valid email address (e.g. user@example.com)');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    if (!userExists.isVerified) {
      // Resend OTP for existing unverified account
      const otp = generateOTP();
      const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
      userExists.verificationCode = otp;
      userExists.verificationCodeExpiry = expiry;
      await userExists.save();
      
      try {
        await sendVerificationEmail(email, userExists.name, otp);
      } catch (emailError) {
        console.error('Email sending failed:', emailError.message);
      }
      return res.status(200).json({ 
        message: 'Verification code resent. Please check your email.', 
        email 
      });
    }
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const otp = generateOTP();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

  try {
    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
      verificationCode: otp,
      verificationCodeExpiry: expiry,
    });

    if (user) {
      // Try to send email but don't fail if it errors (for now)
      try {
        await sendVerificationEmail(email, name, otp);
      } catch (emailError) {
        console.error('Email sending failed:', emailError.message);
      }
      
      return res.status(201).json({
        message: 'Registration successful! Check your email for verification code.',
        email,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (dbError) {
    console.error('User creation failed:', dbError.message);
    res.status(500).json({
      message: `Registration failed: ${dbError.message}`
    });
  }
});

// @desc    Verify email with OTP
// @route   POST /api/users/verify-email
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.isVerified) {
    return res.json({ message: 'Email is already verified. Please log in.' });
  }

  if (user.verificationCode !== code) {
    res.status(400);
    throw new Error('Invalid verification code. Please try again.');
  }

  if (user.verificationCodeExpiry < new Date()) {
    res.status(400);
    throw new Error('Verification code has expired. Please register again to get a new code.');
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpiry = undefined;
  await user.save();

  generateToken(res, user._id);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    addresses: user.addresses || [],
    message: 'Email verified successfully! Welcome to Pooja Telecom.',
  });
});

// @desc    Resend verification email
// @route   POST /api/users/resend-verification
// @access  Public
const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.isVerified) {
    return res.status(400).json({ message: 'Account is already verified. Please login.' });
  }

  const otp = generateOTP();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

  user.verificationCode = otp;
  user.verificationCodeExpiry = expiry;
  await user.save();

  try {
    await sendVerificationEmail(email, user.name, otp);
    res.status(200).json({ message: 'Verification code resent. Please check your email.' });
  } catch (error) {
    console.error('Email sending failed:', error.message);
    res.status(500).json({ message: 'Failed to send verification email. Please try again.' });
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      addresses: user.addresses || [],
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    if (req.body.address) {
      const newAddr = req.body.address;
      if (newAddr.address && newAddr.city) {
        const exists = user.addresses.find(a => a.address === newAddr.address && a.city === newAddr.city);
        if (!exists) {
          user.addresses.push(newAddr);
        }
      }
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      addresses: updatedUser.addresses,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user._id.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('Admins cannot delete their own accounts via user management. Please use the profile section.');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed successfully' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user profile (Self delete)
// @route   DELETE /api/users/profile
// @access  Private
const deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Admins cannot delete their own accounts via profile. Please contact another administrator.');
    }

    await User.deleteOne({ _id: user._id });

    // Clear the JWT cookie
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    res.json({ message: 'Your account has been permanently deleted' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user (Admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Forgot Password - Send OTP
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    user.verificationCode = otp;
    user.verificationCodeExpiry = expiry;
    await user.save();

    try {
      await sendResetPasswordEmail(user.email, user.name, otp);
      res.status(200).json({ message: 'Reset code sent to your email' });
    } catch (error) {
      // In development, we log it so user can see it if SendGrid fails
      console.log('RESET OTP (Dev):', otp);
      res.status(200).json({ 
        message: 'Reset code generated (check server console if email fails)',
        devMode: true 
      });
    }
  } else {
    res.status(404);
    throw new Error('User with this email does not exist');
  }
});

// @desc    Reset Password
// @route   POST /api/users/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, code, newPassword } = req.body;

  const user = await User.findOne({ 
    email,
    verificationCode: code,
    verificationCodeExpiry: { $gt: Date.now() }
  });

  if (user) {
    user.password = newPassword;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful! You can now log in.' });
  } else {
    res.status(400);
    throw new Error('Invalid or expired reset code');
  }
});

export {
  authUser,
  registerUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  deleteUserProfile,
};
