// Commit 2: Create Game Class and Core Initialization

// ===== CONFIGURATION =====
const CONFIG = {
    // Canvas
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    TILE_SIZE: 40,
    
    // Grid dimensions
    GRID_WIDTH: 20,  // 800 / 40
    GRID_HEIGHT: 15, // 600 / 40
    
    // Game settings
    TARGET_FPS: 60,
    MAX_DELTA_TIME: 0.1, // Prevent spiral of death
    
    // Player settings
    PLAYER: {
        START_HEALTH: 100,
        START_ATTACK: 10,
        START_DEFENSE: 5,
        START_SPEED: 150, // pixels per second
        START_GOLD: 0,
        START_LEVEL: 1,
        SIZE: 16, // Half tile size for better collision
        ATTACK_RANGE: 50, // Attack range in pixels (Commit 8)
        ATTACK_COOLDOWN: 0.5, // Seconds between attacks (Commit 8)
    },
    
    // Inventory settings (Commit 10)
    INVENTORY: {
        MAX_SLOTS: 20, // Maximum number of inventory slots
        SLOT_SIZE: 45, // Size of each inventory slot in UI
        COLS: 5, // Number of columns in inventory grid
        PICKUP_RANGE: 50, // Range for manual pickup prompt
    },
    
    // Combat settings (Commit 8)
    COMBAT: {
        DAMAGE_VARIANCE: 0.1, // ±10% damage randomness
        CRITICAL_CHANCE: 0.15, // 15% chance for critical hit
        CRITICAL_MULTIPLIER: 2.0, // 2x damage on crit
        KNOCKBACK_FORCE: 100, // Knockback velocity
        KNOCKBACK_DURATION: 0.2, // Seconds of knockback
    },
    
    // Game progression
    FLOOR: {
        START_FLOOR: 1,
        DIFFICULTY_MULTIPLIER: 1.2, // Each floor enemies get 20% stronger
    },
    
    // Camera
    CAMERA: {
        SMOOTH_SPEED: 5, // Camera smoothing factor
        DEAD_ZONE: 100, // Pixels from center before camera moves
    },
    
    // Debug settings (Commit 6)
    DEBUG: {
        SHOW_COLLISION: false, // Toggle with 'C' key
        SHOW_GRID: false,      // Toggle with 'G' key
        SHOW_FPS: true,
        COLLISION_COLOR: 'rgba(0, 255, 0, 0.5)',
        GRID_COLOR: 'rgba(255, 215, 0, 0.1)',
    },
    
    // Colors
    COLORS: {
        BACKGROUND: '#1a1a1a',
        GRID: 'rgba(255, 215, 0, 0.1)',
        FLOOR: '#2a2a2a',
        WALL: '#404040',
        PLAYER: '#4a9eff',
        ENEMY: '#ff4a4a',
        GOLD: '#ffd700',
        HEALTH: '#4aff4a',
        TEXT: '#ffffff',
    }
};

// ===== COLLISION LAYERS (Commit 6) =====
const COLLISION_LAYER = {
    NONE: 0,
    PLAYER: 1 << 0,      // 1
    ENEMY: 1 << 1,       // 2
    PROJECTILE: 1 << 2,  // 4
    ITEM: 1 << 3,        // 8
    WALL: 1 << 4,        // 16
    TRIGGER: 1 << 5,     // 32
    ALL: 0xFFFF          // All layers
};

// Collision matrix - defines which layers can collide with each other
const COLLISION_MATRIX = {
    [COLLISION_LAYER.PLAYER]: COLLISION_LAYER.ENEMY | COLLISION_LAYER.ITEM | COLLISION_LAYER.WALL | COLLISION_LAYER.TRIGGER,
    [COLLISION_LAYER.ENEMY]: COLLISION_LAYER.PLAYER | COLLISION_LAYER.PROJECTILE | COLLISION_LAYER.WALL,
    [COLLISION_LAYER.PROJECTILE]: COLLISION_LAYER.ENEMY | COLLISION_LAYER.WALL,
    [COLLISION_LAYER.ITEM]: COLLISION_LAYER.PLAYER,
    [COLLISION_LAYER.WALL]: COLLISION_LAYER.PLAYER | COLLISION_LAYER.ENEMY | COLLISION_LAYER.PROJECTILE,
    [COLLISION_LAYER.TRIGGER]: COLLISION_LAYER.PLAYER,
};

// Check if two collision layers should collide
function canCollide(layer1, layer2) {
    const mask1 = COLLISION_MATRIX[layer1] || 0;
    return (mask1 & layer2) !== 0;
}

// ===== UTILITY FUNCTIONS =====
const Utils = {
    // Distance between two points
    distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    },
    
    // Angle between two points
    angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },
    
    // Lerp (linear interpolation)
    lerp(start, end, factor) {
        return start + (end - start) * factor;
    },
    
    // Clamp value between min and max
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },
    
    // Random integer between min and max (inclusive)
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // Random float between min and max
    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    // Check AABB collision (rectangle to rectangle)
    checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < x2 + w2 && x1 + w1 > x2 &&
               y1 < y2 + h2 && y1 + h1 > y2;
    },
    
    // Circle to circle collision
    circleCollision(x1, y1, r1, x2, y2, r2) {
        const dist = this.distance(x1, y1, x2, y2);
        return dist < r1 + r2;
    },
    
    // Circle to rectangle collision
    circleRectCollision(cx, cy, radius, rx, ry, rw, rh) {
        // Find the closest point on the rectangle to the circle
        const closestX = this.clamp(cx, rx, rx + rw);
        const closestY = this.clamp(cy, ry, ry + rh);
        
        // Calculate distance between circle center and closest point
        const dist = this.distance(cx, cy, closestX, closestY);
        
        return dist < radius;
    },
    
    // Point in circle
    pointInCircle(px, py, cx, cy, radius) {
        return this.distance(px, py, cx, cy) < radius;
    },
    
    // Point in rectangle
    pointInRect(px, py, rx, ry, rw, rh) {
        return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
    },
    
    // Get overlap between two rectangles (for collision response)
    getRectOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
        const overlapX = Math.min(x1 + w1, x2 + w2) - Math.max(x1, x2);
        const overlapY = Math.min(y1 + h1, y2 + h2) - Math.max(y1, y2);
        
        if (overlapX > 0 && overlapY > 0) {
            return { x: overlapX, y: overlapY };
        }
        return null;
    },
    
    // Get penetration depth between two circles
    getCirclePenetration(x1, y1, r1, x2, y2, r2) {
        const dist = this.distance(x1, y1, x2, y2);
        const minDist = r1 + r2;
        
        if (dist < minDist) {
            return minDist - dist; // Penetration depth
        }
        return 0;
    },
    
    // Push two circles apart (collision response)
    pushCirclesApart(obj1, obj2, penetration) {
        // Calculate direction from obj2 to obj1
        const angle = this.angle(obj2.x, obj2.y, obj1.x, obj1.y);
        const pushDist = penetration / 2;
        
        // Push both objects apart equally
        obj1.x += Math.cos(angle) * pushDist;
        obj1.y += Math.sin(angle) * pushDist;
        obj2.x -= Math.cos(angle) * pushDist;
        obj2.y -= Math.sin(angle) * pushDist;
    },
    
    // Grid to world coordinates
    gridToWorld(gridX, gridY) {
        return {
            x: gridX * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
            y: gridY * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2
        };
    },
    
    // World to grid coordinates
    worldToGrid(worldX, worldY) {
        return {
            x: Math.floor(worldX / CONFIG.TILE_SIZE),
            y: Math.floor(worldY / CONFIG.TILE_SIZE)
        };
    }
};

// ===== COLLISION DEBUGGER (Commit 6) =====
class CollisionDebugger {
    static drawCircle(ctx, x, y, radius, color = CONFIG.DEBUG.COLLISION_COLOR) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Draw center point
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    static drawRect(ctx, x, y, width, height, color = CONFIG.DEBUG.COLLISION_COLOR) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        
        // Draw center point
        ctx.fillStyle = color;
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    static drawLine(ctx, x1, y1, x2, y2, color = CONFIG.DEBUG.COLLISION_COLOR) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
    
    static drawPoint(ctx, x, y, color = CONFIG.DEBUG.COLLISION_COLOR) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    static drawText(ctx, text, x, y, color = CONFIG.DEBUG.COLLISION_COLOR) {
        ctx.fillStyle = color;
        ctx.font = '12px monospace';
        ctx.fillText(text, x, y);
    }
}

// ===== INPUT MANAGER =====
class InputManager {
    constructor() {
        this.keys = {};
        this.prevKeys = {}; // Track previous frame keys for press detection
        this.mouse = {
            x: 0,
            y: 0,
            worldX: 0,
            worldY: 0,
            isDown: false,
            button: -1,
            wasDown: false, // Track previous frame
            justPressed: false,
            rightJustPressed: false, // For right-click
        };
        
        this.setupListeners();
    }
    
    setupListeners() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            this.keys[e.code] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
            this.keys[e.code] = false;
        });
        
        // Mouse
        const canvas = document.getElementById('gameCanvas');
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            this.mouse.x = (e.clientX - rect.left) * scaleX;
            this.mouse.y = (e.clientY - rect.top) * scaleY;
        });
        
        canvas.addEventListener('mousedown', (e) => {
            this.mouse.isDown = true;
            this.mouse.button = e.button;
            
            if (e.button === 2) {
                this.mouse.rightJustPressed = true;
                e.preventDefault();
            }
        });
        
        canvas.addEventListener('mouseup', (e) => {
            this.mouse.isDown = false;
            this.mouse.button = -1;
        });
        
        canvas.addEventListener('mouseleave', () => {
            this.mouse.isDown = false;
        });
        
        // Prevent context menu on right-click
        canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    isKeyDown(key) {
        return this.keys[key.toLowerCase()] || this.keys[key];
    }
    
    // Check if key was just pressed this frame
    isKeyPressed(key) {
        const k = key.toLowerCase();
        return (this.keys[k] || this.keys[key]) && !(this.prevKeys[k] || this.prevKeys[key]);
    }
    
    isMouseDown(button = 0) {
        return this.mouse.isDown && this.mouse.button === button;
    }
    
    updateMouseWorld(camera) {
        this.mouse.worldX = this.mouse.x + camera.x;
        this.mouse.worldY = this.mouse.y + camera.y;
    }
    
    // Update input state (call at start of frame)
    update() {
        // Copy current keys to previous
        this.prevKeys = { ...this.keys };
        
        // Update mouse just pressed state
        this.mouse.justPressed = this.mouse.isDown && !this.mouse.wasDown;
        this.mouse.wasDown = this.mouse.isDown;
        
        // Reset right-click just pressed after frame
        if (this.mouse.rightJustPressed) {
            this.mouse.rightJustPressed = false;
        }
    }
}

// ===== CAMERA =====
class Camera {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
    }
    
    follow(targetX, targetY, deltaTime) {
        // Smooth camera follow
        const smoothSpeed = CONFIG.CAMERA.SMOOTH_SPEED * deltaTime;
        this.targetX = targetX - CONFIG.CANVAS_WIDTH / 2;
        this.targetY = targetY - CONFIG.CANVAS_HEIGHT / 2;
        
        this.x = Utils.lerp(this.x, this.targetX, smoothSpeed);
        this.y = Utils.lerp(this.y, this.targetY, smoothSpeed);
    }
    
    apply(ctx) {
        ctx.translate(-this.x, -this.y);
    }
    
    reset(ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}

// ===== GAME STATISTICS =====
class GameStats {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.enemiesKilled = 0;
        this.goldCollected = 0;
        this.floorsCleared = 0;
        this.timePlayed = 0;
        this.damageDealt = 0;
        this.damageTaken = 0;
        this.itemsCollected = 0;
    }
    
    update(deltaTime) {
        this.timePlayed += deltaTime;
    }
}

// ===== DUNGEON SYSTEM (Commit 5) =====

// Tile types
const TILE_TYPE = {
    FLOOR: 0,
    WALL: 1,
    DOOR: 2,
};

// Room types
const ROOM_TYPE = {
    START: 'start',
    NORMAL: 'normal',
    TREASURE: 'treasure',
    BOSS: 'boss',
};

// Tile class - represents a single tile in the dungeon
class Tile {
    constructor(x, y, type) {
        this.x = x; // Grid x position
        this.y = y; // Grid y position
        this.type = type; // TILE_TYPE
        this.worldX = x * CONFIG.TILE_SIZE; // World position
        this.worldY = y * CONFIG.TILE_SIZE;
    }
    
    isWalkable() {
        return this.type === TILE_TYPE.FLOOR || this.type === TILE_TYPE.DOOR;
    }
    
    isSolid() {
        return this.type === TILE_TYPE.WALL;
    }
    
    getColor() {
        switch (this.type) {
            case TILE_TYPE.FLOOR: return CONFIG.COLORS.FLOOR;
            case TILE_TYPE.WALL: return CONFIG.COLORS.WALL;
            case TILE_TYPE.DOOR: return '#8b4513'; // Brown for doors
            default: return CONFIG.COLORS.BACKGROUND;
        }
    }
}

// Room class - represents a rectangular room
class Room {
    constructor(x, y, width, height, type = ROOM_TYPE.NORMAL) {
        this.x = x; // Grid position
        this.y = y;
        this.width = width; // In tiles
        this.height = height;
        this.type = type;
        this.tiles = [];
        this.doors = []; // Array of door positions {x, y, direction}
        
        this.generateTiles();
    }
    
    generateTiles() {
        // Create tiles for the room
        for (let y = this.y; y < this.y + this.height; y++) {
            for (let x = this.x; x < this.x + this.width; x++) {
                // Walls on the edges
                if (x === this.x || x === this.x + this.width - 1 || 
                    y === this.y || y === this.y + this.height - 1) {
                    this.tiles.push(new Tile(x, y, TILE_TYPE.WALL));
                } else {
                    // Floor in the middle
                    this.tiles.push(new Tile(x, y, TILE_TYPE.FLOOR));
                }
            }
        }
    }
    
    // Add a door at a specific position
    addDoor(x, y, direction) {
        const tile = this.getTileAt(x, y);
        if (tile && tile.type === TILE_TYPE.WALL) {
            tile.type = TILE_TYPE.DOOR;
            this.doors.push({ x, y, direction });
        }
    }
    
    getTileAt(x, y) {
        return this.tiles.find(t => t.x === x && t.y === y);
    }
    
    getCenterWorld() {
        const centerX = (this.x + this.width / 2) * CONFIG.TILE_SIZE;
        const centerY = (this.y + this.height / 2) * CONFIG.TILE_SIZE;
        return { x: centerX, y: centerY };
    }
    
    containsPoint(worldX, worldY) {
        const minX = this.x * CONFIG.TILE_SIZE;
        const minY = this.y * CONFIG.TILE_SIZE;
        const maxX = (this.x + this.width) * CONFIG.TILE_SIZE;
        const maxY = (this.y + this.height) * CONFIG.TILE_SIZE;
        return worldX >= minX && worldX < maxX && worldY >= minY && worldY < maxY;
    }
}

// Dungeon class - manages the entire dungeon
class Dungeon {
    constructor(floor = 1) {
        this.floor = floor;
        this.rooms = [];
        this.tiles = new Map(); // Map of "x,y" -> Tile for quick lookup
        this.startRoom = null;
        this.currentRoom = null;
        
        this.generate();
    }
    
    generate() {
        console.log(`🏰 Generating dungeon for Floor ${this.floor}...`);
        
        // For Commit 5, we'll create a simple 3-room dungeon
        // Start room (left)
        const startRoom = new Room(2, 5, 8, 7, ROOM_TYPE.START);
        
        // Normal room (center)
        const normalRoom = new Room(12, 4, 10, 9, ROOM_TYPE.NORMAL);
        
        // Boss room (right)
        const bossRoom = new Room(24, 5, 8, 7, ROOM_TYPE.BOSS);
        
        // Add doors connecting rooms
        // Door from start room to normal room (right side of start room)
        startRoom.addDoor(9, 8, 'east');
        normalRoom.addDoor(12, 8, 'west');
        
        // Door from normal room to boss room
        normalRoom.addDoor(21, 8, 'east');
        bossRoom.addDoor(24, 8, 'west');
        
        // Add rooms to dungeon
        this.rooms.push(startRoom, normalRoom, bossRoom);
        this.startRoom = startRoom;
        this.currentRoom = startRoom;
        
        // Build tile map for collision detection
        this.buildTileMap();
        
        // Spawn enemies (Commit 7)
        this.spawnEnemies();
        
        console.log(`✓ Dungeon generated with ${this.rooms.length} rooms`);
    }
    
    buildTileMap() {
        // Create a map of all tiles for quick collision lookup
        this.tiles.clear();
        
        for (const room of this.rooms) {
            for (const tile of room.tiles) {
                const key = `${tile.x},${tile.y}`;
                this.tiles.set(key, tile);
            }
        }
    }
    
    spawnEnemies() {
        // Spawn enemies in rooms (Commit 7)
        const enemies = [];
        
        // Normal room: spawn 2-3 slimes
        const normalRoom = this.rooms[1]; // Center room
        const slimeCount = Utils.randomInt(2, 3);
        for (let i = 0; i < slimeCount; i++) {
            const spawnPos = this.getRandomFloorPosition(normalRoom);
            if (spawnPos) {
                enemies.push(new Enemy(spawnPos.x, spawnPos.y, ENEMY_TYPE.SLIME));
            }
        }
        
        // Normal room: spawn 1-2 goblins
        const goblinCount = Utils.randomInt(1, 2);
        for (let i = 0; i < goblinCount; i++) {
            const spawnPos = this.getRandomFloorPosition(normalRoom);
            if (spawnPos) {
                enemies.push(new Enemy(spawnPos.x, spawnPos.y, ENEMY_TYPE.GOBLIN));
            }
        }
        
        // Boss room: spawn 1 skeleton (mini-boss for now)
        const bossRoom = this.rooms[2]; // Right room
        const bossPos = this.getRandomFloorPosition(bossRoom);
        if (bossPos) {
            enemies.push(new Enemy(bossPos.x, bossPos.y, ENEMY_TYPE.SKELETON));
        }
        
        console.log(`✓ Spawned ${enemies.length} enemies`);
        
        return enemies;
    }
    
    getRandomFloorPosition(room) {
        // Get a random floor tile position in the room
        // Try up to 10 times to find a valid floor tile
        for (let attempt = 0; attempt < 10; attempt++) {
            const gridX = Utils.randomInt(room.x + 1, room.x + room.width - 2);
            const gridY = Utils.randomInt(room.y + 1, room.y + room.height - 2);
            
            const tile = this.getTileAt(gridX, gridY);
            if (tile && tile.type === TILE_TYPE.FLOOR) {
                // Convert grid to world coordinates (center of tile)
                return {
                    x: gridX * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
                    y: gridY * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2
                };
            }
        }
        
        return null; // Failed to find position
    }
    
    getTileAt(gridX, gridY) {
        const key = `${gridX},${gridY}`;
        return this.tiles.get(key);
    }
    
    getTileAtWorld(worldX, worldY) {
        const gridX = Math.floor(worldX / CONFIG.TILE_SIZE);
        const gridY = Math.floor(worldY / CONFIG.TILE_SIZE);
        return this.getTileAt(gridX, gridY);
    }
    
    isWalkable(worldX, worldY) {
        const tile = this.getTileAtWorld(worldX, worldY);
        return tile ? tile.isWalkable() : false;
    }
    
    isSolid(worldX, worldY) {
        const tile = this.getTileAtWorld(worldX, worldY);
        return tile ? tile.isSolid() : true; // Default to solid if no tile
    }
    
    // Check circle collision with dungeon walls
    checkCircleCollision(x, y, radius) {
        // Check the 4 cardinal points and corners of the circle
        const points = [
            { x: x, y: y - radius }, // Top
            { x: x, y: y + radius }, // Bottom
            { x: x - radius, y: y }, // Left
            { x: x + radius, y: y }, // Right
            { x: x - radius * 0.707, y: y - radius * 0.707 }, // Top-left
            { x: x + radius * 0.707, y: y - radius * 0.707 }, // Top-right
            { x: x - radius * 0.707, y: y + radius * 0.707 }, // Bottom-left
            { x: x + radius * 0.707, y: y + radius * 0.707 }, // Bottom-right
        ];
        
        // If any point is in a solid tile, there's a collision
        for (const point of points) {
            if (this.isSolid(point.x, point.y)) {
                return true;
            }
        }
        
        return false;
    }
    
    getRoomAt(worldX, worldY) {
        return this.rooms.find(room => room.containsPoint(worldX, worldY));
    }
    
    render(ctx) {
        // Render all tiles in all rooms
        for (const room of this.rooms) {
            for (const tile of room.tiles) {
                ctx.fillStyle = tile.getColor();
                ctx.fillRect(
                    tile.worldX,
                    tile.worldY,
                    CONFIG.TILE_SIZE,
                    CONFIG.TILE_SIZE
                );
                
                // Draw subtle borders on walls for depth
                if (tile.type === TILE_TYPE.WALL) {
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(
                        tile.worldX,
                        tile.worldY,
                        CONFIG.TILE_SIZE,
                        CONFIG.TILE_SIZE
                    );
                }
                
                // Draw door highlight
                if (tile.type === TILE_TYPE.DOOR) {
                    ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(
                        tile.worldX + 2,
                        tile.worldY + 2,
                        CONFIG.TILE_SIZE - 4,
                        CONFIG.TILE_SIZE - 4
                    );
                }
            }
        }
    }
}

// ===== ENEMY SYSTEM (Commit 7) =====

// Enemy types
const ENEMY_TYPE = {
    SLIME: 'slime',
    SKELETON: 'skeleton',
    GOBLIN: 'goblin',
};

// Enemy configurations
const ENEMY_CONFIG = {
    [ENEMY_TYPE.SLIME]: {
        name: 'Slime',
        maxHealth: 30,
        attack: 5,
        defense: 0,
        speed: 80,
        size: 12,
        color: '#4aff4a',
        xpValue: 10,
        goldValue: 5,
    },
    [ENEMY_TYPE.SKELETON]: {
        name: 'Skeleton',
        maxHealth: 50,
        attack: 8,
        defense: 3,
        speed: 100,
        size: 14,
        color: '#cccccc',
        xpValue: 20,
        goldValue: 15,
    },
    [ENEMY_TYPE.GOBLIN]: {
        name: 'Goblin',
        maxHealth: 40,
        attack: 12,
        defense: 2,
        speed: 120,
        size: 13,
        color: '#88ff44',
        xpValue: 15,
        goldValue: 10,
    },
};

// Base Enemy class
class Enemy {
    constructor(x, y, type) {
        this.type = type;
        const config = ENEMY_CONFIG[type];
        
        // Position
        this.x = x;
        this.y = y;
        
        // Velocity
        this.vx = 0;
        this.vy = 0;
        
        // Stats
        this.maxHealth = config.maxHealth;
        this.health = this.maxHealth;
        this.attack = config.attack;
        this.defense = config.defense;
        this.speed = config.speed;
        this.xpValue = config.xpValue;
        this.goldValue = config.goldValue;
        
        // Display
        this.size = config.size;
        this.color = config.color;
        this.name = config.name;
        
        // State
        this.isDead = false;
        this.direction = 0; // Angle in radians
        this.isMoving = false;
        
        // AI behavior
        this.aggroRange = 200; // Distance at which enemy notices player
        this.attackRange = 30; // Distance for melee attack
        this.hasAggro = false;
        this.updateTimer = 0;
        
        // Combat (Commit 8)
        this.attackCooldown = 1.0; // Seconds between attacks
        this.lastAttackTime = -999;
        this.isAttacking = false;
        this.attackTimer = 0;
        this.attackDuration = 0.3;
        
        // Knockback (Commit 8)
        this.knockbackVx = 0;
        this.knockbackVy = 0;
        this.knockbackTimer = 0;
        
        // Animation
        this.animationState = 'idle'; // idle, walk, attack, death
        this.animationTimer = 0;
        
        // Collision (Commit 6)
        this.collisionLayer = COLLISION_LAYER.ENEMY;
        this.collisionMask = COLLISION_MATRIX[COLLISION_LAYER.ENEMY];
    }
    
    update(deltaTime, player, dungeon, currentTime) {
        if (this.isDead) return;
        
        // Check death
        if (this.health <= 0 && !this.isDead) {
            this.die();
            return;
        }
        
        // Update attack animation
        if (this.isAttacking) {
            this.attackTimer += deltaTime;
            if (this.attackTimer >= this.attackDuration) {
                this.isAttacking = false;
                this.attackTimer = 0;
            }
        }
        
        // Update knockback
        if (this.knockbackTimer > 0) {
            this.knockbackTimer -= deltaTime;
            if (this.knockbackTimer <= 0) {
                this.knockbackVx = 0;
                this.knockbackVy = 0;
            }
        }
        
        // Update AI
        this.updateAI(deltaTime, player, dungeon, currentTime);
        
        // Update animation timer
        this.animationTimer += deltaTime;
        this.updateTimer += deltaTime;
    }
    
    updateAI(deltaTime, player, dungeon, currentTime) {
        if (!player || player.isDead) {
            this.isMoving = false;
            this.animationState = 'idle';
            this.vx = 0;
            this.vy = 0;
            return;
        }
        
        // Check if player is in aggro range
        const distToPlayer = Utils.distance(this.x, this.y, player.x, player.y);
        
        if (distToPlayer <= this.aggroRange) {
            this.hasAggro = true;
        }
        
        if (this.hasAggro) {
            // Move toward player if not in attack range
            if (distToPlayer > this.attackRange) {
                this.moveToward(player.x, player.y, deltaTime, dungeon);
                this.animationState = 'walk';
                this.isMoving = true;
            } else {
                // In attack range - stop and attack (Commit 8)
                this.vx = 0;
                this.vy = 0;
                this.isMoving = false;
                
                // Try to attack
                if (!this.isAttacking) {
                    this.attack(currentTime, player);
                }
            }
            
            // Update direction to face player
            this.direction = Utils.angle(this.x, this.y, player.x, player.y);
        } else {
            // Idle behavior - no aggro
            this.vx = 0;
            this.vy = 0;
            this.isMoving = false;
            this.animationState = 'idle';
        }
    }
    
    moveToward(targetX, targetY, deltaTime, dungeon) {
        // Calculate direction to target
        const angle = Utils.angle(this.x, this.y, targetX, targetY);
        
        // Calculate movement
        const moveX = Math.cos(angle);
        const moveY = Math.sin(angle);
        
        // Update velocity
        this.vx = moveX * this.speed;
        this.vy = moveY * this.speed;
        
        // Calculate new position
        const newX = this.x + this.vx * deltaTime;
        const newY = this.y + this.vy * deltaTime;
        
        // Collision detection with dungeon walls
        if (dungeon) {
            // Check if new position collides with walls
            if (!dungeon.checkCircleCollision(newX, this.y, this.size)) {
                this.x = newX; // Move horizontally if no collision
            }
            if (!dungeon.checkCircleCollision(this.x, newY, this.size)) {
                this.y = newY; // Move vertically if no collision
            }
        } else {
            // Fallback
            this.x = newX;
            this.y = newY;
        }
    }
    
    render(ctx) {
        // Draw enemy body (circle)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw enemy border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw direction indicator
        const indicatorDist = this.size - 3;
        const indicatorX = this.x + Math.cos(this.direction) * indicatorDist;
        const indicatorY = this.y + Math.sin(this.direction) * indicatorDist;
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(indicatorX, indicatorY, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw attack animation (Commit 8)
        if (this.isAttacking) {
            const progress = this.attackTimer / this.attackDuration;
            const attackReach = this.attackRange * Math.sin(progress * Math.PI);
            const weaponX = this.x + Math.cos(this.direction) * attackReach;
            const weaponY = this.y + Math.sin(this.direction) * attackReach;
            
            // Draw attack indicator
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, attackReach, this.direction - 0.4, this.direction + 0.4);
            ctx.stroke();
            
            // Draw attack effect
            ctx.fillStyle = 'rgba(255, 74, 74, 0.5)';
            ctx.beginPath();
            ctx.arc(weaponX, weaponY, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw health bar below enemy
        this.drawHealthBar(ctx);
        
        // Debug: Draw collision circle (Commit 6)
        if (CONFIG.DEBUG.SHOW_COLLISION) {
            CollisionDebugger.drawCircle(ctx, this.x, this.y, this.size, 'rgba(255, 0, 0, 0.6)');
            CollisionDebugger.drawText(ctx, this.name.toUpperCase(), this.x + this.size + 5, this.y, 'red');
            
            // Draw aggro range
            if (this.hasAggro) {
                CollisionDebugger.drawCircle(ctx, this.x, this.y, this.aggroRange, 'rgba(255, 100, 0, 0.2)');
            }
        }
    }
    
    drawHealthBar(ctx) {
        const barWidth = this.size * 2;
        const barHeight = 4;
        const barX = this.x - barWidth / 2;
        const barY = this.y + this.size + 5;
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health
        const healthPercent = this.health / this.maxHealth;
        const healthWidth = barWidth * healthPercent;
        
        // Color based on health percentage
        if (healthPercent > 0.6) {
            ctx.fillStyle = '#4aff4a'; // Green
        } else if (healthPercent > 0.3) {
            ctx.fillStyle = '#ffd700'; // Yellow
        } else {
            ctx.fillStyle = '#ff4a4a'; // Red
        }
        
        ctx.fillRect(barX, barY, healthWidth, barHeight);
        
        // Border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
    
    takeDamage(amount, attackerX, attackerY) {
        const finalDamage = Math.max(1, amount - this.defense);
        this.health -= finalDamage;
        this.health = Math.max(0, this.health);
        
        console.log(`💥 ${this.name} took ${finalDamage} damage (${this.health}/${this.maxHealth} HP)`);
        
        // Apply knockback (Commit 8)
        if (attackerX !== undefined && attackerY !== undefined) {
            const angle = Math.atan2(this.y - attackerY, this.x - attackerX);
            this.knockbackVx = Math.cos(angle) * CONFIG.COMBAT.KNOCKBACK_FORCE;
            this.knockbackVy = Math.sin(angle) * CONFIG.COMBAT.KNOCKBACK_FORCE;
            this.knockbackTimer = CONFIG.COMBAT.KNOCKBACK_DURATION;
            
            // Apply knockback movement
            const knockbackX = this.x + this.knockbackVx * 0.02;
            const knockbackY = this.y + this.knockbackVy * 0.02;
            
            // Don't go through walls
            // (Handled in update loop)
            this.x = knockbackX;
            this.y = knockbackY;
        }
        
        return finalDamage;
    }
    
    // Attack method (Commit 8)
    attack(currentTime, player) {
        // Check cooldown
        if (currentTime - this.lastAttackTime < this.attackCooldown) {
            return false; // Still on cooldown
        }
        
        // Start attack animation
        this.isAttacking = true;
        this.attackTimer = 0;
        this.lastAttackTime = currentTime;
        this.animationState = 'attack';
        
        // Calculate damage
        let damage = this.attack;
        
        // Damage variance
        const variance = CONFIG.COMBAT.DAMAGE_VARIANCE;
        damage *= Utils.randomFloat(1 - variance, 1 + variance);
        damage = Math.floor(damage);
        
        // Apply damage to player
        player.takeDamage(damage, this.x, this.y);
        
        console.log(`🗡️ ${this.name} attacked player for ${damage} damage!`);
        
        return true; // Attack executed
    }
    
    die() {
        this.isDead = true;
        this.animationState = 'death';
        console.log(`☠️ ${this.name} has died!`);
    }
}

// ===== LOOT AND ITEM SYSTEM (Commit 9) =====

// Item types
const ITEM_TYPE = {
    GOLD: 'gold',
    HEALTH_POTION: 'health_potion',
    WEAPON: 'weapon',
    ARMOR: 'armor',
};

// Item configurations
const ITEM_CONFIG = {
    [ITEM_TYPE.GOLD]: {
        name: 'Gold Coin',
        description: 'Shiny gold coin',
        color: '#ffd700',
        size: 8,
        stackable: true,
        autoPickup: true,
        value: 0, // Set per instance
    },
    [ITEM_TYPE.HEALTH_POTION]: {
        name: 'Health Potion',
        description: 'Restores 30 HP',
        color: '#ff4a4a',
        size: 10,
        stackable: true,
        autoPickup: true,
        healAmount: 30,
    },
    [ITEM_TYPE.WEAPON]: {
        name: 'Sword',
        description: 'Increases attack',
        color: '#4a9eff',
        size: 12,
        stackable: false,
        autoPickup: false,
        attackBonus: 5,
    },
    [ITEM_TYPE.ARMOR]: {
        name: 'Shield',
        description: 'Increases defense',
        color: '#9e9e9e',
        size: 12,
        stackable: false,
        autoPickup: false,
        defenseBonus: 3,
    },
};

// Loot tables for enemy drops
const LOOT_TABLE = {
    [ENEMY_TYPE.SLIME]: [
        { type: ITEM_TYPE.GOLD, chance: 0.8, amountMin: 3, amountMax: 8 },
        { type: ITEM_TYPE.HEALTH_POTION, chance: 0.2, amount: 1 },
    ],
    [ENEMY_TYPE.SKELETON]: [
        { type: ITEM_TYPE.GOLD, chance: 1.0, amountMin: 10, amountMax: 20 },
        { type: ITEM_TYPE.HEALTH_POTION, chance: 0.5, amount: 1 },
        { type: ITEM_TYPE.WEAPON, chance: 0.3, amount: 1 },
    ],
    [ENEMY_TYPE.GOBLIN]: [
        { type: ITEM_TYPE.GOLD, chance: 0.9, amountMin: 5, amountMax: 12 },
        { type: ITEM_TYPE.ARMOR, chance: 0.2, amount: 1 },
    ],
};

// Item class
class Item {
    constructor(x, y, type, value = null) {
        this.type = type;
        const config = ITEM_CONFIG[type];
        
        // Position
        this.x = x;
        this.y = y;
        
        // Properties from config
        this.name = config.name;
        this.description = config.description;
        this.color = config.color;
        this.size = config.size;
        this.stackable = config.stackable;
        this.autoPickup = config.autoPickup;
        
        // Type-specific properties
        this.value = value !== null ? value : (config.value || 0);
        this.healAmount = config.healAmount || 0;
        this.attackBonus = config.attackBonus || 0;
        this.defenseBonus = config.defenseBonus || 0;
        
        // State
        this.isDead = false; // For removal from world
        this.pickupRange = 30; // Range at which player can pickup
        
        // Animation
        this.animationTimer = Math.random() * Math.PI * 2; // Random start for variety
        this.bobHeight = 0;
        
        // Collision (Commit 6)
        this.collisionLayer = COLLISION_LAYER.ITEM;
        this.collisionMask = COLLISION_MATRIX[COLLISION_LAYER.ITEM];
    }
    
    update(deltaTime) {
        // Bob animation (floating effect)
        this.animationTimer += deltaTime * 3;
        this.bobHeight = Math.sin(this.animationTimer) * 3; // Bob up and down 3px
    }
    
    render(ctx) {
        // Draw item with bob animation
        const renderY = this.y + this.bobHeight;
        
        // Draw glow effect (pulsing)
        const glowSize = this.size + Math.sin(this.animationTimer * 2) * 2;
        ctx.fillStyle = this.color + '40'; // Semi-transparent glow
        ctx.beginPath();
        ctx.arc(this.x, renderY, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw item body
        if (this.type === ITEM_TYPE.GOLD) {
            // Gold coin - draw as circle with shine
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, renderY, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Shine effect
            ctx.fillStyle = '#ffff99';
            ctx.beginPath();
            ctx.arc(this.x - 2, renderY - 2, this.size * 0.3, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === ITEM_TYPE.HEALTH_POTION) {
            // Health potion - draw as bottle shape
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x - this.size/2, renderY - this.size/2, this.size, this.size * 1.2);
            
            // Bottle top
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(this.x - this.size/4, renderY - this.size/2 - 3, this.size/2, 3);
        } else if (this.type === ITEM_TYPE.WEAPON) {
            // Weapon - draw as sword
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(this.x - this.size/2, renderY + this.size/2);
            ctx.lineTo(this.x + this.size/2, renderY - this.size/2);
            ctx.stroke();
            
            // Crossguard
            ctx.beginPath();
            ctx.moveTo(this.x - this.size/4, renderY);
            ctx.lineTo(this.x + this.size/4, renderY);
            ctx.stroke();
        } else if (this.type === ITEM_TYPE.ARMOR) {
            // Armor - draw as shield
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, renderY, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Shield detail
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, renderY, this.size * 0.6, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Draw pickup range indicator when debug mode is on
        if (CONFIG.DEBUG.SHOW_COLLISION) {
            CollisionDebugger.drawCircle(ctx, this.x, this.y, this.pickupRange, 'rgba(255, 215, 0, 0.2)');
            CollisionDebugger.drawText(ctx, this.name.toUpperCase(), this.x + this.size + 5, this.y, 'gold');
        }
    }
    
    // Check if player can pick up this item
    canPickup(player) {
        const dist = Utils.distance(this.x, this.y, player.x, player.y);
        return dist <= this.pickupRange;
    }
    
    // Apply item effect to player
    pickup(player, isManualPickup = false) {
        let message = '';
        let shouldRemove = true;
        
        // Check if item needs manual pickup
        if (!this.autoPickup && !isManualPickup) {
            return null; // Don't pick up automatically
        }
        
        switch (this.type) {
            case ITEM_TYPE.GOLD:
                player.addGold(this.value);
                message = `💰 +${this.value} gold`;
                break;
            
            case ITEM_TYPE.HEALTH_POTION:
                // Auto-pickup potions go to inventory
                if (player.inventory.addItem(this)) {
                    message = `💚 Picked up ${this.name}`;
                } else {
                    message = `❌ Inventory full!`;
                    shouldRemove = false;
                }
                break;
            
            case ITEM_TYPE.WEAPON:
            case ITEM_TYPE.ARMOR:
                // Equipment goes to inventory
                if (player.inventory.addItem(this)) {
                    message = `📦 Picked up ${this.name}`;
                } else {
                    message = `❌ Inventory full!`;
                    shouldRemove = false;
                }
                break;
        }
        
        console.log(message);
        if (shouldRemove) {
            this.isDead = true; // Mark for removal
        }
        
        return message;
    }
}

// Loot generation utility
class LootGenerator {
    static generateLoot(enemyType, x, y) {
        const drops = [];
        const lootTable = LOOT_TABLE[enemyType];
        
        if (!lootTable) return drops;
        
        for (const entry of lootTable) {
            // Check drop chance
            if (Math.random() <= entry.chance) {
                const amount = entry.amount || Utils.randomInt(entry.amountMin, entry.amountMax);
                
                // Create item(s)
                for (let i = 0; i < amount; i++) {
                    // Scatter items around drop position
                    const offsetX = Utils.randomFloat(-20, 20);
                    const offsetY = Utils.randomFloat(-20, 20);
                    
                    let value = null;
                    if (entry.type === ITEM_TYPE.GOLD) {
                        value = 1; // Each gold coin is worth 1
                    }
                    
                    const item = new Item(x + offsetX, y + offsetY, entry.type, value);
                    drops.push(item);
                }
            }
        }
        
        console.log(`💎 Generated ${drops.length} loot items at (${Math.floor(x)}, ${Math.floor(y)})`);
        return drops;
    }
}

// ===== INVENTORY SYSTEM (Commit 10) =====
class Inventory {
    constructor(maxSlots = CONFIG.INVENTORY.MAX_SLOTS) {
        this.maxSlots = maxSlots;
        this.items = []; // Array of items
        this.isOpen = false; // Inventory UI state
        this.selectedSlot = -1; // Currently selected slot
        this.hoveredSlot = -1; // Currently hovered slot
    }
    
    // Add item to inventory
    addItem(item) {
        // Check if item is stackable and already exists
        if (item.stackable) {
            const existingItem = this.items.find(i => i.type === item.type);
            if (existingItem) {
                // Stack items (for future use with quantity system)
                existingItem.quantity = (existingItem.quantity || 1) + (item.quantity || 1);
                console.log(`📦 Stacked ${item.name} (Total: ${existingItem.quantity})`);
                return true;
            }
        }
        
        // Check if inventory is full
        if (this.items.length >= this.maxSlots) {
            console.log(`❌ Inventory full! Cannot pick up ${item.name}`);
            return false;
        }
        
        // Add new item
        item.quantity = item.quantity || 1;
        this.items.push(item);
        console.log(`✅ Added ${item.name} to inventory (${this.items.length}/${this.maxSlots})`);
        return true;
    }
    
    // Remove item from inventory
    removeItem(index) {
        if (index >= 0 && index < this.items.length) {
            const removed = this.items.splice(index, 1)[0];
            console.log(`🗑️ Removed ${removed.name} from inventory`);
            return removed;
        }
        return null;
    }
    
    // Use item from inventory
    useItem(index, player) {
        if (index < 0 || index >= this.items.length) return null;
        
        const item = this.items[index];
        let message = '';
        let shouldRemove = true;
        
        switch (item.type) {
            case ITEM_TYPE.HEALTH_POTION:
                const healed = player.heal(item.healAmount);
                message = `💚 Healed ${healed} HP`;
                break;
            
            case ITEM_TYPE.WEAPON:
                player.attack += item.attackBonus;
                message = `⚔️ +${item.attackBonus} ATK (${item.name})`;
                break;
            
            case ITEM_TYPE.ARMOR:
                player.defense += item.defenseBonus;
                message = `🛡️ +${item.defenseBonus} DEF (${item.name})`;
                break;
            
            default:
                shouldRemove = false;
                message = `Cannot use ${item.name}`;
        }
        
        if (shouldRemove) {
            this.removeItem(index);
        }
        
        console.log(message);
        return message;
    }
    
    // Drop item from inventory to world
    dropItem(index, worldX, worldY) {
        const item = this.removeItem(index);
        if (item) {
            // Create a new world item at player position
            const droppedItem = new Item(worldX, worldY, item.type, item);
            console.log(`📤 Dropped ${item.name} at (${Math.floor(worldX)}, ${Math.floor(worldY)})`);
            return droppedItem;
        }
        return null;
    }
    
    // Get item at slot
    getItem(index) {
        return this.items[index] || null;
    }
    
    // Check if inventory is full
    isFull() {
        return this.items.length >= this.maxSlots;
    }
    
    // Get number of items
    getCount() {
        return this.items.length;
    }
    
    // Toggle inventory UI
    toggle() {
        this.isOpen = !this.isOpen;
        console.log(`📦 Inventory ${this.isOpen ? 'opened' : 'closed'}`);
    }
    
    // Render inventory UI
    render(ctx, canvas) {
        if (!this.isOpen) return;
        
        const slotSize = CONFIG.INVENTORY.SLOT_SIZE;
        const cols = CONFIG.INVENTORY.COLS;
        const rows = Math.ceil(this.maxSlots / cols);
        const padding = 10;
        const headerHeight = 40;
        
        // Calculate panel dimensions
        const panelWidth = cols * slotSize + padding * 2;
        const panelHeight = rows * slotSize + padding * 2 + headerHeight;
        const panelX = (canvas.width - panelWidth) / 2;
        const panelY = (canvas.height - panelHeight) / 2;
        
        // Draw semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw inventory panel background
        ctx.fillStyle = 'rgba(40, 40, 40, 0.95)';
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 3;
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
        
        // Draw header
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('INVENTORY', panelX + panelWidth / 2, panelY + 28);
        
        // Draw inventory count
        ctx.font = '14px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${this.items.length}/${this.maxSlots}`, panelX + panelWidth / 2, panelY + headerHeight - 5);
        
        // Draw inventory slots
        for (let i = 0; i < this.maxSlots; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const slotX = panelX + padding + col * slotSize;
            const slotY = panelY + headerHeight + padding + row * slotSize;
            
            // Draw slot background
            ctx.fillStyle = i === this.selectedSlot ? 'rgba(255, 215, 0, 0.3)' :
                           i === this.hoveredSlot ? 'rgba(255, 255, 255, 0.2)' :
                           'rgba(60, 60, 60, 0.8)';
            ctx.fillRect(slotX, slotY, slotSize, slotSize);
            
            // Draw slot border
            ctx.strokeStyle = i === this.selectedSlot ? '#ffd700' : '#808080';
            ctx.lineWidth = i === this.selectedSlot ? 2 : 1;
            ctx.strokeRect(slotX, slotY, slotSize, slotSize);
            
            // Draw item in slot
            const item = this.items[i];
            if (item) {
                // Draw item icon (simplified)
                ctx.fillStyle = item.color;
                const centerX = slotX + slotSize / 2;
                const centerY = slotY + slotSize / 2;
                const iconSize = item.size * 1.5;
                
                // Draw based on item type
                if (item.type === ITEM_TYPE.GOLD) {
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, iconSize, 0, Math.PI * 2);
                    ctx.fill();
                } else if (item.type === ITEM_TYPE.HEALTH_POTION) {
                    ctx.fillRect(centerX - iconSize * 0.6, centerY - iconSize, iconSize * 1.2, iconSize * 2);
                    ctx.beginPath();
                    ctx.arc(centerX, centerY - iconSize, iconSize * 0.6, Math.PI, 0);
                    ctx.fill();
                } else if (item.type === ITEM_TYPE.WEAPON) {
                    ctx.save();
                    ctx.translate(centerX, centerY);
                    ctx.rotate(Math.PI / 4);
                    ctx.fillRect(-iconSize / 4, -iconSize * 1.2, iconSize / 2, iconSize * 2.4);
                    ctx.fillStyle = '#8b4513';
                    ctx.fillRect(-iconSize / 3, iconSize * 0.8, iconSize * 0.66, iconSize / 2);
                    ctx.restore();
                } else if (item.type === ITEM_TYPE.ARMOR) {
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, iconSize, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, iconSize * 0.6, 0, Math.PI * 2);
                    ctx.stroke();
                }
                
                // Draw quantity if stackable
                if (item.stackable && item.quantity > 1) {
                    ctx.font = 'bold 12px Arial';
                    ctx.fillStyle = '#ffffff';
                    ctx.strokeStyle = '#000000';
                    ctx.lineWidth = 3;
                    ctx.textAlign = 'right';
                    ctx.strokeText(item.quantity, slotX + slotSize - 5, slotY + slotSize - 5);
                    ctx.fillText(item.quantity, slotX + slotSize - 5, slotY + slotSize - 5);
                }
            }
        }
        
        // Draw instructions
        ctx.font = '14px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('Click to USE item | Right-click to DROP | Press I to close', 
                    panelX + panelWidth / 2, panelY + panelHeight + 20);
    }
    
    // Handle mouse click in inventory
    handleClick(mouseX, mouseY, canvas, player, worldItems) {
        if (!this.isOpen) return;
        
        const slotSize = CONFIG.INVENTORY.SLOT_SIZE;
        const cols = CONFIG.INVENTORY.COLS;
        const rows = Math.ceil(this.maxSlots / cols);
        const padding = 10;
        const headerHeight = 40;
        
        const panelWidth = cols * slotSize + padding * 2;
        const panelHeight = rows * slotSize + padding * 2 + headerHeight;
        const panelX = (canvas.width - panelWidth) / 2;
        const panelY = (canvas.height - panelHeight) / 2;
        
        // Check each slot
        for (let i = 0; i < this.maxSlots; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const slotX = panelX + padding + col * slotSize;
            const slotY = panelY + headerHeight + padding + row * slotSize;
            
            if (mouseX >= slotX && mouseX <= slotX + slotSize &&
                mouseY >= slotY && mouseY <= slotY + slotSize) {
                // Use item
                if (this.items[i]) {
                    this.useItem(i, player);
                }
                return true;
            }
        }
        
        return false;
    }
    
    // Handle right click in inventory
    handleRightClick(mouseX, mouseY, canvas, player, worldItems) {
        if (!this.isOpen) return;
        
        const slotSize = CONFIG.INVENTORY.SLOT_SIZE;
        const cols = CONFIG.INVENTORY.COLS;
        const rows = Math.ceil(this.maxSlots / cols);
        const padding = 10;
        const headerHeight = 40;
        
        const panelWidth = cols * slotSize + padding * 2;
        const panelHeight = rows * slotSize + padding * 2 + headerHeight;
        const panelX = (canvas.width - panelWidth) / 2;
        const panelY = (canvas.height - panelHeight) / 2;
        
        // Check each slot
        for (let i = 0; i < this.maxSlots; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const slotX = panelX + padding + col * slotSize;
            const slotY = panelY + headerHeight + padding + row * slotSize;
            
            if (mouseX >= slotX && mouseX <= slotX + slotSize &&
                mouseY >= slotY && mouseY <= slotY + slotSize) {
                // Drop item
                if (this.items[i]) {
                    const droppedItem = this.dropItem(i, player.x, player.y);
                    if (droppedItem) {
                        worldItems.push(droppedItem);
                    }
                }
                return true;
            }
        }
        
        return false;
    }
}

// ===== PLAYER =====
class Player {
    constructor(x, y) {
        // Position
        this.x = x;
        this.y = y;
        
        // Velocity
        this.vx = 0;
        this.vy = 0;
        
        // Stats
        this.maxHealth = CONFIG.PLAYER.START_HEALTH;
        this.health = this.maxHealth;
        this.attack = CONFIG.PLAYER.START_ATTACK;
        this.defense = CONFIG.PLAYER.START_DEFENSE;
        this.speed = CONFIG.PLAYER.START_SPEED;
        this.gold = CONFIG.PLAYER.START_GOLD;
        this.level = CONFIG.PLAYER.START_LEVEL;
        
        // Display
        this.size = CONFIG.PLAYER.SIZE;
        this.color = CONFIG.COLORS.PLAYER;
        
        // State
        this.isDead = false;
        this.direction = 0; // Angle in radians
        this.isMoving = false;
        
        // Combat (Commit 8)
        this.attackRange = CONFIG.PLAYER.ATTACK_RANGE;
        this.attackCooldown = CONFIG.PLAYER.ATTACK_COOLDOWN;
        this.lastAttackTime = -999; // Last time attacked (for cooldown)
        this.isAttacking = false;
        this.attackTimer = 0;
        this.attackDuration = 0.2; // Animation duration in seconds
        
        // Knockback (Commit 8)
        this.knockbackVx = 0;
        this.knockbackVy = 0;
        this.knockbackTimer = 0;
        
        // Animation
        this.animationState = 'idle'; // idle, walk, attack
        this.animationTimer = 0;
        
        // Collision (Commit 6)
        this.collisionLayer = COLLISION_LAYER.PLAYER;
        this.collisionMask = COLLISION_MATRIX[COLLISION_LAYER.PLAYER];
        
        // Inventory (Commit 10)
        this.inventory = new Inventory();
    }
    
    update(deltaTime, input, canvas) {
        // Check death
        if (this.health <= 0 && !this.isDead) {
            this.isDead = true;
            console.log('💀 Player has died!');
            return;
        }
        
        // Update attack animation (Commit 8)
        if (this.isAttacking) {
            this.attackTimer += deltaTime;
            if (this.attackTimer >= this.attackDuration) {
                this.isAttacking = false;
                this.attackTimer = 0;
            }
        }
        
        // Update knockback (Commit 8)
        if (this.knockbackTimer > 0) {
            this.knockbackTimer -= deltaTime;
            if (this.knockbackTimer <= 0) {
                this.knockbackVx = 0;
                this.knockbackVy = 0;
            }
        }
        
        // Handle movement input
        this.handleMovement(deltaTime, input, canvas);
        
        // Update animation timer
        this.animationTimer += deltaTime;
    }
    
    handleMovement(deltaTime, input, canvas) {
        // Get input direction
        let moveX = 0;
        let moveY = 0;
        
        // WASD keys
        if (input.isKeyDown('w') || input.isKeyDown('ArrowUp')) {
            moveY -= 1;
        }
        if (input.isKeyDown('s') || input.isKeyDown('ArrowDown')) {
            moveY += 1;
        }
        if (input.isKeyDown('a') || input.isKeyDown('ArrowLeft')) {
            moveX -= 1;
        }
        if (input.isKeyDown('d') || input.isKeyDown('ArrowRight')) {
            moveX += 1;
        }
        
        // Check if moving
        this.isMoving = (moveX !== 0 || moveY !== 0);
        
        // Update animation state
        if (this.isAttacking) {
            this.animationState = 'attack';
        } else if (this.isMoving) {
            this.animationState = 'walk';
        } else {
            this.animationState = 'idle';
        }
        
        // Normalize diagonal movement
        if (moveX !== 0 && moveY !== 0) {
            moveX *= 0.707; // 1/sqrt(2)
            moveY *= 0.707;
        }
        
        // Apply movement
        if (this.isMoving) {
            // Update velocity
            this.vx = moveX * this.speed;
            this.vy = moveY * this.speed;
            
            // Update direction (angle in radians)
            this.direction = Math.atan2(moveY, moveX);
            
            // Calculate new position
            let newX = this.x + this.vx * deltaTime;
            let newY = this.y + this.vy * deltaTime;
            
            // Apply knockback (Commit 8)
            if (this.knockbackTimer > 0) {
                newX += this.knockbackVx * deltaTime;
                newY += this.knockbackVy * deltaTime;
            }
            
            // Collision detection with dungeon walls (Commit 5)
            // canvas parameter is now expected to be the dungeon object
            const dungeon = canvas; // Renamed for clarity - this is the dungeon
            
            if (dungeon && dungeon.checkCircleCollision) {
                // Check if new position collides with walls
                // Test horizontal movement
                if (!dungeon.checkCircleCollision(newX, this.y, this.size)) {
                    this.x = newX; // Move horizontally if no collision
                }
                // Test vertical movement
                if (!dungeon.checkCircleCollision(this.x, newY, this.size)) {
                    this.y = newY; // Move vertically if no collision
                }
            } else {
                // Fallback: no dungeon collision (shouldn't happen in Commit 5+)
                this.x = newX;
                this.y = newY;
            }
        } else {
            // Deceleration when not moving
            this.vx = 0;
            this.vy = 0;
            
            // Still apply knockback even when not inputting movement (Commit 8)
            if (this.knockbackTimer > 0) {
                const newX = this.x + this.knockbackVx * deltaTime;
                const newY = this.y + this.knockbackVy * deltaTime;
                
                const dungeon = canvas;
                if (dungeon && dungeon.checkCircleCollision) {
                    if (!dungeon.checkCircleCollision(newX, this.y, this.size)) {
                        this.x = newX;
                    }
                    if (!dungeon.checkCircleCollision(this.x, newY, this.size)) {
                        this.y = newY;
                    }
                } else {
                    this.x = newX;
                    this.y = newY;
                }
            }
        }
    }
    
    render(ctx) {
        // Draw player body (simple circle for now)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw player border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw direction indicator (small dot showing facing direction)
        const indicatorDist = this.size - 4;
        const indicatorX = this.x + Math.cos(this.direction) * indicatorDist;
        const indicatorY = this.y + Math.sin(this.direction) * indicatorDist;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(indicatorX, indicatorY, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw attack animation (Commit 8)
        if (this.isAttacking) {
            const progress = this.attackTimer / this.attackDuration;
            const attackReach = this.attackRange * Math.sin(progress * Math.PI); // Arc motion
            const weaponX = this.x + Math.cos(this.direction) * attackReach;
            const weaponY = this.y + Math.sin(this.direction) * attackReach;
            
            // Draw attack arc
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, attackReach, this.direction - 0.5, this.direction + 0.5);
            ctx.stroke();
            
            // Draw weapon swing effect
            ctx.fillStyle = 'rgba(74, 158, 255, 0.6)';
            ctx.beginPath();
            ctx.arc(weaponX, weaponY, 6, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw health bar above player
        this.drawHealthBar(ctx);
        
        // Debug: Draw collision circle (Commit 6)
        if (CONFIG.DEBUG.SHOW_COLLISION) {
            CollisionDebugger.drawCircle(ctx, this.x, this.y, this.size, 'rgba(0, 255, 0, 0.6)');
            CollisionDebugger.drawText(ctx, 'PLAYER', this.x + this.size + 5, this.y, 'lime');
            
            // Draw attack range (Commit 8)
            if (this.isAttacking) {
                CollisionDebugger.drawCircle(ctx, this.x, this.y, this.attackRange, 'rgba(255, 255, 0, 0.3)');
            }
        }
    }
    
    drawHealthBar(ctx) {
        const barWidth = 40;
        const barHeight = 6;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.size - 15;
        
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health
        const healthPercent = this.health / this.maxHealth;
        const healthWidth = barWidth * healthPercent;
        
        // Color based on health percentage
        if (healthPercent > 0.6) {
            ctx.fillStyle = CONFIG.COLORS.HEALTH; // Green
        } else if (healthPercent > 0.3) {
            ctx.fillStyle = '#ffd700'; // Yellow
        } else {
            ctx.fillStyle = '#ff4a4a'; // Red
        }
        
        ctx.fillRect(barX, barY, healthWidth, barHeight);
        
        // Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
    
    takeDamage(amount, attackerX, attackerY) {
        // Apply defense reduction
        const finalDamage = Math.max(1, amount - this.defense);
        this.health -= finalDamage;
        this.health = Math.max(0, this.health);
        
        console.log(`💔 Player took ${finalDamage} damage (${this.health}/${this.maxHealth} HP)`);
        
        // Apply knockback (Commit 8)
        if (attackerX !== undefined && attackerY !== undefined) {
            const angle = Math.atan2(this.y - attackerY, this.x - attackerX);
            this.knockbackVx = Math.cos(angle) * CONFIG.COMBAT.KNOCKBACK_FORCE;
            this.knockbackVy = Math.sin(angle) * CONFIG.COMBAT.KNOCKBACK_FORCE;
            this.knockbackTimer = CONFIG.COMBAT.KNOCKBACK_DURATION;
        }
        
        return finalDamage;
    }
    
    // Attack method (Commit 8)
    attack(currentTime, enemies, mouseWorldX, mouseWorldY) {
        // Check cooldown
        if (currentTime - this.lastAttackTime < this.attackCooldown) {
            return false; // Still on cooldown
        }
        
        // Update direction to face mouse (if provided)
        if (mouseWorldX !== undefined && mouseWorldY !== undefined) {
            this.direction = Math.atan2(mouseWorldY - this.y, mouseWorldX - this.x);
        }
        
        // Start attack animation
        this.isAttacking = true;
        this.attackTimer = 0;
        this.lastAttackTime = currentTime;
        
        // Find enemies in range
        let hitCount = 0;
        for (const enemy of enemies) {
            if (enemy.isDead) continue;
            
            const dist = Utils.distance(this.x, this.y, enemy.x, enemy.y);
            if (dist <= this.attackRange + enemy.size) {
                // Calculate damage
                let damage = this.attack;
                
                // Damage variance
                const variance = CONFIG.COMBAT.DAMAGE_VARIANCE;
                damage *= Utils.randomFloat(1 - variance, 1 + variance);
                
                // Critical hit
                if (Math.random() < CONFIG.COMBAT.CRITICAL_CHANCE) {
                    damage *= CONFIG.COMBAT.CRITICAL_MULTIPLIER;
                    console.log('💥 CRITICAL HIT!');
                }
                
                // Apply damage
                damage = Math.floor(damage);
                enemy.takeDamage(damage, this.x, this.y);
                hitCount++;
            }
        }
        
        if (hitCount > 0) {
            console.log(`⚔️ Player attacked ${hitCount} enemy(s)!`);
        } else {
            console.log('⚔️ Player attacked but missed!');
        }
        
        return true; // Attack executed
    }
    
    heal(amount) {
        const oldHealth = this.health;
        this.health = Math.min(this.maxHealth, this.health + amount);
        const healed = this.health - oldHealth;
        
        console.log(`💚 Player healed ${healed} HP (${this.health}/${this.maxHealth} HP)`);
        
        return healed;
    }
    
    addGold(amount) {
        this.gold += amount;
        console.log(`💰 +${amount} gold (Total: ${this.gold})`);
    }
}

// ===== MAIN GAME CLASS =====
class Game {
    constructor() {
        // Canvas setup
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Game state
        this.state = 'stopped'; // stopped, playing, paused, gameOver
        this.frameCount = 0;
        this.lastTime = 0;
        this.fps = 0;
        this.fpsTimer = 0;
        
        // Core systems
        this.input = new InputManager();
        this.camera = new Camera(0, 0);
        this.stats = new GameStats();
        
        // Game entities (will be populated in future commits)
        this.player = null;
        this.enemies = [];
        this.items = [];
        this.projectiles = [];
        this.particles = [];
        
        // Game data
        this.currentFloor = CONFIG.FLOOR.START_FLOOR;
        this.dungeon = null; // Will be populated in Commit 5

        // Initialize
        this.init();
    }

    init() {
        console.log('🎮 Dungeon Crawler RPG - Commit 2: Core Initialization');
        console.log('Canvas:', this.width, 'x', this.height);
        console.log('Grid:', CONFIG.GRID_WIDTH, 'x', CONFIG.GRID_HEIGHT);
        console.log('Tile size:', CONFIG.TILE_SIZE);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initial render
        this.render();
        
        // Update UI
        this.updateUI();
    }
    
    initGameData() {
        // Reset game data
        this.currentFloor = CONFIG.FLOOR.START_FLOOR;
        this.stats.reset();
        
        // Clear all entity arrays
        this.enemies = [];
        this.items = [];
        this.projectiles = [];
        this.particles = [];
        
        // Generate dungeon (Commit 5)
        this.dungeon = new Dungeon(this.currentFloor);
        
        // Spawn enemies (Commit 7)
        this.enemies = this.dungeon.spawnEnemies();
        
        // Spawn player in the center of the start room
        const startPos = this.dungeon.startRoom.getCenterWorld();
        this.player = new Player(startPos.x, startPos.y);
        console.log(`✓ Player spawned at (${Math.round(startPos.x)}, ${Math.round(startPos.y)}) in start room`);
        
        console.log('✓ Game data initialized');
    }

    setupEventListeners() {
        // Start button
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        
        // Pause button
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        
        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            // Pause with ESC
            if (e.key === 'Escape') {
                if (this.state === 'playing') {
                    this.togglePause();
                }
            }
            
            // Toggle collision debug (Commit 6)
            if (e.key.toLowerCase() === 'v') {
                CONFIG.DEBUG.SHOW_COLLISION = !CONFIG.DEBUG.SHOW_COLLISION;
                console.log(`🔍 Collision debug: ${CONFIG.DEBUG.SHOW_COLLISION ? 'ON' : 'OFF'}`);
            }
            
            // Toggle grid debug (Commit 6)
            if (e.key.toLowerCase() === 'g') {
                CONFIG.DEBUG.SHOW_GRID = !CONFIG.DEBUG.SHOW_GRID;
                console.log(`📐 Grid debug: ${CONFIG.DEBUG.SHOW_GRID ? 'ON' : 'OFF'}`);
            }
            
            // Inventory (will be implemented in Commit 10)
            if (e.key.toLowerCase() === 'i') {
                if (this.state === 'playing') {
                    console.log('💼 Inventory (coming in Commit 10)');
                }
            }
            
            // Character stats (will be implemented in Commit 12)
            if (e.key.toLowerCase() === 'c') {
                if (this.state === 'playing') {
                    console.log('📊 Character stats (coming in Commit 12)');
                }
            }
        });
        
        // Mouse controls (Commit 8)
        this.canvas.addEventListener('mousedown', (e) => {
            if (this.state === 'playing' && e.button === 0) {
                // Left click attack - handled in update loop
                // Mouse position already tracked by InputManager
            }
        });
        
        console.log('✓ Event listeners setup');
    }

    start() {
        if (this.state === 'stopped' || this.state === 'gameOver') {
            console.log('🎮 Starting game...');
            
            // Initialize game data
            this.initGameData();
            
            this.state = 'playing';
            
            // Hide welcome/game over screens
            document.getElementById('welcomeScreen').style.display = 'none';
            document.getElementById('gameOverScreen').style.display = 'none';
            
            // Enable pause button
            document.getElementById('pauseBtn').disabled = false;
            
            // Start game loop
            this.lastTime = performance.now();
            this.gameLoop(this.lastTime);
            
            this.updateUI();
            console.log('✓ Game started - Floor', this.currentFloor);
        }
    }

    togglePause() {
        if (this.state === 'playing') {
            this.state = 'paused';
            document.getElementById('pauseScreen').style.display = 'flex';
            console.log('⏸️ Game paused');
        } else if (this.state === 'paused') {
            this.state = 'playing';
            document.getElementById('pauseScreen').style.display = 'none';
            this.lastTime = performance.now();
            this.gameLoop(this.lastTime);
            console.log('▶️ Game resumed');
        }
        this.updateUI();
    }

    reset() {
        console.log('🔄 Resetting game...');
        this.state = 'stopped';
        this.frameCount = 0;
        this.fps = 0;
        
        // Reset game data
        this.initGameData();
        
        // Show welcome screen
        document.getElementById('welcomeScreen').style.display = 'flex';
        document.getElementById('pauseScreen').style.display = 'none';
        document.getElementById('gameOverScreen').style.display = 'none';
        
        // Disable pause button
        document.getElementById('pauseBtn').disabled = true;
        
        this.render();
        this.updateUI();
        console.log('✓ Game reset complete');
    }

    gameLoop(currentTime) {
        if (this.state !== 'playing') return;

        // Calculate delta time
        let deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = currentTime;
        
        // Clamp delta time to prevent spiral of death
        deltaTime = Math.min(deltaTime, CONFIG.MAX_DELTA_TIME);

        // Update FPS counter
        this.fpsTimer += deltaTime;
        if (this.fpsTimer >= 1) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsTimer = 0;
            this.updateUI();
        }
        this.frameCount++;
        
        // Update game statistics
        this.stats.update(deltaTime);

        // Update game logic (pass currentTime for combat)
        this.update(deltaTime, currentTime / 1000);

        // Render game
        this.render();

        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime, currentTime) {
        // Update input manager (Commit 10)
        this.input.update();
        this.input.updateMouseWorld(this.camera);
        
        // Handle inventory toggle (Commit 10)
        if (this.input.isKeyPressed('i')) {
            this.player.inventory.toggle();
        }
        
        // Handle inventory mouse clicks (Commit 10)
        if (this.player.inventory.isOpen) {
            if (this.input.mouse.justPressed && this.input.mouse.button === 0) {
                this.player.inventory.handleClick(
                    this.input.mouse.x,
                    this.input.mouse.y,
                    this.canvas,
                    this.player,
                    this.items
                );
            }
            if (this.input.mouse.rightJustPressed) {
                this.player.inventory.handleRightClick(
                    this.input.mouse.x,
                    this.input.mouse.y,
                    this.canvas,
                    this.player,
                    this.items
                );
            }
        }
        
        // Update player
        if (this.player) {
            this.player.update(deltaTime, this.input, this.dungeon);
            // Camera follows player
            this.camera.follow(this.player.x, this.player.y, deltaTime);
            
            // Handle player attack (Commit 8)
            if (this.input.isMouseDown(0) && !this.player.isDead && !this.player.inventory.isOpen) {
                this.player.attack(currentTime, this.enemies, this.input.mouse.worldX, this.input.mouse.worldY);
            }
            
            // Check for player death
            if (this.player.isDead) {
                this.gameOver();
                return;
            }
        }
        
        // Update enemies (Commit 7 + 8 + 9)
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            this.enemies[i].update(deltaTime, this.player, this.dungeon, currentTime);
            // Remove dead enemies and spawn loot (Commit 9)
            if (this.enemies[i].isDead) {
                const enemy = this.enemies[i];
                this.stats.enemiesKilled++;
                
                // Generate loot drops (Commit 9)
                const loot = LootGenerator.generateLoot(enemy.type, enemy.x, enemy.y);
                this.items.push(...loot);
                
                this.enemies.splice(i, 1);
            }
        }
        
        // Find nearest manual-pickup item (Commit 10)
        this.nearestManualItem = null;
        let nearestDist = CONFIG.INVENTORY.PICKUP_RANGE;
        
        // Update items (Commit 9 + 10)
        for (let i = this.items.length - 1; i >= 0; i--) {
            this.items[i].update(deltaTime);
            
            // Check for item pickup
            if (this.player && this.items[i].canPickup(this.player)) {
                if (this.items[i].autoPickup) {
                    // Auto-pickup items (gold, potions)
                    const item = this.items[i];
                    item.pickup(this.player);
                    this.stats.itemsCollected++;
                    
                    // Track gold collection
                    if (item.type === ITEM_TYPE.GOLD) {
                        this.stats.goldCollected += item.value;
                    }
                } else {
                    // Manual pickup items - find nearest (Commit 10)
                    const dist = Utils.distance(this.items[i].x, this.items[i].y, this.player.x, this.player.y);
                    if (dist < nearestDist) {
                        nearestDist = dist;
                        this.nearestManualItem = this.items[i];
                    }
                }
            }
            
            // Remove picked up items
            if (this.items[i].isDead) {
                this.items.splice(i, 1);
            }
        }
        
        // Handle manual pickup with E key (Commit 10)
        if (this.input.isKeyPressed('e') && this.nearestManualItem && !this.player.inventory.isOpen) {
            const item = this.nearestManualItem;
            item.pickup(this.player, true); // Manual pickup
            this.stats.itemsCollected++;
        }
        
        // Update projectiles (will be implemented later)
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            this.projectiles[i].update(deltaTime);
            // Remove expired projectiles
            if (this.projectiles[i].isDead) {
                this.projectiles.splice(i, 1);
            }
        }
        
        // Update particles (will be implemented in Commit 18)
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(deltaTime);
            // Remove dead particles
            if (this.particles[i].isDead) {
                this.particles.splice(i, 1);
            }
        }
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = CONFIG.COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Save context state
        this.ctx.save();
        
        // Apply camera transform
        this.camera.apply(this.ctx);
        
        // === WORLD SPACE RENDERING ===
        
        // Draw dungeon (will be implemented in Commit 5)
        if (this.dungeon) {
            this.dungeon.render(this.ctx);
        } else {
            // Draw grid pattern for visualization
            this.drawGrid();
        }
        
        // Draw items (will be implemented in Commit 9)
        for (const item of this.items) {
            item.render(this.ctx);
        }
        
        // Draw enemies (will be implemented in Commit 7)
        for (const enemy of this.enemies) {
            enemy.render(this.ctx);
        }
        
        // Draw player (will be implemented in Commit 3)
        if (this.player) {
            this.player.render(this.ctx);
        }
        
        // Draw projectiles (will be implemented in Commit 8)
        for (const projectile of this.projectiles) {
            projectile.render(this.ctx);
        }
        
        // Draw particles (will be implemented in Commit 18)
        for (const particle of this.particles) {
            particle.render(this.ctx);
        }
        
        // Reset camera transform
        this.camera.reset(this.ctx);
        
        // === SCREEN SPACE RENDERING ===
        
        // Draw UI elements that don't move with camera
        this.drawScreenUI();
        
        // Restore context state
        this.ctx.restore();
    }

    drawGrid() {
        const gridSize = CONFIG.TILE_SIZE;
        const startX = Math.floor(this.camera.x / gridSize) * gridSize;
        const startY = Math.floor(this.camera.y / gridSize) * gridSize;
        const endX = startX + this.width + gridSize;
        const endY = startY + this.height + gridSize;
        
        this.ctx.strokeStyle = CONFIG.COLORS.GRID;
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let x = startX; x <= endX; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, endY);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = startY; y <= endY; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(startX, y);
            this.ctx.lineTo(endX, y);
            this.ctx.stroke();
        }
    }
    
    drawScreenUI() {
        if (this.state === 'playing' && this.player) {
            // Show instructions for next features
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'top';
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
            this.ctx.fillText('WASD: Move • Click: Attack • Auto-collect loot • V: Debug', this.width / 2, 10);
            
            // Show some debug info about active systems
            this.ctx.font = '14px Courier New';
            this.ctx.textAlign = 'left';
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
            const debugY = this.height - 200;
            this.ctx.fillText(`✓ CONFIG system`, 10, debugY);
            this.ctx.fillText(`✓ Input Manager`, 10, debugY + 15);
            this.ctx.fillText(`✓ Camera System`, 10, debugY + 30);
            this.ctx.fillText(`✓ Game Stats`, 10, debugY + 45);
            this.ctx.fillText(`✓ Player System`, 10, debugY + 60);
            this.ctx.fillText(`✓ Movement Controls`, 10, debugY + 75);
            this.ctx.fillText(`✓ Dungeon Generation`, 10, debugY + 90);
            this.ctx.fillText(`✓ Collision System`, 10, debugY + 105);
            this.ctx.fillText(`✓ Enemy System`, 10, debugY + 120);
            this.ctx.fillText(`✓ Combat System`, 10, debugY + 135);
            this.ctx.fillText(`✓ Loot System`, 10, debugY + 150);
            
            // Show debug mode indicators (Commit 6)
            if (CONFIG.DEBUG.SHOW_COLLISION || CONFIG.DEBUG.SHOW_GRID) {
                this.ctx.fillStyle = 'rgba(0, 255, 0, 0.6)';
                let debugIndicatorY = debugY + 165;
                if (CONFIG.DEBUG.SHOW_COLLISION) {
                    this.ctx.fillText(`[V] Collision: ON`, 10, debugIndicatorY);
                    debugIndicatorY += 15;
                }
                if (CONFIG.DEBUG.SHOW_GRID) {
                    this.ctx.fillText(`[G] Grid: ON`, 10, debugIndicatorY);
                }
            }
            
            // Show player state
            this.ctx.fillStyle = 'rgba(74, 158, 255, 0.4)';
            this.ctx.fillText(`State: ${this.player.animationState}`, this.width - 150, debugY);
            this.ctx.fillText(`HP: ${Math.ceil(this.player.health)}/${this.player.maxHealth}`, this.width - 150, debugY + 15);
            this.ctx.fillText(`Gold: ${this.player.gold}`, this.width - 150, debugY + 30);
            
            // Show combat info (Commit 8)
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
            this.ctx.fillText(`ATK: ${this.player.attack} | DEF: ${this.player.defense}`, this.width - 150, debugY + 45);
            this.ctx.fillText(`Range: ${this.player.attackRange}px`, this.width - 150, debugY + 60);
            
            // Show dungeon info
            if (this.dungeon) {
                const currentRoom = this.dungeon.getRoomAt(this.player.x, this.player.y);
                const roomType = currentRoom ? currentRoom.type : 'unknown';
                this.ctx.fillStyle = 'rgba(74, 158, 255, 0.4)';
                this.ctx.fillText(`Room: ${roomType}`, this.width - 150, debugY + 75);
            }
            
            // Show enemy and loot info (Commit 7 + 8 + 9)
            this.ctx.fillStyle = 'rgba(255, 74, 74, 0.4)';
            this.ctx.fillText(`Enemies: ${this.enemies.length}`, this.width - 150, debugY + 90);
            this.ctx.fillText(`Kills: ${this.stats.enemiesKilled}`, this.width - 150, debugY + 105);
            
            // Show loot info (Commit 9)
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
            this.ctx.fillText(`Items: ${this.items.length}`, this.width - 150, debugY + 120);
            this.ctx.fillText(`Collected: ${this.stats.itemsCollected}`, this.width - 150, debugY + 135);
            
            // Show collision layer info (Commit 6)
            if (CONFIG.DEBUG.SHOW_COLLISION && this.player) {
                this.ctx.fillStyle = 'rgba(0, 255, 0, 0.6)';
                this.ctx.fillText(`Layer: PLAYER`, this.width - 150, debugY + 150);
            }
        }
    }

    updateUI() {
        // Update debug info
        document.getElementById('fps').textContent = this.fps;
        document.getElementById('gameState').textContent = this.state;
        
        // Update player stats (placeholder values until player is implemented)
        if (this.player) {
            document.getElementById('playerHealth').textContent = 
                `${Math.ceil(this.player.health)}/${this.player.maxHealth}`;
            document.getElementById('playerAttack').textContent = this.player.attack;
            document.getElementById('playerDefense').textContent = this.player.defense;
            document.getElementById('playerLevel').textContent = this.player.level;
            document.getElementById('playerGold').textContent = this.player.gold;
        } else {
            // Placeholder values from CONFIG
            document.getElementById('playerHealth').textContent = 
                `${CONFIG.PLAYER.START_HEALTH}/${CONFIG.PLAYER.START_HEALTH}`;
            document.getElementById('playerAttack').textContent = CONFIG.PLAYER.START_ATTACK;
            document.getElementById('playerDefense').textContent = CONFIG.PLAYER.START_DEFENSE;
            document.getElementById('playerLevel').textContent = CONFIG.PLAYER.START_LEVEL;
            document.getElementById('playerGold').textContent = CONFIG.PLAYER.START_GOLD;
        }
        
        document.getElementById('currentFloor').textContent = this.currentFloor;
        
        // Update game over screen stats
        if (this.state === 'gameOver') {
            document.getElementById('finalFloor').textContent = this.currentFloor;
            document.getElementById('finalGold').textContent = this.stats.goldCollected;
            document.getElementById('finalKills').textContent = this.stats.enemiesKilled;
        }
    }
    
    gameOver() {
        console.log('💀 Game Over!');
        this.state = 'gameOver';
        
        // Update final stats
        this.updateUI();
        
        // Show game over screen
        document.getElementById('gameOverScreen').style.display = 'flex';
        
        // Disable pause button
        document.getElementById('pauseBtn').disabled = true;
    }
}

// Initialize game when page loads
let game;
window.addEventListener('load', () => {
    game = new Game();
});
