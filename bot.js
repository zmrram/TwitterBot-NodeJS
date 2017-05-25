var Twit = require('twit')
var accesskeys = require('./accesskeys');
var T = new Twit(accesskeys.tweetterKey);
var wordnik = require('./wordnik');
var giphy = require('./giphy');
var fs = require('fs');

// function searchTweet() {
//     var param = {
//         q: 'donald trump',
//         count: 10
//     };
//     T.get('search/tweets', param, function(err, data, response) {
//         var statuses = data.statuses;
//         for (var i = 0; i < statuses.length; i++) {
//             console.log(statuses[i].text);
//         }
//         if (err) {
//             console.log(err);
//         }
//     })
// };

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

function tweetYelp(tweet, restaurant) {
    var param = {
        status: '@' + tweet.toUser + ' ' + restaurant.name + " is a good place to eat " + tweet.term + "\n" + restaurant.url
    }
    tweetMsg(param);
}

function replyResponse(event) {
    var yelp = require('./yelp');
    if (event.user.geo_enabled && event.place !== null) {
        var text = event.text.replace('@nodetwibt', "");
        var screenName = event.user.screen_name;
        var tweet = {
            term: text,
            location: event.place.full_name,
            toUser: screenName
        };
        yelp.searchYelp(tweet, tweetYelp);
    } else {
        if (user.screen_name !== '@nodetwibt') {
            var msg = 'Hi, @' + event.user.screen_name + " use this format ['@'nodetwibt ramen] to get the full experience, remember to enable location :)";
            var param = {
                status: msg
            };
            tweetMsg(param);
        }
    }
}

function listener() {
    console.log("Event listerner started...")
    var stream = T.stream('user')
    stream.on('follow', followResponse)
    stream.on('tweet', replyResponse);
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