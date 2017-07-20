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

export default {
  generatePointsFromBounds
}
