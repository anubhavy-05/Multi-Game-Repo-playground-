// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 40;
const ALIEN_WIDTH = 40;
const ALIEN_HEIGHT = 30;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 15;
const SHIELD_WIDTH = 80;
const SHIELD_HEIGHT = 60;

// Game state
let gameRunning = false;
let gamePaused = false;
let score = 0;
let level = 1;
let lives = 3;
let highScore = localStorage.getItem('spaceInvadersHighScore') || 0;

// Player
let player = {
    x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: CANVAS_HEIGHT - PLAYER_HEIGHT - 20,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    speed: 5
};

// Bullets
let playerBullets = [];
let alienBullets = [];
const BULLET_SPEED = 7;
const ALIEN_BULLET_SPEED = 4;

// Aliens
let aliens = [];
let alienDirection = 1;
let alienSpeed = 1;
let alienDropDistance = 20;

// Mystery ship
let mysteryShip = null;
const MYSTERY_SHIP_SPEED = 2;
const MYSTERY_SHIP_POINTS = [50, 100, 150, 200];

// Shields
let shields = [];

// Keys
let keys = {};

// DOM elements
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const livesElement = document.getElementById('lives');
const highScoreElement = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const gameOverDiv = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');
const levelCompleteDiv = document.getElementById('levelComplete');
const levelScoreElement = document.getElementById('levelScore');
const nextLevelBtn = document.getElementById('nextLevelBtn');

// Initialize
highScoreElement.textContent = highScore;

// Event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
resetBtn.addEventListener('click', resetGame);
restartBtn.addEventListener('click', () => {
    gameOverDiv.classList.add('hidden');
    resetGame();
    startGame();
});
nextLevelBtn.addEventListener('click', () => {
    levelCompleteDiv.classList.add('hidden');
    nextLevel();
});

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ' && gameRunning && !gamePaused) {
        e.preventDefault();
        shootBullet();
    }
    if (e.key === 'p' || e.key === 'P') {
        if (gameRunning) togglePause();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Initialize game
function initGame() {
    player.x = CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2;
    playerBullets = [];
    alienBullets = [];
    mysteryShip = null;
    createAliens();
    createShields();
}

// Create aliens
function createAliens() {
    aliens = [];
    const rows = 5;
    const cols = 11;
    const startX = 50;
    const startY = 50;
    const spacingX = 60;
    const spacingY = 50;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            aliens.push({
                x: startX + col * spacingX,
                y: startY + row * spacingY,
                width: ALIEN_WIDTH,
                height: ALIEN_HEIGHT,
                type: row < 1 ? 3 : row < 3 ? 2 : 1,
                alive: true
            });
        }
    }
    alienSpeed = 1 + (level - 1) * 0.3;
}

// Create shields
function createShields() {
    shields = [];
    const numShields = 4;
    const shieldY = CANVAS_HEIGHT - 150;
    const spacing = CANVAS_WIDTH / (numShields + 1);

    for (let i = 0; i < numShields; i++) {
        shields.push({
            x: spacing * (i + 1) - SHIELD_WIDTH / 2,
            y: shieldY,
            width: SHIELD_WIDTH,
            height: SHIELD_HEIGHT,
            health: 10
        });
    }
}

// Start game
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gamePaused = false;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        initGame();
        gameLoop();
    }
}

// Toggle pause
function togglePause() {
    if (gameRunning) {
        gamePaused = !gamePaused;
        pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
        if (!gamePaused) {
            gameLoop();
        }
    }
}

// Reset game
function resetGame() {
    gameRunning = false;
    gamePaused = false;
    score = 0;
    level = 1;
    lives = 3;
    alienDirection = 1;
    updateUI();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
    initGame();
    draw();
}

// Next level
function nextLevel() {
    level++;
    updateUI();
    initGame();
    gameRunning = true;
    gameLoop();
}

// Shoot bullet
function shootBullet() {
    if (playerBullets.length < 3) {
        playerBullets.push({
            x: player.x + player.width / 2 - BULLET_WIDTH / 2,
            y: player.y,
            width: BULLET_WIDTH,
            height: BULLET_HEIGHT
        });
    }
}

// Alien shoots
function alienShoot() {
    const aliveAliens = aliens.filter(a => a.alive);
    if (aliveAliens.length > 0 && Math.random() < 0.02) {
        const shooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
        alienBullets.push({
            x: shooter.x + shooter.width / 2 - BULLET_WIDTH / 2,
            y: shooter.y + shooter.height,
            width: BULLET_WIDTH,
            height: BULLET_HEIGHT
        });
    }
}

// Spawn mystery ship
function spawnMysteryShip() {
    if (!mysteryShip && Math.random() < 0.002) {
        mysteryShip = {
            x: 0,
            y: 30,
            width: 60,
            height: 30,
            direction: 1
        };
    }
}

// Update game
function update() {
    if (!gameRunning || gamePaused) return;

    // Move player
    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x < CANVAS_WIDTH - player.width) {
        player.x += player.speed;
    }

    // Move player bullets
    playerBullets = playerBullets.filter(bullet => {
        bullet.y -= BULLET_SPEED;
        return bullet.y > 0;
    });

    // Move alien bullets
    alienBullets = alienBullets.filter(bullet => {
        bullet.y += ALIEN_BULLET_SPEED;
        return bullet.y < CANVAS_HEIGHT;
    });

    // Move aliens
    let hitEdge = false;
    aliens.forEach(alien => {
        if (alien.alive) {
            alien.x += alienSpeed * alienDirection;
            if (alien.x <= 0 || alien.x >= CANVAS_WIDTH - alien.width) {
                hitEdge = true;
            }
        }
    });

    if (hitEdge) {
        alienDirection *= -1;
        aliens.forEach(alien => {
            if (alien.alive) {
                alien.y += alienDropDistance;
            }
        });
    }

    // Alien shooting
    alienShoot();

    // Mystery ship
    spawnMysteryShip();
    if (mysteryShip) {
        mysteryShip.x += MYSTERY_SHIP_SPEED * mysteryShip.direction;
        if (mysteryShip.x > CANVAS_WIDTH || mysteryShip.x < -mysteryShip.width) {
            mysteryShip = null;
        }
    }

    // Check collisions
    checkCollisions();

    // Check win condition
    if (aliens.every(alien => !alien.alive)) {
        levelComplete();
    }

    // Check lose condition
    const aliveAliens = aliens.filter(a => a.alive);
    if (aliveAliens.some(alien => alien.y + alien.height >= player.y)) {
        gameOver();
    }
}

// Check collisions
function checkCollisions() {
    // Player bullets vs aliens
    playerBullets = playerBullets.filter(bullet => {
        let hit = false;
        aliens.forEach(alien => {
            if (alien.alive && collision(bullet, alien)) {
                alien.alive = false;
                score += alien.type * 10;
                hit = true;
            }
        });
        return !hit;
    });

    // Player bullets vs mystery ship
    if (mysteryShip) {
        playerBullets = playerBullets.filter(bullet => {
            if (collision(bullet, mysteryShip)) {
                score += MYSTERY_SHIP_POINTS[Math.floor(Math.random() * MYSTERY_SHIP_POINTS.length)];
                mysteryShip = null;
                return false;
            }
            return true;
        });
    }

    // Bullets vs shields
    [...playerBullets, ...alienBullets].forEach(bullet => {
        shields.forEach(shield => {
            if (shield.health > 0 && collision(bullet, shield)) {
                shield.health--;
                bullet.y = -100; // Remove bullet
            }
        });
    });

    // Clean up bullets that hit shields
    playerBullets = playerBullets.filter(b => b.y > 0);
    alienBullets = alienBullets.filter(b => b.y < CANVAS_HEIGHT);

    // Alien bullets vs player
    alienBullets = alienBullets.filter(bullet => {
        if (collision(bullet, player)) {
            lives--;
            if (lives <= 0) {
                gameOver();
            }
            return false;
        }
        return true;
    });

    updateUI();
}

// Collision detection
function collision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Draw game
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw player
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = '#00aa00';
    ctx.fillRect(player.x + 10, player.y - 10, 30, 10);

    // Draw player bullets
    ctx.fillStyle = '#fff';
    playerBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw alien bullets
    ctx.fillStyle = '#ff0000';
    alienBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw aliens
    aliens.forEach(alien => {
        if (alien.alive) {
            ctx.fillStyle = alien.type === 3 ? '#ff00ff' : alien.type === 2 ? '#00ffff' : '#ffff00';
            ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
            ctx.fillStyle = '#fff';
            ctx.fillRect(alien.x + 10, alien.y + 5, 8, 8);
            ctx.fillRect(alien.x + 22, alien.y + 5, 8, 8);
        }
    });

    // Draw mystery ship
    if (mysteryShip) {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(mysteryShip.x, mysteryShip.y, mysteryShip.width, mysteryShip.height);
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(mysteryShip.x + 10, mysteryShip.y + 10, 40, 10);
    }

    // Draw shields
    shields.forEach(shield => {
        if (shield.health > 0) {
            ctx.fillStyle = `rgba(0, 255, 0, ${shield.health / 10})`;
            ctx.fillRect(shield.x, shield.y, shield.width, shield.height);
        }
    });

    // Draw pause text
    if (gamePaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#fff';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
}

// Update UI
function updateUI() {
    scoreElement.textContent = score;
    levelElement.textContent = level;
    livesElement.textContent = lives;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('spaceInvadersHighScore', highScore);
        highScoreElement.textContent = highScore;
    }
}

// Level complete
function levelComplete() {
    gameRunning = false;
    levelScoreElement.textContent = score;
    levelCompleteDiv.classList.remove('hidden');
    pauseBtn.disabled = true;
}

// Game over
function gameOver() {
    gameRunning = false;
    finalScoreElement.textContent = score;
    gameOverDiv.classList.remove('hidden');
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

// Game loop
function gameLoop() {
    if (!gameRunning || gamePaused) return;
    
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Initial draw
draw();
