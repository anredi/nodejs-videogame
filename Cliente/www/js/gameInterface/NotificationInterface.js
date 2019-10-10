
function NotificationInterface()
{
    this.init();
}

NotificationInterface.prototype.init = function()
{
    var notificationPanel = document.getElementById("notificationPanel");
    notificationPanel.style.display = "none";
    var notificationButton = document.getElementById("notificationButton");
    notificationButton.addEventListener("click", function(){
        notificationPanel.style.display = "none";
        document.getElementById("forms").style.display = "block";
    });
};


