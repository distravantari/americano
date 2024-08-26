// File: sendWabaMessage.js
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env

const QISCUS_BASE_URL = process.env.QISCUS_BASE_URL;
const QISCUS_APP_ID = process.env.QISCUS_APP_ID;
const QISCUS_SECRET_KEY = process.env.QISCUS_SECRET_KEY;
const QISCUS_CHANNEL_ID = process.env.QISCUS_CHANNEL_ID;

console.log(QISCUS_BASE_URL, QISCUS_APP_ID, QISCUS_SECRET_KEY, QISCUS_CHANNEL_ID);

// Helper function to send a message to Qiscus WhatsApp API
async function sendToWaba(payload, routes) {
    const endpoint = routes === "settings" 
    ? `/whatsapp/${QISCUS_APP_ID}/${QISCUS_CHANNEL_ID}/${routes}`
    : `/whatsapp/v1/${QISCUS_APP_ID}/${QISCUS_CHANNEL_ID}/${routes}`;
    
    const url = `${QISCUS_BASE_URL}${endpoint}`;
    const headers = {
        'Qiscus-App-Id': QISCUS_APP_ID,
        'Qiscus-Secret-Key': QISCUS_SECRET_KEY,
        'Content-Type': 'application/json'
    };


    console.log(QISCUS_BASE_URL, QISCUS_APP_ID, QISCUS_SECRET_KEY, QISCUS_CHANNEL_ID);
    console.log("29", url);
    console.log("30", payload);

    try {
        const response = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
        throw new Error(`Error: ${data.message || 'Unknown error'}`);
        }

        return data;
    } catch (error) {
        console.error('Failed to send request:', error.message);
        throw error;
    }
}

// Function to set up the webhook for WhatsApp Business API
async function setWebhook(webhookUrl) {
    const payload = {
      webhooks: {
        url: webhookUrl
      }
    };
  
    return sendToWaba(payload, "settings");
}

// 0. Send Text Message (based on the provided cURL example)
async function sendTextMessage(recipientPhoneNumber, messageBody) {
    console.log(messageBody);
    const payload = {
      recipient_type: "individual",
      to: `${recipientPhoneNumber}`,
      type: "text",
      text: {
        body: messageBody
      }
    };
  
    return sendToWaba(payload, "messages");
}

// 1. Send List Message
async function sendListMessage(recipientPhoneNumber, headerText, bodyText, footerText, buttonText, sections) {
  const payload = {
    recipient_type: "individual",
    to: recipientPhoneNumber,
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: headerText
      },
      body: {
        text: bodyText
      },
      footer: {
        text: footerText
      },
      action: {
        button: buttonText,
        sections: sections // Example: [{ title: "Section 1", rows: [{ id: "unique-id-1", title: "Option 1" }] }]
      }
    }
  };

  return sendToWaba(payload, "messages");
}

// 2. Send Reply Button Message
async function sendReplyButtonMessage(recipientPhoneNumber, headerText, bodyText, footerText, buttons) {
  const payload = {
    recipient_type: "individual",
    to: recipientPhoneNumber,
    type: "interactive",
    interactive: {
      type: "button",
      header: {
        type: "text",
        text: headerText
      },
      body: {
        text: bodyText
      },
      footer: {
        text: footerText
      },
      action: {
        buttons: buttons.map((button, index) => ({
          type: "reply",
          reply: {
            id: button.id,
            title: button.title
          }
        }))
      }
    }
  };

  return sendToWaba(payload, "messages");
}

// Export functions
module.exports = {
    setWebhook,
    sendListMessage,
    sendReplyButtonMessage,
    sendTextMessage
};