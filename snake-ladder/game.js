// Snake and Ladder Game Logic

class SnakeAndLadderGame {
    constructor() {
        this.currentPlayer = 1;
        this.player1Position = 0;
        this.player2Position = 0;
        this.gameOver = false;
        this.gameStarted = false;
        this.player1Color = '#ff6b6b';
        this.player2Color = '#4dabf7';
        this.initializeBoard();
        this.attachEventListeners();
        this.setupStartModal();
    }

    setupStartModal() {
        const startButton = document.getElementById('startGameButton');
        const player1StartColor = document.getElementById('player1-start-color');
        const player2StartColor = document.getElementById('player2-start-color');
        const player1Preview = document.getElementById('player1-preview');
        const player2Preview = document.getElementById('player2-preview');
        
        // Update preview colors in real-time
        player1Preview.style.background = this.player1Color;
        player2Preview.style.background = this.player2Color;
        
        player1StartColor.addEventListener('input', (e) => {
            player1Preview.style.background = e.target.value;
        });
        
        player2StartColor.addEventListener('input', (e) => {
            player2Preview.style.background = e.target.value;
        });
        
        startButton.addEventListener('click', () => {
            this.player1Color = player1StartColor.value;
            this.player2Color = player2StartColor.value;
            
            // Set colors in the game UI
            document.getElementById('player1-color').value = this.player1Color;
            document.getElementById('player2-color').value = this.player2Color;
            
            // Hide modal and start game
            document.getElementById('gameStartModal').classList.add('hidden');
            this.gameStarted = true;
            
            // Enable roll button
            document.getElementById('rollButton').disabled = false;
            
            // Set initial dice color to player 1's color
            this.updateDiceColor(1, this.player1Color);
            
            this.addLog('Game started! Player 1, roll the dice!');
        });
        
        // Disable roll button until game starts
        document.getElementById('rollButton').disabled = true;
    }

    initializeBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';

        // Create board cells (100 cells, numbered 1-100)
        // Board starts from bottom-right (1) and ends at top-left (100)
        // Alternates direction each row (snake pattern)
        for (let row = 9; row >= 0; row--) {
            for (let col = 0; col < 10; col++) {
                // Bottom row (row 9): 1-10 from right to left
                // Next row (row 8): 11-20 from left to right
                // Pattern continues alternating
                const cellNumber = row % 2 === 1 
                    ? (9 - row) * 10 + col + 1 
                    : (9 - row) * 10 + (10 - col);

                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.id = `cell-${cellNumber}`;
                cell.dataset.cellNumber = cellNumber;

                // Add cell number
                const cellNumberSpan = document.createElement('span');
                cellNumberSpan.className = 'cell-number';
                cellNumberSpan.textContent = cellNumber;
                cell.appendChild(cellNumberSpan);

                // Check for special cells
                if (cellNumber === 1) {
                    cell.classList.add('start');
                    cell.innerHTML += '<div>START</div>';
                } else if (cellNumber === 100) {
                    cell.classList.add('finish');
                    cell.innerHTML += '<div>🏆 FINISH</div>';
                }

                // Check for snakes
                const snake = getSnakeAt(cellNumber);
                if (snake) {
                    cell.classList.add('snake');
                    const icon = document.createElement('div');
                    icon.className = 'snake-ladder-icon';
                    icon.textContent = '🐍';
                    icon.title = `Snake! Go down to ${snake.tail}`;
                    cell.appendChild(icon);
                }

                // Check for ladders
                const ladder = getLadderAt(cellNumber);
                if (ladder) {
                    cell.classList.add('ladder');
                    const icon = document.createElement('div');
                    icon.className = 'snake-ladder-icon';
                    icon.textContent = '🪜';
                    icon.title = `Ladder! Climb up to ${ladder.top}`;
                    cell.appendChild(icon);
                }

                gameBoard.appendChild(cell);
            }
        }

        this.updatePlayerPositions();
    }

    attachEventListeners() {
        document.getElementById('rollButton').addEventListener('click', () => this.rollDice());
        document.getElementById('resetButton').addEventListener('click', () => this.resetGame());
        
        // Color pickers in game are disabled - colors set before game starts
    }

    updateDiceColor(player, color) {
        const dice = document.getElementById('dice');
        dice.style.background = color;
        
        // Adjust text color based on background brightness
        const brightness = this.getColorBrightness(color);
        const diceFace = dice.querySelector('.dice-face');
        diceFace.style.color = brightness > 128 ? '#333' : '#fff';
    }

    getColorBrightness(hexColor) {
        // Convert hex to RGB and calculate brightness
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);
        return (r * 299 + g * 587 + b * 114) / 1000;
    }

    rollDice() {
        if (this.gameOver) {
            this.addLog('Game is over! Click "New Game" to play again.');
            return;
        }
        
        if (!this.gameStarted) {
            this.addLog('Please start the game first!');
            return;
        }

        const rollButton = document.getElementById('rollButton');
        rollButton.disabled = true;

        // Animate dice
        const dice = document.getElementById('dice');
        const diceFace = dice.querySelector('.dice-face');
        dice.classList.add('rolling');

        // Simulate rolling animation
        let rollCount = 0;
        const rollInterval = setInterval(() => {
            diceFace.textContent = Math.floor(Math.random() * 6) + 1;
            rollCount++;
            if (rollCount > 10) {
                clearInterval(rollInterval);
                const finalRoll = Math.floor(Math.random() * 6) + 1;
                diceFace.textContent = finalRoll;
                dice.classList.remove('rolling');
                this.processMove(finalRoll);
                rollButton.disabled = false;
            }
        }, 100);
    }

    processMove(diceValue) {
        const currentPosition = this.currentPlayer === 1 ? this.player1Position : this.player2Position;
        let newPosition = currentPosition + diceValue;

        this.addLog(`Player ${this.currentPlayer} rolled a ${diceValue}`);

        // Check if move would go beyond 100
        if (newPosition > BOARD_SIZE) {
            this.addLog(`Player ${this.currentPlayer} needs exactly ${BOARD_SIZE - currentPosition} to win!`);
            this.switchPlayer();
            return;
        }

        // Update position
        if (this.currentPlayer === 1) {
            this.player1Position = newPosition;
        } else {
            this.player2Position = newPosition;
        }

        this.addLog(`Player ${this.currentPlayer} moved to position ${newPosition}`);

        // Check for snake
        const snake = getSnakeAt(newPosition);
        if (snake) {
            // Play snake bite sound
            try {
                const snakeBiteSound = document.getElementById('victorySound');
                snakeBiteSound.volume = 0.7;
                snakeBiteSound.play().catch(error => {
                    console.log('Audio playback failed:', error);
                });
            } catch (error) {
                console.log('Error playing snake bite sound:', error);
            }
            
            setTimeout(() => {
                this.addLog(`🐍 Oh no! Snake bite! Player ${this.currentPlayer} slides down to ${snake.tail}`);
                if (this.currentPlayer === 1) {
                    this.player1Position = snake.tail;
                } else {
                    this.player2Position = snake.tail;
                }
                this.updatePlayerPositions();
                this.checkWin();
            }, 500);
        }

        // Check for ladder
        const ladder = getLadderAt(newPosition);
        if (ladder) {
            setTimeout(() => {
                this.addLog(`🪜 Great! Ladder found! Player ${this.currentPlayer} climbs up to ${ladder.top}`);
                if (this.currentPlayer === 1) {
                    this.player1Position = ladder.top;
                } else {
                    this.player2Position = ladder.top;
                }
                this.updatePlayerPositions();
                this.checkWin();
            }, 500);
        }

        this.updatePlayerPositions();
        
        // Check for win only if no snake or ladder
        if (!snake && !ladder) {
            this.checkWin();
        }
    }

    updatePlayerPositions() {
        // Remove all existing player tokens
        document.querySelectorAll('.player-token').forEach(token => token.remove());

        // Update position displays
        document.getElementById('player1-position').textContent = this.player1Position;
        document.getElementById('player2-position').textContent = this.player2Position;

        // Add player 1 token
        if (this.player1Position > 0) {
            const cell1 = document.getElementById(`cell-${this.player1Position}`);
            const token1 = document.createElement('div');
            token1.className = 'player-token player1';
            cell1.appendChild(token1);
        }

        // Add player 2 token
        if (this.player2Position > 0) {
            const cell2 = document.getElementById(`cell-${this.player2Position}`);
            const token2 = document.createElement('div');
            token2.className = 'player-token player2';
            cell2.appendChild(token2);
        }
    }

    checkWin() {
        const winningPosition = this.currentPlayer === 1 ? this.player1Position : this.player2Position;
        
        if (winningPosition === BOARD_SIZE) {
            this.gameOver = true;
            this.addLog(`🎉🎉🎉 Player ${this.currentPlayer} WINS! Congratulations! 🎉🎉🎉`);
            setTimeout(() => {
                alert(`🏆 Player ${this.currentPlayer} is the WINNER! 🏆\n\nCongratulations!`);
            }, 500);
        } else {
            this.switchPlayer();
        }
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        
        // Update turn indicators
        const player1Turn = document.getElementById('player1-turn');
        const player2Turn = document.getElementById('player2-turn');
        
        if (this.currentPlayer === 1) {
            player1Turn.style.display = 'block';
            player2Turn.style.display = 'none';
        } else {
            player1Turn.style.display = 'none';
            player2Turn.style.display = 'block';
        }
        
        // Update dice color based on current player
        const color = this.currentPlayer === 1 ? this.player1Color : this.player2Color;
        this.updateDiceColor(this.currentPlayer, color);
    }

    addLog(message) {
        const gameLog = document.getElementById('gameLog');
        const logEntry = document.createElement('p');
        logEntry.textContent = message;
        gameLog.appendChild(logEntry);
        gameLog.scrollTop = gameLog.scrollHeight;
    }

    resetGame() {
        this.currentPlayer = 1;
        this.player1Position = 0;
        this.player2Position = 0;
        this.gameOver = false;
        this.gameStarted = false;

        // Reset UI
        document.getElementById('gameLog').innerHTML = '<p>Welcome! Player 1 starts the game.</p>';
        document.getElementById('player1-turn').style.display = 'block';
        document.getElementById('player2-turn').style.display = 'none';
        document.querySelector('.dice-face').textContent = '?';

        // Reset dice to white
        const dice = document.getElementById('dice');
        dice.style.background = 'white';
        dice.querySelector('.dice-face').style.color = '#333';

        // Disable roll button
        document.getElementById('rollButton').disabled = true;

        // Show color selection modal again
        document.getElementById('gameStartModal').classList.remove('hidden');

        this.updatePlayerPositions();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new SnakeAndLadderGame();
});
