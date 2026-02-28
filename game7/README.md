# 🏰 Castle Defenders - Tower Defense RPG

A complex, feature-rich tower defense game with RPG elements, built incrementally over 25+ commits.

## 🎮 Game Concept

Defend your castle from waves of enemies using strategic tower placement, hero abilities, and resource management. Combine tower defense strategy with RPG progression and special abilities.

## 🚧 Development Progress

### ✅ Completed Commits

**Commit 1: Basic HTML Structure and Canvas Setup**
- Created game7 folder structure
- HTML file with canvas and UI overlay
- CSS with gradient background and responsive design
- Basic JavaScript initialization
- Game state management foundation
- UI stats display (Gold, Mana, Lives, Wave)

**Commit 2: Create Game Class and Core Initialization**
- Implemented main Game class with OOP architecture
- Added CONFIG object with game constants
- Enhanced game state management system
- Mouse and keyboard event handlers
- Input tracking (mouse position, grid coordinates)
- Game control functions (start, pause, reset)
- Resource management methods (gold, mana, lives)
- Welcome screen with instructions
- Arrays for future game objects (towers, enemies, projectiles, particles)

**Commit 3: Implement Game Loop and Rendering System**
- RequestAnimationFrame game loop with 60 FPS target
- Delta time calculation for smooth animations
- Separate update() and render() functions
- Background rendering with gradient sky and ground
- Grid system with visual guides (40x40 pixel cells)
- Hovered cell highlighting
- Pause overlay with visual feedback
- Game over screen with stats display
- Debug info panel (FPS, frame count, mouse position, commit progress)
- FPS-independent game logic foundation

**Commit 4: Create Path and Grid System**
- Initialized 20x15 grid system (40px cells)
- Implemented waypoint-based path system with 8 waypoints
- Path rendering with brown tiles and borders
- Spawn point at grid position (0,7) with pulsing red effect
- Castle endpoint at grid position (19,5) with tower and flag
- Grid cell property system (isPath, isBuildable, hasTower)
- Real-time buildable zone highlighting (green=yes, red=no)
- Path connectivity validation between waypoints
- Debug panel shows build status for hovered cell
- Foundation for enemy pathfinding and tower placement

**Commit 5: Implement Tower Placement System**
- Created Tower class with OOP architecture
- Added 4 tower types with unique stats:
  - 🏹 Archer Tower: Fast attack (20 gold)
  - 🔮 Mage Tower: AOE damage (30 gold)
  - 💣 Cannon Tower: Splash damage (40 gold)
  - ⚡ Lightning Tower: Chain lightning (50 gold)
- Tower selection menu UI with visual feedback
- Ghost tower preview showing range and placement validity
- Tower placement validation (buildable zones, gold cost)
- Gold deduction system when placing towers
- Tower rendering with icons, colors, and pulse effects
- Level indicator support for future upgrades
- Range visualization for placed towers
- Button states (enabled/disabled/selected) based on gold
- Tower update loop integrated into game loop
- Tower array management and grid cell updates

**Commit 6: Enemy Spawning and Movement System**
- Created Enemy class with waypoint-based pathfinding
- Added 4 enemy types with scaling difficulty:
  - 👾 Basic Enemy: Standard speed and health
  - 💨 Fast Enemy: High speed, low health
  - 🛡️ Tank Enemy: Slow but tanky, deals 3 damage
  - 🦅 Flying Enemy: Medium stats (future: bypass some towers)
- Wave management system with auto-progression
- Enemy spawning at timed intervals (2s between spawns)
- Smooth movement along 8-waypoint path
- Health bars above enemies (green/red gradient)
- Flash effect when enemies take damage
- Enemy health scales with wave number (+15% per wave)
- Enemies per wave increases (5 + wave * 2)
- Castle damage system when enemies reach end
- Gold rewards when enemies are killed
- Score tracking (gold reward * 10)
- Wave completion bonus gold (10 + wave * 5)
- Auto-start next wave after 5s delay
- Real-time enemy/wave status display
- Enemy rotation based on movement direction
- Proper enemy cleanup (reached end or killed)

**Commit 7: Tower Shooting Mechanics**
- Created Projectile class with homing behavior
- Projectile types with unique visuals per tower:
  - 🏹 Archer: Brown arrow projectiles
  - 🔮 Mage: Purple glowing orbs with glow effect
  - 💣 Cannon: Large black cannonballs
  - ⚡ Lightning: Golden bolts with bright glow
- Tower targeting system (automatic nearest enemy in range)
- Fire rate system with cooldown timers
- Projectile-to-target homing movement
- Collision detection between projectiles and enemies
- Damage application on hit
- Tower barrel visualization showing aim direction
- Automatic shooting when targets are in range
- Projectile lifecycle management (creation, movement, cleanup)
- Visual feedback for tower rotation towards enemies
- Smooth projectile movement with delta time
- Proper cleanup of projectiles after hit or target death

**Commit 8: Particle Effects System**
- Created Particle class with physics-based movement
- Particle types with unique behaviors:
  - 💥 Hit Particles: Impact sparks when projectiles hit enemies
  - 🎆 Death Particles: Explosion bursts when enemies die (15-25 particles)
  - ✨ Gold Particles: Sparkle effects when collecting gold rewards
  - 🔥 Muzzle Flash: Brief flash when towers shoot
- Physics simulation with gravity, friction, and velocity
- Alpha fade-out over particle lifetime
- Color-coded particles matching tower/enemy types
- Projectile hit creates 8-12 colored sparks
- Enemy death creates large explosion with enemy color
- Gold sparkles float upward with ✨ emoji
- Muzzle flash shows at tower position when firing
- Particle lifecycle management (spawn, update, fade, cleanup)
- Smooth particle motion with delta time physics
- Shadow/glow effects on specific particle types
- Automatic cleanup when particles expire
- Integration with combat system (hits, deaths, shots)

**Commit 9: Tower Upgrade System**
- Added Tower upgrade configuration to CONFIG object
- Upgrade constants (MAX_LEVEL: 5, multipliers for stats)
- Tower class upgrade methods:
  - getUpgradeCost(): Calculate cost based on level
  - canUpgrade(): Check if tower can be upgraded
  - upgrade(): Apply stat multipliers and level up
- Tower click selection system
- Visual tower selection with range circle display
- Upgrade UI panel on left side with glassmorphism styling
- Real-time tower stats display (damage, range, fire rate)
- Upgrade button with cost display and validation
- Level indicator rendering (gold "Lv#" text)
- Stat multipliers per level:
  - Damage: ×1.3 per level
  - Range: ×1.1 per level
  - Fire Rate: ×1.15 per level
  - Cost: ×1.5 per level
- Gold validation before allowing upgrades
- Button state management (enabled/disabled at max level)
- Auto-update UI when selecting/deselecting towers
- Enhanced tower visual feedback (selected towers show range)

**Commit 10: Special Abilities System**
- Added ABILITIES configuration to CONFIG object
- 4 unique special abilities with mana costs and cooldowns:
  - 🧊 Ice Freeze: Slows all enemies by 50% for 5s (30 mana, 20s cooldown)
  - ☄️ Meteor Strike: Deals 100 damage in target area (40 mana, 25s cooldown)
  - 💰 Gold Rush: Doubles gold rewards for 10s (20 mana, 30s cooldown)
  - ⏰ Time Warp: Increases tower fire rate by 50% for 7s (35 mana, 22s cooldown)
- Abilities panel UI at bottom with purple glassmorphism styling
- Ability button states (disabled during cooldown or low mana)
- Active ability visual indicators with pulse animation
- Cooldown timer display on buttons
- Meteor targeting system with click-to-cast cursor
- Real-time ability effects:
  - Freeze: Enemy speed reduction with ice overlay and snowflakes
  - Meteor: Particle rain from sky, area damage, impact particles
  - Gold Rush: 2× gold multiplier with sparkle effects
  - Time Warp: Tower fire rate boost with purple glow
- Ability activation with mana cost validation
- setupAbilityButtons() for event handling
- updateAbilities() for cooldown/duration tracking
- castMeteor() for targeted area damage
- drawAbilityEffects() for visual overlays
- Integrated with enemy update loop (freeze effect)
- Integrated with tower update loop (time warp effect)
- Integrated with gold reward system (gold rush multiplier)

**Commit 11: Mana Regeneration System**
- Added mana regeneration constants to CONFIG object
- Mana regeneration settings:
  - MANA_REGEN_PER_SECOND: 0.5 (passive regeneration)
  - MANA_PER_KILL: 2 mana per enemy killed
  - MANA_PER_WAVE: 10 mana bonus on wave completion
  - MAX_MANA: 100 (maximum mana capacity)
- Passive mana regeneration in update loop
- Mana rewards for killing enemies
- Bonus mana for completing waves
- Created Particle type 'mana' with blue heart emoji 💙
- createManaParticles() function for visual feedback
- Updated addMana() to cap at MAX_MANA
- Mana value rounding to 1 decimal place
- Updated UI to show mana as "current/max" format
- Mana particles float upward when enemies are killed
- Visual feedback with blue sparkles and glow
- Integrated with wave completion rewards
- Console logging for wave completion shows mana bonus
- Abilities now sustainable with regeneration system
- Resource management loop complete (gold + mana)

**Commit 12: Boss Enemy System**
- Added boss enemy type to CONFIG.ENEMY_TYPES
- Boss configuration:
  - 👑 Crown icon, 500 base health (scales with wave)
  - 35 speed, 50 gold reward, 5 damage to castle
  - Pink/red color scheme (#FF0066)
  - Larger size (32px vs 16px for normal enemies)
  - isBoss flag for special handling
- Boss wave system (every 5 waves)
- BOSS_WAVE_INTERVAL constant in CONFIG
- Boss warning system:
  - 3-second countdown before boss spawn
  - Flashing red screen overlay
  - "BOSS INCOMING" warning text with countdown timer
  - Suspenseful buildup before battle
- Boss tracking with currentBoss reference
- startWave() detects boss waves
- spawnEnemy() modified to spawn bosses on wave 5, 10, 15, etc.
- updateWave() handles boss warning countdown
- Boss health bar UI at top of screen:
  - 400px wide gold-bordered health bar
  - Red to pink gradient fill
  - Shows current/max health numerically
  - Crown icon with "BOSS" label
  - Only visible when boss is alive
- Boss defeat rewards:
  - +50 extra gold bonus (on top of normal 50 reward)
  - +20 extra mana bonus
  - Special console log message
- Boss waves spawn only 1 enemy (the boss)
- currentBoss reference cleared on defeat
- drawBossWarning() for countdown animation
- drawBossHealthBar() for boss health display
- Enhanced visual feedback during boss battles
- Boss system fully integrated with existing combat

**Commit 13: Tower Selling System**
- Added sell configuration constants to CONFIG:
  - SELL_REFUND_PERCENT: 0.75 (75% refund for base towers)
  - SELL_REFUND_UPGRADED: 0.6 (60% refund for upgraded towers)
- Tower.getSellValue() method calculates total investment:
  - Includes base cost + all upgrade costs
  - Lower refund for upgraded towers to prevent abuse
  - Returns floored sell value based on refund percentage
- Sell button added to upgrade panel UI:
  - 💰 Sell Tower button with orange/red gradient
  - Shows sell value dynamically (💰 amount)
  - Positioned below upgrade button
- setupSellButton() event handler in Game class:
  - Calculates and adds gold back to player
  - Creates gold particles for visual feedback (8 particles)
  - Clears grid cell hasTower flag
  - Removes tower from towers array
  - Clears selection and hides UI panel
  - Console logs sell value
- updateUpgradeUI() updated to show sell value
- CSS styling for sell-btn with hover effects:
  - Orange gradient background (#f97316 to #ea580c)
  - Hover transforms and glow effects
  - Slightly smaller than upgrade button
- Welcome screen updated to "Commit 13: Tower Selling System Active ✓"
- Strategic feature allows repositioning towers:
  - Recover resources from poorly placed towers
  - Penalty for upgraded towers discourages constant rebuilding
  - Flexible tower management for better defense strategies
- Full integration with existing tower and resource systems

**Commit 14: Game Speed Control System**
- Added speedMultiplier property to game state (default: 1)
- Speed control UI buttons added to top bar:
  - Three buttons: 1x, 2x, 3x speed options
  - Blue gradient styling for active button
  - Hover effects and smooth transitions
- setupSpeedButtons() event handler:
  - Updates state.speedMultiplier on button click
  - Updates active button styling dynamically
  - Console logs speed changes
- Speed multiplier applied throughout update() method:
  - adjustedDeltaTime = deltaTime * speedMultiplier
  - Applied to abilities, mana regeneration, wave spawning
  - Applied to tower updates, projectile movement
  - Applied to enemy movement, particle effects
  - Stacks with Time Warp ability for towers
- CSS styling for .speed-controls and .speed-btn:
  - Positioned in top bar with margin-left: auto
  - Gray background for inactive, blue gradient for active
  - Min-width 45px, consistent button sizing
  - Hover effects with transform and glow
- Welcome screen updated to "Commit 14: Game Speed Control Active ✓"
- Quality of life feature for tower defense gameplay:
  - Speed up during easy waves to reduce waiting
  - Keep at 1x during intense boss battles
  - 2x for moderate pace, 3x for fast gameplay
  - Does not affect visual frame rate, only game logic speed
- Seamless integration with existing time-based systems

**Commit 15: Wave Skip Button and Wave Info**
- Added waveAutoStart flag (false) to disable automatic wave starting
- Next Wave button added to UI:
  - Positioned at bottom center (above abilities panel)
  - Large green button with wave icon (🌊)
  - Shows "Start Next Wave" text
  - Displays wave number info ("Wave X")
  - Boss waves show special styling (red gradient, warning icon)
- setupNextWaveButton() event handler:
  - Starts wave on button click
  - Only active when wave is complete
  - Hides button when wave starts
- showNextWaveButton() method:
  - Shows button with appropriate wave info
  - Customizes appearance for boss waves (red/dark red gradient)
  - Updates wave info text dynamically
- hideNextWaveButton() method hides button during active waves
- Modified startWave() to hide button when wave begins
- Modified completeWave():
  - Removed auto-start setTimeout timer
  - Shows next wave button instead
  - Gives player full control over pacing
- Modified startGame():
  - Shows button immediately for Wave 1
  - Sets waveComplete flag to enable button
  - Player chooses when to start first wave
- CSS styling for .next-wave-btn:
  - Green gradient (normal waves), red gradient (boss waves)
  - Positioned bottom: 120px for visibility
  - Large touch-friendly size (min-width: 180px)
  - Hover effects with transform and enhanced shadow
  - Flex column layout with icon, text, and wave info
- Quality of life improvement:
  - Players control wave timing completely
  - Build towers strategically between waves
  - No time pressure during preparation
  - Visual warning for upcoming boss waves
- Excellent for strategic planning and tower repositioning

**Commit 16: Enhanced Wave Info Display**
- Added totalKills counter to game state (tracks total enemies killed)
- Wave info panel added to UI (bottom-left corner):
  - Positioned left: 20px, bottom: 120px
  - Shows 4 key statistics:
    - **Enemies:** Current alive enemies count
    - **Spawned:** Enemies spawned this wave (X/Y format)
    - **Towers:** Total towers placed on map
    - **Total Kills:** Cumulative enemies killed
  - Compact glassmorphism panel with dark background
  - Golden text values for high visibility
- updateWaveInfo() method updates panel in real-time:
  - Shows live enemy count from enemies array
  - Displays spawn progress (enemiesSpawned/enemiesPerWave)
  - Shows current tower count
  - Tracks and displays totalKills counter
- Called automatically on key game events:
  - Tower placement (updates tower count)
  - Tower selling (updates tower count)
  - Enemy spawn (updates spawned count)
  - Enemy killed (updates enemies, total kills)
  - Enemy reaches castle (updates enemy count)
  - Wave completion (refreshes all stats)
  - Game reset (resets all counters)
- CSS styling for .wave-info-panel and sub-elements:
  - Matches other panel styling (abilities, tower menu)
  - Individual stat boxes with .wave-info-stat class
  - Flex layout with space-between alignment
  - Golden value text with glow effect
  - Compact 170px width fits perfectly
- totalKills added to constructor and resetGame state
- Increments on each enemy death (before removal from array)
- Quality of life feature providing:
  - Real-time wave progress tracking
  - Strategic information at a glance
  - Performance monitoring (entity counts)
  - Achievement tracking foundation (total kills)
- Seamlessly integrated with all game systems

**Commit 17: Achievement System**
- Added ACHIEVEMENTS object to CONFIG with 8 unlockable achievements:
  - **First Blood** (🩸): Kill your first enemy
  - **Enemy Slayer** (⚔️): Kill 50 enemies
  - **Veteran Defender** (🎯): Kill 100 enemies
  - **Survivor** (🌊): Reach wave 10
  - **Boss Slayer** (👑): Defeat your first boss
  - **Wealthy Defender** (💰): Accumulate 500 gold
  - **Master Architect** (🏭): Place 10 towers
  - **Upgrade Expert** (⬆️): Upgrade a tower to max level
- Achievement tracking system:
  - achievements object stores unlock status (persists across resets)
  - achievementStats tracks: bossKills, towersPlaced, maxUpgrade
  - achievementNotifications array queues popup notifications
  - All achievements initialized as locked in constructor
- checkAchievements() method:
  - Checks all achievement requirements
  - Supports multiple requirement types (kills, wave, bossKills, gold, towersPlaced, maxUpgrade)
  - Skips already unlocked achievements
  - Automatically unlocks when requirements met
- unlockAchievement() method:
  - Marks achievement as unlocked
  - Adds notification to queue (4-second display)
  - Console logs achievement unlock
- drawAchievementNotifications() renders popups:
  - Displays in top-right corner (slides in/out)
  - Green background with gold border
  - Shows trophy icon, "ACHIEVEMENT UNLOCKED!" text
  - Displays achievement icon, name, and description
  - Smooth slide-in animation from right
  - Auto-expires after 4 seconds with slide-out
  - Multiple notifications stack vertically
- Achievement triggers integrated throughout game:
  - Enemy killed: totalKills++, checkAchievements()
  - Boss killed: bossKills++, checkAchievements()
  - Wave completed: checkAchievements() for wave milestone
  - Tower placed: towersPlaced++, checkAchievements()
  - Tower upgraded to max: maxUpgrade = 1, checkAchievements()
  - Gold added: checkAchievements() for wealth milestone
- Achievements persist across game resets:
  - Once unlocked, achievements stay unlocked
  - achievementStats reset on game restart
  - Creates long-term progression system
- Visual feedback system:
  - Real-time notifications during gameplay
  - Non-intrusive display (top-right corner)
  - Professional animation and styling
- Foundation for future expansion:
  - Easy to add more achievements
  - Ready for localStorage persistence
  - Can add achievement menu/panel UI
- Adds replay value and progression goals

**Commit 18: Save/Load System**
- Added Save/Load buttons to UI top bar:
  - 💾 Save button (green hover effect)
  - 📂 Load button (blue hover effect, disabled when no save exists)
  - Buttons positioned next to speed controls
  - Visual feedback with success animation on save/load
- saveGame() functionality:
  - Saves complete game state to localStorage
  - Stored data includes:
    - Game state (gold, mana, lives, wave, score, speed, totalKills)
    - All unlocked achievements and achievement stats
    - Tower placements (type, position, level)
    - Wave state (active, complete, enemies spawned)
    - Ability cooldown timers
  - Version number and timestamp for save file
  - Visual feedback: button turns green, shows "✓ Saved!" for 1.5s
  - Console logging for debugging
- loadGame() functionality:
  - Loads game state from localStorage
  - Validates save data exists
  - Pauses game during load process
  - Restores all game state values
  - Recreates towers with correct types, positions, and levels
  - Restores wave completion state and shows next wave button
  - Restores ability cooldowns
  - Updates all UI elements (stats, speed buttons, wave info)
  - Visual feedback: button shows "✓ Loaded!" for 1.5s
  - Error handling for corrupted saves
- createTowerFromType() helper method:
  - Creates tower instances from saved type strings
  - Supports all 4 tower types (archer, mage, cannon, lightning)
  - Properly positions towers on grid
  - Returns null for unknown types
- updateSpeedButtons() helper method:
  - Updates visual state of speed buttons after load
  - Ensures correct button is highlighted based on loaded speed
- updateLoadButtonState() method:
  - Dynamically enables/disables load button
  - Checks for save file existence in localStorage
  - Updates button opacity based on state
  - Called after each save operation
- Auto-save system:
  - autoSave() method checks game state before saving
  - Automatically saves after:
    - Wave completion (in completeWave())
    - Tower placement (in placeTower())
    - Tower upgrade (in setupUpgradeButton())
  - Only saves if game started and not game over
  - Seamless background saves without interrupting gameplay
- setupSaveLoadButtons() initialization:
  - Sets up click event listeners for both buttons
  - Called in constructor during game initialization
  - Updates load button state on startup
- localStorage integration:
  - Save key: 'castleDefendersSave'
  - JSON serialization/deserialization
  - Persistent storage across browser sessions
  - Try-catch error handling for all operations
- UI/UX enhancements:
  - Save button styling with green gradient on hover
  - Load button styling with blue gradient on hover
  - Success animation with scale pulse effect
  - Disabled state styling for load button when no save
  - Alert messages for errors and "no save found"
- Grid state restoration:
  - Marks grid cells as having towers after load
  - Maintains buildable/unbuildable cell states
  - Ensures towers are properly placed on grid
- Quality of life features:
  - No need to manually save before closing
  - Quick save with single button click
  - Instant game state restoration
  - Preserves all progress and achievements
- Foundation for future expansions:
  - Multiple save slots support (different keys)
  - Cloud save integration potential
  - Save file export/import capability
  - Save game statistics display

### 📋 Planned Features (7+ commits remaining)

2. Game class and core initialization
3. Game loop and rendering system
4. Path/grid system for enemy movement
5. Tower placement system
6. Enemy spawning mechanics
7. Tower shooting system
8. Collision detection and damage
9. Resource management system
10. Wave system with difficulty scaling
11. Multiple enemy types
12. Multiple tower types
13. Tower upgrade system
14. Hero character with abilities
15. Special ability system
16. Health/lives system
17. Particle effects
18. Boss enemy system
19. Skill tree/upgrade menu
20. Achievement system
21. Save/load functionality
22. Sound effects
23. Tutorial system
24. UI polish and animations
25. Final optimizations

## 🎯 Planned Game Features

### Tower Types
- 🏹 Archer Tower: Fast attack, medium damage
- 🔮 Mage Tower: Slow attack, high AOE damage
- 💣 Cannon Tower: Splash damage, good range
- ⚡ Lightning Tower: Chain damage to multiple enemies

### Enemy Types
- 👾 Basic Enemy: Standard speed and health
- 🏃 Fast Enemy: Quick movement, low health
- 🛡️ Tank Enemy: Slow, high health
- 🦅 Flying Enemy: Ignores ground obstacles
- 👑 Boss Enemy: Appears every 10 waves

### Hero Abilities
- ⚔️ Sword Strike: Direct damage to single enemy
- 🌪️ Whirlwind: AOE damage around hero
- 🧊 Ice Freeze: Slow enemies in area
- 💫 Divine Shield: Temporary invulnerability

### Progression Systems
- Experience and leveling
- Tower upgrades (3 levels each)
- Skill tree for hero abilities
- Achievement tracking
- Persistent save system

## 🎨 Technical Stack

- HTML5 Canvas for rendering
- Vanilla JavaScript (ES6+ classes)
- CSS3 with modern gradients and effects
- LocalStorage for save data
- Object-oriented architecture

## 📊 Commit-by-Commit Development

Each commit adds ONE specific feature or improvement, building upon previous work. The game is being developed incrementally to demonstrate proper version control and feature development.

---

**Status:** 🚧 In Development - Commit 18/25+ Complete

**Last Updated:** Commit 18 - Save/Load system implemented
