
function WaitingInterface()
{
    this.init();
}

WaitingInterface.prototype.init = function()
{
    var waitingPanel = document.getElementById("waitingPanel");
    document.getElementById("waitingText").innerHTML = "Wait while loading game...";
    waitingPanel.style.display = "block";
};


