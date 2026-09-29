const express = require("express");

const {
  createBoard,
  getBoardsByWorkspace,
  getBoardById,
  updateBoard,
  deleteBoard
} = require("../controllers/boardController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/workspaces/:workspaceId/boards",
  protect,
  createBoard
);

router.get(
  "/workspaces/:workspaceId/boards",
  protect,
  getBoardsByWorkspace
);

router.get(
  "/boards/:id",
  protect,
  getBoardById
);

router.put(
  "/boards/:id",
  protect,
  updateBoard
);

router.delete(
  "/boards/:id",
  protect,
  deleteBoard
);

module.exports = router;