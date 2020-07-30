/* Setting things up. */
var path = require('path'),
    express = require('express'),
    app = express(),   
    Twit = require('twit'),
    config = {
    /* Be sure to update the .env file with your API keys. See how to get them: https://botwiki.org/tutorials/how-to-create-a-twitter-app */      
      twitter: {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
      }
    },
    T = new Twit(config.twitter),
    stream = T.stream('statuses/sample');

app.use(express.static('public'));

const fs = require('fs');

/* You can use uptimerobot.com or a similar site to hit your /BOT_ENDPOINT to wake up your app and make your Twitter bot tweet. */

/* Original message:

Drop your shoulders.
Unclench your jaw.
Stop your tongue from pressing into the top of your mouth.
Relax your hands and wrists.
BREATHE.

*/

var message_list = [
  "Hey.\n\nYou may have tensed up again.\n\nIt's OK. Let's take a moment to take care of you.\n\nRelax your shoulders.\nUnclench your jaw.\nUnstick your tongue from the top of your mouth.\nRelax your hands.\nTake a deep breath.\n\nAnd go.",
  "Please take a minute to relax your body.\n\nUnclench your jaw.\nLoosen your tongue.\nTake a sip of water and relax your face.\nGently rotate your shoulders and then lower them.\nRest your wrists comfortably.\nClose your eyes and take a deep breath.",
  "Hold on. Please take a moment to check in with your body.\n\nDrop your shoulders.\nUnclench your jaw.\nLoosen your tongue from the roof of your mouth.\nRelax your hands.\nBreathe.",
  "Tense again? It'll be OK. Here's your reminder.\n\nRelax your hands and wrists.\nLoosen up along your arms and drop your shoulders.\nUnclench your jaw.\nStop your tongue from pressing into the top of your mouth.\nTake a slow breath.\nTake another."
];

var emoji_list = ['🌻','🌼','🌳','🍀','🍂','🏔️','🏞️','🧸','❤','🧡','💛','💚','💙','💜','💟','🌿','🌺','🌱','🌲'];

var special_characters = ['​','‌','‍','⁠'];

function get_random( input ) {
  var rand_index = Math.floor( Math.random() * input.length );
  return input[rand_index];
}

function dedupe_tweet( message ) {
  var special_set = "";
  var set_length = Math.floor( Math.random()*15 );
  
  for (var i = 0; i < set_length; i++) {
    special_set += get_random( special_characters );
  }
  return message + "\n\n" + special_set + get_random( emoji_list );
}


app.all("/" + process.env.BOT_ENDPOINT, function (request, response) {
  var resp = response;
  
  var last_message = "";
  
  if (fs.existsSync('.data/last_tweet.txt')) {
    last_message = fs.readFileSync(".data/last_tweet.txt", "utf8");
  }
  
  var message = null;
  
  while (message == null || message == last_message) {
    message = get_random( message_list );
  }
  
  fs.writeFile(".data/last_tweet.txt", message, "utf8", function(err) {
    if(err) {
        console.log("Error saving file.")
        return console.log(err);
    }

    console.log("The file was saved!");
  });
  
  var message = dedupe_tweet( message );
  T.post('statuses/update', { status: message }, function(err, data, response) {
    if (err){
      resp.sendStatus(500);
      console.log('Error!');
      console.log(err);
    }
    else{
      resp.sendStatus(200);
    }
  });
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your bot is running on port ' + listener.address().port);
});
