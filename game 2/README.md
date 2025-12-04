# 🐛 Worm Game (Classic Snake)

A modern, responsive implementation of the classic Snake game with a beautiful gradient UI and smooth gameplay.

![Game Preview](https://img.shields.io/badge/Game-Snake-success)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## 🎮 Game Description

Control a growing worm as it slithers around the grid eating food. Each piece of food makes your worm longer and faster. Avoid hitting the walls or your own body to achieve the highest score possible!

## ✨ Features

- **Smooth Gameplay**: Optimized game loop with adjustable speed
- **Score Tracking**: Live score counter with persistent high score
- **Progressive Difficulty**: Speed increases as the worm grows
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Touch Controls**: On-screen directional buttons for mobile play
- **Keyboard Controls**: Arrow keys for traditional desktop gaming
- **Sound Effects**: Audio feedback for collisions
- **Modern UI**: Beautiful gradient design with smooth animations
- **Game States**: Start screen and game over overlay

## 🚀 How to Play

### Starting the Game
1. Open `index.html` in your web browser
2. Click the "Start Game" button
3. Use controls to guide your worm

### Controls

**Desktop:**
- ⬆️ **Up Arrow**: Move up
- ⬇️ **Down Arrow**: Move down
- ⬅️ **Left Arrow**: Move left
- ➡️ **Right Arrow**: Move right

**Mobile/Touch:**
- Use the on-screen directional buttons

### Game Rules
- 🍎 Eat the red food to score **+10 points**
- 🐛 Your worm grows longer with each food eaten
- ⚡ Speed increases progressively as you grow
- 💥 Game ends if you hit the wall or your own body
- 🏆 Try to beat your high score!

## 📁 Project Structure

```
game 2/
├── index.html          # Main HTML file with game structure
├── styles.css          # Styling and responsive design
├── game.js             # Game logic and mechanics
├── sounds/             # Sound effects directory
│   └── collision.mp3   # Collision sound effect
└── README.md           # This file
```

## 🛠️ Technical Details

### Game Configuration
- **Grid Size**: 20x20 pixels per cell
- **Canvas Size**: 400x400 pixels
- **Initial Speed**: 150ms per move
- **Minimum Speed**: 50ms per move
- **Speed Multiplier**: 0.95 (gets faster after each food)
- **Points Per Food**: 10

### Technologies Used
- **HTML5 Canvas**: For rendering the game grid and elements
- **Vanilla JavaScript**: Pure JS, no frameworks required
- **CSS3**: Modern styling with flexbox and gradients
- **Local Storage**: Persistent high score saving
- **Web Audio API**: Sound effects playback

### Key Features Implementation

**Snake Movement**
- Uses a queue-based approach with array manipulation
- Direction change validation prevents 180° turns
- Smooth grid-based movement system

**Collision Detection**
- Wall boundary checking
- Self-collision algorithm
- Optimized position validation

**Food Generation**
- Random placement algorithm
- Ensures food doesn't spawn on snake body
- Grid-based positioning system

**Score System**
- Real-time score updates
- High score persistence using localStorage
- Final score display on game over

## 🎨 Customization

### Changing Colors
Edit the gradient colors in `styles.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adjusting Difficulty
Modify the CONFIG object in `game.js`:
```javascript
const CONFIG = {
    gridSize: 20,           // Cell size (smaller = harder)
    initialSpeed: 150,      // Starting speed in ms (lower = faster)
    speedMultiplier: 0.95,  // Speed increase rate
    minSpeed: 50,           // Maximum speed limit
    pointsPerFood: 10       // Points per food eaten
};
```

### Adding Sound Effects
Place audio files in the `sounds/` directory and reference them in `index.html`:
```html
<audio id="collisionSound" src="sounds/collision.mp3" preload="auto"></audio>
```

## 📱 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### Local Deployment
Simply open `index.html` in any modern web browser.

### Web Hosting
1. Upload all files to your web server
2. Ensure directory structure is maintained
3. Navigate to the hosted URL

### GitHub Pages
1. Push to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Select the branch and root folder
4. Access via `https://username.github.io/repository-name/game%202/`

## 🐛 Known Issues

- Sound effects require user interaction to play (browser autoplay policy)
- High scores are stored per browser (not synced across devices)

## 🔮 Future Enhancements

- [ ] Multiple difficulty levels
- [ ] Power-ups and special food items
- [ ] Obstacles and maze mode
- [ ] Multiplayer mode
- [ ] Leaderboard system
- [ ] Additional sound effects (eating, movement)
- [ ] Pause functionality
- [ ] Touch swipe controls
- [ ] Customizable themes

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Development

Feel free to fork, modify, and enhance this game. Contributions are welcome!

### Running Locally
```bash
# No build process required
# Simply open index.html in your browser
```

## 🎯 Tips & Strategies

1. **Plan Ahead**: Think about your path before making sharp turns
2. **Use the Center**: Stay near the center to have more movement options
3. **Corner Carefully**: Approaching corners requires precise timing
4. **Speed Management**: Remember that speed increases with size
5. **High Score**: Aim for consistent small wins rather than risky long runs

---

**Enjoy the game!** 🐛🍎🎮

*Last Updated: December 2025*
