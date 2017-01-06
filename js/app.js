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
var Enemy = function () {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = grid.column(-1);
    this.y = grid.row(1);

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    this.x += dt * 40;
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function () {
    this.x = grid.column(2);
    this.y = grid.row(5);
    this.intent = null;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function () {
};

/**
 * Draw the player on screen
 */
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Handle input
 * @param {string} key
 */
Player.prototype.handleInput = function (key) {
    // TODO Restrict disallowed movements
    this.intent = key;
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
