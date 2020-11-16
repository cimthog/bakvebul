var app = require('express')();
var express = require('express');
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bCrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var moment = require("moment");

// Access public folder from root
app.set("layout extractScripts", true)
global.moment = moment;
global.base_url = 'http://178.62.60.63:4000/';   // http://178.62.60.63/

app.use('/public', express.static('public'));
//app.use(express.static('public'));

app.get('/layouts/', function(req, res) {
  res.render('view',{extractScripts:true});
});

// Add Authentication Route file with app
var Authrouter = require('./Authrouter.js');
app.use('/', Authrouter); 

//For set layouts of html view
var expressLayouts = require('express-ejs-layouts');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Add Route file with app
var router = require('./router.js');
app.use('/', router); 

http.listen(4000, function(){
  console.log('listening on *:4000');
});


