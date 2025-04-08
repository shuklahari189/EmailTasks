const dotenv = require("dotenv");
const { OpenAI } = require("openai");
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const extractTasksFromEmail = async (email) => {
  const prompt = `
    You are an AI assistant that processes emails and extracts actionable tasks.
  
    Email:
    Sender: ${email.sender_name}
    Subject: ${email.subject}
    Body: ${email.full_body_text}
  
    Extract:
    - sender: the name of the person who sent the email
    - task: a one-line description of what the recipient needs to do (if anything)
    - type: classify as 'todo', 'promotional', 'personal', 'admin', or 'informational'
  
    Output: A JSON object with sender, task, type
    `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  let response = completion.choices[0].message.content;

  try {
    let finalResponse = JSON.parse(response);
    finalResponse.threadId = email.thread_id;
    finalResponse.mailId = email.mailId;
    finalResponse.message_id = email.message_id;
    finalResponse.time_received = email.time_received;
    return finalResponse;
  } catch (err) {
    console.log("failed to parse response");
    return null;
  }
};

module.exports = { extractTasksFromEmail };
