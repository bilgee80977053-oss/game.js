const canvas = document.getElementById("gameCanvas");
canvas.addEventListener("touchstart",(e)=>{
    e.preventDefault();
    jump();
});
const ctx = canvas.getContext("2d");

// UI
const scoreValue = document.getElementById("scoreValue");
const timeValue = document.getElementById("timeValue");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const winnerScreen = document.getElementById("winnerScreen");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

// Game variables
let gameRunning = false;
let score = 0;
let time = 30;
let timer;

// Bird
const bird = {
    x:80,
    y:300,
    width:35,
    height:35,
    gravity:0.45,
    velocity:0,
    jumpPower:-8
};

// Pipes
let pipes = [];
let pipeTimer = 0;
const pipeWidth = 70;
const pipeGap = 180;
const pipeSpeed = 2.5;

// Controls
function jump(){
    if(gameRunning){
        bird.velocity = bird.jumpPower;
    }
}

document.addEventListener("keydown",(e)=>{
    if(e.code==="Space"){
        jump();
    }
});

canvas.addEventListener("click",()=>{
    jump();
});

// Start Game
function startGame(){
    startScreen.style.display="none";
    gameOverScreen.style.display="none";
    winnerScreen.style.display="none";

    score=0;
    time=10;
    pipes=[];
    pipeTimer=0;

    scoreValue.innerHTML=score;
    timeValue.innerHTML=time;

    bird.y=300;
    bird.velocity=0;

    gameRunning=true;

    timer=setInterval(()=>{
        time--;
        timeValue.innerHTML=time;

        if(time<=0){
            winGame();
        }
    },1000);

    gameLoop();
}

// Game loop
function gameLoop(){
    if(!gameRunning) return;

    update();
    draw();

    requestAnimationFrame(gameLoop);
}

// Update physics
function update(){
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Pipes
    pipeTimer++;
    if(pipeTimer > 90){
        createPipe();
        pipeTimer = 0;
    }

    pipes.forEach(pipe=>{
        pipe.x -= pipeSpeed;

        // Score
        if(!pipe.passed && pipe.x + pipeWidth < bird.x){
            pipe.passed=true;
            score++;
            scoreValue.innerHTML=score;
        }

        // Collision
        if(
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
        ){
            endGame();
        }
    });

    // Remove old pipes
    pipes = pipes.filter(pipe=>pipe.x+pipeWidth>0);

    // Ground collision
    if(bird.y + bird.height >= canvas.height){
        endGame();
    }

    // Top collision
    if(bird.y <=0){
        bird.y=0;
        bird.velocity=0;
    }
}

// Draw
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Pipes
    ctx.fillStyle="#00b894";
    pipes.forEach(pipe=>{
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height);
    });

    // Bird shadow
    ctx.fillStyle="rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.arc(bird.x+18, bird.y+20, 20, 0, Math.PI*2);
    ctx.fill();

    // Bird
    ctx.fillStyle="#ffd93d";
    ctx.beginPath();
    ctx.arc(bird.x+18, bird.y+18, 18, 0, Math.PI*2);
    ctx.fill();

    // Eye
    ctx.fillStyle="black";
    ctx.beginPath();
    ctx.arc(bird.x+25, bird.y+12, 4, 0, Math.PI*2);
    ctx.fill();
}

function createPipe(){
    let minHeight = 80;
    let maxHeight = 350;

    let topHeight = Math.floor(Math.random() * (maxHeight-minHeight) + minHeight);

    pipes.push({
        x:canvas.width,
        top:topHeight,
        bottom:topHeight + pipeGap,
        passed:false
    });
}

// Game over
function endGame(){
    gameRunning=false;
    clearInterval(timer);
    gameOverScreen.style.display="flex";
}

// Winner
function winGame(){
    gameRunning=false;
    clearInterval(timer);
    winnerScreen.style.display="flex";
}

// Buttons
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);