// Partials/MlsMap.js
import S from 'shorti'
import _ from 'lodash'

import React, { Component } from 'react'
import GoogleMap from 'google-map-react'
import controller from '../../controller'
import supercluster from 'points-cluster'
import SingleMarker from './Markers/SingleMarker'
import { fitBounds } from 'google-map-react/utils'
import ClusterMarker from './Markers/ClusterMarker'
import config from '../../../../../../config/public'
import Brand from '../../../../../controllers/Brand'
import AppStore from '../../../../../stores/AppStore'
import { Button, ButtonGroup } from 'react-bootstrap'
import SearchPinMarker from './Markers/SearchPinMarker'
import { bootstrapURLKeys, mapInitialState } from './MlsMapOptions'

let store = {}

const coordinator = (points) => {
  let pointsLength = points.length
  const col = Math.ceil(pointsLength / 4)
  if (col === 1) {
    startX = 45 / -2
    startY = (pointsLength * 25 + 45) / 2 * -0.5
  } else {
    startX = (Math.ceil(pointsLength / 4) * 45 + 15) / 2 * -1
    startY = (4 * 25 + 45) * -0.5
  }
  if (col === 1) {
    for (let i = 0; i < pointsLength; i++) {
      points[i].list.position = {
        left: 0,
        top: 0
      }
      points[i].list.position.left = `${startX}px`
      points[i].list.position.top = `${startY + i * 40}px`
    }
  } else {
    for (let i = 0; i < col; i++) {
      for (let j = 0; j < 4; j++) {
        const index = j + 4 * i
        if (index < pointsLength) {
          points[index].list.position = {
            left: 0,
            top: 0
          }
          points[index].list.position.top = `${startY + j * 40}px`
          points[index].list.position.left = `${startX + i * 60}px`
        }
      }
    }
    points[i].list.position.top = `${i * 21}px`
  }
  return points
}

const setPositionToPointsWithSameCoordinate = (clusters) => {
  let PointsWithSameCoordinate = []
  const pointsGroupByLat = _.groupBy(clusters, 'lat')
  Object.keys(pointsGroupByLat).forEach((key) => {
    if (pointsGroupByLat[key].length !== 1) {
      coordinator(pointsGroupByLat[key]).forEach(obj =>
        PointsWithSameCoordinate.push(obj)
      )
    } else {
      PointsWithSameCoordinate.push(pointsGroupByLat[key][0])
    }
  })
  return PointsWithSameCoordinate
}
const setInitialState = (data = null) => ({
  listings: {
    data,
    total: 0,
    listingsLength: 0
  },
  mapProps: {
    ...mapInitialState
  },
  searchPin: null,
  isResized: false,
  isFetching: false,
  isRecovered: false,
  hoveredMarkerId: null
})

export default class MlsMap extends Component {
  constructor(props) {
    super(props)

    let oldState = store[this.props.data.path]
    if (oldState) {
      oldState = {
        ...oldState,
        isRecovered: true
      }
    }

    let data = null
    const favoriteListings = props.data.favorite_listings
    if (favoriteListings && props.data.show_actives_map) {
      data = this.getFavorateListingsData(favoriteListings)
      if (oldState) {
        oldState = {
          ...oldState,
          listings: {
            ...oldState.listings,
            data
          }
        }
      }
    }

    this.declusterZoomLevel = 16

    this.state = oldState || setInitialState(data)

    this.mapZoomHandler = this.mapZoomHandler.bind(this)
    this.mapOnChangeHandler = this.mapOnChangeHandler.bind(this)
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this)
    this.clusterMarkerOnClickHandler = this.clusterMarkerOnClickHandler.bind(
      this
    )
  }

  componentDidMount() {
    if (window.google) {
      window.google.maps.event.addDomListener(window, 'resize', () => {
        if (this.state.isResized) {
          return
        }

        this.setState({
          isResized: true
        })
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log('receive')
    // console.log(this.state.mapProps.zoom)
    const nextData = nextProps.data
    const currentState = this.state

    const isLoading = nextData.listing_map.is_loading
    if (!currentState.isFetching && isLoading) {
      this.setState({
        isFetching: true
      })
      // console.log('receive is loading')
    }

    const hasLocationSearch =
      nextData.listing_map && nextData.listing_map.has_location_search

    if (
      hasLocationSearch &&
      (currentState.mapProps.center.lat !== nextData.listing_map.center.lat ||
        currentState.mapProps.center.lng !== nextData.listing_map.center.lng)
    ) {
      const { center, zoom } = AppStore.data.listing_map
      const searchPin = nextData.listing_map.location_search.center
      this.setState({
        searchPin,
        mapProps: {
          ...currentState.mapProps,
          center,
          zoom
        }
      })
      // console.log('receive: hasLocationSearch')
      return
    }

    const nextPath = nextData.path
    if (nextPath !== this.props.data.path) {
      if (
        !nextData.show_listing_panel &&
        (nextPath === '/dashboard/mls' || nextPath === '/dashboard/mls/actives')
      ) {
        // console.log('receive path -> active listing panel')
        AppStore.data.listing_panel = {
          view: 'photos',
          size: 'half'
        }
        AppStore.data.show_listing_panel = true
        AppStore.emitChange()
      }

      store[this.props.data.path] = currentState
      // console.log('receive, save store')

      if (store[nextData.path]) {
        const newState = {
          ...store[nextData.path],
          isRecovered: true
        }

        this.setState(newState)
        delete store[nextData.path]

        // console.log('receive, load store')
        return
      } else if (nextPath === '/dashboard/mls/alerts') {
        this.setState(setInitialState())
        return
      }
    }

    if (
      nextData.listing_map.active_listing &&
      currentState.hoveredMarkerId !== 'listing-hover'
    ) {
      this.setState({
        hoveredMarkerId: 'listing-hover'
      })

      // console.log('receive: hover listing enter')
      return
    }

    if (
      !nextData.listing_map.active_listing &&
      currentState.hoveredMarkerId === 'listing-hover'
    ) {
      this.setState({
        hoveredMarkerId: null
      })

      // console.log('receive: hover listing leave')
      return
    }

    if (nextData.show_actives_map) {
      if (nextData.favorite_listings && nextData.favorite_listings.length) {
        if (
          nextData.favorite_listings.length !==
          currentState.listings.listingsLength
        ) {
          const listings = nextData.favorite_listings
          const newListings = this.getFavorateListingsData(listings)
          this.setState({
            listings: {
              data: newListings,
              total: newListings.length,
              listingsLength: newListings.length
            },
            mapProps: { ...mapInitialState }
          })
          // console.log('rceive, initial favorite list load')
          return
        }
      } else {
        this.setState({
          listings: {
            data: null,
            total: 0,
            listingsLength: 0
          },
          mapProps: { ...mapInitialState }
        })
        // console.log('rceive, favorite tab with zero listing')
        return
      }
    }

    if (nextData.show_alerts_map) {
      if (nextData.alerts_map) {
        if (
          nextData.alerts_map.listings &&
          nextData.alerts_map.listings.length &&
          nextData.alerts_map.listings.length !==
            currentState.listings.listingsLength
        ) {
          const listings = nextData.alerts_map.listings
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
          // console.log('rceive and set alerts')
          return
        }
      }
    }

    if (
      nextData.listing_map &&
      nextData.listing_map.listings &&
      !nextData.listing_map.is_loading &&
      (!nextData.show_actives_map && !nextData.show_alerts_map)
    ) {
      const newListings = nextData.listing_map.listings
      if (
        newListings.length !== currentState.listings.listingsLength ||
        currentState.listings.total !== nextData.listing_map.listings_info.total
      ) {
        console.log('receive list')

        if (window.poly_search) {
          const data = newListings.map(list => ({
            numPoints: 1,
            list: { ...list },
            lat: list.location.latitude,
            lng: list.location.longitude,
            ...list
          }))

          this.setState({
            listings: {
              data,
              total: newListings.length,
              listingsLength: newListings.length
            }
          })

          return
        }

        const { total } = nextData.listing_map.listings_info

        const data = newListings.map(list => ({
          lat: list.location.latitude,
          lng: list.location.longitude,
          ...list
        }))

        let mapProps = currentState.mapProps
        if (nextData.listing_map.search_input_text) {
          const newMapProps = this.extendedBounds(data)
          mapProps = newMapProps
            ? {
              ...currentState.mapProps,
              ...newMapProps
            }
            : {
              ...currentState.mapProps,
              zoom: this.declusterZoomLevel + 1
            }
        }

        const { bounds } = mapProps
        if (!bounds) {
          mapProps = {
            ...mapProps,
            bounds: nextData.gmap.bounds
          }
        }

        this.setClusters({ data, total }, mapProps)
      } else if (currentState.isFetching) {
        // console.log('receive empty list')
        this.setState({
          isFetching: false
        })
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.isResized) {
      this.setState({ isResized: false })
      return 0
    }

    if (this.state.isFetching !== nextState.isFetching) {
      console.log('is fetching')
      return 1
    }

    if (this.state.mapProps.zoom !== nextState.mapProps.zoom) {
      console.log('update zoom')
      return 1
    }

    if (!nextProps.data.show_alerts_map && !nextProps.data.show_actives_map) {
      if (
        this.state.mapProps.center.lat !== nextState.mapProps.center.lat ||
        this.state.mapProps.center.lng !== nextState.mapProps.center.lng
      ) {
        console.log('update center')
        return 1
      }
    }

    if (nextState.listings.data) {
      if (!this.state.listings.data) {
        // console.log('update empty listings')
        return 1
      }

      if (!nextProps.data.show_actives_map && !nextProps.data.show_alerts_map) {
        if (
          nextProps.data.listing_map.listings &&
          this.state.listings.listingsLength !==
            nextProps.data.listing_map.listings.length
        ) {
          // console.log('update listings')
          return 1
        }

        if (
          this.state.listings.total !==
          nextProps.data.listing_map.listings_info.total
        ) {
          // console.log('update listings by totals')
          return 1
        }

        if (
          window.poly_search &&
          this.state.listings.data.length !== nextState.listings.data.length
        ) {
          // console.log('update listings by poly_search')
          return 1
        }
      }
    }

    if (
      (nextProps.data.show_actives_map &&
        nextProps.data.show_actives_map !== this.props.data.show_actives_map) ||
      (nextProps.data.show_alerts_map &&
        (nextProps.data.show_alerts_map !== this.props.data.show_alerts_map ||
          this.props.data.show_alert_viewer !==
            nextProps.data.show_alert_viewer))
    ) {
      console.log('update alerts or actives')
      return 1
    }

    if (this.state.hoveredMarkerId !== nextState.hoveredMarkerId) {
      console.log('update hover mark')
      return 1
    }

    if (
      nextProps.data.listing_map.active_listing !==
      this.props.data.listing_map.active_listing
    ) {
      // console.log('update hover listing')
      return 1
    }

    return 0
  }

  componentWillUnmount() {
    console.log('cwum')
    if (
      this.state.listings.data &&
      this.props.data.path.indexOf('/dashboard/mls/alerts') === -1
    ) {
      store[this.props.data.path] = this.state
    }
  }

  getFavorateListingsData(listings) {
    return listings.map((list) => {
      let lat
      let lng

      if (list.location) {
        lat = list.location.latitude
        lng = list.location.longitude
      }

      if (list.property && list.property.address) {
        lat = list.property.address.location.latitude
        lng = list.property.address.location.longitude
      }

      if (lat && lng) {
        return {
          ...list,
          numPoints: 1,
          list: { ...list },
          lat,
          lng
        }
      }
    })
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

  setClusters(listings, mapProps) {
    const { bounds, center, zoom } = mapProps || this.state.mapProps
    if (!bounds) {
      return
    }

    const { total, data } = listings

    const getClusters = supercluster(data, {
      // min zoom to generate clusters on
      minZoom: 12,
      // max zoom level to cluster the points on
      maxZoom: this.declusterZoomLevel - 1,
      // cluster radius in pixels
      radius: 60
    })

    let clusters = getClusters({ bounds, center, zoom })
    clusters = clusters.map(({ wx, wy, numPoints, points }) => ({
      lat: wy,
      lng: wx,
      numPoints,
      list: numPoints === 1 ? points[0] : points,
      text: numPoints !== 1 ? numPoints : '',
      id: `${numPoints}_${points[0].id}`
    }))

    if (zoom >= this.declusterZoomLevel) {
      clusters = setPositionToPointsWithSameCoordinate(clusters)
    }

    this.setState({
      isFetching: false,
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

  extendedBounds(points) {
    const googleMapsLatLngBounds = new google.maps.LatLngBounds()
    points.forEach(point => googleMapsLatLngBounds.extend(point))

    // The condition checked that if all points have the same coordinates,
    // the map transferred to a decluster zoom level.
    if (
      googleMapsLatLngBounds.getSouthWest().toString() ===
      googleMapsLatLngBounds.getNorthEast().toString()
    ) {
      return false
    }

    const ne = {
      lat: googleMapsLatLngBounds.getNorthEast().lat(),
      lng: googleMapsLatLngBounds.getNorthEast().lng()
    }
    const sw = {
      lat: googleMapsLatLngBounds.getSouthWest().lat(),
      lng: googleMapsLatLngBounds.getSouthWest().lng()
    }

    const getNw = new google.maps.LatLng(ne.lat.toString(), sw.lng.toString())
    const getSe = new google.maps.LatLng(sw.lat, ne.lng)

    const nw = {
      lat: getNw.lat(),
      lng: getNw.lng()
    }
    const se = {
      lat: getSe.lat(),
      lng: getSe.lng()
    }

    const { size } = this.state.mapProps

    if (size == null) {
      return false
    }

    let { zoom, center } = fitBounds({ ne, sw }, size)

    if (zoom === this.state.mapProps.zoom) {
      zoom++
    }

    return {
      bounds: { nw, se },
      center,
      zoom
    }
  }

  clusterMarkerOnClickHandler(clusterCenter, points) {
    const mapProps = this.extendedBounds(points)

    if (!mapProps) {
      this.setState({
        mapProps: {
          ...this.state.mapProps,
          center: clusterCenter,
          zoom: this.declusterZoomLevel + 1
        }
      })
      return
    }

    this.setState({ mapProps })
  }

  mapOnChangeHandler(gmap) {
    const { data } = this.props

    const hasLocationSearch =
      data.listing_map && data.listing_map.has_location_search

    if (hasLocationSearch) {
      AppStore.data.listing_map.has_location_search = false
      // console.log('mapChanged: falsed has_location_search')
    } else if (this.state.searchPin) {
      this.setState({
        searchPin: null
      })
      AppStore.data.listing_map.search_input_text = ''
      // console.log('mapChanged: remove searchPin')
    }

    if (this.state.isResized) {
      // console.log('mapChanged: resized')
      return
    }

    if (this.state.isRecovered) {
      this.setState({
        isRecovered: false
      })
      // console.log('mapChanged: recovered')
      return
    }

    if (window.poly || data.show_alerts_map || data.show_actives_map) {
      this.setState({
        mapProps: {
          ...gmap
        }
      })
    } else {
      this.setState({
        isFetching: true,
        mapProps: {
          ...gmap
        },
        listings: {
          total: 0,
          data: null,
          listingsLength: 0
        }
      })
      controller.listing_map.handleBoundsChange(gmap)
    }
  }

  mapZoomHandler(type) {
    const currentZoom = this.state.mapProps.zoom
    const zoom = type === 'IN' ? currentZoom + 1 : currentZoom - 1

    this.setState({
      mapProps: {
        ...this.state.mapProps,
        zoom
      }
    })
  }

  getMarkers() {
    const appData = this.props.data
    const { data } = this.state.listings

    let markers = data && !this.state.isFetching
      ? data.map(
          ({ ...markerProps, numPoints, list, lat, lng, id }) =>
            (numPoints === 1
              ? <SingleMarker
                key={id}
                data={appData}
                {...markerProps}
                onClickHandler={controller.listing_viewer.showListingViewer.bind(
                    this
                  )}
                markerPopupIsActive={this.state.hoveredMarkerId === id}
                onMouseLeaveHandler={() => this.onMouseLeaveHandler(id)}
                onMouseEnterHandler={() => this.onMouseEnterHandler(id)}
              />
              : <ClusterMarker
                key={id}
                {...markerProps}
                onClickHandler={() =>
                    this.clusterMarkerOnClickHandler(
                      {
                        lat,
                        lng
                      },
                      list
                    )}
              />)
        ) // map
      : []

    const searchPin = this.state.searchPin
    if (searchPin) {
      markers.push(<SearchPinMarker key="pinMarker" {...searchPin} />)
    }

    return markers
  }

  showMap() {
    const appData = this.props.data

    let mapId
    if (appData.listing_map) {
      mapId = appData.listing_map.map_id || Math.random()
    }

    let loading = null
    let loading_style = null
    if (
      appData.listing_map &&
      (this.state.isFetching || appData.listing_map.is_loading)
    ) {
      loading_style = S('absolute h-0 w-100p l-260 t-90 z-200')
      if (appData.is_mobile) {
        loading_style = {
          ...loading_style,
          ...S('fixed t-60')
        }
      }
      loading = (
        <div id="loading" style={loading_style}>
          <div
            style={S(
              `br-20 color-fff w-190 h-29 pt-5 center-block text-center bg-${Brand.color('primary', '3388ff')}`
            )}
          >
            Loading MLS® Listings...
          </div>
        </div>
      )
    }

    let zoom_right = 'r-25'
    if (appData.show_listing_panel) {
      zoom_right = 'r-460'
    }

    let zoom_bottom = ' b-25'
    if (appData.is_mobile) {
      zoom_bottom = ' b-75'
    }

    return (
      <div style={{ width: '100%', height: '100%' }}>
        {loading}
        <GoogleMap
          key={`map-${mapId}`}
          zoom={this.state.mapProps.zoom}
          yesIWantToUseGoogleMapApiInternals
          bootstrapURLKeys={bootstrapURLKeys}
          center={this.state.mapProps.center}
          onChange={this.mapOnChangeHandler.bind(this)}
          options={controller.listing_map.createMapOptions.bind(this)}
          onGoogleApiLoaded={controller.listing_map.handleGoogleMapApi.bind(
            this
          )}
        >
          {this.getMarkers()}
        </GoogleMap>

        <ButtonGroup
          vertical
          className="transition"
          style={S(`fixed ${zoom_right} ${zoom_bottom}`)}
        >
          <Button bsSize="large" onClick={() => this.mapZoomHandler('IN')}>
            <i style={S('color-929292')} className="fa fa-plus" />
          </Button>
          <Button bsSize="large" onClick={() => this.mapZoomHandler('OUT')}>
            <i style={S('color-929292')} className="fa fa-minus" />
          </Button>
        </ButtonGroup>
      </div>
    ) // return
  }

  render() {
    // console.log('render')
    return this.showMap()
  }
}
MlsMap.propTypes = {
  data: React.PropTypes.object
}
