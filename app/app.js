//  To learn new technologies => spend your time on reading its documentation
// REPL stands for read eval print loop
// Import events module
let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
// let reload = require('reload');
let passport = require('passport');
let cookies = require('cookie-parser');

let myData = require('./data/data.json');
let fs = require("fs");
let app = express();
let ioserver = require('http').Server(app);
let io = require('socket.io')(ioserver, {serveClient: true});
const users = [];
// connect to mongodb
let mongoose = require('mongoose');
mongoose.connect("mongodb://hosam:hoss161996@ds133281.mlab.com:33281/anode");


mongoose.connection.once('open', function () {
	console.log("sheer up you are connected successfully");
});
mongoose.Promise = global.Promise;


// set our environment variable
app.set('port', process.env.PORT || 3000);
app.set("view engine", "ejs");
app.set('views', __dirname + "/public/templates");

// set local variables to be accessed in whole th project
app.locals.jsonData = myData;

// serve static files and dependencies
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookies());
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
// let express use templates and routers
app.use(require('./routes/index'));
app.use(require('./routes/speakers'));
app.use(require('./routes/page'));
app.use(require('./routes/speaker'));
app.use(require('./routes/about'));
app.use(require('./routes/chat'));
app.use(require('./routes/feedback'));
app.use(require('./routes/sign'));
//Api Routes
app.use('/api', require('./routes/api/feedbacks'));


// listen to server and log the error if founded
ioserver.listen(app.get('port'), function (err) {
	if (err) throw  err;
	console.log('Listening on port: ' + app.get('port'));

});

// handle errors while developing

// attach socket io middleware

io.on('connection', function (socket) {
	// listen for diconnect event on the server side
	socket.on('disconnect', function (user) {
		console.log('someone leaves..> ', user);
		users.splice(users.indexOf(user), 1);
		socket.broadcast.emit('users:online', [...new Set(users)]);
	});
	socket.emit('get:users', users);
	socket.emit('users:online', [...new Set(users)]);
	socket.on('user:in', user=>{
		console.log('new user '+ user+ ' has been added');
		if (~~users.indexOf(user))
			users.push(user);
		socket.broadcast.emit('users:online', [...new Set(users)]);
	})
	socket.on("send", function (data) {
		console.log(data);
		socket.broadcast.emit('chat-message', data)
	});

	socket.on('user:typing', function (username,inputVal) {
		console.log('server user is typing', username);
		socket.broadcast.emit('chat:typying', username, inputVal);
	})
});



// reload the page while developing

// reload(ioserver, app);
