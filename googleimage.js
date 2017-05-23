const GoogleImages = require('google-images');
var access = require('./twitteraccess')
const client = new GoogleImages(access.google_API.cse_id, access.google_API.api_key);

module.exports = {
    searchImages: function(word, callback) {
        var search_option = {
            type: 'photo',
            safe: 'high'
        };
        client.search(word, search_option).then(images => {
            var request = require('request').defaults({ encoding: null });
            request.get(images[0].url, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    data = new Buffer(body).toString('base64');
                    callback(data);
                }
            });
        });
    }
}