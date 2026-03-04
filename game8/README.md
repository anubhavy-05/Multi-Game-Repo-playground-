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
- Added CONFIG object with comprehensive game constants
  - Canvas, tile, and FPS settings
  - Player starting stats (health, attack, defense, speed, gold, level)
  - Dungeon generation parameters (room size, count ranges)
  - Camera settings (smooth factor, deadzone)
  - Combat parameters (cooldown, knockback, damage variance)
  - Item drop chances (gold, potions, equipment)
- Implemented utility functions (Utils class)
  - Random number generation (float and integer)
  - Distance and angle calculations
  - Clamping and linear interpolation (lerp)
  - Rectangle overlap detection (AABB collision)
- Created InputManager class
  - Keyboard input tracking (keys pressed/released)
  - Mouse position tracking (screen and world coordinates)
  - Mouse button states
  - Movement input helpers (WASD/Arrow keys)
  - Context menu prevention for right-click
- Implemented Camera system
  - Smooth camera following with lerp
  - Target tracking (follows player)
  - Camera transform application to canvas
  - Screen-to-world coordinate conversion
- Added GameStats class
  - Tracks enemies killed, gold collected, damage dealt/taken
  - Floors cleared, bosses killed, items collected
  - Time played counter with formatted display
  - Statistics reset functionality
- Enhanced Game class initialization
  - Integrated input manager, camera, and stats systems
  - Created entity arrays (enemies, items, projectiles, particles)
  - Added player resource tracking (gold, health, attack, defense, level, XP)
  - Dungeon state management (floor number, dungeon reference)
- Improved game loop
  - Delta time clamping to prevent physics bugs
  - Stats update (time tracking)
  - Camera update and mouse world position calculation
  - Entity update loops (prepared for future commits)
  - Automatic game over detection
- Enhanced rendering pipeline
  - Camera transform for world rendering
  - Separate world and UI rendering
  - Debug overlays (camera position, mouse world coords)
  - Prepared render loops for all entity types
- Comprehensive reset system
  - Resets all player stats and resources
  - Clears all entity arrays
  - Resets camera position
  - Resets game statistics
- Game over system with statistics display

**Features in Commit 2:**
- ✅ CONFIG object with 50+ game constants
- ✅ Utility functions for math and collision
- ✅ Input manager for keyboard and mouse
- ✅ Camera system with smooth following
- ✅ Statistics tracking system
- ✅ Entity arrays for game objects
- ✅ Player resource management
- ✅ Enhanced game loop with delta clamping
- ✅ Camera-based rendering pipeline
- ✅ World-to-screen coordinate conversion
- ✅ Comprehensive reset functionality
- ✅ Game over system

### 📋 Planned Commits (3-20+)

**Commit 2: Create Game Class and Core Initialization**
- Configuration constants for game mechanics
- Utility functions (math, collision, random)
- Enhanced input handling (keyboard, mouse with world coords)
- Camera system with smooth following
- Game statistics tracking (kills, gold, time, etc.)
- Entity arrays for all game objects
- Resource management (health, gold, XP, etc.)
- Delta time clamping for stable physics

**Commit 3: Implement Player Character and Rendering**
- Player class with position and stats
- Sprite rendering
- Animation states (idle, walk, attack)
- Health and stats system

**Commit 4: Movement Controls and Player Physics**
- WASD/Arrow key movement
- Smooth movement with delta time
- Speed and acceleration
- Direction facing

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

## 🎯 Current Testing Instructions (Commit 2)

1. **Open the game** - Load `index.html` in a modern browser
2. **Check UI updates** - Header should show "Commit 2"
3. **Open browser console** (F12) - Should see:
   - "🎮 Dungeon Crawler RPG - Commit 2: Core Initialization"
   - "Systems initialized: Input, Camera, Stats"
4. **Test game start**:
   - Click "Start Adventure"
   - Canvas should show "Commit 2: Core Systems Active ✓"
   - Should see "✓ Input Manager ✓ Camera System ✓ Stats Tracker"
5. **Test input system**:
   - Move mouse over canvas - Check bottom-left for mouse coordinates
   - Press WASD keys - Input manager is tracking (will be used in Commit 4)
6. **Test camera system**:
   - Camera position shown at bottom-left: "Camera: (0, 0)"
   - Mouse world position shown: "Mouse: (x, y)"
7. **Test stats tracking**:
   - Stats panel shows initial values (HP: 100/100, ATK: 10, DEF: 5, etc.)
   - All values should be populated from CONFIG constants
8. **Test game controls**:
   - Pause/Resume should work
   - ESC key should pause
   - Reset should reset all stats to initial values
9. **Check FPS counter** - Should display steady 60 FPS
10. **Verify systems**:
    - Input system tracks keyboard/mouse
    - Camera system ready for player following
    - Stats system tracking time played (will increment when playing)

## 📊 Commit Progress

- [x] **Commit 1** - Basic HTML Structure and Canvas Setup
- [x] **Commit 2** - Game Class and Core Initialization
- [ ] **Commit 3** - Player Character and Rendering
- [ ] **Commit 4** - Movement Controls and Physics
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
- CONFIG object contains all tunable game parameters in one place
- Input manager tracks all keys simultaneously (no polling delay)
- Mouse coordinates converted to world space automatically
- Camera uses lerp for smooth following (factor: 0.1)
- Delta time clamped to 0.1s max to prevent physics tunneling
- Stats tracker updates time played every frame
- Entity arrays use reverse iteration for safe removal during updates
- Utils class provides reusable math functions across all game code
- Camera transform applied before world rendering, reset before UI
- Game over automatically triggers when health <= 0
- All systems initialized in constructor for immediate availability
- Resource values (gold, health, etc.) stored in Game class for easy access
- Experience system prepared with experienceToNext calculation
- Floor progression system ready for dungeon generation

### Next Steps (Commit 3)
- Create Player class with position, size, and sprite
- Implement player rendering with color/shape
- Add player stats integration (health, attack, defense from Game class)
- Display player at spawn position
- Add player direction facing (for animation)
- Initialize player when game starts
- Camera will automatically follow player (system ready)

## 📝 License

This game is part of the Multi-Game-Repo-playground collection.

## 🎨 Credits

- **Developer:** Incremental development over 20+ commits
- **Game Type:** Dungeon Crawler RPG
- **Inspiration:** Classic roguelikes and dungeon crawlers

---

**Current Status:** Commit 2/20+ Complete ✓  
**Next Commit:** Player Character and Rendering System
