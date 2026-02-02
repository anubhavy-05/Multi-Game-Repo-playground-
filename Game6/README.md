# Space Invaders

A classic Space Invaders game implementation with modern styling and smooth gameplay.

## Features

- **Classic Arcade Gameplay**: Defend Earth from waves of alien invaders
- **Progressive Difficulty**: Aliens speed up and become more aggressive as you advance
- **Mystery Ship**: Random bonus ships appear for extra points
- **Shields**: Destructible shields provide temporary protection
- **Lives System**: Start with 3 lives and try to survive as long as possible
- **High Score Tracking**: Your best score is saved locally
- **Responsive Design**: Adapts to different screen sizes
- **Beautiful UI**: Modern space-themed gradient design

## How to Play

### Controls

- **Arrow Left (←)**: Move spaceship left
- **Arrow Right (→)**: Move spaceship right
- **Spacebar**: Fire laser bullet
- **P**: Pause/Resume game

### Game Rules

1. Move your spaceship left and right to avoid alien bullets
2. Shoot the alien invaders before they reach the bottom of the screen
3. You can fire up to 3 bullets at a time
4. Destroy all aliens to advance to the next level
5. Use shields for protection, but they deteriorate with each hit
6. Hit the red mystery ship for bonus points
7. Game ends when you lose all lives or aliens reach your position

### Scoring

- **Bottom Row Aliens** (Yellow): 10 points each
- **Middle Rows Aliens** (Cyan): 20 points each
- **Top Row Aliens** (Magenta): 30 points each
- **Mystery Ship** (Red): 50-200 points (random)

## Game Elements

### Aliens

Three types of aliens with different point values:
- **Type 1** (Yellow): Bottom two rows, 10 points
- **Type 2** (Cyan): Middle two rows, 20 points
- **Type 3** (Magenta): Top row, 30 points

Aliens move in formation, gradually descending and speeding up as their numbers decrease.

### Mystery Ship

A red mystery ship occasionally flies across the top of the screen. Hit it for bonus points ranging from 50 to 200!

### Shields

Four shields protect your spaceship from alien fire. Each shield can take 10 hits before being destroyed. Both alien and player bullets damage shields.

### Lives

You start with 3 lives. Lose a life when hit by an alien bullet. Game over when all lives are lost.

## Gameplay Tips

1. **Prioritize threats**: Focus on aliens closest to the bottom
2. **Use shields wisely**: Position yourself behind shields when aliens shoot
3. **Watch for patterns**: Aliens shoot more frequently as they get closer
4. **Mystery ships**: Try to hit the mystery ship for bonus points
5. **Stay mobile**: Keep moving to avoid alien fire
6. **Clear columns**: Eliminating entire columns gives you more room to maneuver

## Level Progression

- Each level increases alien speed by 30%
- Complete a level by destroying all aliens
- Game becomes progressively more challenging with each level

## Technical Features

- Smooth 60 FPS gameplay using requestAnimationFrame
- Collision detection system
- Local storage for high score persistence
- Responsive canvas rendering
- Keyboard input handling with anti-spam for shooting

## Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript
- Local Storage

## Installation

1. Download all files (index.html, game.js, styles.css, README.md)
2. Open index.html in a web browser
3. Click "Start Game" to begin playing

No build process or dependencies required!

## Future Enhancements

Possible future additions:
- Sound effects and background music
- Power-ups (rapid fire, shield regeneration)
- Different alien attack patterns
- Boss battles every few levels
- Mobile touch controls
- Leaderboard system

## Credits

Based on the classic Space Invaders arcade game created by Tomohiro Nishikado (1978).

Enjoy defending Earth from the alien invasion! 🚀👾
