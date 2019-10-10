const Server = require("../Server.js");
const Game = require("../Game.js");
global.server = new Server();
global.game = new Game(global.server);

describe("Bomb", function() {
    var assert = require('assert');
    const Utilities = require("../Utilities.js");
    const Ball = require("../Ball.js");
    const Player = require("../Player.js");
    const Bot = require("../Bot.js");
    const Bomb = require("../Bomb.js");
    const PlayerRoundResults = require("../PlayerRoundResults.js");
    
    const io = require("socket.io-client");
    var socket = io.connect("https://localhost:3000", { secure: true, reconnect: true, rejectUnauthorized : false });
    
    describe("#attackBall(ball)", function(){
        var player1, bomb1, ball1;
        beforeEach(function() {
            for(var elementId in global.game.getBalls())
            {
                delete global.game.getBalls()[elementId];
            }
            
            for(var elementId in global.game.getPlayers())
            {
                delete global.game.getPlayers()[elementId];
            }
                
            player1 = new Player(global.game);
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
            
            bomb1 = new Bomb(player1.getId(), global.game);
            global.game.getPlayers()[bomb1.getId()] = bomb1;
            
            ball1 = new Ball(global.game);
            global.game.getBalls()[ball1.getId()] = ball1;
        });
        
        it("debería no atacar a la bola si ésta se encuentra demasiado lejos", function(){
            bomb1.setPosX(200);
            bomb1.setPosY(200);
            
            ball1.setPosX(1000);
            ball1.setPosY(1000);
            
            bomb1.attackBall(ball1);
            assert.equal(global.game.getBalls().hasOwnProperty(ball1.getId()), true);
        });
        
        it("debería atacar a la bola si ésta se encuentra dentro del radio de explosion", function(){
            bomb1.setPosX(200);
            bomb1.setPosY(200);
            bomb1._explosionRadius = 60;
            
            ball1.setPosX(250);
            ball1.setPosY(200);
            
            bomb1.attackBall(ball1);
            assert.equal(global.game.getBalls().hasOwnProperty(ball1.getId()), false);
        });
    });
    
    describe("#attackPlayer(player)", function(){
        var player1, player2, bomb1;
        beforeEach(function() {
            for(var elementId in global.game.getBalls())
            {
                delete global.game.getBalls()[elementId];
            }
            
            for(var elementId in global.game.getPlayers())
            {
                delete global.game.getPlayers()[elementId];
            }
                
            player1 = new Player(global.game);
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
            var player1Radius = 50;
            var player1PosX = 200;
            var player1PosY = 200;
            player2.setRadius(player1Radius);
            player2.setPosX(player1PosX);
            player2.setPosY(player1PosY);
            player2.setRoundResults(new PlayerRoundResults());
            player2.getRoundResults().setResultValue("points", 20);
            player2.getRoundResults().setResultValue("playersEaten", 5);
            player2.setAlive(true);
            global.game.getPlayers()[player2.getId()] = player2;
            
            bomb1 = new Bomb(player1.getId(), global.game);
            global.game.getPlayers()[bomb1.getId()] = bomb1;
        });
        
        it("debería no atacar al jugador si éste se encuentra demasiado lejos", function(){
            bomb1.setPosX(200);
            bomb1.setPosY(200);
            
            player2.setPosX(1000);
            player2.setPosY(1000);
            
            bomb1.attackPlayer(player2);
            assert.equal(player2.getAlive(), true);
        });
        
        it("debería atacar al jugador si éste se encuentra dentro del radio de explosion", function(){
            bomb1.setPosX(200);
            bomb1.setPosY(200);
            bomb1._explosionRadius = 60;
            
            player2.setPosX(250);
            player2.setPosY(200);
            
            bomb1.attackPlayer(player2);
            assert.equal(player2.getAlive(), false);
        });
        
        it("debería no atacar al jugador si éste está muerto", function(){
            bomb1.setPosX(200);
            bomb1.setPosY(200);
            bomb1._explosionRadius = 60;
            
            player2.setPosX(250);
            player2.setPosY(200);
            player2.setRadius(1000);
            player2.setAlive(false);
            
            var radiusBefore = player2.getRadius();
            bomb1.attackPlayer(player2);
            var radiusLater = player2.getRadius();
            assert.equal(radiusBefore, radiusLater);
        });
        
        it("al atacar a un jugador, éste debería disminuir su radio", function(){
            bomb1.setPosX(200);
            bomb1.setPosY(200);
            bomb1._explosionRadius = 60;
            
            player2.setPosX(250);
            player2.setPosY(200);
            player2.setRadius(1000);
            player2.setAlive(true);
            
            var radiusBefore = player2.getRadius();
            bomb1.attackPlayer(player2);
            var radiusLater = player2.getRadius();
            assert.equal(radiusBefore > radiusLater, true);
        });
        
        it("al atacar a un jugador, si se disminuye su radio en más del límite, se muere", function(){
            bomb1.setPosX(200);
            bomb1.setPosY(200);
            bomb1._explosionRadius = 60;
            
            player2.setPosX(250);
            player2.setPosY(200);
            player2.setRadius(global.game.getConfiguration().getPlayerInitialRadius());
            player2.setAlive(true);
            
            bomb1.attackPlayer(player2);
            assert.equal(player2.getAlive(), false);
        });
        
        it("al atacar a un jugador, si se disminuye su radio en más del límite, se muere y aumenta la puntuacion en numero de muertes por bomba en el atacante", function(){
            bomb1.setPosX(200);
            bomb1.setPosY(200);
            bomb1._explosionRadius = 60;
            
            player2.setPosX(250);
            player2.setPosY(200);
            player2.setRadius(global.game.getConfiguration().getPlayerInitialRadius());
            player2.setAlive(true);
            
            var playerOwnerId = bomb1.getPlayerOwnerId();
            var playerOwner = global.game.getPlayers()[playerOwnerId];
            
            var playerOwnerDeathsBefore = playerOwner.getRoundResults().getResultValue("bombsKilled");
            bomb1.attackPlayer(player2);
            var playerOwnerDeathsLater = playerOwner.getRoundResults().getResultValue("bombsKilled");
            assert.equal(playerOwnerDeathsLater - playerOwnerDeathsBefore, 1);
        });
        
        it("al atacar a un jugador, si se disminuye su radio en más del límite, se muere pero no aumenta la puntuacion en numero de muertes por bomba en el atacante si la lanzó él mismo", function(){
            bomb1.setPosX(200);
            bomb1.setPosY(200);
            bomb1._explosionRadius = 60;
            
            player1.setPosX(250);
            player1.setPosY(200);
            player1.setRadius(global.game.getConfiguration().getPlayerInitialRadius());
            player1.setAlive(true);
            
            var playerOwnerId = bomb1.getPlayerOwnerId();
            var playerOwner = global.game.getPlayers()[playerOwnerId];
            
            var playerOwnerDeathsBefore = playerOwner.getRoundResults().getResultValue("bombsKilled");
            bomb1.attackPlayer(player1);
            var playerOwnerDeathsLater = playerOwner.getRoundResults().getResultValue("bombsKilled");
            assert.equal(playerOwnerDeathsLater, playerOwnerDeathsBefore);
        });
    });
    
    describe("#attackBomb(bomb)", function(){
        var player1, bomb1, bomb2;
        beforeEach(function() {
            for(var elementId in global.game.getBalls())
            {
                delete global.game.getBalls()[elementId];
            }
            
            for(var elementId in global.game.getPlayers())
            {
                delete global.game.getPlayers()[elementId];
            }
                
            player1 = new Player(global.game);
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
            
            bomb1 = new Bomb(player1.getId(), global.game);
            bomb1.setAlive(true);
            global.game.getPlayers()[bomb1.getId()] = bomb1;
            
            bomb2 = new Bomb(player1.getId(), global.game);
            bomb2.setAlive(true);
            global.game.getBalls()[bomb2.getId()] = bomb2;
        });
        
        it("debería no atacar a la otra bomba si ésta se encuentra demasiado lejos", function(){
            bomb1.setPosX(200);
            bomb1.setPosY(200);
            
            bomb2.setPosX(1000);
            bomb2.setPosY(1000);
            
            bomb1.attackBomb(bomb2);
            assert.equal(bomb2.getAlive(), true);
        });
        
        it("debería atacar a la otra bomba si ésta se encuentra dentro del radio de explosion", function(){
            bomb1.setPosX(200);
            bomb1.setPosY(200);
            bomb1._explosionRadius = 60;
            
            bomb2.setPosX(250);
            bomb2.setPosY(200);
            
            bomb1.attackBomb(bomb2);
            assert.equal(bomb2.getAlive(), false);
        });
    });
    
    describe("#touchElements()", function(){
        var player1, player2, ball1, ball2, bomb1, bomb2;
        beforeEach(function() {
            for(var elementId in global.game.getBalls())
            {
                delete global.game.getBalls()[elementId];
            }
            
            for(var elementId in global.game.getPlayers())
            {
                delete global.game.getPlayers()[elementId];
            }
                
            player1 = new Player(global.game);
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
            var player2Radius = 50;
            var player2PosX = 200;
            var player2PosY = 200;
            player2.setRadius(player2Radius);
            player2.setPosX(player2PosX);
            player2.setPosY(player2PosY);
            player2.setRoundResults(new PlayerRoundResults());
            player2.getRoundResults().setResultValue("points", 20);
            player2.getRoundResults().setResultValue("playersEaten", 5);
            player2.setAlive(true);
            global.game.getPlayers()[player2.getId()] = player2;
            
            ball1 = new Ball(global.game);
            ball1.setRadius(20);
            global.game.getBalls()[ball1.getId()] = ball1;
            
            ball2 = new Ball(global.game);
            ball2.setRadius(20);
            global.game.getBalls()[ball2.getId()] = ball2;
            
            bomb1 = new Bomb(player1.getId(), global.game);
            bomb1.setAlive(true);
            global.game.getPlayers()[bomb1.getId()] = bomb1;
            
            bomb2 = new Bomb(player1.getId(), global.game);
            bomb2.setAlive(true);
            global.game.getBalls()[bomb2.getId()] = bomb2;
        });
        
        it("debería devolver false si no toca a ningun elemento del juego", function(){
            bomb1.setPosX(100);
            bomb1.setPosY(100);
            
            player1.setPosX(1000);
            player1.setPosY(1000);
            
            player2.setPosX(1000);
            player2.setPosY(1000);
            
            ball1.setPosX(1000);
            ball1.setPosY(1000);
            
            ball2.setPosX(1000);
            ball2.setPosY(1000);
            
            bomb2.setPosX(1000);
            bomb2.setPosY(1000);
            
            assert.equal(bomb1.touchElements(), false);
        });
        
        it("debería devolver true si toca a algun elemento del juego", function(){
            bomb1.setPosX(100);
            bomb1.setPosY(100);
            
            player1.setPosX(100);
            player1.setPosY(100);
            
            player2.setPosX(1000);
            player2.setPosY(1000);
            
            ball1.setPosX(1000);
            ball1.setPosY(1000);
            
            ball2.setPosX(1000);
            ball2.setPosY(1000);
            
            bomb2.setPosX(1000);
            bomb2.setPosY(1000);
            
            assert.equal(bomb1.touchElements(), true);
            
            player1.setPosX(1000);
            player1.setPosY(1000);
            
            player2.setPosX(100);
            player2.setPosY(100);
            
            assert.equal(bomb1.touchElements(), true);
            
            player2.setPosX(1000);
            player2.setPosY(1000);
            
            ball1.setPosX(100);
            ball1.setPosY(100);
            
            assert.equal(bomb1.touchElements(), true);
            
            ball1.setPosX(1000);
            ball1.setPosY(1000);
            
            ball2.setPosX(100);
            ball2.setPosY(100);
            
            assert.equal(bomb1.touchElements(), true);
            
            ball2.setPosX(1000);
            ball2.setPosY(1000);
            
            bomb2.setPosX(100);
            bomb2.setPosY(100);
            
            assert.equal(bomb1.touchElements(), true);
        });
    });
    
    describe("#accelerate()", function(){
        var player1, bomb1;
        beforeEach(function(){
            player1 = new Player(global.game);
            bomb1 = new Bomb(player1.getId(), global.game);
        });
        
        it("debería disminuir su velocidad", function(){
            var horizontalSpeedBefore = 20;
            var verticalSpeedBefore = 40;
            bomb1.setHorizontalSpeed(horizontalSpeedBefore);
            bomb1.setVerticalSpeed(verticalSpeedBefore);
            
            bomb1.accelerate();
            
            assert.equal(horizontalSpeedBefore >= bomb1.getHorizontalSpeed(), true);
            assert.equal(verticalSpeedBefore >= bomb1.getVerticalSpeed(), true);
        });
    });
    
    describe("#updateAccelerateTime(global.game, bombId)", function(){
        var bomb1, player1;
        beforeEach(function(){
            player1 = new Player(global.game);
            bomb1 = new Bomb(player1.getId(), global.game);
            bomb1.setCurrentTime(2000);
            bomb1.setExplosionTime(2000);
            global.game.getPlayers()[bomb1.getId()] = bomb1;
        });
        
        it("debería disminuir el tiempo que queda para que la bomba explote", function(){
            var explosionTimeBefore = bomb1.getExplosionTime();
            bomb1.updateAccelerateTime(global.game, bomb1.getId());
            var explosionTimeLater = bomb1.getExplosionTime();
            assert.equal(explosionTimeLater <= explosionTimeBefore, true);
        });
    });
    
    describe("#destroy()", function(){
        var bomb1, player1;
        beforeEach(function(){
            player1 = new Player(global.game);
            bomb1 = new Bomb(player1.getId(), global.game);
            global.game.getPlayers()[bomb1.getId()] = bomb1;
            global.game.getPlayers()[player1.getId()] = player1;
            player1.setCanThrowBomb(false);
        });
        
        it("debería eliminar la bomba del juego", function(){
            bomb1.destroy();
            assert.equal(global.game.getPlayers().hasOwnProperty(bomb1.getId()), false);
        });
        
        it("debería cambiar el estado del propietario de la bomba, para que pueda lanzar más bombas", function(){
            bomb1.destroy();
            assert.equal(player1.getCanThrowBomb(), true);
        });
        
        it("debería lanzar un evento indicando que la bomba ha sido eliminada", function(done){
            bomb1.destroy();
            socket.on("deletedPlayer", function(bombId){
                if(bomb1.getId() === bombId)
                {
                    done();
                }
            });
        });
    });
    
    describe("#explode()", function(){
        var bomb1, player1, player2, player3;
        beforeEach(function(){
            for(var elementId in global.game.getBalls())
            {
                delete global.game.getBalls()[elementId];
            }
            
            for(var elementId in global.game.getPlayers())
            {
                delete global.game.getPlayers()[elementId];
            }
            
            player1 = new Player(global.game);
            player1.setPosX(100);
            player1.setPosY(100);
            player1.setRadius(50);
            player1.setAlive(true);
            player1.setRoundResults(new PlayerRoundResults());
            player1.getRoundResults().setResultValue("points", 20);
            player1.getRoundResults().setResultValue("playersEaten", 5);
            global.game.getPlayers()[player1.getId()] = player1;
            
            player2 = new Player(global.game);
            player2.setPosX(200);
            player2.setPosY(200);
            player2.setRadius(50);
            player2.setAlive(true);
            player2.setRoundResults(new PlayerRoundResults());
            player2.getRoundResults().setResultValue("points", 20);
            player2.getRoundResults().setResultValue("playersEaten", 5);
            global.game.getPlayers()[player2.getId()] = player2;
            
            player3 = new Player(global.game);
            player3.setPosX(500);
            player3.setPosY(500);
            player3.setRadius(50);
            player3.setAlive(true);
            player3.setRoundResults(new PlayerRoundResults());
            player3.getRoundResults().setResultValue("points", 20);
            player3.getRoundResults().setResultValue("playersEaten", 5);
            global.game.getPlayers()[player3.getId()] = player3;
            
            bomb1 = new Bomb(player1.getId(), global.game);
            bomb1.setPosX(200);
            bomb1.setPosY(200);
            bomb1.setRadius(30);
            bomb1.setAlive(true);
            
            global.game.getPlayers()[bomb1.getId()] = bomb1;
        });
        
        it("debería destruirse si sobrepasa el máximo del radio de explosion", function(){
            bomb1._explosionRadius = bomb1.getRadius() * 3;
            bomb1.explode();
            assert.equal(bomb1.getIsDestroyed(), true);
        });
        
        it("debería aumentar el radio de explosion si no ha llegado a su maximo", function(){
            bomb1._explosionRadius = bomb1.getRadius();
            var explosionRadiusBefore = bomb1._explosionRadius;
            bomb1.explode();
            var explosionRadiusLater = bomb1.getExplosionRadius();
            assert.equal(explosionRadiusLater > explosionRadiusBefore, true);
        });
        
        it("debería atacar a los jugadores que están en el radio de explosion", function(){
            bomb1.explode();
            assert.equal(player2.getAlive(), false);
        });
    });
    
    describe("#endExplosionTime(bombId)", function(){
        var bomb1, player1, player2, player3;
        beforeEach(function(){
            for(var elementId in global.game.getBalls())
            {
                delete global.game.getBalls()[elementId];
            }
            
            for(var elementId in global.game.getPlayers())
            {
                delete global.game.getPlayers()[elementId];
            }
            
            player1 = new Player(global.game);
            player1.setPosX(100);
            player1.setPosY(100);
            player1.setRadius(50);
            player1.setAlive(true);
            player1.setRoundResults(new PlayerRoundResults());
            player1.getRoundResults().setResultValue("points", 20);
            player1.getRoundResults().setResultValue("playersEaten", 5);
            global.game.getPlayers()[player1.getId()] = player1;
            
            player2 = new Player(global.game);
            player2.setPosX(200);
            player2.setPosY(200);
            player2.setRadius(50);
            player2.setAlive(true);
            player2.setRoundResults(new PlayerRoundResults());
            player2.getRoundResults().setResultValue("points", 20);
            player2.getRoundResults().setResultValue("playersEaten", 5);
            global.game.getPlayers()[player2.getId()] = player2;
            
            player3 = new Player(global.game);
            player3.setPosX(500);
            player3.setPosY(500);
            player3.setRadius(50);
            player3.setAlive(true);
            player3.setRoundResults(new PlayerRoundResults());
            player3.getRoundResults().setResultValue("points", 20);
            player3.getRoundResults().setResultValue("playersEaten", 5);
            global.game.getPlayers()[player3.getId()] = player3;
            
            bomb1 = new Bomb(player1.getId(), global.game);
            bomb1.setPosX(200);
            bomb1.setPosY(200);
            bomb1.setRadius(30);
            bomb1.setAlive(true);
            
            global.game.getPlayers()[bomb1.getId()] = bomb1;
        });
        
        it("cuando se termina el tiempo de explosion, se pone el tiempo de explosion a cero", function(){
            bomb1.setAccelerateTimer(null);
            bomb1.setExplosionTimer(null);
            bomb1.endExplosionTime(global.game, bomb1.getId());
            assert.equal(bomb1.getExplosionTime(), 0);
        });
        
        it("si la bomba no había explotado todavía, entonces explota", function(){
            bomb1.setAccelerateTimer(null);
            bomb1.setExplosionTimer(null);
            bomb1.setIsDestroyed(false);
            bomb1.endExplosionTime(global.game, bomb1.getId());
            assert.equal(bomb1.getAlive(), false);
        });
        
        it("si la bomba ya había explotado, se elimina del juego", function(){
            bomb1.setAccelerateTimer(null);
            bomb1.setExplosionTimer(null);
            bomb1.setIsDestroyed(true);
            bomb1.endExplosionTime(global.game, bomb1.getId());
            assert.equal(global.game.getPlayers().hasOwnProperty(bomb1.getId()), false);
        });
    });
});


