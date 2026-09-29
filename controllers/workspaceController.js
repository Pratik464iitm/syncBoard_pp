//here i did : workspace CRUD operations
const Workspace = require("../models/Workspace");

//putted this on : 🟢 25. Add a Member to a Workspace
const User = require("../models/User");

const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;

    const workspace = await Workspace.create({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id]
    });

    res.status(201).json({
      message: "Workspace created successfully",
      workspace
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      members: req.user._id
    });

    res.status(200).json({
      workspaces
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

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
        message: "You are not authorized to access this workspace"
      });
    }

    res.status(200).json({
      workspace
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const updateWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this workspace"
      });
    }

    const { name, description } = req.body;

    if (name !== undefined) {//this allows us to partial updates
      //like the frontend will obv send both things like {name:...., description:...} but lets say the owner only changed the 
      //descriptuon so the name will come empty that is "undefined" so in the case do nothing to name 
      workspace.name = name;
    }

    if (description !== undefined) {
      workspace.description = description;
    }

    await workspace.save();

    res.status(200).json({
      message: "Workspace updated successfully",
      workspace
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the workspace owner can delete it"
      });
    }

    await workspace.deleteOne(); //Delete this specific Mongoose document as workspace variable stores that see in the start of this dleetion part

    res.status(200).json({
      message: "Workspace deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const addMember = async (req, res) => {
  try {
    const { email } = req.body;

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the workspace owner can add members"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isAlreadyMember = workspace.members.some(//some checks atleast one value satisfies the condition if satisfies then return true else false
      (member) => member.toString() === user._id.toString()
    );

    if (isAlreadyMember) {
      return res.status(400).json({
        message: "User is already a member"
      });
    }

    workspace.members.push(user._id);

    await workspace.save();

    res.status(200).json({
      message: "Member added successfully",
      workspace
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const removeMember = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      });
    }

    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the workspace owner can remove members"
      });
    }

    const userToRemove = await User.findById(req.params.userId);

    if (!userToRemove) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (req.params.userId === workspace.owner.toString()) {
      return res.status(400).json({
        message: "Workspace owner cannot be removed"
      });
    }

    const isMember = workspace.members.some(
      (member) => member.toString() === req.params.userId
    );

    if (!isMember) {
      return res.status(400).json({
        message: "User is not a member of this workspace"
      });
    }

    workspace.members = workspace.members.filter( //filter creats the new array 
      (member) => member.toString() !== req.params.userId //Create a new array excluding this member.
    );

    await workspace.save();

    res.status(200).json({
      message: "Member removed successfully",
      workspace
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  removeMember
};