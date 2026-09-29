//******** */
//we need to import all other models as well other than task
//as we need to use authorization that is the user must be part of the hierarchical order to do changes in the task component

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
    }).sort({ order: -1 }); //first sort in descending order so the task with the largest order comes first

    //findOne finds the first task after sorting, so we get the last task
    const order = lastTask
      ? lastTask.order + 1
      : 0; //if a last task exists, next order = lastTask order + 1; otherwise first task gets order 0

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
      .populate("assignedTo", "name email") //now more useful information like name and email is stored instead of only the assigned user ID
      .sort({
        order: 1 //means ascending order
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
    const task = await Task.findById(
      req.params.id
    )
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

    const {
      title,
      description
    } = req.body;

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
//what this does: Move this task to column456 and place it at position 2.
//difficult part

const moveTask = async (req, res) => {
  try {
    const {
      targetColumnId,
      newOrder
    } = req.body;

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

      //above case ka example:
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
    const {
      userId
    } = req.body;

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

    const user = await User.findById(
      userId
    );

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


//54

const getTasksByBoard = async (req, res) => {
  try {
    const {
      boardId
    } = req.params;

    const board = await Board.findById(
      boardId
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
      memberId =>
        memberId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });
    }

    const columns = await Column.find({
      board: boardId
    });

    const columnIds = columns.map(
      column => column._id
    );

    const tasks = await Task.find({
      column: {
        $in: columnIds
      }
    })
      .populate("assignedTo")
      .sort({
        column: 1,
        order: 1
      });

    return res.status(200).json({
      count: tasks.length,
      tasks
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


//55

const getTasksByAssignedUser = async (req, res) => {
  try {
    const {
      workspaceId,
      userId
    } = req.params;

    const workspace = await Workspace.findById(
      workspaceId
    );

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    const isMember = workspace.members.some(
      memberId =>
        memberId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });
    }

    const boards = await Board.find({
      workspace: workspaceId
    });

    const boardIds = boards.map(
      board => board._id
    );

    const columns = await Column.find({
      board: {
        $in: boardIds
      }
    });

    const columnIds = columns.map(
      column => column._id
    );

    const tasks = await Task.find({
      column: {
        $in: columnIds
      },
      assignedTo: userId
    })
      .populate("assignedTo")
      .sort({
        column: 1,
        order: 1
      });

    return res.status(200).json({
      count: tasks.length,
      tasks
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


//56

const searchTasks = async (req, res) => {
  try {
    const {
      workspaceId
    } = req.params;

    const {
      query
    } = req.query;

    // 1. Find workspace

    const workspace = await Workspace.findById(
      workspaceId
    );

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    // 2. Check workspace membership

    const isMember = workspace.members.some(
      memberId =>
        memberId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });
    }

    // 3. Check search query

    if (!query || query.trim() === "") {
      return res.status(400).json({
        message: "Search query is required"
      });
    }

    // 4. Find all boards of workspace

    const boards = await Board.find({
      workspace: workspaceId
    });

    const boardIds = boards.map(
      board => board._id
    );

    // 5. Find columns of those boards

    const columns = await Column.find({
      board: {
        $in: boardIds
      }
    });

    const columnIds = columns.map(
      column => column._id
    );

    // 6. Search tasks

    const tasks = await Task.find({
      column: {
        $in: columnIds
      },

      $or: [
        {
          title: {
            $regex: query,
            $options: "i"
          }
        },

        {
          description: {
            $regex: query,
            $options: "i"
          }
        }
      ]
    })
      .populate("assignedTo")
      .sort({
        order: 1
      });

    return res.status(200).json({
      count: tasks.length,
      query,
      tasks
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


// Task Priority

const updateTaskPriority = async (req, res) => {
  try {
    const {
      id
    } = req.params;

    const {
      priority
    } = req.body;

    // 1. Find task

    const task = await Task.findById(
      id
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    // 2. Validate priority

    const validPriorities = [
      "low",
      "medium",
      "high",
      "urgent"
    ];

    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        message: "Invalid priority"
      });
    }

    // 3. Find column

    const column = await Column.findById(
      task.column
    );

    if (!column) {
      return res.status(404).json({
        message: "Column not found"
      });
    }

    // 4. Find board

    const board = await Board.findById(
      column.board
    );

    if (!board) {
      return res.status(404).json({
        message: "Board not found"
      });
    }

    // 5. Find workspace

    const workspace = await Workspace.findById(
      board.workspace
    );

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    // 6. Check workspace membership

    const isMember = workspace.members.some(
      memberId =>
        memberId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });
    }

    // 7. Update priority

    task.priority = priority;

    await task.save();

    // 8. Return updated task

    return res.status(200).json({
      message: "Task priority updated successfully",
      task
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


//57b + Phase 14 Pagination

const getTasksByWorkspace = async (req, res) => {
  try {
    const {
      workspaceId
    } = req.params;

    const {
      priority
    } = req.query;

    const page = Math.max(parseInt(req.query.page) || 1, 1); //pagination: page cannot be less than 1

    const requestedLimit = Math.max(parseInt(req.query.limit) || 10, 1); //pagination: limit cannot be less than 1

    const limit = Math.min(requestedLimit, 50); //pagination: maximum 50 tasks per page

    const skip = (page - 1) * limit; //pagination: skip tasks belonging to previous pages

    // 1. Validate priority

    const validPriorities = [
      "low",
      "medium",
      "high",
      "urgent"
    ];

    if (
      priority &&
      !validPriorities.includes(priority)
    ) {
      return res.status(400).json({
        message: "Invalid priority"
      });
    }

    // 2. Find workspace

    const workspace = await Workspace.findById(
      workspaceId
    );

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    // 3. Check workspace membership

    const isMember = workspace.members.some(
      memberId =>
        memberId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });
    }

    // 4. Find boards

    const boards = await Board.find({
      workspace: workspaceId
    });

    // 5. Get board IDs

    const boardIds = boards.map(
      board => board._id
    );

    // 6. Find columns

    const columns = await Column.find({
      board: {
        $in: boardIds
      }
    });

    // 7. Get column IDs

    const columnIds = columns.map(
      column => column._id
    );

    // 8. Create base filter

    const filter = {
      column: {
        $in: columnIds
      }
    };

    // 9. Add priority filter if provided

    if (priority) {
      filter.priority = priority;
    }

    const total = await Task.countDocuments(filter); //pagination: count all matching tasks before applying skip and limit

    const tasks = await Task.find(filter)
      .populate("assignedTo")
      .sort({
        column: 1,
        order: 1
      })
      .skip(skip) //pagination: skip tasks from previous pages
      .limit(limit); //pagination: return only the current page's tasks

    const totalPages = Math.ceil(total / limit); //pagination: calculate the total number of pages

    return res.status(200).json({
      page, //pagination: current page number
      limit, //pagination: number of tasks requested per page
      total, //pagination: total tasks matching the filter
      totalPages, //pagination: total number of available pages
      priority: priority || "all",
      tasks
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


//58

const updateTaskDueDate = async (req, res) => {
  try {
    const {
      id
    } = req.params;

    const {
      dueDate
    } = req.body;

    // 1. Find task

    const task = await Task.findById(
      id
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    // 2. Find column

    const column = await Column.findById(
      task.column
    );

    if (!column) {
      return res.status(404).json({
        message: "Column not found"
      });
    }

    // 3. Find board

    const board = await Board.findById(
      column.board
    );

    if (!board) {
      return res.status(404).json({
        message: "Board not found"
      });
    }

    // 4. Find workspace

    const workspace = await Workspace.findById(
      board.workspace
    );

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    // 5. Check workspace membership

    const isMember = workspace.members.some(
      memberId =>
        memberId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace"
      });
    }

    // 6. Update due date

    task.dueDate = dueDate || null;

    await task.save();

    // 7. Return updated task

    return res.status(200).json({
      message: "Task due date updated successfully",
      task
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
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
  getUnassignedTasksByWorkspace,
  getTasksByBoard,
  getTasksByAssignedUser,
  searchTasks,
  updateTaskPriority,
  getTasksByWorkspace,
  updateTaskDueDate
};