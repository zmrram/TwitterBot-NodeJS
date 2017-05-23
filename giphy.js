module.exports = function(callback) {
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            var url = data.data.url;
            callback(url);
        }
    };
    xhttp.open("GET", "http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=welcome", true);
    xhttp.send();
}