const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  let message = err.message || "Internal server error";

  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource or ID not found";
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "A record with this unique value already exists";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Invalid JSON request body";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { notFound, errorHandler };