// Castle Defenders - Tower Defense RPG
// Commit 18: Save/Load system

// ============================================
// GAME CONFIGURATION
// ============================================
const CONFIG = {
    // Canvas settings
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    GRID_SIZE: 40,
    
    // Game balance
    STARTING_GOLD: 100,
    STARTING_MANA: 50,
    STARTING_LIVES: 25,
    STARTING_WAVE: 1,
    
    // Mana regeneration
    MANA_REGEN_PER_SECOND: 0.5,  // Passive mana regeneration
    MANA_PER_KILL: 2,             // Mana gained per enemy killed
    MANA_PER_WAVE: 10,            // Bonus mana at wave completion
    MAX_MANA: 100,                // Maximum mana capacity
    
    // FPS and timing
    TARGET_FPS: 60,
    FRAME_TIME: 1000 / 60,
    
    // Wave settings
    WAVE_SPAWN_DELAY: 2000,  // ms between enemy spawns
    WAVE_INTERVAL: 5000,     // ms between waves
    BOSS_WAVE_INTERVAL: 5,   // Boss appears every 5 waves
    
    // Colors
    COLORS: {
        PATH: '#8B7355',
        PATH_BORDER: '#654321',
        GRASS: '#6B8E23',
        BUILD_ZONE: 'rgba(100, 200, 100, 0.3)',
        NO_BUILD_ZONE: 'rgba(200, 100, 100, 0.3)',
        GRID_LINE: 'rgba(255, 255, 255, 0.1)',
        SKY: '#87CEEB',
        GROUND: '#8FBC8F',
        CASTLE: '#8B4513',
        SPAWN: '#FF4444'
    },
    
    // Path waypoints (in grid coordinates)
    PATH_WAYPOINTS: [
        { x: 0, y: 7 },     // Spawn point (left edge)
        { x: 5, y: 7 },     // First turn
        { x: 5, y: 3 },     // Up
        { x: 10, y: 3 },    // Right
        { x: 10, y: 10 },   // Down
        { x: 15, y: 10 },   // Right
        { x: 15, y: 5 },    // Up
        { x: 19, y: 5 }     // Castle (right edge)
    ],
    
    // Tower types
    TOWER_TYPES: {
        archer: {
            name: 'Archer Tower',
            icon: '🏹',
            cost: 20,
            damage: 10,
            range: 120,
            fireRate: 1.0,  // attacks per second
            projectileSpeed: 300,
            color: '#8B4513',
            description: 'Fast attack, medium damage'
        },
        mage: {
            name: 'Mage Tower',
            icon: '🔮',
            cost: 30,
            damage: 25,
            range: 100,
            fireRate: 0.5,
            projectileSpeed: 200,
            color: '#9370DB',
            aoe: 50,  // Area of effect radius
            description: 'Slow attack, high AOE damage'
        },
        cannon: {
            name: 'Cannon Tower',
            icon: '💣',
            cost: 40,
            damage: 35,
            range: 150,
            fireRate: 0.4,
            projectileSpeed: 250,
            color: '#696969',
            splash: 60,  // Splash damage radius
            description: 'Splash damage, good range'
        },
        lightning: {
            name: 'Lightning Tower',
            icon: '⚡',
            cost: 50,
            damage: 20,
            range: 130,
            fireRate: 0.8,
            chain: 3,  // Number of chain targets
            color: '#FFD700',
            description: 'Chain damage to multiple enemies'
        }
    },
    
    // Upgrade system
    UPGRADE: {
        MAX_LEVEL: 5,
        COST_MULTIPLIER: 1.5,  // Cost increases by 50% per level
        DAMAGE_PER_LEVEL: 1.3,  // 30% damage increase per level
        RANGE_PER_LEVEL: 1.1,   // 10% range increase per level
        FIRE_RATE_PER_LEVEL: 1.15  // 15% fire rate increase per level
    },
    
    // Tower selling
    SELL_REFUND_PERCENT: 0.75,  // Get back 75% of total investment
    SELL_REFUND_UPGRADED: 0.6,  // Get back 60% for upgraded towers
    
    // Enemy types
    ENEMY_TYPES: {
        basic: {
            name: 'Basic Enemy',
            icon: '👾',
            health: 50,
            speed: 50,  // pixels per second
            goldReward: 5,
            damage: 1,  // damage to castle
            color: '#FF6B6B',
            size: 16
        },
        fast: {
            name: 'Fast Enemy',
            icon: '💨',
            health: 30,
            speed: 80,
            goldReward: 7,
            damage: 1,
            color: '#4ECDC4',
            size: 14
        },
        tank: {
            name: 'Tank Enemy',
            icon: '🛡️',
            health: 150,
            speed: 30,
            goldReward: 15,
            damage: 3,
            color: '#95E1D3',
            size: 20
        },
        flying: {
            name: 'Flying Enemy',
            icon: '🦅',
            health: 40,
            speed: 60,
            goldReward: 10,
            damage: 1,
            color: '#F38181',
            size: 16,
            flying: true
        },
        boss: {
            name: 'Boss',
            icon: '👑',
            health: 500,  // Will scale with wave number
            speed: 35,
            goldReward: 50,
            damage: 5,
            color: '#FF0066',
            size: 32,
            isBoss: true
        }
    },
    
    // Special abilities
    ABILITIES: {
        freeze: {
            name: 'Ice Freeze',
            icon: '🧊',
            manaCost: 30,
            cooldown: 20000,  // 20 seconds
            duration: 5000,   // 5 seconds
            effect: 0.5,      // 50% speed reduction
            color: '#00BFFF',
            description: 'Slow all enemies by 50% for 5s'
        },
        meteor: {
            name: 'Meteor Strike',
            icon: '☄️',
            manaCost: 40,
            cooldown: 25000,  // 25 seconds
            damage: 100,
            radius: 80,
            color: '#FF4500',
            description: 'Deal 100 damage in target area'
        },
        goldRush: {
            name: 'Gold Rush',
            icon: '💰',
            manaCost: 20,
            cooldown: 30000,  // 30 seconds
            duration: 10000,  // 10 seconds
            multiplier: 2,    // 2x gold
            color: '#FFD700',
            description: 'Double gold rewards for 10s'
        },
        timeWarp: {
            name: 'Time Warp',
            icon: '⏰',
            manaCost: 35,
            cooldown: 22000,  // 22 seconds
            duration: 7000,   // 7 seconds
            speedBoost: 1.5,  // 1.5x fire rate
            color: '#9370DB',
            description: 'Increase tower fire rate by 50% for 7s'
        }
    },
    
    // Achievements
    ACHIEVEMENTS: {
        firstBlood: {
            id: 'firstBlood',
            name: 'First Blood',
            description: 'Kill your first enemy',
            icon: '🩸',
            requirement: { type: 'kills', value: 1 }
        },
        slayer: {
            id: 'slayer',
            name: 'Enemy Slayer',
            description: 'Kill 50 enemies',
            icon: '⚔️',
            requirement: { type: 'kills', value: 50 }
        },
        veteran: {
            id: 'veteran',
            name: 'Veteran Defender',
            description: 'Kill 100 enemies',
            icon: '🎯',
            requirement: { type: 'kills', value: 100 }
        },
        survivor: {
            id: 'survivor',
            name: 'Survivor',
            description: 'Reach wave 10',
            icon: '🌊',
            requirement: { type: 'wave', value: 10 }
        },
        bossSlayer: {
            id: 'bossSlayer',
            name: 'Boss Slayer',
            description: 'Defeat your first boss',
            icon: '👑',
            requirement: { type: 'bossKills', value: 1 }
        },
        wealthy: {
            id: 'wealthy',
            name: 'Wealthy Defender',
            description: 'Accumulate 500 gold',
            icon: '💰',
            requirement: { type: 'gold', value: 500 }
        },
        architect: {
            id: 'architect',
            name: 'Master Architect',
            description: 'Place 10 towers',
            icon: '🏭',
            requirement: { type: 'towersPlaced', value: 10 }
        },
        upgraded: {
            id: 'upgraded',
            name: 'Upgrade Expert',
            description: 'Upgrade a tower to max level',
            icon: '⬆️',
            requirement: { type: 'maxUpgrade', value: 1 }
        }
    }
};

// ============================================
// TOWER CLASS
// ============================================
class Tower {
    constructor(gridX, gridY, type) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.x = gridX * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2;
        this.y = gridY * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2;
        
        this.type = type;
        this.config = CONFIG.TOWER_TYPES[type];
        
        // Tower stats
        this.level = 1;
        this.damage = this.config.damage;
        this.range = this.config.range;
        this.fireRate = this.config.fireRate;
        this.cost = this.config.cost;
        
        // Shooting logic
        this.timeSinceLastShot = 0;
        this.target = null;
        this.rotation = 0;
        
        // Visual effects
        this.pulsePhase = Math.random() * Math.PI * 2;
    }
    
    // Update tower logic
    update(deltaTime, enemies) {
        this.timeSinceLastShot += deltaTime / 1000;
        this.pulsePhase += deltaTime * 0.003;
        
        // Find target
        this.findTarget(enemies);
        
        // Rotate towards target
        if (this.target) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            this.rotation = Math.atan2(dy, dx);
        }
    }
    
    // Find nearest enemy in range
    findTarget(enemies) {
        // Clear target if it's dead or out of range
        if (this.target && (!this.target.isAlive || !this.isInRange(this.target))) {
            this.target = null;
        }
        
        // Find new target if we don't have one
        if (!this.target) {
            let closestDistance = Infinity;
            let closestEnemy = null;
            
            enemies.forEach(enemy => {
                if (enemy.isAlive && this.isInRange(enemy)) {
                    const dx = enemy.x - this.x;
                    const dy = enemy.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestEnemy = enemy;
                    }
                }
            });
            
            this.target = closestEnemy;
        }
    }
    
    // Try to shoot at target
    tryShoot(game) {
        if (!this.target || !this.target.isAlive) return null;
        
        // Check fire rate
        const fireInterval = 1 / this.fireRate;
        if (this.timeSinceLastShot < fireInterval) return null;
        
        // Fire!
        this.timeSinceLastShot = 0;
        return new Projectile(this.x, this.y, this.target, this, game);
    }
    
    // Check if enemy is in range
    isInRange(enemy) {
        const dx = enemy.x - this.x;
        const dy = enemy.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= this.range;
    }
    
    // Get upgrade cost
    getUpgradeCost() {
        return Math.floor(this.cost * Math.pow(CONFIG.UPGRADE.COST_MULTIPLIER, this.level - 1));
    }
    
    // Check if tower can be upgraded
    canUpgrade() {
        return this.level < CONFIG.UPGRADE.MAX_LEVEL;
    }
    
    // Upgrade the tower
    upgrade() {
        if (!this.canUpgrade()) return false;
        
        this.level++;
        
        // Update stats based on upgrade multipliers
        this.damage *= CONFIG.UPGRADE.DAMAGE_PER_LEVEL;
        this.range *= CONFIG.UPGRADE.RANGE_PER_LEVEL;
        this.fireRate *= CONFIG.UPGRADE.FIRE_RATE_PER_LEVEL;
        
        return true;
    }
    
    // Calculate sell value (total investment with refund percentage)
    getSellValue() {
        // Calculate total investment (base cost + all upgrade costs)
        let totalInvestment = this.config.cost;
        
        // Add upgrade costs for each level
        for (let i = 1; i < this.level; i++) {
            totalInvestment += Math.floor(this.config.cost * Math.pow(CONFIG.UPGRADE.COST_MULTIPLIER, i));
        }
        
        // Apply refund percentage (lower refund for upgraded towers to prevent abuse)
        const refundPercent = this.level === 1 ? CONFIG.SELL_REFUND_PERCENT : CONFIG.SELL_REFUND_UPGRADED;
        
        return Math.floor(totalInvestment * refundPercent);
    }
    
    // Draw the tower
    draw(ctx) {
        const size = CONFIG.GRID_SIZE;
        const x = this.gridX * size;
        const y = this.gridY * size;
        
        // Range indicator (when selected)
        if (this.isSelected) {
            ctx.fillStyle = 'rgba(100, 200, 255, 0.15)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Tower base
        ctx.fillStyle = this.config.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.config.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Tower border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Tower barrel/targeting indicator (if has target)
        if (this.target && this.target.isAlive) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            // Draw barrel
            ctx.fillStyle = '#333';
            ctx.fillRect(size * 0.2, -3, size * 0.2, 6);
            
            ctx.restore();
        }
        
        // Tower icon
        ctx.font = `${size * 0.5}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.fillText(this.config.icon, this.x, this.y);
        
        // Level indicator
        if (this.level > 1) {
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 10px Arial';
            ctx.fillText(`Lv${this.level}`, this.x, this.y + size * 0.4);
        }
        
        // Pulse effect
        const pulse = Math.sin(this.pulsePhase) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(255, 255, 255, ${pulse * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size * 0.35 + pulse * 5, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// ============================================
// PROJECTILE CLASS
// ============================================
class Projectile {
    constructor(x, y, target, tower, game) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.tower = tower;
        this.game = game;
        
        this.speed = tower.config.projectileSpeed;
        this.damage = tower.damage;
        this.type = tower.type;
        
        // Visual
        this.size = 4;
        this.isAlive = true;
        this.hasHit = false;
    }
    
    // Update projectile movement
    update(deltaTime) {
        if (!this.isAlive || !this.target || !this.target.isAlive) {
            this.isAlive = false;
            return;
        }
        
        // Calculate direction to target
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if hit target
        if (distance < 10) {
            this.hit();
            return;
        }
        
        // Move towards target
        const moveDistance = this.speed * (deltaTime / 1000);
        this.x += (dx / distance) * moveDistance;
        this.y += (dy / distance) * moveDistance;
    }
    
    // Hit the target
    hit() {
        if (this.hasHit) return;
        
        this.hasHit = true;
        this.isAlive = false;
        
        // Deal damage
        if (this.target && this.target.isAlive) {
            this.target.takeDamage(this.damage);
            
            // Create hit particles
            if (this.game) {
                this.createHitParticles();
            }
        }
    }
    
    // Create hit particles
    createHitParticles() {
        const colors = {
            'archer': '#8B4513',
            'mage': '#9370DB',
            'cannon': '#FF6B00',
            'lightning': '#FFD700'
        };
        
        const color = colors[this.type] || '#FFF';
        const count = this.type === 'cannon' ? 12 : 8;
        
        for (let i = 0; i < count; i++) {
            const particle = new Particle(this.x, this.y, 'hit', {
                color: color,
                size: 2 + Math.random() * 3,
                speed: 50 + Math.random() * 100,
                lifetime: 0.3 + Math.random() * 0.3,
                gravity: 100
            });
            this.game.particles.push(particle);
        }
    }
    
    // Draw the projectile
    draw(ctx) {
        if (!this.isAlive) return;
        
        // Different visuals per tower type
        switch(this.type) {
            case 'archer':
                // Arrow
                ctx.fillStyle = '#8B4513';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#654321';
                ctx.lineWidth = 1;
                ctx.stroke();
                break;
                
            case 'mage':
                // Magic orb
                ctx.fillStyle = '#9370DB';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#9370DB';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size + 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                break;
                
            case 'cannon':
                // Cannonball
                ctx.fillStyle = '#333';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size + 1, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.stroke();
                break;
                
            case 'lightning':
                // Lightning bolt
                ctx.fillStyle = '#FFD700';
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#FFD700';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size + 1, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                break;
        }
    }
}

// ============================================
// PARTICLE CLASS
// ============================================
class Particle {
    constructor(x, y, type, options = {}) {
        this.x = x;
        this.y = y;
        this.type = type;
        
        // Velocity
        const angle = options.angle !== undefined ? options.angle : Math.random() * Math.PI * 2;
        const speed = options.speed !== undefined ? options.speed : 50 + Math.random() * 100;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        // Appearance
        this.color = options.color || '#FFD700';
        this.size = options.size || 3 + Math.random() * 3;
        this.alpha = 1;
        this.lifetime = options.lifetime || 0.5 + Math.random() * 0.5;
        this.age = 0;
        
        // Physics
        this.gravity = options.gravity !== undefined ? options.gravity : 200;
        this.friction = options.friction !== undefined ? options.friction : 0.98;
        
        this.isAlive = true;
    }
    
    update(deltaTime) {
        const dt = deltaTime / 1000;
        this.age += dt;
        
        // Apply velocity
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        // Apply physics
        this.vy += this.gravity * dt;
        this.vx *= this.friction;
        this.vy *= this.friction;
        
        // Fade out
        this.alpha = 1 - (this.age / this.lifetime);
        
        // Check if dead
        if (this.age >= this.lifetime) {
            this.isAlive = false;
        }
    }
    
    draw(ctx) {
        if (!this.isAlive || this.alpha <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        switch(this.type) {
            case 'hit':
                // Impact spark
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'death':
                // Explosion particle
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                break;
                
            case 'gold':
                // Gold coin sparkle
                ctx.fillStyle = '#FFD700';
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#FFD700';
                ctx.font = `${this.size * 3}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('✨', this.x, this.y);
                ctx.shadowBlur = 0;
                break;
                
            case 'mana':
                // Mana crystal sparkle
                ctx.fillStyle = '#60A5FA';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#60A5FA';
                ctx.font = `${this.size * 3}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('💙', this.x, this.y);
                ctx.shadowBlur = 0;
                break;
                
            case 'muzzle':
                // Muzzle flash
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 15;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                break;
        }
        
        ctx.restore();
    }
}

// ============================================
// ENEMY CLASS
// ============================================
class Enemy {
    constructor(type, wave) {
        this.type = type;
        this.config = CONFIG.ENEMY_TYPES[type];
        this.wave = wave;
        
        // Enemy stats
        this.maxHealth = this.config.health * (1 + wave * 0.15);  // Scale with wave
        this.health = this.maxHealth;
        this.speed = this.config.speed;
        this.goldReward = this.config.goldReward;
        this.damage = this.config.damage;
        
        // Position and movement
        this.waypointIndex = 0;
        this.x = CONFIG.PATH_WAYPOINTS[0].x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2;
        this.y = CONFIG.PATH_WAYPOINTS[0].y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2;
        
        // Status
        this.isAlive = true;
        this.reachedEnd = false;
        
        // Visual effects
        this.rotation = 0;
        this.hurtTimer = 0;
    }
    
    // Update enemy movement
    update(deltaTime) {
        if (!this.isAlive || this.reachedEnd) return;
        
        // Decrease hurt timer
        if (this.hurtTimer > 0) {
            this.hurtTimer -= deltaTime;
        }
        
        // Get current target waypoint
        if (this.waypointIndex >= CONFIG.PATH_WAYPOINTS.length) {
            this.reachedEnd = true;
            return;
        }
        
        const targetWaypoint = CONFIG.PATH_WAYPOINTS[this.waypointIndex];
        const targetX = targetWaypoint.x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2;
        const targetY = targetWaypoint.y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2;
        
        // Calculate direction
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if reached waypoint
        if (distance < 5) {
            this.waypointIndex++;
            return;
        }
        
        // Move towards waypoint
        const moveDistance = this.speed * (deltaTime / 1000);
        this.x += (dx / distance) * moveDistance;
        this.y += (dy / distance) * moveDistance;
        
        // Update rotation for visual effect
        this.rotation = Math.atan2(dy, dx);
    }
    
    // Take damage
    takeDamage(amount) {
        this.health -= amount;
        this.hurtTimer = 200; // ms
        
        if (this.health <= 0) {
            this.isAlive = false;
        }
    }
    
    // Draw the enemy
    draw(ctx) {
        if (!this.isAlive) return;
        
        const size = this.config.size;
        
        // Flash red when hurt
        if (this.hurtTimer > 0) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#FF0000';
        }
        
        // Enemy body
        ctx.fillStyle = this.config.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Enemy border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        
        // Enemy icon
        ctx.font = `${size * 1.2}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.config.icon, this.x, this.y);
        
        // Health bar
        this.drawHealthBar(ctx);
    }
    
    // Draw health bar
    drawHealthBar(ctx) {
        const barWidth = 30;
        const barHeight = 4;
        const x = this.x - barWidth / 2;
        const y = this.y - this.config.size - 8;
        
        // Background
        ctx.fillStyle = '#000';
        ctx.fillRect(x - 1, y - 1, barWidth + 2, barHeight + 2);
        
        // Red background
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Green health
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(x, y, barWidth * healthPercent, barHeight);
    }
}

// ============================================
// MAIN GAME CLASS
// ============================================
class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        
        // Game state
        this.state = {
            gold: CONFIG.STARTING_GOLD,
            mana: CONFIG.STARTING_MANA,
            lives: CONFIG.STARTING_LIVES,
            wave: CONFIG.STARTING_WAVE,
            score: 0,
            isPaused: false,
            gameOver: false,
            gameStarted: false,
            speedMultiplier: 1,  // Game speed: 1x, 2x, or 3x
            totalKills: 0  // Track total enemies killed
        };
        
        // Achievement tracking
        this.achievements = {};  // Unlocked achievements
        this.achievementStats = {
            bossKills: 0,
            towersPlaced: 0,
            maxUpgrade: 0
        };
        this.achievementNotifications = [];  // Queue for achievement popups
        
        // Initialize achievements as locked
        Object.keys(CONFIG.ACHIEVEMENTS).forEach(key => {
            this.achievements[key] = false;
        });
        
        // Game objects (will be populated in future commits)
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.powerUps = [];
        
        // Timing
        this.lastFrameTime = 0;
        this.deltaTime = 0;
        this.frameCount = 0;
        
        // Wave management
        this.waveActive = false;
        this.waveComplete = false;
        this.timeSinceLastSpawn = 0;
        this.enemiesSpawned = 0;
        this.enemiesPerWave = 5;  // Will increase with wave number
        this.timeBetweenWaves = CONFIG.WAVE_INTERVAL;
        this.waveAutoStart = false;  // Prevent auto-start, use button instead
        
        // Input handling
        this.mouse = {
            x: 0,
            y: 0,
            isDown: false,
            gridX: 0,
            gridY: 0
        };
        
        // Selected elements
        this.selectedTower = null;
        this.hoveredCell = null;
        this.selectedTowerType = null;  // Type of tower to place
        
        // Abilities system
        this.abilities = {
            freeze: { cooldownRemaining: 0, isActive: false, timeRemaining: 0 },
            meteor: { cooldownRemaining: 0, isActive: false, timeRemaining: 0 },
            goldRush: { cooldownRemaining: 0, isActive: false, timeRemaining: 0 },
            timeWarp: { cooldownRemaining: 0, isActive: false, timeRemaining: 0 }
        };
        this.meteorTarget = null;  // For meteor targeting
        this.meteorTargeting = false;
        
        // Boss system
        this.currentBoss = null;
        this.bossWarning = false;
        this.bossWarningTime = 0;
        
        // Initialize grid and path
        this.initializeGrid();
        
        console.log('Game class initialized');
        this.setupEventListeners();
        this.setupTowerButtons();
        this.setupUpgradeButton();
        this.setupSellButton();
        this.setupAbilityButtons();
        this.setupSpeedButtons();
        this.setupNextWaveButton();
        this.setupSaveLoadButtons();
        this.updateUI();
        this.updateWaveInfo();
    }
    
    // ============================================
    // GRID AND PATH SYSTEM
    // ============================================
    
    // Initialize grid
    initializeGrid() {
        const cols = Math.floor(this.canvas.width / CONFIG.GRID_SIZE);
        const rows = Math.floor(this.canvas.height / CONFIG.GRID_SIZE);
        
        // Create 2D array for grid
        this.grid = [];
        for (let y = 0; y < rows; y++) {
            this.grid[y] = [];
            for (let x = 0; x < cols; x++) {
                this.grid[y][x] = {
                    x: x,
                    y: y,
                    isPath: false,
                    isBuildable: true,
                    hasTower: false
                };
            }
        }
        
        // Mark path cells
        this.createPath();
        
        // Set spawn and castle positions
        this.spawnPoint = { 
            x: CONFIG.PATH_WAYPOINTS[0].x, 
            y: CONFIG.PATH_WAYPOINTS[0].y 
        };
        this.castlePoint = { 
            x: CONFIG.PATH_WAYPOINTS[CONFIG.PATH_WAYPOINTS.length - 1].x, 
            y: CONFIG.PATH_WAYPOINTS[CONFIG.PATH_WAYPOINTS.length - 1].y 
        };
        
        console.log('Grid initialized:', cols, 'x', rows);
        console.log('Path created with', CONFIG.PATH_WAYPOINTS.length, 'waypoints');
    }
    
    // Create path based on waypoints
    createPath() {
        // Connect waypoints with path
        for (let i = 0; i < CONFIG.PATH_WAYPOINTS.length - 1; i++) {
            const start = CONFIG.PATH_WAYPOINTS[i];
            const end = CONFIG.PATH_WAYPOINTS[i + 1];
            
            // Draw path between waypoints
            this.drawPathSegment(start, end);
        }
    }
    
    // Draw path segment between two waypoints
    drawPathSegment(start, end) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const steps = Math.max(Math.abs(dx), Math.abs(dy));
        
        for (let i = 0; i <= steps; i++) {
            const t = steps === 0 ? 0 : i / steps;
            const x = Math.round(start.x + dx * t);
            const y = Math.round(start.y + dy * t);
            
            if (this.grid[y] && this.grid[y][x]) {
                this.grid[y][x].isPath = true;
                this.grid[y][x].isBuildable = false;
            }
        }
    }
    
    // Get cell at grid coordinates
    getCell(gridX, gridY) {
        if (this.grid[gridY] && this.grid[gridY][gridX]) {
            return this.grid[gridY][gridX];
        }
        return null;
    }
    
    // Check if cell is buildable
    isCellBuildable(gridX, gridY) {
        const cell = this.getCell(gridX, gridY);
        return cell && cell.isBuildable && !cell.hasTower;
    }
    
    // ============================================
    // WAVE AND ENEMY SPAWNING
    // ============================================
    
    // Start next wave
    startWave() {
        if (this.waveActive || this.state.gameOver) return;
        
        this.waveActive = true;
        this.waveComplete = false;
        this.enemiesSpawned = 0;
        this.timeSinceLastSpawn = 0;
        
        // Hide next wave button
        this.hideNextWaveButton();
        
        // Check if this is a boss wave
        const isBossWave = this.state.wave % CONFIG.BOSS_WAVE_INTERVAL === 0;
        
        if (isBossWave) {
            // Boss wave - show warning
            this.bossWarning = true;
            this.bossWarningTime = 3000; // 3 seconds warning
            this.enemiesPerWave = 1; // Only boss
            console.log(`⚠️ BOSS WAVE ${this.state.wave}! A powerful boss is approaching!`);
        } else {
            // Calculate enemies for this wave
            this.enemiesPerWave = 5 + this.state.wave * 2;
            console.log(`Wave ${this.state.wave} started! Enemies: ${this.enemiesPerWave}`);
        }
    }
    
    // Spawn an enemy
    spawnEnemy() {
        // Check if this is a boss wave
        const isBossWave = this.state.wave % CONFIG.BOSS_WAVE_INTERVAL === 0;
        
        let enemyType = 'basic';
        
        if (isBossWave) {
            // Spawn boss
            enemyType = 'boss';
        } else if (this.state.wave >= 3) {
            // Random mix of enemy types
            const rand = Math.random();
            if (rand < 0.5) {
                enemyType = 'basic';
            } else if (rand < 0.75) {
                enemyType = 'fast';
            } else if (rand < 0.9) {
                enemyType = 'tank';
            } else {
                enemyType = 'flying';
            }
        } else if (this.state.wave === 2) {
            // Introduce fast enemies
            enemyType = Math.random() < 0.7 ? 'basic' : 'fast';
        }
        
        const enemy = new Enemy(enemyType, this.state.wave);
        this.enemies.push(enemy);
        this.enemiesSpawned++;
        
        // Track boss
        if (enemyType === 'boss') {
            this.currentBoss = enemy;
            console.log(`👑 BOSS SPAWNED! Prepare for battle!`);
        }
        
        console.log(`Spawned ${enemyType} enemy (${this.enemiesSpawned}/${this.enemiesPerWave})`);
        this.updateWaveInfo();  // Update info when enemy spawns
    }
    
    // Update wave state
    updateWave(deltaTime) {
        if (!this.waveActive || this.state.gameOver) return;
        
        // Handle boss warning
        if (this.bossWarning) {
            this.bossWarningTime -= deltaTime;
            if (this.bossWarningTime <= 0) {
                this.bossWarning = false;
            }
            return; // Don't spawn during warning
        }
        
        // Spawn enemies
        if (this.enemiesSpawned < this.enemiesPerWave) {
            this.timeSinceLastSpawn += deltaTime;
            
            if (this.timeSinceLastSpawn >= CONFIG.WAVE_SPAWN_DELAY) {
                this.spawnEnemy();
                this.timeSinceLastSpawn = 0;
            }
        }
        
        // Check if wave is complete
        if (this.enemiesSpawned >= this.enemiesPerWave && this.enemies.length === 0) {
            this.completeWave();
        }
    }
    
    // Complete current wave
    completeWave() {
        this.waveActive = false;
        this.waveComplete = true;
        this.state.wave++;
        
        // Bonus gold for completing wave
        const bonusGold = 10 + this.state.wave * 5;
        this.addGold(bonusGold);
        
        // Bonus mana for completing wave
        this.addMana(CONFIG.MANA_PER_WAVE);
        
        this.updateUI();
        this.updateWaveInfo();
        this.checkAchievements();  // Check wave-based achievements
        this.autoSave();  // Auto-save after wave completion
        console.log(`Wave ${this.state.wave - 1} complete! +${bonusGold} gold, +${CONFIG.MANA_PER_WAVE} mana. Next wave: ${this.state.wave}`);
        
        // Show next wave button instead of auto-starting
        this.showNextWaveButton();
    }
    
    // ============================================
    // PARTICLE CREATION
    // ============================================
    
    // Create death explosion particles
    createDeathParticles(enemy) {
        const count = 15 + Math.floor(Math.random() * 10);
        const color = enemy.config.color;
        
        for (let i = 0; i < count; i++) {
            const particle = new Particle(enemy.x, enemy.y, 'death', {
                color: color,
                size: 3 + Math.random() * 4,
                speed: 80 + Math.random() * 120,
                lifetime: 0.4 + Math.random() * 0.4,
                gravity: 150
            });
            this.particles.push(particle);
        }
    }
    
    // Create gold reward particles
    createGoldParticles(enemy) {
        const count = Math.min(5, enemy.goldReward);
        
        for (let i = 0; i < count; i++) {
            const particle = new Particle(enemy.x, enemy.y, 'gold', {
                size: 2 + Math.random() * 2,
                speed: 60 + Math.random() * 80,
                angle: -Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 3,
                lifetime: 0.8 + Math.random() * 0.4,
                gravity: 300
            });
            this.particles.push(particle);
        }
    }
    
    // Create mana particles when enemy is killed
    createManaParticles(enemy) {
        const count = 4;
        
        for (let i = 0; i < count; i++) {
            const particle = new Particle(enemy.x, enemy.y, 'mana', {
                size: 3 + Math.random() * 2,
                speed: 70 + Math.random() * 90,
                angle: -Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 2,
                lifetime: 1.0 + Math.random() * 0.5,
                gravity: 250
            });
            this.particles.push(particle);
        }
    }
    
    // Create muzzle flash particles
    createMuzzleFlash(tower) {
        const colors = {
            'archer': '#FFA500',
            'mage': '#9370DB',
            'cannon': '#FF6B00',
            'lightning': '#FFD700'
        };
        
        const color = colors[tower.type] || '#FFF';
        const count = 3;
        
        for (let i = 0; i < count; i++) {
            const angle = tower.rotation + (Math.random() - 0.5) * 0.5;
            const particle = new Particle(tower.x, tower.y, 'muzzle', {
                color: color,
                size: 3 + Math.random() * 3,
                speed: 40 + Math.random() * 60,
                angle: angle,
                lifetime: 0.15 + Math.random() * 0.1,
                gravity: 0,
                friction: 0.9
            });
            this.particles.push(particle);
        }
    }
    
    // ============================================
    // EVENT HANDLERS
    // ============================================
    
    // Setup event listeners
    setupEventListeners() {
        // Mouse move
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.mouse.gridX = Math.floor(this.mouse.x / CONFIG.GRID_SIZE);
            this.mouse.gridY = Math.floor(this.mouse.y / CONFIG.GRID_SIZE);
        });
        
        // Mouse click
        this.canvas.addEventListener('click', (e) => {
            this.handleClick(e);
        });
        
        // Mouse down/up
        this.canvas.addEventListener('mousedown', () => {
            this.mouse.isDown = true;
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.mouse.isDown = false;
        });
        
        // Keyboard
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
        
        console.log('Event listeners setup complete');
    }
    
    // Setup tower selection buttons
    setupTowerButtons() {
        const towerButtons = document.querySelectorAll('.tower-btn');
        
        towerButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const towerType = btn.dataset.tower;
                const towerConfig = CONFIG.TOWER_TYPES[towerType];
                
                // Check if player can afford it
                if (this.state.gold >= towerConfig.cost) {
                    // Deselect all buttons
                    towerButtons.forEach(b => b.classList.remove('selected'));
                    
                    // Select this button
                    if (this.selectedTowerType === towerType) {
                        // Deselect if clicking the same tower
                        this.selectedTowerType = null;
                    } else {
                        btn.classList.add('selected');
                        this.selectedTowerType = towerType;
                        console.log('Selected tower type:', towerType);
                    }
                } else {
                    console.log('Not enough gold for', towerType);
                }
                
                this.updateTowerButtons();
            });
        });
        
        this.updateTowerButtons();
        console.log('Tower buttons setup complete');
    }
    
    // Update tower button states
    updateTowerButtons() {
        const towerButtons = document.querySelectorAll('.tower-btn');
        
        towerButtons.forEach(btn => {
            const towerType = btn.dataset.tower;
            const towerConfig = CONFIG.TOWER_TYPES[towerType];
            
            // Disable button if not enough gold
            if (this.state.gold < towerConfig.cost) {
                btn.classList.add('disabled');
            } else {
                btn.classList.remove('disabled');
            }
        });
    }
    
    // Setup upgrade button
    setupUpgradeButton() {
        const upgradeBtn = document.getElementById('upgrade-btn');
        if (!upgradeBtn) return;
        
        upgradeBtn.addEventListener('click', () => {
            if (!this.selectedTower) return;
            
            const cost = this.selectedTower.getUpgradeCost();
            
            // Check if can upgrade and afford
            if (this.selectedTower.canUpgrade() && this.state.gold >= cost) {
                // Deduct cost
                this.spendGold(cost);
                
                // Upgrade tower
                this.selectedTower.upgrade();
                
                // Check if tower reached max level for achievement
                if (this.selectedTower.level === CONFIG.UPGRADE.MAX_LEVEL) {
                    this.achievementStats.maxUpgrade = 1;
                }
                
                // Update UI
                this.updateUpgradeUI();
                this.updateTowerButtons();
                this.checkAchievements();  // Check upgrade-based achievements
                this.autoSave();  // Auto-save after tower upgrade
                
                console.log(`Upgraded ${this.selectedTower.type} to level ${this.selectedTower.level}`);
            }
        });
        
        console.log('Upgrade button setup complete');
    }
    
    // Setup sell button
    setupSellButton() {
        const sellBtn = document.getElementById('sell-btn');
        if (!sellBtn) return;
        
        sellBtn.addEventListener('click', () => {
            if (!this.selectedTower) return;
            
            // Get sell value
            const sellValue = this.selectedTower.getSellValue();
            
            // Add gold back to player
            this.addGold(sellValue);
            
            // Create gold particles at tower position
            for (let i = 0; i < 8; i++) {
                this.particles.push(new Particle(
                    this.selectedTower.x,
                    this.selectedTower.y,
                    'gold'
                ));
            }
            
            // Clear grid cell
            const gridX = this.selectedTower.gridX;
            const gridY = this.selectedTower.gridY;
            this.grid[gridY][gridX].hasTower = false;
            
            // Remove tower from array
            const towerIndex = this.towers.indexOf(this.selectedTower);
            if (towerIndex > -1) {
                this.towers.splice(towerIndex, 1);
            }
            
            console.log(`Sold tower for ${sellValue} gold`);
            
            // Clear selection
            this.selectedTower = null;
            this.hideUpgradeUI();
            this.updateTowerButtons();
            this.updateWaveInfo();  // Update tower count after selling
        });
        
        console.log('Sell button setup complete');
    }
    
    // Setup ability buttons
    setupAbilityButtons() {
        const abilityButtons = document.querySelectorAll('.ability-btn');
        
        abilityButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const abilityType = btn.dataset.ability;
                
                // Special case for meteor - requires targeting
                if (abilityType === 'meteor') {
                    this.startMeteorTargeting();
                } else {
                    this.activateAbility(abilityType);
                }
            });
        });
        
        console.log('Ability buttons setup complete');
    }
    
    // Setup speed control buttons
    setupSpeedButtons() {
        const speedButtons = document.querySelectorAll('.speed-btn');
        
        speedButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const speed = parseInt(btn.dataset.speed);
                
                // Update speed multiplier
                this.state.speedMultiplier = speed;
                
                // Update active button styling
                speedButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                console.log(`Game speed set to ${speed}x`);
            });
        });
        
        console.log('Speed buttons setup complete');
    }
    
    // Setup next wave button
    setupNextWaveButton() {
        const nextWaveBtn = document.getElementById('next-wave-btn');
        if (!nextWaveBtn) return;
        
        nextWaveBtn.addEventListener('click', () => {
            if (this.waveComplete && !this.waveActive && !this.state.gameOver) {
                this.hideNextWaveButton();
                this.startWave();
            }
        });
        
        console.log('Next wave button setup complete');
    }
    
    // Show next wave button
    showNextWaveButton() {
        const btn = document.getElementById('next-wave-btn');
        const waveInfo = document.getElementById('wave-info');
        if (btn && waveInfo) {
            // Check if it's a boss wave
            const isBossWave = this.state.wave % CONFIG.BOSS_WAVE_INTERVAL === 0;
            if (isBossWave) {
                waveInfo.textContent = `⚠️ BOSS WAVE ${this.state.wave}!`;
                btn.style.background = 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)';
                btn.style.borderColor = '#f87171';
            } else {
                waveInfo.textContent = `Wave ${this.state.wave}`;
                btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                btn.style.borderColor = '#34d399';
            }
            btn.style.display = 'flex';
        }
    }
    
    // Hide next wave button
    hideNextWaveButton() {
        const btn = document.getElementById('next-wave-btn');
        if (btn) {
            btn.style.display = 'none';
        }
    }
    
    // ============================================
    // SAVE/LOAD SYSTEM
    // ============================================
    
    // Setup save/load buttons
    setupSaveLoadButtons() {
        const saveBtn = document.getElementById('save-btn');
        const loadBtn = document.getElementById('load-btn');
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveGame();
            });
        }
        
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                this.loadGame();
            });
        }
        
        // Check if a saved game exists and enable/disable load button
        this.updateLoadButtonState();
        
        console.log('Save/Load buttons setup complete');
    }
    
    // Update load button state based on saved game existence
    updateLoadButtonState() {
        const loadBtn = document.getElementById('load-btn');
        if (loadBtn) {
            const hasSave = localStorage.getItem('castleDefendersSave') !== null;
            loadBtn.disabled = !hasSave;
            loadBtn.style.opacity = hasSave ? '1' : '0.5';
        }
    }
    
    // Save game state to localStorage
    saveGame() {
        try {
            // Create save data object
            const saveData = {
                version: '1.0',
                timestamp: new Date().toISOString(),
                state: {
                    gold: this.state.gold,
                    mana: this.state.mana,
                    lives: this.state.lives,
                    wave: this.state.wave,
                    score: this.state.score,
                    speedMultiplier: this.state.speedMultiplier,
                    totalKills: this.state.totalKills
                },
                achievements: { ...this.achievements },
                achievementStats: { ...this.achievementStats },
                towers: this.towers.map(tower => ({
                    type: tower.type,
                    x: tower.x,
                    y: tower.y,
                    gridX: tower.gridX,
                    gridY: tower.gridY,
                    level: tower.level
                })),
                waveState: {
                    waveActive: this.waveActive,
                    waveComplete: this.waveComplete,
                    enemiesSpawned: this.enemiesSpawned
                },
                abilities: {
                    freeze: { cooldownRemaining: this.abilities.freeze.cooldownRemaining },
                    meteor: { cooldownRemaining: this.abilities.meteor.cooldownRemaining },
                    goldRush: { cooldownRemaining: this.abilities.goldRush.cooldownRemaining },
                    timeWarp: { cooldownRemaining: this.abilities.timeWarp.cooldownRemaining }
                }
            };
            
            // Save to localStorage
            localStorage.setItem('castleDefendersSave', JSON.stringify(saveData));
            
            // Visual feedback
            const saveBtn = document.getElementById('save-btn');
            if (saveBtn) {
                saveBtn.classList.add('success');
                saveBtn.textContent = '✓ Saved!';
                setTimeout(() => {
                    saveBtn.classList.remove('success');
                    saveBtn.textContent = '💾 Save';
                }, 1500);
            }
            
            this.updateLoadButtonState();
            console.log('Game saved successfully!', saveData);
        } catch (error) {
            console.error('Failed to save game:', error);
            alert('Failed to save game. Please try again.');
        }
    }
    
    // Load game state from localStorage
    loadGame() {
        try {
            const savedData = localStorage.getItem('castleDefendersSave');
            
            if (!savedData) {
                alert('No saved game found!');
                return;
            }
            
            const saveData = JSON.parse(savedData);
            
            // Pause game during load
            const wasPaused = this.state.isPaused;
            this.state.isPaused = true;
            
            // Restore state
            this.state.gold = saveData.state.gold;
            this.state.mana = saveData.state.mana;
            this.state.lives = saveData.state.lives;
            this.state.wave = saveData.state.wave;
            this.state.score = saveData.state.score;
            this.state.speedMultiplier = saveData.state.speedMultiplier || 1;
            this.state.totalKills = saveData.state.totalKills || 0;
            this.state.gameStarted = true;
            this.state.gameOver = false;
            
            // Restore achievements
            if (saveData.achievements) {
                this.achievements = { ...saveData.achievements };
            }
            if (saveData.achievementStats) {
                this.achievementStats = { ...saveData.achievementStats };
            }
            
            // Clear existing game objects
            this.towers = [];
            this.enemies = [];
            this.projectiles = [];
            this.particles = [];
            this.selectedTower = null;
            
            // Restore towers
            if (saveData.towers) {
                saveData.towers.forEach(towerData => {
                    const tower = this.createTowerFromType(towerData.type, towerData.gridX, towerData.gridY);
                    if (tower) {
                        // Upgrade tower to saved level
                        for (let i = 1; i < towerData.level; i++) {
                            tower.upgrade();
                        }
                        this.towers.push(tower);
                        this.grid[towerData.gridY][towerData.gridX].hasTower = true;
                    }
                });
            }
            
            // Restore wave state
            if (saveData.waveState) {
                this.waveActive = saveData.waveState.waveActive || false;
                this.waveComplete = saveData.waveState.waveComplete || true;
                this.enemiesSpawned = saveData.waveState.enemiesSpawned || 0;
                
                if (this.waveComplete && !this.waveActive) {
                    this.showNextWaveButton();
                }
            }
            
            // Restore ability cooldowns
            if (saveData.abilities) {
                Object.keys(saveData.abilities).forEach(key => {
                    if (this.abilities[key]) {
                        this.abilities[key].cooldownRemaining = saveData.abilities[key].cooldownRemaining || 0;
                    }
                });
            }
            
            // Update UI
            this.updateUI();
            this.updateWaveInfo();
            this.updateSpeedButtons();
            
            // Visual feedback
            const loadBtn = document.getElementById('load-btn');
            if (loadBtn) {
                loadBtn.classList.add('success');
                const originalText = loadBtn.textContent;
                loadBtn.textContent = '✓ Loaded!';
                setTimeout(() => {
                    loadBtn.classList.remove('success');
                    loadBtn.textContent = originalText;
                }, 1500);
            }
            
            // Restore pause state
            this.state.isPaused = wasPaused;
            
            console.log('Game loaded successfully!', saveData);
        } catch (error) {
            console.error('Failed to load game:', error);
            alert('Failed to load game. Save file may be corrupted.');
        }
    }
    
    // Create a tower from type (helper for loading)
    createTowerFromType(type, gridX, gridY) {
        const x = gridX * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2;
        const y = gridY * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2;
        
        switch(type) {
            case 'archer':
                return new ArcherTower(x, y, gridX, gridY);
            case 'mage':
                return new MageTower(x, y, gridX, gridY);
            case 'cannon':
                return new CannonTower(x, y, gridX, gridY);
            case 'lightning':
                return new LightningTower(x, y, gridX, gridY);
            default:
                console.error('Unknown tower type:', type);
                return null;
        }
    }
    
    // Update speed buttons visual state
    updateSpeedButtons() {
        const speedButtons = document.querySelectorAll('.speed-btn');
        speedButtons.forEach(btn => {
            const speed = parseInt(btn.dataset.speed);
            if (speed === this.state.speedMultiplier) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Auto-save functionality
    autoSave() {
        if (this.state.gameStarted && !this.state.gameOver) {
            this.saveGame();
        }
    }
    
    // ============================================
    // ACHIEVEMENT SYSTEM
    // ============================================
    
    // Check and unlock achievements
    checkAchievements() {
        Object.keys(CONFIG.ACHIEVEMENTS).forEach(key => {
            const achievement = CONFIG.ACHIEVEMENTS[key];
            
            // Skip if already unlocked
            if (this.achievements[key]) return;
            
            // Check requirement
            let unlocked = false;
            const req = achievement.requirement;
            
            switch(req.type) {
                case 'kills':
                    unlocked = this.state.totalKills >= req.value;
                    break;
                case 'wave':
                    unlocked = this.state.wave >= req.value;
                    break;
                case 'bossKills':
                    unlocked = this.achievementStats.bossKills >= req.value;
                    break;
                case 'gold':
                    unlocked = this.state.gold >= req.value;
                    break;
                case 'towersPlaced':
                    unlocked = this.achievementStats.towersPlaced >= req.value;
                    break;
                case 'maxUpgrade':
                    unlocked = this.achievementStats.maxUpgrade >= req.value;
                    break;
            }
            
            if (unlocked) {
                this.unlockAchievement(key, achievement);
            }
        });
    }
    
    // Unlock an achievement
    unlockAchievement(achievementId, achievement) {
        this.achievements[achievementId] = true;
        
        // Add to notification queue
        this.achievementNotifications.push({
            achievement: achievement,
            time: Date.now(),
            duration: 4000  // Show for 4 seconds
        });
        
        console.log(`🏆 ACHIEVEMENT UNLOCKED: ${achievement.name}`);
    }
    
    // Start meteor targeting mode
    startMeteorTargeting() {
        const ability = this.abilities.meteor;
        const config = CONFIG.ABILITIES.meteor;
        
        // Check cooldown and mana
        if (ability.cooldownRemaining > 0 || this.state.mana < config.manaCost) {
            console.log('Meteor not ready!');
            return;
        }
        
        this.meteorTargeting = true;
        console.log('Click on the map to target meteor strike!');
    }
    
    // Activate an ability
    activateAbility(abilityType) {
        if (!this.state.gameStarted || this.state.gameOver) return;
        
        const ability = this.abilities[abilityType];
        const config = CONFIG.ABILITIES[abilityType];
        
        // Check if ability is on cooldown
        if (ability.cooldownRemaining > 0) {
            console.log(`${config.name} is on cooldown: ${(ability.cooldownRemaining / 1000).toFixed(1)}s`);
            return;
        }
        
        // Check mana cost
        if (this.state.mana < config.manaCost) {
            console.log(`Not enough mana for ${config.name}!`);
            return;
        }
        
        // Spend mana
        this.spendMana(config.manaCost);
        
        // Set cooldown
        ability.cooldownRemaining = config.cooldown;
        
        // Activate ability
        ability.isActive = true;
        if (config.duration) {
            ability.timeRemaining = config.duration;
        }
        
        console.log(`Activated ${config.name}!`);
        this.updateAbilityButtons();
    }
    
    // Cast meteor strike at target location
    castMeteor(x, y) {
        const config = CONFIG.ABILITIES.meteor;
        
        // Create meteor particles falling from sky
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * config.radius;
            const px = x + Math.cos(angle) * distance;
            const py = y + Math.sin(angle) * distance;
            
            this.particles.push(new Particle(
                px,
                py - 100,  // Start above
                Math.random() * 40 - 20,  // vx
                Math.random() * 200 + 100,  // vy (downward)
                config.color,
                'meteor'
            ));
        }
        
        // Damage enemies in radius
        this.enemies.forEach(enemy => {
            if (!enemy.isAlive) return;
            
            const dx = enemy.x - x;
            const dy = enemy.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance <= config.radius) {
                enemy.takeDamage(config.damage);
                
                // Create impact particles
                for (let i = 0; i < 10; i++) {
                    const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * Math.PI;
                    this.particles.push(new Particle(
                        enemy.x,
                        enemy.y,
                        Math.cos(angle) * (Math.random() * 100 + 50),
                        Math.sin(angle) * (Math.random() * 100 + 50),
                        '#FF4500',
                        'hit'
                    ));
                }
            }
        });
        
        console.log(`Meteor strike at (${x}, ${y})!`);
    }
    
    // Update abilities (cooldowns and durations)
    updateAbilities(deltaTime) {
        Object.keys(this.abilities).forEach(key => {
            const ability = this.abilities[key];
            
            // Update cooldown
            if (ability.cooldownRemaining > 0) {
                ability.cooldownRemaining -= deltaTime;
                if (ability.cooldownRemaining < 0) ability.cooldownRemaining = 0;
            }
            
            // Update active duration
            if (ability.isActive && ability.timeRemaining !== undefined) {
                ability.timeRemaining -= deltaTime;
                if (ability.timeRemaining <= 0) {
                    ability.isActive = false;
                    ability.timeRemaining = 0;
                    console.log(`${key} ability ended`);
                }
            }
        });
        
        this.updateAbilityButtons();
    }
    
    // Update ability button states
    updateAbilityButtons() {
        const abilityButtons = document.querySelectorAll('.ability-btn');
        
        abilityButtons.forEach(btn => {
            const abilityType = btn.dataset.ability;
            const ability = this.abilities[abilityType];
            const config = CONFIG.ABILITIES[abilityType];
            
            // Update cooldown display
            const cooldownEl = btn.querySelector('.ability-cooldown');
            if (ability.cooldownRemaining > 0) {
                btn.classList.add('disabled');
                cooldownEl.textContent = `${(ability.cooldownRemaining / 1000).toFixed(1)}s`;
            } else {
                cooldownEl.textContent = '';
                
                // Check mana
                if (this.state.mana < config.manaCost) {
                    btn.classList.add('disabled');
                } else {
                    btn.classList.remove('disabled');
                }
            }
            
            // Highlight active abilities
            if (ability.isActive) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Handle mouse clicks
    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        console.log(`Click at: (${x}, ${y}) - Grid: (${this.mouse.gridX}, ${this.mouse.gridY})`);
        
        // Meteor targeting mode
        if (this.meteorTargeting) {
            this.castMeteor(x, y);
            this.activateAbility('meteor');
            this.meteorTargeting = false;
            return;
        }
        
        // Check if clicked on existing tower
        let clickedTower = null;
        for (const tower of this.towers) {
            if (tower.gridX === this.mouse.gridX && tower.gridY === this.mouse.gridY) {
                clickedTower = tower;
                break;
            }
        }
        
        // If clicked on a tower, select it
        if (clickedTower) {
            // Deselect all towers
            this.towers.forEach(t => t.isSelected = false);
            
            // Select clicked tower
            clickedTower.isSelected = true;
            this.selectedTower = clickedTower;
            
            // Clear tower type selection
            this.selectedTowerType = null;
            document.querySelectorAll('.tower-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            this.updateUpgradeUI();
            console.log('Selected tower:', clickedTower.type, 'Level:', clickedTower.level);
        }
        // Tower placement
        else if (this.selectedTowerType && this.state.gameStarted && !this.state.gameOver) {
            this.placeTower(this.mouse.gridX, this.mouse.gridY, this.selectedTowerType);
        }
        // Deselect tower if clicking empty space
        else {
            this.towers.forEach(t => t.isSelected = false);
            this.selectedTower = null;
            this.updateUpgradeUI();
        }
    }
    
    // Place a tower
    placeTower(gridX, gridY, type) {
        const towerConfig = CONFIG.TOWER_TYPES[type];
        
        // Validate placement
        if (!this.isCellBuildable(gridX, gridY)) {
            console.log('Cannot build here!');
            return false;
        }
        
        // Check if can afford
        if (this.state.gold < towerConfig.cost) {
            console.log('Not enough gold!');
            return false;
        }
        
        // Create tower
        const tower = new Tower(gridX, gridY, type);
        this.towers.push(tower);
        
        // Update grid
        const cell = this.getCell(gridX, gridY);
        if (cell) {
            cell.hasTower = true;
        }
        
        // Deduct cost
        this.spendGold(towerConfig.cost);
        this.achievementStats.towersPlaced++;  // Track for achievements
        this.updateWaveInfo();  // Update tower count
        this.checkAchievements();  // Check tower-based achievements
        this.autoSave();  // Auto-save after tower placement
        
        // Deselect tower type
        this.selectedTowerType = null;
        document.querySelectorAll('.tower-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        console.log(`Placed ${type} tower at (${gridX}, ${gridY})`);
        this.updateTowerButtons();
        
        return true;
    }
    
    // Handle keyboard input
    handleKeyPress(e) {
        switch(e.key.toLowerCase()) {
            case 'p':
                this.togglePause();
                break;
            case 's':
                if (!this.state.gameStarted) {
                    this.startGame();
                }
                break;
            case 'r':
                if (this.state.gameOver) {
                    this.resetGame();
                }
                break;
        }
    }
    
    // Toggle pause
    togglePause() {
        if (!this.state.gameOver && this.state.gameStarted) {
            this.state.isPaused = !this.state.isPaused;
            console.log('Game paused:', this.state.isPaused);
        }
    }
    
    // Start the game
    startGame() {
        this.state.gameStarted = true;
        this.waveComplete = true;  // Mark as complete so button can be clicked
        console.log('Game started!');
        
        // Show next wave button to let player start wave 1 when ready
        this.showNextWaveButton();
    }
    
    // Reset game
    resetGame() {
        this.state = {
            gold: CONFIG.STARTING_GOLD,
            mana: CONFIG.STARTING_MANA,
            lives: CONFIG.STARTING_LIVES,
            wave: CONFIG.STARTING_WAVE,
            score: 0,
            isPaused: false,
            gameOver: false,
            gameStarted: false,
            speedMultiplier: 1,
            totalKills: 0
        };
        
        this.towers = [];
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.frameCount = 0;
        
        // Reset wave
        this.waveActive = false;
        this.waveComplete = false;
        this.timeSinceLastSpawn = 0;
        this.enemiesSpawned = 0;
        
        // Reset tower selection
        this.selectedTowerType = null;
        document.querySelectorAll('.tower-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Reset achievement stats (but keep unlocked achievements)
        this.achievementStats = {
            bossKills: 0,
            towersPlaced: 0,
            maxUpgrade: 0
        };
        this.achievementNotifications = [];  // Clear notification queue
        
        this.updateUI();
        this.updateWaveInfo();
        this.updateTowerButtons();
        console.log('Game reset!');
    }
    
    // ============================================
    // GAME LOOP
    // ============================================
    
    // Main game loop
    gameLoop(currentTime) {
        // Calculate delta time
        if (this.lastFrameTime === 0) {
            this.lastFrameTime = currentTime;
        }
        this.deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        
        // Update game state
        if (this.state.gameStarted && !this.state.isPaused && !this.state.gameOver) {
            this.update(this.deltaTime);
        }
        
        // Render everything
        this.render();
        
        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    // Update game logic
    update(deltaTime) {
        this.frameCount++;
        
        // Apply speed multiplier
        const adjustedDeltaTime = deltaTime * this.state.speedMultiplier;
        
        // Update abilities
        this.updateAbilities(adjustedDeltaTime);
        
        // Passive mana regeneration
        if (this.state.gameStarted && !this.state.gameOver && !this.state.isPaused) {
            const manaToAdd = (CONFIG.MANA_REGEN_PER_SECOND * adjustedDeltaTime) / 1000;
            this.addMana(manaToAdd);
        }
        
        // Update wave spawning
        this.updateWave(adjustedDeltaTime);
        
        // Update towers and let them shoot
        this.towers.forEach(tower => {
            // Apply time warp effect
            const fireRateMultiplier = this.abilities.timeWarp.isActive ? CONFIG.ABILITIES.timeWarp.speedBoost : 1;
            const modifiedDeltaTime = adjustedDeltaTime * fireRateMultiplier;
            
            tower.update(modifiedDeltaTime, this.enemies);
            
            // Try to shoot
            const projectile = tower.tryShoot(this);
            if (projectile) {
                this.projectiles.push(projectile);
                // Create muzzle flash
                this.createMuzzleFlash(tower);
            }
        });
        
        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.update(adjustedDeltaTime);
            
            // Remove dead projectiles
            if (!projectile.isAlive) {
                this.projectiles.splice(i, 1);
            }
        }
        
        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Apply freeze effect
            let enemyDeltaTime = adjustedDeltaTime;
            if (this.abilities.freeze.isActive && !enemy.originalSpeed) {
                enemy.originalSpeed = enemy.speed;
                enemy.speed = enemy.originalSpeed * CONFIG.ABILITIES.freeze.effect;
            } else if (!this.abilities.freeze.isActive && enemy.originalSpeed) {
                enemy.speed = enemy.originalSpeed;
                delete enemy.originalSpeed;
            }
            
            enemy.update(adjustedDeltaTime);
            
            // Check if enemy reached the end
            if (enemy.reachedEnd) {
                this.loseLife(enemy.damage);
                this.enemies.splice(i, 1);
                this.updateWaveInfo();  // Update when enemy escapes
                console.log(`Enemy reached castle! Lives: ${this.state.lives}`);
            }
            // Remove dead enemies
            else if (!enemy.isAlive) {
                // Check if this was the boss
                const wasBoss = enemy.config.isBoss;
                
                // Create death particles
                this.createDeathParticles(enemy);
                
                // Create gold particles
                this.createGoldParticles(enemy);
                
                // Apply gold rush multiplier
                const goldMultiplier = this.abilities.goldRush.isActive ? CONFIG.ABILITIES.goldRush.multiplier : 1;
                let goldReward = Math.floor(enemy.goldReward * goldMultiplier);
                
                // Boss defeated - extra rewards
                if (wasBoss) {
                    goldReward += 50; // Extra boss bonus
                    this.addMana(20); // Extra mana for boss kill
                    this.currentBoss = null;
                    this.achievementStats.bossKills++;  // Track boss kills for achievements
                    console.log(`👑 BOSS DEFEATED! Bonus rewards granted!`);
                }
                
                this.addGold(goldReward);
                this.addMana(CONFIG.MANA_PER_KILL);
                this.createManaParticles(enemy);
                this.state.score += goldReward * 10;
                this.state.totalKills++;  // Increment kill counter
                this.enemies.splice(i, 1);
                this.updateWaveInfo();  // Update wave info display
                this.checkAchievements();  // Check for achievements after kill
            }
        }
        
        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update(adjustedDeltaTime);
            
            if (!particle.isAlive) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    // Render everything
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.drawBackground();
        
        // Draw path
        this.drawPath();
        
        // Draw spawn and castle
        this.drawSpawn();
        this.drawCastle();
        
        // Draw grid
        this.drawGrid();
        
        if (!this.state.gameStarted) {
            // Draw welcome screen
            this.drawWelcomeScreen();
        } else if (this.state.gameOver) {
            // Draw game over screen
            this.drawGameOverScreen();
        } else {
            // Draw game objects
            this.drawGameObjects();
            
            // Draw achievement notifications
            this.drawAchievementNotifications();
            
            // Draw pause overlay if paused
            if (this.state.isPaused) {
                this.drawPauseOverlay();
            }
        }
        
        // Draw FPS counter (debug)
        this.drawDebugInfo();
    }
    
    // ============================================
    // RENDERING FUNCTIONS
    // ============================================
    
    // Draw background
    drawBackground() {
        // Full grass background
        const grassGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        grassGradient.addColorStop(0, CONFIG.COLORS.GROUND);
        grassGradient.addColorStop(1, CONFIG.COLORS.GRASS);
        this.ctx.fillStyle = grassGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    // Draw path
    drawPath() {
        // Draw path cells
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                const cell = this.grid[y][x];
                if (cell.isPath) {
                    // Path tile
                    this.ctx.fillStyle = CONFIG.COLORS.PATH;
                    this.ctx.fillRect(
                        x * CONFIG.GRID_SIZE,
                        y * CONFIG.GRID_SIZE,
                        CONFIG.GRID_SIZE,
                        CONFIG.GRID_SIZE
                    );
                    
                    // Path border
                    this.ctx.strokeStyle = CONFIG.COLORS.PATH_BORDER;
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(
                        x * CONFIG.GRID_SIZE,
                        y * CONFIG.GRID_SIZE,
                        CONFIG.GRID_SIZE,
                        CONFIG.GRID_SIZE
                    );
                }
            }
        }
        
        // Draw waypoint markers (small dots)
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        CONFIG.PATH_WAYPOINTS.forEach((waypoint, index) => {
            if (index > 0 && index < CONFIG.PATH_WAYPOINTS.length - 1) {
                this.ctx.beginPath();
                this.ctx.arc(
                    waypoint.x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2,
                    waypoint.y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2,
                    4,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
            }
        });
    }
    
    // Draw spawn point
    drawSpawn() {
        const x = this.spawnPoint.x * CONFIG.GRID_SIZE;
        const y = this.spawnPoint.y * CONFIG.GRID_SIZE;
        
        // Spawn portal effect
        this.ctx.fillStyle = CONFIG.COLORS.SPAWN;
        this.ctx.globalAlpha = 0.3 + Math.sin(this.frameCount * 0.1) * 0.2;
        this.ctx.fillRect(x, y, CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
        this.ctx.globalAlpha = 1;
        
        // Spawn icon
        this.ctx.fillStyle = '#FF0000';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('⚔️', x + CONFIG.GRID_SIZE / 2, y + CONFIG.GRID_SIZE / 2);
    }
    
    // Draw castle
    drawCastle() {
        const x = this.castlePoint.x * CONFIG.GRID_SIZE;
        const y = this.castlePoint.y * CONFIG.GRID_SIZE;
        const size = CONFIG.GRID_SIZE;
        
        // Castle base
        this.ctx.fillStyle = CONFIG.COLORS.CASTLE;
        this.ctx.fillRect(x + 5, y + 10, size - 10, size - 10);
        
        // Castle tower
        this.ctx.fillRect(x + size / 2 - 8, y + 5, 16, size - 5);
        
        // Castle flag
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.moveTo(x + size / 2 + 5, y + 8);
        this.ctx.lineTo(x + size / 2 + 15, y + 12);
        this.ctx.lineTo(x + size / 2 + 5, y + 16);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Flag pole
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x + size / 2 + 5, y + 5);
        this.ctx.lineTo(x + size / 2 + 5, y + 20);
        this.ctx.stroke();
        
        // Castle label
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🏰', x + size / 2, y + size - 5);
    }
    
    // Draw grid
    drawGrid() {
        this.ctx.strokeStyle = CONFIG.COLORS.GRID_LINE;
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x <= this.canvas.width; x += CONFIG.GRID_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= this.canvas.height; y += CONFIG.GRID_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        // Highlight hovered cell
        if (this.state.gameStarted && !this.state.gameOver) {
            const cell = this.getCell(this.mouse.gridX, this.mouse.gridY);
            if (cell) {
                // Color based on buildability
                if (cell.isBuildable && !cell.hasTower) {
                    this.ctx.fillStyle = CONFIG.COLORS.BUILD_ZONE;
                } else {
                    this.ctx.fillStyle = CONFIG.COLORS.NO_BUILD_ZONE;
                }
                
                this.ctx.fillRect(
                    this.mouse.gridX * CONFIG.GRID_SIZE,
                    this.mouse.gridY * CONFIG.GRID_SIZE,
                    CONFIG.GRID_SIZE,
                    CONFIG.GRID_SIZE
                );
                
                // Draw border
                this.ctx.strokeStyle = cell.isBuildable ? '#4ade80' : '#ff6b6b';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(
                    this.mouse.gridX * CONFIG.GRID_SIZE,
                    this.mouse.gridY * CONFIG.GRID_SIZE,
                    CONFIG.GRID_SIZE,
                    CONFIG.GRID_SIZE
                );
            }
        }
    }
    
    // Draw game objects
    drawGameObjects() {
        // Draw enemies
        this.enemies.forEach(enemy => {
            enemy.draw(this.ctx);
        });
        
        // Draw projectiles
        this.projectiles.forEach(projectile => {
            projectile.draw(this.ctx);
        });
        
        // Draw particles
        this.particles.forEach(particle => {
            particle.draw(this.ctx);
        });
        
        // Draw towers
        this.towers.forEach(tower => {
            tower.draw(this.ctx);
        });
        
        // Draw ghost tower preview
        if (this.selectedTowerType && this.state.gameStarted && !this.state.gameOver) {
            this.drawGhostTower();
        }
        
        // Draw wave info
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        
        let statusText = `Wave ${this.state.wave} - Towers: ${this.towers.length} - Enemies: ${this.enemies.length}`;
        if (this.waveActive && this.enemiesSpawned < this.enemiesPerWave) {
            statusText += ` (Spawning: ${this.enemiesSpawned}/${this.enemiesPerWave})`;
        } else if (!this.waveActive && this.waveComplete) {
            statusText += ' (Next wave incoming...)';
        }
        
        this.ctx.fillText(statusText, this.canvas.width / 2, 30);
        
        // Draw boss warning
        if (this.bossWarning) {
            this.drawBossWarning();
        }
        
        // Draw boss health bar
        if (this.currentBoss && this.currentBoss.isAlive) {
            this.drawBossHealthBar();
        }
        
        // Draw ability visual effects
        this.drawAbilityEffects();
    }
    
    // Draw boss warning
    drawBossWarning() {
        this.ctx.save();
        
        // Flashing red background
        const flashAlpha = 0.3 + Math.sin(Date.now() / 100) * 0.15;
        this.ctx.fillStyle = `rgba(255, 0, 0, ${flashAlpha})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Warning text
        this.ctx.fillStyle = '#FF0000';
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 4;
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const warningText = '⚠️ BOSS INCOMING! ⚠️';
        this.ctx.strokeText(warningText, this.canvas.width / 2, this.canvas.height / 2 - 50);
        this.ctx.fillText(warningText, this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        // Countdown
        this.ctx.font = 'bold 32px Arial';
        this.ctx.fillStyle = '#FFD700';
        const countdown = Math.ceil(this.bossWarningTime / 1000);
        this.ctx.strokeText(`${countdown}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        this.ctx.fillText(`${countdown}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        
        this.ctx.restore();
    }
    
    // Draw boss health bar
    drawBossHealthBar() {
        const boss = this.currentBoss;
        const barWidth = 400;
        const barHeight = 30;
        const x = (this.canvas.width - barWidth) / 2;
        const y = 60;
        
        this.ctx.save();
        
        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(x - 5, y - 5, barWidth + 10, barHeight + 10);
        
        // Border
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(x - 5, y - 5, barWidth + 10, barHeight + 10);
        
        // Red background
        this.ctx.fillStyle = '#8B0000';
        this.ctx.fillRect(x, y, barWidth, barHeight);
        
        // Health bar
        const healthPercent = Math.max(0, boss.health / boss.maxHealth);
        const gradient = this.ctx.createLinearGradient(x, y, x + barWidth * healthPercent, y);
        gradient.addColorStop(0, '#FF0066');
        gradient.addColorStop(1, '#FF6699');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x, y, barWidth * healthPercent, barHeight);
        
        // Boss name and health text
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 3;
        const bossText = `👑 BOSS - ${Math.floor(boss.health)} / ${boss.maxHealth}`;
        this.ctx.strokeText(bossText, this.canvas.width / 2, y + barHeight / 2);
        this.ctx.fillText(bossText, this.canvas.width / 2, y + barHeight / 2);
        
        this.ctx.restore();
    }
    
    // Draw ability visual effects
    drawAbilityEffects() {
        // Freeze effect overlay
        if (this.abilities.freeze.isActive) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.3;
            this.ctx.fillStyle = '#00BFFF';
            
            this.enemies.forEach(enemy => {
                if (enemy.isAlive) {
                    this.ctx.beginPath();
                    this.ctx.arc(enemy.x, enemy.y, enemy.config.size + 5, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            });
            
            this.ctx.restore();
            
            // Ice crystals effect
            const iceTime = Date.now() / 200;
            for (let i = 0; i < 50; i++) {
                const x = (i * 73 + iceTime * 20) % this.canvas.width;
                const y = (i * 97 + iceTime * 15) % this.canvas.height;
                this.ctx.fillStyle = 'rgba(200, 230, 255, 0.6)';
                this.ctx.fillText('❄️', x, y);
            }
        }
        
        // Time warp effect (glow on towers)
        if (this.abilities.timeWarp.isActive) {
            this.ctx.save();
            this.towers.forEach(tower => {
                this.ctx.shadowBlur = 20;
                this.ctx.shadowColor = '#9370DB';
                this.ctx.strokeStyle = 'rgba(147, 112, 219, 0.7)';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(tower.x, tower.y, CONFIG.GRID_SIZE * 0.5, 0, Math.PI * 2);
                this.ctx.stroke();
            });
            this.ctx.restore();
        }
        
        // Gold rush effect (sparkles)
        if (this.abilities.goldRush.isActive) {
            const goldTime = Date.now() / 100;
            for (let i = 0; i < 30; i++) {
                const x = (i * 59 + goldTime * 30) % this.canvas.width;
                const y = (i * 83 + goldTime * 25) % this.canvas.height;
                this.ctx.globalAlpha = 0.5 + Math.sin(goldTime + i) * 0.3;
                this.ctx.fillText('✨', x, y);
            }
            this.ctx.globalAlpha = 1;
        }
        
        // Meteor targeting cursor
        if (this.meteorTargeting) {
            const config = CONFIG.ABILITIES.meteor;
            
            // Target area circle
            this.ctx.strokeStyle = 'rgba(255, 69, 0, 0.8)';
            this.ctx.lineWidth = 3;
            this.ctx.setLineDash([10, 5]);
            this.ctx.beginPath();
            this.ctx.arc(this.mouse.x, this.mouse.y, config.radius, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            
            // Crosshair
            this.ctx.strokeStyle = '#FF4500';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(this.mouse.x - 20, this.mouse.y);
            this.ctx.lineTo(this.mouse.x + 20, this.mouse.y);
            this.ctx.moveTo(this.mouse.x, this.mouse.y - 20);
            this.ctx.lineTo(this.mouse.x, this.mouse.y + 20);
            this.ctx.stroke();
            
            // Hint text
            this.ctx.fillStyle = '#FF4500';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Click to target meteor strike!', this.canvas.width / 2, this.canvas.height - 20);
        }
    }
    
    // Draw ghost tower preview
    drawGhostTower() {
        const config = CONFIG.TOWER_TYPES[this.selectedTowerType];
        const canPlace = this.isCellBuildable(this.mouse.gridX, this.mouse.gridY);
        const x = this.mouse.gridX * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2;
        const y = this.mouse.gridY * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2;
        const size = CONFIG.GRID_SIZE;
        
        // Range preview
        this.ctx.fillStyle = canPlace ? 'rgba(100, 200, 100, 0.1)' : 'rgba(200, 100, 100, 0.1)';
        this.ctx.beginPath();
        this.ctx.arc(x, y, config.range, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.strokeStyle = canPlace ? 'rgba(100, 200, 100, 0.5)' : 'rgba(200, 100, 100, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Ghost tower
        this.ctx.globalAlpha = 0.6;
        this.ctx.fillStyle = config.color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size * 0.35, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.strokeStyle = canPlace ? '#4ade80' : '#ff6b6b';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Icon
        this.ctx.globalAlpha = 1;
        this.ctx.font = `${size * 0.5}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#fff';
        this.ctx.fillText(config.icon, x, y);
        
        // Cost indicator
        this.ctx.font = 'bold 12px Arial';
        this.ctx.fillStyle = canPlace ? '#4ade80' : '#ff6b6b';
        this.ctx.fillText(`💰${config.cost}`, x, y + size * 0.5);
    }
    
    // Draw pause overlay
    drawPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('⏸ PAUSED', this.canvas.width / 2, this.canvas.height / 2 - 20);
        
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = '#a0aec0';
        this.ctx.fillText('Press P to Resume', this.canvas.width / 2, this.canvas.height / 2 + 30);
    }
    
    // Draw game over screen
    drawGameOverScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 60);
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Wave Reached: ${this.state.wave}`, this.canvas.width / 2, this.canvas.height / 2 - 10);
        this.ctx.fillText(`Score: ${this.state.score}`, this.canvas.width / 2, this.canvas.height / 2 + 25);
        
        this.ctx.fillStyle = '#4ade80';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillText('Press R to Restart', this.canvas.width / 2, this.canvas.height / 2 + 70);
    }
    
    // Draw debug info
    drawDebugInfo() {
        const fps = this.deltaTime > 0 ? Math.round(1000 / this.deltaTime) : 0;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(5, this.canvas.height - 75, 140, 70);
        
        this.ctx.fillStyle = '#4ade80';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`FPS: ${fps}`, 10, this.canvas.height - 55);
        this.ctx.fillText(`Frame: ${this.frameCount}`, 10, this.canvas.height - 40);
        this.ctx.fillText(`Mouse: ${this.mouse.gridX},${this.mouse.gridY}`, 10, this.canvas.height - 25);
        
        const cell = this.getCell(this.mouse.gridX, this.mouse.gridY);
        const buildable = cell ? (cell.isBuildable ? 'Yes' : 'No') : 'N/A';
        this.ctx.fillText(`Build: ${buildable}`, 10, this.canvas.height - 10);
    }
    
    // Draw achievement notifications
    drawAchievementNotifications() {
        const currentTime = Date.now();
        
        // Remove expired notifications
        this.achievementNotifications = this.achievementNotifications.filter(notif => {
            return (currentTime - notif.time) < notif.duration;
        });
        
        // Draw active notifications
        this.achievementNotifications.forEach((notif, index) => {
            const achievement = notif.achievement;
            const elapsed = currentTime - notif.time;
            const progress = elapsed / notif.duration;
            
            // Slide in/out animation
            let yOffset = 0;
            if (progress < 0.1) {
                // Slide in from right
                yOffset = (1 - progress / 0.1) * 100;
            } else if (progress > 0.9) {
                // Slide out to right
                yOffset = ((progress - 0.9) / 0.1) * 100;
            }
            
            const x = this.canvas.width - 320 + yOffset;
            const y = 100 + index * 90;
            const width = 300;
            const height = 70;
            
            // Background
            this.ctx.fillStyle = 'rgba(34, 197, 94, 0.95)';
            this.ctx.fillRect(x, y, width, height);
            
            // Border
            this.ctx.strokeStyle = '#FFD700';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(x, y, width, height);
            
            // Achievement unlocked text
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText('🏆 ACHIEVEMENT UNLOCKED!', x + 10, y + 20);
            
            // Achievement icon and name
            this.ctx.font = '24px Arial';
            this.ctx.fillText(achievement.icon, x + 10, y + 50);
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.fillText(achievement.name, x + 45, y + 50);
            
            // Description
            this.ctx.font = '11px Arial';
            this.ctx.fillStyle = '#e2e8f0';
            this.ctx.fillText(achievement.description, x + 10, y + 65);
        });
    }
    
    // Draw welcome screen
    drawWelcomeScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🏰 Castle Defenders', this.canvas.width / 2, this.canvas.height / 2 - 60);
        
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillText('Tower Defense RPG', this.canvas.width / 2, this.canvas.height / 2 - 20);
        
        this.ctx.font = 'bold 18px Arial';
        this.ctx.fillStyle = '#4ade80';
        this.ctx.fillText('Press S to Start!', this.canvas.width / 2, this.canvas.height / 2 + 30);
        
        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = '#a0aec0';
        this.ctx.fillText('Commit 18: Save/Load System Active ✓', this.canvas.width / 2, this.canvas.height / 2 + 70);
        this.ctx.fillText('Your progress is auto-saved! Use Save/Load buttons in top-right corner.', this.canvas.width / 2, this.canvas.height / 2 + 90);
        this.ctx.fillText('P: Pause | R: Restart', this.canvas.width / 2, this.canvas.height / 2 + 110);
    }
    
    // ============================================
    // RESOURCE MANAGEMENT
    // ============================================
    
    // Update UI elements
    updateUI() {
        document.getElementById('gold').textContent = this.state.gold;
        document.getElementById('mana').textContent = `${Math.floor(this.state.mana)}/${CONFIG.MAX_MANA}`;
        document.getElementById('lives').textContent = this.state.lives;
        document.getElementById('wave').textContent = this.state.wave;
    }
    
    // Update wave info panel
    updateWaveInfo() {
        // Enemies remaining (alive enemies)
        const enemiesRemaining = this.enemies.length;
        document.getElementById('enemies-remaining').textContent = enemiesRemaining;
        
        // Enemies spawned this wave
        document.getElementById('enemies-spawned').textContent = `${this.enemiesSpawned}/${this.enemiesPerWave}`;
        
        // Towers placed
        document.getElementById('towers-placed').textContent = this.towers.length;
        
        // Total kills
        document.getElementById('total-kills').textContent = this.state.totalKills;
    }
    
    // Update upgrade UI panel
    updateUpgradeUI() {
        const upgradePanel = document.getElementById('upgrade-panel');
        
        if (!this.selectedTower || !upgradePanel) {
            if (upgradePanel) upgradePanel.style.display = 'none';
            return;
        }
        
        // Show upgrade panel
        upgradePanel.style.display = 'block';
        
        // Update tower info
        const tower = this.selectedTower;
        document.getElementById('tower-name').textContent = `${tower.config.icon} ${tower.type.toUpperCase()}`;
        document.getElementById('tower-level').textContent = `Level ${tower.level}`;
        document.getElementById('tower-damage').textContent = `💥 Damage: ${Math.floor(tower.damage)}`;
        document.getElementById('tower-range').textContent = `🎯 Range: ${Math.floor(tower.range)}`;
        document.getElementById('tower-fire-rate').textContent = `⚡ Fire Rate: ${tower.fireRate.toFixed(1)}/s`;
        
        // Update upgrade button
        const upgradeBtn = document.getElementById('upgrade-btn');
        const upgradeCost = document.getElementById('upgrade-cost');
        
        if (tower.canUpgrade()) {
            const cost = tower.getUpgradeCost();
            upgradeCost.textContent = `💰 ${cost}`;
            
            if (this.state.gold >= cost) {
                upgradeBtn.classList.remove('disabled');
                upgradeBtn.disabled = false;
            } else {
                upgradeBtn.classList.add('disabled');
                upgradeBtn.disabled = true;
            }
        } else {
            upgradeCost.textContent = 'MAX LEVEL';
            upgradeBtn.classList.add('disabled');
            upgradeBtn.disabled = true;
        }
        
        // Update sell button
        const sellValue = tower.getSellValue();
        const sellValueSpan = document.getElementById('sell-value');
        if (sellValueSpan) {
            sellValueSpan.textContent = `💰 ${sellValue}`;
        }
    }
    
    // Add gold
    addGold(amount) {
        this.state.gold += amount;
        this.updateUI();
        this.checkAchievements();  // Check gold-based achievements
    }
    
    // Spend gold
    spendGold(amount) {
        if (this.state.gold >= amount) {
            this.state.gold -= amount;
            this.updateUI();
            return true;
        }
        return false;
    }
    
    // Add mana
    addMana(amount) {
        this.state.mana += amount;
        
        // Cap mana at maximum
        if (this.state.mana > CONFIG.MAX_MANA) {
            this.state.mana = CONFIG.MAX_MANA;
        }
        
        // Round to 1 decimal place for display
        this.state.mana = Math.round(this.state.mana * 10) / 10;
        
        this.updateUI();
    }
    
    // Spend mana
    spendMana(amount) {
        if (this.state.mana >= amount) {
            this.state.mana -= amount;
            this.updateUI();
            return true;
        }
        return false;
    }
    
    // Lose life
    loseLife(amount = 1) {
        this.state.lives -= amount;
        this.updateUI();
        
        if (this.state.lives <= 0) {
            this.gameOver();
        }
    }
    
    // Game over
    gameOver() {
        this.state.gameOver = true;
        console.log('Game Over! Final Score:', this.state.score);
    }
}

// ============================================
// INITIALIZATION
// ============================================
let game;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function initGame() {
    console.log('Castle Defenders - Initializing...');
    console.log('Canvas size:', canvas.width, 'x', canvas.height);
    
    // Create game instance
    game = new Game(canvas, ctx);
    
    // Start game loop
    requestAnimationFrame((time) => game.gameLoop(time));
    
    console.log('Game loop started! Press S to begin playing.');
}

// Start game when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
