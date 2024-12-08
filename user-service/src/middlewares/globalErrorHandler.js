const globalErrorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log error details
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
};

module.exports = globalErrorHandler;
