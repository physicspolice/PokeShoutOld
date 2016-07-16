var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static('client'));

io.on('connection', function(socket) {

	socket.on('ping', function(msg) {
		// TODO group close (in time and space) ping events together
		// TODO prevent repeat pings by the same person
		io.emit('ping', msg);
	});

	socket.on('gone', function(msg) {
		// TODO pokemon has gone away, was never there, or was placed by mistake
		io.emit('gone', msg);
	});

});

server.listen(8080);
