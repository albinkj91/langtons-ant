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

//*****************************************************************************************************************************/

let colors = [];
let tiles = [];
let tileWidth;

const UP = 1;
const RIGHT = 2;
const DOWN = 3;
const LEFT = 4;

let rules;
let stepsPerInterval;
let stepTotalCount;

let running = false;
let ant;
let gameLoopInterval;

class Ant{
	constructor(x, y, direction){
		this.x = x;
		this.y = y;
		this.direction = direction;
	}

	move(){
		switch(this.direction){
			case LEFT:
				this.x--;
				break;
			case RIGHT:
				this.x++;
				break;
			case UP:
				this.y--;
				break;
			case DOWN:
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
		if(this.direction > LEFT){
			this.direction = UP;
		}else if(this.direction < UP){
			this.direction = LEFT;
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

function setRuleColors(){
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

function render(){
	for(let i = 0; i < stepsPerInterval; i++){
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
	}

	stepTotalCount += parseInt(stepsPerInterval);
	stepCountLabel.innerHTML = "Steps: " + stepTotalCount;
}

function start(){
	if(ruleInput.value == ""){
		return;
	}
	
	ctx.clearRect(0, 0, 1610, 900);
	stepsPerInterval = stepInput.value;
	rules = ruleInput.value.toUpperCase().trim();
	
	let startX = startXInput.value;
	let startY = startYInput.value;
	
	ant = new Ant(startX, startY, UP);
	tileWidth = tileWidthInput.value;

	setRuleColors();
	setTiles();

	stepTotalCount = 0;
	button.innerHTML = "Stop";
	button.id = "stop";
	gameLoopInterval = setInterval(() => render(), 1);
	running = true;
}

function stop(){
	clearInterval(gameLoopInterval);
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

ruleInput.oninput = () => {
	let ruleAlternatives = ruleList.options;
	switch(ruleInput.value){
		case ruleAlternatives[0].value:
			setInputs(10, 270, 125, 3);
			break;
		case ruleAlternatives[1].value:
			setInputs(1000, 270, 125, 3);
			break;
		case ruleAlternatives[2].value:
			setInputs(100, 270, 142, 3);
			break;
		case ruleAlternatives[3].value:
			setInputs(50, 400, 125, 3);
			break;
		case ruleAlternatives[4].value:
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
		stepTotalCount = 0;
		stepCountLabel.innerHTML = "Steps: " + stepTotalCount;
	}
};