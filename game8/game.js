// Commit 1: Basic HTML Structure and Canvas Setup

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

        // Initialize
        this.init();
    }

    init() {
        console.log('🎮 Dungeon Crawler RPG - Commit 1: Basic Setup');
        console.log('Canvas:', this.width, 'x', this.height);
        
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
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.state === 'playing') {
                    this.togglePause();
                }
            }
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
        const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
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

        // Update game logic (will be implemented in future commits)
        this.update(deltaTime);

        // Render game
        this.render();

        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        // Game logic will be added in future commits
        // For now, this is a placeholder
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw grid pattern (for visualization in Commit 1)
        this.drawGrid();

        // Draw center text
        this.drawCenterText();
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
            this.ctx.fillText('🗡️ DUNGEON CRAWLER RPG', this.width / 2, this.height / 2 - 20);
            
            this.ctx.font = '20px Arial';
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.fillText('Commit 1: Basic Setup Complete', this.width / 2, this.height / 2 + 20);
            
            this.ctx.font = '16px Arial';
            this.ctx.fillText('Player and gameplay coming in next commits...', this.width / 2, this.height / 2 + 50);
        }
    }

    updateUI() {
        // Update debug info
        document.getElementById('fps').textContent = this.fps;
        document.getElementById('gameState').textContent = this.state;
        
        // Update player stats (placeholder values for Commit 1)
        document.getElementById('playerHealth').textContent = '100/100';
        document.getElementById('playerAttack').textContent = '10';
        document.getElementById('playerDefense').textContent = '5';
        document.getElementById('playerLevel').textContent = '1';
        document.getElementById('playerGold').textContent = '0';
        document.getElementById('currentFloor').textContent = '1';
    }
}

// Initialize game when page loads
let game;
window.addEventListener('load', () => {
    game = new Game();
});
