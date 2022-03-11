import {
  changeListingHoverState,
  changeListingClickedState,
  clearListingUiStates,
  Actions
} from './index'

describe('changeListingHoverState actions', () => {
  it('should work when id is null', () => {
    const actual = changeListingHoverState(null)
    const expected: Actions = {
      type: 'CHANGE_LISTING_HOVER_STATE',
      payload: {
        id: null
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should work when id is a string', () => {
    const actual = changeListingHoverState('some id string')
    const expected: Actions = {
      type: 'CHANGE_LISTING_HOVER_STATE',
      payload: {
        id: 'some id string'
      }
    }

    expect(actual).toEqual(expected)
  })
})

describe('changeListingClickedState actions', () => {
  it('should work when id is null', () => {
    const actual = changeListingClickedState(null)
    const expected: Actions = {
      type: 'CHANGE_LISTING_CLICKED_STATE',
      payload: {
        id: null
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should work when id is a string', () => {
    const actual = changeListingClickedState('some id string')
    const expected: Actions = {
      type: 'CHANGE_LISTING_CLICKED_STATE',
      payload: {
        id: 'some id string'
      }
    }

    expect(actual).toEqual(expected)
  })
})

describe('clearListingUiStates actions', () => {
  it('should returns empty object as payload', () => {
    const actual = clearListingUiStates()
    const expected: Actions = {
      type: 'CLEAR_LISTING_UI_STATES',
      payload: {}
    }

    expect(actual).toEqual(expected)
  })
})
