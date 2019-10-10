const Server = require("../Server.js");
const Game = require("../Game.js");
global.server = new Server();
global.game = new Game(global.server);

describe("Ball", function() {
    var assert = require('assert');
    const Ball = require("../Ball.js");
    var ball = new Ball(global.game);
    
    beforeEach(function() {
        ball = new Ball(global.game);
    });
    
    describe('#getId()', function() {
        it("Debería devolver un string", function() {
            assert.equal(typeof ball.getId(), "string");
        });
    });
  
    describe('#getPosX()', function() {
        it("Debería devolver nulo", function() {
            assert.equal(ball.getPosX(), null);
        });
    });
    
    describe('#getPosY()', function() {
        it("Debería devolver nulo", function() {
            assert.equal(ball.getPosY(), null);
        });
    });
  
    describe('#getRadius()', function() {
        it("Debería devolver nulo", function() {
            assert.equal(ball.getRadius(), null);
        });
    });
  
    describe('#getColor()', function() {
        it("Debería devolver la representacion de un color en hexadecimal", function() {
            assert.equal(/^#[0-9A-F]{6}$/i.test(ball.getColor()), true);
        });
    });
  
    describe('#setPosX(posX)', function() {
        it("getPosX() debería devolver el valor posX", function() {
            var posX = 5;
            ball.setPosX(5);
            assert.equal(ball.getPosX(), posX);
        });
    });
  
    describe('#setPosY(posY)', function() {
        it("getPosY() debería devolver el valor posY", function() {
            var posY = 6;
            ball.setPosY(6);
            assert.equal(ball.getPosY(), posY);
        });
    });
  
    describe('#setRadius(radius)', function() {
        it("getRadius() debería devolver el valor radius", function() {
            var radius = 10;
            ball.setRadius(radius);
            assert.equal(ball.getRadius(), radius);
        });
    });
    
    describe('#toJSON', function() {
        it("debería devolver un string representando a la bola pero sin la propiedad _game", function() {
            var jsonBall = ball.toJSON();
            assert.equal(jsonBall.hasOwnProperty("_game"), false);
        });
    });
});


