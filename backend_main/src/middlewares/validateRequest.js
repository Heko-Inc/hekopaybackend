const AppError = require("../utils/AppError");


const validateRequest = (schema, source = 'body') => (req, res, next) => {
  // Determine which part of the request to validate
  const validationSource = {
    body: req.body,
    params: req.params,
    query: req.query,
    headers: req.headers
  }[source] || req.body;

  // Validate with Joi
  const { error, value } = schema.validate(validationSource, {
    abortEarly: false,
    allowUnknown: false,
    convert: true,
    stripUnknown: source === 'body' // Only strip for body to avoid modifying queries/params
  });

  // If validation fails
  if (error) {
    const errorMessages = error.details.map(detail => {
      // Customize message format
      return {
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, "'") // Replace quotes for cleaner output
      };
    });

    throw new AppError(
      'Validation failed',
      400,
      'VALIDATION_ERROR',
      errorMessages
    );
  }

  // Replace the validated source with sanitized values
  switch (source) {
    case 'body':
      req.body = value;
      break;
    case 'params':
      req.params = value;
      break;
    case 'query':
      req.query = value;
      break;
    case 'headers':
      req.headers = {
        ...req.headers,
        ...value
      };
      break;
  }

  next();
};

module.exports = validateRequest;