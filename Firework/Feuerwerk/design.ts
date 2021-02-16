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
    let crc2: CanvasRenderingContext2D = <CanvasRenderingContext2D>canvas.getContext("2d");

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    let centerX: number = canvas.width / 2;
    let centerY: number = canvas.height / 2;

    let serverURL: string = "https://endabgabe-eia2.herokuapp.com";

    let colorPicker1: HTMLInputElement = <HTMLInputElement>document.getElementById("colorpicker1");
    let colorPicker2: HTMLInputElement = <HTMLInputElement>document.getElementById("colorpicker2");
    let sliderRadius: HTMLInputElement = <HTMLInputElement>document.getElementById("radius");
    let sliderParticles: HTMLInputElement = <HTMLInputElement>document.getElementById("particles");
    let fireCrackerDiv1: HTMLDivElement = <HTMLDivElement>document.getElementById("firecracker1");
    let fireCrackerDiv2: HTMLDivElement = <HTMLDivElement>document.getElementById("firecracker2");
    let fireCrackerDiv3: HTMLDivElement = <HTMLDivElement>document.getElementById("firecracker3");
    let saveButton: HTMLInputElement = <HTMLInputElement>document.getElementById("save");

    window.addEventListener("load", hndLoad);

    function hndLoad(): void {
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

    function hndClick(_event: Event): void {
        let div: HTMLDivElement = <HTMLDivElement>_event.currentTarget;
        chooseFirecracker(div);
    }

    async function chooseFirecracker(_div: HTMLDivElement): Promise<void> {
        removeSelected();
        _div.classList.add("selected");
        let response: Response = await fetch(serverURL + "/getAll");
        let responseString: string =  await response.text();
        let firecrackers: FirecrackerInterface[] = await JSON.parse(responseString);  

        for (let i: number = 0; i < firecrackers.length; i++) {
            if (Number(_div.getAttribute("firecrackerId")) == firecrackers[i].firecrackerId) { 
                colorPicker1.value = "#" + firecrackers[i].color1;  
                colorPicker2.value = "#" + firecrackers[i].color2;
                sliderParticles.value = firecrackers[i].particles.toString();
                sliderRadius.value = firecrackers[i].radius.toString();
            }
        }
        drawExplosion();
    }


    function removeSelected(): void {
        fireCrackerDiv1.classList.remove("selected");
        fireCrackerDiv2.classList.remove("selected");
        fireCrackerDiv3.classList.remove("selected");
    }

    
    function drawExplosion(): void {
        crc2.clearRect(0, 0, canvas.width, canvas.height);
        crc2.save();
        
        let circleSteps: number = Math.PI * 2 / Number(sliderParticles.value); 
        for (let i: number = 0; i < Math.PI * 2; i += circleSteps) { 
            drawParticle(i, 2); 
        }
        crc2.restore();
    }

    function drawParticle(_radiusParticle: number, _lineWidth: number): void {
        crc2.setTransform(1, 0, 0, 1, centerX, centerY); 
        crc2.rotate(_radiusParticle);
        let gradient: CanvasGradient = crc2.createLinearGradient(-_lineWidth / 2, 0, _lineWidth, Number(sliderRadius.value)); 
        gradient.addColorStop(0, colorPicker1.value);
        gradient.addColorStop(1, colorPicker2.value);
        crc2.fillStyle = gradient;
        crc2.fillRect(-_lineWidth / 2, 0, _lineWidth, Number(sliderRadius.value)); 
    }


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

        let url: string = serverURL + "/save?firecrackerId=" + firecrackerId + "&color1=" + colorPicker1.value.replace("#", "") + "&color2=" + colorPicker2.value.replace("#", "") + "&particles=" + sliderParticles.value + "&radius=" + sliderRadius.value; 
        await fetch(url); 

        playSound("./Sounds/G.mp3");
    }


    function playSound(_soundURL: string): void {
        let audio: HTMLAudioElement = document.createElement("audio");
        audio.style.display = "none";
        audio.src = _soundURL;
        audio.autoplay = true;
        audio.onended = function (): void {
            audio.remove(); 
        };
    }

}