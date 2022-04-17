/**
 * Imperatively resolve or reject Promise
 *
 * Use it like this:
 * const {promise, resolve} = deferred()
 * promise.then(() => console.log('resolved'))
 * > do stuff/make assertions you want to before calling resolve
 * resolve()
 * await promise
 * > do stuff/make assertions you want to after the promise has resolved
 */

export function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}
