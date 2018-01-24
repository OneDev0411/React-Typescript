import React from 'react'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import types from '../../constants/deals'
import { getAgents } from './agent'
import Fetch from '../../services/fetch'
import Deal from '../../models/Deal'
import agent from '../../reducers/deals/agent'
import fakeUser from '../../../tests/helpers/user/create-fake-user'

const mockStore = configureMockStore([thunk])

describe('Test agent actions in deal components', () => {
  let store
  let user

  beforeEach(() => {
    user = { brand: '88c7100a-9ed1-11e7-8c9b-0242ac110003' }
    store = mockStore(null)
  })

  test('should create agents on success response', async () => {
    const agents = [fakeUser('John', 'Doe'), fakeUser('John', 'Wick')]

    new Fetch().mock({
      endpoint: `/brands/${user.brand}/agents`,
      response: {
        data: agents
      }
    })

    const expectedActions = [{ type: types.GET_AGENTS, agents }]

    await store.dispatch(getAgents(user))
    expect(store.getActions()).toEqual(expectedActions)
  })

  test('should not create agents on error', async () => {
    new Fetch().mock({
      endpoint: `/brands/${user.brand}/agents`,
      statusCode: 403,
      response: {
        http: 403,
        message: 'Access denied to brand resource',
        code: 'AccessForbidden'
      }
    })

    const expectedActions = [{ type: types.GET_AGENTS, agents: null }]

    await store.dispatch(getAgents(user))
    expect(store.getActions()).toEqual(expectedActions)
  })
})
