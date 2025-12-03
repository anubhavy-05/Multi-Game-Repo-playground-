// Game configuration
const CONFIG = {
    gridSize: 20,
    canvasSize: 400,
    initialSpeed: 150,
    speedMultiplier: 0.95,
    minSpeed: 50,
    pointsPerFood: 10
};

// Game state
let gameState = {
    snake: [],
    direction: { x: 0, y: 0 },
    nextDirection: { x: 0, y: 0 },
    food: { x: 0, y: 0 },
    score: 0,
    highScore: 0,
    gameLoop: null,
    speed: CONFIG.initialSpeed,
    isRunning: false,
    isPaused: false,
    hasStarted: false
};

// DOM elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const finalScoreElement = document.getElementById('finalScore');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOver');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const controlButtons = document.querySelectorAll('.control-btn');

// Set canvas size
canvas.width = CONFIG.canvasSize;
canvas.height = CONFIG.canvasSize;

// Initialize game
function init() {
    loadHighScore();
    updateHighScoreDisplay();
    
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', restartGame);
    
    // Keyboard controls
    document.addEventListener('keydown', handleKeyPress);
    
    // Touch controls
    controlButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const direction = btn.dataset.direction;
            handleControlButton(direction);
        });
    });
}

// Start game
function startGame() {
    resetGame();
    startScreen.classList.add('hidden');
    gameState.isRunning = true;
    draw();
}

// Restart game
function restartGame() {
    gameOverScreen.classList.add('hidden');
    startGame();
}

// Reset game state
function resetGame() {
    const center = Math.floor(CONFIG.canvasSize / CONFIG.gridSize / 2);
    
    gameState.snake = [
        { x: center, y: center },
        { x: center - 1, y: center },
        { x: center - 2, y: center }
    ];
    
    gameState.direction = { x: 0, y: 0 };
    gameState.nextDirection = { x: 0, y: 0 };
    gameState.score = 0;
    gameState.speed = CONFIG.initialSpeed;
    gameState.isPaused = false;
    gameState.hasStarted = false;
    
    updateScore();
    generateFood();
}

// Main game loop
function gameLoop() {
    if (!gameState.isRunning) return;
    
    if (!gameState.hasStarted) {
        setTimeout(() => gameLoop(), gameState.speed);
        return;
    }
    
    gameState.direction = { ...gameState.nextDirection };
    
    const head = { ...gameState.snake[0] };
    head.x += gameState.direction.x;
    head.y += gameState.direction.y;
    
    // Check collisions
    if (checkCollision(head)) {
        gameOver();
        return;
    }
    
    gameState.snake.unshift(head);
    
    // Check if food is eaten
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
        eatFood();
    } else {
        gameState.snake.pop();
    }
    
    draw();
    
    setTimeout(() => {
        gameLoop();
    }, gameState.speed);
}

// Check collisions
function checkCollision(head) {
    const gridCount = CONFIG.canvasSize / CONFIG.gridSize;
    
    // Wall collision
    if (head.x < 0 || head.x >= gridCount || head.y < 0 || head.y >= gridCount) {
        return true;
    }
    
    // Self collision
    for (let i = 0; i < gameState.snake.length; i++) {
        if (head.x === gameState.snake[i].x && head.y === gameState.snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// Generate food
function generateFood() {
    const gridCount = CONFIG.canvasSize / CONFIG.gridSize;
    let newFood;
    
    do {
        newFood = {
            x: Math.floor(Math.random() * gridCount),
            y: Math.floor(Math.random() * gridCount)
        };
    } while (isOnSnake(newFood));
    
    gameState.food = newFood;
}

// Check if position is on snake
function isOnSnake(pos) {
    return gameState.snake.some(segment => 
        segment.x === pos.x && segment.y === pos.y
    );
}

// Eat food
function eatFood() {
    gameState.score += CONFIG.pointsPerFood;
    updateScore();
    
    // Increase speed (multiply by 0.95 to get faster)
    if (gameState.speed > CONFIG.minSpeed) {
        gameState.speed = Math.max(CONFIG.minSpeed, gameState.speed * CONFIG.speedMultiplier);
    }
    
    generateFood();
}

// Draw game
function draw() {
    // Clear canvas
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, CONFIG.canvasSize, CONFIG.canvasSize);
    
    // Draw grid
    drawGrid();
    
    // Draw snake
    drawSnake();
    
    // Draw food
    drawFood();
    
    // Draw start message if not started
    if (!gameState.hasStarted && gameState.isRunning) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press any arrow to start!', CONFIG.canvasSize / 2, CONFIG.canvasSize / 2 - 40);
    }
}

// Draw grid
function drawGrid() {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= CONFIG.canvasSize; i += CONFIG.gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CONFIG.canvasSize);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CONFIG.canvasSize, i);
        ctx.stroke();
    }
}

// Draw snake
function drawSnake() {
    gameState.snake.forEach((segment, index) => {
        const x = segment.x * CONFIG.gridSize;
        const y = segment.y * CONFIG.gridSize;
        
        // Gradient for snake body
        const gradient = ctx.createLinearGradient(x, y, x + CONFIG.gridSize, y + CONFIG.gridSize);
        
        if (index === 0) {
            // Head
            gradient.addColorStop(0, '#4CAF50');
            gradient.addColorStop(1, '#45a049');
        } else {
            // Body
            gradient.addColorStop(0, '#8BC34A');
            gradient.addColorStop(1, '#7CB342');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x + 1, y + 1, CONFIG.gridSize - 2, CONFIG.gridSize - 2);
        
        // Eyes on head
        if (index === 0) {
            ctx.fillStyle = 'white';
            const eyeSize = 4;
            const eyeOffset = 5;
            
            if (gameState.direction.x === 1) { // Right
                ctx.fillRect(x + CONFIG.gridSize - eyeOffset - eyeSize, y + 4, eyeSize, eyeSize);
                ctx.fillRect(x + CONFIG.gridSize - eyeOffset - eyeSize, y + CONFIG.gridSize - 8, eyeSize, eyeSize);
            } else if (gameState.direction.x === -1) { // Left
                ctx.fillRect(x + eyeOffset, y + 4, eyeSize, eyeSize);
                ctx.fillRect(x + eyeOffset, y + CONFIG.gridSize - 8, eyeSize, eyeSize);
            } else if (gameState.direction.y === 1) { // Down
                ctx.fillRect(x + 4, y + CONFIG.gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
                ctx.fillRect(x + CONFIG.gridSize - 8, y + CONFIG.gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
            } else { // Up
                ctx.fillRect(x + 4, y + eyeOffset, eyeSize, eyeSize);
                ctx.fillRect(x + CONFIG.gridSize - 8, y + eyeOffset, eyeSize, eyeSize);
            }
        }
    });
}

// Draw food
function drawFood() {
    const x = gameState.food.x * CONFIG.gridSize;
    const y = gameState.food.y * CONFIG.gridSize;
    
    // Food gradient
    const gradient = ctx.createRadialGradient(
        x + CONFIG.gridSize / 2, 
        y + CONFIG.gridSize / 2, 
        2,
        x + CONFIG.gridSize / 2, 
        y + CONFIG.gridSize / 2, 
        CONFIG.gridSize / 2
    );
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(1, '#ee5a6f');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(
        x + CONFIG.gridSize / 2,
        y + CONFIG.gridSize / 2,
        CONFIG.gridSize / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // Food shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(
        x + CONFIG.gridSize / 2 - 3,
        y + CONFIG.gridSize / 2 - 3,
        3,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Handle keyboard input
function handleKeyPress(e) {
    if (!gameState.isRunning) return;
    
    const key = e.key;
    let directionChanged = false;
    
    switch(key) {
        case 'ArrowUp':
            if (gameState.direction.y === 0) {
                gameState.nextDirection = { x: 0, y: -1 };
                directionChanged = true;
            }
            e.preventDefault();
            break;
        case 'ArrowDown':
            if (gameState.direction.y === 0) {
                gameState.nextDirection = { x: 0, y: 1 };
                directionChanged = true;
            }
            e.preventDefault();
            break;
        case 'ArrowLeft':
            if (gameState.direction.x === 0) {
                gameState.nextDirection = { x: -1, y: 0 };
                directionChanged = true;
            }
            e.preventDefault();
            break;
        case 'ArrowRight':
            if (gameState.direction.x === 0) {
                gameState.nextDirection = { x: 1, y: 0 };
                directionChanged = true;
            }
            e.preventDefault();
            break;
    }
    
    // Start game on first arrow press
    if (directionChanged && !gameState.hasStarted) {
        gameState.hasStarted = true;
        gameLoop();
    }
}

// Handle control button clicks
function handleControlButton(direction) {
    if (!gameState.isRunning) return;
    
    let directionChanged = false;
    
    switch(direction) {
        case 'up':
            if (gameState.direction.y === 0) {
                gameState.nextDirection = { x: 0, y: -1 };
                directionChanged = true;
            }
            break;
        case 'down':
            if (gameState.direction.y === 0) {
                gameState.nextDirection = { x: 0, y: 1 };
                directionChanged = true;
            }
            break;
        case 'left':
            if (gameState.direction.x === 0) {
                gameState.nextDirection = { x: -1, y: 0 };
                directionChanged = true;
            }
            break;
        case 'right':
            if (gameState.direction.x === 0) {
                gameState.nextDirection = { x: 1, y: 0 };
                directionChanged = true;
            }
            break;
    }
    
    // Start game on first button press
    if (directionChanged && !gameState.hasStarted) {
        gameState.hasStarted = true;
        gameLoop();
    }
}

// Update score display
function updateScore() {
    scoreElement.textContent = gameState.score;
    
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        saveHighScore();
        updateHighScoreDisplay();
    }
}

// Update high score display
function updateHighScoreDisplay() {
    highScoreElement.textContent = gameState.highScore;
}

// Save high score to localStorage
function saveHighScore() {
    localStorage.setItem('wormGameHighScore', gameState.highScore);
}

// Load high score from localStorage
function loadHighScore() {
    const saved = localStorage.getItem('wormGameHighScore');
    gameState.highScore = saved ? parseInt(saved) : 0;
}

// Game over
function gameOver() {
    gameState.isRunning = false;
    finalScoreElement.textContent = gameState.score;
    gameOverScreen.classList.remove('hidden');
}

// Initialize game when page loads
init();
