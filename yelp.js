const yelp = require('yelp-fusion');
var accesskeys = require('./accesskeys');
const client = yelp.client(accesskeys.yelp_API.access_token);

module.exports = {
    searchYelp: function(tweet, callback) {
        var param = {
            term: tweet.term,
            location: tweet.location
        }
        client.search(param).then(response => {
            var random = Math.floor(Math.random() * response.jsonBody.businesses.length);
            while (response.jsonBody.businesses[random].is_closed) {
                random = Math.floor(Math.random() * response.jsonBody.businesses.length);
            }
            var restaurant = response.jsonBody.businesses[random];
            var responseRestaurant = {
                name: restaurant.name,
                url: restaurant.url.substring(0, restaurant.url.indexOf('?'))
            };
            callback(tweet, responseRestaurant);
        }).catch(e => {
            console.log(e);
        });
    }
};