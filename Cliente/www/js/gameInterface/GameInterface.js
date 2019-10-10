
/* global game, io, Player, Bomb, Bot */

function GameInterface()
{  
    this._playerDataInterface = new PlayerDataInterface();
    this._resultsInterface = new ResultsInterface();
    this._drawingInterface = new DrawingInterface();
    this._rankingInterface = new RankingInterface();  
    this._audioInterface = new AudioInterface();
    this._socketInterface = new SocketInterface();
    this._accelerateInterface = new AccelerateInterface();
    this._resurrectInterface = new ResurrectInterface();
    this._notificationInterface = new NotificationInterface();
    this._waitingInterface = new WaitingInterface();
    this._resizeInterface = new ResizeInterface();
    this._throwBombInterface = new ThrowBombInterface();
    this._cordovaInterface = new CordovaInterface();  
}


GameInterface.prototype.getPlayerDataInterface = function()
{
    return this._playerDataInterface;
};

GameInterface.prototype.getResultsInterface = function()
{
    return this._resultsInterface;
};

GameInterface.prototype.getDrawingInterface = function()
{
    return this._drawingInterface;
};

GameInterface.prototype.getRankingInterface = function()
{
    return this._rankingInterface;
};

GameInterface.prototype.getAudioInterface = function()
{
    return this._audioInterface;
};

GameInterface.prototype.getSocketInterface = function()
{
    return this._socketInterface;
};

GameInterface.prototype.getAccelerateInterface = function()
{
    return this._accelerateInterface;
};

GameInterface.prototype.getResurrectInterface = function()
{
    return this._resurrectInterface;
};

GameInterface.prototype.getNotificationInterface = function()
{
    return this._notificationInterface;
};

GameInterface.prototype.getWaitingInterface = function()
{
    return this._waitingInterface;
};

GameInterface.prototype.getResizeInterface = function()
{
    return this._resizeInterface;
};

GameInterface.prototype.getThrowBombInterface = function()
{
    return this._throwBombInterface;
};

GameInterface.prototype.getCordovaInterface = function()
{
    return this._cordovaInterface;
};


