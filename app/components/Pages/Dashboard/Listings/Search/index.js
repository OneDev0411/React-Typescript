import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import { loadJS } from '../../../../../utils/load-js'
import getPlace from '../../../../../models/listings/search/get-place'
import { getMapBoundsInCircle } from '../../../../../utils/get-coordinates-points/index.js'
import { selectListings } from '../../../../../reducers/listings'
import searchActions from '../../../../../store_actions/listings/search'
import getListingsByValert from '../../../../../store_actions/listings/search/get-listings/by-valert'
import { toggleFilterArea } from '../../../../../store_actions/listings/search/filters/toggle-filters-area'

import Map from './components/Map'
import { MapView } from '../components/MapView'
import { bootstrapURLKeys } from '../mapOptions'
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
    if (!window.google) {
      loadJS(
        `https://maps.googleapis.com/maps/api/js?key=${
          bootstrapURLKeys.key
        }&libraries=${bootstrapURLKeys.libraries},`
      )
    }

    if (this.searchQuery) {
      this._findPlace(this.searchQuery)
    } else if (this.props.listings.data.length === 0) {
      this.fetchDallasListings()
    }
  }

  fetchDallasListings = async () => {
    const { dispatch } = this.props

    dispatch(searchActions.setSearchInput('Dallas TX, USA'))

    await dispatch(
      getListingsByValert({
        ...this.props.queryOptions,
        limit: 50
      })
    )
  }

  _findPlace = async address => {
    const { dispatch } = this.props

    const isMapView = this.state.activeView === 'map'

    const initMap = () => this.setState({ mapWithQueryIsInitialized: true })

    try {
      dispatch(searchActions.setSearchInput(address))

      if (address.length > 7 && address.match(/^\d+$/)) {
        if (isMapView) {
          initMap()
        }

        return dispatch(searchActions.searchByMlsNumber(address))
      }

      if (isMapView) {
        await dispatch(searchActions.getPlace(address))

        return initMap()
      }

      const location = await getPlace(address)

      if (location) {
        dispatch(
          getListingsByValert({
            ...this.props.queryOptions,
            limit: 50,
            points: getMapBoundsInCircle(location.center, 1)
          })
        )
      }
    } catch ({ message }) {
      if (isMapView) {
        initMap()
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
  shareModalActiveHandler = () => this.setState({ shareModalIsActive: true })

  renderMain() {
    const _props = {
      user: this.props.user,
      listings: this.props.listings,
      isFetching: this.props.isFetching,
      isWidget: this.props.isWidget
    }

    switch (this.state.activeView) {
      case 'map':
        return (
          <MapView
            {..._props}
            Map={
              this.state.mapWithQueryIsInitialized ? <Map {..._props} /> : null
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
          isFetching={this.props.isFetching}
          filtersIsOpen={this.props.filtersIsOpen}
          activeView={this.state.activeView}
          isSideMenuOpen={this.props.isSideMenuOpen}
          toggleSideMenu={this.props.toggleSideMenu}
          saveSearchHandler={this.shareModalActiveHandler}
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
    listings: {
      data: selectListings(listings),
      info: listings.info
    }
  }
}

export default connect(mapStateToProps)(Search)

// todo: detect view from url
