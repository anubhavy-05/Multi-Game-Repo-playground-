// Castle Defenders - Tower Defense RPG
// Commit 1: Basic HTML structure and canvas setup

// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
const gameState = {
    gold: 100,
    mana: 50,
    lives: 25,
    wave: 1,
    isPaused: false,
    gameOver: false
};

// Initialize game
function initGame() {
    console.log('Castle Defenders - Initializing...');
    console.log('Canvas size:', canvas.width, 'x', canvas.height);
    
    // Update UI
    updateUI();
    
    // Draw initial canvas state
    drawInitialState();
}

// Update UI elements
function updateUI() {
    document.getElementById('gold').textContent = gameState.gold;
    document.getElementById('mana').textContent = gameState.mana;
    document.getElementById('lives').textContent = gameState.lives;
    document.getElementById('wave').textContent = gameState.wave;
}

// Draw initial canvas state
function drawInitialState() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw welcome message
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Castle Defenders', canvas.width / 2, canvas.height / 2 - 40);
    
    ctx.font = '18px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('Tower Defense RPG', canvas.width / 2, canvas.height / 2);
    
    ctx.font = '16px Arial';
    ctx.fillStyle = '#a0aec0';
    ctx.fillText('Commit 1: Basic Structure Complete ✓', canvas.width / 2, canvas.height / 2 + 40);
    ctx.fillText('Ready for development...', canvas.width / 2, canvas.height / 2 + 70);
}

// Start game when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
