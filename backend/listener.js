const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();
mongoose.connect(process.env.MONGO_URI, { dbName: "emailTasksDB" }).then(() => {
  console.log("mongodb connected.");
});

const app = express();
app.use(cors());
app.use(express.json());

const emailRoutes = require("./routes/emailRoutes");
app.use("/api/emails", emailRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
