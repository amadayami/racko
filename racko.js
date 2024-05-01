//Creates an array of values based on the given length
//Standard Racko deck is 60 cards from 1 to 60
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

//Creates a new hand for a player based on the given length
//Standard Racko hand is 10 cards
function createHand(len){
	let hand = new Array(len);
	return hand;
}

//Deals cards to two a hand and a deck
function dealCards(hand, deck){
	for(let i = 0; i < hand.length; i++){
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

//Picks a random card from the deck, removes it from the deck and
//returns the card
function pullCard(deck){
	let randInd = Math.floor(Math.random()*(deck.length));
	let card = deck[randInt];
	deck.splice(randInd, 1);
	return card;
}

//Creates a game based on player input
function gameCreation(){
	console.log("Hey! Welcome to Racko :)");
	
	let players = prompt("How many people are playing today?", 2);
	if(players == 1){
		console.log("Computer player support to be added");
		return;
	}
	else if(players > 2){
		console.log("Sorry only two players for now");
		return;
	}
	else if(players == 0){
		console.log("No one wins :(");
		return;
	}
	else{
		console.log("Great!");
	}
	
	let deckLength = prompt("How many cards would you like to play with? Min: 60", 60);
	let handLength = prompt("How many cards for each player? Min: 10", 10);
	if(deckLength < 60 || handLength < 10){
		console.log("Deck or hand length not at minimum");
		return;
	}
	if(handLength * players > deckLength){
		console.log("Not enough cards to play!");
		return;
	}
	console.log("Can do!");
	
	let playDeck = createDeck(deckLength);
	playDeck = shuffle(playDeck);
	let discardPile = createDeck(0);
	
	//only going to support two players for now
	let player1 = createHand(handLength);
	let player2 = createHand(handLength);
	
	return [playDeck, discardPile, player1, player2];
}

function play(){
	let playDeck, discardPile;
	let player1, player2;
	[playDeck, discardPile, player1, player2] = gameCreation();
	console.log("Game created, dealing cards...");
	[player1, playDeck] = dealCards(player1, playDeck);
	[player2, playDeck] = dealCards(player2, playDeck);
}