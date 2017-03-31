var bodyParser = require('body-parser');
var mysql = require('mysql');
var Twit = require('twit');
var urlencodedParser = bodyParser.urlencoded({extended:false});
var twitts = [];

module.exports = function(app){

var connection = mysql.createConnection(
    {
      host     : 'stusql.dcs.shef.ac.uk',
      port     : '3306',
      user     : 'team069',
      password : 'f1cbdf4f',
      database : 'team069'
    }
);
connection.connect();

var client = new Twit({
  consumer_key: '3Rl61VPHEiY9rRyLKVQkBwGEW',
  consumer_secret: 'tC5UjYUMG506FcQivaojcpG3O3r05KO3O9wEGt6Z1KH3DA9vwq',
  access_token: '2462253177-QPr4kBkIhH3ZGOOeg0DFjg4LfdLaZkLtgSt7eLo',
  access_token_secret: 'bPyj6sY3ok2aGnfTTwH3FsNExRUfnVlOkWjIHNXNHZmEj'
});

app.get('/home', function(req, res){
  res.render('home', results = twitts);
  console.log('1:'+twitts);
});

app.post('/home', urlencodedParser, function(req, res){

  var pname = req.body.player_name;
  //var team = req.body.team;
  if(pname == 'All'){
  var query= connection.query('SELECT * FROM Twitter');
  }
  else{
  var query= connection.query('SELECT * FROM Twitter WHERE ScreenName = ? ORDER BY DateTime', [req.body.player_name]);
  }
  //var query = connection.query('SELECT * FROM Twitter');

  var counter = 0;

  query.on('result', function(response) {
      counter += 1;
      if (counter = 1){
        var cutTime = response.DateTime;
        console.log(cutTime);
        console.log(pname+' since:'+cutTime);
        client.get('search/tweets', { q: pname+' since:'+cutTime, count: 100 },
                    function(err, data, response){
                        for(var indx in data.statuses){
                            var tweet= data.statuses[indx];
                            var query = connnection.query('INSERT INTO Twitter (ScreenName, Text) VALUES ?', [pname, cutTime]);
                            twitts.push({author: tweet.user.screen_name, content: tweet.created_at});
                        }
                        console.log(twitts);
                        res.render('home', {results: twitts});
        });
      }
      //twitts.push({author: res.ScreenName, content: res.Text});
  });




  //twitts.push({author: 'meishe', content: 'I will win this game!'},{author: 'nima', content: 'what are you talking about'});


  twitts.length = 0;
});

app.delete('/home', function(req, res){

});


}
