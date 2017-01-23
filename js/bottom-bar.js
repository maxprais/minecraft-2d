/**
 * Created by User on 12/30/2015.
 */
function createSaveButton() {
    var $save = $('<div></div>');
    $save.addClass('bottomButton');
    $save.text('SAVE');
    $save.on('click', storeGame);
    $('#bottom').append($save);
}

function createLoadButton() {
    var $load = $('<div></div>');
    $load.text('LOAD');
    $load.addClass('bottomButton');
    $load.on('click', loadStoredGame);
    $('#bottom').append($load);
}

function createNewGameButton() {
    var $newGame = $('<div></div>');
    $newGame.text('NEW GAME');
    $newGame.addClass('bottomButton');
    $newGame.on('click', newGame);
    $('#bottom').append($newGame);
}

function createExitGameButton() {
    var $exitGame = $('<div></div>');
    $exitGame.text('EXIT');
    $exitGame.addClass('bottomButton');
    $exitGame.on('click', welcome);
    $('#bottom').append($exitGame);
}

function createBottomButtons() {
    if (!$('.bottomButton')[0]) {
        createSaveButton();
        createLoadButton();
        createNewGameButton();
        createExitGameButton();
    }
}