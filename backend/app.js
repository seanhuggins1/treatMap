var express = require('express');
var bodyParser = require('body-parser'); 
var cors = require('cors');
const process = require('process');
var cookieParser = require('cookie-parser');

var app = express();
app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser())  
   .use(express.json());

var database = require('./Database/database');
var db = new database(`mongodb+srv://dbUser:${process.env.env_pwd}@cluster0.c7ut5.mongodb.net/admin?retryWrites=true&w=majority`); 
console.log(db);

require('./routes')(app, db);

var port = process.env.PORT || 8888;
app.listen(port);
console.log(`Listening on port: ${port}`);