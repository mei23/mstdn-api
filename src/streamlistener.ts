import * as http from 'http'
import * as https from 'https'
import { parse as parseUrl } from 'url'
import * as EventEmitter from 'events'

import EventStream from './eventstream'
import { includes } from './utils'

const enum ReadyState {
  CONNECTING,
  OPEN,
  CLOSED,
  /** not connected yet OR not arrived any data */
  INIT
}

/**
 * listen Server-sent Events from Mastodon Streaming API
 *
 * By default, three events, 'update', 'notification' and 'delete' from Mastodon Streaming API are available.
 * This class inherits from [EventEmitter](https://nodejs.org/api/events.html), so you will also see its documents.
 * You can add your own events by method 'on' and trigger them by method 'emit'.
 */
export default class StreamListener extends EventEmitter {
  private readyState = ReadyState.INIT
  private reconnectInterval = 1000
  private reconnectIntervalOrg = 1000
  private eventStream: EventStream
  private httpsOptions: object
  private req: http.ClientRequest | undefined
  
  /**
   * @param url request target url (method: GET), and this will be parsed
   * @param headers request headers
   * @param reconnectInterval Interval of reconnect (ms)
   */
  constructor (url: string, headers: object, reconnectInterval?: number) {
    super()

    if (reconnectInterval) this.reconnectInterval = reconnectInterval
    this.reconnectIntervalOrg = this.reconnectInterval

    const parsedUrl = parseUrl(url)
    this.httpsOptions = {
      headers,
      path: parsedUrl.path,
      host: parsedUrl.host
    }

    const eventStream = new EventStream()
    for (const eventName of ['update', 'notification', 'delete']) {
      eventStream.on(eventName, data => {
        this.emit(eventName, data)
      })
    }
    this.eventStream = eventStream

    this._connect()
  }

  /**
   * you can close your connect
   */
  public close () {
    if (this.readyState === ReadyState.CLOSED) return
    this.readyState = ReadyState.CLOSED
    if (this.req) this.req.abort()
  }

  private _connect () {
    const req = https.request(this.httpsOptions, res => {
      const includesStatusCode = includes(res.statusCode)
      if (includesStatusCode([500, 502, 503, 504])) {
        this.emit('error', {status: res.statusCode})
        this._onClosed()
        return
      }
      if (res.statusCode !== 200) {
        this.emit('error', {status: res.statusCode})
        this.close()
        return
      }

      this.readyState = ReadyState.OPEN
      this.reconnectInterval = this.reconnectIntervalOrg

      res.on('close', () => {
        res.removeAllListeners('close')
        res.removeAllListeners('end')
        this._onClosed()
      })
      res.on('end', () => {
        res.removeAllListeners('close')
        res.removeAllListeners('end')
        this._onClosed()
      })
      this.emit('open')

      res.pipe(this.eventStream)
    })

    req.on('error', error => {
      // 4xx, 5xx, 接続失敗, 接続断 すべてここに来る可能性がある

      if (this.readyState === ReadyState.INIT) {
        this.emit('error', error)
      }
      else {
        this._onClosed()
      }
    })
    req.setNoDelay(true)
    req.end()
    this.req = req
  }

  private _onClosed (): void {
    if (this.readyState === ReadyState.CLOSED) return
    this.readyState = ReadyState.CONNECTING

    if (!this.reconnectInterval) return

    setTimeout(() => {
      if (this.readyState !== ReadyState.CONNECTING) return
      this._connect()
    }, this.reconnectInterval)

    this.reconnectInterval += 1000
  }
}
