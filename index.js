'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

//console.log('CHANNEL_ACCESS_TOKEN = ' + process.env.CHANNEL_ACCESS_TOKEN );
//console.log('CHANNEL_SECRET = ' + process.env.CHANNEL_SECRET);

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

const replyCarousel = (token) => {
  return client.replyMessage(
    token,
    {
      "type": "template",
      "altText": "Shopping carousel",
      "template": {
        "type": "carousel",
        "actions": [],
        "columns": [
          {
            "thumbnailImageUrl": "https://www.apple.com/v/iphone-11-pro/c/images/overview/water-resistance/splashes__d3a02nzl9p4y_medium.jpg",
            "title": "iPhone 11",
            "text": "พอเหมาะพอดี ไปซะทุกอย่าง",
            "actions": [
              {
                "type": "uri",
                "label": "ดูเพิ่มเติม",
                "uri": "https://www.apple.com/th/iphone/"
              }
            ]
          },
          {
            "thumbnailImageUrl": "https://www.apple.com/v/mac/home/ap/images/overview/hero/macbook_pro_16__ni9nkbyq2dm6_large.jpg",
            "title": "Macbook",
            "text": "ตัวท็อปสำหรับมือโปร",
            "actions": [
              {
                "type": "uri",
                "label": "ดูเพิ่มเติม",
                "uri": "https://www.apple.com/th/mac/"
              }
            ]
          }
        ]
      }
    }
  );
};

const replyConfirm = (token) => {
  return client.replyMessage(
    token,
    {
      "type": "template",
      "altText": "Confirm Lunch",
      "template": {
          "type": "confirm",
          "text": "Will you join lunch?",
          "actions": [
              {
                "type": "message",
                "label": "Yes",
                "text": "yes"
              },
              {
                "type": "message",
                "label": "No",
                "text": "no"
              }
          ]
      }
    }
  );
}

const replyButton = (token) => {
  return client.replyMessage(
    token,
    {
      "type": "template",
      "altText": "Buttons Apple Watch",
      "template": {
        "type": "buttons",
        "thumbnailImageUrl": "https://www.apple.com/v/apple-watch-hermes/r/images/hardware/s5-apple-watch-hermes/double-tour/double-tour-fauve-barenia-front__34sgrs9m5g26_small.jpg",
        "imageAspectRatio": "square",
        "title": "Apple Watch",
        "text": "สมาร์ทวอทช์อันดับหนึ่งของโลก แบบคูณสอง",
        "actions": [
            {
              "type": "message",
              "label": "ซื้อ",
              "text": "Buy Apple Watch"
            },
            {
              "type": "uri",
              "label": "ดูเพิ่มเติม",
              "uri": "https://www.apple.com/th/watch/"
            }
        ]
      }
    }
  );
}

function handleText(message, replyToken, source) {
  let text = message.text;

  if (message.text === 'profile') {
    if (source.userId) {
      return client.getProfile(source.userId)
        .then((profile) => replyText(
          replyToken,
          [
            `Display name: ${profile.displayName}`,
            `User ID: ${profile.userId}`
          ]
        ));
    } else {
      return replyText(replyToken, 'Bot can\'t use profile API without user ID');
    }
  }
  else if (message.text === 'shopping') {
    return replyCarousel(replyToken);
  }
  else if (message.text === 'confirm') {
    return replyConfirm(replyToken);
  }
  else if (message.text === 'button') {
    return replyButton(replyToken);
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
