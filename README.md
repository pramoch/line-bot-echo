# Echo Bot

An example LINE bot just to echo messages

## How to use

### Install deps

``` shell
$ npm install
```

### Configuration

``` shell
$ export CHANNEL_SECRET=YOUR_CHANNEL_SECRET
$ export CHANNEL_ACCESS_TOKEN=YOUR_CHANNEL_ACCESS_TOKEN
$ export PORT=1234
```

### Run

``` shell
$ node .
```

## Webhook URL

```
https://your.base.url/callback
```

## Run local

``` shell
npm run dev
```

- CHANNEL_ACCESS_TOKEN:
  - Go to https://developers.line.biz
  - Pramoch Provider > Rainbow shop > Messaging API > Channel access token > Dd..U=
- CHANNEL_SECRET:
  - Go to https://developers.line.biz
  - Pramoch Provider > Rainbow shop > Basic settings > Channel secret > bb..e1
