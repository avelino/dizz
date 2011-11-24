var express = require('express');
var app = express.createServer();
var io = require('socket.io').listen(app);

var players = [];
var lastMonsterPos = {x:100, y:100};

app.listen(5000);
app.use(app.router);
app.use(
  express.static(__dirname + '/gamer'));

io.sockets.on('connection', function(socket){

	socket.on('disconnect', function(){
		onDisconnect(socket);
	});

	players.push(socket.id);
	socket.broadcast.emit('clientCount', {clientCount: players.length});
	socket.emit('msg', 'welcome to the game! ' );
	socket.emit('getPosition', lastMonsterPos);
	
	socket.on('clientCount', function(){
		socket.emit('clientCount', {clientCount: players.length});
	});
	
	socket.on('getPosition', function(data){
		randomPos(data.x, data.y);
		socket.broadcast.emit('getPosition', lastMonsterPos);
		socket.emit('getPosition', lastMonsterPos);
	});
	
});


function onDisconnect(s){
	var index = players.indexOf(s.id);
	players.splice(index, 1);
	console.log('client saiu: ' + players.length);
	s.broadcast.emit('clientCount', {clientCount: players.length});
}

function randomPos(w, h){
	var monster = {};
	monster.x = 4 + (Math.random() * (w - 64));
	monster.y = 4 + (Math.random() * (h - 64));
	lastMonsterPos = monster;
}
