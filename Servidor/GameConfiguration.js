function GameConfiguration()
{  
    this._boardWidth = 5000;
    this._boardHeight = 2500;
   
    this._ballRadius = 10;
    this._maxNumBalls = 50;
    this._addBallTime = 100;
    this._ballPoints = 10;
    
    this._playerInitialRadius = 50;
    this._playerPoints = 50;
    this._playerSpeedLimit = 10;
    this._playTime = 20;
    this._maxNumPlayers = 30;
    this._maxNumBots = 15;
    
    this._bombRadius = 30;
    this._bombExplosionTime = 30000;
    this._roundTime = 300000;
    this._nextRoundTime = 10000;
}


GameConfiguration.prototype.getBoardWidth = function()
{
    return this._boardWidth;
};

GameConfiguration.prototype.getBoardHeight = function()
{
    return this._boardHeight;
};


GameConfiguration.prototype.getBallRadius = function()
{
    return this._ballRadius;
};

GameConfiguration.prototype.getMaxNumBalls = function()
{
    return this._maxNumBalls;
};

GameConfiguration.prototype.getAddBallTime = function()
{
    return this._addBallTime;
};

GameConfiguration.prototype.getBallPoints = function()
{
    return this._ballPoints;
};


GameConfiguration.prototype.getPlayerInitialRadius = function()
{
    return this._playerInitialRadius;
};

GameConfiguration.prototype.getPlayerPoints = function()
{
    return this._playerPoints;
};

GameConfiguration.prototype.getPlayerSpeedLimit = function()
{
    return this._playerSpeedLimit;
};

GameConfiguration.prototype.getPlayTime = function()
{
    return this._playTime;
};

GameConfiguration.prototype.getMaxNumPlayers = function()
{
    return this._maxNumPlayers;
};

GameConfiguration.prototype.getMaxNumBots = function()
{
    return this._maxNumBots;
};

GameConfiguration.prototype.getBombRadius = function()
{
    return this._bombRadius;
};

GameConfiguration.prototype.getBombExplosionTime = function()
{
    return this._bombExplosionTime;
};

GameConfiguration.prototype.getRoundTime = function()
{
    return this._roundTime;
};

GameConfiguration.prototype.getNextRoundTime = function()
{
    return this._nextRoundTime;
};


module.exports = GameConfiguration;


