import { memoize } from 'lodash'

/**
 * This is done for when the editor is embedded inside Grape.js in MC
 * Preventing mousedown via react doesn't work as the handler in grape.js
 * is set up with pure DOM API.
 */
export const nativelyStopEventPropagationOfEventViaRef = memoize(
  (eventName, preventDefault = false) => (el: HTMLElement | null) => {
    el &&
    el.addEventListener(eventName, e => {
      e.stopPropagation()

      if (preventDefault) {
        e.preventDefault()
      }
    })
  },
  (...args) => JSON.stringify(args)
)
