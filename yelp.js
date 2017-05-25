const yelp = require('yelp-fusion');
const client = yelp.client(accesskeys.yelp_API.access_token);

module.exports = {
    searchYelp: function(param, callback) {
        client.search(param).then(response => {
            console.log(JSON.stringify(response.jsonBody));
        }).catch(e => {
            console.log(e);
        });
    }
};