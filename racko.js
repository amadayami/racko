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
function dealCards(hand, deck, handLength){
	for(let i = 0; i < handLength; i++){
		let randInd = Math.floor(Math.random()*(deck.length));
		hand[i] = deck[randInd];
		deck.splice(randInd, 1);
	}
	return [hand, deck];
}

//this is a simplified way of how i approach the game
function computerMove(hand, discard, draw){
	let slot;
	
	let currentCard;
	if(draw.length === 0){
		[draw, discard] = [discard, draw];
		draw = draw.shuffle(draw);
		currentCard = draw.pop();
		console.log("New card drawn: " + currentCard);
	}
	else if(discard.length === 0){
		currentCard = draw.pop();
		console.log("New card drawn: " + currentCard);
	}
	else{
		//the computer checks for a spot for the discard card, else draws
		currentCard = discard.pop();
		slot = Math.ceil(currentCard/6);
		//checks to see if the slot is already filled by a card in the appropriate slot
		if(Math.ceil(hand[slot-1]/6) === slot){
			//if the spot is filled, then we check the surrounding spots
			if(slot-2 >= 0 && currentCard < hand[slot-1] && Math.ceil(hand[slot-2]/6) !== slot-1){
				console.log("below free");
				let switchCard = hand[slot-2];
				hand[slot-2] = currentCard;
				discard.push(switchCard);
				console.log(`Updated hand: ${hand}`);
				return [hand, discard, draw];
			}
			else if(slot <= hand.length-1 && currentCard > hand[slot-1] && Math.ceil(hand[slot]/6) !== slot+1){
				console.log("above free");
				let switchCard = hand[slot];
				hand[slot] = currentCard;
				discard.push(switchCard);
				console.log(`Updated hand: ${hand}`);
				return [hand, discard, draw];
			}
			
			//else we get a new card from the draw pile
			discard.push(currentCard);
			currentCard = draw.pop();
			console.log("New card drawn: " + currentCard);
		}
		else{
			//put the current card in the hand and put the switched card into the discard pile
			let switchCard = hand[slot-1];
			hand[slot-1] = currentCard;
			discard.push(switchCard);
			console.log(`Updated hand: ${hand}`);
			return [hand, discard, draw];
		}
	}
	//current card is recently drawn
	slot = Math.ceil(currentCard/6);
	if(Math.ceil(hand[slot-1]/6) === slot){
		if(slot-2 >= 0 && currentCard < hand[slot-1] && Math.ceil(hand[slot-2]/6 !== slot-1)){
			let switchCard = hand[slot-2];
			hand[slot-2] = currentCard;
			discard.push(switchCard);
		}
		else if(slot <= hand.length-1 && currentCard > hand[slot-1] && Math.ceil(hand[slot]/6 !== slot+1)){
			let switchCard = hand[slot];
			hand[slot] = currentCard;
			discard.push(switchCard);
		}
		else discard.push(currentCard);
	}
	else{
		let switchCard = hand[slot-1];
		hand[slot-1] = currentCard;
		discard.push(switchCard);
	}
	console.log(`Updated hand: ${hand}`);
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
	
	let gameType = prompt("Would you like to play standard or double Racko?", "standard")
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
	
	let players = prompt("How many players today?", 2);
	if(players < 2){
		console.log("Need at least 2 players!");
		return;
	}
	else if(players > 4){
		console.log("Max players is 4");
		return;
	}
	else if(players === 0){
		console.log("No one wins :(");
		return;
	}
	else{
		console.log("Great!");
	}
	
	let playersArray = [];
	for(let i = 1; i <= players; i++){
		let playerName = prompt("What is player " + i + "'s name?");
		let computer = prompt("Are they a computer? (y/n)");
		if(computer === "yes" || computer === "y"){
			playersArray.push(createPlayer(true, playerName, Array(handLength)));
		}
		else{
			playersArray.push(createPlayer(false, playerName, Array(handLength)));
		}
	}
	
	const isComputerPlayer = (player) => player.isComputer === true;
	if(playersArray.every(isComputerPlayer)){
		console.log("Have to have at least one human!");
		return;
	}
	
	return [playDeck, discardPile, playersArray];
}

function boardToString(player, discard, draw){
	//i want to display the player's hand, the top card on the
	//discard pile, and the number of cards in the play deck
	let dd;
	if(discard.length == 0){
		dd = 'x';
	}
	else dd = discard[discard.length-1];
	return `Player: ${player.name} | Points: ${player.points}\nDiscard: ${dd} | Cards in draw: ${draw.length} | Cards in discard: ${discard.length}\nYour hand: ${player.hand}`;
}

function play(drawPile, discardPile, players){
	console.log("Resetting deck...");
	[players, drawPile, discardPile] = resetBoard(players, drawPile, discardPile);
	console.log("Dealing cards...");
	let h = (drawPile.length)/6;
	for(player of players){
		[player.hand, drawPile] = dealCards(player.hand, drawPile, h);
	}
	let isWinner = false;
	let winner;
	let turn = 0;
	let currentPlayer;
	while(!isWinner){
		currentPlayer = players[turn%players.length]
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
	return [drawPile, discardPile, players];
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

function game(){
	let drawPile, discardPile;
	let players;
	[drawPile, discardPile, players] = gameCreation();
	console.log("Game created!");
	let winner = false;
	let winners = [];
	while(!winner){
		[drawPile, discardPile, players] = play(drawPile, discardPile, players);
		winners = checkForWinners(players);
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