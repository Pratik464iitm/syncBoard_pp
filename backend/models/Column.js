const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true
    },

    order: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Column = mongoose.model(
  "Column",
  columnSchema
);

module.exports = Column;