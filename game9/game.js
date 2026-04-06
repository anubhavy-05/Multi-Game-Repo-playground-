"use strict";

const CONFIG = {
    canvasWidth: 1280,
    canvasHeight: 720,
    gridSize: 40,
    targetFps: 60,
    uiRefreshMs: 120,
    colors: {
        backgroundTop: "#07111d",
        backgroundBottom: "#0d2236",
        gridColor: "rgba(120, 180, 220, 0.12)",
        heading: "#d8f2ff",
        subText: "#8fb5c8"
    }
};

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
            playerHealth: 0,
            playerEnergy: 0,
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

        this.bindUiEvents();
        this.handleResize();
        window.addEventListener("resize", this.handleResize);

        this.setMode("ready");
        this.updateHud(true);
        this.render();
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
                ready: "Commit 2: Core Game class initialized.",
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
        this.state.playerHealth = 0;
        this.state.playerEnergy = 0;
        this.state.fps = 0;
        this.loop.uiClock = 0;
        this.world.enemies.length = 0;
        this.world.projectiles.length = 0;
        this.world.obstacles.length = 0;
        this.world.pickups.length = 0;
        this.world.particles.length = 0;
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
        // Reserved for gameplay systems introduced in later commits.
    }

    render() {
        const { ctx, canvas } = this;

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, CONFIG.colors.backgroundTop);
        gradient.addColorStop(1, CONFIG.colors.backgroundBottom);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.drawGrid();
        this.drawDebugBanner();
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
        ctx.fillText(`Commit 2: Game class active (${state.mode})`, canvas.width * 0.5, canvas.height * 0.51);
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
