const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: ""
    },

    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Board = mongoose.model(
  "Board",
  boardSchema
);

module.exports = Board;