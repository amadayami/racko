const canvas = document.getElementById("rackoCanvas");
const ctx = canvas.getContext("2d");
var w = window.innerWidth;
var h = window.innerHeight;

ctx.canvas.width = window.innerWidth * 0.9;
ctx.canvas.height = window.innerHeight;

function drawCard(posx, posy, width, height){
	ctx.fillStyle = "white";
	ctx.fillRect(posx, posy, width, height);
	ctx.lineWidth = 2;
	ctx.strokeStyle = "black";
	ctx.strokeRect(posx, posy, width, height);
}
function drawValue(posx, posy, value){
	ctx.font = "28px Atkinson-Bold";
	ctx.fillStyle = "black";
	ctx.fillText(value, posx, posy);
}

let cardBaseWidth = canvas.width/12;
let cardBaseHeight = cardBaseWidth*1.5;
drawCard(canvas.width/2-100-5, 10, cardBaseWidth, cardBaseHeight);
drawCard(canvas.width/2 + 5, 10, cardBaseWidth, cardBaseHeight);

//draws first row for standard racko
for(let i = 1; i <=10; i++){
	let posx = cardBaseWidth * i;
	ctx.beginPath();
	drawCard(posx, 165, cardBaseWidth, cardBaseHeight);
	drawValue(posx+10, 195, i);
}
//draws second row for double racko
for(let i = 1; i <=10; i++){
	let posx = cardBaseWidth * i;
	ctx.beginPath();
	drawCard(posx, 165+cardBaseHeight+10, cardBaseWidth, cardBaseHeight);
	drawValue(posx+10, 195+cardBaseHeight+10, i);
}