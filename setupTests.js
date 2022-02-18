import React from 'react'

import { configure } from '@testing-library/react'
import '@testing-library/jest-dom'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import Enzyme, { ShallowWrapper } from 'enzyme'
import { browserHistory } from 'react-router'

import 'whatwg-fetch'

process.env.DISABLE_MODAL = 'true'
window.React = React

const originalConsoleError = console.error

console.error = message => {
  // disable React Warnings for now
  if (/Warning/.test(message)) {
    return null
  }

  originalConsoleError(message)
}

/**
 * searchs a "date-test" attribute
 * @returns a dom element
 */
ShallowWrapper.prototype.findAttr = function findAttr(attr) {
  return this.find(`[data-test="${attr}"]`)
}

/**
 * query a "data-test" attribute
 * use this method if you need to query attr and class together
 * example: [data-test="foo"].active
 * @returns a dom element
 */
ShallowWrapper.prototype.queryAttr = function queryAttr(attr) {
  const params = attr.split('>')

  let query = `[data-test="${params[0].trim()}"]`

  if (params.length === 2) {
    query += `${params[1].trim()}`
  }

  return this.find(query)
}

/**
 * configure Enzyme to use React16 adapter
 */
Enzyme.configure({
  adapter: new Adapter()
})

global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document
  }
})

global.getSelection = () => {
  return {
    addRange: () => {},
    getRangeAt: () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document
      },
      cloneRange: () => {}
    }),
    removeAllRanges: () => {}
  }
}

// Using data-test instead of data-testId
configure({ testIdAttribute: 'data-test' })

// Fix mapbox-gl issue
window.URL.createObjectURL = function () {}

afterEach(() => {
  // reset the history
  // TODO: find a better way to do this
  browserHistory.replace('/')
})
