/* global game */

function Game()
{      
    this._board = null;
    this._balls = {};
    this._activePlayer = null;
    this._players = {};
    this._playersImg = {};   
    this._roundTime = null;
    this._roundResults = null;
    this._globalResults = null;
    this._roundStarted = false;
}


Game.prototype.getBoard = function()
{
    return this._board;
};

Game.prototype.setBoard = function(board)
{
    this._board = board;
};

Game.prototype.getBalls = function()
{
    return this._balls;
};

Game.prototype.getActivePlayer = function()
{
    return this._activePlayer;
};

Game.prototype.setActivePlayer = function(activePlayer)
{
    this._activePlayer = activePlayer;
};

Game.prototype.getPlayers = function()
{
    return this._players;
};

Game.prototype.getPlayersImg = function()
{
    return this._playersImg;
};

Game.prototype.getRoundResults = function()
{
    return this._roundResults;
};

Game.prototype.setRoundResults = function(roundResults)
{
    this._roundResults = roundResults;
};

Game.prototype.getGlobalResults = function()
{
    return this._globalResults;
};

Game.prototype.setGlobalResults = function(globalResults)
{
    this._globalResults = globalResults;
};

Game.prototype.getRoundStarted = function()
{
    return this._roundStarted;
};

Game.prototype.setRoundStarted = function(roundStarted)
{
    this._roundStarted = roundStarted;
};


