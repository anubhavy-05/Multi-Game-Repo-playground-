// Snake and Ladder Game Logic

class SnakeAndLadderGame {
    constructor() {
        this.currentPlayer = 1;
        this.player1Position = 0;
        this.player2Position = 0;
        this.gameOver = false;
        this.initializeBoard();
        this.attachEventListeners();
    }

    initializeBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';

        // Create board cells (100 cells, numbered 1-100)
        // Board starts from bottom-left and goes right, then alternates
        for (let row = 9; row >= 0; row--) {
            for (let col = 0; col < 10; col++) {
                const cellNumber = row % 2 === 0 
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
    }

    rollDice() {
        if (this.gameOver) {
            this.addLog('Game is over! Click "New Game" to play again.');
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

        // Reset UI
        document.getElementById('gameLog').innerHTML = '<p>Welcome! Player 1 starts the game.</p>';
        document.getElementById('player1-turn').style.display = 'block';
        document.getElementById('player2-turn').style.display = 'none';
        document.querySelector('.dice-face').textContent = '?';

        this.updatePlayerPositions();
        this.addLog('New game started! Good luck!');
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new SnakeAndLadderGame();
});
