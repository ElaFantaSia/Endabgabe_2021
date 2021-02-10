namespace Firework {
    export class Firecracker {
        public expendable: boolean = false;  //Warum false?
        public lifetime: number = 4;
        public lineWidth: number = 2;

        public x: number;
        public y: number;

        public color1: string;
        public color2: string;
        public radius: number;
        public particles: number;
        
        public radiusTimeSliceValue: number = 0;
        public radiusFading: number = 0;

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

            if (this.lifetime < 0) {
                this.expendable = true;
                return;
            }
            ctx.save();
        
            let circleSteps: number = Math.PI * 2 / this.particles;

            if (this.radiusTimeSliceValue < this.radius) {
                if ((this.radiusTimeSliceValue + _timeslice * 300) > this.radius)
                    this.radiusTimeSliceValue = this.radius;
                else 
                    this.radiusTimeSliceValue += _timeslice * 300;
            }

            if (this.radiusTimeSliceValue >= this.radius && this.radiusFading < this.radius) {
                if ((this.radiusFading + _timeslice * 150) > this.radius)
                    this.radiusFading = this.radius;
                else
                    this.radiusFading += _timeslice * 150;
            }

            if (this.radiusFading > this.radiusTimeSliceValue) {
                this.radiusFading = this.radius;
            }

            for (let i: number = 0; i < Math.PI * 2; i += circleSteps) {
                this.drawParticle(i);
            }

            ctx.restore();
        }

        private drawParticle(angle: number): void {
            ctx.setTransform(1, 0, 0, 1, this.x, this.y);
            ctx.rotate(angle);
            if (this.radiusTimeSliceValue - this.radiusFading != 0) {
                let gradient: CanvasGradient = ctx.createLinearGradient(-this.lineWidth / 2, 0, this.lineWidth, this.radiusTimeSliceValue);
                gradient.addColorStop(0, this.color1);
                gradient.addColorStop(1, this.color2);
                ctx.fillStyle = gradient;
            }
            
            ctx.fillRect(-this.lineWidth / 2, this.radiusFading, this.lineWidth, this.radiusTimeSliceValue - this.radiusFading); //Abstand zum linken und oberen Rand, Breite, Höhe
        }
    }
}