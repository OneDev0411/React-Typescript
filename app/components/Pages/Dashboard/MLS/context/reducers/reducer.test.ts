import { IListingUIStates } from '../../types'
import { Actions } from '../actions'

import { reducer } from './index'

describe('reducer', () => {
  let initialState: IListingUIStates

  beforeEach(() => {
    initialState = {
      hover: null,
      click: null
    }
  })

  it('should change listing hover state', () => {
    const action: Actions = {
      type: 'CHANGE_LISTING_HOVER_STATE',
      payload: {
        id: 'some id string'
      }
    }

    const actual = reducer(initialState, action)
    const expected: IListingUIStates = {
      ...initialState,
      hover: 'some id string'
    }

    expect(actual).toEqual(expected)
  })

  it('should clear listing hover state', () => {
    initialState.hover = 'some id string'

    const action: Actions = {
      type: 'CHANGE_LISTING_HOVER_STATE',
      payload: {
        id: null
      }
    }

    const actual = reducer(initialState, action)
    const expected: IListingUIStates = {
      ...initialState,
      hover: null
    }

    expect(actual).toEqual(expected)
  })

  it('should change listing click state', () => {
    const action: Actions = {
      type: 'CHANGE_LISTING_CLICKED_STATE',
      payload: {
        id: 'some id string'
      }
    }

    const actual = reducer(initialState, action)
    const expected: IListingUIStates = {
      ...initialState,
      click: 'some id string'
    }

    expect(actual).toEqual(expected)
  })

  it('should clear listing click state', () => {
    initialState.click = 'some id string'

    const action: Actions = {
      type: 'CHANGE_LISTING_CLICKED_STATE',
      payload: {
        id: null
      }
    }

    const actual = reducer(initialState, action)
    const expected: IListingUIStates = {
      ...initialState,
      click: null
    }

    expect(actual).toEqual(expected)
  })

  it('should clear listing click and hover state', () => {
    initialState.click = 'some id string'
    initialState.hover = 'some other id string'

    const action: Actions = {
      type: 'CLEAR_LISTING_UI_STATES',
      payload: {}
    }

    const actual = reducer(initialState, action)
    const expected: IListingUIStates = {
      hover: null,
      click: null
    }

    expect(actual).toEqual(expected)
  })

  it('should clear listing click and hover state when they are null already', () => {
    initialState.click = null
    initialState.hover = null

    const action: Actions = {
      type: 'CLEAR_LISTING_UI_STATES',
      payload: {}
    }

    const actual = reducer(initialState, action)
    const expected: IListingUIStates = {
      hover: null,
      click: null
    }

    expect(actual).toEqual(expected)
  })
})
