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

//Creates a new player
function createPlayer(isComputer, name, hand){
	return player = {
		isComputer: isComputer,
		name: name,
		hand: hand,
		points: 0
	}
}

//Creates a new hand for a player based on the given length
//Standard Racko hand is 10 cards
function createHand(len){
	let hand = new Array(len);
	console.log(hand);
	return hand;
}

//Deals cards given a number of cards and a deck
//NOTE: should just have it take the top ones instead of random ones
function dealCards(hand, deck){
	for(let i = 0; i < hand.length; i++){
		let randInd = Math.floor(Math.random()*(deck.length));
		hand[i] = deck[randInd];
		deck.splice(randInd, 1);
	}
	return [hand, deck];
}

//this is a simplified way of how i approach the game
function computerMove(hand, discard, draw){
	let handLength = hand.length;
	let deckLength = handLength * 6;
	let slot;
	
	let currentCard;
	if(draw.length === 0){
		[draw, discard] = [discard, draw];
		draw = draw.shuffle(draw);
		currentCard = draw.pop();
	}
	else if(discard.length === 0){
		currentCard = draw.pop();
	}
	else{
		//the computer checks for a spot for the discard card, else draws
		currentCard = discard[discard.length-1];
		slot = Math.ceil(currentCard/6);
		if(Math.ceil(hand[slot-1]/6) === slot){
			//then we draw and try again
			currentCard = draw.pop();
		}
		else{
			//put the current card in the hand and put the switched card into the discard pile
			let switchCard = hand[slot-1];
			hand[slot-1] = currentCard;
			discard.push(switchCard);
			return [hand, discard, draw];
		}
	}
	//current card is recently drawn
	slot = Math.ceil(currentCard/6);
	if(Math.ceil(hand[slot-1]/6) === slot){
		discard.push(currentCard);
	}
	else{
		let switchCard = hand[slot-1];
		hand[slot-1] = currentCard;
		discard.push(switchCard);
	}
	return [hand, discard, draw];
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
	//You automatically get 5 points for having one card
	let count = 5;
	for(let i = 0; i < hand.length - 1; i++){
		if(hand[i] < hand[i+1]) count += 5;
		else break;
	}
	return count;
}

//Creates a game based on player input
function gameCreation(){
	console.log("Hey! Welcome to Racko :)");
	
	let players = prompt("How many people are playing today?", 2);
	if(players == 1){
		console.log("Second player will be a computer!");
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
	
	let player1Name = prompt("What is the first player's name?");
	let player2Name = prompt("What is the second player's name?");
	
	console.log(`Hi ${player1Name} and ${player2Name}!`);
	
	let gameType = prompt("Would you like to play standard or double Racko?")
	if(gameType.toLowerCase() === "standard"){
		deckLength = 60;
		handLength = 10;
	}
	else if(gameType.toLowerCase() === "double"){
		deckLength = 120;
		handLength = 20;
	}
	else{
		console.log("invalid choice, defaulting to standard...");
		deckLength = 60;
		handLength = 10;
	}
	
	let playDeck = createDeck(deckLength);
	playDeck = shuffle(playDeck);
	let discardPile = createDeck(0);
	
	//only going to support two players for now
	let player1 = createPlayer(false, player1Name, Array(handLength));
	let player2;
	if(players == 1) player2 = createPlayer(true, player2Name, Array(handLength));
	else player2 = createPlayer(false, player2Name, Array(handLength));
	return [playDeck, discardPile, player1, player2];
}

function boardToString(player, discard, draw){
	//i want to display the player's hand, the top card on the
	//discard pile, and the number of cards in the play deck
	let dd;
	if(discard.length == 0){
		dd = 'x';
	}
	else dd = discard[discard.length-1];
	return `Player: ${player.name} | Points: ${player.points}\nDiscard: ${dd} Cards in draw: ${draw.length}\nYour hand: ${player.hand}`;
}

function play(drawPile, discardPile, player1, player2){
	console.log("Dealing cards...");
	[player1.hand, playDeck] = dealCards(player1.hand, drawPile);
	[player2.hand, playDeck] = dealCards(player2.hand, drawPile);
	let isWinner = false;
	let winner;
	let turn = 1;
	let currentPlayer;
	while(!isWinner){
		if(turn % 2 == 1) currentPlayer = player1;
		else if(turn % 2 == 0) currentPlayer = player2;
		console.log(boardToString(currentPlayer, discardPile, drawPile));
		if(currentPlayer.isComputer === true){
			computerMove(currentPlayer.hand, discardPile, drawPile);
			isWinner = checkWinner(currentPlayer.hand);
			turn++;
			continue;
		}
		
		let currentCard;
		if(drawPile.length === 0){
			[drawPile, discardPile] = [discardPile, drawPile];
			drawPile = shuffle(drawPile);
			currentCard = drawPile.pop();
		}
		else if(discardPile.length === 0){
			currentCard = drawPile.pop();
		}
		else{
			let pileChoice = prompt("Draw or discard pile? (draw/discard)");
			if(pileChoice.toLowerCase() === "draw"){
				currentCard = drawPile.pop();
			}
			else if(pileChoice.toLowerCase() === "discard"){
				currentCard = discardPile.pop();
			}
			else{
				console.log("defaulting to draw pile");
				currentCard = drawPile.pop();
			}
		}
		console.log(`Current card: ${currentCard}`);
		
		let playerMoving = true;
		while(playerMoving){
			let playerMove = prompt("Discard or add to your hand?");
			if(playerMove.toLowerCase() === "discard"){
				discardPile.push(currentCard);
				playerMoving = false;
			}
			else if(playerMove.toLowerCase() === "add"){
				let switchCard = Number(prompt("Which number would you like to switch?"));
				if(!currentPlayer.hand.includes(switchCard)){
					console.log("You don't have that card!");
					continue;
				}
				let cardIndex = currentPlayer.hand.indexOf(switchCard);
				currentPlayer.hand[cardIndex] = currentCard;
				currentCard = switchCard;
				discardPile.push(switchCard);
				playerMoving = false;
			}
			else{
				console.log("invalid move! try again!");
			}
		}
		isWinner = checkWinner(currentPlayer.hand);
		turn++;
	}
	console.log(currentPlayer.name + " wins this round!");
	currentPlayer.points += 75;
	//need to add points for the other player(s)
}

function game(){
	let drawPile, discardPile;
	let player1, player2;
	[drawPile, discardPile, player1, player2] = gameCreation();
	console.log("Game created!");
	let winner = false;
	let winners = [];
	while(!winner){
		play(drawPile, discardPile, player1, player2);
		winners = checkForWinners([player1, player2]);
		if(winners.length > 0){
			if(winners.length = 1){
				console.log(`${winners[0].name} wins the game!`);
			}
			else{
				let str = "";
				for(let i = 0; i < winners.length; i++){
					if(i === winners.length-1){
						str += winners[i].name;
					}
					else{
						str += `${winners[i].name} and `;
					}
				}
				console.log(`${str} win the game!`);
			}
			winner = true;
		}
	}
}