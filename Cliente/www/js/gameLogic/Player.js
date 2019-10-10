/* global Ball, socket, game */

function Player(playerString)
{
    Ball.call(this, playerString);
   
    this._nick = playerString._nick;
    this._alive = playerString._alive;
    this._visibleAreaX1 = playerString._visibleAreaX1;
    this._visibleAreaY1 = playerString._visibleAreaY1;
    this._visibleAreaX2 = playerString._visibleAreaX2;
    this._visibleAreaY2 = playerString._visibleAreaY2;
    this._horizontalSpeed = playerString._horizontalSpeed;
    this._verticalSpeed = playerString._verticalSpeed;
    if(playerString._roundResults === null)
    {
        this._roundResults = null;
    }else{
        this._roundResults = new PlayerRoundResults(playerString._roundResults);
    }
}

Player.prototype = Object.create(Ball.prototype);
Player.prototype.constructor = Player;

Player.prototype.getNick = function()
{
    return this._nick;
};

Player.prototype.getAlive = function()
{
    return this._alive;
};

Player.prototype.setAlive = function(alive)
{
    this._alive = alive;
};

Player.prototype.getVisibleAreaX1 = function()
{
    return this._visibleAreaX1;
};

Player.prototype.getVisibleAreaY1 = function()
{
    return this._visibleAreaY1;
};

Player.prototype.getVisibleAreaX2 = function()
{
    return this._visibleAreaX2;
};

Player.prototype.getVisibleAreaY2 = function()
{
    return this._visibleAreaY2;
};

Player.prototype.getRoundResults = function()
{
    return this._roundResults;
};


Player.prototype.accelerate = function(newPosition)
{
    var scaleWidth = window.innerWidth / (this._visibleAreaX2 - this._visibleAreaX1);
    var scaleHeight = window.innerHeight / (this._visibleAreaY2 - this._visibleAreaY1);
    var movedDistanceX = (this._visibleAreaX1 + newPosition.x / scaleWidth) - this.getPosX();
    var movedDistanceY = (this._visibleAreaY1 + newPosition.y / scaleHeight) - this.getPosY();

    var newHorizontalSpeed = movedDistanceX / 30;
    var newVerticalSpeed = movedDistanceY / 30;

    gameInterface.getSocketInterface().getWebSocket().emit("acceleratePlayer", {horizontalSpeed: newHorizontalSpeed, verticalSpeed: newVerticalSpeed });
};

Player.prototype.resurrect = function()
{
    if(!this._alive)
    {
        gameInterface.getSocketInterface().getWebSocket().emit("resurrectPlayer");
    }
};



