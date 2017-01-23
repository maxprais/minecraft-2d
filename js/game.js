// Constants
const BOARD_HEIGHT = 20, BOARD_WIDTH = 32;

// Open welcome screen when page loads
$(document).ready(function() {
    welcome();
});

// Called when start button on welcome screen is pressed
function gameInit() {
    createBoard(BOARD_HEIGHT, BOARD_WIDTH); // create a x b tiles
    newGame(); // generate a map, use it to give tiles different classes for display/functionality
    createSideBar(); // generate tools/inventory
    createBottomButtons();
    toolClick(0); // select pickaxe
    //$(window).resize(function() {});
}