<<<<<<< HEAD
MINECRAFT PLAN

CORE FUNCTIONALITY
---------------------------------

Skeleton  - HTML
Container div.
Two divs - grid + menu options.

Tiles - changeable backgrounds using click events (sky, cloud, stone, treebark, tree leaves, dirt, dirt/grass)
Click events - start with just mousedown, do stuff based on selected tool
Board - matrix containing NxN tiles
Tools - start with global tool that can remove any tile
Pre-loaded map
Store a tile that is clicked on
Put stored tiles onto board

JS FILES
game.js - call functions from other .js files
board.js - contain board matrix, create tiles to populate board, click function
sidebar.js - create tools, click function, inventory

createTiles - create divs with tile and tile type class to populate board matrix
clickTile - check tool, if right tool for tile type, change tile type to sky and add tile to inventory
	    OR if inventory is selected, if clicking on sky, change tile to inventory tile type and
remove from inventory
createTools - create divs with tool class 
clickTool - make sure just one tool or inventory is selected
getTool - check which tool/inventory is selected


CSS
Tile Class - tile + type of tile.
Tool class.
Inventory id
Selected class - to show selected tool or inventory

FEATURES
-----------------
Make tile types into background images (instead of background colors)
Tools: pickaxe, axe, shovel
Save/Load board state
Functionality for all tools
Start page



CRAZY FEATURES
---------------------------
trees can fall
Cursor image becomes tool choice
=======
# minecraft
>>>>>>> fc1c043276c831d8f3e30f369491734cd70aaf06
