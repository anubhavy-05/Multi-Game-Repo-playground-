// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let bird = {
    x: 50,
    y: 300,
    width: 34,
    height: 24,
    velocity: 0,
    gravity: 0.5,
    jump: -9
};

let pipes = [];
let score = 0;
let highScore = localStorage.getItem('flappyHighScore') || 0;
let gameOver = false;
let gameStarted = false;
let frameCount = 0;

// Game constants
const PIPE_WIDTH = 60;
const PIPE_GAP = 180;
const PIPE_SPEED = 2.5;
const PIPE_FREQUENCY = 100; // frames between pipes

// Update high score display
document.getElementById('highScore').textContent = highScore;

// Bird drawing
function drawBird() {
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(bird.x + bird.width/2, bird.y + bird.height/2, bird.width/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(bird.x + bird.width - 8, bird.y + bird.height/2 - 3, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Beak
    ctx.fillStyle = '#FF6347';
    ctx.beginPath();
    ctx.moveTo(bird.x + bird.width, bird.y + bird.height/2);
    ctx.lineTo(bird.x + bird.width + 8, bird.y + bird.height/2 - 3);
    ctx.lineTo(bird.x + bird.width + 8, bird.y + bird.height/2 + 3);
    ctx.closePath();
    ctx.fill();
}

// Pipe creation
function createPipe() {
    const minHeight = 50;
    const maxHeight = canvas.height - PIPE_GAP - minHeight - 100;
    const height = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
    
    pipes.push({
        x: canvas.width,
        topHeight: height,
        bottomY: height + PIPE_GAP,
        scored: false
    });
}

// Draw pipes
function drawPipes() {
    ctx.fillStyle = '#228B22';
    
    pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        // Pipe cap
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, PIPE_WIDTH + 10, 20);
        
        // Bottom pipe
        const bottomHeight = canvas.height - pipe.bottomY;
        ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, bottomHeight);
        // Pipe cap
        ctx.fillRect(pipe.x - 5, pipe.bottomY, PIPE_WIDTH + 10, 20);
    });
}

// Update pipes
function updatePipes() {
    // Create new pipes
    if (frameCount % PIPE_FREQUENCY === 0 && gameStarted) {
        createPipe();
    }
    
    // Move and check pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];
        pipe.x -= PIPE_SPEED;
        
        // Remove off-screen pipes
        if (pipe.x + PIPE_WIDTH < 0) {
            pipes.splice(i, 1);
            continue;
        }
        
        // Score when passing pipe
        if (!pipe.scored && pipe.x + PIPE_WIDTH < bird.x) {
            pipe.scored = true;
            score++;
            document.getElementById('score').textContent = score;
            
            // Update high score
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('flappyHighScore', highScore);
                document.getElementById('highScore').textContent = highScore;
            }
        }
    }
}

// Collision detection
function checkCollision() {
    // Ground and ceiling collision
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        return true;
    }
    
    // Pipe collision
    for (let pipe of pipes) {
        if (bird.x + bird.width > pipe.x && 
            bird.x < pipe.x + PIPE_WIDTH) {
            if (bird.y < pipe.topHeight || 
                bird.y + bird.height > pipe.bottomY) {
                return true;
            }
        }
    }
    
    return false;
}

// Update bird physics
function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
}

// Draw game over screen
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width/2, canvas.height/2 - 40);
    
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2 + 10);
    ctx.fillText(`High Score: ${highScore}`, canvas.width/2, canvas.height/2 + 45);
    
    ctx.font = '18px Arial';
    ctx.fillText('Press R to Restart', canvas.width/2, canvas.height/2 + 90);
}

// Draw start screen
function drawStartScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Press SPACE or Click', canvas.width/2, canvas.height/2 - 20);
    ctx.fillText('to Start!', canvas.width/2, canvas.height/2 + 20);
}

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (!gameStarted) {
        drawBird();
        drawStartScreen();
        requestAnimationFrame(gameLoop);
        return;
    }
    
    if (!gameOver) {
        frameCount++;
        
        updateBird();
        updatePipes();
        
        // Check collision
        if (checkCollision()) {
            gameOver = true;
        }
        
        // Draw everything
        drawPipes();
        drawBird();
    } else {
        // Draw game over screen
        drawPipes();
        drawBird();
        drawGameOver();
    }
    
    requestAnimationFrame(gameLoop);
// Make bird jump
function jump() {
    if (!gameStarted) {
        gameStarted = true;
        // Create first pipe immediately when game starts
        createPipe();
    }
    
    if (!gameOver) {
        bird.velocity = bird.jump;
    }
}       bird.velocity = bird.jump;
    }
// Reset game
function resetGame() {
    bird.y = 300;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    gameStarted = false;
    frameCount = 0;
    document.getElementById('score').textContent = score;
}   frameCount = 0;
    document.getElementById('score').textContent = score;
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        jump();
    } else if (e.code === 'KeyR') {
        resetGame();
    }
});

canvas.addEventListener('click', () => {
    jump();
});

// Button controls - Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const flapBtn = document.getElementById('flapBtn');
    const restartBtnControl = document.getElementById('restartBtnControl');

    if (flapBtn) {
        flapBtn.addEventListener('click', (e) => {
            e.preventDefault();
            jump();
        });
        
        flapBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            jump();
        });
    }

    if (restartBtnControl) {
        restartBtnControl.addEventListener('click', (e) => {
            e.preventDefault();
            resetGame();
        });
        
        restartBtnControl.addEventListener('touchstart', (e) => {
            e.preventDefault();
            resetGame();
        });
    }
});

// Start game loop
gameLoop();
