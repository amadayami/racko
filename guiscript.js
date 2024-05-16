const canvas = document.getElementById("rackoCanvas");
const ctx = canvas.getContext("2d");
let w = window.innerWidth;
let h = window.innerHeight;

ctx.canvas.width = window.innerWidth * 0.9;
ctx.canvas.height = window.innerHeight;

function drawCard(posx, posy, width, height){
	ctx.fillStyle = "white";
	ctx.fillRect(posx, posy, width, height);
	ctx.lineWidth = 2;
	ctx.strokeStyle = "black";
	ctx.strokeRect(posx, posy, width, height);
}
let cardBaseWidth = canvas.width/12;
let cardBaseHeight = cardBaseWidth*1.5;
drawCard(canvas.width/2-100-5, 10, cardBaseWidth, cardBaseHeight);
drawCard(canvas.width/2 + 5, 10, cardBaseWidth, cardBaseHeight);

//draws first row for standard racko
for(let i = 1; i <=10; i++){
	let posx = cardBaseWidth * i;
	ctx.beginPath();
	drawCard(posx, 160, cardBaseWidth, cardBaseHeight);
}
//draws second row for double racko
for(let i = 1; i <=10; i++){
	let posx = cardBaseWidth * i;
	ctx.beginPath();
	drawCard(posx, 160+cardBaseHeight, cardBaseWidth, cardBaseHeight);
}