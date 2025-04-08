const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Task = require("./models/Task");
const { fetchNewEmails } = require("./services/fetchMails");
const { extractTasksFromEmail } = require("./services/extractTasksFromMail");

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { dbName: "emailTasksDB" }).then(() => {
  console.log("mongodb connected.");
});

async function main() {
  console.log("Syncing mails");
  const mails = await fetchNewEmails();
  for (let i = 0; i < mails.length; i++) {
    let extractedMail = await extractTasksFromEmail(mails[i]);
    if (extractedMail) {
      await Task.create(extractedMail);
    }
  }
}

main();
setInterval(main, 30 * 60 * 1000);
