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

### 📋 Planned Commits (5-20+)

**Commit 5: Dungeon Room Generation System**
- Procedural dungeon layout
- Room templates (start, normal, boss, treasure)
- Wall and floor tiles
- Doors between rooms

**Commit 6: Collision Detection System**
- AABB collision detection
- Wall collision
- Tile-based collision system
- Player boundary checking

**Commit 7: Enemy System Implementation**
- Enemy classes (slime, skeleton, goblin)
- Enemy spawning system
- Enemy stats (HP, ATK, DEF, speed)
- Enemy rendering

**Commit 8: Combat System and Health**
- Attack mechanics
- Damage calculation
- Health bars
- Death system
- Attack cooldowns

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

## 🎯 Current Testing Instructions (Commit 4)

1. **Open the game** - Load `index.html` in a modern browser
2. **Check UI** - Verify all UI elements are visible:
   - Stats panel (top-left) showing player values
   - Health: 100/100, ATK: 10, DEF: 5, LVL: 1, Gold: 0, Floor: 1
   - Control buttons (bottom-right)
   - Welcome screen showing "Commit 4: Movement Controls Active ✓"
3. **Test basic controls**:
   - Click "Start Adventure" - Should spawn player at center
   - Watch player render as blue circle with white border
   - Observe health bar above player (green, full)
   - Camera should be centered on player
   - FPS counter should update (~60 FPS)
   - Top instruction text: "Use WASD or Arrow Keys to move"
   - Bottom-left debug shows 6 active systems (including "✓ Movement Controls")
4. **Test movement (MAIN TEST)**:
   - **W or ↑**: Player moves UP
   - **S or ↓**: Player moves DOWN
   - **A or ←**: Player moves LEFT
   - **D or →**: Player moves RIGHT
   - **W+D or ↑+→**: Player moves NORTHEAST (diagonal)
   - **W+A or ↑+←**: Player moves NORTHWEST (diagonal)
   - **S+D or ↓+→**: Player moves SOUTHEAST (diagonal)
   - **S+A or ↓+←**: Player moves SOUTHWEST (diagonal)
   - All 8 directions should work smoothly
   - Movement speed should feel consistent (150 px/s)
5. **Visual feedback during movement**:
   - Player's direction indicator (white dot) rotates to face movement direction
   - Player animationState changes to "walk" (visible in debug)
   - Player position updates in debug UI: "Pos: (x, y)"
   - Velocity shows in debug UI: "Vel: (vx, vy)"
   - Camera smoothly follows player movement
   - Grid scrolls as player moves (world space)
6. **Boundary testing**:
   - Move to TOP edge - Player should stop at top boundary
   - Move to BOTTOM edge - Player should stop at bottom boundary
   - Move to LEFT edge - Player should stop at left boundary
   - Move to RIGHT edge - Player should stop at right boundary
   - Player should never leave the visible canvas area
7. **Diagonal movement verification**:
   - Press W+D together (northeast diagonal)
   - Speed should be SAME as moving straight (not faster)
   - Direction indicator should point northeast (45° angle)
   - Velocity should be ~106 px/s in both X and Y (normalized)
8. **Idle state testing**:
   - Move player, then release all keys
   - animationState should change to "idle"
   - Velocity should show (0, 0)
   - Direction indicator should remain at last movement direction
   - Player should stop immediately (no sliding/momentum)
9. **Debug UI checks** (bottom-left):
   - Should show "✓ Movement Controls" in system list
   - Player state shows: "State: walk" when moving, "State: idle" when stopped
   - Position updates in real-time: "Pos: (x, y)"
   - Velocity shows: "Vel: (0, 0)" when idle, "(vx, vy)" when moving
10. **Camera following**:
    - Move player around canvas
    - Camera should smoothly follow player with slight lag
    - Stats panel stays in place (screen space)
    - Grid scrolls with camera (world space)
11. **Pause/Resume with movement**:
    - While moving, click "Pause" - Movement should stop
    - Click "Resume" or press ESC - Can move again
    - Movement state should persist correctly
12. **Console testing** (F12):
    ```javascript
    // Access player
    game.player
    
    // Check velocity properties
    game.player.vx  // Should be 0 when idle, non-zero when moving
    game.player.vy  // Should be 0 when idle, non-zero when moving
    
    // Check animation state
    game.player.animationState  // "idle" or "walk"
    
    // Check direction (in radians)
    game.player.direction  // Updates based on movement direction
    
    // Test movement methods still work
    game.player.takeDamage(20)  // Health should decrease
    game.player.heal(10)  // Health should increase
    game.player.addGold(50)  // Gold should increase
    ```
13. **Performance test**:
    - Move continuously in all directions
    - FPS should stay around 60 FPS
    - No lag or stuttering
    - Smooth camera follow
14. **Edge case tests**:
    - Press multiple keys simultaneously (W+A+S+D) - Should handle gracefully
    - Rapidly switch directions - Should respond immediately
    - Hold key at boundary - Should stay at edge without jittering
    - Move to corner (top-left, top-right, etc.) - Should clamp correctly

## 📊 Commit Progress

- [x] **Commit 1** - Basic HTML Structure and Canvas Setup
- [x] **Commit 2** - Game Class and Core Initialization
- [x] **Commit 3** - Player Character and Rendering
- [x] **Commit 4** - Movement Controls and Physics
- [ ] **Commit 5** - Dungeon Room Generation
- [ ] **Commit 6** - Collision Detection
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

### Next Steps (Commit 5)
- Generate procedural dungeon layout
- Create room system with walls and floors
- Tile-based dungeon rendering
- Room connections and doorways
- Remove canvas boundary check (use dungeon walls)
- Player collision with dungeon walls
- Starting room design

## 📝 License

This game is part of the Multi-Game-Repo-playground collection.

## 🎨 Credits

- **Developer:** Incremental development over 20+ commits
- **Game Type:** Dungeon Crawler RPG
- **Inspiration:** Classic roguelikes and dungeon crawlers

---

**Current Status:** Commit 4/20+ Complete ✓  
**Next Commit:** Dungeon Room Generation System
