
/* global Player */

function Bomb(bombString)
{
    Player.call(this, bombString);
    
    this._explosionRadius = bombString._explosionRadius;
    this._explosionTime = bombString._explosionTime;
    this._isDestroyed = bombString._isDestroyed;
}

Bomb.prototype = Object.create(Player.prototype);
Bomb.prototype.constructor = Bomb;

Bomb.prototype.getExplosionRadius = function()
{
    return this._explosionRadius;
};

Bomb.prototype.getExplosionTime = function()
{
    return this._explosionTime;
};

Bomb.prototype.getIsDestroyed = function()
{
    return this._isDestroyed;
};


