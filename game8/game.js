// Commit 2: Create Game Class and Core Initialization

// ===== CONFIGURATION =====
const CONFIG = {
    // Canvas
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    TILE_SIZE: 40,
    
    // Grid dimensions
    GRID_WIDTH: 20,  // 800 / 40
    GRID_HEIGHT: 15, // 600 / 40
    
    // Game settings
    TARGET_FPS: 60,
    MAX_DELTA_TIME: 0.1, // Prevent spiral of death
    
    // Player settings
    PLAYER: {
        START_HEALTH: 100,
        START_ATTACK: 10,
        START_DEFENSE: 5,
        START_SPEED: 150, // pixels per second
        START_GOLD: 0,
        START_LEVEL: 1,
        SIZE: 16, // Half tile size for better collision
    },
    
    // Game progression
    FLOOR: {
        START_FLOOR: 1,
        DIFFICULTY_MULTIPLIER: 1.2, // Each floor enemies get 20% stronger
    },
    
    // Camera
    CAMERA: {
        SMOOTH_SPEED: 5, // Camera smoothing factor
        DEAD_ZONE: 100, // Pixels from center before camera moves
    },
    
    // Colors
    COLORS: {
        BACKGROUND: '#1a1a1a',
        GRID: 'rgba(255, 215, 0, 0.1)',
        FLOOR: '#2a2a2a',
        WALL: '#404040',
        PLAYER: '#4a9eff',
        ENEMY: '#ff4a4a',
        GOLD: '#ffd700',
        HEALTH: '#4aff4a',
        TEXT: '#ffffff',
    }
};

// ===== UTILITY FUNCTIONS =====
const Utils = {
    // Distance between two points
    distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    },
    
    // Angle between two points
    angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },
    
    // Lerp (linear interpolation)
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    },
    
    // Clamp value between min and max
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },
    
    // Random integer between min and max (inclusive)
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // Random float between min and max
    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    // Check AABB collision
    checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < x2 + w2 && x1 + w1 > x2 &&
               y1 < y2 + h2 && y1 + h1 > y2;
    },
    
    // Grid to world coordinates
    gridToWorld(gridX, gridY) {
        return {
            x: gridX * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
            y: gridY * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2
        };
    },
    
    // World to grid coordinates
    worldToGrid(worldX, worldY) {
        return {
            x: Math.floor(worldX / CONFIG.TILE_SIZE),
            y: Math.floor(worldY / CONFIG.TILE_SIZE)
        };
    }
};

// ===== INPUT MANAGER =====
class InputManager {
    constructor() {
        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            worldX: 0,
            worldY: 0,
            isDown: false,
            button: -1
        };
        
        this.setupListeners();
    }
    
    setupListeners() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            this.keys[e.code] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
            this.keys[e.code] = false;
        });
        
        // Mouse
        const canvas = document.getElementById('gameCanvas');
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            this.mouse.x = (e.clientX - rect.left) * scaleX;
            this.mouse.y = (e.clientY - rect.top) * scaleY;
        });
        
        canvas.addEventListener('mousedown', (e) => {
            this.mouse.isDown = true;
            this.mouse.button = e.button;
        });
        
        canvas.addEventListener('mouseup', (e) => {
            this.mouse.isDown = false;
            this.mouse.button = -1;
        });
        
        canvas.addEventListener('mouseleave', () => {
            this.mouse.isDown = false;
        });
    }
    
    isKeyDown(key) {
        return this.keys[key.toLowerCase()] || this.keys[key];
    }
    
    updateMouseWorld(camera) {
        this.mouse.worldX = this.mouse.x + camera.x;
        this.mouse.worldY = this.mouse.y + camera.y;
    }
}

// ===== CAMERA =====
class Camera {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
    }
    
    follow(targetX, targetY, deltaTime) {
        // Smooth camera follow
        const smoothSpeed = CONFIG.CAMERA.SMOOTH_SPEED * deltaTime;
        this.targetX = targetX - CONFIG.CANVAS_WIDTH / 2;
        this.targetY = targetY - CONFIG.CANVAS_HEIGHT / 2;
        
        this.x = Utils.lerp(this.x, this.targetX, smoothSpeed);
        this.y = Utils.lerp(this.y, this.targetY, smoothSpeed);
    }
    
    apply(ctx) {
        ctx.translate(-this.x, -this.y);
    }
    
    reset(ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}

// ===== GAME STATISTICS =====
class GameStats {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.enemiesKilled = 0;
        this.goldCollected = 0;
        this.floorsCleared = 0;
        this.timePlayed = 0;
        this.damageDealt = 0;
        this.damageTaken = 0;
        this.itemsCollected = 0;
    }
    
    update(deltaTime) {
        this.timePlayed += deltaTime;
    }
}

// ===== PLAYER =====
class Player {
    constructor(x, y) {
        // Position
        this.x = x;
        this.y = y;
        
        // Stats
        this.maxHealth = CONFIG.PLAYER.START_HEALTH;
        this.health = this.maxHealth;
        this.attack = CONFIG.PLAYER.START_ATTACK;
        this.defense = CONFIG.PLAYER.START_DEFENSE;
        this.speed = CONFIG.PLAYER.START_SPEED;
        this.gold = CONFIG.PLAYER.START_GOLD;
        this.level = CONFIG.PLAYER.START_LEVEL;
        
        // Display
        this.size = CONFIG.PLAYER.SIZE;
        this.color = CONFIG.COLORS.PLAYER;
        
        // State
        this.isDead = false;
        this.direction = 0; // Angle in radians (for future animation facing)
        
        // Animation (for future use)
        this.animationState = 'idle'; // idle, walk, attack
        this.animationTimer = 0;
    }
    
    update(deltaTime) {
        // Check death
        if (this.health <= 0 && !this.isDead) {
            this.isDead = true;
            console.log('💀 Player has died!');
        }
        
        // Update animation timer (will be used in future commits)
        this.animationTimer += deltaTime;
    }
    
    render(ctx) {
        // Draw player body (simple circle for now)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw player border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw direction indicator (small dot showing facing direction)
        const indicatorDist = this.size - 4;
        const indicatorX = this.x + Math.cos(this.direction) * indicatorDist;
        const indicatorY = this.y + Math.sin(this.direction) * indicatorDist;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(indicatorX, indicatorY, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw health bar above player
        this.drawHealthBar(ctx);
    }
    
    drawHealthBar(ctx) {
        const barWidth = 40;
        const barHeight = 6;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.size - 15;
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health
        const healthPercent = this.health / this.maxHealth;
        const healthWidth = barWidth * healthPercent;
        
        // Color based on health percentage
        if (healthPercent > 0.6) {
            ctx.fillStyle = CONFIG.COLORS.HEALTH; // Green
        } else if (healthPercent > 0.3) {
            ctx.fillStyle = '#ffd700'; // Yellow
        } else {
            ctx.fillStyle = '#ff4a4a'; // Red
        }
        
        ctx.fillRect(barX, barY, healthWidth, barHeight);
        
        // Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
    
    takeDamage(amount) {
        // Apply defense reduction (will be enhanced in Commit 8)
        const finalDamage = Math.max(1, amount - this.defense);
        this.health -= finalDamage;
        this.health = Math.max(0, this.health);
        
        console.log(`💔 Player took ${finalDamage} damage (${this.health}/${this.maxHealth} HP)`);
        
        return finalDamage;
    }
    
    heal(amount) {
        const oldHealth = this.health;
        this.health = Math.min(this.maxHealth, this.health + amount);
        const healed = this.health - oldHealth;
        
        console.log(`💚 Player healed ${healed} HP (${this.health}/${this.maxHealth} HP)`);
        
        return healed;
    }
    
    addGold(amount) {
        this.gold += amount;
        console.log(`💰 +${amount} gold (Total: ${this.gold})`);
    }
}

// ===== MAIN GAME CLASS =====
class Game {
    constructor() {
        // Canvas setup
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Game state
        this.state = 'stopped'; // stopped, playing, paused, gameOver
        this.frameCount = 0;
        this.lastTime = 0;
        this.fps = 0;
        this.fpsTimer = 0;
        
        // Core systems
        this.input = new InputManager();
        this.camera = new Camera(0, 0);
        this.stats = new GameStats();
        
        // Game entities (will be populated in future commits)
        this.player = null;
        this.enemies = [];
        this.items = [];
        this.projectiles = [];
        this.particles = [];
        
        // Game data
        this.currentFloor = CONFIG.FLOOR.START_FLOOR;
        this.dungeon = null; // Will be populated in Commit 5

        // Initialize
        this.init();
    }

    init() {
        console.log('🎮 Dungeon Crawler RPG - Commit 2: Core Initialization');
        console.log('Canvas:', this.width, 'x', this.height);
        console.log('Grid:', CONFIG.GRID_WIDTH, 'x', CONFIG.GRID_HEIGHT);
        console.log('Tile size:', CONFIG.TILE_SIZE);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initial render
        this.render();
        
        // Update UI
        this.updateUI();
    }
    
    initGameData() {
        // Reset game data
        this.currentFloor = CONFIG.FLOOR.START_FLOOR;
        this.stats.reset();
        
        // Clear all entity arrays
        this.enemies = [];
        this.items = [];
        this.projectiles = [];
        this.particles = [];
        
        // Initialize player at center of canvas
        const startX = this.width / 2;
        const startY = this.height / 2;
        this.player = new Player(startX, startY);
        console.log(`✓ Player spawned at (${startX}, ${startY})`);
        
        // Dungeon will be generated in Commit 5
        this.dungeon = null;
        
        console.log('✓ Game data initialized');
    }

    setupEventListeners() {
        // Start button
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        
        // Pause button
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        
        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            // Pause with ESC
            if (e.key === 'Escape') {
                if (this.state === 'playing') {
                    this.togglePause();
                }
            }
            
            // Inventory (will be implemented in Commit 10)
            if (e.key.toLowerCase() === 'i') {
                if (this.state === 'playing') {
                    console.log('💼 Inventory (coming in Commit 10)');
                }
            }
            
            // Character stats (will be implemented in Commit 12)
            if (e.key.toLowerCase() === 'c') {
                if (this.state === 'playing') {
                    console.log('📊 Character stats (coming in Commit 12)');
                }
            }
        });
        
        console.log('✓ Event listeners setup');
    }

    start() {
        if (this.state === 'stopped' || this.state === 'gameOver') {
            console.log('🎮 Starting game...');
            
            // Initialize game data
            this.initGameData();
            
            this.state = 'playing';
            
            // Hide welcome/game over screens
            document.getElementById('welcomeScreen').style.display = 'none';
            document.getElementById('gameOverScreen').style.display = 'none';
            
            // Enable pause button
            document.getElementById('pauseBtn').disabled = false;
            
            // Start game loop
            this.lastTime = performance.now();
            this.gameLoop(this.lastTime);
            
            this.updateUI();
            console.log('✓ Game started - Floor', this.currentFloor);
        }
    }

    togglePause() {
        if (this.state === 'playing') {
            this.state = 'paused';
            document.getElementById('pauseScreen').style.display = 'flex';
            console.log('⏸️ Game paused');
        } else if (this.state === 'paused') {
            this.state = 'playing';
            document.getElementById('pauseScreen').style.display = 'none';
            this.lastTime = performance.now();
            this.gameLoop(this.lastTime);
            console.log('▶️ Game resumed');
        }
        this.updateUI();
    }

    reset() {
        console.log('🔄 Resetting game...');
        this.state = 'stopped';
        this.frameCount = 0;
        this.fps = 0;
        
        // Reset game data
        this.initGameData();
        
        // Show welcome screen
        document.getElementById('welcomeScreen').style.display = 'flex';
        document.getElementById('pauseScreen').style.display = 'none';
        document.getElementById('gameOverScreen').style.display = 'none';
        
        // Disable pause button
        document.getElementById('pauseBtn').disabled = true;
        
        this.render();
        this.updateUI();
        console.log('✓ Game reset complete');
    }

    gameLoop(currentTime) {
        if (this.state !== 'playing') return;

        // Calculate delta time
        let deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;
        
        // Clamp delta time to prevent spiral of death
        deltaTime = Math.min(deltaTime, CONFIG.MAX_DELTA_TIME);

        // Update FPS counter
        this.fpsTimer += deltaTime;
        if (this.fpsTimer >= 1) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsTimer = 0;
            this.updateUI();
        }
        this.frameCount++;
        
        // Update game statistics
        this.stats.update(deltaTime);

        // Update game logic
        this.update(deltaTime);

        // Render game
        this.render();

        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        // Update input manager with camera position
        this.input.updateMouseWorld(this.camera);
        
        // Update player
        if (this.player) {
            this.player.update(deltaTime);
            // Camera follows player
            this.camera.follow(this.player.x, this.player.y, deltaTime);
            
            // Check for player death
            if (this.player.isDead) {
                this.gameOver();
                return;
            }
        }
        
        // Update enemies (will be implemented in Commit 7)
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.enemies[i].update(deltaTime);
            // Remove dead enemies
            if (this.enemies[i].isDead) {
                this.enemies.splice(i, 1);
            }
        }
        
        // Update projectiles (will be implemented in Commit 8)
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            this.projectiles[i].update(deltaTime);
            // Remove expired projectiles
            if (this.projectiles[i].isDead) {
                this.projectiles.splice(i, 1);
            }
        }
        
        // Update particles (will be implemented in Commit 18)
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(deltaTime);
            // Remove dead particles
            if (this.particles[i].isDead) {
                this.particles.splice(i, 1);
            }
        }
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = CONFIG.COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Save context state
        this.ctx.save();
        
        // Apply camera transform
        this.camera.apply(this.ctx);
        
        // === WORLD SPACE RENDERING ===
        
        // Draw dungeon (will be implemented in Commit 5)
        if (this.dungeon) {
            this.dungeon.render(this.ctx);
        } else {
            // Draw grid pattern for visualization
            this.drawGrid();
        }
        
        // Draw items (will be implemented in Commit 9)
        for (const item of this.items) {
            item.render(this.ctx);
        }
        
        // Draw enemies (will be implemented in Commit 7)
        for (const enemy of this.enemies) {
            enemy.render(this.ctx);
        }
        
        // Draw player (will be implemented in Commit 3)
        if (this.player) {
            this.player.render(this.ctx);
        }
        
        // Draw projectiles (will be implemented in Commit 8)
        for (const projectile of this.projectiles) {
            projectile.render(this.ctx);
        }
        
        // Draw particles (will be implemented in Commit 18)
        for (const particle of this.particles) {
            particle.render(this.ctx);
        }
        
        // Reset camera transform
        this.camera.reset(this.ctx);
        
        // === SCREEN SPACE RENDERING ===
        
        // Draw UI elements that don't move with camera
        this.drawScreenUI();
        
        // Restore context state
        this.ctx.restore();
    }

    drawGrid() {
        const gridSize = CONFIG.TILE_SIZE;
        const startX = Math.floor(this.camera.x / gridSize) * gridSize;
        const startY = Math.floor(this.camera.y / gridSize) * gridSize;
        const endX = startX + this.width + gridSize;
        const endY = startY + this.height + gridSize;
        
        this.ctx.strokeStyle = CONFIG.COLORS.GRID;
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let x = startX; x <= endX; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, endY);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = startY; y <= endY; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(startX, y);
            this.ctx.lineTo(endX, y);
            this.ctx.stroke();
        }
    }
    
    drawScreenUI() {
        if (this.state === 'playing' && this.player) {
            // Show instructions for next features
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'top';
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
            this.ctx.fillText('Movement controls coming in Commit 4...', this.width / 2, 10);
            
            // Show some debug info about active systems
            this.ctx.font = '14px Courier New';
            this.ctx.textAlign = 'left';
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
            const debugY = this.height - 95;
            this.ctx.fillText(`✓ CONFIG system`, 10, debugY);
            this.ctx.fillText(`✓ Input Manager`, 10, debugY + 15);
            this.ctx.fillText(`✓ Camera System`, 10, debugY + 30);
            this.ctx.fillText(`✓ Game Stats`, 10, debugY + 45);
            this.ctx.fillText(`✓ Player System`, 10, debugY + 60);
        }
    }

    updateUI() {
        // Update debug info
        document.getElementById('fps').textContent = this.fps;
        document.getElementById('gameState').textContent = this.state;
        
        // Update player stats (placeholder values until player is implemented)
        if (this.player) {
            document.getElementById('playerHealth').textContent = 
                `${Math.ceil(this.player.health)}/${this.player.maxHealth}`;
            document.getElementById('playerAttack').textContent = this.player.attack;
            document.getElementById('playerDefense').textContent = this.player.defense;
            document.getElementById('playerLevel').textContent = this.player.level;
            document.getElementById('playerGold').textContent = this.player.gold;
        } else {
            // Placeholder values from CONFIG
            document.getElementById('playerHealth').textContent = 
                `${CONFIG.PLAYER.START_HEALTH}/${CONFIG.PLAYER.START_HEALTH}`;
            document.getElementById('playerAttack').textContent = CONFIG.PLAYER.START_ATTACK;
            document.getElementById('playerDefense').textContent = CONFIG.PLAYER.START_DEFENSE;
            document.getElementById('playerLevel').textContent = CONFIG.PLAYER.START_LEVEL;
            document.getElementById('playerGold').textContent = CONFIG.PLAYER.START_GOLD;
        }
        
        document.getElementById('currentFloor').textContent = this.currentFloor;
        
        // Update game over screen stats
        if (this.state === 'gameOver') {
            document.getElementById('finalFloor').textContent = this.currentFloor;
            document.getElementById('finalGold').textContent = this.stats.goldCollected;
            document.getElementById('finalKills').textContent = this.stats.enemiesKilled;
        }
    }
    
    gameOver() {
        console.log('💀 Game Over!');
        this.state = 'gameOver';
        
        // Update final stats
        this.updateUI();
        
        // Show game over screen
        document.getElementById('gameOverScreen').style.display = 'flex';
        
        // Disable pause button
        document.getElementById('pauseBtn').disabled = true;
    }
}

// Initialize game when page loads
let game;
window.addEventListener('load', () => {
    game = new Game();
});
