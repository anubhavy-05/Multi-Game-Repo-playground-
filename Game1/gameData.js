// Game Configuration and Data

const BOARD_SIZE = 100;

// Snake positions: [head, tail]
// When player lands on head, they slide down to tail
const SNAKES = [
    { head: 99, tail: 54 },
    { head: 95, tail: 72 },
    { head: 92, tail: 53 },
    { head: 83, tail: 43 },
    { head: 69, tail: 33 },
    { head: 64, tail: 36 },
    { head: 59, tail: 17 },
    { head: 52, tail: 29 },
    { head: 47, tail: 26 },
    { head: 44, tail: 22 }
];

// Ladder positions: [bottom, top]
// When player lands on bottom, they climb up to top
const LADDERS = [
    { bottom: 4, top: 56 },
    { bottom: 12, top: 50 },
    { bottom: 14, top: 55 },
    { bottom: 22, top: 58 },
    { bottom: 41, top: 79 },
    { bottom: 54, top: 88 },
    { bottom: 63, top: 81 },
    { bottom: 66, top: 87 },
    { bottom: 76, top: 91 }
];

// Helper function to check if a position has a snake
function getSnakeAt(position) {
    return SNAKES.find(snake => snake.head === position);
}

// Helper function to check if a position has a ladder
function getLadderAt(position) {
    return LADDERS.find(ladder => ladder.bottom === position);
}

// Helper function to get all snake heads
function getAllSnakeHeads() {
    return SNAKES.map(snake => snake.head);
}

// Helper function to get all ladder bottoms
function getAllLadderBottoms() {
    return LADDERS.map(ladder => ladder.bottom);
}

// Export for use in game.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BOARD_SIZE,
        SNAKES,
        LADDERS,
        getSnakeAt,
        getLadderAt,
        getAllSnakeHeads,
        getAllLadderBottoms
    };
}
