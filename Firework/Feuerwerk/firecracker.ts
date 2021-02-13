namespace Firework {
    export class Firecracker {
        public expendable: boolean = false;  //Ist immer false, bis lifetime abgelaufen ist, dann wird es auf true gesetzt und ist expendable
        public lifetime: number = 4; // Immer minus 20ms bzw. immer 1/50 wird mitgegeben
        public lineWidth: number = 2;

        public x: number;
        public y: number;

        public color1: string;
        public color2: string;
        public radius: number;
        public particles: number;
        
        public innerRadius: number = 0; 
        public outerRadius: number = 0; 

        constructor(_x: number, _y: number, _color1: string, _color2: string, _radius: number, _particles: number) {
            this.x = _x;
            this.y = _y;
            this.color1 = _color1;
            this.color2 = _color2;
            this.radius = _radius;
            this.particles = _particles;
        }

        public draw(_timeslice: number): void {
            this.lifetime -= _timeslice;

            if (this.lifetime < 0) {       //lifetime abgelaufen
                this.expendable = true;
                return;
            }
            crc2.save();                   // Wert wird auf true gesetzt, wenn das nächste Mal update aufgerufen wird, wird gesehen, dass das Objekt das Attribut true hat, also wird es aus dem Array geworfen und die zugehörige draw Fkt nicht mehr aufgerufen
        

            if (this.outerRadius < this.radius) {                          //Ist äußerer Radius kleiner als Gesamtradius (vom Nutzer eingestellt)?
                if ((this.outerRadius + _timeslice * 300) > this.radius)   // Wenn äußerer Radius * 300 größer wäre als Gesamtradius, äußeren RAdius auf Gesamtradius setzen; ansonsten um 300 erhöhen
                    this.outerRadius = this.radius;
                else 
                    this.outerRadius += _timeslice * 300;
            }

            if (this.outerRadius >= this.radius && this.innerRadius < this.radius) {  // Das gleiche für inneren Radius; geht erst los, wenn äußerer Radius den Gesamtradius erreicht hat
                if ((this.innerRadius + _timeslice * 150) > this.radius)
                    this.innerRadius = this.radius;
                else
                    this.innerRadius += _timeslice * 150; 
            }

            if (this.innerRadius > this.outerRadius) {  //Kleinerer Radius darf nicht größer äußerer Radius sein sein
                this.innerRadius = this.radius;
            }

            let circleSteps: number = Math.PI * 2 / this.particles;

            for (let i: number = 0; i < Math.PI * 2; i += circleSteps) {
                this.drawParticle(i);
            }

            crc2.restore();
        }

        private drawParticle(_circleStep: number): void {          //   
            crc2.setTransform(1, 0, 0, 1, this.x, this.y);
            crc2.rotate(_circleStep);
            if (this.outerRadius - this.innerRadius != 0) {
                let gradient: CanvasGradient = crc2.createLinearGradient(-this.lineWidth / 2, 0, this.lineWidth, this.outerRadius); //Immer mitte bis äußerer Radius
                gradient.addColorStop(0, this.color1);
                gradient.addColorStop(1, this.color2);
                crc2.fillStyle = gradient;
            }
            
            crc2.fillRect(-this.lineWidth / 2, this.innerRadius, this.lineWidth, this.outerRadius - this.innerRadius); //Anfangspunkt ist der innere Radius und die Länge ist der äußere minus der innere Radius (this.outerRadius)
        }
    }
}