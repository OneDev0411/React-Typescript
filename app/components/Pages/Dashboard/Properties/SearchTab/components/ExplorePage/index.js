import React from 'react'

import memoize from 'lodash/memoize'
import hash from 'object-hash'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { batchActions } from 'redux-batched-actions'

import ListView from '@app/components/Pages/Dashboard/Properties/components/ListView'
import MapView from '@app/components/Pages/Dashboard/Properties/components/MapView'
import CreateAlertModal from '@app/components/Pages/Dashboard/Properties/components/modals/CreateAlertModal'
import Tabs from '@app/components/Pages/Dashboard/Properties/components/Tabs'
import { formatListing } from '@app/components/Pages/Dashboard/Properties/helpers/format-listing'
import {
  parsSortIndex,
  getDefaultSort,
  sortByIndex,
  SORT_FIELD_SETTING_KEY,
  LAST_BROWSING_LOCATION
} from '@app/components/Pages/Dashboard/Properties/helpers/sort-utils'
import {
  bootstrapURLKeys,
  mapInitialState
} from '@app/components/Pages/Dashboard/Properties/mapOptions'
import {
  loadMapLibraries,
  isMapLibrariesLoaded
} from '@app/utils/google-map-api'
import { confirmation } from 'actions/confirmation'
import { setMapProps } from 'actions/listings/map'
import searchActions from 'actions/listings/search'
import { toggleFilterArea } from 'actions/listings/search/filters/toggle-filters-area'
import { setUserSetting } from 'actions/user/set-setting'
import { getUserTeams } from 'actions/user/teams'
import { getPlace } from 'models/listings/search/get-place'
import { putUserSetting } from 'models/user/put-user-setting'
import { selectListings } from 'reducers/listings'
import { getMapBoundsInCircle } from 'utils/get-coordinates-points'
import { getBounds, normalizeListingLocation } from 'utils/map'

import CreateTourAction from '../CreateTourAction'
import { Header } from '../Header'
import Map from '../Map'

// Golden ratio
const RADIUS = 1.61803398875 / 2

class Search extends React.Component {
  constructor(props) {
    super(props)

    const { query } = props

    this.searchQuery = query.q || ''
    this.brokerageQuery = query.brokerage || ''

    let activeView = query.view

    if (!activeView) {
      activeView = 'map'
    }

    const { index, ascending } = parsSortIndex(getDefaultSort(this.props.user))

    this.state = {
      activeView,
      activeSort: {
        index,
        ascending
      },
      isMapInitialized: false,
      shareModalIsActive: false
    }
  }

  componentDidMount() {
    window.initialize = this.initialize

    const googleMapAPIParams = {
      key: bootstrapURLKeys.key,
      libraries: bootstrapURLKeys.libraries.split(','),
      callback: 'initialize'
    }

    if (isMapLibrariesLoaded(googleMapAPIParams.libraries)) {
      this.initialize()
    } else {
      loadMapLibraries(googleMapAPIParams)
    }
  }

  initialize = () => {
    if (!this.brokerageQuery && !this.searchQuery && !this.props.isWidget) {
      return this.initMap()
    }

    if (this.props.listings.data.length > 0) {
      return this.state.activeView === 'map' ? this.initMap() : true
    }

    if (this.searchQuery) {
      this._findPlace(decodeURIComponent(this.searchQuery))
    } else if (this.brokerageQuery) {
      this._findBrokerage(this.brokerageQuery)
    } else {
      this.initMap()
    }
  }

  initMap = () => {
    const $loadJs = document.getElementById('loadJS-mls-search-map')

    if ($loadJs) {
      $loadJs.parentElement.removeChild($loadJs)
    }

    this.setState({ isMapInitialized: true })
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

      const place = await getPlace(address, false)

      let center = place.geometry.location
      const { points, bounds } = getMapBoundsInCircle(center, RADIUS, true)

      batchActions([
        dispatch(
          searchActions.getListings.byValert({
            ...this.props.filterOptions,
            limit: 200,
            points
          })
        ),
        dispatch(searchActions.setSearchLocation(center)),
        dispatch(
          setMapProps('search', {
            bounds: getBounds(bounds),
            center,
            zoom: mapInitialState.zoom
          })
        )
      ])
    } catch (error) {
      console.log(error)
    } finally {
      this.initMap()
    }
  }

  _findBrokerage = brokerage => {
    const { dispatch, filterOptions } = this.props

    try {
      batchActions([
        dispatch(
          searchActions.getListings.byValert({
            ...filterOptions,
            offices: [brokerage],
            limit: 200
          })
        ),
        dispatch(
          setMapProps('search', {
            center: mapInitialState.center,
            zoom: mapInitialState.zoom
          })
        )
      ])
    } catch (error) {
      console.log(error)
    }

    return this.initMap()
  }

  onChangeView = e => {
    const activeView = e.currentTarget.dataset.view

    this.setState(
      state => {
        if (activeView === 'map' && !state.isMapInitialized) {
          return {
            activeView,
            isMapInitialized: true
          }
        }

        return { activeView }
      },
      () => {
        browserHistory.push(`/dashboard/properties?view=${activeView}`)
      }
    )
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

  gridViewActions = () => [
    {
      render: ({ selectedRows, resetSelectedRows }) => {
        const listings = this.props.listings.data.filter(({ id }) =>
          selectedRows.includes(id)
        )

        return (
          <CreateTourAction
            disabled={selectedRows.length === 0}
            listings={listings}
            submitCallback={resetSelectedRows}
            user={this.props.user}
          />
        )
      }
    }
  ]

  onChangeSort = async sort => {
    const { index, ascending } = parsSortIndex(sort)

    this.setState({
      activeSort: {
        index,
        ascending
      }
    })
    await putUserSetting(SORT_FIELD_SETTING_KEY, sort)
    this.props.dispatch(getUserTeams(this.props.user))
  }

  sortListings = memoize(
    (listings, index, ascending) => {
      const formattedListings = listings.data.map(listing =>
        formatListing(normalizeListingLocation(listing), this.props.user)
      )

      return formattedListings.sort((a, b) =>
        sortByIndex(a, b, index, ascending)
      )
    },
    (...args) => `${hash(args[0])}_${args[1]}_${args[2]}`
  )

  updateUserLocation = gmap => {
    // Anonymous user's can also see /properties and explore the map
    // So updatingLastBrowsing location should not be run for them
    if (this.props.user) {
      this.props.dispatch(setUserSetting(LAST_BROWSING_LOCATION, gmap))
    }
  }

  renderMain() {
    const sortedListings = this.sortListings(
      this.props.listings,
      this.state.activeSort.index,
      this.state.activeSort.ascending
    )

    const _props = {
      user: this.props.user,
      listings: this.props.listings,
      sortedListings,
      isFetching: this.props.isFetching,
      totalRows: this.props.listings.info.total,
      lastBrowsingLocation: this.props.userLastBrowsingLocation
    }

    switch (this.state.activeView) {
      case 'map':
        return (
          <MapView
            {..._props}
            isWidget={this.props.isWidget}
            tabName="search"
            mapCenter={this.props.mapCenter}
            Map={
              this.state.isMapInitialized ? (
                <Map
                  {..._props}
                  isWidget={this.props.isWidget}
                  updateUserLocation={this.updateUserLocation}
                />
              ) : null
            }
          />
        )

      default:
        return (
          <ListView
            {..._props}
            plugins={
              _props.user && {
                selectable: {
                  persistent: true,
                  storageKey: 'listings',
                  entityName: 'listings'
                },
                actionable: {
                  actions: this.gridViewActions()
                }
              }
            }
          />
        )
    }
  }

  onClickFilter = () => this.props.dispatch(toggleFilterArea())

  render() {
    const { user, isWidget } = this.props

    return (
      <>
        <Header
          isWidget={this.props.isWidget}
          isFetching={this.props.isFetching}
          activeView={this.state.activeView}
          onChangeView={this.onChangeView}
          hasData={this.props.listings.data.length > 0}
        />
        <Tabs
          user={user}
          onChangeView={this.onChangeView}
          onChangeSort={this.onChangeSort}
          activeView={this.state.activeView}
          isWidget={isWidget}
          activeSort={this.state.activeSort}
          saveSearchHandler={this.handleSaveSearch}
          showSavedSearchButton
        />
        {this.renderMain()}
        <CreateAlertModal
          user={user}
          onHide={this.shareModalCloseHandler}
          isActive={this.state.shareModalIsActive}
          alertProposedTitle={this.props.listings.info.proposed_title}
        />
      </>
    )
  }
}

const mapStateToProps = ({ user, search }) => {
  const { listings } = search

  return {
    user,
    isLoggedIn: user || false,
    filterOptions: search.options,
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
