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
        speed: 200,
        startingLives: 3,
        respawnProtection: 2
    },
    enemy: {
        radius: 10,
        baseHealth: 20,
        speed: 85,
        spawnPerSecondBase: 0.8,
        touchDamage: 14,
        knockback: 18,
        archetypes: {
            raider: { hpMultiplier: 1, speedMultiplier: 1, radiusOffset: 0 },
            orbiter: { hpMultiplier: 0.9, speedMultiplier: 1.12, radiusOffset: -1 },
            charger: { hpMultiplier: 1.05, speedMultiplier: 0.95, radiusOffset: 1 },
            tank: { hpMultiplier: 2.2, speedMultiplier: 0.62, radiusOffset: 4 }
        },
        ai: {
            orbiterPreferredRange: 110,
            orbiterStrafeFactor: 0.92,
            chargeTriggerRange: 260,
            chargeWindup: 0.55,
            chargeDuration: 0.45,
            chargeCooldown: 2.6,
            chargeSpeedMultiplier: 2.9
        }
    },
    scoring: {
        survivalPerSecond: 4,
        enemyDefeat: 120,
        contactCounterDamage: 8
    },
    wave: {
        baseEnemyCount: 8,
        enemyCountPerWave: 4,
        intermissionSeconds: 3,
        enemyHealthScale: 0.18,
        enemySpeedScale: 0.08,
        spawnRateScale: 0.3
    },
    boss: {
        waveInterval: 5,
        baseHealth: 520,
        healthPerWave: 110,
        speed: 72,
        radius: 30,
        touchDamage: 24,
        rewardScore: 1100,
        rewardCredits: 26
    },
    powerUp: {
        spawnInterval: 9,
        radius: 11,
        lifetime: 12,
        phaseDuration: 6,
        repairValue: 25,
        barrierValue: 35
    },
    sound: {
        masterVolume: 0.05
    },
    upgrades: {
        hull: { baseCost: 35, costStep: 20, value: 20, maxLevel: 6 },
        shield: { baseCost: 30, costStep: 18, value: 16, maxLevel: 6 },
        speed: { baseCost: 45, costStep: 24, value: 16, maxLevel: 5 }
    },
    abilities: {
        pulseCooldown: 8,
        pulseRange: 110,
        pulseDamage: 35,
        dashCooldown: 5,
        dashDistance: 140
    }
};

class Player {
    constructor(x, y, stats) {
        this.x = x;
        this.y = y;
        this.radius = CONFIG.player.radius;
        this.maxHull = stats.maxHull;
        this.hull = stats.maxHull;
        this.maxShield = stats.maxShield;
        this.shield = stats.maxShield;
        this.facing = 0;
        this.corePulse = 0;
        this.vx = 0;
        this.vy = 0;
        this.speed = stats.speed;
        this.damageCooldown = 0;
        this.effects = {
            phase: 0,
            respawnInvulnerability: 0
        };
    }

    update(deltaTime, keys, canvas) {
        this.corePulse += deltaTime * 4;
        this.damageCooldown = Math.max(0, this.damageCooldown - deltaTime);
        this.effects.phase = Math.max(0, this.effects.phase - deltaTime);
        this.effects.respawnInvulnerability = Math.max(0, this.effects.respawnInvulnerability - deltaTime);

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

    applyDamage(amount) {
        if (this.damageCooldown > 0 || this.effects.respawnInvulnerability > 0) {
            return false;
        }

        const phaseMultiplier = this.effects.phase > 0 ? 0.5 : 1;
        let adjustedAmount = amount * phaseMultiplier;

        let remaining = amount;
        remaining = adjustedAmount;
        if (this.shield > 0) {
            const shieldBlocked = Math.min(this.shield, remaining);
            this.shield -= shieldBlocked;
            remaining -= shieldBlocked;
        }

        if (remaining > 0) {
            this.hull = Math.max(0, this.hull - remaining);
        }

        this.damageCooldown = 0.35;
        return true;
    }

    applyPowerUp(type) {
        if (type === 'repair') {
            this.hull = Math.min(this.maxHull, this.hull + CONFIG.powerUp.repairValue);
            return;
        }

        if (type === 'barrier') {
            this.shield = Math.min(this.maxShield, this.shield + CONFIG.powerUp.barrierValue);
            return;
        }

        if (type === 'phase') {
            this.effects.phase = CONFIG.powerUp.phaseDuration;
        }
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

        if (this.effects.respawnInvulnerability > 0) {
            ctx.beginPath();
            ctx.arc(0, 0, this.radius + 11, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(78, 198, 255, 0.75)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

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

class Enemy {
    constructor(x, y, waveLevel, type = 'raider') {
        const archetype = CONFIG.enemy.archetypes[type] || CONFIG.enemy.archetypes.raider;
        this.x = x;
        this.y = y;
        this.type = type;
        this.radius = Math.max(7, CONFIG.enemy.radius + archetype.radiusOffset);
        this.maxHealth = Math.round(
            CONFIG.enemy.baseHealth
            * (1 + (waveLevel - 1) * CONFIG.wave.enemyHealthScale)
            * archetype.hpMultiplier
        );
        this.health = this.maxHealth;
        this.speed = CONFIG.enemy.speed * (1 + (waveLevel - 1) * CONFIG.wave.enemySpeedScale) * archetype.speedMultiplier;
        this.vx = 0;
        this.vy = 0;
        this.damageFlash = 0;
        this.strafeDirection = Math.random() > 0.5 ? 1 : -1;
        this.state = 'approach';
        this.stateTimer = Math.random() * CONFIG.enemy.ai.chargeCooldown;
        this.chargeDirX = 0;
        this.chargeDirY = 0;
        this.wobble = Math.random() * Math.PI * 2;
    }

    update(deltaTime, player) {
        if (!player) {
            return;
        }

        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.hypot(dx, dy) || 1;
        const nx = dx / distance;
        const ny = dy / distance;

        if (this.type === 'orbiter') {
            const preferred = CONFIG.enemy.ai.orbiterPreferredRange;
            const radialError = (distance - preferred) / preferred;
            const radialFactor = Math.max(-1, Math.min(1, radialError));
            const tx = -ny * this.strafeDirection;
            const ty = nx * this.strafeDirection;

            this.vx = (nx * radialFactor + tx * CONFIG.enemy.ai.orbiterStrafeFactor) * this.speed;
            this.vy = (ny * radialFactor + ty * CONFIG.enemy.ai.orbiterStrafeFactor) * this.speed;
        } else if (this.type === 'charger') {
            this.stateTimer = Math.max(0, this.stateTimer - deltaTime);

            if (this.state === 'approach') {
                this.vx = nx * this.speed * 0.85;
                this.vy = ny * this.speed * 0.85;

                if (distance < CONFIG.enemy.ai.chargeTriggerRange && this.stateTimer <= 0) {
                    this.state = 'windup';
                    this.stateTimer = CONFIG.enemy.ai.chargeWindup;
                }
            } else if (this.state === 'windup') {
                this.vx = nx * this.speed * 0.15;
                this.vy = ny * this.speed * 0.15;

                if (this.stateTimer <= 0) {
                    this.state = 'charge';
                    this.stateTimer = CONFIG.enemy.ai.chargeDuration;
                    this.chargeDirX = nx;
                    this.chargeDirY = ny;
                }
            } else {
                this.vx = this.chargeDirX * this.speed * CONFIG.enemy.ai.chargeSpeedMultiplier;
                this.vy = this.chargeDirY * this.speed * CONFIG.enemy.ai.chargeSpeedMultiplier;

                if (this.stateTimer <= 0) {
                    this.state = 'approach';
                    this.stateTimer = CONFIG.enemy.ai.chargeCooldown;
                }
            }
        } else if (this.type === 'tank') {
            this.wobble += deltaTime * 3;
            const sway = Math.sin(this.wobble) * 0.25;
            const tx = -ny;
            const ty = nx;

            this.vx = (nx + tx * sway) * this.speed;
            this.vy = (ny + ty * sway) * this.speed;
        } else {
            this.vx = nx * this.speed;
            this.vy = ny * this.speed;
        }

        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.damageFlash = Math.max(0, this.damageFlash - deltaTime);
    }

    render(ctx) {
        const healthPercent = this.health / this.maxHealth;

        ctx.save();
        ctx.translate(this.x, this.y);

        const archetypeColors = {
            raider: ['#ff9a6a', '#da5200', '#7f3104'],
            orbiter: ['#ffd27d', '#e08f1a', '#755109'],
            charger: ['#ff8d9e', '#cb2f45', '#641523'],
            tank: ['#b4b7c2', '#71768b', '#373b4b']
        };
        const colors = archetypeColors[this.type] || archetypeColors.raider;

        const bodyGradient = ctx.createRadialGradient(-3, -3, 1, 0, 0, this.radius);
        bodyGradient.addColorStop(0, colors[0]);
        bodyGradient.addColorStop(0.5, colors[1]);
        bodyGradient.addColorStop(1, colors[2]);
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        if (this.type === 'charger' && this.state === 'windup') {
            ctx.strokeStyle = 'rgba(255, 130, 145, 0.95)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius + 5, 0, Math.PI * 2);
            ctx.stroke();
        }

        if (this.damageFlash > 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = 'rgba(23, 38, 55, 0.9)';
        ctx.fillRect(-this.radius, -this.radius - 6, this.radius * 2, 3);
        ctx.fillStyle = '#65d17f';
        ctx.fillRect(-this.radius, -this.radius - 6, this.radius * 2 * healthPercent, 3);

        ctx.restore();
    }
}

class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.radius = CONFIG.powerUp.radius;
        this.remaining = CONFIG.powerUp.lifetime;
        this.pulse = 0;
    }

    update(deltaTime) {
        this.remaining -= deltaTime;
        this.pulse += deltaTime * 6;
    }

    isExpired() {
        return this.remaining <= 0;
    }

    render(ctx) {
        const pulseSize = Math.sin(this.pulse) * 2;
        const icon = this.type === 'repair' ? '+' : this.type === 'barrier' ? 'B' : 'P';
        const color = this.type === 'repair' ? '#67d679' : this.type === 'barrier' ? '#4ec6ff' : '#d79bff';

        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.fillStyle = 'rgba(8, 18, 28, 0.85)';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius + 5 + pulseSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius + pulseSize, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.font = 'bold 11px Segoe UI';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icon, 0, 0);

        const lifePercent = Math.max(0, this.remaining / CONFIG.powerUp.lifetime);
        ctx.fillStyle = 'rgba(20, 30, 45, 0.9)';
        ctx.fillRect(-this.radius, this.radius + 6, this.radius * 2, 3);
        ctx.fillStyle = color;
        ctx.fillRect(-this.radius, this.radius + 6, this.radius * 2 * lifePercent, 3);

        ctx.restore();
    }
}

class AudioEngine {
    constructor() {
        this.context = null;
        this.enabled = true;
    }

    ensureContext() {
        if (!this.context) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) {
                this.enabled = false;
                return;
            }
            this.context = new AudioCtx();
        }
    }

    unlock() {
        this.ensureContext();
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    }

    setEnabled(next) {
        this.enabled = next;
    }

    tone(freq, duration, type = 'sine', gain = 1) {
        if (!this.enabled) {
            return;
        }

        this.ensureContext();
        if (!this.context) {
            return;
        }

        const now = this.context.currentTime;
        const oscillator = this.context.createOscillator();
        const envelope = this.context.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(freq, now);

        envelope.gain.setValueAtTime(0, now);
        envelope.gain.linearRampToValueAtTime(CONFIG.sound.masterVolume * gain, now + 0.01);
        envelope.gain.exponentialRampToValueAtTime(0.001, now + duration);

        oscillator.connect(envelope);
        envelope.connect(this.context.destination);

        oscillator.start(now);
        oscillator.stop(now + duration);
    }

    play(eventName) {
        if (eventName === 'start') {
            this.tone(420, 0.14, 'triangle', 1.2);
            setTimeout(() => this.tone(620, 0.12, 'triangle', 1.2), 80);
            return;
        }

        if (eventName === 'hit') {
            this.tone(160, 0.09, 'sawtooth', 1.4);
            return;
        }

        if (eventName === 'enemyDown') {
            this.tone(300, 0.06, 'square', 1.1);
            setTimeout(() => this.tone(220, 0.09, 'square', 1.1), 35);
            return;
        }

        if (eventName === 'pickup') {
            this.tone(540, 0.08, 'triangle', 1.1);
            setTimeout(() => this.tone(740, 0.1, 'triangle', 1.1), 40);
            return;
        }

        if (eventName === 'waveClear') {
            this.tone(480, 0.1, 'sine', 1.1);
            setTimeout(() => this.tone(620, 0.1, 'sine', 1.1), 80);
            setTimeout(() => this.tone(760, 0.14, 'sine', 1.1), 160);
            return;
        }

        if (eventName === 'respawn') {
            this.tone(360, 0.08, 'triangle', 1.2);
            setTimeout(() => this.tone(500, 0.12, 'triangle', 1.2), 60);
            return;
        }

        if (eventName === 'gameOver') {
            this.tone(260, 0.18, 'sawtooth', 1.3);
            setTimeout(() => this.tone(190, 0.2, 'sawtooth', 1.3), 120);
        }
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
            livesCounter: document.getElementById('livesCounter'),
            enemyCounter: document.getElementById('enemyCounter'),
            scoreCounter: document.getElementById('scoreCounter'),
            killCounter: document.getElementById('killCounter'),
            waveProgress: document.getElementById('waveProgress'),
            powerUpStatus: document.getElementById('powerUpStatus'),
            soundStatus: document.getElementById('soundStatus'),
            abilityStatus: document.getElementById('abilityStatus'),
            upgradeHullBtn: document.getElementById('upgradeHullBtn'),
            upgradeShieldBtn: document.getElementById('upgradeShieldBtn'),
            upgradeSpeedBtn: document.getElementById('upgradeSpeedBtn'),
            upgradeSummary: document.getElementById('upgradeSummary'),
            startBtn: document.getElementById('startBtn'),
            resetBtn: document.getElementById('resetBtn'),
            muteBtn: document.getElementById('muteBtn'),
            bootOverlay: document.getElementById('bootOverlay')
        };

        this.audio = new AudioEngine();

        this.state = 'waiting';
        this.wave = 0;
        this.credits = 0;
        this.integrity = 100;
        this.score = 0;
        this.kills = 0;
        this.survivalTime = 0;
        this.maxLives = CONFIG.player.startingLives;
        this.lives = this.maxLives;
        this.waveState = 'idle';
        this.waveIntermissionTimer = 0;
        this.waveTargetCount = 0;
        this.waveEnemiesSpawned = 0;
        this.waveEnemiesDefeated = 0;
        this.upgradeLevels = { hull: 0, shield: 0, speed: 0 };
        this.playerStats = {
            maxHull: CONFIG.player.baseHull,
            maxShield: CONFIG.player.baseShield,
            speed: CONFIG.player.speed
        };
        this.abilities = {
            pulseCooldownRemaining: 0,
            dashCooldownRemaining: 0,
            pulseVisualTimer: 0,
            pulseOriginX: 0,
            pulseOriginY: 0
        };

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
            frameCount: 0,
            spawnAccumulator: 0,
            powerUpAccumulator: 0
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
        this.ui.muteBtn.addEventListener('click', () => {
            const next = !this.audio.enabled;
            this.audio.setEnabled(next);
            this.ui.muteBtn.textContent = next ? 'Mute' : 'Unmute';
            this.syncUI();
        });

        this.ui.upgradeHullBtn.addEventListener('click', () => this.applyUpgrade('hull'));
        this.ui.upgradeShieldBtn.addEventListener('click', () => this.applyUpgrade('shield'));
        this.ui.upgradeSpeedBtn.addEventListener('click', () => this.applyUpgrade('speed'));

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

        this.audio.unlock();
        this.audio.play('start');
        this.beginWave(1);
        this.setState('running');
        this.ui.bootOverlay.style.display = 'none';
    }

    reset() {
        this.wave = 0;
        this.credits = 0;
        this.integrity = 100;
        this.score = 0;
        this.kills = 0;
        this.survivalTime = 0;
        this.lives = this.maxLives;
        this.time.spawnAccumulator = 0;
        this.time.powerUpAccumulator = 0;
        this.waveState = 'idle';
        this.waveIntermissionTimer = 0;
        this.waveTargetCount = 0;
        this.waveEnemiesSpawned = 0;
        this.waveEnemiesDefeated = 0;
        this.upgradeLevels = { hull: 0, shield: 0, speed: 0 };
        this.playerStats = {
            maxHull: CONFIG.player.baseHull,
            maxShield: CONFIG.player.baseShield,
            speed: CONFIG.player.speed
        };
        this.abilities = {
            pulseCooldownRemaining: 0,
            dashCooldownRemaining: 0,
            pulseVisualTimer: 0,
            pulseOriginX: 0,
            pulseOriginY: 0
        };

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
        this.ui.livesCounter.textContent = String(this.lives);
        this.ui.enemyCounter.textContent = String(this.entities.enemies.length);
        this.ui.scoreCounter.textContent = String(Math.floor(this.score));
        this.ui.killCounter.textContent = String(this.kills);
        this.ui.waveProgress.textContent = `${this.waveEnemiesDefeated} / ${this.waveTargetCount}`;
        this.ui.soundStatus.textContent = this.audio.enabled ? 'On' : 'Muted';

        const hullCost = this.getUpgradeCost('hull');
        const shieldCost = this.getUpgradeCost('shield');
        const speedCost = this.getUpgradeCost('speed');

        this.ui.upgradeHullBtn.textContent = hullCost === null ? 'Hull MAX' : `Hull +${CONFIG.upgrades.hull.value} (${hullCost})`;
        this.ui.upgradeShieldBtn.textContent = shieldCost === null ? 'Shield MAX' : `Shield +${CONFIG.upgrades.shield.value} (${shieldCost})`;
        this.ui.upgradeSpeedBtn.textContent = speedCost === null ? 'Speed MAX' : `Speed +${CONFIG.upgrades.speed.value} (${speedCost})`;

        this.ui.upgradeHullBtn.disabled = hullCost === null || this.credits < hullCost;
        this.ui.upgradeShieldBtn.disabled = shieldCost === null || this.credits < shieldCost;
        this.ui.upgradeSpeedBtn.disabled = speedCost === null || this.credits < speedCost;

        this.ui.upgradeSummary.textContent = `Hull Lv${this.upgradeLevels.hull} | Shield Lv${this.upgradeLevels.shield} | Speed Lv${this.upgradeLevels.speed}`;

        const pulseStatus = this.abilities.pulseCooldownRemaining > 0
            ? `Pulse[R] ${this.abilities.pulseCooldownRemaining.toFixed(1)}s`
            : 'Pulse[R] Ready';
        const dashStatus = this.abilities.dashCooldownRemaining > 0
            ? `Dash[F] ${this.abilities.dashCooldownRemaining.toFixed(1)}s`
            : 'Dash[F] Ready';
        this.ui.abilityStatus.textContent = `${pulseStatus} | ${dashStatus}`;

        if (!this.entities.player) {
            this.ui.powerUpStatus.textContent = 'None';
        } else if (this.entities.player.effects.respawnInvulnerability > 0) {
            this.ui.powerUpStatus.textContent = `Respawn Shield ${this.entities.player.effects.respawnInvulnerability.toFixed(1)}s`;
        } else if (this.entities.player.effects.phase > 0) {
            this.ui.powerUpStatus.textContent = `Phase ${this.entities.player.effects.phase.toFixed(1)}s`;
        } else {
            this.ui.powerUpStatus.textContent = 'None';
        }

        if (this.entities.player) {
            this.ui.playerHull.textContent = `${Math.round(this.entities.player.hull)} / ${this.entities.player.maxHull}`;
            this.ui.playerShield.textContent = `${Math.round(this.entities.player.shield)} / ${this.entities.player.maxShield}`;
        }
    }

    spawnPlayer() {
        this.entities.player = new Player(this.canvas.width * 0.5, this.canvas.height * 0.5, this.playerStats);
    }

    getUpgradeCost(type) {
        const cfg = CONFIG.upgrades[type];
        const level = this.upgradeLevels[type];
        if (level >= cfg.maxLevel) {
            return null;
        }
        return cfg.baseCost + level * cfg.costStep;
    }

    applyUpgrade(type) {
        const cost = this.getUpgradeCost(type);
        if (cost === null || this.credits < cost) {
            return;
        }

        this.credits -= cost;
        this.upgradeLevels[type] += 1;

        if (type === 'hull') {
            this.playerStats.maxHull += CONFIG.upgrades.hull.value;
            if (this.entities.player) {
                this.entities.player.maxHull = this.playerStats.maxHull;
                this.entities.player.hull = Math.min(this.entities.player.maxHull, this.entities.player.hull + CONFIG.upgrades.hull.value);
            }
        }

        if (type === 'shield') {
            this.playerStats.maxShield += CONFIG.upgrades.shield.value;
            if (this.entities.player) {
                this.entities.player.maxShield = this.playerStats.maxShield;
                this.entities.player.shield = Math.min(this.entities.player.maxShield, this.entities.player.shield + CONFIG.upgrades.shield.value);
            }
        }

        if (type === 'speed') {
            this.playerStats.speed += CONFIG.upgrades.speed.value;
            if (this.entities.player) {
                this.entities.player.speed = this.playerStats.speed;
            }
        }

        this.audio.play('pickup');
        this.syncUI();
    }

    triggerPulseBlast() {
        if (!this.entities.player || this.abilities.pulseCooldownRemaining > 0) {
            return;
        }

        this.abilities.pulseCooldownRemaining = CONFIG.abilities.pulseCooldown;
        this.abilities.pulseVisualTimer = 0.25;
        this.abilities.pulseOriginX = this.entities.player.x;
        this.abilities.pulseOriginY = this.entities.player.y;

        for (const enemy of this.entities.enemies) {
            const dx = enemy.x - this.entities.player.x;
            const dy = enemy.y - this.entities.player.y;
            const distance = Math.hypot(dx, dy);
            if (distance <= CONFIG.abilities.pulseRange) {
                enemy.health = Math.max(0, enemy.health - CONFIG.abilities.pulseDamage);
                enemy.damageFlash = 0.2;
            }
        }

        this.audio.play('waveClear');
    }

    triggerDash() {
        if (!this.entities.player || this.abilities.dashCooldownRemaining > 0) {
            return;
        }

        this.abilities.dashCooldownRemaining = CONFIG.abilities.dashCooldown;

        let dirX = 0;
        let dirY = 0;

        if (this.keys.has('w') || this.keys.has('arrowup')) dirY -= 1;
        if (this.keys.has('s') || this.keys.has('arrowdown')) dirY += 1;
        if (this.keys.has('a') || this.keys.has('arrowleft')) dirX -= 1;
        if (this.keys.has('d') || this.keys.has('arrowright')) dirX += 1;

        if (dirX === 0 && dirY === 0) {
            dirX = Math.cos(this.entities.player.facing);
            dirY = Math.sin(this.entities.player.facing);
        }

        const length = Math.hypot(dirX, dirY) || 1;
        dirX /= length;
        dirY /= length;

        this.entities.player.x += dirX * CONFIG.abilities.dashDistance;
        this.entities.player.y += dirY * CONFIG.abilities.dashDistance;

        this.entities.player.x = Math.max(this.entities.player.radius, Math.min(this.canvas.width - this.entities.player.radius, this.entities.player.x));
        this.entities.player.y = Math.max(this.entities.player.radius, Math.min(this.canvas.height - this.entities.player.radius, this.entities.player.y));

        this.audio.play('respawn');
    }

    handlePlayerDefeat() {
        if (this.lives > 1) {
            this.lives -= 1;
            this.score = Math.max(0, this.score - 180);
            this.spawnPlayer();
            this.entities.player.effects.respawnInvulnerability = CONFIG.player.respawnProtection;
            this.audio.play('respawn');
            return;
        }

        this.lives = 0;
        this.audio.play('gameOver');
        this.setState('game-over');
    }

    beginWave(waveNumber) {
        this.wave = waveNumber;
        this.waveState = 'active';
        this.waveIntermissionTimer = 0;
        this.waveEnemiesSpawned = 0;
        this.waveEnemiesDefeated = 0;
        this.waveTargetCount = CONFIG.wave.baseEnemyCount + (waveNumber - 1) * CONFIG.wave.enemyCountPerWave;
        this.time.spawnAccumulator = 0;
    }

    completeWave() {
        this.waveState = 'intermission';
        this.waveIntermissionTimer = CONFIG.wave.intermissionSeconds;
        this.score += 250 + this.wave * 40;
        this.credits += 10 + this.wave * 2;
        this.audio.play('waveClear');
    }

    getSpawnTypeForWave() {
        const entries = [
            { type: 'raider', weight: 60 },
            { type: 'orbiter', weight: this.wave >= 2 ? 25 : 0 },
            { type: 'charger', weight: this.wave >= 4 ? 18 : 0 },
            { type: 'tank', weight: this.wave >= 5 ? 14 : 0 }
        ];

        const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
        let roll = Math.random() * totalWeight;

        for (const entry of entries) {
            roll -= entry.weight;
            if (roll <= 0) {
                return entry.type;
            }
        }

        return 'raider';
    }

    spawnEnemy() {
        const angle = Math.random() * Math.PI * 2;
        const spawnDistance = Math.max(this.canvas.width, this.canvas.height) * 0.45;
        const x = this.canvas.width * 0.5 + Math.cos(angle) * spawnDistance;
        const y = this.canvas.height * 0.5 + Math.sin(angle) * spawnDistance;
        const type = this.getSpawnTypeForWave();
        this.entities.enemies.push(new Enemy(x, y, this.wave, type));
        this.waveEnemiesSpawned += 1;
    }

    spawnPowerUp() {
        const types = ['repair', 'barrier', 'phase'];
        const type = types[Math.floor(Math.random() * types.length)];

        const margin = 40;
        const x = margin + Math.random() * (this.canvas.width - margin * 2);
        const y = margin + Math.random() * (this.canvas.height - margin * 2);

        this.entities.pickups.push(new PowerUp(x, y, type));
    }

    updatePowerUps(deltaTime) {
        for (let i = this.entities.pickups.length - 1; i >= 0; i--) {
            const pickup = this.entities.pickups[i];
            pickup.update(deltaTime);

            if (pickup.isExpired()) {
                this.entities.pickups.splice(i, 1);
                continue;
            }

            if (this.entities.player) {
                const dx = pickup.x - this.entities.player.x;
                const dy = pickup.y - this.entities.player.y;
                const distance = Math.hypot(dx, dy);
                if (distance < pickup.radius + this.entities.player.radius) {
                    this.entities.player.applyPowerUp(pickup.type);
                    this.score += 60;
                    this.audio.play('pickup');
                    this.entities.pickups.splice(i, 1);
                }
            }
        }
    }

    handleCollisions() {
        if (!this.entities.player) {
            return;
        }

        for (const enemy of this.entities.enemies) {
            const dx = enemy.x - this.entities.player.x;
            const dy = enemy.y - this.entities.player.y;
            const distance = Math.hypot(dx, dy);
            const overlap = this.entities.player.radius + enemy.radius - distance;

            if (overlap > 0) {
                const tookDamage = this.entities.player.applyDamage(CONFIG.enemy.touchDamage);
                enemy.health = Math.max(0, enemy.health - CONFIG.scoring.contactCounterDamage);
                if (tookDamage) {
                    this.audio.play('hit');
                }

                const nx = distance > 0 ? dx / distance : 1;
                const ny = distance > 0 ? dy / distance : 0;
                enemy.x += nx * CONFIG.enemy.knockback;
                enemy.y += ny * CONFIG.enemy.knockback;
                enemy.damageFlash = 0.12;
            }
        }
    }

    update(deltaTime) {
        this.time.elapsed += deltaTime;
        this.time.uiAccumulator += deltaTime;
        this.time.frameCount += 1;

        this.abilities.pulseCooldownRemaining = Math.max(0, this.abilities.pulseCooldownRemaining - deltaTime);
        this.abilities.dashCooldownRemaining = Math.max(0, this.abilities.dashCooldownRemaining - deltaTime);
        this.abilities.pulseVisualTimer = Math.max(0, this.abilities.pulseVisualTimer - deltaTime);

        if (this.state === 'running') {
            if (this.keys.has('r')) {
                this.triggerPulseBlast();
            }

            if (this.keys.has('f')) {
                this.triggerDash();
            }
        }

        if (this.state === 'running') {
            this.survivalTime += deltaTime;
            this.score += CONFIG.scoring.survivalPerSecond * deltaTime;

            if (this.waveState === 'active') {
                this.time.spawnAccumulator += deltaTime;
                const spawnRate = CONFIG.enemy.spawnPerSecondBase + this.wave * CONFIG.wave.spawnRateScale;
                const spawnInterval = 1 / spawnRate;

                if (this.waveEnemiesSpawned < this.waveTargetCount && this.time.spawnAccumulator >= spawnInterval) {
                    this.spawnEnemy();
                    this.time.spawnAccumulator = 0;
                }

                const waveCleared = this.waveEnemiesDefeated >= this.waveTargetCount && this.entities.enemies.length === 0;
                if (waveCleared) {
                    this.completeWave();
                }
            } else if (this.waveState === 'intermission') {
                this.waveIntermissionTimer = Math.max(0, this.waveIntermissionTimer - deltaTime);
                if (this.waveIntermissionTimer <= 0) {
                    this.beginWave(this.wave + 1);
                }
            }

            this.time.powerUpAccumulator += deltaTime;
            if (this.time.powerUpAccumulator >= CONFIG.powerUp.spawnInterval) {
                this.spawnPowerUp();
                this.time.powerUpAccumulator = 0;
            }
        }

        if (this.entities.player) {
            this.entities.player.update(deltaTime, this.keys, this.canvas);

            if (this.mouse.inCanvas) {
                const dx = this.mouse.x - this.entities.player.x;
                const dy = this.mouse.y - this.entities.player.y;
                this.entities.player.facing = Math.atan2(dy, dx);
            }

            if (this.entities.player.hull <= 0) {
                this.handlePlayerDefeat();
            }
        }

        for (let i = this.entities.enemies.length - 1; i >= 0; i--) {
            const enemy = this.entities.enemies[i];
            enemy.update(deltaTime, this.entities.player);

            if (enemy.health <= 0) {
                this.entities.enemies.splice(i, 1);
                this.kills += 1;
                this.waveEnemiesDefeated += 1;
                this.credits += 5;
                this.score += CONFIG.scoring.enemyDefeat;
                this.audio.play('enemyDown');
            }
        }

        this.handleCollisions();
        this.updatePowerUps(deltaTime);

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
        ctx.fillText('Commit 14: Advanced Enemy AI Online', canvas.width / 2, canvas.height / 2 + 24);
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

        for (const enemy of this.entities.enemies) {
            enemy.render(ctx);
        }

        for (const pickup of this.entities.pickups) {
            pickup.render(ctx);
        }

        if (this.abilities.pulseVisualTimer > 0) {
            const alpha = this.abilities.pulseVisualTimer / 0.25;
            const radius = CONFIG.abilities.pulseRange * (1 - alpha * 0.35);
            ctx.beginPath();
            ctx.arc(this.abilities.pulseOriginX, this.abilities.pulseOriginY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(78, 198, 255, ${alpha * 0.8})`;
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        if (this.entities.player) {
            this.entities.player.render(ctx);
        }

        ctx.fillStyle = 'rgba(159, 184, 188, 0.95)';
        ctx.font = '16px Segoe UI';
        ctx.textAlign = 'left';
        if (this.state === 'game-over') {
            ctx.fillText(`Game Over | Final Score ${Math.floor(this.score)} | Kills ${this.kills} | Lives ${this.lives}`, 20, 34);
        } else {
            const waveInfo = `${this.waveEnemiesDefeated}/${this.waveTargetCount}`;
            if (this.waveState === 'intermission') {
                ctx.fillText(`Wave ${this.wave} cleared | Next in ${this.waveIntermissionTimer.toFixed(1)}s`, 20, 34);
            } else {
                ctx.fillText(`Wave ${this.wave} (${waveInfo}) | Lives ${this.lives} | Score ${Math.floor(this.score)} | R:Pulse F:Dash`, 20, 34);
            }
        }
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
