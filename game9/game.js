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
    combat: {
        projectileRadius: 6,
        projectileSpeed: 620,
        projectileLifetimeMs: 1250,
        projectileDamage: 20,
        fireCooldownMs: 170,
        fireEnergyCost: 14,
        energyRegenPerSecond: 18,
        defeatScore: 36,
        spawnOnDefeatChance: 0.14
    },
    abilities: {
        dash: {
            label: "Dash",
            key: "1",
            cooldownMs: 3200,
            energyCost: 18,
            boostSpeed: 220,
            durationMs: 260,
            invulnerableMs: 180,
            color: "#8ee6ff"
        },
        burst: {
            label: "Burst Shot",
            key: "2",
            cooldownMs: 4700,
            energyCost: 28,
            count: 5,
            spreadDeg: 24,
            color: "#ffd66f"
        },
        pulse: {
            label: "Repair Pulse",
            key: "3",
            cooldownMs: 6400,
            energyCost: 34,
            heal: 26,
            radius: 170,
            damage: 22,
            color: "#7ef0a5"
        }
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
        enemyLifetimeMs: 10500,
        bossWaveInterval: 5,
        bossWarningMs: 3000,
        bossRewardMultiplier: 2.5
    },
    boss: {
        radius: 38,
        speed: 92,
        health: 260,
        color: "#ff6a88",
        accentColor: "#ffd66f"
    },
    achievements: {
        firstBlood: { icon: "🩸", name: "First Blood", description: "Defeat your first enemy.", type: "kills", threshold: 1 },
        enemySlayer: { icon: "⚔️", name: "Enemy Slayer", description: "Defeat 50 enemies.", type: "kills", threshold: 50 },
        survivor: { icon: "🌊", name: "Survivor", description: "Reach wave 10.", type: "wave", threshold: 10 },
        bossSlayer: { icon: "👑", name: "Boss Slayer", description: "Defeat your first boss.", type: "bossKills", threshold: 1 },
        accuracyAce: { icon: "🎯", name: "Accuracy Ace", description: "Hit 25 shots with at least 80% accuracy.", type: "accuracy", threshold: 80 },
        dashSpecialist: { icon: "💨", name: "Dash Specialist", description: "Use Dash 5 times.", type: "ability", abilityKey: "dash", threshold: 5 },
        burstSpecialist: { icon: "🌟", name: "Burst Specialist", description: "Use Burst Shot 5 times.", type: "ability", abilityKey: "burst", threshold: 5 },
        pulseSpecialist: { icon: "✨", name: "Pulse Specialist", description: "Use Repair Pulse 3 times.", type: "ability", abilityKey: "pulse", threshold: 3 }
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

class AudioEngine {
    constructor() {
        this.context = null;
        this.masterGain = null;
        this.available = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext);
        this.muted = false;
    }

    ensureContext() {
        if (!this.available) {
            return false;
        }

        if (!this.context) {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            this.context = new Ctx();
            this.masterGain = this.context.createGain();
            this.masterGain.gain.value = 0.08;
            this.masterGain.connect(this.context.destination);
        }

        return true;
    }

    unlock() {
        if (!this.ensureContext()) {
            return;
        }

        if (this.context.state === "suspended") {
            this.context.resume();
        }
    }

    setMuted(nextMuted) {
        this.muted = Boolean(nextMuted);
        if (this.masterGain) {
            this.masterGain.gain.value = this.muted ? 0 : 0.08;
        }
    }

    toggleMuted() {
        if (!this.ensureContext()) {
            return this.muted;
        }

        this.setMuted(!this.muted);
        return this.muted;
    }

    getStatusLabel() {
        if (!this.available) {
            return "unavailable";
        }
        return this.muted ? "muted" : "on";
    }

    play(eventName) {
        if (!this.ensureContext() || this.muted) {
            return;
        }

        const t = this.context.currentTime + 0.003;
        if (eventName === "start") {
            this.chirp(360, 520, 0.14, 0.18, "triangle", t);
            return;
        }

        if (eventName === "pause") {
            this.chirp(420, 260, 0.1, 0.15, "sine", t);
            return;
        }

        if (eventName === "resume") {
            this.chirp(300, 470, 0.12, 0.16, "triangle", t);
            return;
        }

        if (eventName === "reset") {
            this.chirp(600, 320, 0.16, 0.18, "square", t);
            return;
        }

        if (eventName === "waveStart") {
            this.chirp(280, 540, 0.18, 0.2, "triangle", t);
            this.tone(720, 0.07, "sine", 0.08, t + 0.12);
            return;
        }

        if (eventName === "waveComplete") {
            this.tone(380, 0.1, "triangle", 0.15, t);
            this.tone(540, 0.1, "triangle", 0.15, t + 0.11);
            this.tone(720, 0.14, "triangle", 0.16, t + 0.22);
            return;
        }

        if (eventName === "hit") {
            this.noise(0.07, 0.15, t, 620);
            this.tone(120, 0.07, "sawtooth", 0.1, t);
            return;
        }

        if (eventName === "shieldBlock") {
            this.tone(880, 0.05, "square", 0.08, t);
            return;
        }

        if (eventName === "pickup") {
            this.chirp(580, 860, 0.09, 0.13, "sine", t);
            return;
        }

        if (eventName === "shoot") {
            this.chirp(980, 620, 0.08, 0.1, "square", t);
            return;
        }

        if (eventName === "enemyDown") {
            this.chirp(360, 780, 0.1, 0.13, "triangle", t);
            return;
        }

        if (eventName === "bossStart") {
            this.chirp(220, 500, 0.24, 0.18, "square", t);
            this.tone(140, 0.18, "sawtooth", 0.16, t + 0.11);
            return;
        }

        if (eventName === "bossWarning") {
            this.tone(120, 0.1, "square", 0.12, t);
            this.tone(160, 0.1, "square", 0.12, t + 0.12);
            return;
        }

        if (eventName === "bossDown") {
            this.tone(180, 0.16, "sawtooth", 0.18, t);
            this.tone(280, 0.18, "triangle", 0.16, t + 0.08);
            this.tone(420, 0.22, "triangle", 0.12, t + 0.18);
            return;
        }

        if (eventName === "ability") {
            this.chirp(420, 760, 0.1, 0.14, "triangle", t);
            return;
        }

        if (eventName === "lifeLost") {
            this.chirp(280, 140, 0.16, 0.16, "sawtooth", t);
            return;
        }

        if (eventName === "gameOver") {
            this.tone(220, 0.18, "sawtooth", 0.18, t);
            this.tone(160, 0.22, "sawtooth", 0.18, t + 0.18);
            this.noise(0.12, 0.12, t + 0.06, 450);
            return;
        }

        if (eventName === "respawn") {
            this.chirp(240, 660, 0.22, 0.14, "triangle", t);
            return;
        }

        if (eventName === "toggle") {
            this.tone(760, 0.06, "sine", 0.08, t);
        }
    }

    tone(freq, duration, type, volume, startTime) {
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.02);
    }

    chirp(freqA, freqB, duration, volume, type, startTime) {
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freqA, startTime);
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqB), startTime + duration);
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.03);
    }

    noise(duration, volume, startTime, highpassHz) {
        const sampleRate = this.context.sampleRate;
        const frameCount = Math.max(1, Math.floor(sampleRate * duration));
        const buffer = this.context.createBuffer(1, frameCount, sampleRate);
        const channel = buffer.getChannelData(0);
        for (let i = 0; i < frameCount; i += 1) {
            channel[i] = (Math.random() * 2 - 1) * (1 - i / frameCount);
        }

        const source = this.context.createBufferSource();
        source.buffer = buffer;

        const filter = this.context.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.setValueAtTime(highpassHz || 400, startTime);

        const gain = this.context.createGain();
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        source.start(startTime);
        source.stop(startTime + duration + 0.02);
    }
}

class AchievementToast {
    constructor(id, spec, expiresAt) {
        this.id = id;
        this.spec = spec;
        this.expiresAt = expiresAt;
    }
}

class Enemy {
    constructor(x, y, radius, speed, color, options) {
        const enemyOptions = options || {};
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.color = color;
        this.isBoss = Boolean(enemyOptions.isBoss);
        this.maxHealth = enemyOptions.maxHealth || (this.isBoss ? CONFIG.boss.health : 20);
        this.health = enemyOptions.health || this.maxHealth;
        this.phase = Math.random() * Math.PI * 2;
        this.contactCooldown = 0;
        this.ageMs = 0;
        this.maxAgeMs = enemyOptions.maxAgeMs || (this.isBoss ? Number.POSITIVE_INFINITY : CONFIG.wave.enemyLifetimeMs);
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

        if (this.isBoss) {
            ctx.strokeStyle = "rgba(255, 214, 111, 0.75)";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(this.x, this.y, drawRadius + 8, 0, Math.PI * 2);
            ctx.stroke();

            ctx.strokeStyle = "rgba(255, 214, 111, 0.45)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, drawRadius + 16, 0, Math.PI * 2);
            ctx.stroke();
        }

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

class Projectile {
    constructor(x, y, dirX, dirY) {
        this.x = x;
        this.y = y;
        this.dirX = dirX;
        this.dirY = dirY;
        this.radius = CONFIG.combat.projectileRadius;
        this.speed = CONFIG.combat.projectileSpeed;
        this.lifeMs = CONFIG.combat.projectileLifetimeMs;
    }

    update(deltaMs, bounds) {
        const deltaSeconds = deltaMs / 1000;
        this.x += this.dirX * this.speed * deltaSeconds;
        this.y += this.dirY * this.speed * deltaSeconds;
        this.lifeMs -= deltaMs;

        if (this.lifeMs <= 0) {
            return true;
        }

        return (
            this.x < bounds.left - this.radius ||
            this.x > bounds.right + this.radius ||
            this.y < bounds.top - this.radius ||
            this.y > bounds.bottom + this.radius
        );
    }

    draw(ctx) {
        ctx.fillStyle = "rgba(255, 231, 156, 0.9)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }
}

class Particle {
    constructor(x, y, vx, vy, color, size, lifeMs) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.lifeMs = lifeMs;
        this.maxLifeMs = lifeMs;
        this.spin = Math.random() * Math.PI * 2;
        this.spinSpeed = (Math.random() * 2 - 1) * 0.015;
    }

    update(deltaMs) {
        const deltaSeconds = deltaMs / 1000;
        this.x += this.vx * deltaSeconds;
        this.y += this.vy * deltaSeconds;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.spin += this.spinSpeed * deltaMs;
        this.lifeMs -= deltaMs;
        return this.lifeMs <= 0;
    }

    draw(ctx) {
        const fade = Math.max(0, this.lifeMs / this.maxLifeMs);
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.spin);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * (0.45 + fade * 0.55), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
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
        this.audio = new AudioEngine();

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
            bossHealth: 0,
            bossMaxHealth: 0,
            bossWarningMs: 0,
            playerHealth: CONFIG.player.maxHealth,
            playerLives: CONFIG.player.startingLives,
            playerEnergy: CONFIG.player.maxEnergy,
            impacts: 0,
            activePowerUp: "none",
            powerUpRemainingMs: 0,
            elapsedMs: 0,
            lastImpactAtMs: 0,
            shotsFired: 0,
            shotsHit: 0,
            abilityUsage: {
                dash: 0,
                burst: 0,
                pulse: 0
            },
            bossKills: 0,
            totalKills: 0,
            accuracyThresholdArmed: false,
            abilityCooldowns: {
                dash: 0,
                burst: 0,
                pulse: 0
            },
            fps: 0
        };
        this.state.screenShakeMs = 0;
        this.state.screenShakeStrength = 0;

        this.world = {
            player: null,
            enemies: [],
            projectiles: [],
            obstacles: [],
            pickups: [],
            particles: [],
            currentBoss: null
        };

        this.achievements = {};
        this.achievementQueue = [];
        this.achievementFeed = null;

        this.loop = {
            frameId: 0,
            previousTime: 0,
            uiClock: 0,
            enemySpawnClock: 0,
            waveClock: CONFIG.wave.intermissionMs,
            powerUpSpawnClock: 0,
            shootCooldownMs: 0,
            abilityDurationMs: 0,
            activeAbility: "none"
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
        this.handlePointerDown = this.handlePointerDown.bind(this);

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

        this.initializeAchievements();

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
        this.state.bossHealth = 0;
        this.state.bossMaxHealth = 0;
        this.state.bossWarningMs = 0;
        this.world.currentBoss = null;
        this.state.waveEnemiesToSpawn = this.isBossWave() ? 1 : CONFIG.wave.baseEnemyCount + (waveNumber - 1) * CONFIG.wave.enemyGrowthPerWave;
        this.loop.enemySpawnClock = 0;
        this.loop.waveClock = CONFIG.wave.intermissionMs;
    }

    startWave() {
        this.state.wavePhase = "active";
        this.loop.enemySpawnClock = 0;
        if (this.isBossWave()) {
            this.spawnBoss();
            this.audio.play("bossStart");
        } else {
            this.audio.play("waveStart");
        }
    }

    finishWave() {
        this.state.wavePhase = "complete";
        this.loop.waveClock = CONFIG.wave.intermissionMs;
        this.audio.play("waveComplete");
    }

    isBossWave() {
        return this.state.wave > 0 && this.state.wave % CONFIG.wave.bossWaveInterval === 0;
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

    spawnEnemy(isBoss) {
        if (this.world.enemies.length >= CONFIG.enemy.maxAlive) {
            return false;
        }

        if (isBoss) {
            const bossX = CONFIG.canvasWidth * 0.5;
            const bossY = CONFIG.canvasHeight * 0.34;
            const boss = new Enemy(
                bossX,
                bossY,
                CONFIG.boss.radius,
                CONFIG.boss.speed,
                CONFIG.boss.color,
                {
                    isBoss: true,
                    maxHealth: CONFIG.boss.health,
                    health: CONFIG.boss.health,
                    maxAgeMs: Number.POSITIVE_INFINITY
                }
            );

            this.world.enemies.push(boss);
            this.world.currentBoss = boss;
            this.state.bossHealth = boss.health;
            this.state.bossMaxHealth = boss.maxHealth;
            this.state.waveEnemiesSpawned = 1;
            return true;
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

    spawnBoss() {
        return this.spawnEnemy(true);
    }

    bindUiEvents() {
        const { startBtn, pauseBtn, skipBtn, abilityBtn, resetBtn, muteBtn } = this.ui;

        if (startBtn) {
            startBtn.addEventListener("click", () => this.start());
        }

        if (pauseBtn) {
            pauseBtn.addEventListener("click", () => this.togglePause());
        }

        if (skipBtn) {
            skipBtn.addEventListener("click", () => this.skipWave());
        }

        if (abilityBtn) {
            abilityBtn.addEventListener("click", () => this.triggerAbility(CONFIG.abilities.dash.key));
        }

        if (resetBtn) {
            resetBtn.addEventListener("click", () => this.reset());
        }

        if (muteBtn) {
            muteBtn.addEventListener("click", () => this.toggleMute());
        }

        this.achievementFeed = this.ui.achievementFeed || null;
    }

    bindInputEvents() {
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);
        this.canvas.addEventListener("pointerdown", this.handlePointerDown);
    }

    handleKeyDown(event) {
        const key = event.key.toLowerCase();
        if (key === "m") {
            event.preventDefault();
            this.toggleMute();
            return;
        }

        if (key === "1" || key === "2" || key === "3") {
            event.preventDefault();
            this.triggerAbility(key);
            return;
        }

        if (key === " " || key === "spacebar") {
            event.preventDefault();
            this.tryFireProjectile();
            return;
        }

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

    handlePointerDown(event) {
        if (!this.world.player) {
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const canvasX = ((event.clientX - rect.left) / rect.width) * this.canvas.width;
        const canvasY = ((event.clientY - rect.top) / rect.height) * this.canvas.height;

        const dx = canvasX - this.world.player.x;
        const dy = canvasY - this.world.player.y;
        const mag = Math.hypot(dx, dy) || 1;
        this.world.player.facing.x = dx / mag;
        this.world.player.facing.y = dy / mag;
        this.tryFireProjectile();
    }

    setMode(nextMode) {
        this.state.mode = nextMode;

        if (this.ui.stateEl) {
            this.ui.stateEl.textContent = nextMode;
        }

        if (this.ui.bootOverlay) {
            const activeText = {
                booting: "Booting systems...",
                ready: "Commit 17: Achievements armed. Unlock milestones as you play.",
                running: "Simulation active.",
                paused: "Simulation paused.",
                reset: "Simulation reset.",
                "game-over": "All lives lost. Reset to try again.",
                "canvas-error": "Canvas context failed to initialize."
            };
            let overlayText = activeText[nextMode] || "System idle.";
            if (this.state.wavePhase === "boss-warning") {
                const remaining = Math.max(0, Math.ceil(this.state.bossWarningMs / 1000));
                overlayText = "Boss incoming in " + String(remaining) + "s. Prepare for the showdown.";
            } else if (this.world.currentBoss) {
                overlayText = "Boss engaged. Stay mobile and drain its health bar.";
            }
            this.ui.bootOverlay.querySelector("p").textContent = overlayText;
        }
    }

    start() {
        if (this.state.running) {
            return;
        }

        this.audio.unlock();

        if (this.state.playerLives <= 0 || this.state.playerHealth <= 0) {
            this.state.running = false;
            this.setMode("game-over");
            this.updateHud(true);
            return;
        }

        this.state.running = true;
        this.loop.previousTime = performance.now();
        this.setMode("running");
        this.audio.play("start");
        this.loop.frameId = requestAnimationFrame(this.tick);
    }

    togglePause() {
        if (!this.state.running) {
            return;
        }

        if (this.state.mode === "paused") {
            this.setMode("running");
            this.loop.previousTime = performance.now();
            this.audio.play("resume");
            this.loop.frameId = requestAnimationFrame(this.tick);
            return;
        }

        this.setMode("paused");
        this.audio.play("pause");
        cancelAnimationFrame(this.loop.frameId);
    }

    skipWave() {
        if (!this.state.running) {
            return;
        }

        if (this.state.wavePhase === "boss-warning") {
            this.state.bossWarningMs = 0;
            this.startWave();
            this.updateHud(true);
            return;
        }

        this.world.enemies.length = 0;
        this.world.projectiles.length = 0;
        this.world.currentBoss = null;
        this.state.bossHealth = 0;
        this.state.bossMaxHealth = 0;
        this.state.wavePhase = "complete";
        this.loop.waveClock = 0;
        this.audio.play("waveComplete");
        this.setupWave(this.state.wave + 1);
        this.startWave();
        this.updateHud(true);
    }

    reset() {
        cancelAnimationFrame(this.loop.frameId);
        this.state.running = false;
        this.audio.unlock();
        this.audio.play("reset");
        this.input.pressed.clear();
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
        this.state.bossHealth = 0;
        this.state.bossMaxHealth = 0;
        this.state.bossWarningMs = 0;
        this.state.playerHealth = CONFIG.player.maxHealth;
        this.state.playerLives = CONFIG.player.startingLives;
        this.state.playerEnergy = CONFIG.player.maxEnergy;
        this.state.impacts = 0;
        this.state.activePowerUp = "none";
        this.state.powerUpRemainingMs = 0;
        this.state.lastImpactAtMs = 0;
        this.state.shotsFired = 0;
        this.state.shotsHit = 0;
        this.state.abilityUsage = {
            dash: 0,
            burst: 0,
            pulse: 0
        };
        this.state.abilityCooldowns = {
            dash: 0,
            burst: 0,
            pulse: 0
        };
        this.state.fps = 0;
        this.state.screenShakeMs = 0;
        this.state.screenShakeStrength = 0;
        this.loop.uiClock = 0;
        this.loop.enemySpawnClock = 0;
        this.loop.waveClock = CONFIG.wave.intermissionMs;
        this.loop.powerUpSpawnClock = 0;
        this.loop.shootCooldownMs = 0;
        this.loop.abilityDurationMs = 0;
        this.loop.activeAbility = "none";
        this.world.enemies.length = 0;
        this.world.projectiles.length = 0;
        this.world.obstacles.length = 0;
        this.world.pickups.length = 0;
        this.world.particles.length = 0;
        this.world.currentBoss = null;
        this.achievementQueue = [];
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

        this.updateAchievementFeed();
    }

    update(_deltaMs) {
        if (this.world.player) {
            if (this.state.mode === "running") {
                this.world.player.move(this.input, this.arenaBounds, _deltaMs);
                this.updatePlayerResources(_deltaMs);
                this.updateScreenEffects(_deltaMs);
                this.updateAbilityTimers(_deltaMs);

                this.updateWaveSystem(_deltaMs);
                this.updateEnemies(_deltaMs);
                this.updateProjectiles(_deltaMs);
                this.updateParticles(_deltaMs);
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
            this.checkAchievements();

            if (this.world.currentBoss) {
                this.state.bossHealth = Math.max(0, Math.round(this.world.currentBoss.health));
                this.state.bossMaxHealth = this.world.currentBoss.maxHealth;
            } else if (!this.isBossWave()) {
                this.state.bossHealth = 0;
                this.state.bossMaxHealth = 0;
            }
        }
    }

    initializeAchievements() {
        const ids = Object.keys(CONFIG.achievements);
        for (let i = 0; i < ids.length; i += 1) {
            this.achievements[ids[i]] = false;
        }
    }

    unlockAchievement(id) {
        if (this.achievements[id]) {
            return;
        }

        const spec = CONFIG.achievements[id];
        if (!spec) {
            return;
        }

        this.achievements[id] = true;
        this.achievementQueue.push(new AchievementToast(id, spec, performance.now() + 4500));
        this.audio.play("ability");
        this.updateAchievementFeed();
    }

    checkAchievements() {
        const kills = this.state.totalKills;
        const bossKills = this.state.bossKills;
        const wave = this.state.wave;
        const accuracy = this.state.shotsFired >= 25 ? (this.state.shotsHit / this.state.shotsFired) * 100 : 0;

        if (kills >= CONFIG.achievements.firstBlood.threshold) {
            this.unlockAchievement("firstBlood");
        }

        if (kills >= CONFIG.achievements.enemySlayer.threshold) {
            this.unlockAchievement("enemySlayer");
        }

        if (wave >= CONFIG.achievements.survivor.threshold) {
            this.unlockAchievement("survivor");
        }

        if (bossKills >= CONFIG.achievements.bossSlayer.threshold) {
            this.unlockAchievement("bossSlayer");
        }

        if (accuracy >= CONFIG.achievements.accuracyAce.threshold) {
            this.unlockAchievement("accuracyAce");
        }

        const abilityUsage = this.state.abilityUsage;
        if (abilityUsage.dash >= CONFIG.achievements.dashSpecialist.threshold) {
            this.unlockAchievement("dashSpecialist");
        }
        if (abilityUsage.burst >= CONFIG.achievements.burstSpecialist.threshold) {
            this.unlockAchievement("burstSpecialist");
        }
        if (abilityUsage.pulse >= CONFIG.achievements.pulseSpecialist.threshold) {
            this.unlockAchievement("pulseSpecialist");
        }
    }

    incrementAbilityUsage(abilityKey) {
        this.state.abilityUsage[abilityKey] += 1;
    }

    handleEnemyDefeated(enemy, defeatedEnemy) {
        this.state.waveDefeated += 1;
        this.state.totalKills += 1;

        if (enemy.isBoss) {
            this.state.bossKills += 1;
            this.world.currentBoss = null;
            this.state.bossHealth = 0;
            this.state.bossMaxHealth = 0;
        }

        const baseDefeatScore = CONFIG.combat.defeatScore * this.state.scoreMultiplier * this.state.scoreBonusMultiplier;
        const defeatScore = enemy.isBoss ? baseDefeatScore * CONFIG.wave.bossRewardMultiplier : baseDefeatScore;
        this.state.score += defeatScore;

        this.audio.play(enemy.isBoss ? "bossDown" : "enemyDown");
        this.spawnParticles(
            defeatedEnemy.x,
            defeatedEnemy.y,
            enemy.isBoss ? [enemy.color, CONFIG.boss.accentColor, "#fff2bf"] : [enemy.color, "#fff2bf"],
            enemy.isBoss ? 34 : 18,
            enemy.isBoss ? 100 : 80,
            enemy.isBoss ? 260 : 220,
            enemy.isBoss ? 3 : 2,
            enemy.isBoss ? 7 : 5
        );
        this.state.screenShakeMs = CONFIG.effects.screenShakeMs;
        this.state.screenShakeStrength = enemy.isBoss ? CONFIG.effects.screenShakeStrength * 1.35 : CONFIG.effects.screenShakeStrength * 0.8;
        this.checkAchievements();
    }

    updateAchievementFeed() {
        if (!this.achievementFeed) {
            return;
        }

        const now = performance.now();
        this.achievementQueue = this.achievementQueue.filter((entry) => entry.expiresAt > now);
        this.achievementFeed.innerHTML = "";

        for (let i = 0; i < this.achievementQueue.length; i += 1) {
            const toast = this.achievementQueue[i];
            const node = document.createElement("div");
            node.className = "achievement-toast";
            node.innerHTML = "<h3>Achievement Unlocked</h3><strong>" + toast.spec.icon + " " + toast.spec.name + "</strong><p>" + toast.spec.description + "</p>";
            this.achievementFeed.appendChild(node);
        }
    }

    updatePlayerResources(deltaMs) {
        if (!this.world.player) {
            return;
        }

        const regen = CONFIG.combat.energyRegenPerSecond * (deltaMs / 1000);
        this.world.player.energy = Math.min(this.world.player.maxEnergy, this.world.player.energy + regen);
    }

    updateScreenEffects(deltaMs) {
        this.state.screenShakeMs = Math.max(0, this.state.screenShakeMs - deltaMs);
    }

    updateAbilityTimers(deltaMs) {
        const abilityKeys = Object.keys(this.state.abilityCooldowns);
        for (let i = 0; i < abilityKeys.length; i += 1) {
            const abilityKey = abilityKeys[i];
            this.state.abilityCooldowns[abilityKey] = Math.max(0, this.state.abilityCooldowns[abilityKey] - deltaMs);
        }

        if (this.loop.activeAbility === "dash") {
            this.loop.abilityDurationMs = Math.max(0, this.loop.abilityDurationMs - deltaMs);
            if (this.loop.abilityDurationMs <= 0 && this.world.player) {
                this.world.player.speed = this.basePlayerSpeed;
                this.loop.activeAbility = "none";
            }
        }
    }

    triggerAbility(key) {
        if (!this.world.player || this.state.mode !== "running") {
            return;
        }

        if (key === CONFIG.abilities.dash.key) {
            this.activateDash();
            return;
        }

        if (key === CONFIG.abilities.burst.key) {
            this.activateBurstShot();
            return;
        }

        if (key === CONFIG.abilities.pulse.key) {
            this.activateRepairPulse();
        }
    }

    canUseAbility(abilityKey) {
        return this.state.abilityCooldowns[abilityKey] <= 0 && this.world.player && this.state.mode === "running";
    }

    spendAbilityEnergy(amount) {
        if (!this.world.player || this.world.player.energy < amount) {
            return false;
        }

        this.world.player.energy = Math.max(0, this.world.player.energy - amount);
        return true;
    }

    activateDash() {
        const spec = CONFIG.abilities.dash;
        if (!this.canUseAbility("dash") || !this.spendAbilityEnergy(spec.energyCost)) {
            return;
        }

        this.world.player.speed = this.basePlayerSpeed + spec.boostSpeed;
        this.world.player.invulnerableMs = Math.max(this.world.player.invulnerableMs, spec.invulnerableMs);
        this.loop.activeAbility = "dash";
        this.loop.abilityDurationMs = spec.durationMs;
        this.state.abilityCooldowns.dash = spec.cooldownMs;
        this.incrementAbilityUsage("dash");
        this.spawnParticles(this.world.player.x, this.world.player.y, [spec.color, "#ffffff"], 16, 100, 220, 2, 5);
        this.audio.play("ability");
    }

    activateBurstShot() {
        const spec = CONFIG.abilities.burst;
        if (!this.canUseAbility("burst") || !this.spendAbilityEnergy(spec.energyCost)) {
            return;
        }

        const baseAngle = Math.atan2(this.world.player.facing.y, this.world.player.facing.x);
        const spreadStep = (spec.spreadDeg * Math.PI / 180) / Math.max(1, spec.count - 1);
        const startAngle = baseAngle - (spreadStep * (spec.count - 1) * 0.5);

        for (let i = 0; i < spec.count; i += 1) {
            const angle = startAngle + spreadStep * i;
            const dirX = Math.cos(angle);
            const dirY = Math.sin(angle);
            const spawnOffset = this.world.player.radius + CONFIG.combat.projectileRadius + 4;
            const spawnX = this.world.player.x + dirX * spawnOffset;
            const spawnY = this.world.player.y + dirY * spawnOffset;
            this.world.projectiles.push(new Projectile(spawnX, spawnY, dirX, dirY));
        }

        this.state.shotsFired += spec.count;
        this.state.abilityCooldowns.burst = spec.cooldownMs;
        this.incrementAbilityUsage("burst");
        this.audio.play("ability");
        this.spawnParticles(this.world.player.x, this.world.player.y, [spec.color, "#fff2bf"], 18, 90, 220, 2, 5);
    }

    activateRepairPulse() {
        const spec = CONFIG.abilities.pulse;
        if (!this.canUseAbility("pulse") || !this.spendAbilityEnergy(spec.energyCost)) {
            return;
        }

        const player = this.world.player;
        player.health = Math.min(player.maxHealth, player.health + spec.heal);
        this.state.playerHealth = Math.round(player.health);

        for (let i = this.world.enemies.length - 1; i >= 0; i -= 1) {
            const enemy = this.world.enemies[i];
            const dist = Math.hypot(enemy.x - player.x, enemy.y - player.y);
            if (dist > spec.radius) {
                continue;
            }

            enemy.health -= spec.damage;
            if (enemy.health <= 0) {
                const defeatedEnemy = this.world.enemies.splice(i, 1)[0];
                this.handleEnemyDefeated(enemy, defeatedEnemy);
            }
        }

        this.state.abilityCooldowns.pulse = spec.cooldownMs;
        this.incrementAbilityUsage("pulse");
        this.audio.play("ability");
        this.spawnParticles(player.x, player.y, [spec.color, "#dfffe8"], 20, 80, 200, 2, 6);
    }

    spawnParticles(x, y, palette, count, speedMin, speedMax, sizeMin, sizeMax) {
        if (this.world.particles.length >= CONFIG.effects.maxParticles) {
            return;
        }

        const colors = palette && palette.length ? palette : ["#ffffff"];
        const total = Math.min(count, CONFIG.effects.maxParticles - this.world.particles.length);

        for (let i = 0; i < total; i += 1) {
            const angle = Math.random() * Math.PI * 2;
            const speed = speedMin + Math.random() * (speedMax - speedMin);
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = sizeMin + Math.random() * (sizeMax - sizeMin);
            this.world.particles.push(
                new Particle(
                    x,
                    y,
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed,
                    color,
                    size,
                    CONFIG.effects.particleLifetimeMs
                )
            );
        }
    }

    updateParticles(deltaMs) {
        for (let i = this.world.particles.length - 1; i >= 0; i -= 1) {
            const particle = this.world.particles[i];
            if (particle.update(deltaMs)) {
                this.world.particles.splice(i, 1);
            }
        }
    }

    tryFireProjectile() {
        if (!this.world.player || this.state.mode !== "running") {
            return;
        }

        if (this.loop.shootCooldownMs > 0) {
            return;
        }

        if (this.world.player.energy < CONFIG.combat.fireEnergyCost) {
            return;
        }

        const dirX = this.world.player.facing.x;
        const dirY = this.world.player.facing.y;
        const spawnOffset = this.world.player.radius + CONFIG.combat.projectileRadius + 4;
        const spawnX = this.world.player.x + dirX * spawnOffset;
        const spawnY = this.world.player.y + dirY * spawnOffset;
        this.world.projectiles.push(new Projectile(spawnX, spawnY, dirX, dirY));

        this.world.player.energy = Math.max(0, this.world.player.energy - CONFIG.combat.fireEnergyCost);
        this.state.shotsFired += 1;
        this.loop.shootCooldownMs = CONFIG.combat.fireCooldownMs;
        this.audio.play("shoot");
    }

    toggleMute() {
        this.audio.unlock();
        const isMuted = this.audio.toggleMuted();
        if (!isMuted) {
            this.audio.play("toggle");
        }
        this.updateHud(true);
    }

    applyPlayerDamage(amount) {
        const player = this.world.player;
        if (!player || player.invulnerableMs > 0 || this.state.mode !== "running") {
            return;
        }

        player.health = Math.max(0, player.health - amount);
        player.flashMs = CONFIG.collision.playerFlashMs;
        this.state.playerHealth = Math.round(player.health);
        this.audio.play("hit");
        this.spawnParticles(player.x, player.y, ["#ff8f8f", "#ffd0d0"], 12, 70, 180, 2, 5);
        this.state.screenShakeMs = CONFIG.effects.screenShakeMs;
        this.state.screenShakeStrength = CONFIG.effects.screenShakeStrength;

        if (player.health <= 0) {
            this.handleLifeLost();
        }
    }

    handleLifeLost() {
        this.state.playerLives -= 1;
        this.audio.play("lifeLost");

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
        this.audio.play("respawn");
        this.spawnParticles(player.x, player.y, ["#7ee8ff", "#d7f8ff"], 16, 60, 160, 2, 4);
    }

    endGame() {
        cancelAnimationFrame(this.loop.frameId);
        this.removePowerUpEffects();
        this.state.running = false;
        this.audio.play("gameOver");
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
                if (this.isBossWave() && this.state.wavePhase === "intermission") {
                    this.state.wavePhase = "boss-warning";
                    this.state.bossWarningMs = CONFIG.wave.bossWarningMs;
                    this.audio.play("bossWarning");
                } else {
                    this.startWave();
                }
            }
            return;
        }

        if (this.state.wavePhase === "boss-warning") {
            this.state.bossWarningMs = Math.max(0, this.state.bossWarningMs - deltaMs);
            if (this.state.bossWarningMs <= 0) {
                this.startWave();
            }
            return;
        }

        if (this.state.wavePhase !== "active") {
            return;
        }

        if (this.isBossWave()) {
            if (!this.world.currentBoss) {
                this.finishWave();
            }
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
    updateProjectiles(deltaMs) {
        this.loop.shootCooldownMs = Math.max(0, this.loop.shootCooldownMs - deltaMs);

        for (let i = this.world.projectiles.length - 1; i >= 0; i -= 1) {
            const projectile = this.world.projectiles[i];
            const expired = projectile.update(deltaMs, this.arenaBounds);
            if (expired) {
                this.world.projectiles.splice(i, 1);
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
            this.audio.play("pickup");
            this.spawnParticles(pickup.x, pickup.y, [spec.color], 10, 40, 120, 2, 4);
            return;
        }

        if (typeKey === "energy") {
            this.world.player.energy = Math.min(this.world.player.maxEnergy, this.world.player.energy + spec.amount);
            this.audio.play("pickup");
            this.spawnParticles(pickup.x, pickup.y, [spec.color], 10, 40, 120, 2, 4);
            return;
        }

        this.removePowerUpEffects();

        if (typeKey === "shield") {
            this.state.activePowerUp = "Shield";
            this.state.powerUpRemainingMs = spec.durationMs;
            this.audio.play("pickup");
            this.spawnParticles(pickup.x, pickup.y, [spec.color, "#fff7cc"], 14, 50, 150, 2, 5);
            return;
        }

        if (typeKey === "haste") {
            this.state.activePowerUp = "Haste";
            this.state.powerUpRemainingMs = spec.durationMs;
            this.world.player.speed = this.basePlayerSpeed + spec.amount;
            this.audio.play("pickup");
            this.spawnParticles(pickup.x, pickup.y, [spec.color, "#ffd8be"], 14, 50, 150, 2, 5);
            return;
        }

        if (typeKey === "scoreBurst") {
            this.state.activePowerUp = "Score Burst";
            this.state.powerUpRemainingMs = spec.durationMs;
            this.state.scoreBonusMultiplier = 1 + spec.amount;
            this.audio.play("pickup");
            this.spawnParticles(pickup.x, pickup.y, [spec.color, "#ffd8ff"], 14, 50, 150, 2, 5);
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
        this.resolveProjectileEnemyCollisions();
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
                    this.audio.play("shieldBlock");
                    this.spawnParticles(enemy.x, enemy.y, ["#7ee8ff", "#d7f8ff"], 8, 30, 100, 2, 4);
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

    resolveProjectileEnemyCollisions() {
        for (let i = this.world.projectiles.length - 1; i >= 0; i -= 1) {
            const projectile = this.world.projectiles[i];
            let consumed = false;

            for (let j = this.world.enemies.length - 1; j >= 0; j -= 1) {
                const enemy = this.world.enemies[j];
                if (!this.circlesOverlap(projectile, enemy, 0)) {
                    continue;
                }

                enemy.health -= CONFIG.combat.projectileDamage;
                this.state.shotsHit += 1;
                consumed = true;

                if (enemy.health <= 0) {
                    const defeatedEnemy = this.world.enemies.splice(j, 1)[0];
                    this.handleEnemyDefeated(enemy, defeatedEnemy);

                    if (defeatedEnemy && Math.random() < CONFIG.combat.spawnOnDefeatChance) {
                        this.spawnPowerUpAt(defeatedEnemy.x, defeatedEnemy.y);
                    }
                }

                break;
            }

            if (consumed) {
                this.world.projectiles.splice(i, 1);
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

        if (this.state.screenShakeMs > 0) {
            const shakeRatio = this.state.screenShakeMs / CONFIG.effects.screenShakeMs;
            const shakeStrength = (this.state.screenShakeStrength || CONFIG.effects.screenShakeStrength) * shakeRatio;
            ctx.save();
            ctx.translate(
                (Math.random() * 2 - 1) * shakeStrength,
                (Math.random() * 2 - 1) * shakeStrength
            );
        }

        this.drawGrid();
        this.drawArenaMarkers();
        this.drawObstacles();
        this.drawEnemies();
        this.drawProjectiles();
        this.drawParticles();
        this.drawPickups();
        this.drawPlayer();
        this.drawBossStatus();
        this.drawDebugBanner();

        if (this.state.screenShakeMs > 0) {
            ctx.restore();
        }
    }

    drawProjectiles() {
        for (let i = 0; i < this.world.projectiles.length; i += 1) {
            this.world.projectiles[i].draw(this.ctx);
        }
    }

    drawBossStatus() {
        const boss = this.world.currentBoss;
        const { ctx, canvas } = this;

        if (this.state.wavePhase === "boss-warning") {
            const remaining = Math.max(0, Math.ceil(this.state.bossWarningMs / 1000));
            ctx.save();
            ctx.textAlign = "center";
            ctx.fillStyle = "#ffd66f";
            ctx.font = "700 28px Trebuchet MS";
            ctx.fillText("BOSS INCOMING", canvas.width * 0.5, 74);
            ctx.font = "600 18px Trebuchet MS";
            ctx.fillText("Arrival in " + String(remaining) + "s", canvas.width * 0.5, 102);
            ctx.restore();
            return;
        }

        if (!boss) {
            return;
        }

        const barWidth = 420;
        const barHeight = 18;
        const x = canvas.width * 0.5 - barWidth * 0.5;
        const y = 26;
        const ratio = boss.maxHealth > 0 ? Math.max(0, boss.health / boss.maxHealth) : 0;

        ctx.save();
        ctx.fillStyle = "rgba(8, 18, 28, 0.78)";
        ctx.fillRect(x - 10, y - 14, barWidth + 20, barHeight + 44);

        ctx.fillStyle = "#ffd66f";
        ctx.font = "700 16px Trebuchet MS";
        ctx.textAlign = "center";
        ctx.fillText("BOSS", canvas.width * 0.5, y + 2);

        ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
        ctx.fillRect(x, y + 14, barWidth, barHeight);
        ctx.fillStyle = "#ff6a88";
        ctx.fillRect(x, y + 14, barWidth * ratio, barHeight);
        ctx.strokeStyle = "rgba(255, 214, 111, 0.75)";
        ctx.strokeRect(x, y + 14, barWidth, barHeight);

        ctx.fillStyle = "#d8f2ff";
        ctx.font = "600 13px Trebuchet MS";
        ctx.fillText(String(Math.round(boss.health)) + "/" + String(boss.maxHealth), canvas.width * 0.5, y + 48);
        ctx.restore();
    }

    drawParticles() {
        for (let i = 0; i < this.world.particles.length; i += 1) {
            this.world.particles[i].draw(this.ctx);
        }
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
        ctx.fillText("Commit 14: Boss wave pressure online (" + state.mode + ")", canvas.width * 0.5, canvas.height * 0.51);

        ctx.font = "400 16px Trebuchet MS";
        ctx.fillText("Every fifth wave escalates into a boss fight with a warning phase", canvas.width * 0.5, canvas.height * 0.55);
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

        if (this.ui.abilityEl) {
            const abilityCooldown = this.state.abilityCooldowns;
            const dashText = abilityCooldown.dash > 0 ? "Dash " + String(Math.ceil(abilityCooldown.dash / 1000)) + "s" : "Dash ready";
            const burstText = abilityCooldown.burst > 0 ? "Burst " + String(Math.ceil(abilityCooldown.burst / 1000)) + "s" : "Burst ready";
            const pulseText = abilityCooldown.pulse > 0 ? "Pulse " + String(Math.ceil(abilityCooldown.pulse / 1000)) + "s" : "Pulse ready";
            this.ui.abilityEl.textContent = dashText + " | " + burstText + " | " + pulseText;
        }

        if (this.ui.abilityBtn) {
            const dashReady = this.state.abilityCooldowns.dash <= 0;
            this.ui.abilityBtn.textContent = dashReady ? "Dash Ability" : "Dash " + String(Math.ceil(this.state.abilityCooldowns.dash / 1000)) + "s";
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

        if (this.ui.waveTypeEl) {
            this.ui.waveTypeEl.textContent = this.isBossWave() ? "boss" : "standard";
        }

        if (this.ui.wavePhaseEl) {
            let phaseText = this.state.wavePhase;
            if (this.state.wavePhase === "intermission" || this.state.wavePhase === "complete") {
                const remaining = Math.max(0, Math.ceil(this.loop.waveClock / 1000));
                phaseText = this.state.wavePhase + " " + String(remaining) + "s";
            } else if (this.state.wavePhase === "boss-warning") {
                const remaining = Math.max(0, Math.ceil(this.state.bossWarningMs / 1000));
                phaseText = "boss-warning " + String(remaining) + "s";
            }
            this.ui.wavePhaseEl.textContent = phaseText;
        }

        if (this.ui.waveProgressEl) {
            this.ui.waveProgressEl.textContent = String(this.state.waveEnemiesSpawned) + "/" + String(this.state.waveEnemiesToSpawn);
        }

        if (this.ui.bossEl) {
            if (this.state.wavePhase === "boss-warning") {
                this.ui.bossEl.textContent = "incoming";
            } else if (this.world.currentBoss) {
                this.ui.bossEl.textContent = String(this.state.bossHealth) + "/" + String(this.state.bossMaxHealth);
            } else {
                this.ui.bossEl.textContent = this.isBossWave() ? "waiting" : "none";
            }
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

        if (this.ui.defeatedEl) {
            this.ui.defeatedEl.textContent = String(this.state.waveDefeated);
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

        if (this.ui.accuracyEl) {
            const accuracy = this.state.shotsFired > 0
                ? Math.round((this.state.shotsHit / this.state.shotsFired) * 100)
                : 0;
            this.ui.accuracyEl.textContent = String(accuracy) + "%";
        }

        if (this.ui.audioEl) {
            this.ui.audioEl.textContent = this.audio.getStatusLabel();
        }

        if (this.ui.bootOverlay && this.state.mode === "running") {
            const activeText = this.ui.bootOverlay.querySelector("p");
            if (activeText) {
                if (this.state.wavePhase === "boss-warning") {
                    const remaining = Math.max(0, Math.ceil(this.state.bossWarningMs / 1000));
                    activeText.textContent = "Boss incoming in " + String(remaining) + "s. Prepare for the showdown.";
                } else if (this.world.currentBoss) {
                    activeText.textContent = "Boss engaged. Stay mobile and drain its health bar.";
                } else {
                    activeText.textContent = "Simulation active. Build milestones to unlock achievements.";
                }
            }
        }

        if (this.ui.muteBtn) {
            this.ui.muteBtn.textContent = this.audio.muted ? "Unmute Audio" : "Mute Audio";
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
        waveTypeEl: document.getElementById("waveTypeValue"),
        wavePhaseEl: document.getElementById("wavePhaseValue"),
        waveProgressEl: document.getElementById("waveProgressValue"),
        bossEl: document.getElementById("bossValue"),
        abilityEl: document.getElementById("abilityValue"),
        abilityBtn: document.getElementById("abilityBtn"),
        fpsEl: document.getElementById("fpsValue"),
        enemiesEl: document.getElementById("enemiesValue"),
        impactsEl: document.getElementById("impactsValue"),
        defeatedEl: document.getElementById("defeatedValue"),
        powerUpEl: document.getElementById("powerUpValue"),
        pickupsEl: document.getElementById("pickupsValue"),
        accuracyEl: document.getElementById("accuracyValue"),
        audioEl: document.getElementById("audioValue"),
        achievementFeed: document.getElementById("achievementFeed"),
        startBtn: document.getElementById("startBtn"),
        pauseBtn: document.getElementById("pauseBtn"),
        skipBtn: document.getElementById("skipBtn"),
        resetBtn: document.getElementById("resetBtn"),
        muteBtn: document.getElementById("muteBtn"),
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
