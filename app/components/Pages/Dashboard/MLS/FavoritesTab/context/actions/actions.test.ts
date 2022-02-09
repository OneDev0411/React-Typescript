import { compactListing } from 'fixtures/listing/compact_listing'

import {
  setListings,
  removeListing,
  setMapLocation,
  setIsLoading,
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

describe('removeListing actions', () => {
  it('should work', () => {
    const id = 'some id'
    const actual = removeListing(id)
    const expected: Actions = {
      type: 'REMOVE_LISTING',
      payload: {
        id
      }
    }

    expect(actual).toEqual(expected)
  })
})

describe('setMapLocation actions', () => {
  it('should work', () => {
    const center = { lat: 1, lng: 2 }
    const zoom = 12
    const actual = setMapLocation(center, zoom)
    const expected: Actions = {
      type: 'SET_MAP_LOCATION',
      payload: {
        center,
        zoom
      }
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
