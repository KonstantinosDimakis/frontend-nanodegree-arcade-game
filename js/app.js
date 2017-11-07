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

/**
 * ScoreBoard is an object that makes it easy to
 * manipulate the score of the game
 * @type {{view: Element}}
 */
var scoreBoard = {
    _view: document.getElementById('score'),
};

/**
 * Game score
 * @type {number}
 */
scoreBoard.score = 0;

/**
 * Render score to the HTML view
 */
scoreBoard.render = function () {
    this._view.innerHTML = this.score;
};

/**
 * Enemies player must avoid
 * @constructor
 */
var Enemy = function () {
    // initialize enemy
    this._initialize();

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

/**
 * Min and Max speed of enemies
 * @type {{min: number, max: number}}
 */
Enemy.SPEED = {
    min: 50,
    max: 400,
};

/**
 * Update enemy position
 * @param {number} dt
 */
Enemy.prototype.update = function (dt) {
    // if enemy has completely crossed the canvas
    // initialize him again
    if (this.x >= GRID.column(5)) {
        this._initialize();
    }
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.speed;
};

/**
 * Draw the enemy on the screen, required method for game
 */
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Initialize enemy off canvas in one of 3 rows randomly
 * and give him a speed.
 * @private
 */
Enemy.prototype._initialize = function () {
    // Initialize enemy off screen
    this.x = GRID.column(-1);
    // Randomly place enemy on 1 of the 3 rows
    this.y = GRID.row(
        Math.floor(Math.random() * (3 - 1 + 1)) + 1
    );
    // Assign a random SPEED
    this.speed = Math.floor(Math.random() * (Enemy.SPEED.max - Enemy.SPEED.min + 1)) + Enemy.SPEED.min;
};

/**
 * Item is an Abstract class. It should only be extended
 * @param {number} x Position
 * @param {number} y Position
 * @constructor
 */
var Item = function () {
    // cannot produce objects of class Item
    if (this.constructor === Item) {
        throw new Error('Can\'t instantiate abstract class!');
    }
    // position should be initialized when creating an extended class
    this.x;
    this.y;
    this.visible = false;

    // sprite should be Initialized when creating an extended class
    this.sprite;
};

/**
 * Draw Item on screen
 */
Item.prototype.render = function () {
    if (this.isVisible())
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Make Item visible
 */
Item.prototype.show = function () {
    this.visible = true;
};

/**
 * Hide Item
 */
Item.prototype.hide = function () {
    this.visible = false;
};

/**
 * Check if Item is visible
 * @return {boolean}
 */
Item.prototype.isVisible = function () {
    return this.visible;
};

/**
 * Extends Item
 * Gem that player collects
 * @param {number} x
 * @param {number} y
 * @constructor
 */
var Gem = function () {
    Item.call(this);
    this.intent = 'shown'; // Gem is intended to be shown on game board
    this.sprite = 'images/Gem Blue.png';
    this.value = 50; // value to be used for score
};
Gem.prototype = Object.create(Item.prototype);
Gem.prototype.constructor = Gem;

/**
 * Initialize gem randomly on enemy territory
 */
Gem.prototype.initialize = function () {
    this.show();
    // Randomly place the gem in 1 of 5 columns
    this.x = GRID.column(
        Math.floor(Math.random() * (4 - 0 + 1)) + 0
    );
    // Randomly place the gem on 1 of the 3 rows
    this.y = GRID.row(
        Math.floor(Math.random() * (3 - 1 + 1)) + 1
    );
};

/**
 * Terminate gem, by hiding it
 */
Gem.prototype.terminate = function () {
    this.hide();
    this.intent = 'shown';
};

/**
 * Show Gem on game board if intent is to be shown
 */
Gem.prototype.update = function () {
    // if gem is to be shown
    if (this.intent === 'shown') {
        // then fulfill show
        this.intent = 'waiting';
        // ES6 syntax
        // setTimeout(() => { this.initialize(); },
        // (Math.floor(Math.random() * (10 - 5 + 1)) + 5) * 1000);
        var initGem = this; // using this temp var for setTimeout to work
        setTimeout(function () {
            initGem.initialize();
            // Show gem between 5 - 10 seconds after intent
        }, (Math.floor(Math.random() * (10 - 5 + 1)) + 5) * 1000);
    }
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
 * Proclaim player as winner
 */
Player.prototype.win = function () {
    alert('You won the game, congratulations!\nYour score was: ' + scoreBoard.score);
    scoreBoard.score = 0; // reset score
    this.initialize();
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
            // move player left
            this.x -= GRID.COLUMN;
            break;
        case 'up':
            // If player is going to step into the water
            // player wins & is reinitialized
            if (GRID.row(1) === this.y) {
                this.win();
            } else {
                // else move player up
                this.y -= GRID.ROW;
            }
            break;
        case 'right':
            // move player right
            this.x += GRID.COLUMN;
            break;
        case 'down':
            // move player down
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
 * Return true if player is on top of a particular entity
 * @param {Object} entity
 * @return {boolean}
 */
Player.prototype.isOnTopOf = function (entity) {
    return this.x === entity.x && this.y === entity.y;
};

/**
 * Check Enemy collision based on 2 criteria
 * 1. Enemy and player are in the same row
 * 2. Enemy sprite collides with player on the torso
 * @param {Enemy} enemy
 * @return {boolean}
 */
Player.prototype.isCollidingWithEnemy = function (enemy) {
    // Starts hitting player torso           is on the same row    hitting player torso with the back
    return (enemy.x + 101 >= this.x + 38) && (this.y === enemy.y) && (enemy.x <= this.x + 58);
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
var gem = new Gem();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
