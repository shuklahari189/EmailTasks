const { google } = require("googleapis");
const dotenv = require("dotenv");
const Task = require("../models/Task");

dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

const fetchNewEmails = async () => {
  const res = await gmail.users.messages.list({
    userId: "me",
    labelIds: ["INBOX"],
    maxResults: 10,
  });

  const messages = res.data.messages || [];
  const notPresentMessages = [];
  for (let i = 0; i < messages.length; i++) {
    const message = await Task.findOne({ message_id: messages[i].id });
    if (!message) {
      notPresentMessages.push(messages[i]);
    }
  }

  const emailData = await Promise.all(
    notPresentMessages.map(async (msg) => {
      const { data } = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
        format: "full",
      });

      const headers = data.payload.headers;
      const getHeader = (name) =>
        headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value;

      const body =
        data.payload.parts?.find(
          (p) => p.mimeType === "text/plain" || p.mimeType === "text/html"
        )?.body?.data || "";

      const getSenderInfo = (fromHeader) => {
        const match = fromHeader.match(/^(.*)<(.*)>$/);
        if (match) {
          return {
            sender_name: match[1].trim(),
            mailId: match[2].trim(),
          };
        }
        return { sender_name: fromHeader, mailId: fromHeader };
      };

      const { sender_name, mailId } = getSenderInfo(getHeader("From"));

      return {
        sender_name,
        mailId,
        subject: getHeader("Subject"),
        full_body_text: Buffer.from(body, "base64").toString("utf-8"),
        time_received: new Date(getHeader("Date")),
        thread_id: data.threadId,
        message_id: data.id,
        labels: data.labelIds,
      };
    })
  );

  return emailData;
};

module.exports = { fetchNewEmails };
