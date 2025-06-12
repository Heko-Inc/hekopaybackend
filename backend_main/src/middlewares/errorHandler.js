const logger = require("../utils/logger");




function errorHandler(err, req, res, next) {


  const statusCode = err.statusCode || 500;




  // Log the full error details
  logger.error('Error occurred', {

    message: err.message,
    stack: err.stack,
    statusCode,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    user: req.user ? req.user.id : 'Unauthenticated'
    
  });

  // Determine what to send back
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && {
      stack: err.stack
    }),
  };

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
