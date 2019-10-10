
function CordovaInterface()
{
    this.init();
}

CordovaInterface.prototype.init = function()
{
    var currentTime = 0;

    const ACCELEROMETER_TIME = 500;

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        var options = { frequency: ACCELEROMETER_TIME};
        var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);

        document.addEventListener("backbutton", onBackButton, false);
        navigator.app.overrideButton("menubutton", true);
        document.addEventListener("menubutton", onMenuButton, false);
    }


    function onSuccess(acceleration) {   
        if(game.getActivePlayer() !== null)
        {                 
            currentTime = currentTime + 0.5;
            var currentPlayerSpeedX = acceleration.y * currentTime;
            var currentPlayerSpeedY = acceleration.x * currentTime;
            gameInterface.getSocketInterface().getWebSocket().emit("acceleratePlayer", {horizontalSpeed: currentPlayerSpeedX, verticalSpeed: currentPlayerSpeedY});
        }
    }

    function onError() {
        alert('Error!');
    }

    function onBackButton(evt)
    {
        evt.preventDefault();
        
        if(game.getActivePlayer() !== null)
        {
            navigator.notification.confirm(
                                "", 
                                onConfirm, 
                                "Exit Game?", 
                                'OK,Cancel'  
             );
        }
    }
    
    function onConfirm(button)
    {
        if(button === 1)
        {
            exitGame();
        }
    }
    
    function exitGame()
    {
        navigator.app.exitApp();
    }
    
    function onMenuButton(event)
    {
        gameInterface.getThrowBombInterface().throwBomb();
    }
};


