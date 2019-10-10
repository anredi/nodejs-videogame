
function ResizeInterface()
{
    this.init();
}

ResizeInterface.prototype.resizeResultsInterface = function()
{
    var resultsPanel = gameInterface.getResultsInterface().getResultsPanel();   

    if(resultsPanel.style.display === "block")
    {
        if(resultsPanel.offsetWidth > window.innerWidth)
        {
            resultsPanel.style.width = window.innerWidth + "px";
        }else{
            resultsPanel.style.width = "800px";
        }
        if(resultsPanel.offsetHeight > window.innerHeight)
        {
            resultsPanel.style.height = window.innerHeight + "px";
        }else{
            resultsPanel.style.height = "300px";
        }
    }
};

ResizeInterface.prototype.resizeInterfaces = function()
{
    gameInterface.getAudioInterface().getAudioPanel().style.top = (window.innerHeight - 60) + "px";
    gameInterface.getRankingInterface().getRankingPanel().style.left = (window.innerWidth - 270) + "px";
    gameInterface.getDrawingInterface().getDrawing().canvas.width = window.innerWidth;
    gameInterface.getDrawingInterface().getDrawing().canvas.height = window.innerHeight;
    if(game.getActivePlayer() !== null)
    {
        gameInterface.getDrawingInterface().updateDrawing();
    }
    this.resizeResultsInterface();
};


ResizeInterface.prototype.init = function()
{
    window.addEventListener("resize", function(){
        gameInterface.getSocketInterface().getWebSocket().emit("setWindowSize", {windowWidth: window.innerWidth, windowHeight: window.innerHeight});
        gameInterface.getResizeInterface().resizeInterfaces();
    }); 
};


