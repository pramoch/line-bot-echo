'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// console.log('CHANNEL_ACCESS_TOKEN = ' + process.env.CHANNEL_ACCESS_TOKEN );
// console.log('CHANNEL_SECRET = ' + process.env.CHANNEL_SECRET);

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// simple reply function
const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: 'text', text }))
  );
};

function handleText(message, replyToken, source) {
  let text = message.text + 'test';

  if (message.text === 'profile') {
    if (source.userId) {
      return client.getProfile(source.userId)
        .then((profile) => replyText(
          replyToken,
          [
            `Display name: ${profile.displayName}`
          ]
        ));
    } else {
      return replyText(replyToken, 'Bot can\'t use profile API without user ID');
    }
  }
  
  replyText(replyToken, text);
}

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  handleText(event.message, event.replyToken, event.source);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
