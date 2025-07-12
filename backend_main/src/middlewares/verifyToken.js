const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const { User } = require('../config/modelsConfig');

exports.verifyToken = (roles = []) => async (req, res, next) => {
  try {
    // 1. Get token from header
    let token;
    if (
      req.headers.authorization &&
      req.headers?.authorization?.startsWith('Bearer')
    ) {
      token = req.headers?.authorization?.split(' ')[1];
    }
    if (!token) {
      throw new AppError('Authentication token missing', 401);
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser) {
      throw new AppError('User no longer exists', 401);
    }

    // 4. Check if user changed password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw new AppError('Password changed recently. Please log in again.', 401);
    }

    // 5. Role-based authorization
    if (roles.length > 0 && !roles.includes(currentUser.role)) {
      throw new AppError('Unauthorized access', 403);
    }

    // 6. Grant access and attach user to request
    req.user = currentUser;
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired', 401));
    }
    next(error);
  }
};
exports.tokenValidator = () => async (req, res, next) => {
  try {
    let token;
    
    // Check Authorization header first
    if (req.headers?.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // If not in header, check cookies
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.sendError({ 
        message: "Access denied. No token provided.", 
        name: "TokenNotFoundError" 
      }, 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded token to request object

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    err.statusCode = 401;
    err.data = { tokenProvided: !!token }; // Will be true if token was provided but invalid
    return res.sendError(err, 401);
  }
}