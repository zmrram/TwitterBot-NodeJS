var Twit = require('twit')
var twitAcess = require('./twitteraccess');
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

function uploadPic() {
    var request = require('request').defaults({ encoding: null });
    request.get('https://www.w3schools.com/css/paris.jpg', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            data = new Buffer(body).toString('base64');
            T.post('media/upload', { media_data: data }, function(err, data, response) {
                // now we can assign alt text to the media, for use by screen readers and 
                // other text-based presentations and interpreters 
                var mediaIdStr = data.media_id_string
                var altText = "Small flowers in a planter on a sunny balcony, blossoming."
                var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

                T.post('media/metadata/create', meta_params, function(err, data, response) {
                    if (!err) {
                        // now we can reference the media and post a tweet (media will attach to the tweet) 
                        var params = { status: 'loving life #nofilter', media_ids: [mediaIdStr] }
                        T.post('statuses/update', params, function(err, data, response) {})
                    }
                })
            })
        }
    });

}

uploadPic();