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
function normalizeBaseUrl(hostname) {
    if (/^http/.test(hostname)) {
        return hostname;
    }
    return "https://" + hostname;
}
exports.normalizeBaseUrl = normalizeBaseUrl;
function includes(wanted) {
    return function (sequence) {
        var result = false;
        try {
            for (var sequence_1 = __values(sequence), sequence_1_1 = sequence_1.next(); !sequence_1_1.done; sequence_1_1 = sequence_1.next()) {
                var element = sequence_1_1.value;
                if (element === wanted) {
                    result = true;
                    break;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (sequence_1_1 && !sequence_1_1.done && (_a = sequence_1.return)) _a.call(sequence_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
        var e_1, _a;
    };
}
exports.includes = includes;
//# sourceMappingURL=utils.js.map