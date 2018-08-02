var express = require('express');
var bodyParser= require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(express.static("public"));
app.get("/", function(req, res){
    console.log("Hello realtime world");
    res.sendFile(__dirname + "/index.html");
});
var port = 3000 | process.env.port;
app.listen(port, function(req, res){
    console.log("Connected on port " + port);
});