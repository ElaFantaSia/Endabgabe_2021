"use strict";
var Firework;
(function (Firework) {
    class Firecracker {
        constructor(_x, _y, _color1, _color2, _radius, _particles) {
            this.expendable = false; //Warum false?
            this.lifetime = 4;
            this.lineWidth = 2;
            this.radiusTimeSliceValue = 0;
            this.radiusFading = 0;
            this.x = _x;
            this.y = _y;
            this.color1 = _color1;
            this.color2 = _color2;
            this.radius = _radius;
            this.particles = _particles;
        }
        draw(_timeslice) {
            this.lifetime -= _timeslice;
            if (this.lifetime < 0) {
                this.expendable = true;
                return;
            }
            Firework.ctx.save();
            let circleSteps = Math.PI * 2 / this.particles;
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
            for (let i = 0; i < Math.PI * 2; i += circleSteps) {
                this.drawParticle(i);
            }
            Firework.ctx.restore();
        }
        drawParticle(angle) {
            Firework.ctx.setTransform(1, 0, 0, 1, this.x, this.y);
            Firework.ctx.rotate(angle);
            if (this.radiusTimeSliceValue - this.radiusFading != 0) {
                let gradient = Firework.ctx.createLinearGradient(-this.lineWidth / 2, 0, this.lineWidth, this.radiusTimeSliceValue);
                gradient.addColorStop(0, this.color1);
                gradient.addColorStop(1, this.color2);
                Firework.ctx.fillStyle = gradient;
            }
            Firework.ctx.fillRect(-this.lineWidth / 2, this.radiusFading, this.lineWidth, this.radiusTimeSliceValue - this.radiusFading); //Abstand zum linken und oberen Rand, Breite, Höhe
        }
    }
    Firework.Firecracker = Firecracker;
})(Firework || (Firework = {}));
//# sourceMappingURL=firecracker.js.map