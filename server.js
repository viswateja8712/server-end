const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000; // Port for your Glitch project

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Define your Slack workspace information
const slackToken = 'YOUR_SLACK_TOKEN';
const slackChannelMappings = {
  'designers': 'C06271M760Z',
  'content-writers': 'C061DRNVAQ7',
  'social-media': 'C0605R6Q2BV',
};

// Endpoint to receive task details from the client
app.post('/submit-task', (req, res) => {
  try {
    const { taskName, taskDescription, taskPriority, taskAssigner, taskTags, dueDate } = req.body;

    // Perform keyword analysis and map to Slack channel ID
    const keywords = ['designer', 'Anand', 'Rithika', /* Add more keywords */];
    let assignedChannel = 'default'; // Default channel if no match

    for (const keyword of keywords) {
      if (taskDescription.toLowerCase().includes(keyword.toLowerCase())) {
        assignedChannel = 'designers';
        break;
      }
    }

    // Use taskPriority, taskAssigner, taskTags, and dueDate for further processing

    // Send the task to the associated Slack channel
    const channelID = slackChannelMappings[assignedChannel];
    const message = `New Task: ${taskName}\nDescription: ${taskDescription}\nPriority: ${taskPriority}`;
    
    sendMessageToSlack(channelID, message);

    res.status(200).send('Task assigned successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Function to send a message to a Slack channel
function sendMessageToSlack(channelID, message) {
  fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${slackToken}`,
    },
    body: JSON.stringify({
      channel: channelID,
      text: message,
    }),
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
