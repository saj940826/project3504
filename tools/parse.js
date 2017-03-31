exports.escapeSQL = function(string){
  var result = string;
  var index = string.indexOf("\'");
  while(index != -1){
    result = result.slice(0, index) + '\'' + result.slice(index);
    index = result.indexOf("\'", index + 2);
  }
  return result;
};

exports.toSQLDateTime = function(created_at){
  return new Date(Date.parse(created_at)).toISOString()
};
