// Commit 2: Create Game Class and Core Initialization

// ============================================
// Configuration Constants
// ============================================
const CONFIG = {
    // Canvas settings
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    TILE_SIZE: 40,
    
    // Game settings
    TARGET_FPS: 60,
    MAX_DELTA_TIME: 0.1, // Prevent huge jumps
    
    // Player settings (will be fully used in Commit 3)
    PLAYER: {
        START_HEALTH: 100,
        START_ATTACK: 10,
        START_DEFENSE: 5,
        START_SPEED: 150, // pixels per second
        START_GOLD: 0,
        START_LEVEL: 1
    },
    
    // Dungeon settings (will be used in Commit 5)
    DUNGEON: {
        ROOM_WIDTH: 20, // tiles
        ROOM_HEIGHT: 15, // tiles
        MIN_ROOMS: 5,
        MAX_ROOMS: 10
    },
    
    // Camera settings
    CAMERA: {
        SMOOTH_FACTOR: 0.1, // Camera smoothing
        DEADZONE: 100 // Pixels before camera moves
    },
    
    // Combat settings (will be used in Commit 8)
    COMBAT: {
        ATTACK_COOLDOWN: 0.5, // seconds
        KNOCKBACK_FORCE: 200,
        DAMAGE_VARIANCE: 0.2 // ±20% damage variance
    },
    
    // Item settings (will be used in Commit 9)
    ITEMS: {
        GOLD_DROP_CHANCE: 0.8,
        POTION_DROP_CHANCE: 0.3,
        EQUIPMENT_DROP_CHANCE: 0.1
    }
};

// ============================================
// Utility Functions
// ============================================
const Utils = {
    // Random number between min and max
    random(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    // Random integer between min and max (inclusive)
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // Distance between two points
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },
    
    // Angle between two points (in radians)
    angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },
    
    // Clamp value between min and max
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },
    
    // Lerp (linear interpolation)
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    },
    
    // Check if two rectangles overlap (AABB collision)
    rectOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < x2 + w2 &&
               x1 + w1 > x2 &&
               y1 < y2 + h2 &&
               y1 + h1 > y2;
    }
};

// ============================================
// Input Manager
// ============================================
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
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            this.keys[e.code] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
            this.keys[e.code] = false;
        });
        
        // Mouse events on canvas
        const canvas = document.getElementById('gameCanvas');
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        canvas.addEventListener('mousedown', (e) => {
            this.mouse.isDown = true;
            this.mouse.button = e.button;
        });
        
        canvas.addEventListener('mouseup', (e) => {
            this.mouse.isDown = false;
            this.mouse.button = -1;
        });
        
        canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault(); // Prevent right-click menu
        });
    }
    
    // Check if key is pressed
    isKeyDown(key) {
        return this.keys[key.toLowerCase()] || this.keys[key] || false;
    }
    
    // Check WASD or Arrow keys for movement
    getMovementInput() {
        return {
            up: this.isKeyDown('w') || this.isKeyDown('ArrowUp'),
            down: this.isKeyDown('s') || this.isKeyDown('ArrowDown'),
            left: this.isKeyDown('a') || this.isKeyDown('ArrowLeft'),
            right: this.isKeyDown('d') || this.isKeyDown('ArrowRight')
        };
    }
}

// ============================================
// Camera System
// ============================================
class Camera {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.width = width;
        this.height = height;
    }
    
    // Set camera target (usually the player)
    setTarget(x, y) {
        this.targetX = x - this.width / 2;
        this.targetY = y - this.height / 2;
    }
    
    // Update camera position with smooth following
    update(deltaTime) {
        // Smooth camera movement
        this.x = Utils.lerp(this.x, this.targetX, CONFIG.CAMERA.SMOOTH_FACTOR);
        this.y = Utils.lerp(this.y, this.targetY, CONFIG.CAMERA.SMOOTH_FACTOR);
    }
    
    // Apply camera transform to canvas context
    apply(ctx) {
        ctx.save();
        ctx.translate(-this.x, -this.y);
    }
    
    // Remove camera transform
    reset(ctx) {
        ctx.restore();
    }
    
    // Convert screen coordinates to world coordinates
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    }
}

// ============================================
// Game Statistics
// ============================================
class GameStats {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.enemiesKilled = 0;
        this.goldCollected = 0;
        this.damageDealt = 0;
        this.damageTaken = 0;
        this.floorsCleared = 0;
        this.bossesKilled = 0;
        this.itemsCollected = 0;
        this.timePlayed = 0; // in seconds
        this.highestFloor = 1;
    }
    
    update(deltaTime) {
        if (deltaTime > 0) {
            this.timePlayed += deltaTime;
        }
    }
    
    getFormattedTime() {
        const minutes = Math.floor(this.timePlayed / 60);
        const seconds = Math.floor(this.timePlayed % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

// ============================================
// Main Game Class
// ============================================
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
        
        // Core systems (Commit 2)
        this.input = new InputManager();
        this.camera = new Camera(this.width, this.height);
        this.stats = new GameStats();
        
        // Game entities (will be populated in future commits)
        this.player = null; // Commit 3
        this.enemies = [];  // Commit 7
        this.items = [];    // Commit 9
        this.projectiles = []; // Commit 8
        this.particles = []; // Commit 18
        
        // Player resources
        this.gold = CONFIG.PLAYER.START_GOLD;
        this.health = CONFIG.PLAYER.START_HEALTH;
        this.maxHealth = CONFIG.PLAYER.START_HEALTH;
        this.attack = CONFIG.PLAYER.START_ATTACK;
        this.defense = CONFIG.PLAYER.START_DEFENSE;
        this.level = CONFIG.PLAYER.START_LEVEL;
        this.experience = 0;
        this.experienceToNext = 100;
        
        // Dungeon state
        this.currentFloor = 1;
        this.dungeon = null; // Commit 5

        // Initialize
        this.init();
    }

    init() {
        console.log('🎮 Dungeon Crawler RPG - Commit 2: Core Initialization');
        console.log('Canvas:', this.width, 'x', this.height);
        console.log('Systems initialized: Input, Camera, Stats');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initial render
        this.render();
        
        // Update UI
        this.updateUI();
    }

    setupEventListeners() {
        // Start button
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        
        // Pause button
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        
        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        
        // Keyboard controls (ESC for pause, I for inventory - to be implemented)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state === 'playing') {
                this.togglePause();
            }
            // Inventory will be added in Commit 10
            // if (e.key.toLowerCase() === 'i' && this.state === 'playing') {
            //     this.toggleInventory();
            // }
        });
    }

    start() {
        if (this.state === 'stopped' || this.state === 'gameOver') {
            console.log('🎮 Starting game...');
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
        
        // Reset player resources
        this.gold = CONFIG.PLAYER.START_GOLD;
        this.health = CONFIG.PLAYER.START_HEALTH;
        this.maxHealth = CONFIG.PLAYER.START_HEALTH;
        this.attack = CONFIG.PLAYER.START_ATTACK;
        this.defense = CONFIG.PLAYER.START_DEFENSE;
        this.level = CONFIG.PLAYER.START_LEVEL;
        this.experience = 0;
        this.experienceToNext = 100;
        this.currentFloor = 1;
        
        // Reset game statistics
        this.stats.reset();
        
        // Clear all entities
        this.enemies = [];
        this.items = [];
        this.projectiles = [];
        this.particles = [];
        this.player = null;
        this.dungeon = null;
        
        // Reset camera
        this.camera.x = 0;
        this.camera.y = 0;
        this.camera.targetX = 0;
        this.camera.targetY = 0;
        
        // Show welcome screen
        document.getElementById('welcomeScreen').style.display = 'flex';
        document.getElementById('pauseScreen').style.display = 'none';
        document.getElementById('gameOverScreen').style.display = 'none';
        
        // Disable pause button
        document.getElementById('pauseBtn').disabled = true;
        
        this.render();
        this.updateUI();
    }

    gameLoop(currentTime) {
        if (this.state !== 'playing') return;

        // Calculate delta time
        let deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        deltaTime = Math.min(deltaTime, CONFIG.MAX_DELTA_TIME); // Clamp to prevent huge jumps
        this.lastTime = currentTime;

        // Update FPS counter
        this.fpsTimer += deltaTime;
        if (this.fpsTimer >= 1) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsTimer = 0;
            this.updateUI();
        }
        this.frameCount++;

        // Update game systems
        this.update(deltaTime);

        // Render game
        this.render();

        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        // Update game statistics (time played)
        this.stats.update(deltaTime);
        
        // Update camera
        if (this.player) {
            this.camera.setTarget(this.player.x, this.player.y);
        }
        this.camera.update(deltaTime);
        
        // Update mouse world position
        const worldPos = this.camera.screenToWorld(this.input.mouse.x, this.input.mouse.y);
        this.input.mouse.worldX = worldPos.x;
        this.input.mouse.worldY = worldPos.y;
        
        // Update player (Commit 3)
        if (this.player) {
            // this.player.update(deltaTime);
        }
        
        // Update enemies (Commit 7)
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            // this.enemies[i].update(deltaTime);
        }
        
        // Update projectiles (Commit 8)
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            // this.projectiles[i].update(deltaTime);
        }
        
        // Update particles (Commit 18)
        for (let i = this.particles.length - 1; i >= 0; i--) {
            // this.particles[i].update(deltaTime);
        }
        
        // Check for game over
        if (this.health <= 0 && this.state === 'playing') {
            this.gameOver();
        }
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Apply camera transform for world rendering
        this.camera.apply(this.ctx);
        
        // Draw world elements (with camera)
        this.drawWorld();
        
        // Draw items (Commit 9)
        for (let item of this.items) {
            // item.render(this.ctx);
        }
        
        // Draw enemies (Commit 7)
        for (let enemy of this.enemies) {
            // enemy.render(this.ctx);
        }
        
        // Draw player (Commit 3)
        if (this.player) {
            // this.player.render(this.ctx);
        }
        
        // Draw projectiles (Commit 8)
        for (let projectile of this.projectiles) {
            // projectile.render(this.ctx);
        }
        
        // Draw particles (Commit 18)
        for (let particle of this.particles) {
            // particle.render(this.ctx);
        }
        
        // Reset camera transform for UI rendering
        this.camera.reset(this.ctx);
        
        // Draw UI elements (no camera transform)
        this.drawUI();
    }
    
    drawWorld() {
        // Draw grid pattern (for visualization in Commit 2)
        this.drawGrid();
        
        // Draw dungeon (Commit 5)
        if (this.dungeon) {
            // this.dungeon.render(this.ctx);
        }

        // Draw center text for early commits
        if (!this.player) {
            this.drawCenterText();
        }
    }
    
    drawUI() {
        // Draw mini-map in future (Commit 21+)
        // Draw ability cooldowns in future (Commit 17)
        
        // Debug info for development
        if (this.state === 'playing') {
            // Show camera position
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.font = '12px monospace';
            this.ctx.fillText(`Camera: (${Math.round(this.camera.x)}, ${Math.round(this.camera.y)})`, 10, this.height - 10);
            
            // Show mouse world position
            this.ctx.fillText(`Mouse: (${Math.round(this.input.mouse.worldX)}, ${Math.round(this.input.mouse.worldY)})`, 10, this.height - 30);
        }
    }

    drawGrid() {
        const gridSize = 40;
        
        this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.1)';
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x <= this.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y <= this.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }

    drawCenterText() {
        if (this.state === 'playing') {
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
            this.ctx.font = 'bold 30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            // Position text in world space at center of starting view
            const centerX = this.camera.x + this.width / 2;
            const centerY = this.camera.y + this.height / 2;
            
            this.ctx.fillText('🗡️ DUNGEON CRAWLER RPG', centerX, centerY - 40);
            
            this.ctx.font = '20px Arial';
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.fillText('Commit 2: Core Systems Active ✓', centerX, centerY);
            
            this.ctx.font = '16px Arial';
            this.ctx.fillText('Player character coming in Commit 3...', centerX, centerY + 30);
            
            // Show system status
            this.ctx.font = '14px Arial';
            this.ctx.fillStyle = 'rgba(0, 255, 0, 0.6)';
            this.ctx.fillText('✓ Input Manager  ✓ Camera System  ✓ Stats Tracker', centerX, centerY + 60);
        }
    }

    updateUI() {
        // Update debug info
        document.getElementById('fps').textContent = this.fps;
        document.getElementById('gameState').textContent = this.state;
        
        // Update player stats
        document.getElementById('playerHealth').textContent = `${Math.round(this.health)}/${this.maxHealth}`;
        document.getElementById('playerAttack').textContent = this.attack;
        document.getElementById('playerDefense').textContent = this.defense;
        document.getElementById('playerLevel').textContent = this.level;
        document.getElementById('playerGold').textContent = this.gold;
        document.getElementById('currentFloor').textContent = this.currentFloor;
    }
    
    gameOver() {
        console.log('💀 Game Over!');
        this.state = 'gameOver';
        
        // Update final stats
        document.getElementById('finalFloor').textContent = this.currentFloor;
        document.getElementById('finalGold').textContent = this.gold;
        document.getElementById('finalKills').textContent = this.stats.enemiesKilled;
        
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
