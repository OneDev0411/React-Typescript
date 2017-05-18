// Partials/MlsMap.js
import S from 'shorti'
import _ from 'lodash'

import React, { Component } from 'react'
import GoogleMap from 'google-map-react'
import controller from '../../controller'
import supercluster from 'points-cluster'
import { mapOptions } from './MlsMapOptions'
import SingleMarker from './Markers/SingleMarker'
import { fitBounds } from 'google-map-react/utils'
import ClusterMarker from './Markers/ClusterMarker'
import AppStore from '../../../../../stores/AppStore'
import config from '../../../../../../config/public'

const coordinator = (points) => {
  let startX = 0
  let startY = 0
  let pointsLength = points.length
  const col = Math.ceil(pointsLength / 4)
  if (col === 1) {
    startX = 45 / -2
    startY = (((pointsLength * 25) + 45) / 2) * -0.5
  } else {
    startX = (((Math.ceil(pointsLength / 4) * 45) + 15) / 2) * -1
    startY = ((4 * 25) + 45) * -0.5
  }
  if (col === 1) {
    for (let i = 0; i < pointsLength; i++) {
      points[i].list.position = {
        left: 0,
        top: 0
      }
      points[i].list.position.left = `${startX}px`
      points[i].list.position.top = `${startY + (i * 40)}px`
    }
  } else {
    for (let i = 0; i < col; i++) {
      for (let j = 0; j < 4; j++) {
        const index = j + (4 * i)
        if (index < pointsLength) {
          points[index].list.position = {
            left: 0,
            top: 0
          }
          points[index].list.position.top = `${startY + (j * 40)}px`
          points[index].list.position.left = `${startX + (i * 60)}px`
        }
      }
    }
  }
  return points
}
const setPositionToPointsWithSameCoordinate = (clusters) => {
  let PointsWithSameCoordinate = []
  const pointsGroupByLat = _.groupBy(clusters, 'lat')
  Object.keys(pointsGroupByLat)
    .forEach((key) => {
      if (pointsGroupByLat[key].length !== 1) {
        coordinator(pointsGroupByLat[key])
          .forEach(obj => PointsWithSameCoordinate.push(obj))
      } else
        PointsWithSameCoordinate.push(pointsGroupByLat[key][0])
    })
  return PointsWithSameCoordinate
}

export default class MlsMap extends Component {
  constructor(props) {
    super(props)
    this.declusterZoomLevel = 17
    this.state = {
      listings: {
        data: null,
        total: 0,
        listingsLength: 0
      },
      mapProps: {
        ...mapOptions
      },
      hoveredMarkerId: null
    }
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this)
    this.clusterMarkerOnClickHandler =
      this.clusterMarkerOnClickHandler.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    console.log('recive')

    if (
      nextProps.data.listing_map &&
      nextProps.data.listing_map.zoom
    ) {
      const currentZoom = this.state.mapProps.zoom
      const nextZoom = nextProps.data.listing_map.zoom
      if (currentZoom !== nextZoom) {
        this.setState({
          mapProps: {
            ...this.state.mapProps,
            zoom: nextZoom
          }
        })
        console.log('rceive and set zoom')
        return
      }
    }

    if (
      nextProps.data.show_actives_map &&
      nextProps.data.favorite_listings.length
    ) {
      if (!nextProps.data.show_listing_panel) {
        AppStore.data.listing_panel = {
          view: 'photos',
          size: 'half'
        }
        AppStore.data.show_listing_panel = true
        AppStore.emitChange()
        return
      }

      const listings = nextProps.data.favorite_listings
      if (listings.length !== this.state.listings.listingsLength) {
        const newListings = listings.map((list) => {
          if (list.property && list.property.address) {
            return {
              numPoints: 1,
              list: { ...list },
              lat: list.property.address.location.latitude,
              lng: list.property.address.location.longitude,
              ...list
            }
          }
        })

        this.setState({
          listings: {
            data: newListings,
            total: newListings.length,
            listingsLength: newListings.length
          },
          mapProps: { ...mapOptions }
        })
        console.log('rceive favorite')
        return
      }
    }


    if (nextProps.data.show_alerts_map) {
      if (nextProps.data.alerts_map) {
        if (
          nextProps.data.alerts_map.listings &&
          nextProps.data.alerts_map.listings.length &&
          nextProps.data.alerts_map.listings.length !==
          this.state.listings.listingsLength
        ) {
          const listings = nextProps.data.alerts_map.listings
          const newListings = listings.map((list) => {
            if (list.location) {
              return {
                numPoints: 1,
                list: { ...list },
                lat: list.location.latitude,
                lng: list.location.longitude,
                ...list
              }
            }
          })

          this.setState({
            listings: {
              data: newListings,
              total: newListings.length,
              listingsLength: newListings.length
            }
          })
          console.log('rceive and set alerts')
          return
        }

        return
      }

      this.setState({
        mapProps: { ...mapOptions }
      })
      console.log('alert tab')
      return
    }

    if ((
      nextProps.data.listing_map &&
      nextProps.data.listing_map.listings
    ) && (
      !nextProps.data.show_actives_map &&
      !nextProps.data.show_alerts_map
    )) {
      const newListings = nextProps.data.listing_map.listings
      if ((
        newListings.length !==
        this.state.listings.listingsLength
      ) || (
        this.state.listings.total !==
        nextProps.data.listing_map.listings_info.total
      )) {
        console.log('recive list')
        const data = newListings.map(list => ({
          lat: list.location.latitude,
          lng: list.location.longitude,
          ...list
        }))
        const { total } = nextProps.data.listing_map.listings_info
        const { bounds } = nextProps.data.gmap || this.state.mapProps
        this.setClusters(
          { data, total },
          bounds
        )
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.mapProps.zoom !==
      nextState.mapProps.zoom
    ) {
      console.log('update zoom')
      return 1
    }

    if ((
      this.state.mapProps.center.lat !==
      nextState.mapProps.center.lat
    ) || (
      this.state.mapProps.center.lng !==
      nextState.mapProps.center.lng
    )) {
      console.log('update center')
      return 1
    }

    if (nextState.listings.data) {
      if (!this.state.listings.data) {
        console.log('update empty listings')
        return 1
      }

      if (
          !nextProps.data.show_actives_map &&
          !nextProps.data.show_alerts_map
      ) {
        if (
          this.state.listings.listingsLength
          !== nextProps.data.listing_map.listings.length
        ) {
          console.log('update listings')
          return 1
        }

        if (
          this.state.listings.total !==
          nextProps.data.listing_map.listings_info.total
        ) {
          console.log('update listings by totals')
          return 1
        }
      }
    }

    if ((
      nextProps.data.show_actives_map &&
      nextProps.data.show_actives_map !==
      this.props.data.show_actives_map
    ) || (
      nextProps.data.show_alerts_map &&
      nextProps.data.show_alerts_map !==
      this.props.data.show_alerts_map
    )) {
      console.log('update alerts or actives')
      return 1
    }

    if (
      this.state.hoveredMarkerId !==
      nextState.hoveredMarkerId
    ) {
      console.log('update hover mark')
      return 1
    }

    if (
      nextProps.data.listing_map.active_listing &&
      this.props.data.listing_map.active_listing ===
      nextProps.data.listing_map.active_listing
    ) {
      console.log('update hover listing')
      return 1
    }

    return 0
  }

  onMouseEnterHandler(hoveredMarkerId) {
    this.setState({
      hoveredMarkerId
    })
  }

  onMouseLeaveHandler(hoveredMarkerId) {
    if (hoveredMarkerId === this.state.hoveredMarkerId) {
      this.setState({
        hoveredMarkerId: null
      })
    }
  }

  setClusters(listings, bounds) {
    if (!bounds)
      return

    const { total, data } = listings
    const { center, zoom } = this.state.mapProps

    const getClusters = supercluster(
      data,
      {
        // min zoom to generate clusters on
        minZoom: 13,
        // max zoom level to cluster the points on
        maxZoom: this.declusterZoomLevel - 1,
        // cluster radius in pixels
        radius: zoom < this.declusterZoomLevel ? 160 : 480
      }
    )

    let clusters = getClusters({ bounds, center, zoom })
    clusters = clusters.map(({ wx, wy, numPoints, points }) => ({
      lat: wy,
      lng: wx,
      numPoints,
      list: numPoints === 1 ? points[0] : points,
      text: numPoints !== 1 ? numPoints : '',
      id: `${numPoints}_${points[0].id}`
    }))

    if (zoom >= this.declusterZoomLevel)
      clusters = setPositionToPointsWithSameCoordinate(clusters)

    this.setState({
      mapProps: {
        ...this.state.mapProps,
        bounds
      },
      listings: {
        total,
        data: clusters,
        listingsLength: data.length
      }
    })
  }

  clusterMarkerOnClickHandler(clusterCenter, points) {
    const googleMapsLatLngBounds = new google.maps.LatLngBounds()
    points.forEach(point => googleMapsLatLngBounds.extend(point))

    // The condition checked that if all points have the same coordinates,
    // the map transferred to a decluster zoom level.
    if (
      googleMapsLatLngBounds.getSouthWest().toString()
      === googleMapsLatLngBounds.getNorthEast().toString()
    ) {
      this.setState({
        mapProps: {
          ...this.state.mapProps,
          center: clusterCenter,
          zoom: this.declusterZoomLevel + 1
        }
      })
      return
    }

    const bounds = {
      ne: {
        lat: googleMapsLatLngBounds.getNorthEast().lat(),
        lng: googleMapsLatLngBounds.getNorthEast().lng()
      },
      sw: {
        lat: googleMapsLatLngBounds.getSouthWest().lat(),
        lng: googleMapsLatLngBounds.getSouthWest().lng()
      }
    }
    const { size } = this.props.data.gmap
    let { zoom, center } = fitBounds(bounds, size)

    if (
      zoom === this.state.mapProps.zoom
    ) zoom++

    this.setState({
      mapProps: {
        bounds,
        center,
        zoom
      }
    })
  }

  showMap() {
    const appData = this.props.data
    const bootstrapURLKeys = {
      key: config.google.api_key,
      libraries: ['drawing', 'places'].join(',')
    }
    const { data, type } = this.state.listings

    let mapId
    if (appData.listing_map)
      mapId = appData.listing_map.map_id || Math.random()

    return (
      <GoogleMap
        key={`map-${mapId}`}
        zoom={this.state.mapProps.zoom}
        yesIWantToUseGoogleMapApiInternals
        bootstrapURLKeys={bootstrapURLKeys}
        center={this.state.mapProps.center}
        options={controller.listing_map.createMapOptions.bind(this)}
        onChange={controller.listing_map.handleBoundsChange.bind(this)}
        onGoogleApiLoaded={controller.listing_map.handleGoogleMapApi.bind(this)}
      >
        {
          data &&
          data.map(({
              ...markerProps,
              numPoints,
              list,
              lat,
              lng,
              id
          }) => (
            numPoints === 1
              ?
                <SingleMarker
                  key={id}
                  data={appData}
                  {...markerProps}
                  onClickHandler={
                    controller.listing_viewer
                      .showListingViewer.bind(this)
                  }
                  markerPopupIsActive={this.state.hoveredMarkerId === id}
                  onMouseLeaveHandler={() => this.onMouseLeaveHandler(id)}
                  onMouseEnterHandler={() => this.onMouseEnterHandler(id)}
                />
              :
                <ClusterMarker
                  key={id}
                  {...markerProps}
                  onClickHandler={
                    () => this.clusterMarkerOnClickHandler({
                      lat,
                      lng
                    }, list)
                  }
                />
            )
          ) // map
        }
      </GoogleMap>
    ) // return
  } // getMarkers

  render() {
    console.log('render')
    return this.showMap()
  }
}
MlsMap.propTypes = {
  data: React.PropTypes.object
}
