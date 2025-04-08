const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  sender: String,
  mailId: String,
  task: String,
  type: {
    type: String,
    enum: ["todo", "promotional", "personal", "admin", "informational"],
  },
  time_received: Date,
  message_id: String,
});

module.exports = mongoose.model("Task", TaskSchema);
