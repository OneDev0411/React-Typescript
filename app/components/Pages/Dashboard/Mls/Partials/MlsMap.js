// Partials/MlsMap.js
import S from 'shorti'
import _ from 'lodash'
import React, { Component } from 'react'
import GoogleMap from 'google-map-react'
import controller from '../../controller'
import supercluster from 'points-cluster'
import { mapOptions } from './MlsMapOptions'
import ClusterMarker from './Markers/ClusterMarker'
import config from '../../../../../../config/public'
import ListingMarker from '../../Partials/ListingMarker'


const singleMarkerStyle = ({
  left = 0,
  top = 0
}) => ({
  position: 'absolute',
  width: '45px',
  height: '25px',
  top,
  left,
  cursor: 'pointer'
})
const SingleMarker = ({
  list,
  data,
  markerPopupIsActive,
  onMouseLeaveHandler,
  onMouseEnterHandler
}) => (
  <div
    onMouseLeave={onMouseLeaveHandler}
    onMouseEnter={onMouseEnterHandler}
    style={list.position && singleMarkerStyle(list.position)}
    onClick={controller.listing_viewer.showListingViewer.bind(this, list)}
  >
    <ListingMarker
      data={data}
      listing={list}
      context={'map'}
      popupIsActive={markerPopupIsActive}
    />
  </div>
)


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


export default class MlsMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listings: [],
      cluster: [],
      mapProps: {
        ...mapOptions
      },
      hoveredMarkerId: null
    }
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this)
    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.data.listing_map
      && nextProps.data.listing_map.listings
    ) {
      console.log('recive')
      const currentListings = this.state.listings
      let newListings = nextProps.data.listing_map.listings
      if (newListings && newListings.length !== currentListings.length) {
        newListings = newListings.map(list => ({
          lat: list.location.latitude,
          lng: list.location.longitude,
          ...list
        }))
        const {
          zoom,
          bounds,
          center } = nextProps.data.gmap
        this.setState({
          mapProps: { zoom, bounds, center }
        })
        this.setClusters(newListings)
      }
      const currentZoom = this.state.mapProps.zoom
      const nextZoom = nextProps.data.listing_map.zoom
      if (currentZoom !== nextZoom) {
        this.setState({
          mapProps: {
            ...this.mapProps,
            zoom: nextZoom
          }
        })
        console.log('zoom: ', this.state.mapProps.zoom)
        this.setClusters(this.state.listings)
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.listings.length
      !== nextState.listings.length
    ) {
      console.log('update listings')
      return true
    }

    if (
      this.state.mapProps.zoom
      !== nextState.mapProps.zoom
    ) {
      console.log('update zoom')
      return true
    }

    if (
      this.state.hoveredMarkerId
      !== nextState.hoveredMarkerId
    ) {
      console.log('update hover mark')
      return true
    }

    if (
      nextProps.data.listing_map.active_listing
      && this.props.data.listing_map.active_listing
      === nextProps.data.listing_map.active_listing
    ) {
      console.log('update hover listing')
      return true
    }

    return false
  }
  setPositionToPointsWithSameCoordinate(clusters) {
    const tmpObj = _.groupBy(clusters, 'lat')
    const pwsc = []

    Object.keys(tmpObj)
      .forEach((key) => {
        if (tmpObj[key].length !== 1) {
          const cor = coordinator(tmpObj[key])
          console.log(cor)
          cor.forEach(obj => pwsc.push(obj))
        } else
          pwsc.push(tmpObj[key][0])
      })
    console.log(pwsc)
    return pwsc
  }
  setClusters(listings) {
    if (
      !this.state.mapProps.bounds
    ) return []

    if (
      this.state.mapProps.zoom > 19
    ) return this.state.clusters

    let getClusters = supercluster(
      listings,
      {
        minZoom: 13, // min zoom to generate clusters on
        maxZoom: 18, // max zoom level to cluster the points on
        radius: 60 // cluster radius in pixels
      }
    )
    let clusters = getClusters(this.state.mapProps)
    clusters = clusters.map(({ wx, wy, numPoints, points }) => ({
      lat: wy,
      lng: wx,
      numPoints,
      list: numPoints === 1 ? points[0] : null,
      text: numPoints !== 1 ? numPoints : '',
      id: `${numPoints}_${points[0].id}`
    }))
    if (this.state.mapProps.zoom === 19)
      clusters = this.setPositionToPointsWithSameCoordinate(clusters)
    this.setState({
      listings,
      clusters
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
  render() {
    console.log('render')
    const data = this.props.data
    const listing_map = data.listing_map
    const clusters = this.state.cluster
    /*if (data.show_alerts_map && alerts_map && alerts_map.listings) {
      let listings = alerts_map.listings
      listings = listings.filter(listing => {
        return listing.location
      })
      map_listing_markers = listings.map(listing => {
        return (
          <ListingMapMarker
            onMouseEnter={ controller.listing_map.showListingPopup.bind(this, listing) }
            onMouseLeave={ controller.listing_map.hideListingPopup.bind(this) }
            key={ 'alert-map--map-listing-' + listing.id }
            onClick={ controller.listing_viewer.showListingViewer.bind(this, listing) }
            style={ S('pointer mt-10') }
            lat={ listing.location.latitude }
            lng={ listing.location.longitude }
            text={'A'}
          >
            <ListingMarker
              key={ 'listing-marker-' + listing.id }
              data={ data }
              listing={ listing }
              property={ listing.compact_property }
              address={ listing.address }
              context={ 'map' }
            />
          </ListingMapMarker>
        )
      })
    }
    if (data.show_actives_map && data.favorite_listings) {
      const favorite_listings = data.favorite_listings
      let listings = favorite_listings.filter(listing => {
        if (listing.property && listing.property.address)
          return listing.property.address.location
      })
      // make sure no dupes
      listings = _.uniqBy(listings, 'id')
      map_listing_markers = listings.map((listing, i) => {
        return (
          <ListingMapMarker
            onMouseEnter={ controller.listing_map.showListingPopup.bind(this, listing) }
            onMouseLeave={ controller.listing_map.hideListingPopup.bind(this) }
            key={ 'actives-map--map-listing-' + listing.id + '-' + i }
            onClick={ controller.listing_viewer.showListingViewer.bind(this, listing) }
            style={ S('pointer mt-10') }
            lat={ listing.property.address.location.latitude }
            lng={ listing.property.address.location.longitude }
            text={'A'}
          >
            <ListingMarker
              key={ 'listing-marker-' + listing.id }
              data={ data }
              listing={ listing }
              property={ listing.property }
              address={ listing.property.address }
              context={ 'map' }
            />
          </ListingMapMarker>
        )
      })
    }*/
    const bootstrapURLKeys = {
      key: config.google.api_key,
      libraries: ['drawing', 'places'].join(',')
    }
    let map_id
    if (listing_map && listing_map.map_id)
      map_id = listing_map.map_id
    // Pinpoint
    /*if (map_listing_markers && listing_map.has_location_search) {
      const pinpoint = (
        <ListingMapMarker
          key="center-marker"
          style={ S('pointer mt-10') }
          lat={ listing_map.location_search.center.lat }
          lng={ listing_map.location_search.center.lng }
          text={'Hello!'}
        >
          <img style={ S('h-30') } src="/static/images/dashboard/mls/map-pin.svg"/>
        </ListingMapMarker>
      )
      map_listing_markers.push(pinpoint)
    }*/

    return (
      <GoogleMap
        key={`map-${map_id}`}
        zoom={this.state.mapProps.zoom}
        yesIWantToUseGoogleMapApiInternals
        bootstrapURLKeys={bootstrapURLKeys}
        center={this.state.mapProps.center}
        options={controller.listing_map.createMapOptions.bind(this)}
        onChange={controller.listing_map.handleBoundsChange.bind(this)}
        onGoogleApiLoaded={controller.listing_map.handleGoogleMapApi.bind(this)}
      >
        {
          this.state.clusters
          && this.state.clusters
            .map(({ ...markerProps, id, numPoints }) => (
              numPoints === 1
                ?
                  <SingleMarker
                    key={id}
                    data={data}
                    {...markerProps}
                    markerPopupIsActive={this.state.hoveredMarkerId === id}
                    onMouseLeaveHandler={() => this.onMouseLeaveHandler(id)}
                    onMouseEnterHandler={() => this.onMouseEnterHandler(id)}
                  />
                : <ClusterMarker key={id} {...markerProps} />
            ))
        }
      </GoogleMap>
    )
  }
}
MlsMap.propTypes = {
  data: React.PropTypes.object
}
