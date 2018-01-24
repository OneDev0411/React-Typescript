import React from 'react'
import { expect } from 'chai'
import types from '../../constants/deals'
import reducer from './agent'
import fakeUser from '../../../tests/helpers/user/create-fake-user'
import agent from '../../constants/deals/agent'

describe('Test agent reducers in deal components', () => {
  let agents

  beforeEach(() => {
    agents = [fakeUser('John', 'Doe'), fakeUser('John', 'Wick')]
  })

  test('should return the initial state', () => {
    expect(reducer(undefined, {})).to.equal(null)
  })

  test('should handle GET_AGENTS', () => {
    expect(reducer(undefined, {
      type: types.GET_AGENTS,
      agents
    })).to.equal(agents)
  })

  test('should handle default state', () => {
    expect(reducer(agents, {})).to.equal(agents)
  })
})
