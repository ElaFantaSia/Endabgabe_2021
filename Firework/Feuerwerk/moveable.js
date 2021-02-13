"use strict";
var Firework;
(function (Firework) {
    class Moveable {
        constructor(_position) {
            this.expendable = false;
            this.lifetime = 4;
            if (_position) {
                this.position = _position.copy();
            }
            else {
                this.position = new Firework.Vector(0, 0);
            }
        }
    }
    Firework.Moveable = Moveable;
})(Firework || (Firework = {}));
//# sourceMappingURL=moveable.js.map