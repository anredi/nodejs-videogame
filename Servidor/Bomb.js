/* global game, server */

const Bot = require("./Bot.js");
const util = require('util');

function Bomb(playerId, game)
{
    Bot.call(this, game);
    this._playerOwnerId = playerId;
    this._explosionRadius = game.getConfiguration().getBombRadius();
    this._accelerateTimer = null;
    this._explosionTimer = null;
    this._explosionTime = null;
    this._currentTime = null;
    this._isDestroyed = false;
}

util.inherits(Bomb, Bot);

Bomb.prototype.getPlayerOwnerId = function()
{
    return this._playerOwnerId;
};

Bomb.prototype.getExplosionRadius = function()
{
    return this._explosionRadius;
};

Bomb.prototype.getAccelerateTimer = function()
{
    return this._accelerateTimer;
};

Bomb.prototype.setAccelerateTimer = function(accelerateTimer)
{
    this._accelerateTimer = accelerateTimer;
};

Bomb.prototype.getExplosionTimer = function()
{
    return this._explosionTimer;
};

Bomb.prototype.setExplosionTimer = function(explosionTimer)
{
    this._explosionTimer = explosionTimer;
};

Bomb.prototype.getExplosionTime = function()
{
    return this._explosionTime;
};

Bomb.prototype.setExplosionTime = function(explosionTime)
{
    this._explosionTime = explosionTime;
};

Bomb.prototype.getCurrentTime = function()
{
    return this._currentTime;
};

Bomb.prototype.setCurrentTime = function(currentTime)
{
    this._currentTime = currentTime;
};

Bomb.prototype.getIsDestroyed = function()
{
    return this._isDestroyed;
};

Bomb.prototype.setIsDestroyed = function(isDestroyed)
{
    this._isDestroyed = isDestroyed;
};

Bomb.prototype.play = function()
{
    var bombPlayed = null;
    if(this.getAlive())
    {
        this.move();
        if(this.touchElements())
        {
            this.setAlive(false);
            clearInterval(this.getAccelerateTimer());
            this.explode();
        }
        bombPlayed = this;
    }else if(!this.getIsDestroyed()){
        bombPlayed = this.explode();
    }else if(this.getExplosionTime() <= 0){
        this.destroy();
    }else{
        bombPlayed = this;
    }
    return bombPlayed;
};

Bomb.prototype.explode = function()
{
    var bombPlayed = null;
    this.setAlive(false);
    if(this._explosionRadius < this.getRadius() * 3)
    {
        this.attackElements();
        this._explosionRadius = this._explosionRadius + (10 * this.getRadius())/100;
        bombPlayed = this;
    }else{
        this.setIsDestroyed(true);
    }
    return bombPlayed;
};

Bomb.prototype.endExplosionTime = function(game, bombId)
{
    var players = game.getPlayers();
    var bomb = players[bombId];
    clearInterval(bomb.getAccelerateTimer());
    clearTimeout(bomb.getExplosionTimer());
    bomb.setExplosionTime(0);
    if(!bomb.getIsDestroyed())
    {
        bomb.explode();
    }else{
        bomb.destroy();
    }
};

Bomb.prototype.destroy = function()
{   
    clearInterval(this.getAccelerateTimer());
    clearTimeout(this.getExplosionTimer());
    var playerOwnerId = this.getPlayerOwnerId();
    var players = this.getGame().getPlayers();
    if(players.hasOwnProperty(playerOwnerId))
    {
        players[playerOwnerId].setCanThrowBomb(true);
    }
    this.getGame().deletePlayer(this.getId());
    this.getGame().getServer().getWebsocketModule().sockets.emit("deletedPlayer", this.getId());
};

Bomb.prototype.updateAccelerateTime = function(game, bombId)
{
    var players = game.getPlayers();
    var bomb = players[bombId];
    bomb.accelerate();
    var currentTime = new Date().getTime();
    var timeElapsed = currentTime - bomb.getCurrentTime();
    bomb.setExplosionTime(bomb.getExplosionTime() - timeElapsed);
    bomb.setCurrentTime(currentTime);
};

Bomb.prototype.accelerate = function()
{
    var horizontalSpeedDecreased = this.getHorizontalSpeed() / 10;
    var verticalSpeedDecreased = this.getVerticalSpeed() / 10;
    this.setHorizontalSpeed(Math.trunc(this.getHorizontalSpeed() - horizontalSpeedDecreased));
    this.setVerticalSpeed(Math.trunc(this.getVerticalSpeed() - verticalSpeedDecreased));
};

Bomb.prototype.touchElements = function()
{
    var balls = this.getGame().getBalls();
    var players = this.getGame().getPlayers();
    var ballsKeys = Object.keys(balls);
    var playersKeys = Object.keys(players);
    var touched = false;
    
    var i = 0;
    while(i < ballsKeys.length && !touched)
    {      
        touched = this.touchElement(balls[ballsKeys[i]]);
        i++;
    }
    
    if(i >= ballsKeys.length)
    {
        var j = 0;
        while(j < playersKeys.length && !touched)
        {      
            var player = players[playersKeys[j]];
            touched = this.touchElement(player);
            j++;
        }
    }
    
    return touched;
};

Bomb.prototype.touchElement = function(element)
{
    var distance = require("./Utilities.js").euclideanDistance(this.getPosX(), this.getPosY(), element.getPosX(), element.getPosY());
    return this.getId() !== element.getId() && distance <= (this.getRadius() + element.getRadius());
};


Bomb.prototype.attackElement = function(element)
{
    Bot.prototype.attackElement.call(this, element);
    if(element.constructor === Bomb)
    {
        this.attackBomb(element);
    }
};

Bomb.prototype.attackBall = function(ball)
{
    var distance = require("./Utilities.js").euclideanDistance(this.getPosX(), this.getPosY(), ball.getPosX(), ball.getPosY());
    if(distance <= (this._explosionRadius + ball.getRadius()))
    {
        var ballId = ball.getId();
        delete this.getGame().getBalls()[ballId];
        this.getGame().getServer().getWebsocketModule().sockets.emit("deletedBall", ballId);
    }
};

Bomb.prototype.attackPlayer = function(player)
{
    var distance;
    var newRadius;
   
    if(player.getAlive() && player.getId() !== this.getId())
    {
        distance = require("./Utilities.js").euclideanDistance(this.getPosX(), this.getPosY(), player.getPosX(), player.getPosY());
        if(distance <= (this._explosionRadius + player.getRadius()))
        {
            newRadius = player.getRadius() * 0.9;
            if(newRadius < this.getGame().getConfiguration().getPlayerInitialRadius())
            {
                player.kill();
                var playerOwner = this.getGame().getPlayers()[this.getPlayerOwnerId()];
                if(playerOwner !== undefined && playerOwner.getId() !== player.getId())
                {
                    var bombsKilled = playerOwner.getRoundResults().getResultValue("bombsKilled");
                    playerOwner.getRoundResults().setResultValue("bombsKilled", bombsKilled + 1);
                }
            }else{
                player.setRadius(newRadius);
                var playerPoints = player.getRoundResults().getResultValue("points");
                player.getRoundResults().setResultValue("points", Math.trunc(playerPoints * 0.9));
            }
        }
    }
};

Bomb.prototype.attackBot = function(bot)
{
    var distance;
    var newRadius;
   
    if(bot.getAlive() && bot.getId() !== this.getId())
    {
        distance = require("./Utilities.js").euclideanDistance(this.getPosX(), this.getPosY(), bot.getPosX(), bot.getPosY());
        if(distance <= (this._explosionRadius + bot.getRadius()))
        {
            newRadius = bot.getRadius() * 0.9;
            if(newRadius < this.getGame().getConfiguration().getPlayerInitialRadius())
            {
                bot.kill();
                bot.resurrect();
                
                var playerOwner = this.getGame().getPlayers()[this.getPlayerOwnerId()];
                if(playerOwner !== undefined && playerOwner.getId() !== bot.getId())
                {
                    var bombsKilled = playerOwner.getRoundResults().getResultValue("bombsKilled");
                    playerOwner.getRoundResults().setResultValue("bombsKilled", bombsKilled + 1);
                }
            }else{
                bot.setRadius(newRadius);
                var botPoints = bot.getRoundResults().getResultValue("points");
                bot.getRoundResults().setResultValue("points", Math.trunc(botPoints * 0.9));
            }
        }
    }
};

Bomb.prototype.attackBomb = function(bomb)
{
    var distance;
   
    if(bomb.getAlive() && bomb.getId() !== this.getId())
    {
        distance = require("./Utilities.js").euclideanDistance(this.getPosX(), this.getPosY(), bomb.getPosX(), bomb.getPosY());
        if(distance <= (this._explosionRadius + bomb.getRadius()))
        {
            bomb.setAlive(false);
        }
    }
};

Bomb.prototype.toJSON = function()
{
    var jsonString = {};
    for(var objectProperty in this)
    {
        if(objectProperty !== "_game" && objectProperty !== "_accelerateTimer" && objectProperty !== "_explosionTimer")
        {
            jsonString[objectProperty] = this[objectProperty];
        }
    }
    return jsonString;
};


module.exports = Bomb ;



