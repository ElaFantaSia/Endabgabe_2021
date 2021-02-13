"use strict";
var Firework;
(function (Firework) {
    class Vector {
        constructor(_x, _y) {
            this.set(_x, _y);
        }
        set(_x, _y) {
            this.x = _x;
            this.y = _y;
        }
        copy() {
            return new Vector(this.x, this.y);
        }
    }
    Firework.Vector = Vector;
})(Firework || (Firework = {}));
//# sourceMappingURL=vector.js.map