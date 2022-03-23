import { compactListing } from 'fixtures/listing/compact_listing'

import { Actions } from '../actions'

import { FavoritesState, reducer } from './index'

describe('reducer', () => {
  let initialState: FavoritesState

  beforeEach(() => {
    initialState = {
      map: {
        center: { lat: 1, lng: 2 },
        zoom: 12
      },
      result: {
        listings: [
          { ...compactListing, id: '1', favorited: true },
          { ...compactListing, id: '2', favorited: true },
          { ...compactListing, id: '3', favorited: true },
          { ...compactListing, id: '4', favorited: true },
          { ...compactListing, id: '5', favorited: true }
        ],
        info: {
          total: 20,
          proposed_title: 'some title',
          count: 5
        }
      },
      isLoading: false
    }
  })

  it('should set listing when state.result is not empty', () => {
    const action: Actions = {
      type: 'SET_LISTINGS',
      payload: {
        listings: [compactListing],
        info: {
          total: 1,
          proposed_title: 'same title',
          count: 1
        }
      }
    }

    const actual = reducer(initialState, action)
    const expected: FavoritesState = {
      ...initialState,
      result: {
        listings: [compactListing],
        info: {
          total: 1,
          proposed_title: 'same title',
          count: 1
        }
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should set listing when state.result is empty', () => {
    initialState.result = { listings: [], info: null }

    const action: Actions = {
      type: 'SET_LISTINGS',
      payload: {
        listings: [compactListing, compactListing],
        info: {
          total: 2,
          proposed_title: 'another title',
          count: 2
        }
      }
    }

    const actual = reducer(initialState, action)
    const expected: FavoritesState = {
      ...initialState,
      result: {
        listings: [compactListing, compactListing],
        info: {
          total: 2,
          proposed_title: 'another title',
          count: 2
        }
      }
    }

    expect(actual).toEqual(expected)
  })

  it('remove a listing from favorites when it exists', () => {
    const action: Actions = {
      type: 'REMOVE_LISTING',
      payload: {
        id: '1'
      }
    }

    const actual = reducer(initialState, action)
    const expected: FavoritesState = {
      ...initialState,
      result: {
        ...initialState.result,
        info: {
          proposed_title: initialState.result.info?.proposed_title || '',
          count: 4,
          total: 19
        },
        listings: initialState.result.listings.slice(1)
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should return prevoiuse state when try to remove listing which its not exist', () => {
    const action: Actions = {
      type: 'REMOVE_LISTING',
      payload: {
        id: 'not exist id'
      }
    }

    const actual = reducer(initialState, action)
    const expected: FavoritesState = {
      ...initialState
    }

    expect(actual).toEqual(expected)
  })

  it('should set map location', () => {
    const action: Actions = {
      type: 'SET_MAP_LOCATION',
      payload: {
        center: { lat: 1, lng: 2 },
        zoom: 12
      }
    }

    const actual = reducer(initialState, action)
    const expected: FavoritesState = {
      ...initialState,
      map: { zoom: 12, center: { lat: 1, lng: 2 } }
    }

    expect(actual).toEqual(expected)
  })

  it('should change loading', () => {
    const action: Actions = {
      type: 'SET_IS_LOADING',
      payload: {
        isLoading: true
      }
    }

    const actual = reducer(initialState, action)
    const expected: FavoritesState = {
      ...initialState,
      isLoading: true
    }

    expect(actual).toEqual(expected)
  })
})
