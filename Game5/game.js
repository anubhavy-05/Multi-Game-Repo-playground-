// Canvas setup
const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next');
const nextCtx = nextCanvas.getContext('2d');

// Game constants
const BLOCK_SIZE = 30;
const ROWS = 20;
const COLS = 10;
const COLORS = [
    null,
    '#FF0D72', // I
    '#0DC2FF', // J
    '#0DFF72', // L
    '#F538FF', // O
    '#FF8E0D', // S
    '#FFE138', // T
    '#3877FF'  // Z
];

// Tetromino shapes
const SHAPES = [
    [],
    [[1, 1, 1, 1]], // I
    [[2, 0, 0], [2, 2, 2]], // J
    [[0, 0, 3], [3, 3, 3]], // L
    [[4, 4], [4, 4]], // O
    [[0, 5, 5], [5, 5, 0]], // S
    [[0, 6, 0], [6, 6, 6]], // T
    [[7, 7, 0], [0, 7, 7]]  // Z
];

// Game state
let board = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let level = 1;
let lines = 0;
let gameRunning = false;
let gamePaused = false;
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

// DOM elements
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const linesElement = document.getElementById('lines');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const gameOverDiv = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const playAgainBtn = document.getElementById('playAgainBtn');

// Initialize board
function createBoard() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

// Create piece
function createPiece(type) {
    return {
        shape: SHAPES[type],
        type: type,
        pos: { x: Math.floor(COLS / 2) - Math.floor(SHAPES[type][0].length / 2), y: 0 }
    };
}

// Get random piece
function randomPiece() {
    return createPiece(Math.floor(Math.random() * 7) + 1);
}

// Draw block
function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// Draw board
function drawBoard() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value > 0) {
                drawBlock(x, y, COLORS[value]);
            }
        });
    });
}

// Draw piece
function drawPiece(piece, context, offsetX = 0, offsetY = 0) {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value > 0) {
                const posX = piece.pos.x + x + offsetX;
                const posY = piece.pos.y + y + offsetY;
                context.fillStyle = COLORS[value];
                context.fillRect(posX * BLOCK_SIZE, posY * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                context.strokeStyle = '#000';
                context.lineWidth = 2;
                context.strokeRect(posX * BLOCK_SIZE, posY * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

// Draw next piece
function drawNextPiece() {
    nextCtx.fillStyle = '#000';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    if (nextPiece) {
        const tempPiece = {
            shape: nextPiece.shape,
            type: nextPiece.type,
            pos: { 
                x: Math.floor((nextCanvas.width / BLOCK_SIZE - nextPiece.shape[0].length) / 2),
                y: Math.floor((nextCanvas.height / BLOCK_SIZE - nextPiece.shape.length) / 2)
            }
        };
        drawPiece(tempPiece, nextCtx);
    }
}

// Collision detection
function collide(piece, offset = { x: 0, y: 0 }) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x] !== 0) {
                const newX = piece.pos.x + x + offset.x;
                const newY = piece.pos.y + y + offset.y;
                
                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    return true;
                }
                if (newY >= 0 && board[newY][newX] !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Merge piece to board
function merge() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value > 0) {
                const boardY = currentPiece.pos.y + y;
                const boardX = currentPiece.pos.x + x;
                if (boardY >= 0) {
                    board[boardY][boardX] = value;
                }
            }
        });
    });
}

// Clear lines
function clearLines() {
    let linesCleared = 0;
    
    outer: for (let y = ROWS - 1; y >= 0; y--) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x] === 0) {
                continue outer;
            }
        }
        
        board.splice(y, 1);
        board.unshift(Array(COLS).fill(0));
        linesCleared++;
        y++;
    }
    
    if (linesCleared > 0) {
        lines += linesCleared;
        score += [0, 100, 300, 500, 800][linesCleared] * level;
        level = Math.floor(lines / 10) + 1;
        dropInterval = 1000 - (level - 1) * 100;
        if (dropInterval < 100) dropInterval = 100;
        
        updateScore();
    }
}

// Rotate piece
function rotate(piece) {
    const newShape = piece.shape[0].map((_, i) =>
        piece.shape.map(row => row[i]).reverse()
    );
    
    const rotatedPiece = {
        shape: newShape,
        type: piece.type,
        pos: { ...piece.pos }
    };
    
    if (!collide(rotatedPiece)) {
        return rotatedPiece;
    }
    
    // Wall kick
    for (let offset = 1; offset <= 2; offset++) {
        rotatedPiece.pos.x = piece.pos.x - offset;
        if (!collide(rotatedPiece)) return rotatedPiece;
        
        rotatedPiece.pos.x = piece.pos.x + offset;
        if (!collide(rotatedPiece)) return rotatedPiece;
        
        rotatedPiece.pos.x = piece.pos.x;
    }
    
    return piece;
}

// Move piece
function move(dir) {
    if (!gameRunning || gamePaused) return;
    
    currentPiece.pos.x += dir;
    if (collide(currentPiece)) {
        currentPiece.pos.x -= dir;
    }
}

// Drop piece
function drop() {
    if (!gameRunning || gamePaused) return;
    
    currentPiece.pos.y++;
    if (collide(currentPiece)) {
        currentPiece.pos.y--;
        merge();
        clearLines();
        spawnPiece();
        
        if (collide(currentPiece)) {
            gameOver();
        }
    }
    dropCounter = 0;
}

// Hard drop
function hardDrop() {
    if (!gameRunning || gamePaused) return;
    
    while (!collide(currentPiece, { x: 0, y: 1 })) {
        currentPiece.pos.y++;
        score += 2;
    }
    drop();
    updateScore();
}

// Spawn new piece
function spawnPiece() {
    currentPiece = nextPiece || randomPiece();
    nextPiece = randomPiece();
    drawNextPiece();
}

// Update score display
function updateScore() {
    scoreElement.textContent = score;
    levelElement.textContent = level;
    linesElement.textContent = lines;
}

// Game over
function gameOver() {
    gameRunning = false;
    gamePaused = false;
    finalScoreElement.textContent = score;
    gameOverDiv.classList.remove('hidden');
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

// Start game
function startGame() {
    createBoard();
    score = 0;
    level = 1;
    lines = 0;
    dropInterval = 1000;
    updateScore();
    
    nextPiece = randomPiece();
    spawnPiece();
    
    gameRunning = true;
    gamePaused = false;
    gameOverDiv.classList.add('hidden');
    
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    
    lastTime = performance.now();
    requestAnimationFrame(update);
}

// Pause game
function togglePause() {
    if (!gameRunning) return;
    
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
    
    if (!gamePaused) {
        lastTime = performance.now();
        requestAnimationFrame(update);
    }
}

/