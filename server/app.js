var express = require("express");
var app = express();

app.get('/', (req, res) => res.send('Hello World!'));

const port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("server started on port 3000 ...")});

module.exports = app;