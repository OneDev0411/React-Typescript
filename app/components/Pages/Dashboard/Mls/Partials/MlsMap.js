// Partials/MlsMap.js
import S from 'shorti'
import React, { Component } from 'react'
import GoogleMap from 'google-map-react'
import controller from '../../controller'
import supercluster from 'points-cluster'
import config from '../../../../../../config/public'
import { mapOptions } from '../../ClusterMap/options'
import ListingMarker from '../../Partials/ListingMarker'
import ClusterMarker from '../../ClusterMap/Markers/ClusterMarker'

const SimpleMarker = ({
  list,
  data,
  markerPopupIsActive,
  onMouseLeaveHandler,
  onMouseEnterHandler
}) => (
  <div
    style={S('pointer mt-10')}
    onMouseLeave={onMouseLeaveHandler}
    onMouseEnter={onMouseEnterHandler}
    onClick={controller.listing_viewer.showListingViewer.bind(this, list)}
  >
    <ListingMarker
      data={data}
      listing={list}
      context={'map'}
      address={list.address}
      property={list.compact_property}
      popupIsActive={markerPopupIsActive}
    />
  </div>
)


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
  setClusters(listings) {
    if (!this.state.mapProps.bounds)
      return

    let getClusters = supercluster(
      listings,
      {
        minZoom: 3, // min zoom to generate clusters on
        maxZoom: 25, // max zoom level to cluster the points on
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
                  <SimpleMarker
                    key={id}
                    data={data}
                    {...markerProps}
                    onMouseLeaveHandler={() => this.onMouseLeaveHandler(id)}
                    onMouseEnterHandler={() => this.onMouseEnterHandler(id)}
                    markerPopupIsActive={this.state.hoveredMarkerId === id}
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
