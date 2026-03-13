const CONFIG = {
    canvasWidth: 960,
    canvasHeight: 540,
    gridSize: 32,
    maxDelta: 0.05,
    uiRefreshHz: 12,
    player: {
        radius: 14,
        baseHull: 100,
        baseShield: 60,
        speed: 200
    }
};

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = CONFIG.player.radius;
        this.hull = CONFIG.player.baseHull;
        this.maxHull = CONFIG.player.baseHull;
        this.shield = CONFIG.player.baseShield;
        this.maxShield = CONFIG.player.baseShield;
        this.facing = 0;
        this.corePulse = 0;
        this.vx = 0;
        this.vy = 0;
        this.speed = CONFIG.player.speed;
    }

    update(deltaTime, keys, canvas) {
        this.corePulse += deltaTime * 4;

        let moveX = 0;
        let moveY = 0;

        if (keys.has('w') || keys.has('arrowup')) moveY -= 1;
        if (keys.has('s') || keys.has('arrowdown')) moveY += 1;
        if (keys.has('a') || keys.has('arrowleft')) moveX -= 1;
        if (keys.has('d') || keys.has('arrowright')) moveX += 1;

        if (moveX !== 0 || moveY !== 0) {
            const magnitude = Math.sqrt(moveX * moveX + moveY * moveY);
            this.vx = (moveX / magnitude) * this.speed;
            this.vy = (moveY / magnitude) * this.speed;
        } else {
            this.vx = 0;
            this.vy = 0;
        }

        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
    }

    render(ctx) {
        const pulse = 0.35 + Math.sin(this.corePulse * 2) * 0.2;

        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.beginPath();
        ctx.arc(0, 0, this.radius + 7, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(103, 214, 121, ${0.35 + pulse})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        const bodyGradient = ctx.createRadialGradient(-5, -5, 2, 0, 0, this.radius);
        bodyGradient.addColorStop(0, '#e3fff1');
        bodyGradient.addColorStop(0.45, '#67d679');
        bodyGradient.addColorStop(1, '#1b7031');
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.rotate(this.facing);
        ctx.fillStyle = '#d8f2f3';
        ctx.beginPath();
        ctx.moveTo(this.radius - 2, 0);
        ctx.lineTo(this.radius + 9, -4);
        ctx.lineTo(this.radius + 9, 4);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.ui = {
            gameState: document.getElementById('gameState'),
            waveCounter: document.getElementById('waveCounter'),
            creditCounter: document.getElementById('creditCounter'),
            integrityCounter: document.getElementById('integrityCounter'),
            playerHull: document.getElementById('playerHull'),
            playerShield: document.getElementById('playerShield'),
            startBtn: document.getElementById('startBtn'),
            resetBtn: document.getElementById('resetBtn'),
            bootOverlay: document.getElementById('bootOverlay')
        };

        this.state = 'waiting';
        this.wave = 0;
        this.credits = 0;
        this.integrity = 100;

        this.mouse = { x: 0, y: 0, inCanvas: false };
        this.keys = new Set();

        this.entities = {
            player: null,
            enemies: [],
            projectiles: [],
            pickups: [],
            effects: []
        };

        this.time = {
            lastFrame: 0,
            uiAccumulator: 0,
            elapsed: 0,
            frameCount: 0
        };

        this.spawnPlayer();

        this.resizeCanvas();
        this.bindEvents();
        this.syncUI();
        this.renderBootScreen();

        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    bindEvents() {
        this.ui.startBtn.addEventListener('click', () => this.start());
        this.ui.resetBtn.addEventListener('click', () => this.reset());

        window.addEventListener('keydown', (event) => {
            this.keys.add(event.key.toLowerCase());
        });

        window.addEventListener('keyup', (event) => {
            this.keys.delete(event.key.toLowerCase());
        });

        this.canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = (event.clientX - rect.left) * (this.canvas.width / rect.width);
            this.mouse.y = (event.clientY - rect.top) * (this.canvas.height / rect.height);
            this.mouse.inCanvas = true;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.inCanvas = false;
        });

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = CONFIG.canvasWidth;
        this.canvas.height = CONFIG.canvasHeight;
    }

    setState(nextState) {
        this.state = nextState;
        this.syncUI();
    }

    start() {
        if (this.state === 'running') {
            return;
        }

        this.setState('running');
        this.ui.bootOverlay.style.display = 'none';
    }

    reset() {
        this.wave = 0;
        this.credits = 0;
        this.integrity = 100;

        this.spawnPlayer();
        this.entities.enemies = [];
        this.entities.projectiles = [];
        this.entities.pickups = [];
        this.entities.effects = [];

        this.setState('waiting');
        this.ui.bootOverlay.style.display = 'flex';
        this.renderBootScreen();
    }

    syncUI() {
        this.ui.gameState.textContent = this.state;
        this.ui.waveCounter.textContent = String(this.wave);
        this.ui.creditCounter.textContent = String(this.credits);
        this.ui.integrityCounter.textContent = `${Math.max(0, Math.round(this.integrity))}%`;

        if (this.entities.player) {
            this.ui.playerHull.textContent = `${Math.round(this.entities.player.hull)} / ${this.entities.player.maxHull}`;
            this.ui.playerShield.textContent = `${Math.round(this.entities.player.shield)} / ${this.entities.player.maxShield}`;
        }
    }

    spawnPlayer() {
        this.entities.player = new Player(this.canvas.width * 0.5, this.canvas.height * 0.5);
    }

    update(deltaTime) {
        this.time.elapsed += deltaTime;
        this.time.uiAccumulator += deltaTime;
        this.time.frameCount += 1;

        if (this.entities.player) {
            this.entities.player.update(deltaTime, this.keys, this.canvas);

            if (this.mouse.inCanvas) {
                const dx = this.mouse.x - this.entities.player.x;
                const dy = this.mouse.y - this.entities.player.y;
                this.entities.player.facing = Math.atan2(dy, dx);
            }
        }

        if (this.time.uiAccumulator >= 1 / CONFIG.uiRefreshHz) {
            this.syncUI();
            this.time.uiAccumulator = 0;
        }
    }

    renderGrid() {
        const { ctx, canvas } = this;

        ctx.strokeStyle = 'rgba(61, 194, 198, 0.18)';
        ctx.lineWidth = 1;

        for (let x = 0; x <= canvas.width; x += CONFIG.gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        for (let y = 0; y <= canvas.height; y += CONFIG.gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    renderBootScreen() {
        const { ctx, canvas } = this;
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#08131b');
        gradient.addColorStop(0.5, '#123144');
        gradient.addColorStop(1, '#183a3b');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.renderGrid();

        ctx.fillStyle = 'rgba(231, 248, 248, 0.9)';
        ctx.font = 'bold 36px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText('Chrono Bastion', canvas.width / 2, canvas.height / 2 - 12);

        ctx.fillStyle = 'rgba(159, 184, 188, 0.95)';
        ctx.font = '18px Segoe UI';
        ctx.fillText('Commit 4: Movement Controls Active', canvas.width / 2, canvas.height / 2 + 24);
    }

    renderRunningFrame() {
        const { ctx, canvas } = this;

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#08131b');
        gradient.addColorStop(0.5, '#123144');
        gradient.addColorStop(1, '#183a3b');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.renderGrid();

        if (this.mouse.inCanvas) {
            const snappedX = Math.floor(this.mouse.x / CONFIG.gridSize) * CONFIG.gridSize;
            const snappedY = Math.floor(this.mouse.y / CONFIG.gridSize) * CONFIG.gridSize;

            ctx.fillStyle = 'rgba(103, 214, 121, 0.16)';
            ctx.fillRect(snappedX, snappedY, CONFIG.gridSize, CONFIG.gridSize);
            ctx.strokeStyle = 'rgba(103, 214, 121, 0.75)';
            ctx.strokeRect(snappedX + 1, snappedY + 1, CONFIG.gridSize - 2, CONFIG.gridSize - 2);
        }

        if (this.entities.player) {
            this.entities.player.render(ctx);
        }

        ctx.fillStyle = 'rgba(159, 184, 188, 0.95)';
        ctx.font = '16px Segoe UI';
        ctx.textAlign = 'left';
        ctx.fillText('Use WASD or Arrow Keys to move. Mouse aims your weapon.', 20, 34);
    }

    render() {
        if (this.state === 'running') {
            this.renderRunningFrame();
            return;
        }

        this.renderBootScreen();
    }

    loop(timestamp) {
        if (this.time.lastFrame === 0) {
            this.time.lastFrame = timestamp;
        }

        const deltaSeconds = Math.min((timestamp - this.time.lastFrame) / 1000, CONFIG.maxDelta);
        this.time.lastFrame = timestamp;

        this.update(deltaSeconds);
        this.render();

        requestAnimationFrame(this.loop);
    }
}

const game = new Game();
