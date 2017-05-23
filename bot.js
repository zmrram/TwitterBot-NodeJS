var Twit = require('twit')
var twitAcess = require('./twitteraccess');
var T = new Twit(twitAcess.tweetterKey);

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

}

function getGif() {

}

function tweetMsg(msg) {

}

function followResponse(event) {
    console.log(event);
}

function listener() {
    console.log("Event listerner started...")
    var stream = T.stream('user')
    stream.on('follow', followResponse)
}

listener();