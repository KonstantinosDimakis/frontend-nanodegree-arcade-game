/**
 * Grid for the game board. Use this to easily position
 * characters and game components.
 *
 * Examples: this.x = grid.column(5);
 *           this.y = grid.row(5);
 */
var GRID = {
    /**
     * {number} pixels
     */
    COLUMN : 101,
    /**
     * {number} pixels
     */
    ROW    : 83,
    /**
     * {number} pixels
     */
    _OFFSET: 25,
};

/**
 * Return the proper pixel number for a given column
 * @param {number} column
 * @return {number} pixels
 */
GRID.column = function (column) {
    return column * this.COLUMN;
};

/**
 * Return the proper pixel number for a given row
 * @param {number} row
 * @return {number} pixels
 */
GRID.row = function (row) {
    return row * this.ROW - this._OFFSET;
};

//TODO
GRID.getPosition = function (x, xLength, y, yLength) {

};
//TODO
GRID.setPosition = function (column, row) {

};

/**
 * Enemies our players must avoid
 * @constructor
 */
var Enemy = function() {
    this._initialize();

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // if enemy has completely crossed the canvas
    if (this.x >= GRID.column(5)) {
        this._initialize();
    }
    this.x += dt * this.speed;

    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Initialize enemy off canvas in one of 3 rows randomly
 * and give him a speed.
 * @private
 */
Enemy.prototype._initialize = function () {
    /**
     * Min and Max speed of enemies
     * @type {{min: number, max: number}}
     */
    var SPEED = {
        min: 50,
        max: 400,
    };
    // Initialize enemy off screen
    this.x = GRID.column(-1);
    // Randomly place him on one of the 3 rows
    this.y = GRID.row(
        Math.floor(Math.random() * (3 - 1 + 1)) + 1
    );
    // Assign a random SPEED
    this.speed = Math.floor(Math.random() * (SPEED.max - SPEED.min + 1)) + SPEED.min;
};

/**
 * Player
 * @constructor
 */
var Player = function () {
    this.initialize();
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
};

/**
 * Initialize player's position & intent
 */
Player.prototype.initialize = function () {
    this.x = GRID.column(2);
    this.y = GRID.row(5);
    this.intent = 'stay';
};

/**
 * Update player's position based on his intent,
 * required method for game
 */
Player.prototype.update = function () {
    switch (this.intent) {
        case 'left':
            this.x -= GRID.COLUMN;
            break;
        case 'up':
            // If player is going to step into the water
            // reset him to the initial position
            if (GRID.row(1) === this.y) {
                this.x = GRID.column(2);
                this.y = GRID.row(5);
            } else {
                this.y -= GRID.ROW;
            }
            break;
        case 'right':
            this.x += GRID.COLUMN;
            break;
        case 'down':
            this.y += GRID.ROW;
            break;
    }
    // intent was fulfilled
    this.intent = 'stay';
};

/**
 * Draw the player on screen
 */
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Handle input & restrict disallowed movements
 * @param {string} key
 */
Player.prototype.handleInput = function (key) {
    if (this._isAllowed(key))
        this.intent = key;
};

/**
 * Get grid position
 * @return {{column: number, row: number}}
 *///TODO Refactor in GRID object to getPosition setPosition
// TODO In general refactor the code and make it so minimal
// amount of change is required if I want to add items, characters
// and change the width and height of the board
Player.prototype.gridPosition = function () {
    return {
        column: this.x / GRID.COLUMN,
        row : (this.y + GRID._OFFSET) / GRID.ROW,
    };
};

/**
 * Check if intent is allowed
 * @param {string} intent
 * @return {boolean}
 * @private
 */
Player.prototype._isAllowed = function (intent) {
    switch (intent) {
        case 'left':
            // if player is in the left edge
            if (GRID.column(0) === this.x)
                return false;
            break;
        case 'right':
            // if player is in the right edge
            if (GRID.column(4) === this.x)
                return false;
            break;
        case 'down':
            // if player is in the bottom edge
            if (GRID.row(5) === this.y)
                return false;
            break;
    }
    return true;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [
    new Enemy(),
    new Enemy(),
    new Enemy(),
];
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
    };

    player.handleInput(allowedKeys[e.keyCode]);
});