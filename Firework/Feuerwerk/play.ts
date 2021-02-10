namespace Firework {
    export let ctx: CanvasRenderingContext2D;
    let serverURL: string = "https://endabgabe-eia2.herokuapp.com";
    let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    let currentFirecracker: FirecrackerInterface;

    let allFirecrackersToDraw: Firecracker[] = [];
    let allFirecrackers: FirecrackerInterface[] = [];

    let fireCrackerDiv1: HTMLDivElement = <HTMLDivElement>document.getElementById("firecracker1");
    fireCrackerDiv1.addEventListener("click", hndClick);

    let fireCrackerDiv2: HTMLDivElement = <HTMLDivElement>document.getElementById("firecracker2");
    fireCrackerDiv2.addEventListener("click", hndClick);

    let fireCrackerDiv3: HTMLDivElement = <HTMLDivElement>document.getElementById("firecracker3");
    fireCrackerDiv3.addEventListener("click", hndClick);

    window.addEventListener("load", loadWnd);

    async function loadWnd(): Promise<void> {
        ctx = <CanvasRenderingContext2D>canvas.getContext("2d"); 
        canvas.addEventListener("mouseup", hndMouseUp);
        console.log(serverURL + "/getAll");
        let response: Response = await fetch(serverURL + "/getAll");
        let responseString: string =  await response.text();
        
        allFirecrackers = await JSON.parse(responseString);
        setCurrentFirecracker(1);
        fireCrackerDiv1.classList.add("selected");
        window.setInterval(update, 20);
    }

    function update(): void {
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (let firecracker of allFirecrackersToDraw) {
            firecracker.draw(1 / 50);
        }

        for (let i: number = allFirecrackersToDraw.length - 1; i >= 0; i--) {
            if (allFirecrackersToDraw[i].expendable) {
                allFirecrackersToDraw.splice(i, 1);
            }
        }
    }

    function setCurrentFirecracker(_firecrackerId: number): void {
        for (let i: number = 0; i < allFirecrackers.length; i++) {
            if (allFirecrackers[i].firecrackerId == _firecrackerId)
                currentFirecracker = allFirecrackers[i];
        }
    }
    
    function hndClick(_event: Event): void {
        removeColor();
        let div: HTMLDivElement = <HTMLDivElement>_event.currentTarget;
        div.classList.add("selected");
        setCurrentFirecracker(Number(div.getAttribute("firecrackerId")));
    }

    function removeColor(): void {
        fireCrackerDiv1.classList.remove("selected");
        fireCrackerDiv2.classList.remove("selected");
        fireCrackerDiv3.classList.remove("selected");
    }

    function hndMouseUp(_event: MouseEvent): void {
        let bound: DOMRect = canvas.getBoundingClientRect();
        
        let canvasX: number = _event.pageX - bound.left - canvas.clientLeft;
        let canvasY: number = _event.pageY - bound.top - canvas.clientTop;

        let firecracker: Firecracker = new Firecracker(canvasX, canvasY, "#" + currentFirecracker.color1, "#" + currentFirecracker.color2, currentFirecracker.radius, currentFirecracker.particles);
        allFirecrackersToDraw.push(firecracker);
    }

    document.addEventListener("keydown", hndKeyDown);

    function hndKeyDown(_event: KeyboardEvent): void {
        if (_event.key.match("1")) {
            removeColor();
            fireCrackerDiv1.classList.add("selected");
            setCurrentFirecracker(1);
        }   
        else if (_event.key.match("2")) {
            removeColor();
            fireCrackerDiv2.classList.add("selected");
            setCurrentFirecracker(2);
        }
        else if (_event.key.match("3")) {
            removeColor();
            fireCrackerDiv3.classList.add("selected");
            setCurrentFirecracker(3);
        }
        else 
            return;
    }
}