const Board = require("../models/Board");
const Workspace = require("../models/Workspace");

const createBoard = async (req, res) => {
  try {
    const { name, description } = req.body;

    const workspace = await Workspace.findById(
      req.params.workspaceId
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

    const board = await Board.create({
      name,
      description,
      workspace: workspace._id
    });

    res.status(201).json({
      message: "Board created successfully",
      board
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getBoardsByWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(
      req.params.workspaceId
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

    const boards = await Board.find({
      workspace: workspace._id
    });

    res.status(200).json({
      boards
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

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

    res.status(200).json(board);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

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
        message: "Only the workspace owner can update boards"
      });
    }

    const { name, description } = req.body;

    if (name !== undefined) {
      board.name = name;
    }

    if (description !== undefined) {
      board.description = description;
    }

    await board.save();

    res.status(200).json({
      message: "Board updated successfully",
      board
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

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
        message: "Only the workspace owner can delete boards"
      });
    }

    await board.deleteOne();

    res.status(200).json({
      message: "Board deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createBoard,
  getBoardsByWorkspace,
  getBoardById,
  updateBoard,
  deleteBoard
};