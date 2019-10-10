const Server = require("../Server.js");
const Game = require("../Game.js");
global.server = new Server();
global.game = new Game(global.server);

describe("Player", function() {
    
    var assert = require('assert');
    const Utilities = require("../Utilities.js");
    const Ball = require("../Ball.js");
    const Player = require("../Player.js");
    const Bot = require("../Bot.js");
    const PlayerRoundResults = require("../PlayerRoundResults.js");
    
    const io = require("socket.io-client");
    var socket = io.connect("https://localhost:3000", { secure: true, reconnect: true, rejectUnauthorized : false });
    
    var player = new Player(global.game);
    
    beforeEach(function() {
        player = new Player(global.game);
        for(var elementId in global.game.getBalls())
        {
            delete global.game.getBalls()[elementId];
        }

        for(var elementId in global.game.getPlayers())
        {
            delete global.game.getPlayers()[elementId];
        }
    });
  
    describe('#getAlive()', function() {
        it("getAlive() debería devolver false", function() {
            assert.equal(player.getAlive(), false);
        });
    });
  
    describe('#setAlive(alive)', function() {
        it("getAlive() debería devolver alive", function() {
            var alive = true;
            player.setAlive(alive);
            assert.equal(player.getAlive(), alive);
        });
    });
  
  
    describe('#getNick()', function() {
        it("getNick() debería devolver nulo", function() {
            assert.equal(player.getNick(), null);
        });
    });
  
    describe('#setNick(nick)', function() {
        it("getNick() debería devolver nick", function() {
            var nick = "prueba";
            player.setNick(nick);
            assert.equal(player.getNick(), nick);
        });
    });
  
  
    describe('#getImgLocation()', function() {
        it("getImgLocation() debería devolver nulo", function() {
            assert.equal(player.getImgLocation(), null);
        });
    });
  
    describe('#setImgLocation(imgLocation)', function() {
        it("getImgLocation() debería devolver imgLocation", function() {
            var location = "/img/prueba.jpg";
            player.setImgLocation(location);
            assert.equal(player.getImgLocation(), location);
        });
    });
  
  
    describe('#getVisibleAreaX1()', function() {
        it("getVisibleAreaX1() debería devolver nulo", function() {
            assert.equal(player.getVisibleAreaX1(), null);
        });
    });
  
    describe('#getVisibleAreaY1()', function() {
        it("getVisibleAreaY1() debería devolver nulo", function() {
            assert.equal(player.getVisibleAreaY1(), null);
        });
    });
  
    describe('#getVisibleAreaX2()', function() {
        it("getVisibleAreaX2() debería devolver nulo", function() {
            assert.equal(player.getVisibleAreaX2(), null);
        });
    });
  
    describe('#getVisibleAreaY2()', function() {
        it("getVisibleAreaY2() debería devolver nulo", function() {
            assert.equal(player.getVisibleAreaY2(), null);
        });
    });
  
    describe('#getWindowWidth()', function() {
        it("getWindowWidth() debería devolver nulo", function() {
            assert.equal(player.getWindowWidth(), null);
        });
    });
  
    describe('#getWindowHeight()', function() {
        it("getWindowHeight() debería devolver nulo", function() {
            assert.equal(player.getWindowHeight(), null);
        });
    });
  
    describe('#getHorizontalSpeed()', function() {
        it("getHorizontalSpeed() debería devolver cero", function() {
            assert.equal(player.getHorizontalSpeed(), 0);
        });
    });
  
    describe('#setHorizontalSpeed(horizontalSpeed)', function() {
        it("getHorizontalSpeed() debería devolver horizontalSpeed", function() {
            var horizontalSpeed = 10;
            player.setHorizontalSpeed(horizontalSpeed);
            assert.equal(player.getHorizontalSpeed(), horizontalSpeed);
        });
    });
  
    describe('#getVerticalSpeed()', function() {
        it("getVerticalSpeed() debería devolver cero", function() {
            assert.equal(player.getVerticalSpeed(), 0);
        });
    });
  
    describe('#setVerticalSpeed(verticalSpeed)', function() {
        it("getVerticalSpeed() debería devolver verticalSpeed", function() {
            var verticalSpeed = 5;
            player.setVerticalSpeed(verticalSpeed);
            assert.equal(player.getVerticalSpeed(), verticalSpeed);
        });
    });
  
    describe('#getCanThrowBomb()', function() {
        it("getCanThrowBomb() debería devolver true", function() {
            assert.equal(player.getCanThrowBomb(), true);
        });
    });
  
    describe('#setCanThrowBomb(canThrowBomb)', function() {
        it("getCanThrowBomb() debería devolver canThrowBomb", function() {
            var canThrowBomb = false;
            player.setCanThrowBomb(canThrowBomb);
            assert.equal(player.getCanThrowBomb(), canThrowBomb);
        });
    });
  
    describe('#getRoundResults()', function() {
        it("getRoundResults() debería devolver nulo", function() {
            assert.equal(player.getRoundResults(), null);
        });
    });
  
    describe('#setRoundResults(roundResults)', function() {
        it("setRoundResults() debería devolver roundResults", function() {
            var roundResults = "ejemplo";
            player.setRoundResults(roundResults);
            assert.equal(player.getRoundResults(), roundResults);
        });
    });
  
  
    describe('#setWindowSize(windowWidth, windowHeight)', function() {
        it("player.getWindowWidth() debería devolver windowWidth", function() {
            var windowWidth = 1024;
            player.setWindowSize(windowWidth, null);
            assert.equal(player.getWindowWidth(), windowWidth);
        });
        it("player.getWindowHeight() debería devolver windowHeight", function() {
            var windowHeight = 768;
            player.setWindowSize(null, windowHeight);
            assert.equal(player.getWindowHeight(), windowHeight);
        });
        it("player._windowSizeChanged debería devolver true", function() {
            var windowWidth = 1024;
            var windowHeight = 768;
            player.setWindowSize(windowWidth, windowHeight);
            assert.equal(player._windowSizeChanged, true);
        });
    });
    
  
    describe('#move()', function() {
        it("debería mover la posicion del jugador en getHorizontalSpeed() y getVerticalSpeed()", function() {
            var posX = 200;
            var posY = 200;
            var horizontalSpeed = 5;
            var verticalSpeed = 10;
            player.setPosX(posX);
            player.setPosY(posY);
            player.setHorizontalSpeed(horizontalSpeed);
            player.setVerticalSpeed(verticalSpeed);

            player.move();
            assert.equal(player.getPosX(), horizontalSpeed + posX);
        });
    
        it("debería no moverse horizontalmente si el jugador está en el limite izquierdo del tablero de juego e intenta moverse a la izquierda", function() {
            var radius = 50;
            var posX = radius;
            var posY = 200;
            var horizontalSpeed = -5;
            var verticalSpeed = 10;
            player.setRadius(radius);
            player.setPosX(posX);
            player.setPosY(posY);
            player.setHorizontalSpeed(horizontalSpeed);
            player.setVerticalSpeed(verticalSpeed);

            player.move();
            assert.equal(player.getPosX(), posX);
        });
    
        it("debería no moverse horizontalmente si el jugador está en el limite derecho del tablero de juego e intenta moverse a la derecha", function() {
            var radius = 50;
            var posX = global.game.getConfiguration().getBoardWidth() - radius;
            var posY = 200;
            var horizontalSpeed = 5;
            var verticalSpeed = 10;
            player.setRadius(radius);
            player.setPosX(posX);
            player.setPosY(posY);
            player.setHorizontalSpeed(horizontalSpeed);
            player.setVerticalSpeed(verticalSpeed);

            player.move();
            assert.equal(player.getPosX(), posX);
        });
    
        it("debería no moverse verticalmente si el jugador está en el limite superior del tablero de juego e intenta moverse hacia arriba", function() {
            var radius = 50;
            var posX = 200;
            var posY = radius;
            var horizontalSpeed = 5;
            var verticalSpeed = -10;
            player.setRadius(radius);
            player.setPosX(posX);
            player.setPosY(posY);
            player.setHorizontalSpeed(horizontalSpeed);
            player.setVerticalSpeed(verticalSpeed);

            player.move();
            assert.equal(player.getPosY(), posY);
        });
    
        it("debería no moverse verticalmente si el jugador está en el limite inferior del tablero de juego e intenta moverse hacia abajo", function() {
            var radius = 50;
            var posX = 200;
            var posY = global.game.getConfiguration().getBoardHeight() - radius;
            var horizontalSpeed = 5;
            var verticalSpeed = 10;
            player.setRadius(radius);
            player.setPosX(posX);
            player.setPosY(posY);
            player.setHorizontalSpeed(horizontalSpeed);
            player.setVerticalSpeed(verticalSpeed);

            player.move();
            assert.equal(player.getPosY(), posY);
        });
    
        it("debería quedarse pegado a la pared izquierda del tablero si al moverse intenta sobrepasarlo", function() {
            var radius = 50;
            var posX = 60;
            var posY = 200;
            var horizontalSpeed = -20;
            var verticalSpeed = 10;
            player.setRadius(radius);
            player.setPosX(posX);
            player.setPosY(posY);
            player.setHorizontalSpeed(horizontalSpeed);
            player.setVerticalSpeed(verticalSpeed);

            player.move();
            assert.equal(player.getPosX(), radius);
        });
    
        it("debería quedarse pegado a la pared derecha del tablero si al moverse intenta sobrepasarlo", function() {
            var radius = 50;
            var posX = global.game.getConfiguration().getBoardWidth() - 60;
            var posY = 200;
            var horizontalSpeed = 20;
            var verticalSpeed = 10;
            player.setRadius(radius);
            player.setPosX(posX);
            player.setPosY(posY);
            player.setHorizontalSpeed(horizontalSpeed);
            player.setVerticalSpeed(verticalSpeed);

            player.move();
            assert.equal(player.getPosX(), global.game.getConfiguration().getBoardWidth() - radius);
        });
    
        it("debería quedarse pegado a la pared superior del tablero si al moverse intenta sobrepasarlo", function() {
            var radius = 50;
            var posX = 200;
            var posY = 60;
            var horizontalSpeed = 5;
            var verticalSpeed = -20;
            player.setRadius(radius);
            player.setPosX(posX);
            player.setPosY(posY);
            player.setHorizontalSpeed(horizontalSpeed);
            player.setVerticalSpeed(verticalSpeed);

            player.move();
            assert.equal(player.getPosY(), radius);
        });
    
        it("debería quedarse pegado a la pared inferior del tablero si al moverse intenta sobrepasarlo", function() {
            var radius = 50;
            var posX = 200;
            var posY = global.game.getConfiguration().getBoardHeight() - 60;
            var horizontalSpeed = 5;
            var verticalSpeed = 20;
            player.setRadius(radius);
            player.setPosX(posX);
            player.setPosY(posY);
            player.setHorizontalSpeed(horizontalSpeed);
            player.setVerticalSpeed(verticalSpeed);

            player.move();
            assert.equal(player.getPosY(), global.game.getConfiguration().getBoardHeight() - radius);
        });
    });
    
   
    describe('#attackBall(ball)', function() {
        beforeEach(function() {
            player = new Player(global.game);
            var playerRadius = 50;
            var playerPosX = 200;
            var playerPosY = 200;
            player.setRadius(playerRadius);
            player.setPosX(playerPosX);
            player.setPosY(playerPosY);
            player.setRoundResults(new PlayerRoundResults());
        });
        
      it("debería no atacar a la bola si no está a la distancia adecuada", function(){          
          var ballRadius = 10;
          var ballPosX = 300;
          var ballPosY = 300;
          var ball = new Ball(global.game);
          ball.setRadius(ballRadius);
          ball.setPosX(ballPosX);
          ball.setPosY(ballPosY);
          
          var radiusBefore = player.getRadius();
          player.attackBall(ball);
          var radiusLater = player.getRadius();
          assert.equal(radiusBefore, radiusLater);
      });
      
      it("debería atacar a la bola si está a la distancia adecuada y crecer su área en el area de la bola", function(){
          var ballRadius = 10;
          var ballPosX = 201;
          var ballPosY = 201;
          var ball = new Ball(global.game);
          ball.setRadius(ballRadius);
          ball.setPosX(ballPosX);
          ball.setPosY(ballPosY);
          
          var radiusBefore = player.getRadius();
          player.attackBall(ball);
          var newPlayerRadius = Math.sqrt(Math.pow(radiusBefore,2) + Math.pow(ballRadius,2));
          assert.equal(player.getRadius(), newPlayerRadius);
      });
      
      it("debería atacar a la bola si está a la distancia adecuada y aumentar el nº de puntos de la ronda en los puntos de la bola", function(){
          var ballRadius = 10;
          var ballPosX = 201;
          var ballPosY = 201;
          var ball = new Ball(global.game);
          ball.setRadius(ballRadius);
          ball.setPosX(ballPosX);
          ball.setPosY(ballPosY);
          
          var playerPointsBefore = player.getRoundResults().getResultValue("points");
          player.attackBall(ball);
          var playerPointsLater = player.getRoundResults().getResultValue("points");
          assert.equal(playerPointsLater - playerPointsBefore, global.game.getConfiguration().getBallPoints());
      });
      
      it("debería atacar a la bola si está a la distancia adecuada y aumentar el nº de bolas comidas de la ronda en uno", function(){ 
          var ballRadius = 10;
          var ballPosX = 201;
          var ballPosY = 201;
          var ball = new Ball(global.game);
          ball.setRadius(ballRadius);
          ball.setPosX(ballPosX);
          ball.setPosY(ballPosY);
          
          var playerBallsEatenBefore = player.getRoundResults().getResultValue("ballsEaten");
          player.attackBall(ball);
          var playerBallsEatenLater = player.getRoundResults().getResultValue("ballsEaten");
          assert.equal(playerBallsEatenLater - playerBallsEatenBefore, 1);
      });
      
      it("debería atacar a la bola si está a la distancia adecuada y lanzar un evento para avisar al cliente de la bola comida", function(done){ 
          var ballRadius = 10;
          var ballPosX = 201;
          var ballPosY = 201;
          var ball = new Ball(global.game);
          ball.setRadius(ballRadius);
          ball.setPosX(ballPosX);
          ball.setPosY(ballPosY);
          
          player.attackBall(ball);
          socket.on("deletedBall", function(ballId){
              if(ball.getId() === ballId)
              {
                  done();
              }
          });
      });
      
      it("debería atacar a la bola si está a la distancia adecuada y eliminar la bola de la lista de bolas del juego", function(){ 
          var ballRadius = 10;
          var ballPosX = 201;
          var ballPosY = 201;
          var ball = new Ball(global.game);
          var ballId = ball.getId();
          ball.setRadius(ballRadius);
          ball.setPosX(ballPosX);
          ball.setPosY(ballPosY);
          global.game.getBalls()[ball.getId()] = ball;
          
          player.attackBall(ball);
          
          assert.equal(global.game.getBalls().hasOwnProperty(ballId), false);
      });
  });
  
  
    describe('#attackPlayer(player)', function() {
        var player1;
        beforeEach(function() {
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
        });
      
        it("debería no atacar al jugador si el jugador ya está muerto", function(){      
            var player2 = new Player(global.game);
            var player2Radius = 20;
            var player2PosX = 200;
            var player2PosY = 200;
            player2.setRadius(player2Radius);
            player2.setPosX(player2PosX);
            player2.setPosY(player2PosY);
            player2.setRoundResults(new PlayerRoundResults());
            player2.setAlive(false);
            
            var player1RadiusBefore = player1.getRadius();
            player1.attackPlayer(player2);
            assert.equal(player1RadiusBefore, player1.getRadius());
        });
      
        it("debería no atacar al jugador si es el mismo", function(){
            var player1RadiusBefore = player1.getRadius();
            player1.attackPlayer(player1);
            assert.equal(player1RadiusBefore, player1.getRadius());
        });
      
        it("debería no atacar al jugador si no está en la distancia adecuada", function(){
            var player2 = new Player(global.game);
            var player2Radius = 20;
            var player2PosX = 300;
            var player2PosY = 300;
            player2.setRadius(player2Radius);
            player2.setPosX(player2PosX);
            player2.setPosY(player2PosY);
            player2.setRoundResults(new PlayerRoundResults());
            player2.setAlive(true);
            
            player1.attackPlayer(player2);
            assert.equal(player2.getAlive(), true);
        });
      
        it("debería no atacar al jugador si tiene la distancia adecuada pero menor radio", function(){
            var player2 = new Player(global.game);
            var player2Radius = 70;
            var player2PosX = 200;
            var player2PosY = 200;
            player2.setRadius(player2Radius);
            player2.setPosX(player2PosX);
            player2.setPosY(player2PosY);
            player2.setRoundResults(new PlayerRoundResults());
            player2.setAlive(true);
          
            player1.attackPlayer(player2);
            assert.equal(player2.getAlive(), true);
        });
      
        it("debería matar al jugador atacado y el atacante crecer en area, puntos, etc adecuadamente", function(){
            var player2 = new Player(global.game);
            var player2Radius = 30;
            var player2PosX = 200;
            var player2PosY = 200;
            player2.setRadius(player2Radius);
            player2.setPosX(player2PosX);
            player2.setPosY(player2PosY);
            player2.setRoundResults(new PlayerRoundResults());
            player2.setAlive(true);
            player2.getRoundResults().setResultValue("points", 20);
            player2.getRoundResults().setResultValue("playersEaten", 5);

            var player1RadiusBefore = player1.getRadius();
            var player1PointsBefore = player1.getRoundResults().getResultValue("points");
            var player1PlayersEatenBefore = player1.getRoundResults().getResultValue("playersEaten");
            var player2PointsBefore = player2.getRoundResults().getResultValue("points");
            var player2DeathsBefore = player2.getRoundResults().getResultValue("deaths");
            player1.attackPlayer(player2);
            var player1PointsLater = player1.getRoundResults().getResultValue("points");
            var player1PlayersEatenLater = player1.getRoundResults().getResultValue("playersEaten");
            var player2DeathsLater = player2.getRoundResults().getResultValue("deaths");
            
            assert.equal(player2.getAlive(), false);
            assert.equal(player1.getRadius(), Math.sqrt(Math.pow(player1RadiusBefore,2) + Math.pow(player2Radius,2)));
            assert.equal(player1PointsLater - player1PointsBefore, player2PointsBefore);
            assert.equal(player1PlayersEatenLater - player1PlayersEatenBefore, 1);
            assert.equal(player2DeathsLater - player2DeathsBefore, 1);
            assert.equal(player2.getRoundResults().getResultValue("points"), 0);
            assert.equal(player2.getRadius(), global.game.getConfiguration().getPlayerInitialRadius());
            assert.equal(player2.getHorizontalSpeed(), 0);
            assert.equal(player2.getVerticalSpeed(), 0);
        });       
    });
    
    describe('#attackBot(player)', function() {
        var player1;
        beforeEach(function() {
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
        });
      
        it("debería no atacar al bot si el bot ya está muerto", function(){      
            var player2 = new Bot(global.game);
            var player2Radius = 20;
            var player2PosX = 200;
            var player2PosY = 200;
            player2.setRadius(player2Radius);
            player2.setPosX(player2PosX);
            player2.setPosY(player2PosY);
            player2.setRoundResults(new PlayerRoundResults());
            player2.setAlive(false);
            
            var player1RadiusBefore = player1.getRadius();
            player1.attackBot(player2);
            assert.equal(player1RadiusBefore, player1.getRadius());
        });
      
        it("debería no atacar al jugador si es el mismo", function(){
            var player1RadiusBefore = player1.getRadius();
            player1.attackBot(player1);
            assert.equal(player1RadiusBefore, player1.getRadius());
        });
      
        it("debería no atacar al bot si no está en la distancia adecuada", function(){
            var player2 = new Bot(global.game);
            var player2Radius = 20;
            var player2PosX = 300;
            var player2PosY = 300;
            player2.setRadius(player2Radius);
            player2.setPosX(player2PosX);
            player2.setPosY(player2PosY);
            player2.setRoundResults(new PlayerRoundResults());
            player2.setAlive(true);
            
            player1.attackBot(player2);
            assert.equal(player2.getAlive(), true);
        });
      
        it("debería no atacar al bot si tiene la distancia adecuada pero menor radio", function(){
            var player2 = new Bot(global.game);
            var player2Radius = 70;
            var player2PosX = 200;
            var player2PosY = 200;
            player2.setRadius(player2Radius);
            player2.setPosX(player2PosX);
            player2.setPosY(player2PosY);
            player2.setRoundResults(new PlayerRoundResults());
            player2.setAlive(true);
          
            player1.attackBot(player2);
            assert.equal(player2.getAlive(), true);
        });
      
        it("debería matar al bot atacado y el atacante crecer en area, puntos, etc adecuadamente", function(){
            var player2 = new Bot(global.game);
            var player2Radius = 30;
            var player2PosX = 200;
            var player2PosY = 200;
            player2.setRadius(player2Radius);
            player2.setPosX(player2PosX);
            player2.setPosY(player2PosY);
            player2.setRoundResults(new PlayerRoundResults());
            player2.setAlive(true);
            player2.getRoundResults().setResultValue("points", 20);
            player2.getRoundResults().setResultValue("playersEaten", 5);

            var player1RadiusBefore = player1.getRadius();
            var player1PointsBefore = player1.getRoundResults().getResultValue("points");
            var player1PlayersEatenBefore = player1.getRoundResults().getResultValue("playersEaten");
            var player2PointsBefore = player2.getRoundResults().getResultValue("points");
            var player2DeathsBefore = player2.getRoundResults().getResultValue("deaths");
            player1.attackBot(player2);
            var player1PointsLater = player1.getRoundResults().getResultValue("points");
            var player1PlayersEatenLater = player1.getRoundResults().getResultValue("playersEaten");
            var player2DeathsLater = player2.getRoundResults().getResultValue("deaths");
            
            assert.equal(player2.getAlive(), true);
            assert.equal(player1.getRadius(), Math.sqrt(Math.pow(player1RadiusBefore,2) + Math.pow(player2Radius,2)));
            assert.equal(player1PointsLater - player1PointsBefore, player2PointsBefore);
            assert.equal(player1PlayersEatenLater - player1PlayersEatenBefore, 1);
            assert.equal(player2DeathsLater - player2DeathsBefore, 1);
            assert.equal(player2.getRoundResults().getResultValue("points"), 0);
            assert.equal(player2.getRadius(), global.game.getConfiguration().getPlayerInitialRadius());
            assert.equal(player2.getHorizontalSpeed(), 0);
            assert.equal(player2.getVerticalSpeed(), 0);
        });       
    });
 
 
    describe('#kill()', function() {
        var player1;
        beforeEach(function() {
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
        });
      
        it("debería matar al jugador, reseteando sus parámetros", function(){
            var player1DeathsBefore = player1.getRoundResults().getResultValue("deaths");

            player1.kill();

            var player1DeathsLater = player1.getRoundResults().getResultValue("deaths");
            assert.equal(player1.getAlive(), false);
            assert.equal(player1.getRadius(), global.game.getConfiguration().getPlayerInitialRadius());
            assert.equal(player1.getHorizontalSpeed(), 0);
            assert.equal(player1.getVerticalSpeed(), 0);
            assert.equal(player1DeathsLater - player1DeathsBefore, 1);
            assert.equal(player1.getRoundResults().getResultValue("points"), 0);
        });
        
        it("debería lanzar un evento con el id del jugador muerto", function(done){
            player1.kill();
            socket.on("deadPlayer", function(playerDeadId){
                if(player1.getId() === playerDeadId)
                {
                    done();
                }
            });
        });
    });
  
  
    describe('#reset()', function() {
        var player1;
        beforeEach(function() {
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
        });
      
        it("debería resetear los parámetros del jugador", function(){
            player1.reset();
          
            assert.equal(player1.getAlive(), false);
            assert.equal(player1.getRadius(), global.game.getConfiguration().getPlayerInitialRadius());
            assert.equal(player1.getHorizontalSpeed(), 0);
            assert.equal(player1.getVerticalSpeed(), 0);
            assert.equal(player1.getCanThrowBomb(), true);
      });
  });
  
  
    describe('#resurrect()', function() {
        var player1;
        beforeEach(function() {
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
            player1.setAlive(false);
        });
      
        it("debería resucitar al jugador", function(){
            player1.resurrect();
          
            assert.equal(player1.getAlive(), true);
        });
    });
  
  
    describe('#accelerate(horizontalSpeed, verticalSpeed)', function() {
        var player1;
        beforeEach(function() {
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
            player1.setAlive(false);
        });
      
        it("debería cambiar la velocidad a la que va el jugador si es menor del limite y ponerla al máximo si se pasa del limite", function(){
            player1.setHorizontalSpeed(2);
            player1.setVerticalSpeed(3);
            player1.accelerate(0,0);
            assert.equal(player1.getHorizontalSpeed(), 0);
            assert.equal(player1.getVerticalSpeed(), 0);

            player1.accelerate(-3, 5);
            assert.equal(player1.getHorizontalSpeed(), -3);
            assert.equal(player1.getVerticalSpeed(), 5);

            player1.accelerate(-11, 5);
            assert.equal(player1.getHorizontalSpeed(), -10);
            assert.equal(player1.getVerticalSpeed(), 5);

            player1.accelerate(-11, -20);
            assert.equal(player1.getHorizontalSpeed(), -10);
            assert.equal(player1.getVerticalSpeed(), -10);

            player1.accelerate(-11, 2);
            assert.equal(player1.getHorizontalSpeed(), -10);
            assert.equal(player1.getVerticalSpeed(), 2);

            player1.accelerate(7, 3);
            assert.equal(player1.getHorizontalSpeed(), 7);
            assert.equal(player1.getVerticalSpeed(), 3);   
        });
    });
  
 
    describe('#setVisibleArea()', function() {
        var player1;
        beforeEach(function() {
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
            player1.setWindowSize(1024, 768);
        });
      
        it("establece un area visible del tablero proporcional al tamaño de la ventana", function(){
            var windowProportion = player1.getWindowWidth() / player1.getWindowHeight();
            player1.setVisibleArea();

            var visibleAreaWidth = player1.getVisibleAreaX2() - player1.getVisibleAreaX1();
            var visibleAreaHeight = player1.getVisibleAreaY2() - player1.getVisibleAreaY1();
            var newProportion = visibleAreaWidth / visibleAreaHeight;
            assert.equal(newProportion, windowProportion);
        });
      
        it("la posicion del jugador siempre está en el centro del area visible", function(){
            player1.setVisibleArea();

            var visibleAreaWidth = player1.getVisibleAreaX2() - player1.getVisibleAreaX1();
            var visibleAreaHeight = player1.getVisibleAreaY2() - player1.getVisibleAreaY1();
            var posX = player1.getVisibleAreaX1() + visibleAreaWidth / 2;
            var posY = player1.getVisibleAreaY1() + visibleAreaHeight / 2;
            assert.equal(player1.getPosX(), posX);
            assert.equal(player1.getPosY(), posY);

            player1.setPosX(500);
            player1.setPosY(500);
            player1.setVisibleArea();
            visibleAreaWidth = player1.getVisibleAreaX2() - player1.getVisibleAreaX1();
            visibleAreaHeight = player1.getVisibleAreaY2() - player1.getVisibleAreaY1();
            posX = player1.getVisibleAreaX1() + visibleAreaWidth / 2;
            posY = player1.getVisibleAreaY1() + visibleAreaHeight / 2;
            assert.equal(player1.getPosX(), posX);
            assert.equal(player1.getPosY(), posY);
        });
    });
});


