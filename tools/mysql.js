var mysql = require('mysql');
var parse = require('./parse.js');
var connection = mysql.createConnection(
    {
      host     : 'stusql.dcs.shef.ac.uk',
      port     : '3306',
      user     : 'team069',
      password : 'f1cbdf4f',
      database : 'team069'
    }
);


exports.selectScreenName = function(screen_name, twitts, callback){
  connection.query('SELECT * FROM Twitter WHERE ScreenName = ? ORDER BY DateTime',[screen_name], function(err, rows, fields) {
      if (err) {
          throw err;
      } else {
          console.log("Length: "+rows.length);
          for (var i = 0; i < rows.length; i++) {
              twitts.push({
                  author: rows[i].ScreenName,
                  content: rows[i].Text,
                  created_at: rows[i].DateTime
              });
          }
          callback(twitts);
      }
  })
}

exports.insertTwit = function(twit, callback){
  var screen_name = parse.escapeSQL(twit.user.screen_name);
  var created_at = parse.toSQLDateTime(twit.created_at);
  var text = parse.escapeSQL(twit.text);
  var query_string = 'INSERT INTO Twitter(ScreenName, DateTime, Text) VALUE(\'' + screen_name + '\', \'' + created_at + '\', \'' + text + '\');';

  var query = connection.query(query_string);
  query.on('error', function(err) {
      console.log(query_string);
      throw err;
  });
  console.log(query.sql);
}

exports.open = function(){
  connection.connect();
}
exports.close = function(){
  connection.end();
}
