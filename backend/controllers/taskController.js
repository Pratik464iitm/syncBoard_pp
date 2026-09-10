const Task = require("../models/Task");
const Column = require("../models/Column");
const Board = require("../models/Board");
const Workspace = require("../models/Workspace");
const User = require("../models/User");

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo
    } = req.body;

    const column = await Column.findById(
      req.params.columnId
    );

    if (!column) {
      return res.status(404).json({
        message: "Column not found"
      });
    }

    const board = await Board.findById(
      column.board
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

    const lastTask = await Task.findOne({
      column: column._id
    }).sort({ order: -1 });

    const order = lastTask
      ? lastTask.order + 1
      : 0;

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      column: column._id,
      order
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getTasksByColumn = async (req, res) => {
  try {
    const column = await Column.findById(
      req.params.columnId
    );

    if (!column) {
      return res.status(404).json({
        message: "Column not found"
      });
    }

    const board = await Board.findById(
      column.board
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

    const tasks = await Task.find({
      column: column._id
    })
      .populate("assignedTo", "name email")
      .sort({
        order: 1
      });

    res.status(200).json(tasks);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email");

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    const column = await Column.findById(
      task.column
    );

    if (!column) {
      return res.status(404).json({
        message: "Column not found"
      });
    }

    const board = await Board.findById(
      column.board
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

    res.status(200).json(task);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(
      req.params.id
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    const column = await Column.findById(
      task.column
    );

    if (!column) {
      return res.status(404).json({
        message: "Column not found"
      });
    }

    const board = await Board.findById(
      column.board
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

    if (
      workspace.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only the workspace owner can update tasks"
      });
    }

    const { title, description } = req.body;

    if (title !== undefined) {
      task.title = title;
    }

    if (description !== undefined) {
      task.description = description;
    }

    await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(
      req.params.id
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    const column = await Column.findById(
      task.column
    );

    if (!column) {
      return res.status(404).json({
        message: "Column not found"
      });
    }

    const board = await Board.findById(
      column.board
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

    if (
      workspace.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only the workspace owner can delete tasks"
      });
    }

    await task.deleteOne();

    res.json({
      message: "Task deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// updated this in 🟢 45,46. Proper Task Reordering Logic

const moveTask = async (req, res) => {
  try {
    const { targetColumnId, newOrder } = req.body;

    const task = await Task.findById(
      req.params.id
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    const sourceColumnId = task.column.toString();
    const oldOrder = task.order;

    const sourceColumn = await Column.findById(
      sourceColumnId
    );

    if (!sourceColumn) {
      return res.status(404).json({
        message: "Source column not found"
      });
    }

    const board = await Board.findById(
      sourceColumn.board
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

    if (
      workspace.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only the workspace owner can move tasks"
      });
    }

    const targetColumn = await Column.findById(
      targetColumnId
    );

    if (!targetColumn) {
      return res.status(404).json({
        message: "Target column not found"
      });
    }

    if (
      targetColumn.board.toString() !==
      sourceColumn.board.toString()
    ) {
      return res.status(400).json({
        message: "Target column must belong to the same board"
      });
    }

    if (sourceColumnId === targetColumnId) {
      if (newOrder > oldOrder) {
        await Task.updateMany(
          {
            column: sourceColumnId,
            order: {
              $gt: oldOrder,
              $lte: newOrder
            }
          },
          {
            $inc: {
              order: -1
            }
          }
        );
      }

      if (newOrder < oldOrder) {
        await Task.updateMany(
          {
            column: sourceColumnId,
            order: {
              $gte: newOrder,
              $lt: oldOrder
            }
          },
          {
            $inc: {
              order: 1
            }
          }
        );
      }

    } else {
      await Task.updateMany(
        {
          column: sourceColumnId,
          order: {
            $gt: oldOrder
          }
        },
        {
          $inc: {
            order: -1
          }
        }
      );

      await Task.updateMany(
        {
          column: targetColumnId,
          order: {
            $gte: newOrder
          }
        },
        {
          $inc: {
            order: 1
          }
        }
      );
    }

    task.column = targetColumnId;
    task.order = newOrder;

    await task.save();

    res.status(200).json({
      message: "Task moved successfully",
      task
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Assign Task

const assignTask = async (req, res) => {
  try {
    const { userId } = req.body;

    const task = await Task.findById(
      req.params.id
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    const column = await Column.findById(
      task.column
    );

    if (!column) {
      return res.status(404).json({
        message: "Column not found"
      });
    }

    const board = await Board.findById(
      column.board
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

    if (
      workspace.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only the workspace owner can assign users"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isMember = workspace.members.some(
      (member) =>
        member.toString() === user._id.toString()
    );

    if (!isMember) {
      return res.status(400).json({
        message: "User is not a member of this workspace"
      });
    }

    task.assignedTo = user._id;

    await task.save();

    res.status(200).json({
      message: "User assigned to task successfully",
      task
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Unassign Task

const unassignTask = async (req, res) => {
  try {
    const task = await Task.findById(
      req.params.id
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    const column = await Column.findById(
      task.column
    );

    if (!column) {
      return res.status(404).json({
        message: "Column not found"
      });
    }

    const board = await Board.findById(
      column.board
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

    if (
      workspace.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only the workspace owner can unassign users"
      });
    }

    task.assignedTo = null;

    await task.save();

    res.status(200).json({
      message: "User unassigned from task successfully",
      task
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get Tasks Assigned To Me

const getTasksAssignedToMe = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user._id
    })
      .populate("assignedTo", "name email");

    res.status(200).json({
      tasks
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// Get Unassigned Tasks By Workspace

const getUnassignedTasksByWorkspace = async (req, res) => {
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

    const boardIds = boards.map(
      (board) => board._id
    );

    const columns = await Column.find({
      board: {
        $in: boardIds
      }
    });

    const columnIds = columns.map(
      (column) => column._id
    );

    const tasks = await Task.find({
      column: {
        $in: columnIds
      },
      assignedTo: null
    })
      .populate("assignedTo", "name email")
      .sort({
        order: 1
      });

    res.status(200).json({
      tasks
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
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
};