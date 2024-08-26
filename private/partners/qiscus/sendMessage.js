// File: sendMessage.js
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env

const QISCUS_APP_ID = process.env.QISCUS_APP_ID;
const QISCUS_BASE_URL = process.env.QISCUS_BASE_URL;
const QISCUS_SDK_SECRET = process.env.QISCUS_SDK_SECRET;

// Helper function to send a message to Qiscus API
async function sendToQiscus(payload) {
  const url = `${QISCUS_BASE_URL}/${QISCUS_APP_ID}/bot`;
  const headers = {
    'QISCUS_SDK_SECRET': `${QISCUS_SDK_SECRET}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    const data = await response;

    if (!response.ok) {
      throw new Error(`Error: ${data.message || 'Unknown error'}`);
    }

    console.log('Request successfully handled:');
    return data;
  } catch (error) {
    console.error('Failed to send request:', error);
    throw error;
  }
}

// 1. Send Message Text
async function sendMessageText(roomId, message) {
  const payload = {
    sender_email: `${QISCUS_APP_ID}_admin@qismo.com`,
    room_id: roomId,
    message_type: 'text',
    message: message
  };
  return sendToQiscus(payload, '');
}

// 2. Send Message Attachment
async function sendMessageAttachment(roomId, url, caption = '') {
  const payload = {
    sender_email: `${QISCUS_APP_ID}_admin@qismo.com`,
    room_id: roomId,
    message_type: 'file_attachment',
    message: {
      url: url,
      caption: caption
    }
  };
  return sendToQiscus(payload, '');
}

// 3. Send Message Button
async function sendMessageButton(roomId, text, buttons) {
  const payload = {
    sender_email: `${QISCUS_APP_ID}_admin@qismo.com`,
    room_id: roomId,
    message_type: 'button_template',
    message: {
      text: text,
      buttons: buttons // Example buttons: [{ "label": "Button 1", "type": "postback", "payload": "button1_payload" }]
    }
  };
  return sendToQiscus(payload, '');
}

// 4. Send Message Carousel
async function sendMessageCarousel(roomId, cardContents) {
  const payload = {
    sender_email: `${QISCUS_APP_ID}_admin@qismo.com`,
    room_id: roomId,
    message_type: 'carousel',
    message: cardContents // Example cardContents: Array of cards [{ "title": "Card 1", "description": "Description", "buttons": [...] }]
  };
  return sendToQiscus(payload, '');
}

// 5. Handover Bot to Agent in Certain Chat Rooms
async function handoverToAgent(roomId) {
  const payload = {
    sender_email: `${QISCUS_APP_ID}_admin@qismo.com`,
    room_id: roomId,
    action: 'handover_to_agent'
  };
  return sendToQiscus(payload, `${roomId}/handover`);
}

// 6. Handover to a Specific Agent Role
async function handoverToSpecificAgent(roomId, agentEmail, agentRole) {
  const payload = {
    sender_email: `${QISCUS_APP_ID}_admin@qismo.com`,
    room_id: roomId,
    action: 'handover_to_agent',
    agent_email: agentEmail, // specific agent email
    agent_role: agentRole    // specific agent role (e.g., 'admin', 'support')
  };
  return sendToQiscus(payload, `${roomId}/handover`);
}

// Export functions
module.exports = {
  sendMessageText,
  sendMessageAttachment,
  sendMessageButton,
  sendMessageCarousel,
  handoverToAgent,
  handoverToSpecificAgent
};