import { Theme } from '@material-ui/core'
import { Maps } from 'google-map-react'

import { PLACE_ZOOM_OFFSETS } from '../constants'

import {
  createMapOptions,
  createMapPolygonOptions,
  pointsFromPolygon,
  coordToPoint,
  pointFromBounds,
  estimateMapZoom,
  getPlaceZoomOffset
} from './map-helpers'

// create unit test for createMapOptions
describe('createMapOptions', () => {
  let mockedMaps: Maps

  beforeEach(() => {
    mockedMaps = {
      ControlPosition: {
        RIGHT_BOTTOM: 'RIGHT_BOTTOM',
        LEFT_BOTTOM: 'LEFT_BOTTOM',
        RIGHT_TOP: 'RIGHT_TOP',
        LEFT_TOP: 'LEFT_TOP'
      }
    } as Maps
  })

  it('should return true mapTypeControl when drawing mode is false', () => {
    const actual = createMapOptions(mockedMaps, false)

    expect(actual.mapTypeControl).toEqual(true)
  })
  it('should return false mapTypeControl when drawing mode is true', () => {
    const actual = createMapOptions(mockedMaps, true)

    expect(actual.mapTypeControl).toEqual(false)
  })

  it('should return true streetViewControl when drawing mode is false', () => {
    const actual = createMapOptions(mockedMaps, false)

    expect(actual.streetViewControl).toEqual(true)
  })
  it('should return false streetViewControl when drawing mode is true', () => {
    const actual = createMapOptions(mockedMaps, true)

    expect(actual.streetViewControl).toEqual(false)
  })
})

// create unit test for createMapPolygonOptions
describe('createMapPolygonOptions', () => {
  let mockedTheme: Theme

  beforeEach(() => {
    mockedTheme = {
      palette: {
        primary: {
          main: '#2d2d2d'
        }
      }
    } as Theme
  })

  it('should return primary main color as fillColor', () => {
    const actual = createMapPolygonOptions(mockedTheme)

    expect(actual.fillColor).toEqual(mockedTheme.palette.primary.main)
  })

  it('should return primary main color as strokeColor', () => {
    const actual = createMapPolygonOptions(mockedTheme)

    expect(actual.strokeColor).toEqual(mockedTheme.palette.primary.main)
  })

  it('should return 1 as zIndex', () => {
    const actual = createMapPolygonOptions(mockedTheme)

    expect(actual.zIndex).toEqual(1)
  })
})

// create unit test for pointsFromPolygon
describe('pointsFromPolygon', () => {
  it('should add first point to the end of array to close the polygon', () => {
    const mockedPolygon = {
      getPath: () => {
        return {
          getArray: () => {
            return [
              { lat: () => 1, lng: () => 1 },
              { lat: () => 2, lng: () => 2 },
              { lat: () => 3, lng: () => 3 },
              { lat: () => 4, lng: () => 4 }
            ]
          }
        }
      }
    } as google.maps.Polygon
    const actual = pointsFromPolygon(mockedPolygon)

    expect(actual).toEqual([
      { lat: 1, lng: 1 },
      { lat: 2, lng: 2 },
      { lat: 3, lng: 3 },
      { lat: 4, lng: 4 },
      { lat: 1, lng: 1 }
    ])
  })
})

describe('coordToPoint', () => {
  it('should return lat and lng', () => {
    const actual = coordToPoint({ lat: 1, lng: 1 })

    expect(actual).toEqual({ latitude: 1, longitude: 1 })
  })
})

describe('pointFromBounds', () => {
  it('should returns null if bound is null', () => {
    const actual = pointFromBounds(null)

    expect(actual).toBeNull()
  })

  it('should add ne point to the end of array to close the polygon', () => {
    const actual = pointFromBounds({
      ne: {
        lat: 1,
        lng: 2
      },
      sw: {
        lat: 3,
        lng: 4
      }
    })

    expect(actual).toStrictEqual([
      { latitude: 1, longitude: 2 },
      { latitude: 3, longitude: 2 },
      { latitude: 3, longitude: 4 },
      { latitude: 1, longitude: 4 },
      { latitude: 1, longitude: 2 }
    ])
  })
})

describe('getPlaceZoomOffset', () => {
  it('should return correct offset when types has locality', () => {
    const types = ['country', 'locality', 'something else']
    const actual = getPlaceZoomOffset(types)
    const expected = PLACE_ZOOM_OFFSETS.locality

    expect(actual).toEqual(expected)
  })
  it('should return correct offset when types has locality and administrative_area_level_1', () => {
    const types = ['administrative_area_level_1', 'locality', 'something else']
    const actual = getPlaceZoomOffset(types)
    const expected = PLACE_ZOOM_OFFSETS.administrative_area_level_1

    expect(actual).toEqual(expected)
  })
  it('should return 0 offset when types values are not acceptable', () => {
    const types = ['administrative_area_level_4', 'something', 'something else']
    const actual = getPlaceZoomOffset(types)
    const expected = 0

    expect(actual).toEqual(expected)
  })
})

describe('estimateMapZoom', () => {
  let bounds: ICompactBounds
  let offset: Optional<number>

  beforeEach(() => {
    bounds = {
      ne: {
        lat: 32.79294332988276,
        lng: 96.80131850650737
      },
      sw: {
        lat: 32.580550337143055,
        lng: 91.71550202777812
      }
    }
    offset = undefined
  })

  it('should estimate map width when mapWidth parameter is undefined', () => {
    global.innerWidth = 1650

    const actual = estimateMapZoom(bounds, offset, undefined, 650)

    expect(actual).toEqual(7)
  })

  it('should estimate map height when mapHeight parameter is undefined', () => {
    global.innerHeight = 1650

    const actual = estimateMapZoom(bounds, offset, 650, undefined)

    expect(actual).toEqual(7)
  })

  it('should estimate map width/height when mapWidth and mapHeight are undefined', () => {
    global.innerWidth = 2650
    global.innerHeight = 2650

    const actual = estimateMapZoom(bounds, offset, undefined, undefined)

    expect(actual).toEqual(8)
  })

  it('should works with mapWidth and mapHeight params', () => {
    const actual = estimateMapZoom(bounds, offset, 900, 800)

    expect(actual).toEqual(7)
  })

  it('should add offset to final zoom number', () => {
    const actual = estimateMapZoom(bounds, 2, 900, 800)

    expect(actual).toEqual(9)
  })
})
