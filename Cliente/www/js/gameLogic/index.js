
window.onload = function (){    
    window.gameInterface = new GameInterface();
    gameInterface.getPlayerDataInterface().init();
    window.game = new Game();
};