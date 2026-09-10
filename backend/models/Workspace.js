const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: ""
    },

    owner: { //The owner stores the ID of the user who owns the workspace.
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true
  }
);

const Workspace = mongoose.model(
  "Workspace",
  workspaceSchema
);

module.exports = Workspace;