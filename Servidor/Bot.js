
/* global game */

const Player = require("./Player.js");
const util = require('util');
const Utilities = require("./Utilities.js");

function Bot(game)
{
    Player.call(this, game);
    this._nearestBallId = null;
    this._nearestPlayerId = null;
}


util.inherits(Bot, Player);

Bot.prototype.getNearestBallId = function()
{
    return this._nearestBallId;
};

Bot.prototype.setNearestBallId = function(nearestBallId)
{
    this._nearestBallId = nearestBallId;
};

Bot.prototype.getNearestPlayerId = function()
{
    return this._nearestPlayerId;
};

Bot.prototype.setNearestPlayerId = function(nearestPlayerId)
{
    this._nearestPlayerId = nearestPlayerId;
};

Bot.prototype.play = function()
{
    if(this.getAlive())
    {
        this.setNearestBallId(this.nearestBallId());
        this.setNearestPlayerId(this.nearestPlayerId());
        this.throwBomb();
        this.accelerate();
        this.move();
        this.attackElements();
    }
    return this;
};


Bot.prototype.nearestBallId = function()
{
    var balls = this.getGame().getBalls();
    
    var nearestBall = null;
    var minDistance = Utilities.euclideanDistance(0,0, this.getGame().getConfiguration().getBoardWidth(), this.getGame().getConfiguration().getBoardHeight());
    for(var ballId in balls)
    {
        if (balls.hasOwnProperty(ballId))
        {
            var ball = balls[ballId];
            var distanceToBall = Utilities.euclideanDistance(this.getPosX(), this.getPosY(), ball.getPosX(), ball.getPosY());
            if(distanceToBall < minDistance)
            {
                minDistance = distanceToBall;
                nearestBall = ball.getId();
            }
        }
    }
    return nearestBall;
};

Bot.prototype.nearestPlayerId = function()
{
    var players = this.getGame().getPlayers();
    
    var nearestPlayer = null;
    var minDistance = Utilities.euclideanDistance(0,0, this.getGame().getConfiguration().getBoardWidth(), this.getGame().getConfiguration().getBoardHeight());
    for(var playerId in players)
    {
        if (players.hasOwnProperty(playerId))
        {
            var player = players[playerId];
            if(this.getId() !== player.getId() && player.getAlive())
            {
                var distanceToPlayer = Utilities.euclideanDistance(this.getPosX(), this.getPosY(), player.getPosX(), player.getPosY());
                if(distanceToPlayer < minDistance)
                {
                    minDistance = distanceToPlayer;
                    nearestPlayer = player.getId();
                }
            }
        }
    }
    return nearestPlayer;
};

Bot.prototype.accelerate = function()
{
    const Bomb = require("./Bomb.js");
    
    var nearestBallId = this.getNearestBallId();
    var nearestPlayerId = this.getNearestPlayerId();
    var nearestBall = null;
    var nearestPlayer = null;
    if(nearestBallId !== null)
    {
        nearestBall = this.getGame().getBalls()[nearestBallId];
    }
    if(nearestPlayerId !== null)
    {
        nearestPlayer = this.getGame().getPlayers()[nearestPlayerId];
    }

    var nearestBallDistance, nearestPlayerDistance, horizontalDistance, verticalDistance, newHorizontalSpeed, newVerticalSpeed;
    if(nearestBall !== null)
    {
        nearestBallDistance = Utilities.euclideanDistance(this.getPosX(),this.getPosY(), nearestBall.getPosX(), nearestBall.getPosY());
    }
    if(nearestPlayer !== null)
    {
        nearestPlayerDistance = Utilities.euclideanDistance(this.getPosX(),this.getPosY(), nearestPlayer.getPosX(), nearestPlayer.getPosY());
    }

    if(nearestPlayer !== null && nearestPlayer.getRadius() >= this.getRadius() && nearestBall !== null && nearestBallDistance >= nearestPlayerDistance)
    {
        horizontalDistance = nearestPlayer.getPosX() - this.getPosX();
        verticalDistance = nearestPlayer.getPosY() - this.getPosY();
        if(this.getCanThrowBomb())
        {
            newHorizontalSpeed = horizontalDistance / 30;
            newVerticalSpeed = verticalDistance / 30;
        }else{
            newHorizontalSpeed = - horizontalDistance / 30;
            newVerticalSpeed = - verticalDistance / 30;
        }
    }else if(nearestPlayer !== null && nearestPlayer.getRadius() >= this.getRadius() && nearestBall !== null && nearestBallDistance < nearestPlayerDistance){
        horizontalDistance = nearestBall.getPosX() - this.getPosX();
        verticalDistance = nearestBall.getPosY() - this.getPosY();
        newHorizontalSpeed = horizontalDistance / 30;
        newVerticalSpeed = verticalDistance / 30;
    }else if(nearestPlayer !== null && nearestPlayer.getRadius() < this.getRadius() && nearestBall !== null && nearestPlayerDistance <= nearestBallDistance){
        horizontalDistance = nearestPlayer.getPosX() - this.getPosX();
        verticalDistance = nearestPlayer.getPosY() - this.getPosY();
        if(nearestPlayer.constructor === Bomb)
        {
            newHorizontalSpeed = - horizontalDistance / 30;
            newVerticalSpeed = - verticalDistance / 30;
        }else{
            newHorizontalSpeed = horizontalDistance / 30;
            newVerticalSpeed = verticalDistance / 30;
        }
    }else if(nearestPlayer !== null && nearestPlayer.getRadius() < this.getRadius() && nearestBall !== null && nearestPlayerDistance > nearestBallDistance){
        horizontalDistance = nearestBall.getPosX() - this.getPosX();
        verticalDistance = nearestBall.getPosY() - this.getPosY();
        newHorizontalSpeed = horizontalDistance / 30;
        newVerticalSpeed = verticalDistance / 30;
    }else if(nearestBall === null && nearestPlayer !== null){
        horizontalDistance = nearestPlayer.getPosX() - this.getPosX();
        verticalDistance = nearestPlayer.getPosY() - this.getPosY();
        newHorizontalSpeed = horizontalDistance / 30;
        newVerticalSpeed = verticalDistance / 30;
    }else if(nearestBall !== null && nearestPlayer === null){
        horizontalDistance = nearestBall.getPosX() - this.getPosX();
        verticalDistance = nearestBall.getPosY() - this.getPosY();
        newHorizontalSpeed = horizontalDistance / 30;
        newVerticalSpeed = verticalDistance / 30;
    }else if(nearestBall === null && nearestPlayer === null){
        newHorizontalSpeed = 0;
        newVerticalSpeed = 0;
    }
    Player.prototype.accelerate.call(this,newHorizontalSpeed, newVerticalSpeed);
};

Bot.prototype.throwBomb = function()
{
    const Bomb = require("./Bomb.js");
    
    var nearestPlayerId = this.getNearestPlayerId();
    var nearestPlayer = null;
    var distanceToNearestPlayer;
    if(nearestPlayerId !== null)
    {
        nearestPlayer = this.getGame().getPlayers()[nearestPlayerId];
        distanceToNearestPlayer = Utilities.euclideanDistance(this.getPosX(), this.getPosY(), nearestPlayer.getPosX(), nearestPlayer.getPosY());
    }
    if(nearestPlayer !== null && nearestPlayer.getRadius() >= this.getRadius() && distanceToNearestPlayer < nearestPlayer.getRadius() + 10 * this.getGame().getConfiguration().getBombRadius())
    {
        this.getGame().addElement(this.getGame(), Bomb, this.getId());
    }
};

module.exports = Bot;
