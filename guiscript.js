const canvas = document.getElementById("rackoCanvas");
const ctx = canvas.getContext("2d");
var w = window.innerWidth;
var h = window.innerHeight;
var cards = [];
var drawCard;
var discardCard;

ctx.canvas.width = window.innerWidth * 0.9;
ctx.canvas.height = window.innerHeight;

var cardBaseWidth = canvas.width/12;
var cardBaseHeight = cardBaseWidth*1.5;

class Card{
	constructor(x,y,w,h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.selected = false;
		this.cell = new Path2D();
	}
	selectCard(ctx){
		if(this.selected === false){
			this.selected = true;
			ctx.strokeStyle = "red";
		}
		else{
			this.selected = false;
			ctx.strokeStyle = "black";
		}
	}
	create(){
		let cell = this.cell;
		cell.rect(this.x, this.y, this.w, this.h);
		
		ctx.fillStyle = "white";
		ctx.fill(cell);
		
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.stroke(cell);
	}
}

function drawValue(posx, posy, value){
	ctx.font = "28px Atkinson-Bold";
	ctx.fillStyle = "black";
	ctx.fillText(value, posx, posy);
}

//Draws the cards for a player's hand
function setup(mode){
	let posx;
	for(let i = 1; i <= 10; i++){
		posx = cardBaseWidth * i;
		//ctx.beginPath() //not sure if i need this still
		cards.push(new Card(posx, 10+cardBaseHeight+10, cardBaseWidth, cardBaseHeight));
	}
	if(mode === "double"){
		for(let i = 1; i <= 10; i++){
			posx = cardBaseWidth * i;
			//ctx.beginPath();
			cards.push(new Card(posx, 10+(cardBaseHeight+10)*2, cardBaseWidth, cardBaseHeight));
		}
	}
}

function drawCards(){
	for(card of cards){
		card.create();
	}
}

drawCard = new Card(canvas.width/2-100-5, 10, cardBaseWidth, cardBaseHeight);
discardCard = new Card(canvas.width/2 + 5, 10, cardBaseWidth, cardBaseHeight);
drawCard.create();
discardCard.create();
setup("double");
drawCards();
console.log(cards);

canvas.addEventListener('click', function(e){
	for(let i = 0; i < cards.length; i++){
		if(ctx.isPointInPath(cards[i].cell, e.offsetX, e.offsetY)){
			ctx.fillStyle = "blue";
		}
		else{
			ctx.fillStyle = "white";
		}
		ctx.fill(cards[i].cell);
		ctx.strokeStyle = "black";
		ctx.stroke(cards[i].cell);
	}
});


//Creates a deck of cards of a given length
function createDeck(len){
	let deck = new Array();
	for(let i = 1; i <= len; i++){
		deck.push(i);
	}
	return deck;
}

//Shuffles a given deck
function shuffle(deck){
	let currInd = deck.length;
	while(currInd != 0){
		let randInd = Math.floor(Math.random()*currInd);
		currInd--;
		[deck[currInd], deck[randInd]] = [deck[randInd], deck[currInd]];
	}
	return deck;
}

//Creates a new player
function createPlayer(isComputer, name, hand){
	return player = {
		isComputer: isComputer,
		name: name,
		hand: hand,
		points: 0
	}
}

//Creates a player hand of given length
function createHand(len){
	let hand = new Array(len);
	console.log(hand);
	return hand;
}

//Deals cards given a number of cards and a deck
function dealCards(hand, deck, handLength){
	for(let i = 0; i < handLength; i++){
		let randInd = Math.floor(Math.random()*(deck.length));
		hand[i] = deck[randInd];
		deck.splice(randInd, 1);
	}
	return [hand, deck];
}

//Checks if a given hand is a winner, cards should increase in value
//starting from the first index in the hand array
function checkWinner(hand){
	for(let i = 0; i < hand.length - 1; i++){
		if(hand[i] > hand[i+1]) return false;
	}
	return true;
}

//Checks a given array of players and returns an array of players with
//over 500 points
function checkForWinners(playerArray){
	let winners = [];
	for(player of playerArray){
		if(player.points > 500){
			winners.push(player);
		}
	}
	return winners;
}

//Tallies the number of cards in order and returns the value of the
//cards
function calculatePoints(hand){
	let count = 5;
	for(let i = 0; i < hand.length-1; i++){
		if(hand[i] < hand[i+1]) count += 5;
		else break;
	}
	return count;
}

function game(){
	let drawPile, discardPile;
	let players;
}

var newGameBtn = document.getElementById("newGame");
newGameBtn.addEventListener("click", function(){
	console.log("New Game");
});

var modal = document.getElementById("promptWindow");
var rulebookBtn = document.getElementById("rulebook");
var span = document.getElementsByClassName("close")[0];
rulebookBtn.addEventListener("click", function(){
	modal.style.display = "block";
});
span.addEventListener("click", function(){
	modal.style.display = "none";
});