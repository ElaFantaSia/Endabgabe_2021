"use strict";
var Firework;
(function (Firework) {
    let canvas = document.getElementById("canvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    let crc2 = canvas.getContext("2d");
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let serverURL = "https://endabgabe-eia2.herokuapp.com";
    let color1 = document.getElementById("colorpicker1");
    color1.addEventListener("change", drawExplosion);
    let color2 = document.getElementById("colorpicker2");
    color2.addEventListener("change", drawExplosion);
    let radius = document.getElementById("radius");
    radius.addEventListener("change", drawExplosion);
    let particles = document.getElementById("particles");
    particles.addEventListener("change", drawExplosion);
    let fireCrackerDiv1 = document.getElementById("firecracker1");
    fireCrackerDiv1.addEventListener("click", hndClick);
    let fireCrackerDiv2 = document.getElementById("firecracker2");
    fireCrackerDiv2.addEventListener("click", hndClick);
    let fireCrackerDiv3 = document.getElementById("firecracker3");
    fireCrackerDiv3.addEventListener("click", hndClick);
    window.addEventListener("load", hndLoad);
    function hndLoad() {
        chooseFirecracker(fireCrackerDiv1); //Default
    }
    function hndClick(_event) {
        let div = _event.currentTarget;
        chooseFirecracker(div);
    }
    async function chooseFirecracker(_div) {
        removeSelected();
        _div.classList.add("selected");
        let response = await fetch(serverURL + "/getAll");
        let responseString = await response.text();
        let firecrackers = await JSON.parse(responseString); //Alle holen und ins Firecracker-Interface speichern
        for (let i = 0; i < firecrackers.length; i++) {
            if (Number(_div.getAttribute("firecrackerId")) == firecrackers[i].firecrackerId) { //firecrackerId vom HTML mit dem vom Array verglichen
                color1.value = "#" + firecrackers[i].color1; //Wert der an der Stelle im Array gefunden wird, wird als Farbe in den Colorpickeln gesetzt/Wert aus DAtenbank für das angeklickte InputELement ausgelesen
                color2.value = "#" + firecrackers[i].color2;
                particles.value = firecrackers[i].particles.toString();
                radius.value = firecrackers[i].radius.toString();
            }
        }
        drawExplosion();
    }
    function removeSelected() {
        fireCrackerDiv1.classList.remove("selected");
        fireCrackerDiv2.classList.remove("selected");
        fireCrackerDiv3.classList.remove("selected");
    }
    let saveButton = document.getElementById("save"); //Man kann immer nur das speichern, was gerade selektiert ist
    saveButton.addEventListener("click", hndSave);
    async function hndSave() {
        let firecrackerId = 0;
        if (fireCrackerDiv1.classList.contains("selected")) {
            firecrackerId = 1;
        }
        if (fireCrackerDiv2.classList.contains("selected")) {
            firecrackerId = 2;
        }
        if (fireCrackerDiv3.classList.contains("selected")) {
            firecrackerId = 3;
        }
        let url = serverURL + "/save?firecrackerId=" + firecrackerId + "&color1=" + color1.value.replace("#", "") + "&color2=" + color2.value.replace("#", "") + "&particles=" + particles.value + "&radius=" + radius.value;
        await fetch(url); //Client schickt URL an Server und wartet, bis dieser seine Arbeit damit (Daten auslesen-> Datenbank) abgeschlossen und Response geliefert hat
    }
    function drawExplosion() {
        crc2.clearRect(0, 0, canvas.width, canvas.height);
        crc2.save();
        let circleSteps = Math.PI * 2 / Number(particles.value); // ganzer Kreis durch Anzahl der Partikel
        for (let i = 0; i < Math.PI * 2; i += circleSteps) { // 360Grad; einzelne Steps Gradzahl, Kreis drehen
            drawParticle(i, 2); // i ist der Winkel, 2 Linienstärke
        }
        crc2.restore();
    }
    function drawParticle(_radiusParticle, _lineWidth) {
        crc2.setTransform(1, 0, 0, 1, centerX, centerY); //centerX und y Position Mitte; ....... (nix verschoben, drehen..)
        crc2.rotate(_radiusParticle);
        let gradient = crc2.createLinearGradient(-_lineWidth / 2, 0, _lineWidth, Number(radius.value)); //-Weite durch2 -> Linie genau mittig auf Linie (wird minimal verschoben), 0 ist y-Wert bleibt auf der Mitte,  _lineWidth=2, Radius
        gradient.addColorStop(0, color1.value);
        gradient.addColorStop(1, color2.value);
        crc2.fillStyle = gradient;
        crc2.fillRect(-_lineWidth / 2, 0, _lineWidth, Number(radius.value)); //Warum nicht stroke?
    }
})(Firework || (Firework = {}));
//# sourceMappingURL=design.js.map