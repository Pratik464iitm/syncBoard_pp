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

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        priority: {
          type: String,
          enum: ["low", "medium", "high", "urgent"],
          default: "medium"
      },

        dueDate: {
          type: Date,
          default: null
      }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Task", taskSchema);