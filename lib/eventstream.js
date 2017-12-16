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
Object.defineProperty(exports, "__esModule", { value: true });
var stream_1 = require("stream");
var EventStream = (function (_super) {
    __extends(EventStream, _super);
    function EventStream() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.buf = '';
        _this.newLine = false;
        _this.data = '';
        _this.eventName = '';
        return _this;
    }
    EventStream.prototype._write = function (chunk, _encoding, next) {
        this.buf += chunk;
        var position = 0;
        var size = this.buf.length;
        while (position < size) {
            if (this.newLine) {
                this.newLine = false;
                if (this.buf[position] === '\n')
                    position++;
            }
            var lineLength = -1;
            var fieldLength = -1;
            for (var i = position; i < size; ++i) {
                if (lineLength !== -1)
                    break;
                switch (this.buf[i]) {
                    case ':':
                        if (fieldLength === -1)
                            fieldLength = i - position;
                        break;
                    case '\n':
                        lineLength = i - position;
                        break;
                }
            }
            if (lineLength === -1)
                break;
            this.parseEventStreamLine(position, fieldLength, lineLength);
            position += lineLength + 1;
        }
        if (position === size)
            this.buf = '';
        else if (position)
            this.buf = this.buf.slice(position);
        next();
    };
    EventStream.prototype.parseEventStreamLine = function (position, fieldLength, lineLength) {
        if (lineLength === 0) {
            if (this.data.length > 0) {
                var data = void 0;
                try {
                    data = JSON.parse(this.data.slice(0, -1));
                }
                catch (err) {
                    data = { err: err };
                }
                this.emit(this.eventName, data);
                this.data = '';
            }
            this.eventName = '';
            return;
        }
        if (fieldLength === 0)
            return;
        var step = 0;
        var field = this.buf.slice(position, position + (fieldLength === -1 ? lineLength : fieldLength));
        if (fieldLength === -1) {
            step = lineLength;
        }
        else if (this.buf[position + fieldLength + 1] !== ' ') {
            step = fieldLength + 1;
        }
        else {
            step = fieldLength + 2;
        }
        position += step;
        var valueLength = lineLength - step;
        var value = this.buf.slice(position, position + valueLength);
        switch (field) {
            case 'data':
                this.data += value + '\n';
                break;
            case 'event':
                this.eventName = value;
                break;
        }
    };
    return EventStream;
}(stream_1.Writable));
exports.default = EventStream;
//# sourceMappingURL=eventstream.js.map