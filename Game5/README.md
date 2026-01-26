# Tetris Game

A classic Tetris game implementation with modern styling and smooth gameplay.

## Features

- **Classic Tetris Gameplay**: Traditional tetromino pieces with standard rotation mechanics
- **Scoring System**: Earn points for clearing lines with bonus points for multiple lines
- **Progressive Difficulty**: Game speed increases as you level up
- **Next Piece Preview**: See what piece is coming next
- **Pause Functionality**: Pause and resume the game at any time
- **Responsive Design**: Adapts to different screen sizes
- **Beautiful UI**: Modern gradient design with smooth animations

## How to Play

### Controls

- **Arrow Left (←)**: Move piece left
- **Arrow Right (→)**: Move piece right
- **Arrow Down (↓)**: Soft drop (move piece down faster)
- **Arrow Up (↑)**: Rotate piece clockwise
- **Spacebar**: Hard drop (instant drop to bottom)
- **P**: Pause/Resume game

### Game Rules

1. Tetrominoes fall from the top of the playing field
2. Rotate and position pieces to create complete horizontal lines
3. Complete lines disappear and earn you points
4. Game ends when pieces stack up to the top
5. Speed increases every 10 lines cleared

### Scoring

- **1 Line**: 100 × Level
- **2 Lines**: 300 × Level
- **3 Lines**: 500 × Level
- **4 Lines (Tetris)**: 800 × Level
- **Hard Drop**: 2 points per cell

## Game Pieces

The game includes 7 different tetromino shapes:

- **I-piece** (Cyan): 4 blocks in a line
- **O-piece** (Yellow): 2×2 square
- **T-piece** (Purple): T-shaped
- **S-piece** (Green): S-shaped
- **Z-piece** (Red): Z-shaped
- **J-piece** (Blue): J-shaped
- **L-piece** (Orange): L-shaped

## Installation

1. Clone or download the Game5 folder
2. Open `index.html` in a modern web browser
3. Click "Start Game" to begin playing

No additional dependencies or installation required!

## Files Structure

```
Game5/
├── index.html      # Main HTML file
├── styles.css      # Game styling
├── game.js         # Game logic and mechanics
└── README.md       # This file
```

## Browser Compatibility

Works best in modern browsers:
- Chrome/Edge (Recommended)
- Firefox
- Safari
- Opera

## Tips for High Scores

1. **Plan ahead**: Use the next piece preview to plan your moves
2. **Keep the stack low**: Avoid building tall stacks
3. **Clear multiple lines**: Try to clear 2-4 lines at once for bonus points
4. **Use hard drop wisely**: It gives bonus points but commits your move
5. **Stay calm**: As the speed increases, focus on maintaining a clean board

## Future Enhancements

Potential features for future versions:
- Hold piece functionality
- Ghost piece (shows where piece will land)
- Sound effects and music
- High score tracking
- Mobile touch controls
- Different game modes
- Customizable themes

## Credits

Created as part of the Multi-Game Repository project.

Enjoy playing Tetris! 🎮
