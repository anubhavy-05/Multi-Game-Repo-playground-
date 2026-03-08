# 🗡️ Dungeon Crawler RPG

A complex, feature-rich dungeon crawler RPG game built incrementally over 20+ commits.

## 🎮 Game Concept

Explore procedurally generated dungeons, fight enemies, collect loot, level up your character, and descend deeper into the dungeon. Combine real-time combat with RPG progression, inventory management, and strategic gameplay.

## 🚧 Development Progress

### ✅ Completed Commits

**Commit 1: Basic HTML Structure and Canvas Setup** ✓
- Created game8 folder structure
- HTML file with canvas (800x600) and UI overlay
- CSS with dungeon-themed dark gradient styling
- Stats panel (HP, ATK, DEF, LVL, Gold, Floor)
- Control buttons (Start, Pause, Reset)
- Welcome screen with game instructions
- Pause screen overlay
- Game over screen with statistics
- Info panel with debug information
- Responsive design for mobile/desktop
- Basic JavaScript Game class structure
- Canvas initialization and rendering
- Game state management (stopped, playing, paused, gameOver)
- Event listeners for controls
- Game loop with FPS counter
- Grid pattern visualization
- Basic UI update system

**Features in Commit 1:**
- ✅ Canvas setup with proper sizing
- ✅ Game state management
- ✅ Modal screens (welcome, pause, game over)
- ✅ Stats panel UI
- ✅ Control buttons
- ✅ FPS counter
- ✅ Grid visualization
- ✅ Responsive CSS styling
- ✅ Event handling system
- ✅ Game loop foundation

**Commit 2: Create Game Class and Core Initialization** ✓
- Configuration constants (CONFIG object)
- Game constants for tiles, grid, player, floor difficulty
- Color palette for consistent theming
- Utility functions (Utils object)
- Distance, angle, lerp calculations
- Random number generators
- AABB collision checking
- Grid/world coordinate conversions
- Input Manager system
- Keyboard input tracking (WASD, arrows, ESC, I, C keys)
- Mouse position tracking (canvas and world space)
- Mouse click detection
- Camera system
- Smooth camera follow with lerp
- Camera transform for world/screen space separation
- Target tracking for player following
- Game Statistics tracker
- Time played, enemies killed, gold collected
- Damage dealt/taken, items collected, floors cleared
- Enhanced Game class
- Entity arrays (enemies, items, projectiles, particles)
- Game data initialization
- Camera and input integration
- Improved game loop with delta time clamping
- Separate update/render pipelines
- World space and screen space rendering
- Game over system

**Features in Commit 2:**
- ✅ CONFIG object with 50+ constants
- ✅ Utils library with 10+ helper functions
- ✅ Input Manager with keyboard/mouse tracking
- ✅ Camera system with smooth following
- ✅ Game Statistics tracking
- ✅ Entity management arrays
- ✅ World/screen space separation
- ✅ Delta time clamping (prevent spiral of death)
- ✅ Enhanced event listeners (I, C, ESC keys)
- ✅ Game over system
- ✅ Resource management foundation

**Commit 3: Implement Player Character and Rendering** ✓
- Player class with full implementation
- Position tracking (x, y)
- Stats system (health, attack, defense, speed, gold, level)
- Health bar rendering above player
- Circle sprite with directional indicator
- Death detection and game over trigger
- Color-coded health bar (green/yellow/red)
- takeDamage() method with defense calculation
- heal() method for health restoration
- addGold() method for currency
- Camera follows player smoothly
- Player spawns at canvas center (400, 300)
- Size: 16px radius (fits on tiles)
- Update method with animation timer
- Console logging for damage/healing/gold

**Features in Commit 3:**
- ✅ Player class with 12 properties
- ✅ Health bar with color gradients
- ✅ Direction indicator (white dot)
- ✅ Defense-based damage reduction
- ✅ Death detection system
- ✅ Camera auto-follow
- ✅ Spawn at center position
- ✅ Console debugging for actions
- ✅ Ready for movement in Commit 4

**Commit 4: Movement Controls and Player Physics** ✓
- Velocity-based movement system
- WASD and Arrow key support
- Smooth delta time-based movement
- Diagonal movement normalization (1/√2)
- Direction updates based on movement
- Animation state changes (idle ↔ walk)
- Canvas boundary checking (temporary)
- Instant stop when releasing keys
- Speed: 150 pixels per second
- Player velocity tracking (vx, vy)
- Direction indicator updates in real-time
- isMoving flag for state detection
- Movement debug display (position, velocity, state)

**Features in Commit 4:**
- ✅ WASD/Arrow key input handling
- ✅ Velocity properties (vx, vy)
- ✅ Delta time integration for smooth movement
- ✅ Diagonal movement normalized
- ✅ Direction auto-updates with movement
- ✅ Animation state: idle/walk
- ✅ Canvas boundary clamping
- ✅ Debug UI showing position/velocity
- ✅ Camera auto-follows player smoothly
- ✅ 60 FPS smooth movement

**Commit 5: Dungeon Room Generation System** ✓
- Tile-based dungeon system
- Three connected rooms (start, normal, boss)
- Tile class for individual tiles
- Room class for room generation
- Dungeon class for layout management
- Wall collision detection
- Door connections between rooms
- Room-specific tile rendering
- Player spawns in start room center
- Dungeon rendering with visual depth
- Current room tracking system

**Features in Commit 5:**
- ✅ Tile class (grid position, world position, type)
- ✅ Room class (walls, floors, doors, boundaries)
- ✅ Dungeon class (multiple rooms, tile map)
- ✅ 3 room types: START, NORMAL, BOSS
- ✅ Tile types: FLOOR, WALL, DOOR
- ✅ Procedural room layout
- ✅ Door connections between rooms
- ✅ Circle-to-tile collision detection
- ✅ Player spawns at start room center
- ✅ Wall boundaries replace canvas bounds
- ✅ Room detection (know which room player is in)
- ✅ Tile rendering with borders and highlights
- ✅ Debug UI shows current room info

**Commit 6: Enhanced Collision Detection System** ✓
- Advanced collision detection utilities
- Circle-to-circle collision
- Circle-to-rectangle collision
- Point containment checks
- Collision response system
- Collision layers and masks
- Debug visualization mode
- Collision debugger class

**Features in Commit 6:**
- ✅ Circle-to-circle collision detection
- ✅ Circle-to-rectangle collision detection
- ✅ Point-in-circle and point-in-rectangle checks
- ✅ Rectangle overlap detection
- ✅ Circle penetration depth calculation
- ✅ Push-apart collision response
- ✅ Collision layer system (6 layers)
- ✅ Collision matrix for layer filtering
- ✅ CollisionDebugger class for visualization
- ✅ Toggle collision debug with V key
- ✅ Toggle grid debug with G key
- ✅ Player collision layer assignment
- ✅ Debug UI shows collision status

### 📋 Planned Commits (8-20+)

**Commit 7: Enemy System Implementation** ✓
- ENEMY_TYPE enumeration (slime, skeleton, goblin)
- ENEMY_CONFIG system with enemy stats
- Enemy class with full AI behavior
- Enemy spawning system per room
- Enemy AI with aggro detection (200px range)
- Enemy chase behavior and pathfinding
- Enemy attack range system (30px)
- Enemy movement with wall collision
- Enemy rendering (colored circles, health bars)
- Enemy collision debug visualization
- Random spawn position generation
- Enemy death and rewards system
- Enemy state tracking in game loop
- Integration with collision layer system

**Features in Commit 7:**
- ✅ 3 enemy types (Slime, Skeleton, Goblin)
- ✅ Enemy stats (HP, ATK, DEF, speed, size, color, XP, gold)
- ✅ Enemy AI (aggro detection, chase, pathfinding)
- ✅ Enemy spawning (2-4 enemies per dungeon)
- ✅ Enemy movement with wall collision detection
- ✅ Enemy rendering with health bars
- ✅ Collision debug visualization for enemies
- ✅ Random spawn position system
- ✅ Enemy death rewards (gold, XP)
- ✅ Enemy class with 10+ methods
- ✅ Integration with existing collision system
- ✅ Enemy layer assignment (ENEMY layer)
- ✅ Debug UI shows enemy count and kills
- ✅ Enemies render with direction indicator
- ✅ Color-coded health bars (green/yellow/red)

**Commit 8: Combat System and Health** ✓
- Player attack system (mouse click to attack)
- Player attack direction follows mouse cursor
- Attack range system (50px for player)
- Attack cooldown system (0.5s for player, 1.0s for enemies)
- Damage calculation with variance (±10%)
- Critical hit system (15% chance, 2x damage)
- Defense damage reduction
- Knockback mechanics on hit
- Enemy attack behavior (when in range)
- Player takeDamage with knockback
- Enemy takeDamage with knockback
- Attack animation for player and enemies
- Visual attack indicators (arc swing)
- Player death triggers game over
- Health bar updates in real-time
- Combat timing system (currentTime parameter)
- Mouse input integration with InputManager

**Features in Commit 8:**
- ✅ Mouse click attack system
- ✅ Player faces mouse cursor when attacking
- ✅ Attack range visualization (50px player, 30px enemies)
- ✅ Attack cooldown prevents spam
- ✅ Damage variance (±10% randomness)
- ✅ Critical hits (15% chance, 2x damage multiplier)
- ✅ Defense reduces incoming damage
- ✅ Knockback on hit (pushes target back)
- ✅ Enemy attacks when in range (30px)
- ✅ Attack animations (arc swing visual)
- ✅ Player death triggers game over screen
- ✅ Health bars update after damage
- ✅ Real-time combat system
- ✅ Combat statistics tracking
- ✅ Console damage logging
- ✅ Attack sound ready (visual only for now)

**Commit 9: Loot and Item Drops**
- Item types (weapons, armor, potions, gold)
- Loot tables
- Drop system on enemy death
- Item pickup system

**Commit 10: Inventory System**
- Inventory UI
- Item storage grid
- Item stacking
- Inventory management

**Commit 11: Equipment System**
- Equipment slots (weapon, armor, helmet, boots)
- Stat bonuses from equipment
- Equip/unequip mechanics
- Visual equipment display

**Commit 12: Character Stats and Attributes**
- Strength, Dexterity, Constitution, Intelligence
- Stat-based damage/defense calculations
- Stat point allocation
- Derived stats (crit chance, dodge)

**Commit 13: Experience and Leveling System**
- XP gain from enemies
- Level progression curve
- Level up rewards
- Stat increases per level

**Commit 14: Enemy AI System**
- Pathfinding (A* algorithm)
- Chase behavior
- Attack patterns
- Aggro range

**Commit 15: Multiple Dungeon Floors**
- Stairs to next floor
- Floor difficulty scaling
- Floor generation variety
- Floor transition system

**Commit 16: Boss Encounters**
- Boss enemy types
- Boss rooms
- Unique boss mechanics
- Boss loot drops

**Commit 17: Special Abilities System**
- Active abilities (dash, fireball, heal)
- Ability cooldowns
- Mana system
- Ability upgrades

**Commit 18: Particle Effects System**
- Damage numbers
- Blood splatter
- Magic effects
- Explosion effects
- Trail effects

**Commit 19: Sound System**
- Background music
- Combat sounds
- Item pickup sounds
- UI sounds
- Ambient dungeon sounds

**Commit 20: Save and Load System**
- LocalStorage save system
- Save player progress
- Load game state
- Auto-save functionality

**Commit 21+: Polish and Advanced Features**
- Mini-map system
- Quest system
- NPC merchants
- Crafting system
- Status effects (poison, burn, freeze)
- Critical hits and combos
- Achievements
- Leaderboards
- Multiple character classes
- Skill trees

## 🎮 How to Play

### Starting the Game
1. Open `index.html` in your web browser
2. Read the welcome screen instructions
3. Click "Start Adventure" to begin

### Controls (To be implemented in Commit 4)
- **WASD** or **Arrow Keys** - Move character
- **Mouse Click** - Attack enemies
- **I** - Open inventory
- **ESC** - Pause game
- **E** - Interact/Pick up items

### Game Mechanics (Coming in future commits)
- Explore procedurally generated dungeons
- Fight enemies to gain experience and loot
- Collect weapons and armor to increase your power
- Level up to unlock new abilities
- Descend deeper into the dungeon
- Defeat bosses to progress

## 📂 File Structure
```
game8/
├── index.html      # Main game page with canvas and UI
├── styles.css      # Dungeon-themed styling
├── game.js         # Game logic and mechanics
├── README.md       # This file
└── sounds/         # (Coming in Commit 19)
    └── (audio files)
```

## 🛠️ Technical Details

### Canvas
- **Size:** 800x600 pixels
- **Rendering:** 2D context
- **Grid:** 40x40 pixel tiles (20x15 grid)
- **FPS Target:** 60 FPS

### Architecture
- **Game Class:** Main game controller
- **Player Class:** (Commit 3) Character logic
- **Enemy Class:** (Commit 7) Enemy entities
- **Item Class:** (Commit 9) Collectible items
- **Dungeon Class:** (Commit 5) Level generation
- **Inventory Class:** (Commit 10) Item management

### Technologies
- **HTML5 Canvas** - Rendering
- **Vanilla JavaScript** - Game logic (ES6 classes)
- **CSS3** - UI styling with animations
- **LocalStorage** - (Commit 20) Save system

## 🎯 Current Testing Instructions (Commit 8)

1. **Open the game** - Load `index.html` in a modern browser
2. **Check UI updates** - Verify all UI elements show Commit 8:
   - Header subtitle: "Commit 8: Combat and Health System ✓"
   - Welcome screen shows "Commit 8: Combat System Active ✓"
   - Welcome screen features: "Mouse click attacks • Damage calculation • Enemy attacks • Knockback • Death system"
   - Info panel: "Development Stage: Commit 8/20+"
   - Info panel status: "Combat system active"
   - Info panel next: "Loot & item drops"
3. **Test basic controls**:
   - Click "Start Adventure" - Should generate dungeon, spawn player, and spawn enemies
   - Dungeon renders with 3 rooms
   - Player spawns in start room center
   - Enemies spawn in rooms (2-4 total)
   - FPS counter should update (~60 FPS)
   - Top instruction text: "WASD: Move • Click: Attack • V: Collision Debug • Survive!"
   - Bottom-left debug shows 10 active systems (including "✓ Combat System")
4. **Test player attack (MAIN TEST)**:
   - Move player near an enemy (within 60px)
   - Click anywhere on the canvas
   - Player should:
     * Turn to face the mouse cursor
     * Play attack animation (white arc swing)
     * Attack range indicator appears (yellow circle when debug mode ON)
     * Console: "⚔️ Player attacked N enemy(s)!" or "⚔️ Player attacked but missed!"
   - If enemy is in range (50px + enemy size):
     * Enemy health bar decreases
     * Enemy turns red briefly (damage feedback)
     * Enemy gets knocked back away from player
     * Console: "💥 EnemyName took N damage (X/Y HP)"
5. **Test attack cooldown**:
   - Click multiple times rapidly
   - Only 1 attack every 0.5 seconds should execute
   - Console will show "attacked" message only when cooldown ready
   - Attack animation won't restart if on cooldown
6. **Test damage calculation**:
   - Attack the same enemy multiple times
   - Damage varies slightly (±10% variance)
   - Occasionally see "💥 CRITICAL HIT!" in console
   - Critical hits deal 2x damage
   - Damage formula: (Player ATK) - (Enemy DEF) with variance
   - Minimum 1 damage even if defense is high
7. **Test enemy attacks (MAIN TEST)**:
   - Let an enemy chase you (aggro by getting close)
   - Stand still and let enemy reach you (within 30px)
   - Enemy should:
     * Stop moving when in range
     * Play attack animation (red arc swing)
     * Attack approximately every 1 second
   - Player should:
     * Take damage (health bar decreases)
     * Get knocked back away from enemy
     * Console: "💔 Player took N damage (X/Y HP)"
8. **Test knockback mechanics**:
   - Attack an enemy - enemy pushed back
   - Let enemy attack you - player pushed back
   - Knockback doesn't go through walls
   - Knockback lasts about 0.2 seconds
   - Can still move during knockback (reduced control)
9. **Test player death (MAIN TEST)**:
   - Let enemies attack player until health reaches 0
   - Player should die (console: "💀 Player has died!")
   - Game over screen should appear
   - Game over stats should show:
     * Final floor: 1
     * Gold collected: (total from killed enemies)
     * Enemies defeated: (kill count)
   - Click "Try Again" to restart
10. **Test enemy death**:
    - Attack an enemy until health reaches 0
    - Enemy should:
      * Die (console: "☠️ EnemyName has died!")
      * Disappear from screen
      * Award gold (console: "💰 +N gold (Total: X)")
      * Enemy count decreases in UI
      * Kills stat increases
11. **Test multiple enemies**:
    - Aggro multiple enemies at once
    - Attack in different directions
    - Player faces each attack direction (follows mouse)
    - Can hit multiple enemies in one swing if close together
    - Each enemy attacks independently with own cooldown
12. **Test dungeon exploration with combat**:
    - Clear starting room of enemies
    - Move through doors to other rooms
    - Fight enemies in each room
    - Health persists between rooms (damage accumulates)
    - Death can occur in any room
13. **Test attack animations**:
    - Player: White arc swing in attack direction, blue dot at weapon tip
    - Enemies: Red arc swing toward player, red dot at weapon tip
    - Animations last ~0.2-0.3 seconds
    - Smooth arc motion (sin wave)
14. **Test health bars**:
    - Player health bar always visible above player
    - Enemy health bars always visible below enemies
    - Color coding:
      * Green: >60% health
      * Yellow: 30-60% health
      * Red: <30% health
    - Bars update immediately after damage
15. **Test collision debug mode (V key)**:
    - Press 'V' to enable collision debug
    - Player attack range shown as yellow circle (50px) when attacking
    - Enemy collision circles shown in red
    - All collision shapes accurate to attack ranges
16. **Test combat UI info**:
    - Right side debug shows:
      * Player HP: X/Y
      * ATK: 10 | DEF: 5
      * Range: 50px
      * Enemies: N (live count)
      * Kills: M (cumulative)
    - All values update in real-time
17. **Test different enemy difficulties** (Console - F12):
    ```javascript
    // Check enemy stats
    game.enemies.forEach((e, i) => {
        console.log(`Enemy ${i}: ${e.name}, HP: ${e.health}/${e.maxHealth}, ATK: ${e.attack}, DEF: ${e.defense}`);
    });
    
    // Slimes: 30 HP, 5 ATK, 0 DEF (easy)
    // Skeletons: 50 HP, 8 ATK, 3 DEF (medium, boss room)
    // Goblins: 40 HP, 12 ATK, 2 DEF (hard, high damage)
    ```
18. **Test player manual damage** (Console):
    ```javascript
    // Damage player manually
    game.player.takeDamage(20);
    // Should see health bar decrease, console log damage
    
    // Heal player
    game.player.heal(30);
    // Should see health bar increase, console log healing
    
    // Check player stats
    game.player.health  // Current HP
    game.player.maxHealth  // Max HP
    game.player.attack  // Attack value
    game.player.defense  // Defense value
    ```
19. **Test enemy manual attack** (Console):
    ```javascript
    // Make enemy attack player manually
    const enemy = game.enemies[0];
    const currentTime = performance.now() / 1000;
    enemy.attack(currentTime, game.player);
    // Should damage player and knockback
    ```
20. **Performance test with combat**:
    - Aggro all enemies
    - Attack continuously (hold click)
    - Let enemies attack player
    - Multiple animations playing simultaneously
    - FPS should stay around 60 FPS
    - No lag or stuttering even with multiple combatants

### Expected Results:
- ✅ Player can attack with mouse click
- ✅ Enemies take damage and die
- ✅ Enemies attack player when in range
- ✅ Player takes damage and can die
- ✅ Knockback works on both player and enemies
- ✅ Attack cooldowns prevent spam
- ✅ Critical hits occur randomly (15% chance)
- ✅ Damage variance makes combat dynamic
- ✅ Health bars update in real-time
- ✅ Attack animations play smoothly
- ✅ Game over triggers on player death
- ✅ Combat system fully functional
- ✅ 60 FPS maintained during combat

---

## 🎯 Previous Testing Instructions (Commit 7)

1. **Open the game** - Load `index.html` in a modern browser
2. **Check UI updates** - Verify all UI elements show Commit 7:
   - Header subtitle: "Commit 7: Enemy System Implementation ✓"
   - Welcome screen shows "Commit 7: Enemy System Implemented ✓"
   - Welcome screen features: "3 enemy types • AI behavior • Aggro detection • Pathfinding • Health bars"
   - Info panel: "Development Stage: Commit 7/20+"
   - Info panel status: "Enemy system active"
   - Info panel next: "Combat & health system"
3. **Test basic controls**:
   - Click "Start Adventure" - Should generate dungeon, spawn player, and spawn enemies
   - Dungeon renders with 3 rooms
   - Player spawns in start room center
   - Enemies spawn in rooms (2-4 total)
   - Console shows: "✓ Spawned N enemies"
   - FPS counter should update (~60 FPS)
   - Top instruction text: "WASD: Move • V: Collision Debug • Defeat enemies • Combat coming in Commit 8..."
   - Bottom-left debug shows 9 active systems (including "✓ Enemy System")
4. **Test enemy spawning (MAIN TEST)**:
   - **Normal room**: Should spawn 2-3 slimes (green) + 1-2 goblins (lime green)
   - **Boss room**: Should spawn 1 skeleton (gray)
   - Total: 3-5 enemies per game
   - Enemies spawn on floor tiles (not in walls)
   - Enemy positions randomized each game
   - Console logs enemy count
5. **Test enemy rendering**:
   - **Slimes**: Green circles (#4aff4a), 12px radius, small
   - **Skeletons**: Gray circles (#cccccc), 14px radius, medium
   - **Goblins**: Lime circles (#88ff44), 13px radius, medium
   - Each enemy has:
     * Colored circle body
     * Black border (2px)
     * Direction indicator (small black dot)
     * Health bar below (full green when spawned)
6. **Test enemy AI behavior**:
   - **Idle state**: Enemies don't move when player is far away
   - **Aggro detection**: Enemies activate when player is within 200px
   - **Chase behavior**: Activated enemies move toward player
   - **Attack range**: Enemies stop moving when within 30px of player
   - **Pathfinding**: Enemies navigate around walls
   - Enemies can't walk through walls (wall collision working)
   - Enemies stay within their room unless following player through doors
7. **Test enemy movement speeds**:
   - **Slimes**: Slowest (80 speed) - should be easy to outrun
   - **Skeletons**: Medium (100 speed) - matches player speed
   - **Goblins**: Fastest (120 speed) - should catch up to player
   - Movement should be smooth and consistent
8. **Test enemy health bars**:
   - Health bar renders below each enemy
   - Bar width = enemy size * 2
   - Bar height = 4px
   - Color coding (not testable until combat):
     * Green: >60% HP
     * Yellow: 30-60% HP
     * Red: <30% HP
   - All enemies start at full health (green bar)
9. **Test collision debug visualization (V key)**:
   - Press 'V' to enable collision debug
   - Player: Green circle with "PLAYER" label
   - Enemies: Red circles with "ENEMY" label
   - Aggro range: Orange circle showing 200px detection radius
   - All collision circles should match entity sizes
   - Debug info updates in real-time
10. **Test debug UI info**:
    - Press 'V' to show collision debug
    - Right side debug shows:
      * "Enemies: N" (current enemy count)
      * "Kills: 0" (no enemies killed yet - combat in Commit 8)
    - Enemy count should match visual enemy count on screen
11. **Test enemy death system (Console - F12)**:
    ```javascript
    // Kill first enemy manually
    game.enemies[0].die()
    // Console should log: "💀 Enemy died at (x, y)"
    
    // Check enemy is dead
    game.enemies[0].isDead  // true
    
    // Check gold reward was given
    game.stats.goldCollected  // Should increase
    game.player.gold  // Should increase
    
    // Check kill stat
    game.stats.enemiesKilled  // Should increase
    ```
12. **Test ENEMY_TYPE and ENEMY_CONFIG (Console)**:
    ```javascript
    // Check enemy types
    ENEMY_TYPE.SLIME      // 'slime'
    ENEMY_TYPE.SKELETON   // 'skeleton'
    ENEMY_TYPE.GOBLIN     // 'goblin'
    
    // Check enemy configs
    ENEMY_CONFIG.slime
    // {health: 30, attack: 5, defense: 0, speed: 80, size: 12, 
    //  color: '#4aff4a', xpValue: 10, goldValue: 5}
    
    ENEMY_CONFIG.skeleton
    // {health: 50, attack: 8, defense: 3, speed: 100, size: 14,
    //  color: '#cccccc', xpValue: 20, goldValue: 15}
    
    ENEMY_CONFIG.goblin
    // {health: 40, attack: 12, defense: 2, speed: 120, size: 13,
    //  color: '#88ff44', xpValue: 15, goldValue: 10}
    ```
13. **Test enemy methods (Console)**:
    ```javascript
    // Get first enemy
    const enemy = game.enemies[0]
    
    // Check enemy properties
    enemy.type          // 'slime', 'skeleton', or 'goblin'
    enemy.health        // Current health
    enemy.maxHealth     // Max health from config
    enemy.attack        // Attack value
    enemy.defense       // Defense value
    enemy.speed         // Movement speed
    enemy.size          // Render size
    enemy.color         // Render color
    enemy.aggroRange    // 200
    enemy.attackRange   // 30
    enemy.collisionLayer // 2 (ENEMY layer)
    
    // Test damage
    enemy.takeDamage(10)
    // Console: "Enemy took N damage (Defense: M)"
    
    // Check health decreased
    enemy.health  // Should be less than maxHealth
    ```
14. **Test enemy spawning system (Console)**:
    ```javascript
    // Check dungeon spawning methods exist
    typeof game.dungeon.spawnEnemies  // 'function'
    typeof game.dungeon.getRandomFloorPosition  // 'function'
    
    // Respawn enemies manually
    const newEnemies = game.dungeon.spawnEnemies()
    // Returns array of enemies
    
    // Check spawn position validity
    const room = game.dungeon.rooms[1]  // Normal room
    const pos = game.dungeon.getRandomFloorPosition(room)
    // Returns {x, y} or null
    // x,y should be on floor tiles, not walls
    ```
15. **Test movement around enemies**:
    - Walk near enemies (within 200px)
    - Enemies should turn toward player
    - Enemies should start chasing
    - Walk away - enemies should continue chasing
    - Walk through doors - enemies should follow if aggro'd
    - Enemies should stop when within 30px (attack range)
16. **Test enemy-wall collision**:
    - Aggro an enemy and run toward a wall
    - Position player on opposite side of wall
    - Enemy should:
      * Try to pathfind to player
      * Stop at walls (not phase through)
      * Attempt to navigate around walls
    - Enemies use same collision system as player
17. **Performance test with enemies**:
    - Enable collision debug (V key)
    - Aggro all enemies simultaneously
    - Run through all rooms with enemies chasing
    - FPS should stay around 60 FPS
    - Enemy AI updates should be smooth
    - No lag or stuttering
18. **Test enemy stats variation**:
    - Reset game multiple times (click "Try Again" button)
    - Each spawn should randomize:
      * Normal room: 2 OR 3 slimes
      * Normal room: 1 OR 2 goblins
      * Boss room: 1 skeleton (consistent)
    - Total enemy count varies between 3-5
    - Spawn positions should be different each time
19. **Collision layer integration**:
    ```javascript
    // Check collision layer assignments
    game.player.collisionLayer  // 1 (PLAYER)
    game.enemies[0].collisionLayer  // 2 (ENEMY)
    
    // Check collision matrix
    canCollide(COLLISION_LAYER.PLAYER, COLLISION_LAYER.ENEMY)  // true
    canCollide(COLLISION_LAYER.ENEMY, COLLISION_LAYER.WALL)  // true
    
    // Enemies have collision masks set correctly
    game.enemies[0].collisionMask  // Should include PLAYER, WALL, etc.
    ```
20. **Visual polish verification**:
    - Enemy direction indicators point in movement direction
    - Health bars always visible above enemies
    - Enemy colors distinct and readable
    - Slime (green) vs Goblin (lime) should be clearly different
    - Enemies don't overlap walls when spawning
    - All enemies visible on screen (camera should show them)

### Expected Results:
- ✅ Enemies spawn correctly (2-4 per game)
- ✅ Enemy AI activates within 200px
- ✅ Enemies chase player smoothly
- ✅ Enemies stop at 30px attack range
- ✅ Enemies can't walk through walls
- ✅ Health bars render correctly
- ✅ Collision debug shows enemy circles and aggro range
- ✅ Enemy death awards gold and XP
- ✅ Debug UI shows enemy count and kills
- ✅ No combat damage yet (Commit 8)
- ✅ Performance stays at 60 FPS with all enemies active

---

## 🎯 Previous Testing Instructions (Commit 6)

1. **Open the game** - Load `index.html` in a modern browser
2. **Check UI** - Verify all UI elements are visible:
   - Stats panel (top-left) showing player values
   - Health: 100/100, ATK: 10, DEF: 5, LVL: 1, Gold: 0, Floor: 1
   - Control buttons (bottom-right)
   - Welcome screen showing "Commit 6: Collision System Enhanced ✓"
3. **Test basic controls**:
   - Click "Start Adventure" - Should generate dungeon and spawn player
   - Dungeon renders with 3 rooms
   - Player spawns in start room center
   - FPS counter should update (~60 FPS)
   - Top instruction text: "WASD: Move • V: Toggle Collision Debug • G: Toggle Grid"
   - Bottom-left debug shows 8 active systems (including "✓ Collision System")
4. **Test collision debug visualization (MAIN TEST)**:
   - **Press 'V' key** - Toggles collision debug mode
   - Console should log: "🔍 Collision debug: ON" or "OFF"
   - When ON:
     * Green circle appears around player (collision bounds)
     * Label "PLAYER" appears next to player
     * Player collision circle should match player sprite size (16px radius)
     * Debug UI shows "[V] Collision: ON" in bottom-left
     * Debug UI shows "Layer: PLAYER" in bottom-right
   - **Press 'V' again** - Turns OFF collision debug
     * Green circle disappears
     * Debug indicator disappears from UI
5. **Test grid debug visualization**:
   - **Press 'G' key** - Toggles grid debug mode
   - Console should log: "📐 Grid debug: ON" or "OFF"
   - When ON:
     * Grid overlay appears (not yet implemented in this commit - ready for future use)
     * Debug UI shows "[G] Grid: ON" in bottom-left
   - **Press 'G' again** - Turns OFF grid debug
6. **Test collision detection utilities** (Console - F12):
   ```javascript
   // Test circle collision
   Utils.circleCollision(100, 100, 20, 110, 110, 20)  // true (overlapping)
   Utils.circleCollision(100, 100, 20, 200, 200, 20)  // false (not touching)
   
   // Test circle-rect collision
   Utils.circleRectCollision(100, 100, 16, 80, 80, 40, 40)  // true (overlapping)
   Utils.circleRectCollision(100, 100, 16, 200, 200, 40, 40)  // false (not touching)
   
   // Test point containment
   Utils.pointInCircle(105, 105, 100, 100, 20)  // true (inside circle)
   Utils.pointInRect(120, 120, 100, 100, 50, 50)  // true (inside rect)
   
   // Test overlap detection
   Utils.getRectOverlap(100, 100, 50, 50, 120, 120, 50, 50)
   // Returns: {x: 30, y: 30} (overlap dimensions)
   
   // Test penetration depth
   Utils.getCirclePenetration(100, 100, 20, 110, 110, 20)
   // Returns penetration depth value
   ```
7. **Test collision layers**:
   ```javascript
   // Check collision layer constants
   COLLISION_LAYER.PLAYER    // 1
   COLLISION_LAYER.ENEMY     // 2
   COLLISION_LAYER.PROJECTILE // 4
   COLLISION_LAYER.ITEM      // 8
   COLLISION_LAYER.WALL      // 16
   COLLISION_LAYER.TRIGGER   // 32
   
   // Check player collision setup
   game.player.collisionLayer  // 1 (PLAYER layer)
   game.player.collisionMask   // Bitmask showing what player can collide with
   
   // Test canCollide function
   canCollide(COLLISION_LAYER.PLAYER, COLLISION_LAYER.ENEMY)  // true
   canCollide(COLLISION_LAYER.PLAYER, COLLISION_LAYER.PROJECTILE)  // false
   ```
8. **Test CollisionDebugger methods** (Console):
   ```javascript
   // Get context
   const ctx = game.ctx
   game.camera.apply(ctx)
   
   // Draw debug circle
   CollisionDebugger.drawCircle(ctx, 200, 200, 30)
   
   // Draw debug rectangle
   CollisionDebugger.drawRect(ctx, 300, 300, 60, 60)
   
   // Draw debug line
   CollisionDebugger.drawLine(ctx, 100, 100, 200, 200)
   
   // Draw debug point
   CollisionDebugger.drawPoint(ctx, 150, 150)
   
   // Draw debug text
   CollisionDebugger.drawText(ctx, 'TEST', 400, 400)
   ```
9. **Test movement with collision debug ON**:
   - Press 'V' to enable collision debug
   - Move player with WASD
   - Green collision circle should follow player smoothly
   - Circle should align perfectly with player sprite
   - When near walls, observe collision circle touching wall edges
   - Circle should never overlap walls (collision working)
10. **Visual checks with debug modes**:
    - Both debug modes (V and G) can be ON simultaneously
    - Debug UI shows both indicators when both are active
    - Debug visualizations render in world space (move with camera)
    - Debug text labels are readable and positioned correctly
    - Collision debug color: green/lime (rgba(0, 255, 0, 0.6))
11. **Performance test with debug modes**:
    - Enable collision debug (V key)
    - Move continuously through all rooms
    - FPS should stay around 60 FPS
    - No performance degradation from debug rendering
    - Debug visualizations update in real-time
12. **CONFIG.DEBUG object test** (Console):
    ```javascript
    // Check debug configuration
    CONFIG.DEBUG.SHOW_COLLISION  // true or false
    CONFIG.DEBUG.SHOW_GRID       // true or false
    CONFIG.DEBUG.SHOW_FPS        // true
    CONFIG.DEBUG.COLLISION_COLOR // 'rgba(0, 255, 0, 0.5)'
    CONFIG.DEBUG.GRID_COLOR      // 'rgba(255, 215, 0, 0.1)'
    
    // Manually toggle debug modes
    CONFIG.DEBUG.SHOW_COLLISION = true  // Force collision debug ON
    CONFIG.DEBUG.SHOW_GRID = true       // Force grid debug ON
    ```
13. **Test collision system integration**:
    - Existing dungeon wall collision still works
    - Player collision layer doesn't interfere with wall collision
    - No regression in movement or collision behavior from Commit 5
    - All 3 rooms still accessible
    - Door traversal still works
14. **Debug UI verification**:
    - 8 systems listed (added "✓ Collision System")
    - Debug indicators show/hide correctly with V and G keys
    - "Layer: PLAYER" shows when collision debug is ON
    - All debug text readable and non-overlapping
15. **Instruction text verification**:
    - Top bar shows: "WASD: Move • V: Toggle Collision Debug • G: Toggle Grid"
    - Controls accurately reflect new debug features
    - Text fits on screen without overflow

1. **Open the game** - Load `index.html` in a modern browser
2. **Check UI** - Verify all UI elements are visible:
   - Stats panel (top-left) showing player values
   - Health: 100/100, ATK: 10, DEF: 5, LVL: 1, Gold: 0, Floor: 1
   - Control buttons (bottom-right)
   - Welcome screen showing "Commit 5: Dungeon Rooms Generated ✓"
3. **Test basic controls**:
   - Click "Start Adventure" - Should generate dungeon and spawn player
   - Watch dungeon render with 3 visible rooms
   - Player spawns in left room (start room) center
   - Observe dungeon tiles: walls (gray), floors (darker gray), doors (brown)
   - Camera centered on player in start room
   - FPS counter should update (~60 FPS)
   - Top instruction text: "Use WASD or Arrow Keys to move • Explore the dungeon"
   - Bottom-left debug shows 7 active systems (including "✓ Dungeon Generation")
4. **Test dungeon rendering (MAIN TEST)**:
   - **Start room (left)**: 8x7 tiles, rectangular, gray walls, dark floors
   - **Normal room (center)**: 10x9 tiles, larger than start, connected by door
   - **Boss room (right)**: 8x7 tiles, same size as start, connected by door
   - **Doors**: Brown tiles with golden highlights connecting rooms
   - **Walls**: Dark gray (#404040) with subtle black borders for depth
   - **Floors**: Darker gray (#2a2a2a) for contrast
   - All tiles should be 40x40 pixels (CONFIG.TILE_SIZE)
5. **Test wall collision**:
   - Try moving into walls in any direction
   - Player should STOP at walls, not pass through
   - Player can slide along walls (move parallel to them)
   - Collision should feel solid and responsive
   - Test all 4 walls of each room
   - Test corners - player shouldn't get stuck
6. **Test door traversal**:
   - Move player to door between start room and normal room
   - Player should walk through door freely (no collision)
   - Move to door between normal room and boss room
   - Player should walk through door to boss room
   - Doors act as walkable connectors between rooms
   - Camera follows smoothly through doors
7. **Test room exploration**:
   - Explore all 3 rooms (start, normal, boss)
   - Debug UI should show current room type:
     * "Room: start" when in left room
     * "Room: normal" when in center room
     * "Room: boss" when in right room
   - Debug UI shows "Rooms: 3" (total room count)
   - Player position updates correctly in all rooms
8. **Test player spawn**:
   - Click "Reset" button
   - Player should respawn at start room center (not canvas center)
   - Start room is always the left room
   - Player spawns away from walls (in open floor space)
9. **Visual checks**:
   - Walls have subtle borders for depth
   - Doors have golden highlight borders (rgba(255, 215, 0, 0.5))
   - Floor tiles are uniformly colored
   - No visual glitches or tile gaps
   - Tiles align perfectly to 40px grid
10. **Camera and scrolling**:
    - Move player around dungeon
    - Camera smoothly follows player
    - Stats panel stays in place (screen space)
    - Dungeon tiles scroll with camera (world space)
    - Can see all 3 rooms when zoomed out
11. **Movement with collision**:
    - Test 8-directional movement still works
    - Diagonal movement into walls should slide along wall
    - Movement speed unchanged (150 px/s)
    - Animation states still work (idle/walk)
    - Direction indicator updates correctly
12. **Console testing** (F12):
    ```javascript
    // Access dungeon
    game.dungeon
    
    // Check dungeon properties
    game.dungeon.rooms.length  // Should be 3
    game.dungeon.floor  // Should be 1
    
    // Check current room
    game.dungeon.getRoomAt(game.player.x, game.player.y)
    // Should return room object with type: 'start', 'normal', or 'boss'
    
    // Test collision detection
    game.dungeon.checkCircleCollision(game.player.x, game.player.y, 16)
    // Should be false (player not in wall)
    
    // Check tiles
    game.dungeon.tiles.size  // Should show total tile count
    
    // Test isWalkable
    game.dungeon.isWalkable(game.player.x, game.player.y)  // Should be true
    ```
13. **Performance test**:
    - Move continuously through all rooms
    - FPS should stay around 60 FPS
    - No lag when rendering dungeon
    - Smooth collision detection
    - No stuttering when crossing doors
14. **Edge case tests**:
    - Try walking diagonally into corners - Should not get stuck
    - Rapid direction changes near walls - Should handle smoothly
    - Walk along entire perimeter of each room
    - Test all door entrances from both sides
    - Try moving into walls from all angles
15. **Dungeon structure verification**:
    - Verify 3 rooms are visible and connected
    - No floating walls or disconnected tiles
    - Door alignment is correct (rooms connect properly)
    - Room sizes are correct (start: 8x7, normal: 10x9, boss: 8x7)
    - Rooms don't overlap each other

## 📊 Commit Progress

- [x] **Commit 1** - Basic HTML Structure and Canvas Setup
- [x] **Commit 2** - Game Class and Core Initialization
- [x] **Commit 3** - Player Character and Rendering
- [x] **Commit 4** - Movement Controls and Physics
- [x] **Commit 5** - Dungeon Room Generation
- [x] **Commit 6** - Enhanced Collision Detection
- [ ] **Commit 7** - Enemy System
- [ ] **Commit 8** - Combat and Health
- [ ] **Commit 9** - Loot and Items
- [ ] **Commit 10** - Inventory System
- [ ] **Commit 11** - Equipment System
- [ ] **Commit 12** - Character Stats
- [ ] **Commit 13** - Leveling System
- [ ] **Commit 14** - Enemy AI
- [ ] **Commit 15** - Multiple Floors
- [ ] **Commit 16** - Boss Encounters
- [ ] **Commit 17** - Special Abilities
- [ ] **Commit 18** - Particle Effects
- [ ] **Commit 19** - Sound System
- [ ] **Commit 20** - Save/Load System
- [ ] **Commit 21+** - Polish and Advanced Features

## 🔧 Development Notes

### Commit 1 Details
- Canvas is set to 800x600 for optimal gameplay visibility
- Grid is 40x40 pixels per tile (20 tiles wide, 15 tiles tall)
- UI uses absolute positioning for overlay elements
- Game loop uses requestAnimationFrame for smooth 60 FPS
- Delta time calculation for frame-independent movement (will be used in later commits)
- Modal screens use flexbox for centered content
- Stats panel shows placeholder values until player system is implemented
- Debug panel tracks FPS and game state for development
- CSS uses dark theme with gold accents for dungeon atmosphere
- Responsive breakpoints at 768px for mobile devices

### Commit 2 Details
- CONFIG object contains 50+ game constants organized by category
- Tile size: 40px, Grid: 20x15, Target FPS: 60
- Player starting stats: 100 HP, 10 ATK, 5 DEF, 150 speed
- Floor difficulty multiplier: 1.2 (20% harder each floor)
- Utils library provides reusable math functions
- Distance, angle, lerp, clamp helpers
- Random int/float generators
- AABB collision detection
- Grid/world coordinate conversion
- InputManager tracks all keyboard and mouse input
- Supports WASD, arrows, ESC, I, C keys
- Mouse position in canvas and world space
- Click detection for combat
- Camera system with smooth following
- Lerp-based smooth movement (speed: 5)
- Dead zone: 100px from center
- Separate world/screen space transforms
- GameStats tracks 7 different statistics
- Time played, kills, gold, damage, items, floors
- Updates in real-time during gameplay
- Enhanced game loop prevents "spiral of death"
- Delta time clamping to MAX_DELTA_TIME (0.1s)
- Separate update/render for all entity types
- Entity arrays ready for future systems

### Commit 3 Details
- Player class with complete implementation (12 properties)
- Starting position: canvas center (400, 300)
- Health system: 100 HP max, color-coded health bar
- Stats: 10 ATK, 5 DEF, 150 speed, Level 1, 0 gold
- Visual rendering: 16px blue circle with white border
- Direction indicator: small white dot showing facing direction
- Health bar: 40px wide, 6px tall, positioned 15px above player
- Health colors: green (>60%), yellow (30-60%), red (<30%)
- takeDamage() applies defense reduction: finalDamage = max(1, damage - defense)
- heal() caps at maxHealth, returns amount healed
- addGold() increments gold counter with console log
- Death detection: sets isDead flag when health reaches 0
- Game over trigger: automatically ends game on player death
- Camera auto-follows player smoothly with lerp
- Animation state property: 'idle' (ready for walk/attack in future)
- animationTimer property: tracks elapsed time for animations
- Console logging for all significant events (damage, heal, gold, death)
- Integrated with game update loop and render pipeline
- Stats panel now shows real player values instead of CONFIG placeholders

### Commit 4 Details
- Movement system uses velocity-based physics (vx, vy properties)
- Input handling: WASD (w/a/s/d) and Arrow keys (ArrowUp/ArrowDown/ArrowLeft/ArrowRight)
- Diagonal movement normalized: multiplied by 0.707 (1/√2) for consistent speed
- Direction calculation: Math.atan2(moveY, moveX) in radians
- Position update: x += vx * deltaTime, y += vy * deltaTime
- Speed: 150 pixels per second from CONFIG.PLAYER.START_SPEED
- Canvas boundary clamping: keeps player within bounds (temporary until walls)
- Min X/Y: player.size (16px), Max X/Y: canvas dimension - player.size
- Animation state: 'idle' when stationary, 'walk' when moving
- isMoving flag: true when moveX !== 0 or moveY !== 0
- Instant velocity change: no acceleration/deceleration (arcade-style)
- Direction indicator updates in real-time with movement
- handleMovement() method: processes input, calculates movement, applies physics
- Update signature: update(deltaTime, input, canvas) - passes required systems
- Debug UI additions: State, Position (x,y), Velocity (vx,vy)
- Movement works immediately on key press, stops on key release
- Camera smoothly follows player movement via existing camera system
- Grid scrolls correctly as player moves around canvas
- All 8 directions supported (N, NE, E, SE, S, SW, W, NW)

### Commit 5 Details
- Tile-based dungeon system with 40x40px tiles (matching CONFIG.TILE_SIZE)
- Three tile types: FLOOR (walkable), WALL (solid), DOOR (walkable connector)
- Tile class: stores grid position (x,y), world position, type, and color
- Room class: generates rectangular rooms with walls on edges, floors inside
- Dungeon class: manages multiple rooms, tile map (Map for O(1) lookup)
- Simple 3-room linear layout for Commit 5:
  * Start room (left): 8x7 tiles at grid position (2, 5)
  * Normal room (center): 10x9 tiles at grid position (12, 4)
  * Boss room (right): 8x7 tiles at grid position (24, 5)
- Door connections: Start↔Normal, Normal↔Boss at aligned positions
- Room.addDoor(x, y, direction): converts wall tile to door tile
- Dungeon.buildTileMap(): creates Map of "x,y" -> Tile for fast collision
- Dungeon.getTileAt(gridX, gridY): retrieves tile from map
- Dungeon.getTileAtWorld(worldX, worldY): converts world coords to grid, gets tile
- Dungeon.isWalkable(worldX, worldY): checks if position is FLOOR or DOOR
- Dungeon.isSolid(worldX, worldY): checks if position is WALL
- Dungeon.checkCircleCollision(x, y, radius): checks 8 points around circle edge
- Circle collision checks: 4 cardinal points + 4 diagonal points (* 0.707)
- Player.handleMovement() updated: uses dungeon.checkCircleCollision()
- Separate X and Y collision checks: allows sliding along walls
- Player spawns at start room center: startRoom.getCenterWorld()
- Dungeon.render(ctx): draws all tiles in all rooms with colors
- Wall tiles: dark gray (#404040) with subtle black borders for depth
- Floor tiles: darker gray (#2a2a2a) for contrast
- Door tiles: brown (#8b4513) with golden highlight borders
- Dungeon.getRoomAt(worldX, worldY): determines which room player is in
- Room.containsPoint(worldX, worldY): checks if world position is inside room
- Debug UI shows: current room type, total room count
- Canvas boundary checking removed: dungeon walls now handle all collision
- Game.initGameData() generates new Dungeon(currentFloor)
- Game.update() passes dungeon to player.update() instead of canvas
- Collision is smooth: player can't phase through walls or into rooms without doors

### Commit 6 Details
- Enhanced Utils object with 7 new collision detection methods
- Utils.circleCollision(x1, y1, r1, x2, y2, r2): circle-to-circle collision
- Utils.circleRectCollision(cx, cy, radius, rx, ry, rw, rh): circle-to-AABB collision
- Utils.pointInCircle(px, py, cx, cy, radius): point containment in circle
- Utils.pointInRect(px, py, rx, ry, rw, rh): point containment in rectangle
- Utils.getRectOverlap(x1, y1, w1, h1, x2, y2, w2, h2): calculates overlap between AABBs
- Utils.getCirclePenetration(x1, y1, r1, x2, y2, r2): penetration depth for circles
- Utils.pushCirclesApart(obj1, obj2, penetration): collision response push
- Collision layer system: 6 layers (PLAYER, ENEMY, PROJECTILE, ITEM, WALL, TRIGGER)
- Collision layers use bitwise flags: PLAYER=1, ENEMY=2, PROJECTILE=4, ITEM=8, WALL=16, TRIGGER=32
- COLLISION_MATRIX defines which layers can collide with each other
- canCollide(layer1, layer2) function checks layer compatibility
- Player assigned COLLISION_LAYER.PLAYER and collision mask from matrix
- CONFIG.DEBUG object added with SHOW_COLLISION, SHOW_GRID, COLLISION_COLOR settings
- CollisionDebugger class with 5 static visualization methods
- CollisionDebugger.drawCircle(): renders circle collision bounds
- CollisionDebugger.drawRect(): renders rectangle collision bounds
- CollisionDebugger.drawLine(): renders debug lines
- CollisionDebugger.drawPoint(): renders debug points
- CollisionDebugger.drawText(): renders debug text labels
- Player.render() enhanced with collision debug visualization
- Press 'V' key to toggle collision debug mode (shows collision circles/rectangles)
- Press 'G' key to toggle grid debug mode (shows tile grid)
- Debug UI shows "[V] Collision: ON" and "[G] Grid: ON" when active
- Debug UI shows collision layer info when collision debug active
- Instruction text updated to show "V: Toggle Collision Debug", "G: Toggle Grid"
- Console logging for debug mode toggling
- Foundation ready for enemy collision (Commit 7) and projectile collision (Commit 8)
- Collision system supports future trigger zones and item pickups

### Next Steps (Commit 7)
- Create Enemy base class with stats and behavior
- Implement 3+ enemy types (slime, skeleton, goblin)
- Enemy spawning system in dungeon rooms
- Enemy AI movement toward player
- Enemy collision with walls and other entities
- Enemy health bars and death animations
- Enemy rendering with different colors per type

## 📝 License

This game is part of the Multi-Game-Repo-playground collection.

## 🎨 Credits

- **Developer:** Incremental development over 20+ commits
- **Game Type:** Dungeon Crawler RPG
- **Inspiration:** Classic roguelikes and dungeon crawlers

---

**Current Status:** Commit 8/20+ Complete ✓  
**Next Commit:** Loot and Item Drops System
