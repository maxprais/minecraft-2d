// Globals
$board = []; // matrix that holds JQuery elements of every tile
tileClasses = ['sky', 'cloud', 'grass', 'earth', 'stone', 'wood', 'leaves']; // array of all available tile types
var old_x, old_y; // for calculating the direction the user is moving the cursor (used in mouseover)
var old_time;

// Create the tiles and add some attributes to them. Put them in $board matrix
function createBoard(sx, sy) {
    if (!$board[0]) {
        for (var i = 0; i < sx; i++) {
            $board.push([]);
            var $row = $('<div></div>');
            $row.addClass('row');
            for (var j = 0; j < sy; j++) {
                var $tile = $('<div></div>');
                $tile.addClass('tile');
                $tile.on('click', clickTile.bind(event, i, j));
                $tile.on('mouseover', tileHover.bind(event, i, j));
                $tile.on('mouseout', tileMouseOut.bind(event, i, j));
                $tile.on('mousedown', function () {
                    event.preventDefault()
                });
                $row.append($tile);
                $board[i].push($tile);
            }
            $('#board').append($row);
        }
    }
}

// Called when mouse hovers over a tile
function tileHover(x, y, event) {
    var isGood;
    getTool().worksOn.forEach(function (data) {
        if ($board[x][y].hasClass(data)) {
            isGood = true;
        }
    });
    if (getTool().name==='inventory') {
        if (inventory.length) isGood = true;
    }
    if (isGood) {
        $board[x][y].css('opacity', '.6');
    } else {
        $board[x][y].css('opacity', '1');
    }

    old_x = old_x || x;
    old_y = old_y || y;
    old_time = old_time || 500;
    var new_time = new Date().getTime();

    if (event.buttons===1) {
        if ($board[old_x][old_y].hasClass('stone') && !$board[old_x][old_y].hasClass('moving')) {
            /*var moveClone = cloneObject(moveEvent);
            moveClone.x = old_x;
            moveClone.y = old_y;
            moveClone.x_vel = 1000 / 4 - (new_time-old_time>1000?1000:new_time-old_time) / 4 + 30; //randNumber(30, 200);
            var y_vel;
            if (y > old_y) {
                y_vel = 1; //randNumber(100, 200);
            } else if (y < old_y) {
                y_vel = -1; //randNumber(-100, -60);
            } else if (x < old_x) {
                y_vel = 0;
            } else {
                y_vel = 0;
                moveClone.x_vel = 0; // -100;
            }
            moveClone.y_vel = y_vel * ((700 / 4 - (new_time-old_time>700?700:new_time-old_time) / 4) + (y>old_y?100:-10));
            moveClone.type = 'stone';
            moveClone.collisions = ['stone', 'grass', 'earth', 'wood'];
            moveClone.y_bounce = false;
            createEvent(moveClone);*/
            $board[old_x][old_y].addClass('moving');
            const MAX_X_VEL = 800, MAX_Y_VEL = 800;
            var x_vel = MAX_X_VEL / 4 - (new_time-old_time>MAX_X_VEL ? MAX_X_VEL : new_time-old_time) / 4 + 30; //randNumber(30, 200);
            var y_vel;
            if (y > old_y) {
                y_vel = 1; //randNumber(100, 200);
            } else if (y < old_y) {
                y_vel = -1; //randNumber(-100, -60);
            } else if (x < old_x) {
                y_vel = 0;
            } else {
                y_vel = 0;
                x_vel = 0; // -100;
            }
            y_vel = y_vel * ((MAX_Y_VEL / 4 - (new_time-old_time>MAX_Y_VEL ? MAX_Y_VEL : new_time-old_time) / 4) + (y>old_y ? 100 : 50));
            newMove(old_x, old_y, x_vel, y_vel);
        }
    }
    old_x = x;
    old_y = y;
    old_time = new_time;
}

// Called when cursor is moved off a tile. Resets the 'interactivy' settings of the old tile
function tileMouseOut(x, y) {
    $board[x][y].css('opacity', '1');
}

// Called when a tile is clicked or mouseover when mouse button is down
function clickTile(x, y) {
    var tool = getTool();

    // if an inventory tile is selected
    if (tool.name == 'inventory') {
        // if we have at least one of this tile in inventory, put tile onto board
        if (inventoryAmounts[tool.id]) {

            // if tile is placed in ground, create a tree
            //if (x > ($board.length-GROUND_HEIGHT)) { //flipDir>0 ? (x > ($board.length-GROUND_HEIGHT)) : x < GROUND_HEIGHT
            if ($board[x][y].hasClass('earth')) {
                var growTreeClone = cloneObject(growTree);
                growTreeClone.x = x-1;
                growTreeClone.y = y;
                growTreeClone.th = randNumber(3,5);
                growTreeClone.lh = randNumber(2,3);
                growTreeClone.type = tool.tile;
                createEvent(growTreeClone);
            }

            // keep track of whether there was a cloud
            var hasCloud = false;
            if ($board[x][y].hasClass('cloud')) hasCloud = true;

            // change tile to inventory tile
            $board[x][y].removeClass();
            $board[x][y].addClass('tile');
            if (hasCloud) $board[x][y].addClass('cloud');
            $board[x][y].addClass(tool.tile);

            // update inventory amount
            tool.$selector.text(--inventoryAmounts[tool.id]);
        }

    // Hand for interacting with things
    } else if (tool.name === 'hand') {

        // If using 'hand', see if we are clicking on an interactable object,
        //   and trigger an event if we are
        classList = $board[x][y].attr('class').split(/\s+/);
        var count = classList.length;
        $.each(classList, function (index, item) {
            if (item==='tile' || item==='interact') {
                classList.slice(index, 1);
                count--;
            }
        });

        // Clicking on leaves causes a stone to fall out
        if ($board[x][y].hasClass('leaves')) {
            /*var dropClone = cloneObject(treeDrop);
            dropClone.x = x;
            dropClone.y = y;
            dropClone.type = 'stone';
            createEvent(dropClone);*/
            newMove(x+1, y, -50, 0);

        // Clicking on wood makes the wood "slide"
        } else if ($board[x][y].hasClass('wood')) {
            var slideClone = cloneObject(slideEvent);
            slideClone.x = x;
            slideClone.y = y;
            slideClone.y_vel = randNumber(1) ? slideClone.y_vel : -slideClone.y_vel + 50;
            slideClone.type = 'wood';
            createEvent(slideClone);

        // Clicking on stones flicks them in random direction
        } else if ($board[x][y].hasClass('stone') && !$board[x][y].hasClass('moving')) {
            /*var moveClone = cloneObject(moveEvent);
            moveClone.x = x;
            moveClone.y = y;
            moveClone.x_vel = numBetween(30,200);
            moveClone.y_vel = !numBetween(0,1) ? numBetween(100,200) : numBetween(-100,-60);
            moveClone.gravity = -35;
            moveClone.type = 'stone';
            moveClone.storage = 'sky';
            moveClone.collisions = ['stone', 'grass', 'earth', 'wood'];
            moveClone.interval = 50;
            createEvent(moveClone);*/
            var x_vel = randNumber(30,200);
            var y_vel = !randNumber(1) ? randNumber(100,200) : randNumber(-100,-60);
            newMove(x, y, x_vel, y_vel);

        // Clicking on clouds flips the board
        } else if (count==1 && $board[x][y].hasClass('cloud')) {
            var flipClone = cloneObject(flipEvent);
            createEvent(flipClone);
        }

    // For all normal tools:
    } else {
        var shouldWork = false;
        var classThatWorks;

        // See if clicked tile contains a class that this tool works on
        tool.worksOn.forEach(function (data) {
            if ($board[x][y].hasClass(data)) {
                shouldWork = true;
                classThatWorks = data;
            }
        });

        // If it does, replace the tile with sky and update inventory
        if (shouldWork){
            $board[x][y].removeClass(classThatWorks);
            $board[x][y].removeClass('interact');
            $board[x][y].addClass('sky');
            $('.'+classThatWorks+'.invItem').text(++inventoryAmounts[inventoryItems.indexOf(classThatWorks)]);
        }
    }
    //tileHover(x, y);
}
