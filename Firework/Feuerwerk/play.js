"use strict";
var Firework;
(function (Firework) {
    let serverURL = "https://endabgabe-eia2.herokuapp.com";
    let canvas = document.getElementById("canvas");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    Firework.ctx = canvas.getContext("2d");
    canvas.addEventListener("mouseup", hndMouseUp);
    let currentFirecracker;
    let allFirecrackersToDraw = [];
    let allFirecrackers = [];
    let fireCrackerDiv1 = document.getElementById("firecracker1");
    fireCrackerDiv1.addEventListener("click", hndClick);
    let fireCrackerDiv2 = document.getElementById("firecracker2");
    fireCrackerDiv2.addEventListener("click", hndClick);
    let fireCrackerDiv3 = document.getElementById("firecracker3");
    fireCrackerDiv3.addEventListener("click", hndClick);
    window.addEventListener("load", loadWnd);
    async function loadWnd() {
        let response = await fetch(serverURL + "/getAll");
        let responseString = await response.text();
        allFirecrackers = await JSON.parse(responseString);
        setCurrentFirecracker(1);
        fireCrackerDiv1.classList.add("selected");
        window.setInterval(update, 20); //Alle 20ms wird update aufgerufen
    }
    function update() {
        Firework.ctx.fillRect(0, 0, Firework.ctx.canvas.width, Firework.ctx.canvas.height);
        for (let firecracker of allFirecrackersToDraw) { //Das Array allFirecrackersToDraw ist generell leer, bei jedem Klick wird Rakete erzeugt und darin gespeichert und Timeintervall mitgegeben und alle 20ms wird die Zeichenfunktion draw der Rakete neu aufgerufen, bis sie expendable ist
            firecracker.draw(1 / 50);
        }
        for (let i = allFirecrackersToDraw.length - 1; i >= 0; i--) { //Wenn Lifetime überschritten bekommt Rakete Attribut expendable und wird beim nächsten Update aus dem Array entfernt
            if (allFirecrackersToDraw[i].expendable) {
                allFirecrackersToDraw.splice(i, 1);
            }
        }
    }
    function setCurrentFirecracker(_firecrackerId) {
        for (let i = 0; i < allFirecrackers.length; i++) {
            if (allFirecrackers[i].firecrackerId == _firecrackerId)
                currentFirecracker = allFirecrackers[i];
        }
    }
    function hndClick(_event) {
        removeSelected(); //Alle werden entselektiert (damit nicht mehrere ausgewählt sind)
        let div = _event.currentTarget; //Das div das angeklickt wurde wird ausgewählt und als CurrentFirecracker gespeichert
        div.classList.add("selected");
        setCurrentFirecracker(Number(div.getAttribute("firecrackerId")));
    }
    function removeSelected() {
        fireCrackerDiv1.classList.remove("selected");
        fireCrackerDiv2.classList.remove("selected");
        fireCrackerDiv3.classList.remove("selected");
    }
    function hndMouseUp(_event) {
        let bound = canvas.getBoundingClientRect(); //DIe drei Zeilen um richtige Mausposition auf Canvas zu finden
        let canvasX = _event.pageX - bound.left - canvas.clientLeft;
        let canvasY = _event.pageY - bound.top - canvas.clientTop;
        let firecracker = new Firework.Firecracker(canvasX, canvasY, "#" + currentFirecracker.color1, "#" + currentFirecracker.color2, currentFirecracker.radius, currentFirecracker.particles);
        allFirecrackersToDraw.push(firecracker);
    }
    document.addEventListener("keydown", hndKeyDown);
    function hndKeyDown(_event) {
        if (_event.key.match("1")) {
            removeSelected();
            fireCrackerDiv1.classList.add("selected");
            setCurrentFirecracker(1);
        }
        else if (_event.key.match("2")) {
            removeSelected();
            fireCrackerDiv2.classList.add("selected");
            setCurrentFirecracker(2);
        }
        else if (_event.key.match("3")) {
            removeSelected();
            fireCrackerDiv3.classList.add("selected");
            setCurrentFirecracker(3);
        }
        else
            return;
    }
})(Firework || (Firework = {}));
//# sourceMappingURL=play.js.map