var express = require("express");
// var bodyParser = require("body-parser");
// var path = require("path");
// var expressValidator = require('express-validator')

var app = express();

// //Body Parser Midleware
// app.use(bodyParser.urlencoded());
// app.use(bodyParser.json());


//Global variable
app.use(function(req, res, next){
	res.locals.errors = null;
	next();
})

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/rides', function(req, res){
	// find everything in rides and show here
})

app.get('/rides/:id', function(req, res){
	// find single ride and show here
})

app.post('/rides', function(req, res){
	
})

app.post('/rides/:id/requests', function(req, res){
	
})

const port = process.env.PORT || 3000
app.listen(port)