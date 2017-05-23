var Twit = require('twit')
var twitAcess = require('./twitteraccess');
var T = new Twit(twitAcess.tweetterKey);
var wordnik = require('./wordnik');
var giphy = require('./giphy');

function searchTweet() {
    var param = {
        q: 'donald trump',
        count: 10
    };
    T.get('search/tweets', param, function(err, data, response) {
        var statuses = data.statuses;
        for (var i = 0; i < statuses.length; i++) {
            console.log(statuses[i].text);
        }
        if (err) {
            console.log(err);
        }
    })
};

function getWordOfDay(word, note, definiton) {
    console.log(word + " " + note + " " + definiton);
}

function getGif(url, event) {
    var name = event.source.name;
    var screenName = event.source.screen_name;
    var msg = '@' + screenName + " Thanks for the follow " + url + " via @giphy";
    tweetMsg(msg);
}

function tweetMsg(msg) {
    var tweet = {
        status: msg
    };
    T.post('statuses/update', tweet, function(err, data, response) {});
}

function followResponse(event) {
    giphy.randomWelcomeGif(getGif, event);
}

function listener() {
    console.log("Event listerner started...")
    var stream = T.stream('user')
    stream.on('follow', followResponse)
}

listener();