$(document).ready(function(){
  $.getJSON('/js/maps/ino.json', function(data) {
    //alert(data)
  });
  
  socketInit();
  
	// Let's play this game!
	reset();
	then = Date.now();
	setInterval(main, 1); // Execute as fast as possible  
  
})

/******SOCKET.IO STUFF**********/
var socket;
function socketInit(){
	socket = io.connect('/');

	socket.on('msg', function(data){
		$('#log').append(data);
	});
	
	socket.on('clientCount', function(data){
		$('#usercount').html(data.clientCount);
	});
	
	socket.on('getPosition', function(data){
		monster.x = data.x;
		monster.y = data.y;
	});
	
	//request online user count
	socket.emit('clientCount');
	
}
/****************/


// Create the canvas
var monster = {};
var then;
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "_img/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "_img/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "_img/monster.png";

// Game objects
var hero = {
	speed: 256  // movement in pixels per second
};
//var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	//monster.x = 4 + (Math.random() * (canvas.width - 64));
	//monster.y = 4 + (Math.random() * (canvas.height - 64));
	socket.emit('getPosition', {x:canvas.width, y:canvas.height});
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	// Are they touching?
	if (
		hero.x <= (monster.x + 12)
		&& monster.x <= (hero.x + 12)
		&& hero.y <= (monster.y + 12)
		&& monster.y <= (hero.y + 12)
	) {
		++monstersCaught;
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
  if(16 in keysDown){
  	ctx.fillStyle = "#333333";
	  ctx.font = "10px Helvetica";
  	ctx.textAlign = "left";
	  ctx.textBaseline = "top";
  	ctx.fillText("Count red cube kill: " + monstersCaught, 32, 32);
  }
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
//reset();
//var then = Date.now();
//setInterval(main, 1); // Execute as fast as possible
