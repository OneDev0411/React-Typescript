import flux from 'flux'
import invariant from 'invariant'
import _ from 'underscore'

/**
 * Dispatches a payload to all registered callbacks.
 */
flux.Dispatcher.prototype.dispatchSync = async function dispatch(payload) {
  !!this._isDispatching ?  true ? invariant(false, 'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.') : invariant(false) : undefined;
  this._startDispatching(payload)

  const response = {}

  try {
    for (let id in this._callbacks) {
      if (this._isPending[id]) {
        continue
      }

      this._isPending[id] = true
      response[id] = await this._callbacks[id](this._pendingPayload)
      this._isHandled[id] = true
    }
  } finally {
    this._stopDispatching()
  }

  return _.size(response) === 1 ? response[Object.keys(response)[0]] : response
}

const Dispatcher = flux.Dispatcher
export { Dispatcher }

// default
export default flux
