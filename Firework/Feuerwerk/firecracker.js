"use strict";
var Firework;
(function (Firework) {
    class Firecracker {
        constructor(_x, _y, _color1, _color2, _radius, _particles) {
            this.expendable = false; //Ist immer false, bis lifetime abgelaufen ist, dann wird es auf true gesetzt und ist expendable
            this.lifetime = 4; // Immer minus 20ms bzw. immer 1/50 wird mitgegeben
            this.lineWidth = 2;
            this.radiusTimeSliceValue = 0; //...........EVl umbenennen  radius2  -  outerRadius
            this.radiusFading = 0; //radius1 (innen) innerRadius,
            this.x = _x;
            this.y = _y;
            this.color1 = _color1;
            this.color2 = _color2;
            this.radius = _radius;
            this.particles = _particles;
        }
        draw(_timeslice) {
            this.lifetime -= _timeslice;
            if (this.lifetime < 0) { //lifetime abgelaufen
                this.expendable = true;
                return;
            }
            Firework.ctx.save(); // Wert wird auf true gesetzt, wenn das nächste Mal update aufgerufen wird, wird gesehen, dass das Objekt das Attribut true hat, also wird es aus dem Array geworfen und die zugehörige draw Fkt nicht mehr aufgerufen
            if (this.radiusTimeSliceValue < this.radius) { //Ist äußerer Radius kleiner als Gesamtradius (vom Nutzer eingestellt)?
                if ((this.radiusTimeSliceValue + _timeslice * 300) > this.radius) // Wenn äußerer Radius * 300 größer wäre als Gesamtradius, äußeren RAdius auf Gesamtradius setzen; ansonsten um 300 erhöhen
                    this.radiusTimeSliceValue = this.radius;
                else
                    this.radiusTimeSliceValue += _timeslice * 300;
            }
            if (this.radiusTimeSliceValue >= this.radius && this.radiusFading < this.radius) { // Das gleiche für inneren Radius; geht erst los, wenn äußerer Radius den Gesamtradius erreicht hat
                if ((this.radiusFading + _timeslice * 150) > this.radius)
                    this.radiusFading = this.radius;
                else
                    this.radiusFading += _timeslice * 150;
            }
            if (this.radiusFading > this.radiusTimeSliceValue) { //Kleinerer Radius darf nicht größer äußerer Radius sein sein
                this.radiusFading = this.radius;
            }
            let circleSteps = Math.PI * 2 / this.particles;
            for (let i = 0; i < Math.PI * 2; i += circleSteps) {
                this.drawParticle(i);
            }
            Firework.ctx.restore();
        }
        drawParticle(angle) {
            Firework.ctx.setTransform(1, 0, 0, 1, this.x, this.y);
            Firework.ctx.rotate(angle);
            if (this.radiusTimeSliceValue - this.radiusFading != 0) {
                let gradient = Firework.ctx.createLinearGradient(-this.lineWidth / 2, 0, this.lineWidth, this.radiusTimeSliceValue); //Immer mitte bis äußerer Radius
                gradient.addColorStop(0, this.color1);
                gradient.addColorStop(1, this.color2);
                Firework.ctx.fillStyle = gradient;
            }
            Firework.ctx.fillRect(-this.lineWidth / 2, this.radiusFading, this.lineWidth, this.radiusTimeSliceValue - this.radiusFading); //Anfangspunkt ist der innere Radius und die Länge ist der äußere minus der innere Radius (this.radiusTimeSliceValue)
        }
    }
    Firework.Firecracker = Firecracker;
})(Firework || (Firework = {}));
//# sourceMappingURL=firecracker.js.map