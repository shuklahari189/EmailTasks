const express = require("express");
const router = express.Router();
const { fetchNewEmails } = require("../services/fetchMails");
const { extractTasksFromEmail } = require("../services/extractTasksFromMail");
const Task = require("../models/Task");

router.get("/extract", async (req, res) => {
  try {
    const emails = await fetchNewEmails();
    for (const email of emails) {
      const taskData = await extractTasksFromEmail(email);
      if (taskData) {
        await Task.create(taskData);
      }
    }
    let results = await Task.find().sort({ time_received: -1 });
    res.json({ success: true, data: results }).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Extraction failed" });
  }
});

module.exports = router;
