// First function
function welcome() {
    $('.bottomButton').hide();
    $('#board').hide();
    $('#sidebar').hide();
    $('.startButton').show();
    if (localStorage.length) $('.continueButton').show();
    $('.container').removeClass('main-game-container');
    $('.inner-container').css({'padding-top': '20%', 'padding-bottom': '20%'});
    stopEvents();

    // If start and continue buttons already exist, fade them in
    if ($('.startButton')[0]) {
        $('.startButton').fadeIn(2000);
        $('.continueButton').fadeIn(2000);

    // Otherwise, create the buttons and fade them in
    } else {
        var $startButton = $('<div></div>');
        $startButton.text("Play MineCraft");
        $startButton.addClass('startButton');
        $startButton.fadeIn(2000);
        $startButton.on('click', function () {
            $('#board').show();
            $('#sidebar').show();
            gameInit();
            $('.container').addClass('main-game-container');
            $('.inner-container').css({'padding-top': '0.4%', 'padding-bottom': '0.4%'});
            $startButton.hide();
            $continueButton.hide();
            $('.bottomButton').show();
        });
        $('.inner-container').append($startButton);

        var $continueButton = $('<div></div>');
        $continueButton.text("Continue Saved Game");
        $continueButton.addClass('continueButton');
        $continueButton.fadeIn(2000);

        $continueButton.on('click', function () {
            loadOnStart = true;
            $startButton.click();
        });
    }

    // If there is no saved game, hide continue button
    if (localStorage.length) {
        $('.inner-container').append($continueButton);
    }
}