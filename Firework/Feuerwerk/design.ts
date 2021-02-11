namespace Firework {
    export interface FirecrackerInterface {
        id: string;
        firecrackerId: number;
        color1: string;
        color2: string;
        radius: number;
        particles: number; 
    }
    
    let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("canvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    let ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext("2d");

    let centerX: number = canvas.width / 2;
    let centerY: number = canvas.height / 2;
    
    let serverURL: string = "https://endabgabe-eia2.herokuapp.com";

    let color1: HTMLInputElement = <HTMLInputElement>document.getElementById("colorpicker1");
    color1.addEventListener("change", drawExplosion);
    let color2: HTMLInputElement = <HTMLInputElement>document.getElementById("colorpicker2");
    color2.addEventListener("change", drawExplosion);
    let radius: HTMLInputElement = <HTMLInputElement>document.getElementById("radius");
    radius.addEventListener("change", drawExplosion);
    let particles: HTMLInputElement = <HTMLInputElement>document.getElementById("particles");
    particles.addEventListener("change", drawExplosion);

    let fireCrackerDiv1: HTMLDivElement = <HTMLDivElement>document.getElementById("firecracker1");
    fireCrackerDiv1.addEventListener("click", hndClick);

    let fireCrackerDiv2: HTMLDivElement = <HTMLDivElement>document.getElementById("firecracker2");
    fireCrackerDiv2.addEventListener("click", hndClick);

    let fireCrackerDiv3: HTMLDivElement = <HTMLDivElement>document.getElementById("firecracker3");
    fireCrackerDiv3.addEventListener("click", hndClick);

    window.addEventListener("load", loadWnd);

    function loadWnd(): void {
        chooseFirecracker(fireCrackerDiv1); //Default
    }

    function hndClick(_event: Event): void {
        let div: HTMLDivElement = <HTMLDivElement>_event.currentTarget;
        chooseFirecracker(div);
    }

    async function chooseFirecracker(_div: HTMLDivElement): Promise<void> {
        removeSelected();
        _div.classList.add("selected");
        let response: Response = await fetch(serverURL + "/getAll");
        let responseString: string =  await response.text();
        let firecrackers: FirecrackerInterface[] = await JSON.parse(responseString);  //Alle holen und ins Firecracker-Interface speichern

        for (let i: number = 0; i < firecrackers.length; i++) {
            if (Number(_div.getAttribute("firecrackerId")) == firecrackers[i].firecrackerId) { //firecrackerId vom HTML mit dem vom Array verglichen
                color1.value = "#" + firecrackers[i].color1;  //Wert der an der Stelle im Array gefunden wird, wird als Farbe in den Colorpickeln gesetzt/Wert aus DAtenbank für das angeklickte InputELement ausgelesen
                color2.value = "#" + firecrackers[i].color2;
                particles.value = firecrackers[i].particles.toString();
                radius.value = firecrackers[i].radius.toString();
            }
        }
        drawExplosion();
    }

    function removeSelected(): void {
        fireCrackerDiv1.classList.remove("selected");
        fireCrackerDiv2.classList.remove("selected");
        fireCrackerDiv3.classList.remove("selected");
    }

    let saveButton: HTMLInputElement = <HTMLInputElement>document.getElementById("save"); //Man kann immer nur das speichern, was gerade selektiert ist
    saveButton.addEventListener("click", hndSave);
    
    async function hndSave(): Promise<void> {

        let firecrackerId: number = 0;
        if (fireCrackerDiv1.classList.contains("selected")) {
            firecrackerId = 1;
        }

        if (fireCrackerDiv2.classList.contains("selected")) {
            firecrackerId = 2;
        }

        if (fireCrackerDiv3.classList.contains("selected")) {
            firecrackerId = 3;
        }

        let url: string = serverURL + "/save?firecrackerId=" + firecrackerId + "&color1=" + color1.value.replace("#", "") + "&color2=" + color2.value.replace("#", "") + "&particles=" + particles.value + "&radius=" + radius.value; 
        await fetch(url); //Client schickt URL an Server und wartet, bis dieser seine Arbeit damit (Daten auslesen-> Datenbank) abgeschlossen und Response geliefert hat
    }

    

    function drawExplosion(): void {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        
        let circleSteps: number = Math.PI * 2 / Number(particles.value); // ganzer Kreis durch Anzahl der Partikel
        for (let i: number = 0; i < Math.PI * 2; i += circleSteps) { // 360Grad; einzelne Steps Gradzahl, Kreis drehen
            drawParticle(i, 2); // i ist der Winkel, 2 Linienstärke
        }
        ctx.restore();
    }

    function drawParticle(_radiusParticle: number, _lineWidth: number): void {
        ctx.setTransform(1, 0, 0, 1, centerX, centerY); //centerX und y Position Mitte; ....... (nix verschoben, drehen..)
        ctx.rotate(_radiusParticle);
        let gradient: CanvasGradient = ctx.createLinearGradient(-_lineWidth / 2, 0, _lineWidth, Number(radius.value)); //-Weite durch2 -> Linie genau mittig auf Linie (wird minimal verschoben), 0 ist y-Wert bleibt auf der Mitte,  _lineWidth=2, Radius
        gradient.addColorStop(0, color1.value);
        gradient.addColorStop(1, color2.value);
        ctx.fillStyle = gradient;
        ctx.fillRect(-_lineWidth / 2, 0, _lineWidth, Number(radius.value)); //Warum nicht stroke?
    }
}