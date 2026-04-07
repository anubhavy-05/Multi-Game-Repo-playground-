"use strict";

const CONFIG = {
    canvasWidth: 1280,
    canvasHeight: 720,
    gridSize: 40,
    targetFps: 60,
    uiRefreshMs: 120,
    player: {
        radius: 22,
        speed: 280,
        maxHealth: 100,
        maxEnergy: 100,
        startingLives: 3,
        contactDamage: 28,
        respawnInvulnerableMs: 1800,
        bodyColor: "#5fd0ff",
        trimColor: "#dcf5ff",
        shadowColor: "rgba(0, 0, 0, 0.34)",
        headingColor: "#ffd37b"
    },
    enemy: {
        minRadius: 14,
        maxRadius: 22,
        minSpeed: 70,
        maxSpeed: 130,
        spawnIntervalMs: 1500,
        maxAlive: 14,
        colors: ["#ff6f91", "#ff9671", "#ffc75f", "#f9f871"]
    },
    obstacle: {
        color: "rgba(80, 113, 140, 0.72)",
        border: "rgba(186, 219, 242, 0.6)",
        count: 5
    },
    collision: {
        contactCooldownMs: 320,
        playerFlashMs: 140,
        enemySeparationPush: 2,
        obstaclePadding: 2
    },
    score: {
        basePerSecond: 12,
        crowdBonusFactor: 0.08,
        impactPenalty: 8,
        cleanWindowMs: 4000,
        multiplierStep: 0.25,
        maxMultiplier: 3.5
    },
    wave: {
        startingWave: 1,
        baseEnemyCount: 6,
        enemyGrowthPerWave: 2,
        intermissionMs: 3500,
        baseSpawnIntervalMs: 1400,
        spawnIntervalDecayMs: 80,
        minSpawnIntervalMs: 520,
        enemyLifetimeMs: 10500
    },
    powerUps: {
        spawnCheckMs: 1800,
        randomSpawnChance: 0.22,
        spawnOnEscapeChance: 0.18,
        maxPickups: 4,
        pickupLifeMs: 12000,
        types: {
            heal: { label: "Heal", color: "#60e889", durationMs: 0, amount: 20 },
            energy: { label: "Energy", color: "#79d3ff", durationMs: 0, amount: 25 },
            shield: { label: "Shield", color: "#f7d26b", durationMs: 5500, amount: 0 },
            haste: { label: "Haste", color: "#ff9f66", durationMs: 5000, amount: 70 },
            scoreBurst: { label: "Score Burst", color: "#f08dff", durationMs: 6500, amount: 0.8 }
        }
    },
    colors: {
        backgroundTop: "#07111d",
        backgroundBottom: "#0d2236",
        gridColor: "rgba(120, 180, 220, 0.12)",
        heading: "#d8f2ff",
        subText: "#8fb5c8"
    }
};

class Enemy {
    constructor(x, y, radius, speed, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.color = color;
        this.health = 20;
        this.phase = Math.random() * Math.PI * 2;
        this.contactCooldown = 0;
        this.ageMs = 0;
        this.maxAgeMs = CONFIG.wave.enemyLifetimeMs;
    }

    update(deltaMs, target, bounds) {
        this.phase += deltaMs * 0.006;
        this.contactCooldown = Math.max(0, this.contactCooldown - deltaMs);
        this.ageMs += deltaMs;

        const toTargetX = target.x - this.x;
        const toTargetY = target.y - this.y;
        const dist = Math.hypot(toTargetX, toTargetY) || 1;
        const dirX = toTargetX / dist;
        const dirY = toTargetY / dist;

        const deltaSeconds = deltaMs / 1000;
        this.x += dirX * this.speed * deltaSeconds;
        this.y += dirY * this.speed * deltaSeconds;

        const minX = bounds.left + this.radius;
        const maxX = bounds.right - this.radius;
        const minY = bounds.top + this.radius;
        const maxY = bounds.bottom - this.radius;
        this.x = Math.max(minX, Math.min(maxX, this.x));
        this.y = Math.max(minY, Math.min(maxY, this.y));

        return this.ageMs >= this.maxAgeMs;
    }

    draw(ctx) {
        const pulse = 1 + Math.sin(this.phase) * 0.05;
        const drawRadius = this.radius * pulse;

        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + drawRadius + 6, drawRadius * 0.85, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        const body = ctx.createRadialGradient(
            this.x - drawRadius * 0.28,
            this.y - drawRadius * 0.34,
            drawRadius * 0.12,
            this.x,
            this.y,
            drawRadius
        );
        body.addColorStop(0, "#fff6eb");
        body.addColorStop(1, this.color);

        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.arc(this.x, this.y, drawRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(20, 34, 48, 0.86)";
        ctx.beginPath();
        ctx.arc(this.x - drawRadius * 0.26, this.y - drawRadius * 0.1, drawRadius * 0.14, 0, Math.PI * 2);
        ctx.arc(this.x + drawRadius * 0.26, this.y - drawRadius * 0.1, drawRadius * 0.14, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Obstacle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    draw(ctx) {
        ctx.fillStyle = CONFIG.obstacle.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = CONFIG.obstacle.border;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "rgba(220, 240, 255, 0.2)";
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.22, this.y - this.radius * 0.22, this.radius * 0.35, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Pickup {
    constructor(x, y, typeKey, spec) {
        this.x = x;
        this.y = y;
        this.typeKey = typeKey;
        this.spec = spec;
        this.radius = 14;
        this.lifeMs = CONFIG.powerUps.pickupLifeMs;
        this.phase = Math.random() * Math.PI * 2;
    }

    update(deltaMs) {
        this.phase += deltaMs * 0.007;
        this.lifeMs -= deltaMs;
        return this.lifeMs <= 0;
    }

    draw(ctx) {
        const pulse = 1 + Math.sin(this.phase) * 0.08;
        const r = this.radius * pulse;

        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.beginPath();
        ctx.ellipse(this.x, this.y + r + 5, r * 0.8, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = this.spec.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "rgba(12, 22, 34, 0.86)";
        ctx.font = "700 10px Trebuchet MS";
        ctx.textAlign = "center";
        ctx.fillText(this.spec.label.charAt(0), this.x, this.y + 3);
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = CONFIG.player.radius;
        this.speed = CONFIG.player.speed;
        this.maxHealth = CONFIG.player.maxHealth;
        this.health = this.maxHealth;
        this.maxEnergy = CONFIG.player.maxEnergy;
        this.energy = this.maxEnergy;
        this.facing = { x: 1, y: 0 };
        this.phase = 0;
        this.flashMs = 0;
        this.invulnerableMs = 0;
    }

    update(deltaMs) {
        this.phase += deltaMs * 0.006;
        this.flashMs = Math.max(0, this.flashMs - deltaMs);
        this.invulnerableMs = Math.max(0, this.invulnerableMs - deltaMs);
    }

    move(input, bounds, deltaMs) {
        const left = input.isDown("arrowleft") || input.isDown("a");
        const right = input.isDown("arrowright") || input.isDown("d");
        const up = input.isDown("arrowup") || input.isDown("w");
        const down = input.isDown("arrowdown") || input.isDown("s");

        const axisX = (right ? 1 : 0) - (left ? 1 : 0);
        const axisY = (down ? 1 : 0) - (up ? 1 : 0);

        if (axisX === 0 && axisY === 0) {
            return;
        }

        const magnitude = Math.hypot(axisX, axisY) || 1;
        const dirX = axisX / magnitude;
        const dirY = axisY / magnitude;

        this.facing.x = dirX;
        this.facing.y = dirY;

        const deltaSeconds = deltaMs / 1000;
        this.x += dirX * this.speed * deltaSeconds;
        this.y += dirY * this.speed * deltaSeconds;

        const minX = bounds.left + this.radius;
        const maxX = bounds.right - this.radius;
        const minY = bounds.top + this.radius;
        const maxY = bounds.bottom - this.radius;

        this.x = Math.max(minX, Math.min(maxX, this.x));
        this.y = Math.max(minY, Math.min(maxY, this.y));
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

        if (this.flashMs > 0) {
            const alpha = 0.25 + (this.flashMs / CONFIG.collision.playerFlashMs) * 0.35;
            ctx.strokeStyle = "rgba(255, 120, 120, " + String(Math.min(0.65, alpha)) + ")";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(this.x, drawY, this.radius + 6, 0, Math.PI * 2);
            ctx.stroke();
        }

        if (this.invulnerableMs > 0) {
            const pulse = 0.2 + Math.abs(Math.sin(this.phase * 2.2)) * 0.45;
            ctx.strokeStyle = "rgba(126, 235, 255, " + String(Math.min(0.7, pulse)) + ")";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(this.x, drawY, this.radius + 12, 0, Math.PI * 2);
            ctx.stroke();
        }
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
            highScore: 0,
            scoreMultiplier: 1,
            scoreBonusMultiplier: 1,
            wave: CONFIG.wave.startingWave,
            wavePhase: "intermission",
            waveEnemiesToSpawn: 0,
            waveEnemiesSpawned: 0,
            waveEscaped: 0,
            waveDefeated: 0,
            playerHealth: CONFIG.player.maxHealth,
            playerLives: CONFIG.player.startingLives,
            playerEnergy: CONFIG.player.maxEnergy,
            impacts: 0,
            activePowerUp: "none",
            powerUpRemainingMs: 0,
            elapsedMs: 0,
            lastImpactAtMs: 0,
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
            uiClock: 0,
            enemySpawnClock: 0,
            waveClock: CONFIG.wave.intermissionMs,
            powerUpSpawnClock: 0
        };

        this.basePlayerSpeed = CONFIG.player.speed;

        this.input = {
            pressed: new Set(),
            isDown: (key) => this.input.pressed.has(key)
        };

        this.arenaBounds = {
            left: 70,
            top: 70,
            right: CONFIG.canvasWidth - 70,
            bottom: CONFIG.canvasHeight - 70
        };

        this.tick = this.tick.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        this.initialize();
    }

    initialize() {
        if (!this.ctx) {
            this.setMode("canvas-error");
            return;
        }

        this.canvas.width = CONFIG.canvasWidth;
        this.canvas.height = CONFIG.canvasHeight;

        this.createObstacles();
        this.createPlayer();

        this.bindUiEvents();
        this.bindInputEvents();
        this.handleResize();
        window.addEventListener("resize", this.handleResize);

        this.setupWave(this.state.wave);

        this.setMode("ready");
        this.updateHud(true);
        this.render();
    }

    setupWave(waveNumber) {
        this.state.wave = waveNumber;
        this.state.wavePhase = "intermission";
        this.state.waveEnemiesSpawned = 0;
        this.state.waveDefeated = 0;
        this.state.waveEscaped = 0;
        this.state.waveEnemiesToSpawn = CONFIG.wave.baseEnemyCount + (waveNumber - 1) * CONFIG.wave.enemyGrowthPerWave;
        this.loop.enemySpawnClock = 0;
        this.loop.waveClock = CONFIG.wave.intermissionMs;
    }

    startWave() {
        this.state.wavePhase = "active";
        this.loop.enemySpawnClock = 0;
    }

    finishWave() {
        this.state.wavePhase = "complete";
        this.loop.waveClock = CONFIG.wave.intermissionMs;
    }

    createPlayer() {
        this.world.player = new Player(CONFIG.canvasWidth * 0.5, CONFIG.canvasHeight * 0.56);
        this.state.playerHealth = this.world.player.health;
        this.state.playerLives = CONFIG.player.startingLives;
        this.state.playerEnergy = this.world.player.energy;
    }

    createObstacles() {
        this.world.obstacles.length = 0;
        const points = [
            { x: 290, y: 190, r: 34 },
            { x: 515, y: 340, r: 42 },
            { x: 760, y: 220, r: 36 },
            { x: 980, y: 430, r: 48 },
            { x: 410, y: 520, r: 38 }
        ];

        for (let i = 0; i < points.length; i += 1) {
            const p = points[i];
            this.world.obstacles.push(new Obstacle(p.x, p.y, p.r));
        }
    }

    spawnEnemy() {
        if (this.world.enemies.length >= CONFIG.enemy.maxAlive) {
            return false;
        }

        const side = Math.floor(Math.random() * 4);
        const padding = 20;
        let x = this.arenaBounds.left + padding;
        let y = this.arenaBounds.top + padding;

        if (side === 0) {
            x = this.arenaBounds.left + padding;
            y = this.arenaBounds.top + Math.random() * (this.arenaBounds.bottom - this.arenaBounds.top);
        } else if (side === 1) {
            x = this.arenaBounds.right - padding;
            y = this.arenaBounds.top + Math.random() * (this.arenaBounds.bottom - this.arenaBounds.top);
        } else if (side === 2) {
            x = this.arenaBounds.left + Math.random() * (this.arenaBounds.right - this.arenaBounds.left);
            y = this.arenaBounds.top + padding;
        } else {
            x = this.arenaBounds.left + Math.random() * (this.arenaBounds.right - this.arenaBounds.left);
            y = this.arenaBounds.bottom - padding;
        }

        const radius = CONFIG.enemy.minRadius + Math.random() * (CONFIG.enemy.maxRadius - CONFIG.enemy.minRadius);
        const speed = CONFIG.enemy.minSpeed + Math.random() * (CONFIG.enemy.maxSpeed - CONFIG.enemy.minSpeed);
        const color = CONFIG.enemy.colors[Math.floor(Math.random() * CONFIG.enemy.colors.length)];
        this.world.enemies.push(new Enemy(x, y, radius, speed, color));
        return true;
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

    bindInputEvents() {
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);
    }

    handleKeyDown(event) {
        const key = event.key.toLowerCase();
        const trackedKeys = ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"];

        if (!trackedKeys.includes(key)) {
            return;
        }

        event.preventDefault();
        this.input.pressed.add(key);
    }

    handleKeyUp(event) {
        this.input.pressed.delete(event.key.toLowerCase());
    }

    setMode(nextMode) {
        this.state.mode = nextMode;

        if (this.ui.stateEl) {
            this.ui.stateEl.textContent = nextMode;
        }

        if (this.ui.bootOverlay) {
            const activeText = {
                booting: "Booting systems...",
                ready: "Commit 10: Health and lives system initialized.",
                running: "Simulation active.",
                paused: "Simulation paused.",
                reset: "Simulation reset.",
                "game-over": "All lives lost. Reset to try again.",
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
        this.state.scoreMultiplier = 1;
        this.state.scoreBonusMultiplier = 1;
        this.state.wave = CONFIG.wave.startingWave;
        this.state.wavePhase = "intermission";
        this.state.waveEnemiesToSpawn = 0;
        this.state.waveEnemiesSpawned = 0;
        this.state.waveEscaped = 0;
        this.state.waveDefeated = 0;
        this.state.playerHealth = CONFIG.player.maxHealth;
        this.state.playerLives = CONFIG.player.startingLives;
        this.state.playerEnergy = CONFIG.player.maxEnergy;
        this.state.impacts = 0;
        this.state.activePowerUp = "none";
        this.state.powerUpRemainingMs = 0;
        this.state.lastImpactAtMs = 0;
        this.state.fps = 0;
        this.loop.uiClock = 0;
        this.loop.enemySpawnClock = 0;
        this.loop.waveClock = CONFIG.wave.intermissionMs;
        this.loop.powerUpSpawnClock = 0;
        this.world.enemies.length = 0;
        this.world.projectiles.length = 0;
        this.world.obstacles.length = 0;
        this.world.pickups.length = 0;
        this.world.particles.length = 0;
        this.createObstacles();
        this.createPlayer();
        this.setupWave(CONFIG.wave.startingWave);
        this.removePowerUpEffects();
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
            if (this.state.mode === "running") {
                this.world.player.move(this.input, this.arenaBounds, _deltaMs);

                this.updateWaveSystem(_deltaMs);

                this.updateEnemies(_deltaMs);
                this.updatePickups(_deltaMs);
                this.updatePowerUpTimer(_deltaMs);
                this.updateRandomPowerUpSpawns(_deltaMs);

                this.handleCollisions();
                this.updateScoring(_deltaMs);
            }

            this.world.player.update(_deltaMs);
            this.state.playerHealth = Math.round(this.world.player.health);
            this.state.playerLives = Math.max(0, this.state.playerLives);
            this.state.playerEnergy = Math.round(this.world.player.energy);
        }
    }

        applyPlayerDamage(amount) {
            const player = this.world.player;
            if (!player || player.invulnerableMs > 0 || this.state.mode !== "running") {
                return;
            }

            player.health = Math.max(0, player.health - amount);
            player.flashMs = CONFIG.collision.playerFlashMs;
            this.state.playerHealth = Math.round(player.health);

            if (player.health <= 0) {
                this.handleLifeLost();
            }
        }

        handleLifeLost() {
            this.state.playerLives -= 1;

            if (this.state.playerLives <= 0) {
                this.state.playerLives = 0;
                this.endGame();
                return;
            }

            this.respawnPlayer();
        }

        respawnPlayer() {
            const player = this.world.player;
            if (!player) {
                return;
            }

            player.x = CONFIG.canvasWidth * 0.5;
            player.y = CONFIG.canvasHeight * 0.56;
            player.health = player.maxHealth;
            player.invulnerableMs = CONFIG.player.respawnInvulnerableMs;
            player.flashMs = 0;
            this.state.playerHealth = player.health;
        }

        endGame() {
            this.removePowerUpEffects();
            this.state.running = false;
            this.setMode("game-over");
            this.updateHud(true);
        }

    updateWaveSystem(deltaMs) {
        if (this.state.wavePhase === "intermission" || this.state.wavePhase === "complete") {
            this.loop.waveClock -= deltaMs;
            if (this.loop.waveClock <= 0) {
                if (this.state.wavePhase === "complete") {
                    this.setupWave(this.state.wave + 1);
                }
                this.startWave();
            }
            return;
        }

        if (this.state.wavePhase !== "active") {
            return;
        }

        const spawnInterval = Math.max(
            CONFIG.wave.minSpawnIntervalMs,
            CONFIG.wave.baseSpawnIntervalMs - (this.state.wave - 1) * CONFIG.wave.spawnIntervalDecayMs
        );

        this.loop.enemySpawnClock += deltaMs;
        while (
            this.loop.enemySpawnClock >= spawnInterval &&
            this.state.waveEnemiesSpawned < this.state.waveEnemiesToSpawn
        ) {
            this.loop.enemySpawnClock -= spawnInterval;
            if (this.spawnEnemy()) {
                this.state.waveEnemiesSpawned += 1;
            }
        }

        const allSpawned = this.state.waveEnemiesSpawned >= this.state.waveEnemiesToSpawn;
        if (allSpawned && this.world.enemies.length === 0) {
            this.finishWave();
        }
    }

    updateEnemies(deltaMs) {
        for (let i = this.world.enemies.length - 1; i >= 0; i -= 1) {
            const enemy = this.world.enemies[i];
            const expired = enemy.update(deltaMs, this.world.player, this.arenaBounds);
            if (expired) {
                this.world.enemies.splice(i, 1);
                this.state.waveEscaped += 1;
                if (Math.random() < CONFIG.powerUps.spawnOnEscapeChance) {
                    this.spawnPowerUpAt(enemy.x, enemy.y);
                }
            }
        }
    }

    updatePickups(deltaMs) {
        for (let i = this.world.pickups.length - 1; i >= 0; i -= 1) {
            const pickup = this.world.pickups[i];
            const expired = pickup.update(deltaMs);
            if (expired) {
                this.world.pickups.splice(i, 1);
            }
        }
    }

    updatePowerUpTimer(deltaMs) {
        if (this.state.powerUpRemainingMs <= 0) {
            return;
        }

        this.state.powerUpRemainingMs -= deltaMs;
        if (this.state.powerUpRemainingMs <= 0) {
            this.removePowerUpEffects();
        }
    }

    updateRandomPowerUpSpawns(deltaMs) {
        this.loop.powerUpSpawnClock += deltaMs;
        if (this.loop.powerUpSpawnClock < CONFIG.powerUps.spawnCheckMs) {
            return;
        }

        this.loop.powerUpSpawnClock = 0;
        if (this.world.pickups.length >= CONFIG.powerUps.maxPickups) {
            return;
        }

        if (Math.random() < CONFIG.powerUps.randomSpawnChance) {
            this.spawnPowerUpAt(
                this.arenaBounds.left + 40 + Math.random() * (this.arenaBounds.right - this.arenaBounds.left - 80),
                this.arenaBounds.top + 40 + Math.random() * (this.arenaBounds.bottom - this.arenaBounds.top - 80)
            );
        }
    }

    spawnPowerUpAt(x, y) {
        if (this.world.pickups.length >= CONFIG.powerUps.maxPickups) {
            return;
        }

        const keys = Object.keys(CONFIG.powerUps.types);
        const typeKey = keys[Math.floor(Math.random() * keys.length)];
        const spec = CONFIG.powerUps.types[typeKey];
        this.world.pickups.push(new Pickup(x, y, typeKey, spec));
    }

    applyPowerUp(pickup) {
        const typeKey = pickup.typeKey;
        const spec = pickup.spec;

        if (typeKey === "heal") {
            this.world.player.health = Math.min(this.world.player.maxHealth, this.world.player.health + spec.amount);
            return;
        }

        if (typeKey === "energy") {
            this.world.player.energy = Math.min(this.world.player.maxEnergy, this.world.player.energy + spec.amount);
            return;
        }

        this.removePowerUpEffects();

        if (typeKey === "shield") {
            this.state.activePowerUp = "Shield";
            this.state.powerUpRemainingMs = spec.durationMs;
            return;
        }

        if (typeKey === "haste") {
            this.state.activePowerUp = "Haste";
            this.state.powerUpRemainingMs = spec.durationMs;
            this.world.player.speed = this.basePlayerSpeed + spec.amount;
            return;
        }

        if (typeKey === "scoreBurst") {
            this.state.activePowerUp = "Score Burst";
            this.state.powerUpRemainingMs = spec.durationMs;
            this.state.scoreBonusMultiplier = 1 + spec.amount;
        }
    }

    removePowerUpEffects() {
        this.state.activePowerUp = "none";
        this.state.powerUpRemainingMs = 0;
        this.state.scoreBonusMultiplier = 1;
        if (this.world.player) {
            this.world.player.speed = this.basePlayerSpeed;
        }
    }

    handleCollisions() {
        this.resolvePlayerObstacleCollisions();
        this.resolveEnemyObstacleCollisions();
        this.resolveEnemyEnemyCollisions();
        this.resolvePlayerEnemyCollisions();
        this.resolvePlayerPickupCollisions();
    }

    updateScoring(deltaMs) {
        const cleanDuration = Math.max(0, this.state.elapsedMs - this.state.lastImpactAtMs);
        if (cleanDuration >= CONFIG.score.cleanWindowMs) {
            const fullWindows = Math.floor(cleanDuration / CONFIG.score.cleanWindowMs);
            const multiplier = 1 + fullWindows * CONFIG.score.multiplierStep;
            this.state.scoreMultiplier = Math.min(CONFIG.score.maxMultiplier, multiplier);
        } else {
            this.state.scoreMultiplier = 1;
        }

        const crowdFactor = 1 + this.world.enemies.length * CONFIG.score.crowdBonusFactor;
        const points = CONFIG.score.basePerSecond * (deltaMs / 1000) * crowdFactor * this.state.scoreMultiplier;
        this.state.score += points * this.state.scoreBonusMultiplier;

        if (this.state.wavePhase === "complete") {
            this.state.score += (this.state.wave * 10) * (deltaMs / 1000);
        }

        if (this.state.score > this.state.highScore) {
            this.state.highScore = this.state.score;
        }
    }

    circlesOverlap(a, b, padding) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const minDist = a.radius + b.radius + (padding || 0);
        return dx * dx + dy * dy < minDist * minDist;
    }

    separateCircles(a, b, share) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.0001;
        const overlap = a.radius + b.radius - dist;

        if (overlap <= 0) {
            return;
        }

        const nx = dx / dist;
        const ny = dy / dist;
        const pushA = overlap * (share ? 0.5 : 1);
        const pushB = overlap * 0.5;

        a.x -= nx * pushA;
        a.y -= ny * pushA;
        if (share) {
            b.x += nx * pushB;
            b.y += ny * pushB;
        }

        a.x = Math.max(this.arenaBounds.left + a.radius, Math.min(this.arenaBounds.right - a.radius, a.x));
        a.y = Math.max(this.arenaBounds.top + a.radius, Math.min(this.arenaBounds.bottom - a.radius, a.y));
        b.x = Math.max(this.arenaBounds.left + b.radius, Math.min(this.arenaBounds.right - b.radius, b.x));
        b.y = Math.max(this.arenaBounds.top + b.radius, Math.min(this.arenaBounds.bottom - b.radius, b.y));
    }

    resolvePlayerObstacleCollisions() {
        const player = this.world.player;
        for (let i = 0; i < this.world.obstacles.length; i += 1) {
            const obstacle = this.world.obstacles[i];
            if (this.circlesOverlap(player, obstacle, CONFIG.collision.obstaclePadding)) {
                this.separateCircles(player, obstacle, false);
            }
        }
    }

    resolveEnemyObstacleCollisions() {
        for (let i = 0; i < this.world.enemies.length; i += 1) {
            const enemy = this.world.enemies[i];
            for (let j = 0; j < this.world.obstacles.length; j += 1) {
                const obstacle = this.world.obstacles[j];
                if (this.circlesOverlap(enemy, obstacle, CONFIG.collision.obstaclePadding)) {
                    this.separateCircles(enemy, obstacle, false);
                }
            }
        }
    }

    resolveEnemyEnemyCollisions() {
        const enemies = this.world.enemies;
        for (let i = 0; i < enemies.length; i += 1) {
            for (let j = i + 1; j < enemies.length; j += 1) {
                const a = enemies[i];
                const b = enemies[j];
                if (this.circlesOverlap(a, b, 0)) {
                    this.separateCircles(a, b, true);
                }
            }
        }
    }

    resolvePlayerEnemyCollisions() {
        const player = this.world.player;
        for (let i = 0; i < this.world.enemies.length; i += 1) {
            const enemy = this.world.enemies[i];
            if (!this.circlesOverlap(player, enemy, 0)) {
                continue;
            }

            this.separateCircles(player, enemy, true);

            if (enemy.contactCooldown <= 0) {
                if (this.state.activePowerUp === "Shield") {
                    enemy.contactCooldown = CONFIG.collision.contactCooldownMs;
                    continue;
                }

                enemy.contactCooldown = CONFIG.collision.contactCooldownMs;
                this.applyPlayerDamage(CONFIG.player.contactDamage);
                this.state.impacts += 1;
                this.state.lastImpactAtMs = this.state.elapsedMs;
                this.state.score = Math.max(0, this.state.score - CONFIG.score.impactPenalty);
            }
        }
    }

    resolvePlayerPickupCollisions() {
        const player = this.world.player;
        for (let i = this.world.pickups.length - 1; i >= 0; i -= 1) {
            const pickup = this.world.pickups[i];
            if (this.circlesOverlap(player, pickup, 0)) {
                this.applyPowerUp(pickup);
                this.world.pickups.splice(i, 1);
            }
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
        this.drawObstacles();
        this.drawEnemies();
        this.drawPickups();
        this.drawPlayer();
        this.drawDebugBanner();
    }

    drawPickups() {
        for (let i = 0; i < this.world.pickups.length; i += 1) {
            this.world.pickups[i].draw(this.ctx);
        }
    }

    drawObstacles() {
        for (let i = 0; i < this.world.obstacles.length; i += 1) {
            this.world.obstacles[i].draw(this.ctx);
        }
    }

    drawEnemies() {
        for (let i = 0; i < this.world.enemies.length; i += 1) {
            this.world.enemies[i].draw(this.ctx);
        }
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
        ctx.fillText("Commit 10: Health and lives online (" + state.mode + ")", canvas.width * 0.5, canvas.height * 0.51);

        ctx.font = "400 16px Trebuchet MS";
        ctx.fillText("Survive with limited lives while collecting pickups for tactical advantage", canvas.width * 0.5, canvas.height * 0.55);
    }

    updateHud(force) {
        if (!force && this.state.mode === "running") {
            // Running-mode updates are already throttled in tick().
        }

        if (this.ui.healthEl) {
            this.ui.healthEl.textContent = String(this.state.playerHealth);
        }

        if (this.ui.livesEl) {
            this.ui.livesEl.textContent = String(this.state.playerLives);
        }

        if (this.ui.energyEl) {
            this.ui.energyEl.textContent = String(this.state.playerEnergy);
        }

        if (this.ui.scoreEl) {
            this.ui.scoreEl.textContent = String(Math.floor(this.state.score));
        }

        if (this.ui.highScoreEl) {
            this.ui.highScoreEl.textContent = String(Math.floor(this.state.highScore));
        }

        if (this.ui.multiplierEl) {
            this.ui.multiplierEl.textContent = this.state.scoreMultiplier.toFixed(2) + "x";
        }

        if (this.ui.waveEl) {
            this.ui.waveEl.textContent = String(this.state.wave);
        }

        if (this.ui.wavePhaseEl) {
            let phaseText = this.state.wavePhase;
            if (this.state.wavePhase === "intermission" || this.state.wavePhase === "complete") {
                const remaining = Math.max(0, Math.ceil(this.loop.waveClock / 1000));
                phaseText = this.state.wavePhase + " " + String(remaining) + "s";
            }
            this.ui.wavePhaseEl.textContent = phaseText;
        }

        if (this.ui.waveProgressEl) {
            this.ui.waveProgressEl.textContent = String(this.state.waveEnemiesSpawned) + "/" + String(this.state.waveEnemiesToSpawn);
        }

        if (this.ui.fpsEl) {
            this.ui.fpsEl.textContent = String(this.state.fps);
        }

        if (this.ui.enemiesEl) {
            this.ui.enemiesEl.textContent = String(this.world.enemies.length);
        }

        if (this.ui.impactsEl) {
            this.ui.impactsEl.textContent = String(this.state.impacts);
        }

        if (this.ui.powerUpEl) {
            if (this.state.powerUpRemainingMs > 0) {
                this.ui.powerUpEl.textContent = this.state.activePowerUp + " " + String(Math.ceil(this.state.powerUpRemainingMs / 1000)) + "s";
            } else {
                this.ui.powerUpEl.textContent = this.state.activePowerUp;
            }
        }

        if (this.ui.pickupsEl) {
            this.ui.pickupsEl.textContent = String(this.world.pickups.length);
        }
    }

    handleResize() {
        const panel = this.canvas.parentElement;
        if (!panel) {
            return;
        }

        const maxWidth = panel.clientWidth;
        const scale = Math.min(1, maxWidth / CONFIG.canvasWidth);
        this.canvas.style.width = String(Math.floor(CONFIG.canvasWidth * scale)) + "px";
    }
}

function buildUiRefs() {
    return {
        stateEl: document.getElementById("gameState"),
        healthEl: document.getElementById("playerHealth"),
        livesEl: document.getElementById("livesValue"),
        energyEl: document.getElementById("playerEnergy"),
        scoreEl: document.getElementById("scoreValue"),
        highScoreEl: document.getElementById("highScoreValue"),
        multiplierEl: document.getElementById("multiplierValue"),
        waveEl: document.getElementById("waveValue"),
        wavePhaseEl: document.getElementById("wavePhaseValue"),
        waveProgressEl: document.getElementById("waveProgressValue"),
        fpsEl: document.getElementById("fpsValue"),
        enemiesEl: document.getElementById("enemiesValue"),
        impactsEl: document.getElementById("impactsValue"),
        powerUpEl: document.getElementById("powerUpValue"),
        pickupsEl: document.getElementById("pickupsValue"),
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
