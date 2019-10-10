function Ball(game)
{
    this._game = game;
    
    var uniqid = require('uniqid');
    this._id = uniqid();
    this._posX = null;
    this._posY = null;
    this._radius = null;  
    this._color = require("./Utilities.js").randomColor();
}

Ball.prototype.getGame = function()
{
    return this._game;
};

Ball.prototype.getId = function()
{
    return this._id;
};

Ball.prototype.getPosX = function()
{
    return this._posX;
};

Ball.prototype.setPosX = function(posX)
{
    this._posX = posX;
};

Ball.prototype.getPosY = function()
{
    return this._posY;
};

Ball.prototype.setPosY = function(posY)
{
    this._posY = posY;
};

Ball.prototype.getRadius = function()
{
    return this._radius;
};

Ball.prototype.setRadius = function(radius)
{
    this._radius = radius;
};

Ball.prototype.getColor = function()
{
    return this._color;
};

Ball.prototype.setColor = function(color)
{
    this._color = color;
};

Ball.prototype.toJSON = function()
{
    var jsonString = {};
    for(var objectProperty in this)
    {
        if(objectProperty !== "_game")
        {
            jsonString[objectProperty] = this[objectProperty];
        }
    }
    return jsonString;
};

module.exports = Ball;


