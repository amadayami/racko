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
	}
	create(){
		const cell = new Path2D();
		cell.rect(this.x, this.y, this.w, this.h);
		
		ctx.fillStyle = "white";
		ctx.fill(cell);
		
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.stroke(cell);
	}
	select(){
		this.selected = true;
	}
}



function drawValue(posx, posy, value){
	ctx.font = "28px Atkinson-Bold";
	ctx.fillStyle = "black";
	ctx.fillText(value, posx, posy);
}

//draws first row for standard racko
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
