import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { batchActions } from 'redux-batched-actions'

import { loadJS } from '../../../../../utils/load-js'
import { getBounds } from '../../../../../utils/map'
import getPlace from '../../../../../models/listings/search/get-place'
import { getMapBoundsInCircle } from '../../../../../utils/get-coordinates-points'
import { selectListings } from '../../../../../reducers/listings'
import searchActions from '../../../../../store_actions/listings/search'
import { setMapProps } from '../../../../../store_actions/listings/map'
import getListingsByValert from '../../../../../store_actions/listings/search/get-listings/by-valert'
import { toggleFilterArea } from '../../../../../store_actions/listings/search/filters/toggle-filters-area'
import { confirmation } from '../../../../../store_actions/confirmation'
import Map from './components/Map'
import { MapView } from '../components/MapView'
import { bootstrapURLKeys, mapInitialState } from '../mapOptions'
import { GridView } from '../components/GridView'
import { GalleryView } from '../components/GalleryView'
import CreateAlertModal from '../components/modals/CreateAlertModal'
import { Header } from './Header'

class Search extends React.Component {
  constructor(props) {
    super(props)

    const { query } = props.location

    this.searchQuery = query.q || ''

    let activeView = query.view

    if (!activeView) {
      activeView =
        props.user && props.user.user_type === 'Agent' ? 'grid' : 'map'
    }

    this.state = {
      activeView,
      shareModalIsActive: false,
      mapWithQueryIsInitialized: !this.searchQuery
    }
  }

  componentDidMount() {
    window.initialize = this.initialize

    if (!window.google && this.state.activeView !== 'map') {
      loadJS(
        `https://maps.googleapis.com/maps/api/js?key=${
          bootstrapURLKeys.key
        }&libraries=${bootstrapURLKeys.libraries}&callback=initialize`
      )
    } else {
      this.initialize()
    }
  }

  initialize = () => {
    const isMapView = this.state.activeView === 'map'

    if (this.props.listings.data.length > 0) {
      return isMapView ? this.initMap() : true
    }

    if (this.searchQuery) {
      this._findPlace(this.searchQuery)
    } else if (!isMapView) {
      this.fetchDallasListings()
    }
  }

  initMap = () => this.setState({ mapWithQueryIsInitialized: true })

  fetchDallasListings = async () => {
    const { dispatch, queryOptions } = this.props

    dispatch(
      getListingsByValert({
        ...queryOptions,
        limit: 200
      })
    )

    const bounds = new window.google.maps.LatLngBounds()

    queryOptions.points.forEach(({ latitude: lat, longitude: lng }) =>
      bounds.extend({ lat, lng })
    )

    batchActions([
      dispatch(searchActions.setSearchInput('Dallas TX, USA')),
      dispatch(searchActions.setSearchLocation(mapInitialState.center)),
      dispatch(
        setMapProps('search', {
          bounds: getBounds(bounds),
          center: mapInitialState.center,
          zoom: 16
        })
      )
    ])
  }

  _findPlace = async address => {
    const { dispatch } = this.props

    const isMapView = this.state.activeView === 'map'

    try {
      dispatch(searchActions.setSearchInput(address))

      if (address.length > 7 && address.match(/^\d+$/)) {
        if (isMapView) {
          this.initMap()
        }

        return dispatch(searchActions.searchByMlsNumber(address))
      }

      if (isMapView) {
        await dispatch(searchActions.getPlace(address))

        return this.initMap()
      }

      const location = await getPlace(address)

      if (location) {
        await dispatch(
          getListingsByValert({
            ...this.props.queryOptions,
            limit: 50,
            points: getMapBoundsInCircle(location.center, 1)
          })
        )
      }
    } catch (error) {
      console.log(error)

      if (isMapView) {
        this.initMap()
      }
    }
  }

  onChangeView = e => {
    const activeView = e.currentTarget.dataset.view

    this.setState({ activeView }, () => {
      browserHistory.push(`/dashboard/mls?view=${activeView}`)
    })
  }

  shareModalCloseHandler = () => this.setState({ shareModalIsActive: false })

  handleSaveSearch = () => {
    if (this.props.listings.info.total < 400) {
      return this.setState({ shareModalIsActive: true })
    }

    this.props.dispatch(
      confirmation({
        confirmLabel: 'Ok',
        description:
          'Please zoom in or set more filters. You can save max 400 listings.',
        hideCancelButton: true,
        message: 'Too many matches!'
      })
    )
  }

  renderMain() {
    const _props = {
      user: this.props.user,
      listings: this.props.listings,
      isFetching: this.props.isFetching
    }

    switch (this.state.activeView) {
      case 'map':
        return (
          <MapView
            {..._props}
            tabName="search"
            mapCenter={this.props.mapCenter}
            Map={
              this.state.mapWithQueryIsInitialized ? (
                <Map {..._props} isWidget={this.props.isWidget} />
              ) : null
            }
          />
        )

      case 'gallery':
        return <GalleryView {..._props} />

      default:
        return <GridView {..._props} />
    }
  }

  onClickFilter = () => this.props.dispatch(toggleFilterArea())

  render() {
    const { user } = this.props

    return (
      <React.Fragment>
        <Header
          user={user}
          isWidget={this.props.isWidget}
          isFetching={this.props.isFetching}
          filtersIsOpen={this.props.filtersIsOpen}
          activeView={this.state.activeView}
          isSideMenuOpen={this.props.isSideMenuOpen}
          toggleSideMenu={this.props.toggleSideMenu}
          saveSearchHandler={this.handleSaveSearch}
          onClickFilter={this.onClickFilter}
          onChangeView={this.onChangeView}
          hasData={this.props.listings.data.length > 0}
        />
        {this.renderMain()}
        <CreateAlertModal
          user={user}
          onHide={this.shareModalCloseHandler}
          isActive={this.state.shareModalIsActive}
          alertProposedTitle={this.props.listings.info.proposed_title}
        />
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({ user, search }) => {
  const { listings } = search

  return {
    user,
    isLoggedIn: user || false,
    queryOptions: search.options,
    isFetching: listings.isFetching,
    filtersIsOpen: search.filters.isOpen,
    mapCenter: search.map.props.center,
    listings: {
      data: selectListings(listings),
      info: listings.info
    }
  }
}

export default connect(mapStateToProps)(Search)

// todo: refactor initmap when there is a querystring
