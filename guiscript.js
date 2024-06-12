const canvas = document.getElementById("rackoCanvas");
const ctx = canvas.getContext("2d");
var w = window.innerWidth;
var h = window.innerHeight;
var cards = [];
var drawCard;
var discardCard;
var gameInstance = null;

ctx.canvas.width = window.innerWidth * 0.9;
ctx.canvas.height = window.innerHeight * 0.8;

var cardBaseWidth = canvas.width/13;
var cardBaseHeight = cardBaseWidth*1.5;

class Game{
	constructor(gameMode, draw, discard, players){
		console.log(players);
		this.gameMode;
		this.draw = draw;
		this.discard = discard;
		this.players = players;
		
		//tentative variables
		this.isWinner = false;
		this.winners = [];
		this.turn = 0;
		this.handCardIndex = -1;
		this.currentPlayer = this.players[0];
		this.currentCard;
		this.cardDrawnThisTurn = false;
	}
	init(){
		setup(this.gameMode);
		enableTurnButtons();
		drawCards();
		canvas.addEventListener('click', function(e){
			for(let i = 0; i < cards.length; i++){
				if(ctx.isPointInPath(cards[i].cell, e.offsetX, e.offsetY)){
					selectCardDisplay(cards[i]);
				}
				else{
					resetCardDisplay(cards[i]);
				}
			}
		});
		document.getElementById("endTurnBtn").addEventListener('click', this.nextTurn());
		document.getElementById("addCardBtn").addEventListener('click', this.switchCard());
	};
	switchCard(){
		if(this.handIndex !== -1){
			let temp = this.currentPlayer.hand[this.handIndex];
			this.currentPlayer.hand[this.handIndex] = this.currentCard;
			this.currentCard = temp;
			this.discard.push(temp);
			this.nextTurn();
		}
		else console.log("No card selected.");
	}
	nextHand(){
		this.currentPlayer.points += 75;
		for(player of this.players){
			if(player !== this.currentPlayer){
				player.points = calculatePoints(player.hand);
			}
		}
		this.winners = checkForWinners(this.players);
		if(this.winners.length > 0){
			if(this.winners.length === 1){
				//display winner name
			}
			else{
				//display winners names
			}
			//close the game
		}
		else{
			this.turn = 0;
			this.currentPlayer = this.players[this.turn];
			this.handCardIndex = -1;
			this.cardDrawnThisTurn = false;
		}
	};
	nextTurn(){
		this.isWinner = checkWinner(this.currentPlayer.hand);
		if(this.isWinner){
			this.nextHand();
		}
		else{
			this.turn++;
			this.currentPlayer = this.players[this.turn%this.players.length];
			this.handCardIndex = -1;
			this.cardDrawnThisTurn = false;
			//if computer player, then do computer stuff and go to next turn
		}
	}
}

class Card{
	constructor(x,y,w,h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.cell = new Path2D();
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
		posx = ((canvas.width/2) - 6*cardBaseWidth) + cardBaseWidth * i;
		//ctx.beginPath() //not sure if i need this still
		cards.push(new Card(posx, 10+cardBaseHeight+10, cardBaseWidth, cardBaseHeight));
	}
	if(mode === "double"){
		for(let i = 1; i <= 10; i++){
			posx = ((canvas.width/2) - 6*cardBaseWidth) + cardBaseWidth * i;
			//ctx.beginPath();
			cards.push(new Card(posx, 10+(cardBaseHeight+10)*2, cardBaseWidth, cardBaseHeight));
		}
	}
	
	drawCard = new Card(canvas.width/2-cardBaseWidth-5, 10, cardBaseWidth, cardBaseHeight);
	discardCard = new Card(canvas.width/2 + 5, 10, cardBaseWidth, cardBaseHeight);
	drawCard.create();
	discardCard.create();
}

function drawCards(){
	for(card of cards){
		card.create();
	}
}

function resetCardDisplay(card){
	ctx.fillStyle = "white";
	ctx.clearRect(card.x, card.y, card.w, card.h);
	ctx.fill(card.cell);
	ctx.strokeStyle = "black";
	ctx.stroke(card.cell);
}

function selectCardDisplay(card){
	ctx.fillStyle = "blue";
	ctx.clearRect(card.x, card.y, card.w, card.h);
	ctx.fill(card.cell);
	ctx.strokeStyle = "black";
	ctx.stroke(card.cell);
}

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

//Validates the values needed to create a new game
function validateGameState(){
	if(numPlayers === undefined){
		console.log("Number of players not selected.");
	}
	else if(gameMode === undefined){
		console.log("Game mode not selected.");
	}
	else{
		playerNames = [];
		let textBoxes = document.querySelectorAll('input[type="text"]');
		for(let i = 0; i < numPlayers; i++){
			if(textBoxes[i].value == "" || textBoxes[i].length == 0 || textBoxes[i] == null){
				console.log("Missing player name");
				return;
			}
			else{
				playerNames.push(textBoxes[i].value);
			}
		}
		
		let allComputer = true;
		let compChecks = document.querySelectorAll('input[type="checkbox"]');
		for(let i = 0; i < numPlayers; i++){
			if(compChecks[i].checked === false) allComputer = false;
		}
		if(allComputer){
			console.log("Need at least one human player.");
			return;
		}
		console.log("All parameters set, creating game...");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		game(numPlayers, gameMode, playerNames, compChecks);
	}
}

function resetBoard(players, draw, discard){
	draw = draw.concat(discard);
	discard = [];
	const anyUndefined = (player) => player.hand.includes(undefined);
	if(!players.some(anyUndefined)){
		for(player of players){
			draw = draw.concat(player.hand);
			player.hand = [];
		}
	}
	return [players, shuffle(draw), discard];
}

function game(numPlayers, gameMode, playerNames, compChecks){
	let drawPile, discardPile;
	let playersArray = [];
	let deckLength, handLength;
	if(gameMode === "standard"){
		deckLength = 60;
		handLength = 10;
	}
	else{
		deckLength = 120;
		handLength = 20;
	}
	drawPile = shuffle(createDeck(deckLength));
	discardPile = createDeck(0);
	for(let i = 0; i < numPlayers; i++){
		playersArray.push(createPlayer(compChecks[i].checked, playerNames[i], Array(handLength)));
	}
	console.log(playersArray);
	gameInstance = new Game(gameMode, drawPile, discardPile, playersArray);
	gameInstance.init();
}

var promptWindow = document.getElementById("promptWindow");
var newGameBtn = document.getElementById("newGame");
var closeNew = document.getElementsByClassName("close")[0];
var gameSubmit = document.getElementById("gameSubmit");
var numPlayerBtns = document.getElementsByName("numPlayers");
var gameModeBtns = document.getElementsByName("gameType");
var numPlayers;
var gameMode;
var playerNames = [];

newGameBtn.addEventListener("click", function(){
	if(promptWindow.style.display === "block") promptWindow.style.display = "none";
	else promptWindow.style.display = "block";
	for(btn of numPlayerBtns){
		btn.checked = false;
	}
	for(btn of gameModeBtns){
		btn.checked = false;
	}
	let textBoxes = document.querySelectorAll('input[type="text"]');
	let compChecks = document.querySelectorAll('input[type="checkbox"]');
	for(let i = 0; i < textBoxes.length; i++){
		textBoxes[i].value = "";
		compChecks[i].checked = false;
	}
});

for(let i = 0; i < numPlayerBtns.length; i++){
	numPlayerBtns[i].addEventListener("click", function(){
		let textBoxes = document.querySelectorAll('input[type="text"]');
		let playerLabels = document.getElementsByClassName("playerLabels");
		let compChecks = document.querySelectorAll('input[type="checkbox"]');
		let compLabels = document.getElementsByClassName("compCheckLabels");
		for(let i = 0; i < textBoxes.length; i++){
			textBoxes[i].style.visibility = "hidden";
			playerLabels[i].style.visibility = "hidden";
			compChecks[i].style.visibility = "hidden";
			compLabels[i].style.visibility = "hidden";
		}
		numPlayers = document.querySelector('input[name="numPlayers"]:checked').value;
		for(let i = 0; i < numPlayers; i++){
			textBoxes[i].style.visibility = "visible";
			playerLabels[i].style.visibility = "visible";
			compChecks[i].style.visibility = "visible";
			compLabels[i].style.visibility = "visible";
		}
	});
}

for(let i = 0; i < gameModeBtns.length; i++){
	gameModeBtns[i].addEventListener("click", function(){
		gameMode = document.querySelector('input[name="gameType"]:checked').value;
	});
}


closeNew.addEventListener("click", function(){
	promptWindow.style.display = "none";
});

gameSubmit.addEventListener("click", function(){
	validateGameState();
	promptWindow.style.display = "none";
});

var rulebook = document.getElementById("rulebookWindow");
var rulebookBtn = document.getElementById("rulebook");
var closeRule = document.getElementsByClassName("close")[1];
rulebookBtn.addEventListener("click", function(){
	rulebook.style.display = "block";
});
closeRule.addEventListener("click", function(){
	rulebook.style.display = "none";
});

function enableTurnButtons(){
	let addBtn = document.getElementById("addCardBtn");
	let endTurnBtn = document.getElementById("endTurnBtn");
	addBtn.disabled = false;
	endTurnBtn.disabled = false;
	addBtn.style.backgroundColor = '#f0332f';
	endTurnBtn.style.backgroundColor = '#f0332f';
}