var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser= require('body-parser');
var io = require('socket.io')(http);

//middleware
app.use(bodyParser.json());
app.use(express.static("public"));

io.on('connection', function(socket){
    console.log("a user connected");
    socket.on('disconnect', function(){
        console.log("user disconnected");
    })
    socket.on('chat message', function(msg){
        console.log('msg : ' + msg);
        io.emit('chat message', msg);
    })
});


app.get("/", function(req, res){
    console.log("Hello realtime world");
    res.sendFile(__dirname + "/index.html");
});

var port = 3000 | process.env.port;
http.listen(port, function(req, res){
    console.log("Connected on port " + port);
});