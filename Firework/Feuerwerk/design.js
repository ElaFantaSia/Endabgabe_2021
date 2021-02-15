"use strict";
var Firework;
(function (Firework) {
    let canvas = document.getElementById("canvas");
    let crc2 = canvas.getContext("2d");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let serverURL = "https://endabgabe-eia2.herokuapp.com";
    let colorPicker1 = document.getElementById("colorpicker1");
    let colorPicker2 = document.getElementById("colorpicker2");
    let sliderRadius = document.getElementById("radius");
    let sliderParticles = document.getElementById("particles");
    let fireCrackerDiv1 = document.getElementById("firecracker1");
    let fireCrackerDiv2 = document.getElementById("firecracker2");
    let fireCrackerDiv3 = document.getElementById("firecracker3");
    let saveButton = document.getElementById("save");
    window.addEventListener("load", hndLoad);
    function hndLoad() {
        colorPicker1.addEventListener("change", drawExplosion);
        colorPicker2.addEventListener("change", drawExplosion);
        sliderRadius.addEventListener("change", drawExplosion);
        sliderParticles.addEventListener("change", drawExplosion);
        fireCrackerDiv1.addEventListener("click", hndClick);
        fireCrackerDiv2.addEventListener("click", hndClick);
        fireCrackerDiv3.addEventListener("click", hndClick);
        saveButton.addEventListener("click", hndSave);
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
                colorPicker1.value = "#" + firecrackers[i].color1; //Wert der an der Stelle im Array gefunden wird, wird als Farbe in den Colorpickeln gesetzt/Wert aus DAtenbank für das angeklickte InputELement ausgelesen
                colorPicker2.value = "#" + firecrackers[i].color2;
                sliderParticles.value = firecrackers[i].particles.toString();
                sliderRadius.value = firecrackers[i].radius.toString();
            }
        }
        drawExplosion();
    }
    function removeSelected() {
        fireCrackerDiv1.classList.remove("selected");
        fireCrackerDiv2.classList.remove("selected");
        fireCrackerDiv3.classList.remove("selected");
    }
    function drawExplosion() {
        crc2.clearRect(0, 0, canvas.width, canvas.height);
        crc2.save();
        let circleSteps = Math.PI * 2 / Number(sliderParticles.value); // ganzer Kreis durch Anzahl der Partikel
        for (let i = 0; i < Math.PI * 2; i += circleSteps) { // 360Grad; einzelne Steps Gradzahl, Kreis drehen
            drawParticle(i, 2); // i ist der Winkel, 2 Linienstärke
        }
        crc2.restore();
    }
    function drawParticle(_radiusParticle, _lineWidth) {
        crc2.setTransform(1, 0, 0, 1, centerX, centerY); //centerX und y Position Mitte; ....... (nix verschoben, drehen..)
        crc2.rotate(_radiusParticle);
        let gradient = crc2.createLinearGradient(-_lineWidth / 2, 0, _lineWidth, Number(sliderRadius.value)); //-Weite durch2 -> Linie genau mittig auf Linie (wird minimal verschoben), 0 ist y-Wert bleibt auf der Mitte,  _lineWidth=2, Radius
        gradient.addColorStop(0, colorPicker1.value);
        gradient.addColorStop(1, colorPicker2.value);
        crc2.fillStyle = gradient;
        crc2.fillRect(-_lineWidth / 2, 0, _lineWidth, Number(sliderRadius.value)); //Warum nicht stroke?
    }
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
        let url = serverURL + "/save?firecrackerId=" + firecrackerId + "&color1=" + colorPicker1.value.replace("#", "") + "&color2=" + colorPicker2.value.replace("#", "") + "&particles=" + sliderParticles.value + "&radius=" + sliderRadius.value;
        await fetch(url); //Client schickt URL an Server und wartet, bis dieser seine Arbeit damit (Daten auslesen-> Datenbank) abgeschlossen und Response geliefert hat
        playSound("./Sounds/G.mp3");
    }
    function playSound(_soundURL) {
        let audio = document.createElement("audio");
        audio.style.display = "none";
        audio.src = _soundURL;
        audio.autoplay = true;
        audio.onended = function () {
            audio.remove(); //Remove when played.
        };
    }
})(Firework || (Firework = {}));
//# sourceMappingURL=design.js.map