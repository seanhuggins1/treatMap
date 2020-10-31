var express = require('express');
var bodyParser = require('body-parser'); 
var cors = require('cors');
var cookieParser = require('cookie-parser');

var app = express();
app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser())  
   .use(express.json());

require('./routes')(app);

console.log('Listening on port 8888');
app.listen(8888);