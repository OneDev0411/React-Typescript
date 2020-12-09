export const allLocationBasedFilterOptions = {
  counties: null,
  mls_areas: null,
  subdivisions: null,
  school_districts: null,
  high_schools: null,
  middle_schools: null,
  primary_schools: null,
  elementary_schools: null,
  senior_high_schools: null,
  junior_high_schools: null,
  intermediate_schools: null
}

export const normalizeListingLocation = listing => {
  if (listing.location) {
    return {
      ...listing,
      lat: listing.location.latitude,
      lng: listing.location.longitude
    }
  }

  return {
    ...listing,
    lat: listing.property.address.location.latitude,
    lng: listing.property.address.location.longitude
  }
}

export const normalizeListingsForMarkers = markers =>
  markers.filter(marker => marker.location || marker.property).map(normalizeListingLocation)

const setCssPosition = buildings => {
  buildings.forEach((building, i) => {
    buildings[i].points[0].cssPosition = {
      left: 0,
      top: `${i * 21}px`
    }
  })

  return buildings
}

export const setCssPositionToListingsWithSameBuilding = clusters => {
  let newClusters = []
  const pointsGroupByLat = _.groupBy(clusters, 'lat')

  Object.keys(pointsGroupByLat).forEach(lat => {
    const listingsWithSameBuilding = pointsGroupByLat[lat]

    if (listingsWithSameBuilding.length > 1) {
      newClusters = [
        ...newClusters,
        ...setCssPosition(listingsWithSameBuilding)
      ]

      return
    }

    newClusters = [...newClusters, pointsGroupByLat[lat][0]]
  })

  return newClusters
}

export const generatePointsFromBounds = bounds => [
  {
    latitude: bounds.ne.lat,
    longitude: bounds.ne.lng
  },
  {
    latitude: bounds.nw.lat,
    longitude: bounds.nw.lng
  },
  {
    latitude: bounds.sw.lat,
    longitude: bounds.sw.lng
  },
  {
    latitude: bounds.se.lat,
    longitude: bounds.se.lng
  },
  {
    latitude: bounds.ne.lat,
    longitude: bounds.ne.lng
  }
]

export const getBounds = (bounds) => {
  if (bounds == null) {
    return {}
  }

  const northEast = bounds.getNorthEast()
  const southWest = bounds.getSouthWest()

  const nw = { lat: northEast.lat(), lng: southWest.lng() }
  const sw = { lat: southWest.lat(), lng: southWest.lng() }
  const se = { lat: southWest.lat(), lng: northEast.lng() }
  const ne = { lat: northEast.lat(), lng: northEast.lng() }

  return { nw, sw, se, ne }
}

export function getLocationErrorMessage(error) {
  let message = error.message

  switch (error.code) {
    case error.POSITION_UNAVAILABLE:
      message = 'Location information is unavailable.'
      break
    case error.TIMEOUT:
      message = 'The request to get user location timed out.'
      break
    case error.UNKNOWN_ERROR:
      message = 'Location Service: An unknown error occurred.'
      break
    default:
      break
  }

  return message
}
