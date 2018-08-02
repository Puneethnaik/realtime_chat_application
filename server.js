var path = require('path');
var login = require('./routes/loginRoutes');
var session = require('client-sessions');
var express = require('express');
var SQLCalls = require('./routes/mySqlCalls');
var app = express();
var http = require('http').Server(app);
var bodyParser= require('body-parser');
var io = require('socket.io')(http);

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//sessions
app.use(session({
    cookieName : 'session',
    secret : 'groupchat_secret'
}));



//mysql
var mysql  = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'groupchat'
})

connection.connect(function(err){
    if(err){
        console.log("something wrong. Could not connect with database");
    }
    else console.log("mysql successfully connected");
})


io.on('connection', function(socket){
    messages = [];
    console.log("a user connected");
    socket.on('disconnect', function(){
        console.log("user disconnected" + messages);
    })
    socket.on('chat message', function(msg){
        console.log('msg : ' + msg);
        messages.push(msg);
        io.emit('chat message', msg);
    })
});


app.get("/", function(req, res){
    console.log("Hello realtime world");
    res.sendFile(__dirname + "/index.html");
});

//loginlogout entry points
var router = express.Router();
router.get('/', function(req, res){
    res.json("Welcome to this groupchat web app.");
    console.log("hello");
});

router.post('/register', login.register);
router.post('/login', login.login);

app.use('/api/loginlogout', router);

app.get('/login', function(req, res){
    res.render('login.ejs', {title : "hello please login", type : "good"})
})

app.get('/register', function(req, res){
    res.render('register.ejs', {type : "good"});
});

app.get('/profile', function(req, res){
    if(!req.session.user)res.redirect('/login');
    else
        res.render('dashboard.ejs', {title:'Dashboard', user : req.session.user});
});
app.get('/logout', function(req, res){
    req.session.user = undefined;
    res.redirect('/profile');
});
//end loginlogout entry points

app.get("/chat_window", function(req, res){
    function callback(users){
        res.render("chat_window.ejs", {users : users});
    }
    SQLCalls.getUsers(callback);
});

var port = 3000 | process.env.port;
http.listen(port, function(req, res){
    console.log("Connected on port " + port);
});