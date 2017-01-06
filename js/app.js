/**
 * Grid for the game board. Use this to easily position
 * characters and game components.
 *
 * Examples: this.x = grid.column(5);
 *           this.y = grid.row(5);
 */
var grid = {
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
grid.column = function (column) {
    return column * this.COLUMN;
};

/**
 * Return the proper pixel number for a given row
 * @param {number} row
 * @return {number} pixels
 */
grid.row = function (row) {
    return row * this.ROW - this._OFFSET;
};

// Enemies our player must avoid
var Enemy = function() {
    // Initiate enemy off screen
    this.x = grid.column(-1);
    // Randomly place him on one of the 3 rows
    this.y = grid.row(
        Math.floor(Math.random() * (3 - 1 + 1)) + 1
    );
    // Assign a random speed
    this.speed = Math.floor(Math.random() * (500 - 20 + 1)) + 20;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
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
 * Player
 * @constructor
 */
var Player = function () {
    this.x = grid.column(2);
    this.y = grid.row(5);
    this.intent = null;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
};

/**
 * Update player's position based on his intent,
 * required method for game
 */
Player.prototype.update = function () {
    switch (this.intent) {
        case 'left':
            this.x -= grid.COLUMN;
            break;
        case 'up':
            // If player is going to step into the water
            // reset him to the initial position
            if (grid.row(1) === this.y) {
                this.x = grid.column(2);
                this.y = grid.row(5);
            } else {
                this.y -= grid.ROW;
            }
            break;
        case 'right':
            this.x += grid.COLUMN;
            break;
        case 'down':
            this.y += grid.ROW;
            break;
    }
    // intent was fulfilled
    this.intent = null;
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
 * Check if intent is allowed
 * @param {string} intent
 * @return {boolean}
 * @private
 */
Player.prototype._isAllowed = function (intent) {
    switch (intent) {
        case 'left':
            // if player is in the left edge
            if (grid.column(0) === this.x)
                return false;
            break;
        case 'right':
            // if player is in the right edge
            if (grid.column(4) === this.x)
                return false;
            break;
        case 'down':
            // if player is in the bottom edge
            if (grid.row(5) === this.y)
                return false;
            break;
    }
    return true;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy()];
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
