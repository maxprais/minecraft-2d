// Globals
var tools = [];
var inventory = [];
var toolNames = ['hand', 'pickaxe', 'shovel', 'axe', 'inventory'];
var inventoryItems = ['stone', 'wood', 'leaves', 'grass', 'earth'];
var inventoryAmounts = [0, 0, 0, 0, 0];
// var cursorClasses = ['cursor-pickaxe', 'cursor-axe', 'cursor-shovel', 'cursor-inventory', 'cursor-hand'];

// When a tool button is clicked, select it visually and in tools array. Change cursor
function toolClick(i) {
    $('.tools').css('background-color','transparent');
    $('.invItem').css('border','1px solid black');

    // Show which tool is selected visually
    if (i<4) {
        $('#' + toolNames[i]).css('background-color', '#395668');
    // Show which inventory slot is selected
    } else {
        $('.invItem')[i-4].style.border = '1px solid gold';
    }

    // Update tool objects to make the current tool selected
    tools.forEach(function (data, index) {
        data.isSelected = false;
    });
    tools[i].isSelected = true;

    /*$.each(cursorClasses, function (value) {
        $('#board').removeClass(value);
    });*/

    // Change cursor to reflect selected tool
    if (getTool().name === 'pickaxe'){
        $('#board').removeClass();
        $('#board').addClass('cursor-pickaxe');
    }
    if (getTool().name === 'axe'){
        $('#board').removeClass();
        $('#board').addClass('cursor-axe');
    }
    if (getTool().name === 'shovel'){
        $('#board').removeClass();
        $('#board').addClass('cursor-shovel');
    }
    if (getTool().name === 'inventory') {
        $('#board').removeClass();
        $('#board').addClass('cursor-inventory');
    }
    if (getTool().name === 'inventory') {
        $('#board').removeClass();
        $('#board').addClass('cursor-hand');
    }
}

// Array of tile types that coorespond to tools in order of creation
var toolWorksOn = [
    ['stone', 'leaves', 'cloud'],
    ['stone'],
    ['grass', 'earth'],
    ['wood', 'leaves'],
    []
];

// Create tool buttons and inventory in side-bar
function createSideBar(){

    if (!tools.length) {
        // Create tool buttons and objects
        for (var i = 0; i < toolNames.length - 1; i++) {
            // Buttons
            var $div = $('<div></div>');
            $div.addClass('tools');
            $div.attr('id', toolNames[i]);
            $div.bind('mousedown', toolClick.bind(this, i));

            // Objects
            var tool = {};
            tool.$selector = $('#toolbox').append($div);
            tool.isSelected = i != 0;
            tool.name = toolNames[i];
            tool.worksOn = toolWorksOn[i];
            tools[i] = tool;
        }

        // Create inventory buttons and objects
        for (var i = 0; i < inventoryItems.length; i++) {
            // Buttons
            $div = $('<div></div>');
            $div.addClass('tools ' + inventoryItems[i]);
            $div.addClass('invItem');
            $div.bind('mousedown', toolClick.bind(this, i + 4));
            $div.text(inventoryAmounts[i]);

            // Objects
            var tool = {};
            $('#toolbox').append($div);
            tool.$selector = $div;
            tool.name = 'inventory';
            tool.tile = inventoryItems[i];
            tool.worksOn = toolWorksOn[4];
            tool.id = i;
            tools.push(tool);
        }
    }

}

// Search array of tool objects for the selected tool and return that tool object
function getTool() {

    for (var x=0; x<tools.length; x++) {
        if (tools[x].isSelected) {
            return tools[x];
        }
    }

}

