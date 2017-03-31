var express = require('express');

var homeController = require('./controllers/homeServer');

var football = express();

football.set('view engine', 'ejs')

football.use(express.static('./public'));

homeController(football);

football.listen(3000);
