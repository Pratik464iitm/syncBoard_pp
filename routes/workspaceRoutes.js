const express = require("express");

const {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  removeMember
} = require("../controllers/workspaceController");

const protect = require("../middleware/authMiddleware");

// Validation
const {
    createWorkspaceValidation
} = require("../validations/workspaceValidation");

const validate = require("../middleware/validate");

const router = express.Router();

// CRUD
// router.post("/", protect, createWorkspace); // Create
//after validation part update the above one with

// CRUD

router.post(
    "/",
    createWorkspaceValidation,
    validate,
    protect,
    createWorkspace
); // Create


router.get("/", protect, getWorkspaces); // Read all my workspaces

router.get("/:id", protect, getWorkspaceById); // Read one specific workspace

router.put("/:id", protect, updateWorkspace); // Update

router.delete("/:id", protect, deleteWorkspace); // Delete

router.post("/:id/members", protect, addMember);

router.delete("/:id/members/:userId", protect, removeMember);

module.exports = router;