namespace Firework {
    export class Firecracker extends Moveable {
       
        public lineWidth: number = 2;

        public color1: string;
        public color2: string;
        public radius: number;
        public particles: number;
        
        public innerRadius: number = 0; 
        public outerRadius: number = 0; 

        constructor(_x: number, _y: number, _color1: string, _color2: string, _radius: number, _particles: number) {
            super(new Vector (_x, _y));
            this.color1 = _color1;
            this.color2 = _color2;
            this.radius = _radius;
            this.particles = _particles;
        }

        public draw(_timeslice: number): void {
            this.lifetime -= _timeslice;

            if (this.lifetime < 0) {       
                this.expendable = true;
                return;
            }
            crc2.save();                   
        
            
            if (this.outerRadius < this.radius) {                          
                if ((this.outerRadius + _timeslice * 300) > this.radius)   
                    this.outerRadius = this.radius;
                else 
                    this.outerRadius += _timeslice * 300;
            }

            if (this.outerRadius >= this.radius && this.innerRadius < this.radius) {  
                if ((this.innerRadius + _timeslice * 150) > this.radius)
                    this.innerRadius = this.radius;
                else
                    this.innerRadius += _timeslice * 150; 
            }

            if (this.innerRadius > this.outerRadius) { 
                this.innerRadius = this.radius;
            }

            let circleSteps: number = Math.PI * 2 / this.particles;

            for (let i: number = 0; i < Math.PI * 2; i += circleSteps) {
                this.drawParticle(i);
            }

            crc2.restore();
        }

        private drawParticle(_circleStep: number): void {          //   
            crc2.setTransform(1, 0, 0, 1, this.position.x, this.position.y);
            crc2.rotate(_circleStep);
            if (this.outerRadius - this.innerRadius != 0) {
                let gradient: CanvasGradient = crc2.createLinearGradient(-this.lineWidth / 2, 0, this.lineWidth, this.outerRadius);                 gradient.addColorStop(0, this.color1);
                gradient.addColorStop(1, this.color2);
                crc2.fillStyle = gradient;
            }
            
            crc2.fillRect(-this.lineWidth / 2, this.innerRadius, this.lineWidth, this.outerRadius - this.innerRadius); 
            }
    }
}