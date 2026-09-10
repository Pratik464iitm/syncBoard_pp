const express = require("express");

const {
  createTask,
  getTasksByColumn,
  getTaskById,
  updateTask,
  deleteTask,
  moveTask,
  assignTask,
  unassignTask,
  getTasksAssignedToMe,
  getUnassignedTasksByWorkspace
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/columns/:columnId/tasks",
  protect,
  createTask
);

router.get(
  "/columns/:columnId/tasks",
  protect,
  getTasksByColumn
);

router.get(
  "/tasks/assigned-to-me",
  protect,
  getTasksAssignedToMe
);

router.get(
  "/workspaces/:workspaceId/tasks/unassigned",
  protect,
  getUnassignedTasksByWorkspace
);

router.get(
  "/tasks/:id",
  protect,
  getTaskById
);

router.put(
  "/tasks/:id",
  protect,
  updateTask
);

router.delete(
  "/tasks/:id",
  protect,
  deleteTask
);

router.patch(
  "/tasks/:id/move",
  protect,
  moveTask
);

router.put(
  "/tasks/:id/assign",
  protect,
  assignTask
);

// or use PATCH as we are updating the currently existing task:

/*
router.patch(
  "/tasks/:id/assign",
  protect,
  assignTask
);
*/

router.patch(
  "/tasks/:id/unassign",
  protect,
  unassignTask
);

module.exports = router;