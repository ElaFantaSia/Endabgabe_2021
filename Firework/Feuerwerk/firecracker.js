"use strict";
var Firework;
(function (Firework) {
    class Firecracker extends Firework.Moveable {
        constructor(_x, _y, _color1, _color2, _radius, _particles) {
            super(new Firework.Vector(_x, _y));
            this.lineWidth = 2;
            this.innerRadius = 0;
            this.outerRadius = 0;
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
            Firework.crc2.save(); // Wert wird auf true gesetzt, wenn das nächste Mal update aufgerufen wird, wird gesehen, dass das Objekt das Attribut true hat, also wird es aus dem Array geworfen und die zugehörige draw Fkt nicht mehr aufgerufen
            if (this.outerRadius < this.radius) { //Ist äußerer Radius kleiner als Gesamtradius (vom Nutzer eingestellt)?
                if ((this.outerRadius + _timeslice * 300) > this.radius) // Wenn äußerer Radius * 300 größer wäre als Gesamtradius, äußeren RAdius auf Gesamtradius setzen; ansonsten um 300 erhöhen
                    this.outerRadius = this.radius;
                else
                    this.outerRadius += _timeslice * 300;
            }
            if (this.outerRadius >= this.radius && this.innerRadius < this.radius) { // Das gleiche für inneren Radius; geht erst los, wenn äußerer Radius den Gesamtradius erreicht hat
                if ((this.innerRadius + _timeslice * 150) > this.radius)
                    this.innerRadius = this.radius;
                else
                    this.innerRadius += _timeslice * 150;
            }
            if (this.innerRadius > this.outerRadius) { //Kleinerer Radius darf nicht größer äußerer Radius sein sein
                this.innerRadius = this.radius;
            }
            let circleSteps = Math.PI * 2 / this.particles;
            for (let i = 0; i < Math.PI * 2; i += circleSteps) {
                this.drawParticle(i);
            }
            Firework.crc2.restore();
        }
        drawParticle(_circleStep) {
            Firework.crc2.setTransform(1, 0, 0, 1, this.position.x, this.position.y);
            Firework.crc2.rotate(_circleStep);
            if (this.outerRadius - this.innerRadius != 0) {
                let gradient = Firework.crc2.createLinearGradient(-this.lineWidth / 2, 0, this.lineWidth, this.outerRadius); //Immer mitte bis äußerer Radius
                gradient.addColorStop(0, this.color1);
                gradient.addColorStop(1, this.color2);
                Firework.crc2.fillStyle = gradient;
            }
            Firework.crc2.fillRect(-this.lineWidth / 2, this.innerRadius, this.lineWidth, this.outerRadius - this.innerRadius); //Anfangspunkt ist der innere Radius und die Länge ist der äußere minus der innere Radius (this.outerRadius)
        }
    }
    Firework.Firecracker = Firecracker;
})(Firework || (Firework = {}));
//# sourceMappingURL=firecracker.js.map