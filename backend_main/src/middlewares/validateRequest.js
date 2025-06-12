const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    convert: true,
    abortEarly: false, // optional: return all errors, not just the first
  });
  if (error) {
    const e = new Error();
    e.name = "Validation Error";
    e.message = error.details.map((detail) => detail.message).join("\n");
    throw e;
  }
  next();
};

module.exports = validateRequest;
