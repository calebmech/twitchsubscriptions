var UI = require('ui');
var Vector2 = require('vector2');
var streams = [];
var oauth_token = localStorage.getItem("oauth_token");
console.log(oauth_token);
function getLiveChannels(oauth_token, callbackFunction) {
    var response;
    var req = new XMLHttpRequest();
    req.open('GET', "https://api.twitch.tv/kraken/streams/followed?oauth_token=" + oauth_token);
    req.onload = function(e) {
        if (req.readyState == 4) {
            if (req.status == 200) {
                streams = [];
                //console.log(req.responseText);
                response = JSON.parse(req.responseText);

                for (var i = 0; i < response._total; i++) {
                    streams.push({
                        title: response.streams[i].channel.display_name,
                        subtitle: response.streams[i].game
                    });
                }
                //streams = JSON.stringify(streams);
                console.log(streams);
                callbackFunction();
            } else {
                console.log("Error");
            }
        }
    };
    req.send(null);
}

// Show splash screen while waiting for data
var splashWindow = new UI.Window();

// Text element to inform user
var text = new UI.Text({
    position: new Vector2(0, 0),
    size: new Vector2(144, 168),
    text: 'Loading...',
    font: 'GOTHIC_28_BOLD',
    color: 'black',
    textOverflow: 'wrap',
    textAlign: 'center',
    backgroundColor: 'white'
});

// Add to splashWindow and show
splashWindow.add(text);
splashWindow.show();


getLiveChannels(oauth_token, function() {
    var dict = {
        'KEY_STREAM_NAME': streams[0][0],
        'KEY_STREAM_GAME': streams[0][1]
    };
    console.log(dict);

    // Construct Menu to show to user
    var resultsMenu = new UI.Menu({
        sections: [{
            items: streams
        }]
    });

  
    // Show the Menu, hide the splash
    resultsMenu.show();
    splashWindow.hide();

});

Pebble.addEventListener("showConfiguration", function() {
    console.log("showing configuration");
    Pebble.openURL('https://api.twitch.tv/kraken/oauth2/authorize?action=authenticate&client_id=amwwiwjoubgl2tstc6kfvvd45ee9k80&redirect_uri=pebblejs://close&response_type=token&scope=user_read');
});

Pebble.addEventListener("webviewclosed", function(e) {
    console.log("configuration closed");
    // webview closed
    //Using primitive JSON validity and non-empty check
    console.log(e.response);
    var hash = decodeURIComponent(e.response);
    console.log(hash);
    var oauth_token = hash.slice(13,43);
    console.log(oauth_token);
    oauth_token = localStorage.setItem("oauth_token", oauth_token);
    //console.log(username);

});