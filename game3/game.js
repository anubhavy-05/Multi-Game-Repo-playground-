// Wait for DOM to be fully loaded
let canvas, ctx;
let bird, pipes, score, highScore, gameOver, gameStarted, frameCount;
let flapBtn, restartBtnControl;
let coins, powerUps, particles;
let shieldActive, shieldDuration;
let isDaytime, coins_collected;

// Game constants
const PIPE_WIDTH = 60;
const PIPE_GAP = 180;
const PIPE_SPEED = 2.5;
const PIPE_FREQUENCY = 100;
const COIN_FREQUENCY = 150;
const POWERUP_FREQUENCY = 400;
const COIN_VALUE = 5;
const SHIELD_DURATION = 300; // frames (5 seconds at 60fps)

// Initialize game when DOM is ready
function initGame() {
    // Canvas setup
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Game variables
    bird = {
        x: 50,
        y: 300,
        width: 34,
        height: 24,
        velocity: 0,
        gravity: 0.5,
        jump: -9
    };
    
    pipes = [];
    coins = [];
    powerUps = [];
    particles = [];
    score = 0;
    coins_collected = 0;
    highScore = parseInt(localStorage.getItem('flappyHighScore')) || 0;
    gameOver = false;
    gameStarted = false;
    frameCount = 0;
    shieldActive = false;
    shieldDuration = 0;
    isDaytime = true;
    
    // Update high score display
    document.getElementById('highScore').textContent = highScore;
    document.getElementById('score').textContent = score;
    document.getElementById('coins').textContent = coins_collected;
    
    // Get button elements
    flapBtn = document.getElementById('flapBtn');
    restartBtnControl = document.getElementById('restartBtnControl');
    
    // Setup event listeners
    setupEventListeners();
    
    // Start game loop
    gameLoop();
}

// Setup all event listeners
function setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'PageUp' || e.code === 'ArrowUp') {
            e.preventDefault();
            jump();
        } else if (e.code === 'KeyR') {
            resetGame();
        }
    });
    
    // Canvas click
    canvas.addEventListener('click', () => {
        jump();
    });
    
    // Button controls
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
}

// Bird drawing
function drawBird() {
    // Draw shield if active
    if (shieldActive) {
        const shieldPulse = Math.sin(frameCount * 0.2) * 3;
        ctx.strokeStyle = '#00BFFF';
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(bird.x + bird.width/2, bird.y + bird.height/2, bird.width/2 + 10 + shieldPulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        // Shield particles
        if (frameCount % 5 === 0) {
            createParticles(bird.x + bird.width/2, bird.y + bird.height/2, '#00BFFF', 2);
        }
    }
    
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

// Create coin
function createCoin() {
    const y = Math.floor(Math.random() * (canvas.height - 100)) + 50;
    coins.push({
        x: canvas.width,
        y: y,
        radius: 12,
        collected: false,
        rotation: 0
    });
}

// Create power-up (shield)
function createPowerUp() {
    const y = Math.floor(Math.random() * (canvas.height - 100)) + 50;
    powerUps.push({
        x: canvas.width,
        y: y,
        radius: 15,
        type: 'shield',
        collected: false,
        pulse: 0
    });
}

// Create particle effect
function createParticles(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * 3,
            vy: Math.sin(angle) * 3,
            life: 30,
            color: color,
            size: 4
        });
    }
}

// Draw coins
function drawCoins() {
    coins.forEach(coin => {
        if (!coin.collected) {
            coin.rotation += 0.1;
            
            ctx.save();
            ctx.translate(coin.x, coin.y);
            ctx.rotate(coin.rotation);
            
            // Golden coin
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, coin.radius);
            gradient.addColorStop(0, '#FFD700');
            gradient.addColorStop(0.5, '#FFA500');
            gradient.addColorStop(1, '#FF8C00');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Coin detail
            ctx.strokeStyle = '#B8860B';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, coin.radius - 3, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.restore();
        }
    });
}

// Draw power-ups
function drawPowerUps() {
    powerUps.forEach(powerUp => {
        if (!powerUp.collected) {
            powerUp.pulse += 0.1;
            const pulseFactor = Math.sin(powerUp.pulse) * 3;
            
            // Shield icon
            ctx.save();
            ctx.translate(powerUp.x, powerUp.y);
            
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, powerUp.radius + pulseFactor);
            gradient.addColorStop(0, '#00BFFF');
            gradient.addColorStop(0.5, '#1E90FF');
            gradient.addColorStop(1, '#0080FF');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(0, -(powerUp.radius + pulseFactor));
            ctx.lineTo(powerUp.radius + pulseFactor, 0);
            ctx.lineTo(0, powerUp.radius + pulseFactor);
            ctx.lineTo(-(powerUp.radius + pulseFactor), 0);
            ctx.closePath();
            ctx.fill();
            
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.restore();
        }
    });
}

// Draw particles
function drawParticles() {
    particles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life / 30;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    });
}

// Update coins
function updateCoins() {
    if (frameCount % COIN_FREQUENCY === 0 && gameStarted) {
        createCoin();
    }
    
    for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        coin.x -= PIPE_SPEED;
        
        // Remove off-screen coins
        if (coin.x + coin.radius < 0) {
            coins.splice(i, 1);
            continue;
        }
        
        // Check collision with bird
        if (!coin.collected) {
            const distance = Math.sqrt(
                Math.pow(coin.x - (bird.x + bird.width/2), 2) + 
                Math.pow(coin.y - (bird.y + bird.height/2), 2)
            );
            
            if (distance < coin.radius + bird.width/2) {
                coin.collected = true;
                coins_collected++;
                score += COIN_VALUE;
                document.getElementById('score').textContent = score;
                document.getElementById('coins').textContent = coins_collected;
                createParticles(coin.x, coin.y, '#FFD700', 12);
                
                // Update high score
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('flappyHighScore', highScore);
                    document.getElementById('highScore').textContent = highScore;
                }
            }
        }
    }
}

// Update power-ups
function updatePowerUps() {
    if (frameCount % POWERUP_FREQUENCY === 0 && gameStarted && frameCount > 200) {
        createPowerUp();
    }
    
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const powerUp = powerUps[i];
        powerUp.x -= PIPE_SPEED;
        
        // Remove off-screen power-ups
        if (powerUp.x + powerUp.radius < 0) {
            powerUps.splice(i, 1);
            continue;
        }
        
        // Check collision with bird
        if (!powerUp.collected) {
            const distance = Math.sqrt(
                Math.pow(powerUp.x - (bird.x + bird.width/2), 2) + 
                Math.pow(powerUp.y - (bird.y + bird.height/2), 2)
            );
            
            if (distance < powerUp.radius + bird.width/2) {
                powerUp.collected = true;
                shieldActive = true;
                shieldDuration = SHIELD_DURATION;
                createParticles(powerUp.x, powerUp.y, '#00BFFF', 16);
            }
        }
    }
    
    // Update shield duration
    if (shieldActive) {
        shieldDuration--;
        if (shieldDuration <= 0) {
            shieldActive = false;
        }
    }
}

// Update particles
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        particle.size *= 0.95;
        
        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// Get background color based on time of day
function getBackgroundColor() {
    // Change from day to night every 50 points
    if (Math.floor(score / 50) % 2 === 1) {
        isDaytime = false;
        return {
            sky: '#1a1a2e',
            ground: '#4a4a5c',
            stars: true
        };
    } else {
        isDaytime = true;
        return {
            sky: '#87CEEB',
            ground: '#8B7355',
            stars: false
        };
    }
}

// Draw background with day/night cycle
function drawBackground() {
    const bg = getBackgroundColor();
    
    // Sky
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.7);
    if (isDaytime) {
        skyGradient.addColorStop(0, bg.sky);
        skyGradient.addColorStop(1, '#B0E0E6');
    } else {
        skyGradient.addColorStop(0, bg.sky);
        skyGradient.addColorStop(1, '#2d2d44');
    }
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.7);
    
    // Stars at night
    if (bg.stars) {
        ctx.fillStyle = '#fff';
        const starCount = 30;
        for (let i = 0; i < starCount; i++) {
            const x = (i * 137.508) % canvas.width; // Golden angle for distribution
            const y = (i * 73.123) % (canvas.height * 0.6);
            const twinkle = Math.sin(frameCount * 0.05 + i) * 0.5 + 0.5;
            ctx.globalAlpha = twinkle;
            ctx.fillRect(x, y, 2, 2);
        }
        ctx.globalAlpha = 1;
    }
    
    // Ground
    ctx.fillStyle = bg.ground;
    ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);
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
    // Skip collision if shield is active
    if (shieldActive) {
        return false;
    }
    
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
    
    // Draw background with day/night cycle
    drawBackground();
    
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
        updateCoins();
        updatePowerUps();
        updateParticles();
        
        // Check collision
        if (checkCollision()) {
            gameOver = true;
        }
        
        // Draw everything
        drawPipes();
        drawCoins();
        drawPowerUps();
        drawBird();
        drawParticles();
        
        // Draw shield timer
        if (shieldActive) {
            ctx.fillStyle = '#00BFFF';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            const secondsLeft = Math.ceil(shieldDuration / 60);
            ctx.fillText(`Shield: ${secondsLeft}s`, canvas.width / 2, 30);
        }
    } else {
        // Draw game over screen
        drawPipes();
        drawCoins();
        drawPowerUps();
        drawBird();
        drawParticles();
        drawGameOver();
    }
    
    requestAnimationFrame(gameLoop);
}

// Make bird jump
function jump() {
    console.log('Jump called!'); // Debug log
    if (!gameStarted) {
        gameStarted = true;
        // Create first pipe immediately when game starts
        createPipe();
    }
    
    if (!gameOver) {
        bird.velocity = bird.jump;
        // Create flap particles
        createParticles(bird.x + bird.width/2, bird.y + bird.height, '#87CEEB', 6);
    }
}

// Reset game
function resetGame() {
    bird.y = 300;
    bird.velocity = 0;
    pipes = [];
    coins = [];
    powerUps = [];
    particles = [];
    score = 0;
    coins_collected = 0;
    gameOver = false;
    gameStarted = false;
    frameCount = 0;
    shieldActive = false;
    shieldDuration = 0;
    isDaytime = true;
    document.getElementById('score').textContent = score;
    document.getElementById('coins').textContent = coins_collected;
}

// Initialize game when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
