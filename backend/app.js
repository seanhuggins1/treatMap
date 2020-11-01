var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const process = require('process');
var cookieParser = require('cookie-parser');


var app = express();
app.use(express.static('../public'))
      .use(cors())
      .use(cookieParser())
      .use(express.json());

var database = require('./Database/database');
var db = new database(`mongodb+srv://dbUser:${process.env.env_pwd}@cluster0.c7ut5.mongodb.net/admin?retryWrites=true&w=majority`);
// console.log(db); // test


//secure web socket
var socket = require('./WebSocket/socket');
var wss = new socket(app);

// setInterval(()=> {
//       wss.broadcast('hello');
// },1000);

function open_file_and_load(address) {
   var fs = require('fs');
   vals = fs.readFileSync(address, 'utf-8');
   parsed = JSON.parse(vals);
   return parsed;
}

// county = open_file_and_load('../analytics/County.json');
// state = open_file_and_load('../analytics/State.json');
combined = open_file_and_load('../analytics/combined_data.json');

require('./routes')(app, db, wss, combined);

var port = process.env.PORT || 8888;
app.listen(port);
console.log(`Listening on port: ${port}`);