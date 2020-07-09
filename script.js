let ctx = document.querySelector("#canvas").getContext("2d");
let stepInput = document.querySelector("#steps");
let ruleInput = document.querySelector("#rules");
let ruleList = document.querySelector("#ruleList");
let startXInput = document.querySelector("#start-x");
let startYInput = document.querySelector("#start-y");
let tileWidthInput = document.querySelector("#tile-width");
let button = document.querySelector("#run");
let clearButton = document.querySelector("#clear");
let stepCountLabel = document.querySelector("#count");


let tiles = [];
let tileWidth = 1;

const U = 1;
const R = 2;
const D = 3;
const L = 4;

let rules;
let colors = [];
let index = 0;
let step = 300;
let stepCount;

let running = false;
let ant;
let interval;

class Ant{
	constructor(x, y, direction){
		this.x = x;
		this.y = y;
		this.direction = direction;
	}

	move(){
		switch(this.direction){
			case L:
				this.x--;
				break;
			case R:
				this.x++;
				break;
			case U:
				this.y--;
				break;
			case D:
				this.y++;
				break;
		}
	}

	rotate(tile){
		if(rules.charAt(tile.color) == 'L'){
			this.direction--;
		}else{
			this.direction++;
		}
		this.checkDirection();
		
		tile.color++;
		
		if(tile.color == rules.length){
			tile.color = 0;
		}
	}

	checkDirection(){
		if(this.direction > L){
			this.direction = U;
		}else if(this.direction < U){
			this.direction = L;
		}
	}
}

class Tile{
	constructor(x, y, color){
		this.x = x;
		this.y = y;
		this.color = color;
	}
}

function setColors(){
	colors = [];
	for(let i = 0; i < rules.length; i++){
		let red = Math.random() * 255;
		let green = Math.random() * 255;
		let blue = Math.random() * 255;
		colors[i] = "rgb(" + red  + ", " + green + ", " + blue + ")";
	}
}

function setTiles(){
	tiles = [];
	ctx.fillStyle = "#303030";
	for(let i = 0; i < 850 / tileWidth; i++){
		tiles[i] = new Array();
		for(let j = 0; j < 1600 / tileWidth; j++){
			tiles[i][j] = new Tile(j, i, 0);
			ctx.fillRect(j * tileWidth, i * tileWidth, tileWidth, tileWidth);
		}
	}
	ctx.fill();
}

function draw(){
	let i = 0;
	while(i < step){
		let tile;
		try{
			tile = tiles[ant.y][ant.x];
			ant.rotate(tile);
		}catch(e){
			stop();
			break;
		}
		ctx.fillStyle = colors[tile.color];

		ctx.fillRect(tiles[ant.y][ant.x].x * tileWidth, tiles[ant.y][ant.x].y * tileWidth, tileWidth, tileWidth);
		ctx.fill();
		ant.move();

		ctx.fillStyle = "black";
		ctx.fillRect(ant.x * tileWidth, ant.y * tileWidth, tileWidth, tileWidth);
		ctx.fill();
		i++;
	}
	stepCount += parseInt(step);
	stepCountLabel.innerHTML = "Steps: " + stepCount;
}

function start(){
	ctx.clearRect(0, 0, 1610, 900);
	step = stepInput.value;
	rules = ruleInput.value.toUpperCase().trim();
	let startX = startXInput.value;
	let startY = startYInput.value;
	ant = new Ant(startX, startY, U);
	tileWidth = tileWidthInput.value;
	setColors();
	setTiles();
	stepCount = 0;
	button.innerHTML = "Stop";
	button.id = "stop";
	interval = setInterval(() => draw(), 1);
	running = true;
}

function stop(){
	clearInterval(interval);
	button.innerHTML = "Run";
	button.id = "run";
	running = false;
}

function clear(){
	ctx.clearRect(0, 0, 1610, 900);
}

function setInputs(steps, startX, startY, tileWidth){
	stepInput.value = steps;
	startXInput.value = startX;
	startYInput.value = startY;
	tileWidthInput.value = tileWidth;
}


// ************************************************** Program start ***************************************************

ruleInput.oninput = () => {
	let list = ruleList.options;
	switch(ruleInput.value){
		case list[0].value:
			setInputs(10, 270, 125, 3);
			break;
		case list[1].value:
			setInputs(1000, 270, 125, 3);
			break;
		case list[2].value:
			setInputs(100, 270, 142, 3);
			break;
		case list[3].value:
			setInputs(50, 400, 125, 3);
			break;
		case list[4].value:
			setInputs(200, 350, 30, 3);
			break;
	}	
};

button.onclick = () => {
	if(!running){
		start();
	}else{
		stop();
	}
};

clearButton.onclick = () => {
	if(!running){
		clear();
		stepCount = 0;
		stepCountLabel.innerHTML = "Steps: " + stepCount;
	}
};

// LRLRRLRLRLLR - Highway in < 2400 steps
// LRLRRLRLRL   - Highway in < 26000 steps