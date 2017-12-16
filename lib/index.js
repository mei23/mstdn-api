"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mastodon_1 = require("./mastodon");
if (typeof window === 'object') {
    window['温泉'] = mastodon_1.default;
    if (!window.Mastodon) {
        window.Mastodon = mastodon_1.default;
    }
}
exports.default = mastodon_1.default;
//# sourceMappingURL=index.js.map