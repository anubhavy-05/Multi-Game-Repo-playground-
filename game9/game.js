"use strict";

const CONFIG = {
    canvasWidth: 1280,
    canvasHeight: 720,
    gridSize: 40,
    targetFps: 60,
    uiRefreshMs: 120,
    player: {
        radius: 22,
        maxHealth: 100,
        maxEnergy: 100,
        bodyColor: "#5fd0ff",
        trimColor: "#dcf5ff",
        shadowColor: "rgba(0, 0, 0, 0.34)",
        headingColor: "#ffd37b"
    },
    colors: {
        backgroundTop: "#07111d",
        backgroundBottom: "#0d2236",
        gridColor: "rgba(120, 180, 220, 0.12)",
        heading: "#d8f2ff",
        subText: "#8fb5c8"
    }
};

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = CONFIG.player.radius;
        this.maxHealth = CONFIG.player.maxHealth;
        this.health = this.maxHealth;
        this.maxEnergy = CONFIG.player.maxEnergy;
        this.energy = this.maxEnergy;
        this.facing = { x: 1, y: 0 };
        this.phase = 0;
    }

    update(deltaMs) {
        this.phase += deltaMs * 0.006;
    }

    draw(ctx) {
        const bob = Math.sin(this.phase) * 1.8;
        const drawY = this.y + bob;

        ctx.fillStyle = CONFIG.player.shadowColor;
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + this.radius + 8, this.radius * 0.92, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        const bodyGradient = ctx.createRadialGradient(
            this.x - this.radius * 0.35,
            drawY - this.radius * 0.45,
            this.radius * 0.15,
            this.x,
            drawY,
            this.radius * 1.1
        );
        bodyGradient.addColorStop(0, CONFIG.player.trimColor);
        bodyGradient.addColorStop(1, CONFIG.player.bodyColor);

        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.arc(this.x, drawY, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();

        const headingLength = this.radius * 0.75;
        const headingX = this.x + this.facing.x * headingLength;
        const headingY = drawY + this.facing.y * headingLength;

        ctx.strokeStyle = CONFIG.player.headingColor;
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(this.x, drawY);
        ctx.lineTo(headingX, headingY);
        ctx.stroke();
        ctx.lineCap = "butt";

        ctx.fillStyle = "rgba(8, 18, 28, 0.7)";
        ctx.beginPath();
        ctx.arc(this.x, drawY, this.radius * 0.38, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Game {
    constructor(canvas, ui) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ui = ui;

        this.state = {
            mode: "booting",
            running: false,
            score: 0,
            wave: 0,
            playerHealth: CONFIG.player.maxHealth,
            playerEnergy: CONFIG.player.maxEnergy,
            elapsedMs: 0,
            fps: 0
        };

        this.world = {
            player: null,
            enemies: [],
            projectiles: [],
            obstacles: [],
            pickups: [],
            particles: []
        };

        this.loop = {
            frameId: 0,
            previousTime: 0,
            uiClock: 0
        };

        this.tick = this.tick.bind(this);
        this.handleResize = this.handleResize.bind(this);

        this.initialize();
    }

    initialize() {
        if (!this.ctx) {
            this.setMode("canvas-error");
            return;
        }

        this.canvas.width = CONFIG.canvasWidth;
        this.canvas.height = CONFIG.canvasHeight;

        this.createPlayer();

        this.bindUiEvents();
        this.handleResize();
        window.addEventListener("resize", this.handleResize);

        this.setMode("ready");
        this.updateHud(true);
        this.render();
    }

    createPlayer() {
        this.world.player = new Player(CONFIG.canvasWidth * 0.5, CONFIG.canvasHeight * 0.56);
        this.state.playerHealth = this.world.player.health;
        this.state.playerEnergy = this.world.player.energy;
    }

    bindUiEvents() {
        const { startBtn, pauseBtn, resetBtn } = this.ui;

        if (startBtn) {
            startBtn.addEventListener("click", () => this.start());
        }

        if (pauseBtn) {
            pauseBtn.addEventListener("click", () => this.togglePause());
        }

        if (resetBtn) {
            resetBtn.addEventListener("click", () => this.reset());
        }
    }

    setMode(nextMode) {
        this.state.mode = nextMode;

        if (this.ui.stateEl) {
            this.ui.stateEl.textContent = nextMode;
        }

        if (this.ui.bootOverlay) {
            const activeText = {
                booting: "Booting systems...",
                ready: "Commit 3: Player entity initialized.",
                running: "Simulation active.",
                paused: "Simulation paused.",
                reset: "Simulation reset.",
                "canvas-error": "Canvas context failed to initialize."
            };
            this.ui.bootOverlay.querySelector("p").textContent = activeText[nextMode] || "System idle.";
        }
    }

    start() {
        if (this.state.running) {
            return;
        }

        this.state.running = true;
        this.loop.previousTime = performance.now();
        this.setMode("running");
        this.loop.frameId = requestAnimationFrame(this.tick);
    }

    togglePause() {
        if (!this.state.running) {
            return;
        }

        if (this.state.mode === "paused") {
            this.setMode("running");
            this.loop.previousTime = performance.now();
            this.loop.frameId = requestAnimationFrame(this.tick);
            return;
        }

        this.setMode("paused");
        cancelAnimationFrame(this.loop.frameId);
    }

    reset() {
        cancelAnimationFrame(this.loop.frameId);
        this.state.running = false;
        this.state.elapsedMs = 0;
        this.state.score = 0;
        this.state.wave = 0;
        this.state.playerHealth = CONFIG.player.maxHealth;
        this.state.playerEnergy = CONFIG.player.maxEnergy;
        this.state.fps = 0;
        this.loop.uiClock = 0;
        this.world.enemies.length = 0;
        this.world.projectiles.length = 0;
        this.world.obstacles.length = 0;
        this.world.pickups.length = 0;
        this.world.particles.length = 0;
        this.createPlayer();
        this.setMode("reset");
        this.updateHud(true);
        this.render();
    }

    tick(now) {
        if (this.state.mode !== "running") {
            return;
        }

        const deltaMs = Math.min(100, now - this.loop.previousTime);
        this.loop.previousTime = now;
        this.state.elapsedMs += deltaMs;
        this.state.fps = Math.max(1, Math.round(1000 / Math.max(deltaMs, 1)));

        this.update(deltaMs);
        this.render();

        this.loop.uiClock += deltaMs;
        if (this.loop.uiClock >= CONFIG.uiRefreshMs) {
            this.updateHud();
            this.loop.uiClock = 0;
        }

        this.loop.frameId = requestAnimationFrame(this.tick);
    }

    update(_deltaMs) {
        if (this.world.player) {
            this.world.player.update(_deltaMs);
            this.state.playerHealth = Math.round(this.world.player.health);
            this.state.playerEnergy = Math.round(this.world.player.energy);
        }
    }

    render() {
        const { ctx, canvas } = this;

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, CONFIG.colors.backgroundTop);
        gradient.addColorStop(1, CONFIG.colors.backgroundBottom);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.drawGrid();
        this.drawArenaMarkers();
        this.drawPlayer();
        this.drawDebugBanner();
    }

    drawArenaMarkers() {
        const { ctx, canvas } = this;
        ctx.strokeStyle = "rgba(88, 196, 255, 0.24)";
        ctx.lineWidth = 2;
        ctx.strokeRect(70, 70, canvas.width - 140, canvas.height - 140);

        ctx.fillStyle = "rgba(181, 236, 255, 0.5)";
        ctx.font = "600 16px Trebuchet MS";
        ctx.textAlign = "left";
        ctx.fillText("Arena initialized", 82, 96);
    }

    drawPlayer() {
        if (!this.world.player) {
            return;
        }

        this.world.player.draw(this.ctx);
    }

    drawGrid() {
        const { ctx, canvas } = this;
        ctx.strokeStyle = CONFIG.colors.gridColor;
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

    drawDebugBanner() {
        const { ctx, canvas, state } = this;
        ctx.textAlign = "center";
        ctx.fillStyle = CONFIG.colors.heading;
        ctx.font = "700 44px Trebuchet MS";
        ctx.fillText("ECLIPSE SIEGE", canvas.width * 0.5, canvas.height * 0.44);

        ctx.fillStyle = CONFIG.colors.subText;
        ctx.font = "400 20px Trebuchet MS";
        ctx.fillText(`Commit 3: Player rendered (${state.mode})`, canvas.width * 0.5, canvas.height * 0.51);
    }

    updateHud(force) {
        if (!force && this.state.mode === "running") {
            // Running-mode updates are already throttled in tick().
        }

        if (this.ui.healthEl) {
            this.ui.healthEl.textContent = String(this.state.playerHealth);
        }

        if (this.ui.energyEl) {
            this.ui.energyEl.textContent = String(this.state.playerEnergy);
        }

        if (this.ui.scoreEl) {
            this.ui.scoreEl.textContent = String(this.state.score);
        }

        if (this.ui.waveEl) {
            this.ui.waveEl.textContent = String(this.state.wave);
        }

        if (this.ui.fpsEl) {
            this.ui.fpsEl.textContent = String(this.state.fps);
        }
    }

    handleResize() {
        const panel = this.canvas.parentElement;
        if (!panel) {
            return;
        }

        const maxWidth = panel.clientWidth;
        const scale = Math.min(1, maxWidth / CONFIG.canvasWidth);
        this.canvas.style.width = `${Math.floor(CONFIG.canvasWidth * scale)}px`;
    }
}

function buildUiRefs() {
    return {
        stateEl: document.getElementById("gameState"),
        healthEl: document.getElementById("playerHealth"),
        energyEl: document.getElementById("playerEnergy"),
        scoreEl: document.getElementById("scoreValue"),
        waveEl: document.getElementById("waveValue"),
        fpsEl: document.getElementById("fpsValue"),
        startBtn: document.getElementById("startBtn"),
        pauseBtn: document.getElementById("pauseBtn"),
        resetBtn: document.getElementById("resetBtn"),
        bootOverlay: document.getElementById("bootOverlay")
    };
}

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    if (!canvas) {
        return;
    }

    window.eclipseSiegeGame = new Game(canvas, buildUiRefs());
});
