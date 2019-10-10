
/* global game, server */

const Ball = require("./Ball.js");
const util = require('util');
const PlayerRoundResults = require("./PlayerRoundResults.js");

function Player(game)
{
    Ball.call(this, game);
    
    this._alive = false;
    this._nick = null;
    this._imgLocation = null;
    this._visibleAreaX1 = null;
    this._visibleAreaY1 = null;
    this._visibleAreaX2 = null;
    this._visibleAreaY2 = null;
    this._windowWidth = null;
    this._windowHeight = null;
    this._windowSizeChanged = false;
    this._horizontalSpeed = 0;
    this._verticalSpeed = 0;
    this._canThrowBomb = true;
    this._roundResults = null;
}

util.inherits(Player, Ball);

Player.prototype.getAlive = function()
{
    return this._alive;
};

Player.prototype.setAlive = function(newState)
{
	this._alive = newState;
};

Player.prototype.getNick = function()
{
    return this._nick;
};

Player.prototype.setNick = function(newNick)
{
	this._nick = newNick;
};

Player.prototype.getImgLocation = function()
{
    return this._imgLocation;
};

Player.prototype.setImgLocation = function(imgLocation)
{
    this._imgLocation = imgLocation;
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

Player.prototype.getWindowWidth = function()
{
    return this._windowWidth;
};

Player.prototype.getWindowHeight = function()
{
    return this._windowHeight;
};

Player.prototype.getHorizontalSpeed = function()
{
    return this._horizontalSpeed;
};

Player.prototype.setHorizontalSpeed = function(horizontalSpeed)
{
    this._horizontalSpeed = horizontalSpeed;
};

Player.prototype.getVerticalSpeed = function()
{
    return this._verticalSpeed;
};

Player.prototype.setVerticalSpeed = function(verticalSpeed)
{
    this._verticalSpeed = verticalSpeed;
};

Player.prototype.getCanThrowBomb = function()
{
    return this._canThrowBomb;
};

Player.prototype.setCanThrowBomb = function(canThrowBomb)
{
    this._canThrowBomb = canThrowBomb;
};

Player.prototype.getRoundResults = function()
{
    return this._roundResults;
};

Player.prototype.setRoundResults = function(roundResults)
{
    this._roundResults = roundResults;
};

Player.prototype.setWindowSize = function(windowWidth, windowHeight)
{
    this._windowWidth = windowWidth;
    this._windowHeight = windowHeight;
    this._windowSizeChanged = true;
};


Player.prototype.play = function()
{
    if(this.getAlive())
    {
        this.move();
        this.attackElements();
        this.setVisibleArea();
        /*this._visibleAreaX1 = 0;
        this._visibleAreaY1 = 0;
        this._visibleAreaX2 = this.getGame().getConfiguration().getBoardWidth();
        this._visibleAreaY2 = this.getGame().getConfiguration().getBoardHeight();*/
    }else{
        this.setVisibleArea();
    }
    return this;
};

Player.prototype.attackElements = function()
{
    var balls = this.getGame().getBalls();
    var players = this.getGame().getPlayers();
    
    for(var ballId in balls)
    {
        if (balls.hasOwnProperty(ballId))
        {
            this.attackElement(balls[ballId]);
        }
    }
    
    for(var playerId in players)
    {
        if (players.hasOwnProperty(playerId))
        {
            this.attackElement(players[playerId]);
        }
    }
};

Player.prototype.attackElement = function(element)
{
    const Bot = require("./Bot.js");
    if(element.constructor === Ball)
    {
        this.attackBall(element);
    }else if(element.constructor === Player){
        this.attackPlayer(element);
    }else if(element.constructor === Bot){
        this.attackBot(element);
    }
};

Player.prototype.attackBall = function(ball)
{
    var distance = require("./Utilities.js").euclideanDistance(this.getPosX(), this.getPosY(), ball.getPosX(), ball.getPosY());
    if(distance <= this.getRadius() + ball.getRadius())
    {
        var newRadius = Math.sqrt(Math.pow(this.getRadius(),2) + Math.pow(ball.getRadius(),2));
        this.setRadius(newRadius);
        this.getRoundResults().setResultValue("points", this.getRoundResults().getResultValue("points") + this.getGame().getConfiguration().getBallPoints());
        this.getRoundResults().setResultValue("ballsEaten", this.getRoundResults().getResultValue("ballsEaten") + 1);
        var ballId = ball.getId();
        delete this.getGame().getBalls()[ballId];
        this.getGame().getServer().getWebsocketModule().sockets.emit("deletedBall", ballId);
    }
};

Player.prototype.attackPlayer = function(player)
{
    var distance;
    var newRadius;
   
    if(player.getAlive() && player.getId() !== this.getId())
    {
        distance = require("./Utilities.js").euclideanDistance(this.getPosX(), this.getPosY(), player.getPosX(), player.getPosY());
        if(this.getRadius() > player.getRadius() && distance <= this.getRadius())
        {
            newRadius = Math.sqrt(Math.pow(this.getRadius(),2) + Math.pow(player.getRadius(),2));
            this.setRadius(newRadius);
            this.getRoundResults().setResultValue("points", this.getRoundResults().getResultValue("points") + player.getRoundResults().getResultValue("points"));
            this.getRoundResults().setResultValue("playersEaten", this.getRoundResults().getResultValue("playersEaten") + 1);
            player.kill();
        }
    }
};

Player.prototype.attackBot = function(bot)
{
    var distance;
    var newRadius;
   
    if(bot.getAlive() && bot.getId() !== this.getId())
    {
        distance = require("./Utilities.js").euclideanDistance(this.getPosX(), this.getPosY(), bot.getPosX(), bot.getPosY());
        if(this.getRadius() > bot.getRadius() && distance <= this.getRadius())
        {
            newRadius = Math.sqrt(Math.pow(this.getRadius(),2) + Math.pow(bot.getRadius(),2));
            this.setRadius(newRadius);
            this.getRoundResults().setResultValue("points", this.getRoundResults().getResultValue("points") + bot.getRoundResults().getResultValue("points"));
            this.getRoundResults().setResultValue("playersEaten", this.getRoundResults().getResultValue("playersEaten") + 1);
            bot.kill();
            bot.resurrect();
        }
    }
};


Player.prototype.kill = function()
{	
    this.setAlive(false); 
    this.setRadius(this.getGame().getConfiguration().getPlayerInitialRadius());
    this.setHorizontalSpeed(0);
    this.setVerticalSpeed(0);
    
    var deaths = this.getRoundResults().getResultValue("deaths");
    this.getRoundResults().setResultValue("deaths", deaths + 1);
    this.getRoundResults().setResultValue("points", 0);
    
    this.getGame().getServer().getWebsocketModule().sockets.emit("deadPlayer", this.getId());
};

Player.prototype.reset = function()
{
    this.setAlive(false); 
    this.setRadius(this.getGame().getConfiguration().getPlayerInitialRadius());
    this.setHorizontalSpeed(0);
    this.setVerticalSpeed(0);
    this.setCanThrowBomb(true);
};

Player.prototype.resurrect = function()
{
    this.setAlive(true);
    this.getGame().setElementPosition(this);
};

Player.prototype.move = function()
{
    var boardWidth = this.getGame().getConfiguration().getBoardWidth();
    var boardHeight = this.getGame().getConfiguration().getBoardHeight();
    
    var newPosX = this.getPosX() + this._horizontalSpeed;
    var newPosY = this.getPosY() + this._verticalSpeed;

    if(newPosX - this.getRadius() <= 0){
        newPosX = this.getRadius();
    }else if(newPosX + this.getRadius() >= boardWidth){
        newPosX = boardWidth - this.getRadius();
    }

    if(newPosY - this.getRadius() <= 0)
    {
        newPosY = this.getRadius();
    }else if(newPosY + this.getRadius() >= boardHeight){
        newPosY = boardHeight - this.getRadius();
    }
    
    this.setPosX(newPosX);
    this.setPosY(newPosY);
};

Player.prototype.accelerate = function(newHorizontalSpeed, newVerticalSpeed)
{
    var playerSpeedLimit = this.getGame().getConfiguration().getPlayerSpeedLimit();
    if(Math.abs(newHorizontalSpeed) > playerSpeedLimit)
    {
        this._horizontalSpeed = Math.sign(newHorizontalSpeed) * playerSpeedLimit;
    }else{
        this._horizontalSpeed = newHorizontalSpeed;
    }
    if(Math.abs(newVerticalSpeed) > playerSpeedLimit)
    {
        this._verticalSpeed = Math.sign(newVerticalSpeed) * playerSpeedLimit;
    }else{
        this._verticalSpeed = newVerticalSpeed;
    }
};

Player.prototype.setVisibleArea = function()
{
    var visibleAreaWidth, visibleAreaHeight;
    if(this._windowSizeChanged)
    {
        this._windowSizeChanged = false;

        var proportion = this._windowWidth / this._windowHeight;
        visibleAreaWidth = 20 * this.getGame().getConfiguration().getPlayerInitialRadius();
        visibleAreaHeight = visibleAreaWidth / proportion;   
    }else{
        visibleAreaWidth = this._visibleAreaX2 - this._visibleAreaX1;
        visibleAreaHeight = this._visibleAreaY2 - this._visibleAreaY1;
    }


    if(this.getRadius() * 2 >= Math.trunc(visibleAreaHeight / 2))
    {
        var proportion = this._windowWidth / this._windowHeight;
        visibleAreaHeight = visibleAreaHeight + (this.getRadius() * 2 - visibleAreaHeight / 2);
        visibleAreaWidth = visibleAreaHeight * proportion;
    }else{
        var proportion = this._windowWidth / this._windowHeight;
        visibleAreaWidth = 20 * this.getGame().getConfiguration().getPlayerInitialRadius();
        visibleAreaHeight = visibleAreaWidth / proportion;   
    }

    this._visibleAreaX1 = this.getPosX() - visibleAreaWidth / 2;
    this._visibleAreaX2 = this.getPosX() + visibleAreaWidth / 2;
    this._visibleAreaY1 = this.getPosY() - visibleAreaHeight / 2;
    this._visibleAreaY2 = this.getPosY() + visibleAreaHeight / 2;
};

Player.prototype.throwBomb = function()
{
    const Bomb = require("./Bomb.js");
    this.getGame().addElement(this.getGame(), Bomb, this.getId());
};


module.exports = Player;


