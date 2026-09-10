//******** */
//we need to import all other models as well other tahtn task 
//as we need to use authorizstion that is the user must be part of the heirachical order to do changes in the task component
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
    }).sort({ order: -1 }); //first sort in the descending order so the last comes at the top due to largest order value(we hae used this order value in model for each task)
                            // and findOne : finds the first one so it finds the last term which is now first due ro sorting 

    const order = lastTask
      ? lastTask.order + 1
      : 0;  //so now it the lastTask (variable name above used) so then the next task ka order =iska order +1 as next task
      //else that is not exist that is this is the first task so order :0

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
      .populate("assignedTo", "name email") //now more useful information like name email  stored in assignedTo wali field not jsut a id like before using .populate it was
      .sort({
        order: 1//means ascending order
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
//wht this does : ex: Move this task to column456 and place it at position 2.
//diffucult part
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
      //above case ka example:
      /*
      Example:
              Before:
              0 → A
              1 → B
              2 → C
              3 → D
              Move:
              A → position 2
              Shift:
              B: 1 → 0
              C: 2 → 1
              Then:
              A: 0 → 2
              Final:
              0 → B
              1 → C
              2 → A
              3 → D
 */

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
      //above case ka exmpale
      /*
      Before:
            0 → A
            1 → B
            2 → C
            3 → D
            Move:
            D → 1
            Shift:
            B: 1 → 2
            C: 2 → 3
            Then:
            D: 3 → 1
            Final:
            0 → A
            1 → D
            2 → B
            3 → C
 */

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
//see this part again so
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