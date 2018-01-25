import React from 'react'
import { expect } from 'chai'
import types from '../../constants/deals'
import reducer from './backoffice'

describe('Test backoffice reducers in deals', () => {
  test('should return the initial state', () => {
    expect(reducer(undefined, {})).to.equal(false)
  })

  test('should handle IS_BACK_OFFICE', () => {
    expect(reducer(undefined, {
      type: types.IS_BACK_OFFICE,
      status: true
    })).to.equal(true)
  })
})
