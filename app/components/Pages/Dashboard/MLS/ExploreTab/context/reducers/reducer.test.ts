import { compactListing } from 'fixtures/listing/compact_listing'

import { Actions } from '../actions'

import { ListingsState, reducer } from './index'

describe('reducer', () => {
  let initialState: ListingsState

  beforeEach(() => {
    initialState = {
      search: {
        bounds: { ne: { lat: 1, lng: 2 }, sw: { lat: 3, lng: 4 } },
        office: null,
        drawing: [],
        filters: {},
        sort: { index: 'price', ascending: false }
      },
      map: {
        center: { lat: 1, lng: 2 },
        zoom: 12
      },
      pinMarker: undefined,
      result: {
        listings: [
          compactListing,
          compactListing,
          compactListing,
          compactListing,
          compactListing
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
    const expected: ListingsState = {
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
    const expected: ListingsState = {
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

  it('should toggle a listing favorite when its already favorited', () => {
    initialState.result.listings[0] = {
      ...initialState.result.listings[0],
      id: '1',
      favorited: true
    }

    const action: Actions = {
      type: 'TOGGLE_LISTING_FAVORITE_STATE',
      payload: {
        id: '1'
      }
    }

    const actual = reducer(initialState, action)
    const expected: ListingsState = {
      ...initialState,
      result: {
        ...initialState.result,
        listings: [
          {
            ...initialState.result.listings[0],
            favorited: false
          },
          compactListing,
          compactListing,
          compactListing,
          compactListing
        ]
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should toggle a listing favorite when its not favorited', () => {
    initialState.result.listings[0] = {
      ...initialState.result.listings[0],
      id: '1',
      favorited: false
    }

    const action: Actions = {
      type: 'TOGGLE_LISTING_FAVORITE_STATE',
      payload: {
        id: '1'
      }
    }

    const actual = reducer(initialState, action)
    const expected: ListingsState = {
      ...initialState,
      result: {
        ...initialState.result,
        listings: [
          {
            ...initialState.result.listings[0],
            favorited: true
          },
          compactListing,
          compactListing,
          compactListing,
          compactListing
        ]
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should set map drawing', () => {
    const action: Actions = {
      type: 'SET_MAP_DRAWING',
      payload: {
        points: [
          { lat: 1, lng: 2 },
          { lat: 3, lng: 4 },
          { lat: 5, lng: 5 },
          { lat: 1, lng: 2 }
        ]
      }
    }

    const actual = reducer(initialState, action)
    const expected: ListingsState = {
      ...initialState,
      search: {
        ...initialState.search,
        drawing: [
          { lat: 1, lng: 2 },
          { lat: 3, lng: 4 },
          { lat: 5, lng: 5 },
          { lat: 1, lng: 2 }
        ]
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should set map bounds', () => {
    const action: Actions = {
      type: 'SET_MAP_BOUNDS',
      payload: {
        center: { lat: 1, lng: 2 },
        zoom: 12,
        bounds: { ne: { lat: 1, lng: 2 }, sw: { lat: 3, lng: 4 } }
      }
    }

    const actual = reducer(initialState, action)
    const expected: ListingsState = {
      ...initialState,
      map: { zoom: 12, center: { lat: 1, lng: 2 } },
      search: {
        ...initialState.search,
        bounds: { ne: { lat: 1, lng: 2 }, sw: { lat: 3, lng: 4 } }
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should update filters', () => {
    const action: Actions = {
      type: 'UPDATE_FILTERS',
      payload: {
        filters: {
          minimum_price: 10000,
          maximum_price: 20000,
          minimum_bedrooms: 2,
          property_types: ['Lots & Acreage', 'Commercial']
        }
      }
    }

    const actual = reducer(initialState, action)
    const expected: ListingsState = {
      ...initialState,
      search: {
        ...initialState.search,
        filters: {
          minimum_price: 10000,
          maximum_price: 20000,
          minimum_bedrooms: 2,
          property_types: ['Lots & Acreage', 'Commercial']
        }
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should update filters to empty filters', () => {
    const action: Actions = {
      type: 'UPDATE_FILTERS',
      payload: {
        filters: {}
      }
    }

    const actual = reducer(initialState, action)
    const expected: ListingsState = {
      ...initialState,
      search: {
        ...initialState.search,
        filters: {}
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should update filters when some filters is already selected ', () => {
    initialState.search.filters = {
      minimum_price: 900000,
      property_types: ['Commercial']
    }

    const action: Actions = {
      type: 'UPDATE_FILTERS',
      payload: {
        filters: {
          minimum_price: 100000,
          minimum_bedrooms: 1
        }
      }
    }

    const actual = reducer(initialState, action)
    const expected: ListingsState = {
      ...initialState,
      search: {
        ...initialState.search,
        filters: {
          minimum_price: 100000,
          minimum_bedrooms: 1,
          property_types: ['Commercial']
        }
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should update property_types filters when another property_types filters is already selected ', () => {
    initialState.search.filters = {
      minimum_price: 900000,
      property_types: ['Commercial']
    }

    const action: Actions = {
      type: 'UPDATE_FILTERS',
      payload: {
        filters: {
          minimum_price: 100000,
          minimum_bedrooms: 1,
          property_types: ['Multi-Family', 'Residential']
        }
      }
    }

    const actual = reducer(initialState, action)
    const expected: ListingsState = {
      ...initialState,
      search: {
        ...initialState.search,
        filters: {
          minimum_price: 100000,
          minimum_bedrooms: 1,
          property_types: ['Multi-Family', 'Residential']
        }
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should change sort', () => {
    const action: Actions = {
      type: 'CHANGE_SORT',
      payload: {
        sort: {
          index: 'builtYear',
          ascending: true
        }
      }
    }

    const actual = reducer(initialState, action)
    const expected: ListingsState = {
      ...initialState,
      search: {
        ...initialState.search,
        sort: {
          index: 'builtYear',
          ascending: true
        }
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should set map location when setPinMarker is false', () => {
    const action: Actions = {
      type: 'SET_MAP_LOCATION',
      payload: {
        center: { lat: 1, lng: 2 },
        setPinMarker: false,
        zoom: 12
      }
    }

    const actual = reducer(initialState, action)
    const expected: ListingsState = {
      ...initialState,
      map: { zoom: 12, center: { lat: 1, lng: 2 } }
    }

    expect(actual).toEqual(expected)
    expect(actual.pinMarker).toBeUndefined()
  })

  it('should set map location when setPinMarker is true', () => {
    const action: Actions = {
      type: 'SET_MAP_LOCATION',
      payload: {
        center: { lat: 4.2, lng: 5.6 },
        setPinMarker: true,
        zoom: 8
      }
    }

    const actual = reducer(initialState, action)
    const expected: ListingsState = {
      ...initialState,
      map: {
        zoom: 8,
        center: { lat: 4.2, lng: 5.6 }
      },
      pinMarker: { lat: 4.2, lng: 5.6 }
    }

    expect(actual).toEqual(expected)
  })

  it('should remove pin marker when map marker was set before', () => {
    initialState.pinMarker = { lat: 4.2, lng: 5.6 }

    const action: Actions = {
      type: 'REMOVE_PIN_MARKER',
      payload: {}
    }

    const actual = reducer(initialState, action)
    const expected: ListingsState = {
      ...initialState,
      pinMarker: undefined
    }

    expect(actual).toEqual(expected)
  })

  it('should remove pin marker when map marker was not set before', () => {
    const action: Actions = {
      type: 'REMOVE_PIN_MARKER',
      payload: {}
    }

    const actual = reducer(initialState, action)
    const expected: ListingsState = {
      ...initialState,
      pinMarker: undefined
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
    const expected: ListingsState = {
      ...initialState,
      isLoading: true
    }

    expect(actual).toEqual(expected)
  })

  it('should remove map drawing when drawing is not set before', () => {
    const action: Actions = {
      type: 'REMOVE_MAP_DRAWING',
      payload: {}
    }

    const actual = reducer(initialState, action)
    const expected: ListingsState = {
      ...initialState,
      search: {
        ...initialState.search,
        drawing: []
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should remove map drawing when drawing is set before', () => {
    initialState.search.drawing = [
      { lat: 1, lng: 2 },
      { lat: 3, lng: 4 },
      { lat: 5, lng: 6 },
      { lat: 1, lng: 2 }
    ]

    const action: Actions = {
      type: 'REMOVE_MAP_DRAWING',
      payload: {}
    }

    const actual = reducer(initialState, action)
    const expected: ListingsState = {
      ...initialState,
      search: {
        ...initialState.search,
        drawing: []
      }
    }

    expect(actual).toEqual(expected)
  })
})
