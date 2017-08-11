/**
 * simple recursion sample
 */

import { createInterface } from 'readline'
import Mastodon from '../../src/mastodon'

interface Status {
  id: number
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

let mastodon: Mastodon

new Promise<string>(resolve => {
  rl.question('Enter your access token: ', token => {
    mastodon = new Mastodon(token)
    resolve()
    rl.close()
  })
}).then(() => loop(mastodon.get('timelines/home', {limit: 40}) as Promise<Status[]>))
  .catch(err => console.error(err))

function loop (promise: Promise<Status[]>): Promise<Status[]> {
  return promise.then(statuses => {
    if (statuses.length === 0) {
      return Promise.reject('no value')
    }

    const max_id = statuses[statuses.length - 1].id
    if (max_id < 34185000) {
      return Promise.reject('stopped')
    }

    for (const status of statuses) {
      console.log(status.id)
    }

    return loop(mastodon.get('timelines/home', {max_id, limit: 40}) as Promise<Status[]>)
  })
}
