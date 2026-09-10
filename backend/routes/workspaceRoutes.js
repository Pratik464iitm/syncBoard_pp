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

const router = express.Router();

// CRUD
router.post("/", protect, createWorkspace); // Create

router.get("/", protect, getWorkspaces); // Read all my workspaces

router.get("/:id", protect, getWorkspaceById); // Read one specific workspace

router.put("/:id", protect, updateWorkspace); // Update

router.delete("/:id", protect, deleteWorkspace); // Delete

router.post("/:id/members", protect, addMember);

router.delete("/:id/members/:userId", protect, removeMember);

module.exports = router;