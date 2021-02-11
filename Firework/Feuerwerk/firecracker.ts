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
        
        public radiusTimeSliceValue: number = 0; //...........EVl umbenennen  radius2  -  outerRadius
        public radiusFading: number = 0;         //radius1 (innen) innerRadius,

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
            ctx.save();                   // Wert wird auf true gesetzt, wenn das nächste Mal update aufgerufen wird, wird gesehen, dass das Objekt das Attribut true hat, also wird es aus dem Array geworfen und die zugehörige draw Fkt nicht mehr aufgerufen
        

            if (this.radiusTimeSliceValue < this.radius) {                          //Ist äußerer Radius kleiner als Gesamtradius (vom Nutzer eingestellt)?
                if ((this.radiusTimeSliceValue + _timeslice * 300) > this.radius)   // Wenn äußerer Radius * 300 größer wäre als Gesamtradius, äußeren RAdius auf Gesamtradius setzen; ansonsten um 300 erhöhen
                    this.radiusTimeSliceValue = this.radius;
                else 
                    this.radiusTimeSliceValue += _timeslice * 300;
            }

            if (this.radiusTimeSliceValue >= this.radius && this.radiusFading < this.radius) {  // Das gleiche für inneren Radius; geht erst los, wenn äußerer Radius den Gesamtradius erreicht hat
                if ((this.radiusFading + _timeslice * 150) > this.radius)
                    this.radiusFading = this.radius;
                else
                    this.radiusFading += _timeslice * 150; 
            }

            if (this.radiusFading > this.radiusTimeSliceValue) {  //Kleinerer Radius darf nicht größer äußerer Radius sein sein
                this.radiusFading = this.radius;
            }

            let circleSteps: number = Math.PI * 2 / this.particles;

            for (let i: number = 0; i < Math.PI * 2; i += circleSteps) {
                this.drawParticle(i);
            }

            ctx.restore();
        }

        private drawParticle(angle: number): void {        
            ctx.setTransform(1, 0, 0, 1, this.x, this.y);
            ctx.rotate(angle);
            if (this.radiusTimeSliceValue - this.radiusFading != 0) {
                let gradient: CanvasGradient = ctx.createLinearGradient(-this.lineWidth / 2, 0, this.lineWidth, this.radiusTimeSliceValue); //Immer mitte bis äußerer Radius
                gradient.addColorStop(0, this.color1);
                gradient.addColorStop(1, this.color2);
                ctx.fillStyle = gradient;
            }
            
            ctx.fillRect(-this.lineWidth / 2, this.radiusFading, this.lineWidth, this.radiusTimeSliceValue - this.radiusFading); //Anfangspunkt ist der innere Radius und die Länge ist der äußere minus der innere Radius (this.radiusTimeSliceValue)
        }
    }
}