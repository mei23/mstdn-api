"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var https = require("https");
var url_1 = require("url");
var EventEmitter = require("events");
var eventstream_1 = require("./eventstream");
var utils_1 = require("./utils");
var StreamListener = (function (_super) {
    __extends(StreamListener, _super);
    function StreamListener(url, headers, reconnectInterval) {
        var _this = _super.call(this) || this;
        _this.readyState = 0;
        _this.reconnectInterval = 1000;
        _this.reconnectIntervalOrg = 1000;
        if (reconnectInterval)
            _this.reconnectInterval = reconnectInterval;
        _this.reconnectIntervalOrg = _this.reconnectInterval;
        var parsedUrl = url_1.parse(url);
        _this.httpsOptions = {
            headers: headers,
            path: parsedUrl.path,
            host: parsedUrl.host
        };
        var eventStream = new eventstream_1.default();
        var _loop_1 = function (eventName) {
            eventStream.on(eventName, function (data) {
                _this.emit(eventName, data);
            });
        };
        try {
            for (var _a = __values(['update', 'notification', 'delete']), _b = _a.next(); !_b.done; _b = _a.next()) {
                var eventName = _b.value;
                _loop_1(eventName);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        _this.eventStream = eventStream;
        _this._connect();
        return _this;
        var e_1, _c;
    }
    StreamListener.prototype.close = function () {
        if (this.readyState === 2)
            return;
        this.readyState = 2;
        if (this.req)
            this.req.abort();
    };
    StreamListener.prototype._connect = function () {
        var _this = this;
        var req = https.request(this.httpsOptions, function (res) {
            var includesStatusCode = utils_1.includes(res.statusCode);
            if (includesStatusCode([500, 502, 503, 504])) {
                _this.emit('error', { status: res.statusCode });
                _this._onClosed();
                return;
            }
            if (res.statusCode !== 200) {
                _this.emit('error', { status: res.statusCode });
                _this.close();
                return;
            }
            _this.readyState = 1;
            _this.reconnectInterval = _this.reconnectIntervalOrg;
            res.on('close', function () {
                res.removeAllListeners('close');
                res.removeAllListeners('end');
                _this._onClosed();
            });
            res.on('end', function () {
                res.removeAllListeners('close');
                res.removeAllListeners('end');
                _this._onClosed();
            });
            _this.emit('open');
            res.pipe(_this.eventStream);
        });
        req.on('error', function () { return _this._onClosed(); });
        req.setNoDelay(true);
        req.end();
        this.req = req;
    };
    StreamListener.prototype._onClosed = function () {
        var _this = this;
        if (this.readyState === 2)
            return;
        this.readyState = 0;
        if (!this.reconnectInterval)
            return;
        setTimeout(function () {
            if (_this.readyState !== 0)
                return;
            _this._connect();
        }, this.reconnectInterval);
        this.reconnectInterval += 1000;
    };
    return StreamListener;
}(EventEmitter));
exports.default = StreamListener;
//# sourceMappingURL=streamlistener.js.map