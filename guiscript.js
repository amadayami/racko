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
		setup(this);
		enableTurnButtons(this);
		addListeners(this);
		updatePlayerInfoDisp(this.currentPlayer.name, this.currentPlayer.points);
		[this.draw, this.players] = dealCards(this.draw, this.players, this.draw.length/6);
		this.currentCard = this.draw.pop();
		updateBoard(this);
	};
	resetDeck(){
		this.draw = this.draw.concat(this.discard);
		this.draw.push(this.currentCard);
		this.currentCard = "";
		this.discard = [];
		const noUndefinedCardsInHand = (player) => !player.hand.includes(undefined);
		if(this.players.every(noUndefinedCardsInHand)){
			for(player of this.players){
				this.draw = this.draw.concat(player.hand);
				player.hand = [];
			}
		}
		else console.log("Some card undefined in player hand");
	}
	async switchCard(){
		console.log("switch card triggered");
		console.log(this.handCardIndex);
		if(this.handCardIndex !== -1){
			console.log(this.handCardIndex);
			let temp = this.currentPlayer.hand[this.handCardIndex];
			this.currentPlayer.hand[this.handCardIndex] = this.currentCard;
			this.currentCard = temp;
			console.log(this.handCardIndex);
			await this.nextTurn();
		}
		else console.log("No card selected.");
	}
	nextHand(){
		console.log("next hand triggered");
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
				console.log("winner: " + winners[0]);
			}
			else{
				//display winners names
				console.log("multiple winners");
			}
			//close the game
		}
		else{
			console.log("no winner yet");
			this.turn = 0;
			this.currentPlayer = this.players[this.turn];
			this.handCardIndex = -1;
			this.cardDrawnThisTurn = false;
			this.resetDeck();
			[this.draw, this.players] = dealCards(this.draw, this.players, this.draw.length/6);
			this.currentCard = this.draw.pop();
			updatePlayerInfoDisp(this.currentPlayer.name, this.currentPlayer.points);
			updateBoard(this);
		}
	};
	nextTurn(){
		console.log("next turn triggered");
		this.isWinner = checkWinner(this.currentPlayer.hand);
		if(this.isWinner){
			console.log(`${this.currentPlayer.name} wins the hand`);
			this.nextHand();
		}
		else{
			this.turn++;
			this.currentPlayer = this.players[this.turn%this.players.length];
			this.handCardIndex = -1;
			this.cardDrawnThisTurn = false;
			updatePlayerInfoDisp(this.currentPlayer.name, this.currentPlayer.points);
			updateBoard(this);
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
	create(style){
		let cell = this.cell;
		cell.rect(this.x, this.y, this.w, this.h);
		
		ctx.fillStyle = style;
		ctx.fill(cell);
		
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.stroke(cell);
	}
}

//Creates the cards for the board
function setup(instance){
	let posx;
	for(let i = 1; i <= 10; i++){
		posx = ((canvas.width/2) - 6*cardBaseWidth) + cardBaseWidth * i;
		//ctx.beginPath() //not sure if i need this still
		cards.push(new Card(posx, 10+cardBaseHeight+10, cardBaseWidth, cardBaseHeight));
	}
	if(instance.gameMode === "double"){
		for(let i = 1; i <= 10; i++){
			posx = ((canvas.width/2) - 6*cardBaseWidth) + cardBaseWidth * i;
			//ctx.beginPath();
			cards.push(new Card(posx, 10+(cardBaseHeight+10)*2, cardBaseWidth, cardBaseHeight));
		}
	}
	
	drawCard = new Card(canvas.width/2-cardBaseWidth-5, 10, cardBaseWidth, cardBaseHeight);
	discardCard = new Card(canvas.width/2 + 5, 10, cardBaseWidth, cardBaseHeight);
}

function updateBoard(instance){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//draw cards
	drawCard.create("red");
	discardCard.create("white");
	for(card of cards){
		card.create("white");
	}
	//draw values
	ctx.font = "28px Atkinson-Bold";
	ctx.fillStyle = "black";
	console.log(cards);
	for(let i = 0; i < instance.currentPlayer.hand.length; i++){
		ctx.fillText(instance.currentPlayer.hand[i], cards[i].x+(cardBaseWidth/6), cards[i].y+(cardBaseHeight/4));
	}
	ctx.fillText(instance.currentCard, discardCard.x+(cardBaseWidth/6), discardCard.y+(cardBaseHeight/4));
}

function resetCardDisplay(card, value){
	ctx.fillStyle = "white";
	ctx.clearRect(card.x, card.y, card.w, card.h);
	ctx.fill(card.cell);
	ctx.strokeStyle = "black";
	ctx.stroke(card.cell);
	
	ctx.fillStyle = "black";
	ctx.fillText(value, card.x+(cardBaseWidth/6), card.y+(cardBaseHeight/4));
}

function selectCardDisplay(card, value){
	ctx.fillStyle = "blue";
	ctx.clearRect(card.x, card.y, card.w, card.h);
	ctx.fill(card.cell);
	ctx.strokeStyle = "black";
	ctx.stroke(card.cell);
	
	ctx.fillStyle = "black";
	ctx.fillText(value, card.x+(cardBaseWidth/6), card.y+(cardBaseHeight/4));
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
function dealCards(deck, players, h){
	for(player of players){
		let hand = player.hand;
		for(let i = 0; i < h; i++){
			let randInd = Math.floor(Math.random()*deck.length);
			hand[i] = deck[randInd];
			deck.splice(randInd, 1);
		}
	}
	return [deck, players];
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

function enableTurnButtons(instance){
	let addBtn = document.getElementById("addCardBtn");
	let endTurnBtn = document.getElementById("endTurnBtn");
	addBtn.disabled = false;
	endTurnBtn.disabled = false;
	addBtn.style.backgroundColor = '#f0332f';
	endTurnBtn.style.backgroundColor = '#f0332f';
	addBtn.addEventListener('click', function(){
		instance.switchCard();
	})
	endTurnBtn.addEventListener('click', function(){
		instance.nextTurn();
	});
}

function addListeners(instance){
	canvas.addEventListener('click', function(e){
		if(ctx.isPointInPath(drawCard.cell, e.offsetX, e.offsetY)){
			if(!instance.cardDrawnThisTurn){
				if(instance.draw.length === 0){
					[instance.draw, instance.discard] = [instance.discard, instance.draw];
					instance.drawPile = shuffle(instance.draw);
					instance.currentCard = drawPile.pop();
					updateBoard(instance);
				}
				else{
					instance.discard.push(instance.currentCard);
					instance.currentCard = instance.draw.pop();
					updateBoard(instance);
				}
				instance.cardDrawnThisTurn = true;
			}
			return;
		}
		for(let i = 0; i < cards.length; i++){
			if(ctx.isPointInPath(cards[i].cell, e.offsetX, e.offsetY)){
				selectCardDisplay(cards[i], instance.currentPlayer.hand[i]);
				instance.handCardIndex = i;
			}
			else{
				resetCardDisplay(cards[i], instance.currentPlayer.hand[i]);
			}
		}
		console.log(instance.handCardIndex);
	});
}

function updatePlayerInfoDisp(name, points){
	let playerName = document.getElementById("playerName");
	let playerPoints = document.getElementById("playerPoints");
	playerName.innerText = `Player: ${name}`;
	playerPoints.innerText = `Points: ${points}`;
}