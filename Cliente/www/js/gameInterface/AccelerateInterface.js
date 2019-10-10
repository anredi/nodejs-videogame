
function AccelerateInterface()
{
    this.init();
}


AccelerateInterface.prototype.init = function()
{
    window.addEventListener('mousemove', function(evt) {
        if(game.getActivePlayer() !== null && gameInterface.getDrawingInterface().getDrawing() !== null)
        {
            var c = gameInterface.getDrawingInterface().getDrawing().canvas;
            var rect = c.getBoundingClientRect();
            var newPlayerPosition = {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };

            game.getActivePlayer().accelerate(newPlayerPosition);
        }

    });
};