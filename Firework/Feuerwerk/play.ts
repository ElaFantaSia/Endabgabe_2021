namespace Firework {
    export let crc2: CanvasRenderingContext2D;
    let serverURL: string = "https://endabgabe-eia2.herokuapp.com";
    let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    crc2 = <CanvasRenderingContext2D>canvas.getContext("2d"); 
    canvas.addEventListener("mouseup", hndMouseUp);

    let currentFirecracker: FirecrackerInterface;

    let allFirecrackersToDraw: Moveable[] = [];
    let allFirecrackers: FirecrackerInterface[] = [];

    let fireCrackerDiv1: HTMLDivElement = <HTMLDivElement>document.getElementById("firecracker1");
    fireCrackerDiv1.addEventListener("click", hndClick);

    let fireCrackerDiv2: HTMLDivElement = <HTMLDivElement>document.getElementById("firecracker2");
    fireCrackerDiv2.addEventListener("click", hndClick);

    let fireCrackerDiv3: HTMLDivElement = <HTMLDivElement>document.getElementById("firecracker3");
    fireCrackerDiv3.addEventListener("click", hndClick);

    window.addEventListener("load", hndLoad);

    async function hndLoad(): Promise<void> {
        let response: Response = await fetch(serverURL + "/getAll");
        let responseString: string =  await response.text();
        allFirecrackers = await JSON.parse(responseString);

        setCurrentFirecracker(1);
        fireCrackerDiv1.classList.add("selected");
        window.setInterval(update, 20); //Alle 20ms wird update aufgerufen
    }



    function update(): void {
        crc2.fillRect(0, 0, crc2.canvas.width, crc2.canvas.height); //

        for (let firecracker of allFirecrackersToDraw) {    //Das Array allFirecrackersToDraw ist generell leer, bei jedem Klick wird Rakete erzeugt und darin gespeichert und Timeintervall mitgegeben und alle 20ms wird die Zeichenfunktion draw der Rakete neu aufgerufen, bis sie expendable ist
            firecracker.draw(1 / 50);
        }

        for (let i: number = allFirecrackersToDraw.length - 1; i >= 0; i--) { //Wenn Lifetime überschritten bekommt Rakete Attribut expendable und wird beim nächsten Update aus dem Array entfernt
            if (allFirecrackersToDraw[i].expendable) {
                allFirecrackersToDraw.splice(i, 1);
            }
        }
    }
    

    function hndMouseUp(_event: MouseEvent): void {
        let bound: DOMRect = canvas.getBoundingClientRect();                //DIe drei Zeilen um richtige Mausposition auf Canvas zu finden
        
        let canvasX: number = _event.pageX - bound.left - canvas.clientLeft;
        let canvasY: number = _event.pageY - bound.top - canvas.clientTop;

        let firecracker: Firecracker = new Firecracker(canvasX, canvasY, "#" + currentFirecracker.color1, "#" + currentFirecracker.color2, currentFirecracker.radius, currentFirecracker.particles);
        allFirecrackersToDraw.push(firecracker);
        playSound("./Sounds/1_firework_explosion.mp3");
    }



    function setCurrentFirecracker(_firecrackerId: number): void {  //Ausgewählter Firecracker wird als Parameter mitgegeben, dann wird das Array nach dieser id durchsucht und der Firecracker an der Stelle, wo es mit der id übereinstimmt, wird als CurrentFirecracker gespeichert
        for (let i: number = 0; i < allFirecrackers.length; i++) {
            if (allFirecrackers[i].firecrackerId == _firecrackerId)
                currentFirecracker = allFirecrackers[i];
        }
    }

    document.addEventListener("keydown", hndKeyDown);

    function hndKeyDown(_event: KeyboardEvent): void {
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

    function hndClick(_event: Event): void {
        removeSelected();                                                  //Alle werden entselektiert (damit nicht mehrere ausgewählt sind)
        let div: HTMLDivElement = <HTMLDivElement>_event.currentTarget;    //Das div das angeklickt wurde wird ausgewählt und als CurrentFirecracker gespeichert
        div.classList.add("selected");
        setCurrentFirecracker(Number(div.getAttribute("firecrackerId")));
    }

    function removeSelected(): void {
        fireCrackerDiv1.classList.remove("selected");
        fireCrackerDiv2.classList.remove("selected");
        fireCrackerDiv3.classList.remove("selected");
    }

    function playSound(_soundURL: string): void {
        let audio: HTMLAudioElement = document.createElement("audio");
        audio.style.display = "none";
        audio.src = _soundURL;
        audio.autoplay = true;
        audio.onended = function (): void {
            audio.remove(); //Remove when played.
        };
        document.body.appendChild(audio);
    }
}