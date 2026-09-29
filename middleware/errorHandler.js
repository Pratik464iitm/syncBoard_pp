const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        message: err.message || "Server error"
    });
};

module.exports = errorHandler;