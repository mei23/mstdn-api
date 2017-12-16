"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = require("url");
var querystring_1 = require("querystring");
var utils_1 = require("./utils");
var scope_1 = require("./scope");
var OAuth;
(function (OAuth) {
    var AppData = (function () {
        function AppData(id, name, website, redirect_uri, client_id, client_secret) {
            this.id = id;
            this.name = name;
            this.website = website;
            this.redirect_uri = redirect_uri;
            this.client_id = client_id;
            this.client_secret = client_secret;
        }
        AppData.from = function (raw) {
            return new this(raw.id, raw.name, raw.website, raw.redirect_uri, raw.client_id, raw.client_secret);
        };
        Object.defineProperty(AppData.prototype, "redirectUri", {
            get: function () {
                return this.redirect_uri;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppData.prototype, "clientId", {
            get: function () {
                return this.client_id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppData.prototype, "clientSecret", {
            get: function () {
                return this.client_secret;
            },
            enumerable: true,
            configurable: true
        });
        AppData.prototype.generateUrl = function (scope, baseUrl) {
            if (scope === void 0) { scope = scope_1.default.DEFAULT; }
            if (baseUrl === void 0) { baseUrl = 'mstdn.jp'; }
            var apiUrl = url_1.resolve(utils_1.normalizeBaseUrl(baseUrl), '/oauth/authorize');
            var query = {
                client_id: this.client_id,
                redirect_uri: this.redirect_uri,
                scope: scope.join(' '),
                response_type: 'code'
            };
            this.url = apiUrl + "?" + querystring_1.stringify(query);
        };
        return AppData;
    }());
    OAuth.AppData = AppData;
    var TokenData = (function () {
        function TokenData(access_token, token_type, scope, created_at) {
            this.access_token = access_token;
            this.token_type = token_type;
            this.created_at = created_at;
            this._scope = scope;
        }
        TokenData.from = function (raw) {
            return new this(raw.access_token, raw.token_type, raw.scope, raw.created_at);
        };
        Object.defineProperty(TokenData.prototype, "accessToken", {
            get: function () {
                return this.access_token;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TokenData.prototype, "tokenType", {
            get: function () {
                return this.token_type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TokenData.prototype, "scope", {
            get: function () {
                return scope_1.default.parse(this._scope);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TokenData.prototype, "createdAt", {
            get: function () {
                return this.created_at;
            },
            enumerable: true,
            configurable: true
        });
        return TokenData;
    }());
    OAuth.TokenData = TokenData;
})(OAuth || (OAuth = {}));
exports.default = OAuth;
//# sourceMappingURL=oauth.js.map