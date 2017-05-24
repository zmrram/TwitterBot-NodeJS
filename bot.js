var Twit = require('twit')
var twitAcess = require('./accesskeys');
var T = new Twit(twitAcess.tweetterKey);
var wordnik = require('./wordnik');
var giphy = require('./giphy');
var fs = require('fs');

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

function tweetWordOfDay() {
    console.log("tweeting word of the day.");
    wordnik.worldOfTheDay(getPic);
}

function getPic(word, note, definiton) {
    var googleimage = require('./googleimage');
    googleimage.searchImages(word, note, definiton, tweetPic);
}

function getGif(url, event) {
    var name = event.source.name;
    var screenName = event.source.screen_name;
    var msg = '@' + screenName + " Thanks for the follow " + url + " via @giphy";
    var param = {
        status: msg
    };
    tweetMsg(param);
}

function tweetMsg(param) {
    T.post('statuses/update', param, function(err, data, response) {});
}

function followResponse(event) {
    var name = event.source.name;
    console.log(name + ' followed.')
    giphy.randomWelcomeGif(getGif, event);
}

function listener() {
    console.log("Event listerner started...")
    var stream = T.stream('user')
    stream.on('follow', followResponse)
}

function tweetPic(imgData64, word, note, definiton) {
    T.post('media/upload', { media_data: imgData64 }, function(err, data, response) {
        var mediaIdStr = data.media_id_string
        var altText = note;
        var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

        T.post('media/metadata/create', meta_params, function(err, data, response) {
            var msg = "#WordOfTheDay " + word.toUpperCase() + "\n";
            if (msg.length + definiton.length < 140) {
                msg += definiton;
            }
            if (!err) {
                var params = { status: msg, media_ids: [mediaIdStr] }
                tweetMsg(params);
            }
        })
    });
}

listener();
setInterval(tweetWordOfDay, 3600000 * 24);