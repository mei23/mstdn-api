/// <reference types="node" />
import { Writable } from 'stream';
export default class EventStream extends Writable {
    private buf;
    private newLine;
    private data;
    private eventName;
    _write(chunk: Buffer, _encoding: string, next: (err?: Error) => void): void;
    private parseEventStreamLine(position, fieldLength, lineLength);
}
