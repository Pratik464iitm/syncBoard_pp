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
  getUnassignedTasksByWorkspace,
  getTasksByBoard,
  getTasksByAssignedUser,
  searchTasks,
  updateTaskPriority,
  getTasksByWorkspace,
  updateTaskDueDate
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

// /phase 9
router.get(
    "/boards/:boardId/tasks",
    protect,
    getTasksByBoard
);

router.get(
    "/workspaces/:workspaceId/tasks/assigned/:userId",
    protect,
    getTasksByAssignedUser
);

router.get(
    "/workspaces/:workspaceId/tasks/search",
    protect,
    searchTasks
);

//phase 10
router.patch(
    "/tasks/:id/priority",
    protect,
    updateTaskPriority
);

router.get(
    "/workspaces/:workspaceId/tasks",
    protect,
    getTasksByWorkspace
);

router.patch(
    "/tasks/:id/due-date",
    protect,
    updateTaskDueDate
);

module.exports = router;