import { compactListing } from 'fixtures/listing/compact_listing'

import { Sort } from '../../../types'

import {
  setListings,
  toggleListingFavoriteState,
  setMapDrawing,
  updateFilters,
  changeSort,
  setMapBounds,
  setMapLocation,
  removePinMarker,
  setIsLoading,
  removeMapDrawing,
  Actions
} from './index'

describe('setListings actions', () => {
  let listings: ICompactListing[]
  let info: ICompactListingInfo

  beforeEach(() => {
    listings = [compactListing, compactListing, compactListing]
    info = {
      total: 20,
      proposed_title: 'some title',
      count: 3
    }
  })

  it('should work when listings is empty', () => {
    const actual = setListings([], {
      total: 0,
      proposed_title: '',
      count: 0
    })
    const expected: Actions = {
      type: 'SET_LISTINGS',
      payload: {
        listings: [],
        info: {
          total: 0,
          proposed_title: '',
          count: 0
        }
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should work when listings is not empty', () => {
    const actual = setListings(listings, info)
    const expected: Actions = {
      type: 'SET_LISTINGS',
      payload: {
        listings,
        info
      }
    }

    expect(actual).toEqual(expected)
  })
})

describe('toggleListingFavoriteState actions', () => {
  it('should work', () => {
    const id = 'some id'
    const actual = toggleListingFavoriteState(id)
    const expected: Actions = {
      type: 'TOGGLE_LISTING_FAVORITE_STATE',
      payload: {
        id
      }
    }

    expect(actual).toEqual(expected)
  })
})

describe('setMapDrawing actions', () => {
  it('should work', () => {
    const points = [
      { lat: 1, lng: 2 },
      { lat: 3, lng: 4 }
    ]
    const actual = setMapDrawing(points)
    const expected: Actions = {
      type: 'SET_MAP_DRAWING',
      payload: {
        points
      }
    }

    expect(actual).toEqual(expected)
  })
})

describe('updateFilters actions', () => {
  it('should work with partial filter', () => {
    const filters: AlertFilters = {
      minimum_price: 100,
      maximum_price: 200,
      minimum_bedrooms: 1,
      property_types: ['Lots & Acreage', 'Commercial']
    }

    const actual = updateFilters(filters)
    const expected: Actions = {
      type: 'UPDATE_FILTERS',
      payload: {
        filters
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should work with empty object as filter', () => {
    const actual = updateFilters({})
    const expected: Actions = {
      type: 'UPDATE_FILTERS',
      payload: {
        filters: {}
      }
    }

    expect(actual).toEqual(expected)
  })
})

describe('changeSort actions', () => {
  it('should work with ascending', () => {
    const sort: Sort = {
      index: 'price',
      ascending: true
    }
    const actual = changeSort(sort)
    const expected: Actions = {
      type: 'CHANGE_SORT',
      payload: {
        sort
      }
    }

    expect(actual).toEqual(expected)
  })
  it('should work with descending', () => {
    const sort: Sort = {
      index: 'builtYear',
      ascending: false
    }
    const actual = changeSort(sort)
    const expected: Actions = {
      type: 'CHANGE_SORT',
      payload: {
        sort
      }
    }

    expect(actual).toEqual(expected)
  })
})

describe('setMapBounds actions', () => {
  it('should work', () => {
    const bounds = {
      ne: { lat: 1, lng: 2 },
      sw: { lat: 3, lng: 4 }
    }
    const center = { lat: 5, lng: 6 }
    const zoom = 12
    const actual = setMapBounds(center, zoom, bounds)

    const expected: Actions = {
      type: 'SET_MAP_BOUNDS',
      payload: {
        center,
        zoom,
        bounds
      }
    }

    expect(actual).toEqual(expected)
  })
})

describe('setMapLocation actions', () => {
  it('should work when set pin marker is false', () => {
    const center = { lat: 1, lng: 2 }
    const zoom = 12
    const setPinMarker = false
    const actual = setMapLocation(center, zoom, setPinMarker)
    const expected: Actions = {
      type: 'SET_MAP_LOCATION',
      payload: {
        center,
        zoom,
        setPinMarker
      }
    }

    expect(actual).toEqual(expected)
  })

  it('should work when set pin marker is true', () => {
    const center = { lat: 1.21, lng: 2.12 }
    const zoom = 0
    const setPinMarker = true
    const actual = setMapLocation(center, zoom, setPinMarker)
    const expected: Actions = {
      type: 'SET_MAP_LOCATION',
      payload: {
        center,
        zoom,
        setPinMarker
      }
    }

    expect(actual).toEqual(expected)
  })
})

describe('removePinMarker actions', () => {
  it('should work', () => {
    const actual = removePinMarker()
    const expected: Actions = {
      type: 'REMOVE_PIN_MARKER',
      payload: {}
    }

    expect(actual).toEqual(expected)
  })
})

describe('setIsLoading actions', () => {
  it('should work when loading is true', () => {
    const actual = setIsLoading(true)
    const expected: Actions = {
      type: 'SET_IS_LOADING',
      payload: {
        isLoading: true
      }
    }

    expect(actual).toEqual(expected)
  })
  it('should work when loading is false', () => {
    const actual = setIsLoading(true)
    const expected: Actions = {
      type: 'SET_IS_LOADING',
      payload: {
        isLoading: true
      }
    }

    expect(actual).toEqual(expected)
  })
})

describe('removeMapDrawing actions', () => {
  it('should work', () => {
    const actual = removeMapDrawing()
    const expected: Actions = {
      type: 'REMOVE_MAP_DRAWING',
      payload: {}
    }

    expect(actual).toEqual(expected)
  })
})
