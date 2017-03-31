var bodyParser = require('body-parser');
var mysql = require('../tools/mysql.js');
var Twit = require('twit');
var parse = require('../tools/parse.js');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});


module.exports = function(app) {
    mysql.open();
    var client = new Twit({
        consumer_key: '3Rl61VPHEiY9rRyLKVQkBwGEW',
        consumer_secret: 'tC5UjYUMG506FcQivaojcpG3O3r05KO3O9wEGt6Z1KH3DA9vwq',
        access_token: '2462253177-QPr4kBkIhH3ZGOOeg0DFjg4LfdLaZkLtgSt7eLo',
        access_token_secret: 'bPyj6sY3ok2aGnfTTwH3FsNExRUfnVlOkWjIHNXNHZmEj'
    });

    app.get('/home', function(req, res) {
        res.render('home', {
            results: []
        });
    });

    app.post('/home', urlencodedParser, function(req, res) {
        var twitts = [];
        var pname = req.body.player_name;
        //var team = req.body.team;

        mysql.selectScreenName(pname, twitts, function(results) {
            if (results.length > 0) {
                var cutTime = results[0].created_at.toISOString().split("T")[0];
                console.log(results[0]);
                client.get('search/tweets', {
                    q: results[0].author + ' since:' + cutTime,
                    count: 100
                }, function(err, data, response) {
                    for (var indx in data.statuses) {
                        var tweet = data.statuses[indx];

                        mysql.insertTwit(tweet);
                        results.push({
                            author: tweet.user.screen_name,
                            content: tweet.text,
                            created_at: tweet.created_at
                        });
                    }
                    res.render('home', {
                        results: results
                    });
                });
            } else {
              client.get('search/tweets', {
                  q: pname,
                  count: 100
              }, function(err, data, response) {
                  for (var indx in data.statuses) {
                      var tweet = data.statuses[indx];
                      mysql.insertTwit(tweet);
                      results.push({
                          author: tweet.user.screen_name,
                          content: tweet.text,
                          created_at: tweet.created_at
                      });
                  }
                  res.render('home', {
                      results: results
                  });
              });

                //res.render('home', {

                    //results: [],
                    //noResult: true
            //  });
            }
        })
        //var query = connection.query('SELECT * FROM Twitter');

    });

    app.delete('/home', function(req, res) {

    });


}
