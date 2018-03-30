/* @flow */

export function assert (condition: any, message: string) {
// export function assert (condition, message) {
  if (!condition) {
    throw new Error(`[vue-router] ${message}`)
  }
}

export function warn (condition: any, message: string) {
// export function warn (condition, message) {
  if (process.env.NODE_ENV !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn(`[vue-router] ${message}`)
  }
}

export function isError (err: any): boolean {
// export function isError (err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1
}
