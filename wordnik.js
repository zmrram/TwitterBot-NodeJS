var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhttp = new XMLHttpRequest();
var access = require('./accesskeys');
module.exports = {
    worldOfTheDay: function(callback) {
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(this.responseText);
                var word = data.word;
                var note = data.note;
                var definition = data.definitions[0].text;
                callback(word, note, definition);
            }
        };
        var today = new Date(Date.now()).toISOString().slice(0, 10);
        var url = "http://api.wordnik.com/v4/words.json/wordOfTheDay?date=" + today + "&api_key=" + access.wordNikKey.api_key;
        xhttp.open("GET", url, true);
        xhttp.send();
    }
}