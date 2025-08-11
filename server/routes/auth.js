import { Router } from "express";
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

// JWT secret - in production, use a strong random secret from env
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '30m'; // 30 minutes

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }
    
    // Find user in database
    const user = await User.findOne({ 
      username: username.toLowerCase(),
      isActive: true 
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Compare password
    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Update last login
    await user.updateLastLogin();
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        username: user.username,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Verify token route
router.get('/verify', authenticateToken, (req, res) => {
  // If middleware passes, token is valid
  res.json({
    success: true,
    user: req.user
  });
});

// Logout route (optional - mainly for token blacklisting in production)
router.post('/logout', authenticateToken, (req, res) => {
  // In production, you might add token to blacklist here
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});


// Middleware to authenticate JWT token
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    req.user = user;
    next();
  });
}

export default router;