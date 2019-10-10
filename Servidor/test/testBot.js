const Server = require("../Server.js");
const Game = require("../Game.js");
global.server = new Server();
global.game = new Game(global.server);

describe("Bot", function() {
    var assert = require('assert');
    const Utilities = require("../Utilities.js");
    const Ball = require("../Ball.js");
    const Player = require("../Player.js");
    const Bot = require("../Bot.js");
    const Bomb = require("../Bomb.js");
    const PlayerRoundResults = require("../PlayerRoundResults.js");
    
    const io = require("socket.io-client");
    var socket = io.connect("https://localhost:3000", { secure: true, reconnect: true, rejectUnauthorized : false });
    
    var player = new Bot(global.game);
    
    beforeEach(function() {
        player = new Bot(global.game);
        for(var elementId in global.game.getBalls())
        {
            delete global.game.getBalls()[elementId];
        }

        for(var elementId in global.game.getPlayers())
        {
            delete global.game.getPlayers()[elementId];
        }
    });
    
    describe('#nearestBallId()', function() {
        var player1;
        beforeEach(function() {
            player1 = new Bot(global.game);
            var player1Radius = 50;
            var player1PosX = 200;
            var player1PosY = 200;
            player1.setRadius(player1Radius);
            player1.setPosX(player1PosX);
            player1.setPosY(player1PosY);
            player1.setRoundResults(new PlayerRoundResults());
            player1.getRoundResults().setResultValue("points", 20);
            player1.getRoundResults().setResultValue("playersEaten", 5);
            player1.setAlive(true);
            
            for(var elementId in global.game.getBalls())
            {
                delete global.game.getBalls()[elementId];
            }
            
            for(var elementId in global.game.getPlayers())
            {
                delete global.game.getPlayers()[elementId];
            }
        });
        
        it("Debería devolver null si no hay ninguna bola en el tablero", function() {
            assert.equal(player1.nearestBallId(), null);
        });
        
        it("Debería devolver la única bola que hay si solo hay una bola", function() {
            var ball = global.game.addBall();
            assert.equal(player1.nearestBallId(), ball.getId());
        });
        
        it("Debería devolver la bola más cercana si hay más de una bola", function() {
            var radius = 10;
            var ball1 = new Ball(global.game);
            ball1.setRadius(radius);
            ball1.setPosX(210);
            ball1.setPosY(200);
            
            var ball2 = new Ball(global.game);
            ball2.setRadius(radius);
            ball2.setPosX(220);
            ball2.setPosY(200);
            global.game.getBalls()[ball1.getId()] = ball1;
            global.game.getBalls()[ball2.getId()] = ball2;
            assert.equal(player1.nearestBallId(), ball1.getId());
            
            var ball3 = new Ball(global.game);
            ball3.setRadius(radius);
            ball3.setPosX(201);
            ball3.setPosY(200);
            global.game.getBalls()[ball3.getId()] = ball3;
            assert.equal(player1.nearestBallId(), ball3.getId());
        });
    });
    
    describe('#nearestPlayerId()', function() {
        var player1;
        beforeEach(function() {
            player1 = new Bot(global.game);
            var player1Radius = 50;
            var player1PosX = 200;
            var player1PosY = 200;
            player1.setRadius(player1Radius);
            player1.setPosX(player1PosX);
            player1.setPosY(player1PosY);
            player1.setRoundResults(new PlayerRoundResults());
            player1.getRoundResults().setResultValue("points", 20);
            player1.getRoundResults().setResultValue("playersEaten", 5);
            player1.setAlive(true);
            for(var elementId in global.game.getBalls())
            {
                delete global.game.getBalls()[elementId];
            }
            
            for(var elementId in global.game.getPlayers())
            {
                delete global.game.getPlayers()[elementId];
            }
        });
        
        it("Debería devolver null si no hay ningun jugador en el tablero", function() {
            assert.equal(player1.nearestPlayerId(), null);
        });
        
        it("Debería devolver el único jugador que hay si solo hay un jugador", function() {
            var player2 = new Bot(global.game);
            var player2PosX = 300;
            var player2PosY = 300;
            player2.setPosX(player2PosX);
            player2.setPosY(player2PosY);
            player2.setAlive(true);
            global.game.getPlayers()[player2.getId()] = player2;
            assert.equal(player1.nearestPlayerId(), player2.getId());
        });
        
        it("Debería devolver el jugador más cercano si hay más de un jugador", function() {
            var player2 = new Bot(global.game);
            var player2PosX = 300;
            var player2PosY = 300;
            player2.setPosX(player2PosX);
            player2.setPosY(player2PosY);
            player2.setAlive(true);
            global.game.getPlayers()[player2.getId()] = player2;
            
            var player3 = new Player(global.game);
            var player3PosX = 250;
            var player3PosY = 200;
            player3.setPosX(player3PosX);
            player3.setPosY(player3PosY);
            player3.setAlive(true);
            global.game.getPlayers()[player3.getId()] = player3;
            
            assert.equal(player1.nearestPlayerId(), player3.getId());
            
            var player4 = new Player(global.game);
            var player4PosX = 201;
            var player4PosY = 200;
            player4.setPosX(player4PosX);
            player4.setPosY(player4PosY);
            player4.setAlive(true);
            global.game.getPlayers()[player4.getId()] = player4;
            
            assert.equal(player1.nearestPlayerId(), player4.getId());
            
        });
        
        it("Debería devolver el jugador más cercano si hay más de un jugador y ese jugador no está muerto", function() {
            var player2 = new Player(global.game);
            var player2PosX = 300;
            var player2PosY = 300;
            player2.setPosX(player2PosX);
            player2.setPosY(player2PosY);
            player2.setAlive(true);
            global.game.getPlayers()[player2.getId()] = player2;
            
            var player3 = new Player(global.game);
            var player3PosX = 250;
            var player3PosY = 200;
            player3.setPosX(player3PosX);
            player3.setPosY(player3PosY);
            player3.setAlive(true);
            global.game.getPlayers()[player3.getId()] = player3;
            
            assert.equal(player1.nearestPlayerId(), player3.getId());
            
            var player4 = new Player(global.game);
            var player4PosX = 201;
            var player4PosY = 200;
            player4.setPosX(player4PosX);
            player4.setPosY(player4PosY);
            player4.setAlive(false);
            global.game.getPlayers()[player4.getId()] = player4;
            
            assert.equal(player1.nearestPlayerId(), player3.getId());
            
        });
        
        it("Debería devolver nulo si todos los jugadores están muertos", function() {
            var player2 = new Player(global.game);
            var player2PosX = 300;
            var player2PosY = 300;
            player2.setPosX(player2PosX);
            player2.setPosY(player2PosY);
            player2.setAlive(false);
            global.game.getPlayers()[player2.getId()] = player2;
            
            var player3 = new Player(global.game);
            var player3PosX = 250;
            var player3PosY = 200;
            player3.setPosX(player3PosX);
            player3.setPosY(player3PosY);
            player3.setAlive(false);
            global.game.getPlayers()[player3.getId()] = player3;
            
            var player4 = new Player(global.game);
            var player4PosX = 201;
            var player4PosY = 200;
            player4.setPosX(player4PosX);
            player4.setPosY(player4PosY);
            player4.setAlive(false);
            global.game.getPlayers()[player4.getId()] = player4;
            
            assert.equal(player1.nearestPlayerId(), null);
            
        });
    });
    
    describe('#accelerate()', function() {
        var player1, player2, player3, player4;
        beforeEach(function() {
            for(var elementId in global.game.getBalls())
            {
                delete global.game.getBalls()[elementId];
            }
            
            for(var elementId in global.game.getPlayers())
            {
                delete global.game.getPlayers()[elementId];
            }
            
            player1 = new Bot(global.game);
            var player1Radius = 50;
            var player1PosX = 200;
            var player1PosY = 200;
            player1.setRadius(player1Radius);
            player1.setPosX(player1PosX);
            player1.setPosY(player1PosY);
            player1.setRoundResults(new PlayerRoundResults());
            player1.getRoundResults().setResultValue("points", 20);
            player1.getRoundResults().setResultValue("playersEaten", 5);
            player1.setAlive(true);
            
            player2 = new Player(global.game);
            var player2PosX = 300;
            var player2PosY = 300;
            player2.setRadius(player1Radius);
            player2.setPosX(player2PosX);
            player2.setPosY(player2PosY);
            player2.setAlive(false);
            global.game.getPlayers()[player2.getId()] = player2;
            
            player3 = new Player(global.game);
            var player3PosX = 250;
            var player3PosY = 200;
            player3.setRadius(20);
            player3.setPosX(player3PosX);
            player3.setPosY(player3PosY);
            player3.setAlive(false);
            global.game.getPlayers()[player3.getId()] = player3;
            
            player4 = new Player(global.game);
            var player4PosX = 201;
            var player4PosY = 200;
            player4.setRadius(player1Radius);
            player4.setPosX(player4PosX);
            player4.setPosY(player4PosY);
            player4.setAlive(false);
            global.game.getPlayers()[player4.getId()] = player4;
        });
        
        it("debería poner su velocidad a cero si no hay ningún jugador aparte de él mismo", function(){
            delete global.game.getPlayers()[player2.getId()];
            delete global.game.getPlayers()[player3.getId()];
            delete global.game.getPlayers()[player4.getId()];
            
            player1.setNearestBallId(player1.nearestBallId());
            player1.setNearestPlayerId(player1.nearestPlayerId());
            player1.accelerate();
            assert.equal(player1.getHorizontalSpeed(), 0);
            assert.equal(player1.getVerticalSpeed(), 0);
        });
        
        it("debería poner su velocidad a cero si los unicos jugadores que hay, estan muertos y no hay bolas",function(){   
            player1.setNearestBallId(player1.nearestBallId());
            player1.setNearestPlayerId(player1.nearestPlayerId());
            player1.accelerate();
            
            assert.equal(player1.getHorizontalSpeed(), 0);
            assert.equal(player1.getVerticalSpeed(), 0);
        });
        
        it("si hay una unica bola y los jugadores que hay están muertos, cambia su velocidad para acercarse a la bola", function(){
            var ball = new Ball(global.game);
            ball.setRadius(20);
            ball.setPosX(250);
            ball.setPosY(200);
            global.game.getBalls()[ball.getId()] = ball;
            
            player1.setNearestBallId(player1.nearestBallId());
            player1.setNearestPlayerId(player1.nearestPlayerId());
            player1.accelerate();
            
            assert.equal(player1.getHorizontalSpeed() !== 0, true);
            assert.equal(player1.getVerticalSpeed(), 0);
        });
        
        it("debería cambiar su velocidad para acercarse al jugador más cercano si éste tiene menor radio y no es una bomba", function(){
            var ball = new Ball(global.game);
            ball.setRadius(20);
            ball.setPosX(250);
            ball.setPosY(200);
            global.game.getBalls()[ball.getId()] = ball;
            
            player1.setRadius(80);
            player2.setAlive(true);
            player2.setRadius(20);
            player2.setPosX(180);
            player2.setPosY(200);
            
            player1.setNearestBallId(player1.nearestBallId());
            player1.setNearestPlayerId(player1.nearestPlayerId());
            player1.accelerate();
            
            assert.equal(player1.getHorizontalSpeed() < 0, true);
            assert.equal(player1.getVerticalSpeed(), 0);
        });
        
        it("debería cambiar su velocidad para alejarse del jugador más cercano si éste tiene menor radio y es una bomba", function(){
            var ball = new Ball(global.game);
            ball.setRadius(20);
            ball.setPosX(250);
            ball.setPosY(200);
            global.game.getBalls()[ball.getId()] = ball;
            
            player1.setRadius(80);
            player2 = new Bomb(null, global.game);
            player2.setRadius(20);
            player2.setPosX(180);
            player2.setPosY(200);
            
            player1.setNearestBallId(player1.nearestBallId());
            player1.setNearestPlayerId(player1.nearestPlayerId());
            player1.accelerate();
            
            assert.equal(player1.getHorizontalSpeed() > 0, true);
            assert.equal(player1.getVerticalSpeed(), 0);
        });
        
        it("debería cambiar su velocidad para acercarse al jugador más cercano si éste tiene mayor radio y el atacante puede lanzar bombas", function(){
            var ball = new Ball(global.game);
            ball.setRadius(20);
            ball.setPosX(250);
            ball.setPosY(200);
            global.game.getBalls()[ball.getId()] = ball;
            
            player1.setRadius(50);
            player1.setCanThrowBomb(true);
            player2.setAlive(true);
            player2.setRadius(80);
            player2.setPosX(180);
            player2.setPosY(200);
            
            player1.setNearestBallId(player1.nearestBallId());
            player1.setNearestPlayerId(player1.nearestPlayerId());
            player1.accelerate();
            
            assert.equal(player1.getHorizontalSpeed() < 0, true);
            assert.equal(player1.getVerticalSpeed(), 0);
        });
        
        it("debería cambiar su velocidad para alejarse del jugador más cercano si éste tiene mayor radio y el atacante no puede lanzar bombas", function(){
            var ball = new Ball(global.game);
            ball.setRadius(20);
            ball.setPosX(250);
            ball.setPosY(200);
            global.game.getBalls()[ball.getId()] = ball;
            
            player1.setRadius(50);
            player1.setCanThrowBomb(false);
            player2.setAlive(true);
            player2.setRadius(80);
            player2.setPosX(180);
            player2.setPosY(200);
            
            player1.setNearestBallId(player1.nearestBallId());
            player1.setNearestPlayerId(player1.nearestPlayerId());
            player1.accelerate();
            
            assert.equal(player1.getHorizontalSpeed() > 0, true);
            assert.equal(player1.getVerticalSpeed(), 0);
        });
    });
    
    describe('#throwBomb()', function() {
        var player1, player2, player3, player4;
        beforeEach(function() {
            for(var elementId in global.game.getBalls())
            {
                delete global.game.getBalls()[elementId];
            }
            
            for(var elementId in global.game.getPlayers())
            {
                delete global.game.getPlayers()[elementId];
            }
            
            player1 = new Bot(global.game);
            var player1Radius = 50;
            var player1PosX = 200;
            var player1PosY = 200;
            player1.setRadius(player1Radius);
            player1.setPosX(player1PosX);
            player1.setPosY(player1PosY);
            player1.setRoundResults(new PlayerRoundResults());
            player1.getRoundResults().setResultValue("points", 20);
            player1.getRoundResults().setResultValue("playersEaten", 5);
            player1.setAlive(true);
            global.game.getPlayers()[player1.getId()] = player1;
            
            player2 = new Player(global.game);
            var player2PosX = 300;
            var player2PosY = 300;
            player2.setRadius(player1Radius);
            player2.setPosX(player2PosX);
            player2.setPosY(player2PosY);
            player2.setAlive(false);
            global.game.getPlayers()[player2.getId()] = player2;
            
            player3 = new Player(global.game);
            var player3PosX = 250;
            var player3PosY = 200;
            player3.setRadius(20);
            player3.setPosX(player3PosX);
            player3.setPosY(player3PosY);
            player3.setAlive(false);
            global.game.getPlayers()[player3.getId()] = player3;
            
            player4 = new Player(global.game);
            var player4PosX = 201;
            var player4PosY = 200;
            player4.setRadius(player1Radius);
            player4.setPosX(player4PosX);
            player4.setPosY(player4PosY);
            player4.setAlive(false);
            global.game.getPlayers()[player4.getId()] = player4;
        });
        
        it("debería no lanzar ninguna bomba si no hay ningun jugador o estan muertos", function(){
            player1.setNearestBallId(player1.nearestBallId());
            player1.setNearestPlayerId(player1.nearestPlayerId());
            player1.throwBomb();
            var bombThrown = false;
            for(var playerId in global.game.getPlayers())
            {
                var player = global.game.getPlayers()[playerId];
                if(player.constructor === Bomb && player.getPlayerOwnerId() === player1.getId())
                {
                    bombThrown = true;
                }
            }
            
            assert.equal(bombThrown, false);
        });
        
        it("debería no lanzar ninguna bomba si el jugador más cercano está muy lejos", function(){
            player1.setPosX(100);
            player1.setPosY(100);
            
            player2.setAlive(true);
            player2.setPosX(600);
            player2.setPosY(100);
            
            player1.setNearestBallId(player1.nearestBallId());
            player1.setNearestPlayerId(player1.nearestPlayerId());
            player1.throwBomb();
            var bombThrown = false;
            for(var playerId in global.game.getPlayers())
            {
                var player = global.game.getPlayers()[playerId];
                if(player.constructor === Bomb && player.getPlayerOwnerId() === player1.getId())
                {
                    bombThrown = true;
                }
            }
            
            assert.equal(bombThrown, false);
        });
        
        it("debería lanzar una bomba si el jugador más cercano está cerca y tiene mayor radio", function(){
            player1.setPosX(100);
            player1.setPosY(100);
            player1.setRadius(50);
            player1.setAlive(true);
            player1.setCanThrowBomb(true);
            
            player2.setAlive(true);
            player2.setPosX(100);
            player2.setPosY(100);
            player2.setRadius(70);
            
            player1.setNearestBallId(player1.nearestBallId());
            player1.setNearestPlayerId(player1.nearestPlayerId());
            player1.throwBomb();
            var bombThrown = false;
            for(var playerId in global.game.getPlayers())
            {
                var player = global.game.getPlayers()[playerId];
                if(player.constructor === Bomb && player.getPlayerOwnerId() === player1.getId())
                {
                    bombThrown = true;
                }
            }
            
            assert.equal(bombThrown, true);
        });
    });
});

