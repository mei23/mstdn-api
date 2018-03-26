/// <reference types="node" />
import * as EventEmitter from 'events';
export default class StreamListener extends EventEmitter {
    private readyState;
    private reconnectInterval;
    private reconnectIntervalOrg;
    private eventStream;
    private httpsOptions;
    private req;
    constructor(url: string, headers: object, reconnectInterval?: number);
    close(): void;
    private _connect();
    private _onClosed();
}
