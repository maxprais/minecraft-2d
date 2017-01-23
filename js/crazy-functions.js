/**
 * Created by User on 12/30/2015.
 */

var events = [];

// TODO: create rock generator event that creates a bunch of rocks like a fountain
var generatorEvent = {
    name: 'generator'
};

// Flips the map upside-down
var flipEvent = {
    name: 'invert',
    func: function () {
        flipDir = flipDir>0 ? -1 : 1;
        saveMap();
        loadMap(-1);
    },
    repeat: 1,
    start: 0,
    interval: 100
};

// Creates a tree of the type property, growing from bottom to top
var growTree = {
    name: 'grow-tree',
    func: function () {
        console.log('x:' + this.x + ',y:' + this.y);
        var tt = getTileType(this.x, this.y);
        if (this.th) {
            changeTileType(this.x, this.y, 'wood');
            this.th--;
            this.repeat++;
        } else if (this.lh) {
            changeTileType(this.x, this.y-1, this.type);
            changeTileType(this.x, this.y, this.type);
            changeTileType(this.x, this.y+1, this.type);
            this.lh--;
            this.repeat++;
        }
        this.x = this.x - 1;// (1*flipEvent);
    },
    repeat: 1,
    start: 0,
    interval: 400,
    th: 4,
    lh: 3,
    x: 0,
    y: 0,
    type: 'leaves'
};

var treeDrop = {
    name: 'tree-drop',
    func: function () {
        var newFall = cloneObject(fallEvent);
        newFall.type = this.type;
        newFall.x = this.x;
        newFall.y = this.y;
        newFall.storage = 'leaves'; //getTileType(this.y, this.x);
        createEvent(newFall);
    },
    repeat: 1,
    start: 0,
    interval: 0,
    x: 0,
    y: 0,
    type: ''
};

// Creates a new tile
var fallEvent = {
    name: 'fall',
    func: function () {
        var tt = getTileType(this.x+1*flipDir, this.y);
        console.log('falling...');
        if (!doesCollide(this.x + flipDir, this.y, this.collisions)) {
            changeTileType(this.x, this.y, this.storage);
            this.x = this.x + flipDir;
            changeTileType(this.x, this.y, this.type);
            this.storage = tt;
            this.repeat++;
        }
    },
    repeat: 1,
    start: 0,
    interval: 100,
    x: 0,
    y: 0,
    type: 'stone',
    storage: 'sky',
    collisions: ['grass', 'earth', 'stone']
};

// Makes a tile "move" (or "jump"), given x and y velocities, subject to gravity acceleration
var moveEvent = {
    name: 'move',
    func: function () {
        console.log('x: ' + this.x + ', y: ' + this.y + ', x_vel: ' + this.x_vel + ', y_vel: ' + this.y_vel);

        var cont = true;
        changeTileType(this.x, this.y, this.storage);

        // Calculate new x and y values based on velocities, and subject object to gravity (and wind resistance?)
        var new_x = parseInt(this.x - (this.x_vel / 100));
        var new_y = parseInt(this.y + (this.y_vel / 100) + $board[0].length) % $board[0].length;
        this.x_vel += this.gravity;
        this.y_vel = this.y_vel * this.friction;

        // Check for horizontal collision
        if (!this.y_collided) {
            // If object is moving right
            if (this.y_vel > 0) {
                for (var ctr=new_y; ctr>this.y; ctr--) {
                    if (doesCollide(new_x, ctr, this.collisions)) {
                        if (this.y_bounce) {
                            this.y_vel = -this.y_vel;
                        } else {
                            this.y_vel = 0;
                        }
                        new_y = ctr - 1;
                        this.y_collided = true;
                    }
                }
            // If object is moving left
            } else {
                for (var ctr=new_y; ctr<this.y; ctr++) {
                    if (doesCollide(new_x, ctr, this.collisions)) {
                        if (this.y_bounce) {
                            this.y_vel = -this.y_vel;
                        } else {
                            this.y_vel = 0;
                        }
                        new_y = ctr + 1;
                        this.y_collided = true;
                    }
                }
            }
        }

        // Check for vertical collision below. if we find then stop the animation
        if (this.x_vel < 0) {
            for (var ctr=new_x; ctr>this.x; ctr--) {
                if (doesCollide(ctr, new_y, this.collisions)) {
                    new_x = ctr - 1;
                    cont = false;
                }
            }
        }

        // Check for vertical collision above
        if (this.x_vel > 0) {
            for (var ctr=new_x; ctr<this.x; ctr++) {
                if (doesCollide(ctr, new_y, this.collisions)) {
                    new_x = ctr + 1;
                    this.x_vel = 0;
                }
            }
        }

        // Make the move
        this.storage = getTileType(new_x, new_y); // store tile type in new coordinates to replace after moving again
        changeTileType(new_x, new_y, this.type + ' moving'); // change tile type of new coordinates to our object
        this.x = new_x; // update x
        this.y = new_y; // update y

        // Queue another animation unless we've hit an object below
        if (cont) {
            this.repeat = 1;
        } else {
            this.repeat = 0;
            changeTileType(new_x, new_y, this.type); // remove 'moving' class since we are on last frame
        }
    },
    repeat: 1,
    start: 50,
    interval: 60,
    x: 0,
    y: 0,
    x_vel: 100,
    y_vel: 0,
    gravity: -30,
    friction: 1,
    type: 'stone',
    collisions: ['grass','earth','stone', 'wood'],
    y_bounce: false,
    y_collided: false,
    storage: 'sky'
};

// Electric slide
var slideEvent = {
    name: 'slide',
    func: function () {
        var newMove = cloneObject(moveEvent);
        newMove.x = this.x;
        newMove.y = this.y;
        newMove.x_vel = this.x_vel;
        newMove.y_vel = this.y_vel;
        newMove.gravity = this.gravity;
        newMove.friction = this.friction;
        newMove.interval = this.interval;
        newMove.type = this.type;
        createEvent(newMove);
    },
    repeat: 1,
    start: 0,
    interval: 40,
    x: 0,
    y: 0,
    x_vel: 0,
    y_vel: 180,
    gravity: -20,
    friction: .7,
    type: 'wood'
};

// Creates a move event using passed parameters
function newMove(x, y, x_vel, y_vel, type, storage) {
    move = cloneObject(moveEvent);
    move.x = x;
    move.y = y;
    move.x_vel = x_vel;
    move.y_vel = y_vel;
    if (type) move.type = type;
    if (storage) move.storage = storage;
    createEvent(move);
}

// Collision detection, checks if coordinate xy contains any of the classes in array collisions
function doesCollide(x, y, collisions) {
    var tt = getTileType(x,y);
    collisions = collisions || ['grass', 'earth', 'stone'];
    if (collisions.indexOf(tt) > -1) {
        return true;
    }
    return false;
}

// Changes tile type at x,y to new type
function changeTileType(x, y, type) {
    if (x < 0) x = $board.length + x;
    if (y < 0) y = $board[0].length + y;
    x = x % $board.length;
    y = y % $board[0].length;

    $board[x][y].removeClass();
    $board[x][y].addClass('tile');
    $board[x][y].addClass(type);
}

// Returns tile type of given xy coordinates
function getTileType(x, y) {
    if (x < 0) x = $board.length + x;
    if (y < 0) y = $board[0].length + y;
    x = x % $board.length;
    y = y % $board[0].length;
    classList = $board[x][y].attr('class').split(/\s+/);
    $.each(classList, function (index, item) {
        if (item==='tile' || item==='interact' || item==='sky') {
            classList.slice(index, 1);
        }
    });
    return classList[classList.length-1];
}

// Creates a timer for an event, making first call with its start property (ms)
function createEvent(event) {
    events.push(event);
    setTimeout(eventTimer.bind(this, event), event.start);
}

function stopEvents() {
    events.forEach(function (data) {
        data.repeat = 0;
    })
    events = [];
}

// Timer function that recursively calls an event based on its repeat and interval values
function eventTimer(event) {
    if (event.repeat--) {
        event.func();
        console.log('event: "' + event.name + '"');
        setTimeout(eventTimer.bind(this, event), event.interval);
    }
}