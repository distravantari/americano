// File: webhookHandler.js
const express = require('express');
const { sendMessageText, handoverToAgent } = require('../partners/qiscus/sendMessage.js'); // Import necessary functions
const { sendTextMessage } = require('../partners/qiscus/sendWabaMessage.js'); // Import necessary functions
const request = require('request');

const router = express.Router();

// Route to handle webhook requests from Qiscus Omnichannel
router.post('/webhook/qiscus', async (req, res) => {
  try {
    // Log incoming payload for debugging
    const sender = req.body.payload?.from?.email;
    const room_id = req.body.payload?.room?.id;
    const message = req.body.payload?.message?.text;
    const type = req.body.payload?.message?.type;

    console.log(`Sender: ${sender}, Room ID: ${room_id}, Message: ${message}, Type: ${type}`);

    // Handle different message types
    switch (type) {
      case 'text':
        console.log('Text message:', message);

        var options = {
          'method': 'GET',
          'url': 'https://shop.toqo.id/api/v2/generatelink?toko=bilikayu&phone=' + sender,
          'headers': {}
        };
        
        if (message.toLowerCase().includes("komplain") || message.toLowerCase().includes("konsultasi")) {
          await handoverToAgent(room_id);
        } else {
          await request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(JSON.parse(response.body).message);
            sendTextMessage(sender, JSON.parse(response.body).message);
          });
        }
        break;

      case 'file_attachment':
        console.log('File attachment received:');
        await sendMessageText(room_id, "I'll get you an agent to handle this.");
        await handoverToAgent(room_id);
        break;

      case 'location':
        console.log('Location received:');
        await sendMessageText(room_id, "I'll get you an agent to handle this.");
        await handoverToAgent(room_id);
        break;

      default:
        // console.log('Unknown message type:', type);
        break;
    }

    // Respond to Qiscus with a 200 OK to acknowledge receipt
    res.status(200).send({ status: 'success' });
  } catch (error) {
    console.error('Error handling Qiscus webhook:', error.message);
    res.status(500).send({ status: 'error', message: error.message });
  }
});

module.exports = router;