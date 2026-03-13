const CONFIG = {
    canvasWidth: 960,
    canvasHeight: 540,
    gridSize: 32,
    maxDelta: 0.05,
    uiRefreshHz: 12
};

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.ui = {
            gameState: document.getElementById('gameState'),
            waveCounter: document.getElementById('waveCounter'),
            creditCounter: document.getElementById('creditCounter'),
            integrityCounter: document.getElementById('integrityCounter'),
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
    }

    update(deltaTime) {
        this.time.elapsed += deltaTime;
        this.time.uiAccumulator += deltaTime;
        this.time.frameCount += 1;

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
        ctx.fillText('Commit 2: Game Class Foundation Online', canvas.width / 2, canvas.height / 2 + 24);
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

        ctx.fillStyle = 'rgba(159, 184, 188, 0.95)';
        ctx.font = '16px Segoe UI';
        ctx.textAlign = 'left';
        ctx.fillText('Core systems initialized. Player and movement arrive in the next commits.', 20, 34);
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
