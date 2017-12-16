"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = require("url");
var querystring_1 = require("querystring");
var superagent = require("superagent");
var utils_1 = require("./utils");
var streamlistener_1 = require("./streamlistener");
var scope_1 = require("./scope");
var oauth_1 = require("./oauth");
var NO_REDIRECT = 'urn:ietf:wg:oauth:2.0:oob';
var Mastodon = (function () {
    function Mastodon(accessToken, baseUrl) {
        if (baseUrl === void 0) { baseUrl = 'mstdn.jp'; }
        this.accessToken = accessToken;
        this.baseUrl = utils_1.normalizeBaseUrl(baseUrl || 'mstdn.jp');
        this.apiUrl = url_1.resolve(this.baseUrl, '/api/v1/');
        this.streamingApiUrl = url_1.resolve(this.baseUrl, '/api/v1/streaming/');
    }
    Mastodon.get = function (path, params, baseUrl) {
        if (params === void 0) { params = {}; }
        if (baseUrl === void 0) { baseUrl = 'mstdn.jp'; }
        var apiUrl = url_1.resolve(utils_1.normalizeBaseUrl(baseUrl), '/api/v1/');
        return superagent
            .get(url_1.resolve(apiUrl, path))
            .query(params)
            .then(function (resp) { return resp.body; });
    };
    Mastodon.registerApp = function (client_name, options, baseUrl) {
        if (options === void 0) { options = {
            scopes: scope_1.default.DEFAULT,
            redirect_uris: NO_REDIRECT
        }; }
        if (baseUrl === void 0) { baseUrl = 'mstdn.jp'; }
        var scopes = options.scopes;
        return this.createApp(client_name, options, baseUrl)
            .then(function (appData) {
            appData.generateUrl(scopes, baseUrl);
            return appData;
        });
    };
    Mastodon.fetchAccessToken = function (client_id, client_secret, code, redirect_uri, baseUrl) {
        if (redirect_uri === void 0) { redirect_uri = NO_REDIRECT; }
        if (baseUrl === void 0) { baseUrl = 'mstdn.jp'; }
        return this._post('/oauth/token', {
            client_id: client_id,
            client_secret: client_secret,
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        }, baseUrl).then(function (data) { return oauth_1.default.TokenData.from(data); });
    };
    Mastodon.generateAuthUrl = function (client_id, options, baseUrl) {
        if (options === void 0) { options = {
            redirect_uri: NO_REDIRECT,
            scope: scope_1.default.DEFAULT
        }; }
        if (baseUrl === void 0) { baseUrl = 'mstdn.jp'; }
        var apiUrl = url_1.resolve(utils_1.normalizeBaseUrl(baseUrl), '/oauth/authorize');
        var redirect_uri = options.redirect_uri || NO_REDIRECT;
        var scope = options.scope || scope_1.default.DEFAULT;
        var query = {
            client_id: client_id,
            redirect_uri: redirect_uri,
            scope: scope.join(' '),
            response_type: 'code'
        };
        return apiUrl + "?" + querystring_1.stringify(query);
    };
    Mastodon.createApp = function (client_name, options, baseUrl) {
        if (options === void 0) { options = {
            redirect_uris: NO_REDIRECT,
            scopes: scope_1.default.DEFAULT
        }; }
        if (baseUrl === void 0) { baseUrl = 'mstdn.jp'; }
        var redirect_uris = options.redirect_uris || NO_REDIRECT;
        var scopes = options.scopes || scope_1.default.DEFAULT;
        var params = {
            client_name: client_name,
            redirect_uris: redirect_uris,
            scopes: scopes.join(' ')
        };
        if (options.website)
            params.website = options.website;
        return this._post('apps', params, baseUrl)
            .then(function (data) { return oauth_1.default.AppData.from(data); });
    };
    Mastodon._post = function (path, params, baseUrl) {
        if (params === void 0) { params = {}; }
        if (baseUrl === void 0) { baseUrl = 'mstdn.jp'; }
        var apiUrl = url_1.resolve(utils_1.normalizeBaseUrl(baseUrl), '/api/v1/');
        return superagent
            .post(url_1.resolve(apiUrl, path))
            .send(params)
            .then(function (resp) { return resp.body; });
    };
    Mastodon.prototype.get = function (path, params) {
        if (params === void 0) { params = {}; }
        return superagent
            .get(url_1.resolve(this.apiUrl, path))
            .set('Authorization', "Bearer " + this.accessToken)
            .query(params)
            .then(function (resp) { return resp.body; });
    };
    Mastodon.prototype.patch = function (path, params) {
        if (params === void 0) { params = {}; }
        return superagent
            .patch(url_1.resolve(this.apiUrl, path))
            .set('Authorization', "Bearer " + this.accessToken)
            .send(params)
            .then(function (resp) { return resp.body; });
    };
    Mastodon.prototype.post = function (path, params) {
        if (params === void 0) { params = {}; }
        return superagent
            .post(url_1.resolve(this.apiUrl, path))
            .set('Authorization', "Bearer " + this.accessToken)
            .send(params)
            .then(function (resp) { return resp.body; });
    };
    Mastodon.prototype.del = function (path) {
        return superagent
            .del(url_1.resolve(this.apiUrl, path))
            .set('Authorization', "Bearer " + this.accessToken)
            .then(function (resp) { return resp.body; });
    };
    Mastodon.prototype.stream = function (path, reconnectInterval) {
        if (reconnectInterval === void 0) { reconnectInterval = 1000; }
        var headers = this.accessToken ? {
            'Cache-Control': 'no-cache',
            'Accept': 'text/event-stream',
            'Authorization': "Bearer " + this.accessToken
        } : {
            'Cache-Control': 'no-cache',
            'Accept': 'text/event-stream',
        };
        var url = url_1.resolve(this.streamingApiUrl, path);
        return new streamlistener_1.default(url, headers, reconnectInterval);
    };
    Mastodon.Scope = scope_1.default;
    Mastodon.NO_REDIRECT = NO_REDIRECT;
    return Mastodon;
}());
exports.default = Mastodon;
//# sourceMappingURL=mastodon.js.map