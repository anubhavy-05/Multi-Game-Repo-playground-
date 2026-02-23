// Castle Defenders - Tower Defense RPG
// Commit 3: Implement game loop and rendering system

// ============================================
// GAME CONFIGURATION
// ============================================
const CONFIG = {
    // Canvas settings
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    GRID_SIZE: 40,
    
    // Game balance
    STARTING_GOLD: 100,
    STARTING_MANA: 50,
    STARTING_LIVES: 25,
    STARTING_WAVE: 1,
    
    // FPS and timing
    TARGET_FPS: 60,
    FRAME_TIME: 1000 / 60,
    
    // Colors
    COLORS: {
        PATH: '#8B7355',
        GRASS: '#6B8E23',
        BUILD_ZONE: 'rgba(100, 200, 100, 0.3)',
        GRID_LINE: 'rgba(255, 255, 255, 0.1)',
        SKY: '#87CEEB',
        GROUND: '#8FBC8F'
    }
};

// ============================================
// MAIN GAME CLASS
// ============================================
class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        
        // Game state
        this.state = {
            gold: CONFIG.STARTING_GOLD,
            mana: CONFIG.STARTING_MANA,
            lives: CONFIG.STARTING_LIVES,
            wave: CONFIG.STARTING_WAVE,
            score: 0,
            isPaused: false,
            gameOver: false,
            gameStarted: false
        };
        
        // Game objects (will be populated in future commits)
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.powerUps = [];
        
        // Timing
        this.lastFrameTime = 0;
        this.deltaTime = 0;
        this.frameCount = 0;
        
        // Input handling
        this.mouse = {
            x: 0,
            y: 0,
            isDown: false,
            gridX: 0,
            gridY: 0
        };
        
        // Selected elements
        this.selectedTower = null;
        this.hoveredCell = null;
        
        console.log('Game class initialized');
        this.setupEventListeners();
        this.updateUI();
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Mouse move
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.mouse.gridX = Math.floor(this.mouse.x / CONFIG.GRID_SIZE);
            this.mouse.gridY = Math.floor(this.mouse.y / CONFIG.GRID_SIZE);
        });
        
        // Mouse click
        this.canvas.addEventListener('click', (e) => {
            this.handleClick(e);
        });
        
        // Mouse down/up
        this.canvas.addEventListener('mousedown', () => {
            this.mouse.isDown = true;
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.mouse.isDown = false;
        });
        
        // Keyboard
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
        
        console.log('Event listeners setup complete');
    }
    
    // Handle mouse clicks
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        console.log(`Click at: (${x}, ${y}) - Grid: (${this.mouse.gridX}, ${this.mouse.gridY})`);
        
        // Future: Tower placement logic will go here
    }
    
    // Handle keyboard input
    handleKeyPress(e) {
        switch(e.key.toLowerCase()) {
            case 'p':
                this.togglePause();
                break;
            case 's':
                if (!this.state.gameStarted) {
                    this.startGame();
                }
                break;
            case 'r':
                if (this.state.gameOver) {
                    this.resetGame();
                }
                break;
        }
    }
    
    // Toggle pause
    togglePause() {
        if (!this.state.gameOver && this.state.gameStarted) {
            this.state.isPaused = !this.state.isPaused;
            console.log('Game paused:', this.state.isPaused);
        }
    }
    
    // Start the game
    startGame() {
        this.state.gameStarted = true;
        console.log('Game started!');
    }
    
    // Reset game
    resetGame() {
        this.state = {
            gold: CONFIG.STARTING_GOLD,
            mana: CONFIG.STARTING_MANA,
            lives: CONFIG.STARTING_LIVES,
            wave: CONFIG.STARTING_WAVE,
            score: 0,
            isPaused: false,
            gameOver: false,
            gameStarted: false
        };
        
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.frameCount = 0;
        
        this.updateUI();
        console.log('Game reset');
    }
    
    // ============================================
    // GAME LOOP
    // ============================================
    
    // Main game loop
    gameLoop(currentTime) {
        // Calculate delta time
        if (this.lastFrameTime === 0) {
            this.lastFrameTime = currentTime;
        }
        this.deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        
        // Update game state
        if (this.state.gameStarted && !this.state.isPaused && !this.state.gameOver) {
            this.update(this.deltaTime);
        }
        
        // Render everything
        this.render();
        
        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    // Update game logic
    update(deltaTime) {
        this.frameCount++;
        
        // Future: Update towers, enemies, projectiles, particles
        // To be implemented in upcoming commits
    }
    
    // Render everything
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.drawBackground();
        
        // Draw grid
        this.drawGrid();
        
        if (!this.state.gameStarted) {
            // Draw welcome screen
            this.drawWelcomeScreen();
        } else if (this.state.gameOver) {
            // Draw game over screen
            this.drawGameOverScreen();
        } else {
            // Draw game objects
            this.drawGameObjects();
            
            // Draw pause overlay if paused
            if (this.state.isPaused) {
                this.drawPauseOverlay();
            }
        }7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🏰 Castle Defenders', this.canvas.width / 2, this.canvas.height / 2 - 60);
        
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillText('Tower Defense RPG', this.canvas.width / 2, this.canvas.height / 2 - 20);
        
        this.ctx.font = 'bold 18px Arial';
        this.ctx.fillStyle = '#4ade80';
        this.ctx.fillText('Press S to Start!', this.canvas.width / 2, this.canvas.height / 2 + 30);
        
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = '#a0aec0';
        this.ctx.fillText('Commit 3: Game Loop Active
        // Ground
        const groundGradient = this.ctx.createLinearGradient(0, this.canvas.height * 0.6, 0, this.canvas.height);
        groundGradient.addColorStop(0, CONFIG.COLORS.GROUND);
        groundGradient.addColorStop(1, CONFIG.COLORS.GRASS);
        this.ctx.fillStyle = groundGradient;
        this.ctx.fillRect(0, this.canvas.height * 0.6, this.canvas.width, this.canvas.height * 0.4);
    }
    
    // Draw grid
    drawGrid() {
        this.ctx.strokeStyle = CONFIG.COLORS.GRID_LINE;
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x <= this.canvas.width; x += CONFIG.GRID_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= this.canvas.height; y += CONFIG.GRID_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        // Highlight hovered cell
        if (this.state.gameStarted && !this.state.gameOver) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            this.ctx.fillRect(
                this.mouse.gridX * CONFIG.GRID_SIZE,
                this.mouse.gridY * CONFIG.GRID_SIZE,
                CONFIG.GRID_SIZE,
                CONFIG.GRID_SIZE
            );
        }
    }
    
    // Draw game objects
    drawGameObjects() {
        // Future: Draw towers, enemies, projectiles, particles
        // Placeholder for now
        
        // Draw a test message
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Running - Wave ' + this.state.wave, this.canvas.width / 2, 30);
    }
    
    // Draw pause overlay
    drawPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('⏸ PAUSED', this.canvas.width / 2, this.canvas.height / 2 - 20);
        
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = '#a0aec0';
        this.ctx.fillText('Press P to Resume', this.canvas.width / 2, this.canvas.height / 2 + 30);
    }
    
    // Draw game over screen
    drawGameOverScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 60);
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Wave Reached: ${this.state.wave}`, this.canvas.width / 2, this.canvas.height / 2 - 10);
        this.ctx.fillText(`Score: ${this.state.score}`, this.canvas.width / 2, this.canvas.height / 2 + 25);
        
        this.ctx.fillStyle = '#4ade80';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillText('Press R to Restart', this.canvas.width / 2, this.canvas.height / 2 + 70);
    }
    
    // Draw debug info
    drawDebugInfo() {
        const fps = this.deltaTime > 0 ? Math.round(1000 / this.deltaTime) : 0;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(5, this.canvas.height - 75, 140, 70);
        
        this.ctx.fillStyle = '#4ade80';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`FPS: ${fps}`, 10, this.canvas.height - 55);
        this.ctx.fillText(`Frame: ${this.frameCount}`, 10, this.canvas.height - 40);
        this.ctx.fillText(`Mouse: ${this.mouse.gridX},${this.mouse.gridY}`, 10, this.canvas.height - 25);
        this.ctx.fillText(`Commit: 3/25`, 10, this.canvas.height - 10);
    }
    
    // Update UI elements
    updateUI() {
        document.getElementById('gold').textContent = this.state.gold;
        document.getElementById('mana').textContent = this.state.mana;
        document.getElementById('lives').textContent = this.state.lives;
        document.getElementById('wave').textContent = this.state.wave;
    }
    
    // Add gold
    addGold(amount) {
        this.state.gold += amount;
        this.updateUI();
    }
    
    // Spend gold
    spendGold(amount) {
        if (this.state.gold >= amount) {
            this.state.gold -= amount;
            this.updateUI();
            return true;
        }
        return false;
    }
    
    // Add mana
    addMana(amount) {
        this.state.mana += amount;
        this.updateUI();
    }
    
    // Spend mana
    spendMana(amount) {
        if (this.state.mana >= amount) {
            this.state.mana -= amount;
            this.updateUI();
            return true;
        }
        return false;
    }
    
    // Lose life
    loseLife(amount = 1) {
        this.state.lives -= amount;
        this.updateUI();
        
        if (this.state.lives <= 0) {
            this.gameOver();
        }
    }
    
    // Game over
    gameOver() {
        this.state.gameOver = true;
        console.log('Game Over! Final Score:', this.state.score);
    }
    
    // Draw welcome screen
    drawWelcomeScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🏰 Castle Defenders', this.canvas.width / 2, this.canvas.height / 2 - 60);
        
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillText('Tower Defense RPG', this.canvas.width / 2, this.canvas.height / 2 - 20);
        
        this.ctx.font = 'bold 18px Arial';
        this.ctx.fillStyle = '#4ade80';
        this.ctx.fillText('Press S to Start!', this.canvas.width / 2, this.canvas.height / 2 + 30);
        
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = '#a0aec0';
        this.ctx.fillText('Commit 2: Game Class Initialized ✓', this.canvas.width / 2, this.canvas.height / 2 + 70);
        this.ctx.fillText('P: Pause | R: Restart', this.canvas.width / 2, this.canvas.height / 2 + 95);
    }
}

// ============================================
// INITIALIZATION
// ============================================
let game;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function initGame() {
    console.log('Castle Defenders - Initializing...');
    console.log('Canvas size:', canvas.width, 'x', canvas.height);
    
    // Create game instance
    game = new Game(canvas, ctx);
    
    // Start game loop
    requestAnimationFrame((time) => game.gameLoop(time));
    
    console.log('Game loop started! Press S to begin playing.');
}

// Start game when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
