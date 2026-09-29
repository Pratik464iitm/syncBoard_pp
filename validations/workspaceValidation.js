const { body } = require("express-validator");

const createWorkspaceValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Workspace name is required")
        .isLength({ min: 3, max: 50 })
        .withMessage("Workspace name must be between 3 and 50 characters")
];

module.exports = {
    createWorkspaceValidation
};