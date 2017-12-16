"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Scope;
(function (Scope) {
    Scope.READ = 'read';
    Scope.WRITE = 'write';
    Scope.FOLLOW = 'follow';
    Scope.DEFAULT = [Scope.READ, Scope.WRITE, Scope.FOLLOW];
    function from(x) {
        var result = null;
        try {
            for (var _a = __values([Scope.READ, Scope.WRITE, Scope.FOLLOW]), _b = _a.next(); !_b.done; _b = _a.next()) {
                var scope = _b.value;
                if (x === scope) {
                    result = scope;
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
        var e_1, _c;
    }
    Scope.from = from;
    function parse(str) {
        var arr = str.split(' ').map(from).filter(function (x) { return x; });
        return arr;
    }
    Scope.parse = parse;
})(Scope || (Scope = {}));
exports.default = Scope;
//# sourceMappingURL=scope.js.map