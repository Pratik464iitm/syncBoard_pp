const express = require("express");

const {
  createColumn,
  getColumnsByBoard,
  getColumnById,
  updateColumn,
  deleteColumn
} = require("../controllers/columnController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/boards/:boardId/columns",
  protect,
  createColumn
);

router.get(
  "/boards/:boardId/columns",
  protect,
  getColumnsByBoard
);

router.get("/:id", protect, getColumnById);

router.put("/:id", protect, updateColumn);

router.delete(
  "/columns/:id",
  protect,
  deleteColumn
);

module.exports = router;