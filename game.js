const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn'); // Restart button
let score = 0;
let snake = [{ x: 160, y: 160 }];
let snakeDirection = 'RIGHT';
let food = { x: 0, y: 0 };
let gameOver = false;
let interval;
const snakeSize = 20; // size of each snake part
const areaSize = 400; // game area size
let gameStarted = false; // Flag to track if the game has started

// Function to initialize the game state and start the game loop
function initGame() {
    document.addEventListener('keydown', changeDirection); // Listens to the arrow keys
    generateFood(); // Generate the first food
    updateGameArea(); // Show the initial state of the snake and food
}

// Function to start the game when a key is pressed
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        interval = setInterval(gameLoop, 100); // Start the game loop
    }
}

// Function to reset the game
function resetGame() {
    score = 0;
    snake = [{ x: 160, y: 160 }];
    snakeDirection = 'RIGHT';
    food = { x: 0, y: 0 };
    gameOver = false;
    gameStarted = false;
    scoreDisplay.textContent = score;
    restartBtn.style.display = 'none'; // Hide restart button
    initGame(); // Re-initialize the game
    startGame(); // Start the game after reset
}

// Game loop to update the game state
function gameLoop() {
    if (gameOver) {
        clearInterval(interval); // Stop the game loop
        restartBtn.style.display = 'block'; // Show the restart button
        return;
    }

    moveSnake();
    checkCollisions();
    updateGameArea();
}

// Moves the snake based on current direction
function moveSnake() {
    const head = { ...snake[0] };

    switch (snakeDirection) {
        case 'UP': head.y -= snakeSize; break;
        case 'DOWN': head.y += snakeSize; break;
        case 'LEFT': head.x -= snakeSize; break;
        case 'RIGHT': head.x += snakeSize; break;
    }

    // Add new head to the snake array
    snake.unshift(head);

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        generateFood(); // Generate new food
    } else {
        snake.pop(); // Remove tail
    }
}

// Change direction based on arrow key
function changeDirection(e) {
    if (e.key === 'ArrowUp' && snakeDirection !== 'DOWN') {
        snakeDirection = 'UP';
    } else if (e.key === 'ArrowDown' && snakeDirection !== 'UP') {
        snakeDirection = 'DOWN';
    } else if (e.key === 'ArrowLeft' && snakeDirection !== 'RIGHT') {
        snakeDirection = 'LEFT';
    } else if (e.key === 'ArrowRight' && snakeDirection !== 'LEFT') {
        snakeDirection = 'RIGHT';
    }

    // Start the game when the first key is pressed
    if (!gameStarted) {
        startGame(); // Start the game
    }
}

// Generate food at random position
function generateFood() {
    food.x = Math.floor(Math.random() * (areaSize / snakeSize)) * snakeSize;
    food.y = Math.floor(Math.random() * (areaSize / snakeSize)) * snakeSize;
}

// Update the game area by drawing the snake and food
function updateGameArea() {
    gameArea.innerHTML = ''; // Clear previous elements

    // Draw the snake
    snake.forEach((part) => {
        const snakePart = document.createElement('div');
        snakePart.style.width = `${snakeSize}px`;
        snakePart.style.height = `${snakeSize}px`;
        snakePart.style.left = `${part.x}px`;
        snakePart.style.top = `${part.y}px`;
        snakePart.classList.add('snake');
        gameArea.appendChild(snakePart);
    });

    // Draw the food
    const foodElement = document.createElement('div');
    foodElement.style.width = `${snakeSize}px`;
    foodElement.style.height = `${snakeSize}px`;
    foodElement.style.left = `${food.x}px`;
    foodElement.style.top = `${food.y}px`;
    foodElement.classList.add('food');
    gameArea.appendChild(foodElement);
}

// Check for collisions (self-collision or wall collision)
function checkCollisions() {
    const head = snake[0];

    // Check if the snake hits the walls
    if (head.x < 0 || head.x >= areaSize || head.y < 0 || head.y >= areaSize) {
        gameOver = true;
    }

    // Check if the snake collides with itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            gameOver = true;
        }
    }
}

// Wait for the user to press any key to start the game
document.addEventListener('keydown', (e) => {
    if (!gameStarted) {
        startGame(); // Start the game when the first key is pressed
    }
});

// Restart button functionality
restartBtn.addEventListener('click', resetGame);

// Initialize the game when the page loads
initGame();
