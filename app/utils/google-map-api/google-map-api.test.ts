import {
  GoogleMapLibrary,
  loadMapLibraries,
  isMapLibrariesLoaded,
  createGoogleMapApiUrl,
  GoogleMapAPIParams,
  DEFAULT_KEY
} from '@app/utils/google-map-api'
import { loadJS } from 'utils/load-js'

jest.mock('utils/load-js', () => ({
  loadJS: jest.fn()
}))

describe('createGoogleMapApiUrl function', () => {
  let googleMapAPIParams: GoogleMapAPIParams

  beforeEach(() => {
    googleMapAPIParams = {
      key: 'some_key',
      libraries: ['places', 'localContext', 'geometry'],
      callback: 'initialize'
    }
  })
  it('should return default key when it is not present', () => {
    const param: GoogleMapAPIParams = { ...googleMapAPIParams, key: undefined }
    const expected = `https://maps.googleapis.com/maps/api/js?key=${DEFAULT_KEY}&libraries=places,localContext,geometry&callback=initialize`

    expect(createGoogleMapApiUrl(param)).toEqual(expected)
  })

  it('should return key when key is present', () => {
    const param: GoogleMapAPIParams = { ...googleMapAPIParams }
    const expected = `https://maps.googleapis.com/maps/api/js?key=${param.key}&libraries=places,localContext,geometry&callback=initialize`

    expect(createGoogleMapApiUrl(param)).toEqual(expected)
  })

  it("shouldn't returns libraries when libraries is empty", () => {
    const param: GoogleMapAPIParams = { ...googleMapAPIParams, libraries: [] }
    const expected = `https://maps.googleapis.com/maps/api/js?key=${param.key}&callback=initialize`

    expect(createGoogleMapApiUrl(param)).toEqual(expected)
  })

  it("shouldn't returns libraries when libraries is undefined", () => {
    const param: GoogleMapAPIParams = {
      ...googleMapAPIParams,
      libraries: undefined
    }
    const expected = `https://maps.googleapis.com/maps/api/js?key=${param.key}&callback=initialize`

    expect(createGoogleMapApiUrl(param)).toEqual(expected)
  })

  it('should return libraries when callback is not undefined', () => {
    const param: GoogleMapAPIParams = {
      ...googleMapAPIParams,
      libraries: ['drawing', 'places']
    }
    const expected = `https://maps.googleapis.com/maps/api/js?key=${param.key}&libraries=drawing,places&callback=initialize`

    expect(createGoogleMapApiUrl(param)).toEqual(expected)
  })

  it("shouldn't returns callback when callback is undefined", () => {
    const param: GoogleMapAPIParams = {
      ...googleMapAPIParams,
      callback: undefined
    }
    const expected = `https://maps.googleapis.com/maps/api/js?key=${param.key}&libraries=places,localContext,geometry`

    expect(createGoogleMapApiUrl(param)).toEqual(expected)
  })

  it('should return callback when callback is not undefined', () => {
    const param: GoogleMapAPIParams = {
      ...googleMapAPIParams,
      callback: 'something'
    }
    const expected = `https://maps.googleapis.com/maps/api/js?key=${param.key}&libraries=places,localContext,geometry&callback=something`

    expect(createGoogleMapApiUrl(param)).toEqual(expected)
  })
})

describe('loadMapLibraries function', () => {
  let googleMapAPIParams: GoogleMapAPIParams

  beforeEach(() => {
    googleMapAPIParams = {
      key: 'some_key',
      libraries: ['places', 'localContext', 'geometry'],
      callback: 'initialize'
    }
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should call loadJS 1 time', () => {
    const param: GoogleMapAPIParams = { ...googleMapAPIParams }
    const expected = 1

    loadMapLibraries(param)

    expect(loadJS).toBeCalledTimes(expected)
  })
})

describe('isMapLibrariesLoaded function', () => {
  // eslint-disable-next-line no-global-assign
  window = {
    google: {
      maps: {
        drawing: true,
        geometry: true,
        localContext: true,
        places: true,
        visualization: true
      }
    }
  } as any

  beforeEach(() => {
    global.google = {
      maps: {
        drawing: true,
        geometry: true,
        localContext: true,
        places: true,
        visualization: true
      }
    } as any
  })

  it('should return true if all libraries are loaded and all are desired', () => {
    const param: GoogleMapLibrary[] = [
      'places',
      'localContext',
      'geometry',
      'drawing',
      'visualization'
    ]
    const expected = true

    expect(isMapLibrariesLoaded(param)).toBe(expected)
  })

  it('should return true if all libraries are loaded and some are desired', () => {
    const param: GoogleMapLibrary[] = ['places', 'geometry', 'drawing']
    const expected = true

    expect(isMapLibrariesLoaded(param)).toBe(expected)
  })

  it('should return false if one library is missing', () => {
    global.google = {
      maps: {
        drawing: true
      }
    } as any

    const param: GoogleMapLibrary[] = ['places', 'drawing']
    const expected = false

    expect(isMapLibrariesLoaded(param)).toBe(expected)
  })

  it('should return false if all librarie is missing', () => {
    global.google = {
      maps: {
        places: true
      }
    } as any

    const param: GoogleMapLibrary[] = ['geometry', 'drawing', 'localContext']
    const expected = false

    expect(isMapLibrariesLoaded(param)).toBe(expected)
  })
})
