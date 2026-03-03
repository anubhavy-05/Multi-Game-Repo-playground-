// Castle Defenders - Tower Defense RPG
// Commit 25: Tower auras and synergies

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
    
    // Difficulty progression
    DIFFICULTY: {
        // Enemy scaling per wave
        HEALTH_SCALING: 0.15,        // 15% health increase per wave
        SPEED_SCALING: 0.02,         // 2% speed increase per wave
        GOLD_SCALING: 0.10,          // 10% gold increase per wave
        
        // Wave composition (enemy count scaling)
        BASE_ENEMIES: 5,             // Starting enemies in wave 1
        ENEMIES_PER_WAVE: 2,         // Additional enemies per wave
        MAX_ENEMIES_PER_WAVE: 50,    // Cap on enemies per wave
        
        // Spawn rate progression
        MIN_SPAWN_DELAY: 800,        // Fastest spawn rate (ms)
        SPAWN_DELAY_REDUCTION: 50,   // Decrease spawn delay per wave (ms)
        
        // Enemy type unlock waves
        FAST_UNLOCK_WAVE: 2,         // Fast enemies appear wave 2+
        TANK_UNLOCK_WAVE: 3,         // Tank enemies appear wave 3+
        FLYING_UNLOCK_WAVE: 5,       // Flying enemies appear wave 5+
        
        // Enemy composition weights (higher = more common)
        ENEMY_WEIGHTS: {
            basic: { early: 70, mid: 40, late: 20 },    // Waves 1-5, 6-15, 16+
            fast: { early: 30, mid: 30, late: 25 },
            tank: { early: 0, mid: 20, late: 30 },
            flying: { early: 0, mid: 10, late: 25 }
        },
        
        // Boss scaling
        BOSS_HEALTH_MULTIPLIER: 10,  // Boss has 10x normal health
        BOSS_SPEED_MULTIPLIER: 0.7,  // Boss is 30% slower
        BOSS_GOLD_MULTIPLIER: 5,     // Boss gives 5x gold
        
        // Wave rewards scaling
        BASE_WAVE_GOLD: 10,          // Base gold for completing wave
        WAVE_GOLD_PER_WAVE: 5        // Additional gold per wave number
    },
    
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
            statusEffect: 'slow',  // Applies slow effect
            statusChance: 0.6,  // 60% chance to apply
            description: 'Slow attack, high AOE damage + Slow'
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
            statusEffect: 'burn',  // Applies burn effect
            statusChance: 0.8,  // 80% chance to apply
            description: 'Splash damage, good range + Burn'
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
            statusEffect: 'stun',  // Applies stun effect
            statusChance: 0.3,  // 30% chance to stun
            description: 'Chain damage to multiple enemies + Stun'
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
    
    // Status Effects System
    STATUS_EFFECTS: {
        slow: {
            name: 'Slow',
            icon: '❄️',
            color: '#60A5FA',
            speedMultiplier: 0.5,  // 50% speed reduction
            duration: 2000,  // 2 seconds
            stackable: false
        },
        burn: {
            name: 'Burn',
            icon: '🔥',
            color: '#FF4500',
            damagePerSecond: 5,  // Damage over time
            duration: 3000,  // 3 seconds
            stackable: true,  // Multiple burns can stack
            maxStacks: 3
        },
        poison: {
            name: 'Poison',
            icon: '☠️',
            color: '#10B981',
            damagePerSecond: 3,  // Lower DPS but longer
            duration: 5000,  // 5 seconds
            stackable: true,
            maxStacks: 5
        },
        stun: {
            name: 'Stun',
            icon: '⚡',
            color: '#FFD700',
            speedMultiplier: 0,  // Complete immobilization
            duration: 1000,  // 1 second
            stackable: false
        }
    },
    
    // Critical Hit System
    CRITICAL_HIT: {
        BASE_CHANCE: 0.1,  // 10% base crit chance
        BASE_MULTIPLIER: 2.0,  // 2x damage on crit
        // Per-tower crit bonuses
        TOWER_BONUSES: {
            archer: { chance: 0.15, multiplier: 1.8 },  // 25% chance, 1.8x (fast light crits)
            mage: { chance: 0.05, multiplier: 3.0 },    // 15% chance, 3.0x (rare devastating crits)
            cannon: { chance: 0.10, multiplier: 2.5 },  // 20% chance, 2.5x (explosive crits)
            lightning: { chance: 0.20, multiplier: 2.0 } // 30% chance, 2.0x (frequent chain crits)
        }
    },
    
    // Combo System
    COMBO: {
        TIME_WINDOW: 3000,  // 3 seconds to maintain combo
        GOLD_MULTIPLIERS: {
            LOW: { threshold: 5, multiplier: 1.2 },   // 5+ kills: 1.2x gold
            MEDIUM: { threshold: 10, multiplier: 1.5 }, // 10+ kills: 1.5x gold
            HIGH: { threshold: 20, multiplier: 2.0 },   // 20+ kills: 2.0x gold
            EXTREME: { threshold: 30, multiplier: 3.0 } // 30+ kills: 3.0x gold
        },
        MAX_COMBO_DISPLAY: 99  // Cap display at 99 for UI
    },
    
    // Tower Auras and Synergies
    TOWER_AURAS: {
        AURA_RANGE: 100,  // Range for aura effects (pixels)
        VISUALIZE_AURA: true,  // Show aura visual indicators
        // Aura effects per tower type
        EFFECTS: {
            archer: {
                name: 'Precision Aura',
                icon: '🎯',
                description: '+15% attack speed to nearby towers',
                fireRateBonus: 0.15,  // 15% faster attacks
                color: 'rgba(139, 69, 19, 0.15)'
            },
            mage: {
                name: 'Mystic Aura',
                icon: '✨',
                description: '+20% damage to nearby towers',
                damageBonus: 0.20,  // 20% more damage
                color: 'rgba(147, 112, 219, 0.15)'
            },
            cannon: {
                name: 'Explosive Aura',
                icon: '💥',
                description: '+25% range to nearby towers',
                rangeBonus: 0.25,  // 25% more range
                color: 'rgba(105, 105, 105, 0.15)'
            },
            lightning: {
                name: 'Storm Aura',
                icon: '⚡',
                description: '+10% crit chance to nearby towers',
                critChanceBonus: 0.10,  // +10% crit chance
                color: 'rgba(255, 215, 0, 0.15)'
            }
        }
    },
    
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
    },
    
    // Sound effects (Web Audio API synthesized sounds)
    SOUNDS: {
        enabled: true,
        volume: 0.3,  // Master volume (0-1)
        effects: {
            towerShoot: { frequency: 440, duration: 0.05, type: 'square', volume: 0.2 },
            enemyHit: { frequency: 200, duration: 0.08, type: 'sawtooth', volume: 0.15 },
            enemyDeath: { frequency: 150, duration: 0.15, type: 'triangle', volume: 0.25 },
            towerPlace: { frequency: 600, duration: 0.1, type: 'sine', volume: 0.3 },
            towerUpgrade: { frequency: 800, duration: 0.15, type: 'sine', volume: 0.35 },
            towerSell: { frequency: 300, duration: 0.12, type: 'triangle', volume: 0.25 },
            waveComplete: { frequency: 700, duration: 0.2, type: 'sine', volume: 0.4 },
            waveStart: { frequency: 500, duration: 0.15, type: 'square', volume: 0.3 },
            abilityUse: { frequency: 900, duration: 0.12, type: 'sine', volume: 0.35 },
            goldCollect: { frequency: 1000, duration: 0.08, type: 'sine', volume: 0.2 },
            bossWarning: { frequency: 100, duration: 0.25, type: 'sawtooth', volume: 0.4 },
            bossDeath: { frequency: 120, duration: 0.3, type: 'triangle', volume: 0.5 },
            gameOver: { frequency: 180, duration: 0.4, type: 'sawtooth', volume: 0.45 },
            achievement: { frequency: 1200, duration: 0.2, type: 'sine', volume: 0.35 },
            buttonClick: { frequency: 600, duration: 0.03, type: 'square', volume: 0.15 }
        }
    }
};

// ============================================
// SOUND MANAGER
// ============================================
class SoundManager {
    constructor() {
        // Initialize Web Audio API
        this.audioContext = null;
        this.masterGain = null;
        this.enabled = CONFIG.SOUNDS.enabled;
        this.volume = CONFIG.SOUNDS.volume;
        
        // Initialize audio context on first user interaction
        this.initialized = false;
    }
    
    // Initialize audio context (must be called after user interaction)
    init() {
        if (this.initialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = this.volume;
            this.initialized = true;
            console.log('Sound system initialized');
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
            this.enabled = false;
        }
    }
    
    // Play a sound effect
    playSound(soundName) {
        if (!this.enabled || !this.initialized) return;
        
        const soundConfig = CONFIG.SOUNDS.effects[soundName];
        if (!soundConfig) {
            console.warn('Sound not found:', soundName);
            return;
        }
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            // Set oscillator properties
            oscillator.type = soundConfig.type;
            oscillator.frequency.value = soundConfig.frequency;
            
            // Set volume envelope
            const now = this.audioContext.currentTime;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(soundConfig.volume, now + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + soundConfig.duration);
            
            // Play sound
            oscillator.start(now);
            oscillator.stop(now + soundConfig.duration);
        } catch (error) {
            console.warn('Failed to play sound:', soundName, error);
        }
    }
    
    // Play chord (multiple frequencies at once)
    playChord(frequencies, duration = 0.2, type = 'sine', volume = 0.3) {
        if (!this.enabled || !this.initialized) return;
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playSingleTone(freq, duration, type, volume);
            }, index * 50);
        });
    }
    
    // Play single tone with custom parameters
    playSingleTone(frequency, duration, type, volume) {
        if (!this.enabled || !this.initialized) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.type = type;
            oscillator.frequency.value = frequency;
            
            const now = this.audioContext.currentTime;
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
            
            oscillator.start(now);
            oscillator.stop(now + duration);
        } catch (error) {
            console.warn('Failed to play tone:', error);
        }
    }
    
    // Set master volume
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = this.volume;
        }
        console.log('Volume set to:', this.volume);
    }
    
    // Toggle sound on/off
    toggleMute() {
        this.enabled = !this.enabled;
        console.log('Sound', this.enabled ? 'enabled' : 'disabled');
        return this.enabled;
    }
    
    // Check if sound is enabled
    isEnabled() {
        return this.enabled && this.initialized;
    }
}

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
        
        // Targeting priority: 'closest', 'first', 'last', 'strongest', 'weakest'
        this.targetPriority = 'closest';
        
        // Aura bonuses (calculated from nearby towers)
        this.auraBonuses = {
            damageBonus: 0,
            fireRateBonus: 0,
            rangeBonus: 0,
            critChanceBonus: 0
        };
        this.nearbyTowers = [];  // Towers affecting this tower
        
        // Shooting logic
        this.timeSinceLastShot = 0;
        this.target = null;
        this.rotation = 0;
        this.shootRecoil = 0;  // Recoil animation when shooting
        
        // Visual effects
        this.pulsePhase = Math.random() * Math.PI * 2;
    }
    
    // Update tower logic
    update(deltaTime, enemies) {
        this.timeSinceLastShot += deltaTime / 1000;
        this.pulsePhase += deltaTime * 0.003;
        
        // Decay recoil animation
        if (this.shootRecoil > 0) {
            this.shootRecoil -= deltaTime * 0.01;
            if (this.shootRecoil < 0) this.shootRecoil = 0;
        }
        
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
            const enemiesInRange = enemies.filter(e => e.isAlive && this.isInRange(e));
            
            if (enemiesInRange.length === 0) return;
            
            // Apply targeting priority
            switch(this.targetPriority) {
                case 'first':
                    // Target enemy closest to end (highest waypoint index)
                    this.target = enemiesInRange.reduce((best, enemy) => 
                        enemy.waypointIndex > best.waypointIndex ? enemy : best
                    );
                    break;
                    
                case 'last':
                    // Target enemy furthest from end (lowest waypoint index)
                    this.target = enemiesInRange.reduce((best, enemy) => 
                        enemy.waypointIndex < best.waypointIndex ? enemy : best
                    );
                    break;
                    
                case 'strongest':
                    // Target enemy with most health
                    this.target = enemiesInRange.reduce((best, enemy) => 
                        enemy.health > best.health ? enemy : best
                    );
                    break;
                    
                case 'weakest':
                    // Target enemy with least health
                    this.target = enemiesInRange.reduce((best, enemy) => 
                        enemy.health < best.health ? enemy : best
                    );
                    break;
                    
                case 'closest':
                default:
                    // Target enemy closest to tower (default behavior)
                    let closestDistance = Infinity;
                    let closestEnemy = null;
                    
                    enemiesInRange.forEach(enemy => {
                        const dx = enemy.x - this.x;
                        const dy = enemy.y - this.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestEnemy = enemy;
                        }
                    });
                    
                    this.target = closestEnemy;
                    break;
            }
        }
    }
    
    // Try to shoot at target
    tryShoot(game) {
        if (!this.target || !this.target.isAlive) return null;
        
        // Check fire rate (using effective fire rate with aura bonuses)
        const effectiveFireRate = this.getEffectiveFireRate();
        const fireInterval = 1 / effectiveFireRate;
        if (this.timeSinceLastShot < fireInterval) return null;
        
        // Fire!
        this.timeSinceLastShot = 0;
        this.shootRecoil = 1;  // Trigger recoil animation
        
        // Play shoot sound
        if (game && game.soundManager) {
            game.soundManager.playSound('towerShoot');
        }
        
        return new Projectile(this.x, this.y, this.target, this, game);
    }
    
    // Check if enemy is in range
    isInRange(enemy) {
        const dx = enemy.x - this.x;
        const dy = enemy.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= this.getEffectiveRange();  // Use effective range with aura bonuses
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
    
    // Calculate aura bonuses from all nearby towers
    calculateAuraBonuses(allTowers) {
        // Reset bonuses
        this.auraBonuses = {
            damageBonus: 0,
            fireRateBonus: 0,
            rangeBonus: 0,
            critChanceBonus: 0
        };
        this.nearbyTowers = [];
        
        // Check each tower for aura range
        allTowers.forEach(tower => {
            if (tower === this) return;  // Skip self
            
            const dx = tower.x - this.x;
            const dy = tower.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Check if tower is in aura range
            if (distance <= CONFIG.TOWER_AURAS.AURA_RANGE) {
                this.nearbyTowers.push(tower);
                const auraEffect = CONFIG.TOWER_AURAS.EFFECTS[tower.type];
                
                if (auraEffect) {
                    // Apply bonuses from this tower's aura
                    if (auraEffect.damageBonus) {
                        this.auraBonuses.damageBonus += auraEffect.damageBonus;
                    }
                    if (auraEffect.fireRateBonus) {
                        this.auraBonuses.fireRateBonus += auraEffect.fireRateBonus;
                    }
                    if (auraEffect.rangeBonus) {
                        this.auraBonuses.rangeBonus += auraEffect.rangeBonus;
                    }
                    if (auraEffect.critChanceBonus) {
                        this.auraBonuses.critChanceBonus += auraEffect.critChanceBonus;
                    }
                }
            }
        });
    }
    
    // Get effective damage with aura bonuses
    getEffectiveDamage() {
        return Math.floor(this.damage * (1 + this.auraBonuses.damageBonus));
    }
    
    // Get effective fire rate with aura bonuses
    getEffectiveFireRate() {
        return this.fireRate * (1 + this.auraBonuses.fireRateBonus);
    }
    
    // Get effective range with aura bonuses
    getEffectiveRange() {
        return this.range * (1 + this.auraBonuses.rangeBonus);
    }
    
    // Get effective crit chance bonus from auras
    getCritChanceBonus() {
        return this.auraBonuses.critChanceBonus;
    }
    
    // Draw the tower
    draw(ctx, game) {
        const size = CONFIG.GRID_SIZE;
        const x = this.gridX * size;
        const y = this.gridY * size;
        
        // Calculate recoil offset
        const recoilOffset = this.shootRecoil * 3;
        const recoilX = this.target ? -Math.cos(this.rotation) * recoilOffset : 0;
        const recoilY = this.target ? -Math.sin(this.rotation) * recoilOffset : 0;
        
        // Range indicator (when selected) with animated pulse
        if (this.isSelected && game) {
            const pulseSize = Math.sin(game.rangeIndicatorPhase) * 5;
            const pulseAlpha = Math.sin(game.rangeIndicatorPhase) * 0.05 + 0.15;
            
            ctx.fillStyle = `rgba(100, 200, 255, ${pulseAlpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range + pulseSize, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = `rgba(100, 200, 255, ${pulseAlpha * 3})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Draw aura indicators if tower has nearby towers buffing it
        if (CONFIG.TOWER_AURAS.VISUALIZE_AURA && this.nearbyTowers.length > 0 && game) {
            const auraAlpha = Math.sin(game.rangeIndicatorPhase * 0.7) * 0.1 + 0.2;
            
            // Draw connection lines to nearby towers
            this.nearbyTowers.forEach(nearbyTower => {
                const auraEffect = CONFIG.TOWER_AURAS.EFFECTS[nearbyTower.type];
                if (auraEffect) {
                    ctx.strokeStyle = auraEffect.color.replace('0.15', auraAlpha.toString());
                    ctx.lineWidth = 2;
                    ctx.setLineDash([5, 5]);
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(nearbyTower.x, nearbyTower.y);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }
            });
            
            // Draw aura glow around buffed tower
            if (this.nearbyTowers.length > 0) {
                const glowSize = size * 0.5 + Math.sin(game.rangeIndicatorPhase * 1.5) * 3;
                ctx.strokeStyle = `rgba(255, 215, 0, ${auraAlpha})`;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
        
        // Apply recoil to tower position
        const towerX = this.x + recoilX;
        const towerY = this.y + recoilY;
        
        // Tower base
        ctx.fillStyle = this.config.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.config.color;
        ctx.beginPath();
        ctx.arc(towerX, towerY, size * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Tower border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Tower barrel/targeting indicator (if has target)
        if (this.target && this.target.isAlive) {
            ctx.save();
            ctx.translate(towerX, towerY);
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
        ctx.fillText(this.config.icon, towerX, towerY);
        
        // Level indicator
        if (this.level > 1) {
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 10px Arial';
            ctx.fillText(`Lv${this.level}`, towerX, towerY + size * 0.4);
        }
        
        // Pulse effect
        const pulse = Math.sin(this.pulsePhase) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(255, 255, 255, ${pulse * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(towerX, towerY, size * 0.35 + pulse * 5, 0, Math.PI * 2);
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
        this.damage = tower.getEffectiveDamage();  // Use effective damage with aura bonuses
        this.type = tower.type;
        this.critChanceBonus = tower.getCritChanceBonus();  // Get aura crit bonus
        
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
            // Calculate critical hit
            let finalDamage = this.damage;
            let isCritical = false;
            
            const baseCritChance = CONFIG.CRITICAL_HIT.BASE_CHANCE;
            const baseCritMultiplier = CONFIG.CRITICAL_HIT.BASE_MULTIPLIER;
            const towerBonus = CONFIG.CRITICAL_HIT.TOWER_BONUSES[this.type] || { chance: 0, multiplier: 1 };
            
            // Add aura crit chance bonus from nearby towers
            const totalCritChance = baseCritChance + towerBonus.chance + this.critChanceBonus;
            const totalCritMultiplier = baseCritMultiplier + (towerBonus.multiplier - baseCritMultiplier);
            
            // Roll for critical hit
            if (Math.random() < totalCritChance) {
                isCritical = true;
                finalDamage = Math.floor(this.damage * totalCritMultiplier);
            }
            
            // Apply damage
            this.target.takeDamage(finalDamage);
            
            // Create floating damage text
            if (this.game) {
                this.createDamageText(finalDamage, isCritical);
            }
            
            // Apply status effect if tower has one
            if (this.tower.config.statusEffect && this.tower.config.statusChance) {
                // Check if effect should be applied based on chance
                if (Math.random() < this.tower.config.statusChance) {
                    this.target.applyStatusEffect(this.tower.config.statusEffect);
                }
            }
            
            // Create hit particles
            if (this.game) {
                this.createHitParticles(isCritical);
            }
        }
    }
    
    // Create floating damage text
    createDamageText(damage, isCritical) {
        const floatingText = {
            x: this.x,
            y: this.y,
            text: isCritical ? `${damage}!` : `${damage}`,
            color: isCritical ? '#FFD700' : '#FFF',
            fontSize: isCritical ? 20 : 14,
            alpha: 1.0,
            lifetime: 1000,  // 1 second
            velocityY: -50,  // Float upward
            isCritical: isCritical
        };
        this.game.floatingTexts.push(floatingText);
    }
    
    // Create hit particles
    createHitParticles(isCritical) {
        const colors = {
            'archer': '#8B4513',
            'mage': '#9370DB',
            'cannon': '#FF6B00',
            'lightning': '#FFD700'
        };
        
        const color = isCritical ? '#FFD700' : (colors[this.type] || '#FFF');
        let count = this.type === 'cannon' ? 12 : 8;
        if (isCritical) count *= 2;  // Double particles for crits
        
        for (let i = 0; i < count; i++) {
            const particle = new Particle(this.x, this.y, 'hit', {
                color: color,
                size: isCritical ? 3 + Math.random() * 4 : 2 + Math.random() * 3,
                speed: isCritical ? 100 + Math.random() * 150 : 50 + Math.random() * 100,
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
        
        // Apply difficulty scaling to stats
        const healthMultiplier = 1 + (wave * CONFIG.DIFFICULTY.HEALTH_SCALING);
        const speedMultiplier = 1 + (wave * CONFIG.DIFFICULTY.SPEED_SCALING);
        const goldMultiplier = 1 + (wave * CONFIG.DIFFICULTY.GOLD_SCALING);
        
        // Boss gets extra scaling
        if (this.config.isBoss) {
            this.maxHealth = this.config.health * healthMultiplier * CONFIG.DIFFICULTY.BOSS_HEALTH_MULTIPLIER;
            this.speed = this.config.speed * CONFIG.DIFFICULTY.BOSS_SPEED_MULTIPLIER;  // Bosses don't get speed scaling
            this.goldReward = Math.floor(this.config.goldReward * goldMultiplier * CONFIG.DIFFICULTY.BOSS_GOLD_MULTIPLIER);
        } else {
            this.maxHealth = this.config.health * healthMultiplier;
            this.speed = this.config.speed * speedMultiplier;
            this.goldReward = Math.floor(this.config.goldReward * goldMultiplier);
        }
        
        this.health = this.maxHealth;
        this.damage = this.config.damage;
        
        // Position and movement
        this.waypointIndex = 0;
        this.x = CONFIG.PATH_WAYPOINTS[0].x * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2;
        this.y = CONFIG.PATH_WAYPOINTS[0].y * CONFIG.GRID_SIZE + CONFIG.GRID_SIZE / 2;
        
        // Status
        this.isAlive = true;
        this.reachedEnd = false;
        
        // Status effects tracking
        this.statusEffects = {
            slow: { active: false, duration: 0, stacks: 0 },
            burn: { active: false, duration: 0, stacks: 0, lastTick: 0 },
            poison: { active: false, duration: 0, stacks: 0, lastTick: 0 },
            stun: { active: false, duration: 0, stacks: 0 }
        };
        this.baseSpeed = this.speed;  // Store base speed for status calculations
        
        // Visual effects
        this.rotation = 0;
        this.hurtTimer = 0;
    }
    
    // Update enemy movement
    update(deltaTime) {
        if (!this.isAlive || this.reachedEnd) return;
        
        // Update status effects
        this.updateStatusEffects(deltaTime);
        
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
        
        // Play hit sound
        if (this.game && this.game.soundManager) {
            this.game.soundManager.playSound('enemyHit');
        }
        
        if (this.health <= 0) {
            this.isAlive = false;
        }
    }
    
    // Apply a status effect
    applyStatusEffect(effectType) {
        if (!CONFIG.STATUS_EFFECTS[effectType]) return;
        
        const effectConfig = CONFIG.STATUS_EFFECTS[effectType];
        const effect = this.statusEffects[effectType];
        
        // Check if effect is stackable
        if (effectConfig.stackable) {
            // Increase stack count up to max
            if (effect.stacks < effectConfig.maxStacks) {
                effect.stacks++;
            }
            // Refresh duration
            effect.duration = effectConfig.duration;
            effect.active = true;
        } else {
            // Non-stackable: just apply/refresh
            effect.active = true;
            effect.duration = effectConfig.duration;
            effect.stacks = 1;
        }
        
        // Reset DoT tick timers
        if (effectType === 'burn' || effectType === 'poison') {
            effect.lastTick = 0;
        }
    }
    
    // Update status effects
    updateStatusEffects(deltaTime) {
        let totalSpeedMultiplier = 1;
        
        // Process each status effect
        for (const effectType in this.statusEffects) {
            const effect = this.statusEffects[effectType];
            if (!effect.active) continue;
            
            const effectConfig = CONFIG.STATUS_EFFECTS[effectType];
            
            // Decrease duration
            effect.duration -= deltaTime;
            
            // Check if effect expired
            if (effect.duration <= 0) {
                effect.active = false;
                effect.stacks = 0;
                continue;
            }
            
            // Apply speed modification effects
            if (effectConfig.speedMultiplier !== undefined) {
                totalSpeedMultiplier *= effectConfig.speedMultiplier;
            }
            
            // Apply damage over time effects
            if (effectConfig.damagePerSecond !== undefined) {
                effect.lastTick += deltaTime;
                const tickInterval = 1000; // Damage per second
                
                if (effect.lastTick >= tickInterval) {
                    const ticks = Math.floor(effect.lastTick / tickInterval);
                    const damage = effectConfig.damagePerSecond * effect.stacks * ticks;
                    this.health -= damage;
                    effect.lastTick = effect.lastTick % tickInterval;
                    
                    if (this.health <= 0) {
                        this.isAlive = false;
                    }
                }
            }
        }
        
        // Update speed based on active effects
        this.speed = this.baseSpeed * totalSpeedMultiplier;
    }
    
    // Draw the enemy
    draw(ctx, game) {
        if (!this.isAlive) return;
        
        const size = this.config.size;
        
        // Boss aura effect
        if (this.config.isBoss && game) {
            const auraPulse = Math.sin(game.castlePulse * 2) * 0.3 + 0.7;
            ctx.shadowBlur = 30 * auraPulse;
            ctx.shadowColor = this.config.color;
            
            // Draw outer aura ring
            ctx.strokeStyle = this.config.color;
            ctx.globalAlpha = auraPulse * 0.5;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, size + 8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
        
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
        
        // Status effect indicators
        this.drawStatusEffects(ctx);
    }
    
    // Draw status effect icons above enemy
    drawStatusEffects(ctx) {
        const activeEffects = [];
        
        // Collect active effects
        for (const effectType in this.statusEffects) {
            const effect = this.statusEffects[effectType];
            if (effect.active) {
                activeEffects.push({
                    type: effectType,
                    config: CONFIG.STATUS_EFFECTS[effectType],
                    stacks: effect.stacks
                });
            }
        }
        
        if (activeEffects.length === 0) return;
        
        // Draw each active effect
        const iconSize = 12;
        const iconSpacing = 14;
        const startX = this.x - (activeEffects.length * iconSpacing) / 2 + iconSize / 2;
        const y = this.y - this.config.size - 18;
        
        activeEffects.forEach((effect, index) => {
            const x = startX + index * iconSpacing;
            
            // Draw background circle
            ctx.fillStyle = effect.config.color;
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.arc(x, y, iconSize / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
            
            // Draw border
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Draw icon
            ctx.font = `${iconSize - 2}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#FFF';
            ctx.fillText(effect.config.icon, x, y);
            
            // Draw stack count for stackable effects
            if (effect.config.stackable && effect.stacks > 1) {
                ctx.font = 'bold 8px Arial';
                ctx.fillStyle = '#FFF';
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.strokeText(effect.stacks, x + 5, y + 5);
                ctx.fillText(effect.stacks, x + 5, y + 5);
            }
        });
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
        this.currentSpawnDelay = CONFIG.WAVE_SPAWN_DELAY;  // Dynamic spawn rate
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
        
        // Sound system
        this.soundManager = new SoundManager();
        
        // Visual effects system
        this.screenShake = {
            intensity: 0,
            duration: 0,
            offsetX: 0,
            offsetY: 0
        };
        this.flashEffect = {
            active: false,
            alpha: 0,
            color: '#FFFFFF'
        };
        this.castlePulse = 0;  // Animation phase for castle
        this.rangeIndicatorPhase = 0;  // Animation for range indicators
        
        // Combo system
        this.combo = {
            count: 0,
            multiplier: 1.0,
            lastKillTime: 0,
            active: false
        };
        this.floatingTexts = [];  // For damage numbers and combo text
        
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
        this.setupVolumeControls();
        this.setupPriorityButtons();
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
        
        // Play wave start sound
        this.soundManager.playSound('waveStart');
        
        // Check if this is a boss wave
        const isBossWave = this.state.wave % CONFIG.BOSS_WAVE_INTERVAL === 0;
        
        if (isBossWave) {
            // Boss wave - show warning
            this.bossWarning = true;
            this.bossWarningTime = 3000; // 3 seconds warning
            this.enemiesPerWave = 1; // Only boss
            this.soundManager.playSound('bossWarning');
            console.log(`⚠️ BOSS WAVE ${this.state.wave}! A powerful boss is approaching!`);
        } else {
            // Calculate enemies for this wave using difficulty system
            const enemyCount = CONFIG.DIFFICULTY.BASE_ENEMIES + (this.state.wave * CONFIG.DIFFICULTY.ENEMIES_PER_WAVE);
            this.enemiesPerWave = Math.min(enemyCount, CONFIG.DIFFICULTY.MAX_ENEMIES_PER_WAVE);
            
            // Calculate spawn delay (gets faster as waves progress)
            const spawnDelayReduction = this.state.wave * CONFIG.DIFFICULTY.SPAWN_DELAY_REDUCTION;
            this.currentSpawnDelay = Math.max(
                CONFIG.DIFFICULTY.MIN_SPAWN_DELAY,
                CONFIG.WAVE_SPAWN_DELAY - spawnDelayReduction
            );
            
            console.log(`Wave ${this.state.wave} started! Enemies: ${this.enemiesPerWave}, Spawn delay: ${this.currentSpawnDelay}ms`);
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
        } else {
            // Use difficulty system for enemy type selection
            enemyType = this.selectEnemyType();
        }
        
        const enemy = new Enemy(enemyType, this.state.wave);
        this.enemies.push(enemy);
        this.enemiesSpawned++;
        
        // Track boss
        if (enemyType === 'boss') {
            this.currentBoss = enemy;
            console.log(`👑 BOSS SPAWNED! Health: ${Math.floor(enemy.maxHealth)}, Gold: ${enemy.goldReward}`);
        }
        
        console.log(`Spawned ${enemyType} enemy (${this.enemiesSpawned}/${this.enemiesPerWave})`);
        this.updateWaveInfo();  // Update info when enemy spawns
    }
    
    // Select enemy type based on wave and difficulty weights
    selectEnemyType() {
        const wave = this.state.wave;
        const weights = CONFIG.DIFFICULTY.ENEMY_WEIGHTS;
        
        // Determine game phase
        let phase = 'early';  // Waves 1-5
        if (wave >= 16) {
            phase = 'late';
        } else if (wave >= 6) {
            phase = 'mid';
        }
        
        // Build weighted pool of available enemy types
        const pool = [];
        
        // Basic enemies always available
        for (let i = 0; i < weights.basic[phase]; i++) {
            pool.push('basic');
        }
        
        // Fast enemies unlock at wave 2
        if (wave >= CONFIG.DIFFICULTY.FAST_UNLOCK_WAVE) {
            for (let i = 0; i < weights.fast[phase]; i++) {
                pool.push('fast');
            }
        }
        
        // Tank enemies unlock at wave 3
        if (wave >= CONFIG.DIFFICULTY.TANK_UNLOCK_WAVE) {
            for (let i = 0; i < weights.tank[phase]; i++) {
                pool.push('tank');
            }
        }
        
        // Flying enemies unlock at wave 5
        if (wave >= CONFIG.DIFFICULTY.FLYING_UNLOCK_WAVE) {
            for (let i = 0; i < weights.flying[phase]; i++) {
                pool.push('flying');
            }
        }
        
        // Random selection from weighted pool
        return pool[Math.floor(Math.random() * pool.length)];
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
            
            // Use current spawn delay (varies by wave)
            const spawnDelay = this.currentSpawnDelay || CONFIG.WAVE_SPAWN_DELAY;
            if (this.timeSinceLastSpawn >= spawnDelay) {
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
        
        // Play wave complete sound
        this.soundManager.playChord([700, 850, 1000], 0.25, 'sine', 0.3);
        
        // Visual effect for wave completion
        this.triggerFlash('#4ade80', 0.2);  // Green flash
        
        // Bonus gold for completing wave (scales with wave number)
        const bonusGold = CONFIG.DIFFICULTY.BASE_WAVE_GOLD + (this.state.wave * CONFIG.DIFFICULTY.WAVE_GOLD_PER_WAVE);
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
    // COMBO SYSTEM
    // ============================================
    
    // Update combo on kill
    updateCombo() {
        const currentTime = Date.now();
        const timeSinceLastKill = currentTime - this.combo.lastKillTime;
        
        // Check if combo is maintained
        if (timeSinceLastKill <= CONFIG.COMBO.TIME_WINDOW) {
            this.combo.count++;
        } else {
            // Combo broken, reset
            this.combo.count = 1;
        }
        
        this.combo.lastKillTime = currentTime;
        this.combo.active = true;
        
        // Calculate combo multiplier
        this.combo.multiplier = 1.0;
        const multipliers = CONFIG.COMBO.GOLD_MULTIPLIERS;
        
        if (this.combo.count >= multipliers.EXTREME.threshold) {
            this.combo.multiplier = multipliers.EXTREME.multiplier;
        } else if (this.combo.count >= multipliers.HIGH.threshold) {
            this.combo.multiplier = multipliers.HIGH.multiplier;
        } else if (this.combo.count >= multipliers.MEDIUM.threshold) {
            this.combo.multiplier = multipliers.MEDIUM.multiplier;
        } else if (this.combo.count >= multipliers.LOW.threshold) {
            this.combo.multiplier = multipliers.LOW.multiplier;
        }
    }
    
    // Create floating combo text
    createComboText(enemy, goldAmount) {
        const floatingText = {
            x: enemy.x,
            y: enemy.y - 20,
            text: `+${goldAmount} (x${this.combo.multiplier})`,
            color: '#FFD700',
            fontSize: 16,
            alpha: 1.0,
            lifetime: 1500,
            velocityY: -30,
            isCritical: false,
            isCombo: true
        };
        this.floatingTexts.push(floatingText);
    }
    
    // Update combo system (called each frame)
    updateComboSystem(deltaTime) {
        if (!this.combo.active) return;
        
        const currentTime = Date.now();
        const timeSinceLastKill = currentTime - this.combo.lastKillTime;
        
        // Break combo if time window exceeded
        if (timeSinceLastKill > CONFIG.COMBO.TIME_WINDOW) {
            this.combo.active = false;
            this.combo.count = 0;
            this.combo.multiplier = 1.0;
        }
    }
    
    // Update floating texts
    updateFloatingTexts(deltaTime) {
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const text = this.floatingTexts[i];
            
            // Update position
            text.y += text.velocityY * (deltaTime / 1000);
            
            // Update alpha
            text.lifetime -= deltaTime;
            text.alpha = Math.max(0, text.lifetime / (text.isCritical ? 1000 : 1500));
            
            // Remove if expired
            if (text.lifetime <= 0) {
                this.floatingTexts.splice(i, 1);
            }
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
                // Initialize sound on first interaction
                if (!this.soundManager.initialized) {
                    this.soundManager.init();
                }
                
                const towerType = btn.dataset.tower;
                const towerConfig = CONFIG.TOWER_TYPES[towerType];
                
                // Check if player can afford it
                if (this.state.gold >= towerConfig.cost) {
                    // Play button click sound
                    this.soundManager.playSound('buttonClick');
                    
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
                // Initialize sound on first interaction
                if (!this.soundManager.initialized) {
                    this.soundManager.init();
                }
                
                // Deduct cost
                this.spendGold(cost);
                
                // Upgrade tower
                this.selectedTower.upgrade();
                
                // Play upgrade sound
                this.soundManager.playSound('towerUpgrade');
                
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
            
            // Initialize sound on first interaction
            if (!this.soundManager.initialized) {
                this.soundManager.init();
            }
            
            // Get sell value
            const sellValue = this.selectedTower.getSellValue();
            
            // Play sell sound
            this.soundManager.playSound('towerSell');
            
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
                // Initialize sound on first interaction
                if (!this.soundManager.initialized) {
                    this.soundManager.init();
                }
                
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
                // Initialize sound on first interaction
                if (!this.soundManager.initialized) {
                    this.soundManager.init();
                }
                
                const speed = parseInt(btn.dataset.speed);
                
                // Play button click sound
                this.soundManager.playSound('buttonClick');
                
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
                // Initialize sound on first interaction
                if (!this.soundManager.initialized) {
                    this.soundManager.init();
                }
                
                this.soundManager.playSound('buttonClick');
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
                // Initialize sound on first interaction
                if (!this.soundManager.initialized) {
                    this.soundManager.init();
                }
                
                this.soundManager.playSound('buttonClick');
                this.saveGame();
            });
        }
        
        if (loadBtn) {
            loadBtn.addEventListener('click', () => {
                // Initialize sound on first interaction
                if (!this.soundManager.initialized) {
                    this.soundManager.init();
                }
                
                this.soundManager.playSound('buttonClick');
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
                    level: tower.level,
                    targetPriority: tower.targetPriority
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
                        // Restore targeting priority
                        if (towerData.targetPriority) {
                            tower.targetPriority = towerData.targetPriority;
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
    // VOLUME CONTROLS
    // ============================================
    
    // Setup volume controls
    setupVolumeControls() {
        const muteBtn = document.getElementById('mute-btn');
        const volumeSlider = document.getElementById('volume-slider');
        
        // Mute button
        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                // Initialize sound system on first interaction
                if (!this.soundManager.initialized) {
                    this.soundManager.init();
                }
                
                const enabled = this.soundManager.toggleMute();
                muteBtn.textContent = enabled ? '🔊' : '🔇';
                muteBtn.classList.toggle('muted', !enabled);
                
                // Play button click sound if enabled
                if (enabled) {
                    this.soundManager.playSound('buttonClick');
                }
            });
        }
        
        // Volume slider
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                // Initialize sound system on first interaction
                if (!this.soundManager.initialized) {
                    this.soundManager.init();
                }
                
                const volume = e.target.value / 100;
                this.soundManager.setVolume(volume);
                
                // Update mute button if volume is 0
                if (muteBtn) {
                    if (volume === 0) {
                        muteBtn.textContent = '🔇';
                        muteBtn.classList.add('muted');
                    } else if (this.soundManager.enabled) {
                        muteBtn.textContent = '🔊';
                        muteBtn.classList.remove('muted');
                    }
                }
            });
            
            // Play sound on slider release
            volumeSlider.addEventListener('change', () => {
                if (this.soundManager.isEnabled()) {
                    this.soundManager.playSound('buttonClick');
                }
            });
        }
        
        console.log('Volume controls setup complete');
    }
    
    // ============================================
    // TOWER TARGETING PRIORITY
    // ============================================
    
    // Setup priority buttons
    setupPriorityButtons() {
        const priorityButtons = document.querySelectorAll('.priority-btn');
        
        priorityButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Initialize sound system on first interaction
                if (!this.soundManager.initialized) {
                    this.soundManager.init();
                }
                
                if (!this.selectedTower) return;
                
                const priority = btn.getAttribute('data-priority');
                this.selectedTower.targetPriority = priority;
                
                // Update UI to reflect active priority
                this.updatePriorityUI();
                
                // Play sound
                this.soundManager.playSound('buttonClick');
                
                console.log(`Tower targeting priority set to: ${priority}`);
            });
        });
        
        console.log('Priority buttons setup complete');
    }
    
    // Update priority UI
    updatePriorityUI() {
        if (!this.selectedTower) return;
        
        const priorityButtons = document.querySelectorAll('.priority-btn');
        const currentPriority = this.selectedTower.targetPriority;
        
        priorityButtons.forEach(btn => {
            const priority = btn.getAttribute('data-priority');
            if (priority === currentPriority) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // ============================================
    // VISUAL EFFECTS SYSTEM
    // ============================================
    
    // Trigger screen shake effect
    addScreenShake(intensity, duration) {
        this.screenShake.intensity = intensity;
        this.screenShake.duration = duration;
    }
    
    // Update screen shake
    updateScreenShake(deltaTime) {
        if (this.screenShake.duration > 0) {
            this.screenShake.duration -= deltaTime;
            
            // Calculate shake offset
            const progress = this.screenShake.duration / 1000;  // Normalize to 0-1
            const currentIntensity = this.screenShake.intensity * progress;
            
            this.screenShake.offsetX = (Math.random() - 0.5) * currentIntensity;
            this.screenShake.offsetY = (Math.random() - 0.5) * currentIntensity;
        } else {
            this.screenShake.offsetX = 0;
            this.screenShake.offsetY = 0;
        }
    }
    
    // Trigger flash effect
    triggerFlash(color = '#FFFFFF', alpha = 0.3) {
        this.flashEffect.active = true;
        this.flashEffect.alpha = alpha;
        this.flashEffect.color = color;
    }
    
    // Update flash effect
    updateFlashEffect(deltaTime) {
        if (this.flashEffect.active) {
            this.flashEffect.alpha -= deltaTime / 200;  // Fade out over 200ms
            if (this.flashEffect.alpha <= 0) {
                this.flashEffect.active = false;
                this.flashEffect.alpha = 0;
            }
        }
    }
    
    // Update visual effects animations
    updateVisualEffects(deltaTime) {
        // Update screen shake
        this.updateScreenShake(deltaTime);
        
        // Update flash effect
        this.updateFlashEffect(deltaTime);
        
        // Update castle pulse animation
        this.castlePulse += deltaTime * 0.002;
        
        // Update range indicator animation
        this.rangeIndicatorPhase += deltaTime * 0.003;
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
        
        // Play achievement sound
        this.soundManager.playChord([1200, 1400, 1600], 0.3, 'sine', 0.25);
        
        // Visual effect for achievement
        this.triggerFlash('#FFD700', 0.25);  // Gold flash
        
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
        
        // Play ability sound
        this.soundManager.playSound('abilityUse');
        
        console.log(`Activated ${config.name}!`);
        this.updateAbilityButtons();
    }
    
    // Cast meteor strike at target location
    castMeteor(x, y) {
        const config = CONFIG.ABILITIES.meteor;
        
        // Screen shake and flash for meteor impact
        this.addScreenShake(15, 400);  // Medium shake for 400ms
        this.triggerFlash('#FF4500', 0.25);  // Orange flash
        
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
        
        // Play tower placement sound
        this.soundManager.playSound('towerPlace');
        
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
        
        // Calculate aura bonuses for all towers
        this.towers.forEach(tower => {
            tower.calculateAuraBonuses(this.towers);
        });
        
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
                
                // Update combo system
                this.updateCombo();
                
                // Create death particles
                this.createDeathParticles(enemy);
                
                // Create gold particles
                this.createGoldParticles(enemy);
                
                // Play death sound (different for boss)
                if (wasBoss) {
                    this.soundManager.playSound('bossDeath');
                    // Screen shake and flash for boss death
                    this.addScreenShake(20, 500);  // Intense shake for 500ms
                    this.triggerFlash('#FFD700', 0.3);  // Gold flash
                } else {
                    this.soundManager.playSound('enemyDeath');
                }
                
                // Apply gold rush multiplier + combo multiplier
                const goldMultiplier = this.abilities.goldRush.isActive ? CONFIG.ABILITIES.goldRush.multiplier : 1;
                let goldReward = Math.floor(enemy.goldReward * goldMultiplier * this.combo.multiplier);
                
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
                
                // Show combo gold text if combo is active
                if (this.combo.active && this.combo.multiplier > 1) {
                    this.createComboText(enemy, goldReward);
                }
                
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
        
        // Update combo system
        this.updateComboSystem(adjustedDeltaTime);
        
        // Update floating texts
        this.updateFloatingTexts(adjustedDeltaTime);
        
        // Update visual effects
        this.updateVisualEffects(adjustedDeltaTime);
    }
    
    // Render everything
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Apply screen shake
        this.ctx.save();
        this.ctx.translate(this.screenShake.offsetX, this.screenShake.offsetY);
        
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
            
            // Draw combo UI
            if (this.combo.active && this.combo.count > 1) {
                this.drawComboUI();
            }
            
            // Draw pause overlay if paused
            if (this.state.isPaused) {
                this.drawPauseOverlay();
            }
        }
        
        // Restore context after screen shake
        this.ctx.restore();
        
        // Draw flash effect (on top of everything, not affected by shake)
        if (this.flashEffect.active) {
            this.ctx.fillStyle = this.flashEffect.color;
            this.ctx.globalAlpha = this.flashEffect.alpha;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.globalAlpha = 1;
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
        
        // Pulse animation for castle
        const pulse = Math.sin(this.castlePulse) * 0.3 + 0.7;
        
        // Castle glow effect
        this.ctx.shadowBlur = 15 * pulse;
        this.ctx.shadowColor = '#FFD700';
        
        // Castle base
        this.ctx.fillStyle = CONFIG.COLORS.CASTLE;
        this.ctx.fillRect(x + 5, y + 10, size - 10, size - 10);
        
        // Castle tower
        this.ctx.fillRect(x + size / 2 - 8, y + 5, 16, size - 5);
        
        this.ctx.shadowBlur = 0;
        
        // Castle flag (animated waving)
        const flagWave = Math.sin(this.castlePulse * 3) * 2;
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.moveTo(x + size / 2 + 5, y + 8);
        this.ctx.lineTo(x + size / 2 + 15 + flagWave, y + 12);
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
        
        // Castle label with pulse effect
        this.ctx.fillStyle = '#fff';
        this.ctx.font = `bold ${10 + pulse * 2}px Arial`;
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
            enemy.draw(this.ctx, this);
        });
        
        // Draw projectiles
        this.projectiles.forEach(projectile => {
            projectile.draw(this.ctx);
        });
        
        // Draw particles
        this.particles.forEach(particle => {
            particle.draw(this.ctx);
        });
        
        // Draw floating texts (damage numbers, combo text)
        this.floatingTexts.forEach(text => {
            this.ctx.save();
            this.ctx.globalAlpha = text.alpha;
            this.ctx.font = `bold ${text.fontSize}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            // Stroke for readability
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 3;
            this.ctx.strokeText(text.text, text.x, text.y);
            
            // Fill text
            this.ctx.fillStyle = text.color;
            this.ctx.fillText(text.text, text.x, text.y);
            this.ctx.restore();
        });
        
        // Draw towers
        this.towers.forEach(tower => {
            tower.draw(this.ctx, this);
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
    
    // Draw combo UI
    drawComboUI() {
        const currentTime = Date.now();
        const timeSinceLastKill = currentTime - this.combo.lastKillTime;
        const timeRemaining = CONFIG.COMBO.TIME_WINDOW - timeSinceLastKill;
        const timePercent = timeRemaining / CONFIG.COMBO.TIME_WINDOW;
        
        // Position at top-right of screen
        const x = this.canvas.width - 180;
        const y = 60;
        const width = 160;
        const height = 80;
        
        // Background with pulse effect
        const pulseScale = 0.95 + Math.sin(Date.now() / 200) * 0.05;
        this.ctx.save();
        this.ctx.globalAlpha = 0.9 * pulseScale;
        
        // Gradient background
        const gradient = this.ctx.createLinearGradient(x, y, x, y + height);
        gradient.addColorStop(0, '#7C3AED');
        gradient.addColorStop(1, '#4C1D95');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x, y, width, height);
        
        // Border with glow
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 3;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#FFD700';
        this.ctx.strokeRect(x, y, width, height);
        this.ctx.shadowBlur = 0;
        this.ctx.restore();
        
        // Combo text
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('⚔️ COMBO', x + width / 2, y + 22);
        
        // Combo count
        const displayCount = Math.min(this.combo.count, CONFIG.COMBO.MAX_COMBO_DISPLAY);
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = 'bold 28px Arial';
        this.ctx.fillText(`${displayCount}x`, x + width / 2, y + 48);
        
        // Gold multiplier
        this.ctx.fillStyle = '#4ade80';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.fillText(`+${Math.round((this.combo.multiplier - 1) * 100)}% Gold`, x + width / 2, y + 66);
        
        // Time remaining bar
        const barX = x + 10;
        const barY = y + height - 8;
        const barWidth = width - 20;
        const barHeight = 4;
        
        // Background bar
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Progress bar (changes color based on time remaining)
        let barColor = '#4ade80'; // Green
        if (timePercent < 0.3) {
            barColor = '#f87171'; // Red
        } else if (timePercent < 0.6) {
            barColor = '#fbbf24'; // Yellow
        }
        
        this.ctx.fillStyle = barColor;
        this.ctx.fillRect(barX, barY, barWidth * timePercent, barHeight);
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
        this.ctx.fillText('Commit 24: Critical Hits & Combo System Active ✓', this.canvas.width / 2, this.canvas.height / 2 + 70);
        this.ctx.fillText('Land critical hits and build combos for massive gold rewards!', this.canvas.width / 2, this.canvas.height / 2 + 90);
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
        
        // Update targeting priority UI
        this.updatePriorityUI();
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
        this.soundManager.playSound('gameOver');
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
