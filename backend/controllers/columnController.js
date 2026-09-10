const Column = require("../models/Column");
const Board = require("../models/Board");
const Workspace = require("../models/Workspace");

const createColumn = async (req, res) => {
  try {
    const { name } = req.body;

    const board = await Board.findById(
      req.params.boardId
    );

    if (!board) {
      return res.status(404).json({
        message: "Board not found"
      });
    }

    const workspace = await Workspace.findById(
      board.workspace
    );

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    const isMember = workspace.members.some(
      (member) =>
        member.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });
    }

    const column = await Column.create({
      name,
      board: board._id
    });

    res.status(201).json({
      message: "Column created successfully",
      column
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getColumnsByBoard = async (req, res) => {
  try {
    const board = await Board.findById(
      req.params.boardId
    );

    if (!board) {
      return res.status(404).json({
        message: "Board not found"
      });
    }

    const workspace = await Workspace.findById(
      board.workspace
    );

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    const isMember = workspace.members.some(
      (member) =>
        member.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });
    }

    const columns = await Column.find({
      board: board._id
    });

    res.status(200).json({
      columns
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getColumnById = async (req, res) => {
  try {
    const column = await Column.findById(req.params.id);

    if (!column) {
      return res.status(404).json({
        message: "Column not found"
      });
    }

    const board = await Board.findById(column.board);

    if (!board) {
      return res.status(404).json({
        message: "Board not found"
      });
    }

    const workspace = await Workspace.findById(
      board.workspace
    );

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    const isMember = workspace.members.some(
      (member) =>
        member.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });
    }

    res.status(200).json({
      column
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateColumn = async (req, res) => {
  try {
    const column = await Column.findById(req.params.id);

    if (!column) {
      return res.status(404).json({
        message: "Column not found"
      });
    }

    const board = await Board.findById(column.board);

    if (!board) {
      return res.status(404).json({
        message: "Board not found"
      });
    }

    const workspace = await Workspace.findById(
      board.workspace
    );

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    if (
      workspace.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only the workspace owner can update columns"
      });
    }

    const { name } = req.body;

    if (name !== undefined) {
      column.name = name;
    }

    await column.save();

    res.status(200).json({
      message: "Column updated successfully",
      column
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const deleteColumn = async (req, res) => {
  try {
    const column = await Column.findById(req.params.id);

    if (!column) {
      return res.status(404).json({
        message: "Column not found"
      });
    }

    const board = await Board.findById(column.board);

    if (!board) {
      return res.status(404).json({
        message: "Board not found"
      });
    }

    const workspace = await Workspace.findById(
      board.workspace
    );

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    if (
      workspace.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only the workspace owner can delete columns"
      });
    }

    await column.deleteOne();

    res.status(200).json({
      message: "Column deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createColumn,
  getColumnsByBoard,
  getColumnById,
  updateColumn,
  deleteColumn
};