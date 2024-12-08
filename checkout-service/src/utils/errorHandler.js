const notFoundHandler = (req, res, next) => {
    res.status(404).json({
      status: "error",
      message: "Resource not found",
    });
  };
  
  // General Error Handler
  const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging
    const statusCode = err.status || 500; // Default to 500 Internal Server Error
    res.status(statusCode).json({
      status: "error",
      message: err.message || "An unexpected error occurred",
    });
  };
  
  module.exports = { notFoundHandler, errorHandler };