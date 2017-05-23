var Twit = require('twit')
var twitAcess = require('./twitteraccess');
var T = new Twit({
    consumer_key: twitAcess.consumer_key,
    consumer_secret: twitAcess.consumer_secret,
    access_token: twitAcess.access_token,
    access_token_secret: twitAcess.access_token_secret
});