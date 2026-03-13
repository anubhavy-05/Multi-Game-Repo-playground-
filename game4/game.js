const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const stateText = document.getElementById('gameState');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

function drawBootScreen() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#08131b');
    gradient.addColorStop(0.5, '#123144');
    gradient.addColorStop(1, '#183a3b');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(61, 194, 198, 0.18)';
    ctx.lineWidth = 1;

    for (let x = 0; x <= canvas.width; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    ctx.fillStyle = 'rgba(231, 248, 248, 0.9)';
    ctx.font = 'bold 36px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('Chrono Bastion', canvas.width / 2, canvas.height / 2 - 12);

    ctx.fillStyle = 'rgba(159, 184, 188, 0.95)';
    ctx.font = '18px Segoe UI';
    ctx.fillText('Commit 1: Canvas and Interface Ready', canvas.width / 2, canvas.height / 2 + 24);
}

function setState(newState) {
    stateText.textContent = newState;
}

startBtn.addEventListener('click', () => {
    setState('initialized');
});

resetBtn.addEventListener('click', () => {
    setState('waiting');
    drawBootScreen();
});

drawBootScreen();
