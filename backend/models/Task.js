const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: ""
    },

    column: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Column",
      required: true
    },

    order: {
      type: Number,
      required: true
    },
//updated part
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Task", taskSchema);