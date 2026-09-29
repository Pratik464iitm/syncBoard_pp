//;created in phase 13: CENTRALIZED ERROR HANDLING
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
    }
}

module.exports = AppError;
