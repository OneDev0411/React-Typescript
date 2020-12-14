import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { batchActions } from 'redux-batched-actions'
import memoize from 'lodash/memoize'
import hash from 'object-hash'

import { DALLAS_POINTS } from 'constants/listings/dallas-points'

import { putUserSetting } from 'models/user/put-user-setting'
import getPlace from 'models/listings/search/get-place'

import { loadJS } from 'utils/load-js'
import { getMapBoundsInCircle } from 'utils/get-coordinates-points'
import {
  getBounds,
  getLocationErrorMessage,
  normalizeListingLocation
} from 'utils/map'

import { selectListings } from 'reducers/listings'

import { getUserTeams } from 'actions/user/teams'
import searchActions from 'actions/listings/search'
import { setMapProps } from 'actions/listings/map'
import getListingsByValert from 'actions/listings/search/get-listings/by-valert'
import { toggleFilterArea } from 'actions/listings/search/filters/toggle-filters-area'
import { confirmation } from 'actions/confirmation'

import {
  parsSortIndex,
  getDefaultSort,
  sortByIndex,
  SORT_FIELD_SETTING_KEY
} from '../helpers/sort-utils'

import Tabs from '../components/Tabs'

import Map from './components/Map'
import { bootstrapURLKeys, mapInitialState } from '../mapOptions'
import MapView from '../components/MapView'
import ListView from '../components/ListView'
import GridView from '../components/GridView'
import CreateAlertModal from '../components/modals/CreateAlertModal'
import {
  addDistanceFromCenterToListing,
  formatListing
} from '../helpers/format-listing'
import { Header } from './Header'
import CreateTourAction from './components/CreateTourAction'

// Golden ratio
const RADIUS = 1.61803398875 / 2

class Search extends React.Component {
  constructor(props) {
    super(props)

    const { query } = props.location

    this.searchQuery = query.q || ''

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
      isCalculatingLocation: false,
      isMapInitialized: false,
      shareModalIsActive: false
    }
  }

  componentDidMount() {
    window.initialize = this.initialize

    if (!window.google) {
      loadJS(
        `https://maps.googleapis.com/maps/api/js?key=${bootstrapURLKeys.key}&libraries=${bootstrapURLKeys.libraries}&callback=initialize`,
        'loadJS-mls-search-map'
      )
    } else {
      this.initialize()
    }
  }

  initialize = () => {
    if (this.props.listings.data.length > 0) {
      return this.state.activeView === 'map' ? this.initMap() : true
    }

    if (this.searchQuery) {
      this._findPlace(this.searchQuery)
    } else {
      this.fetchDefaultLocationListings()
    }
  }

  initMap = () => {
    const $loadJs = document.getElementById('loadJS-mls-search-map')

    if ($loadJs) {
      $loadJs.parentElement.removeChild($loadJs)
    }

    this.setState({ isMapInitialized: true })
  }

  fetchDefaultLocationListings = () => {
    const isMapView = this.state.activeView === 'map'
    const fetchDallas = () => {
      if (isMapView) {
        this.initMap()
      } else {
        this.fetchDallasListings()
      }
    }

    if (!window.navigator.geolocation) {
      return fetchDallas()
    }

    this.setState({ isCalculatingLocation: true })

    const setOffIsCalculatingLocation = cb =>
      this.setState({ isCalculatingLocation: false }, cb)

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        setOffIsCalculatingLocation()

        const center = { lat, lng }

        const { dispatch } = this.props
        const { bounds, points } = getMapBoundsInCircle(center, RADIUS, true)
        const mapProps = {
          bounds: getBounds(bounds),
          center,
          zoom: mapInitialState.zoom
        }

        if (isMapView) {
          dispatch(setMapProps('search', mapProps))
          this.initMap()
        } else {
          batchActions([
            dispatch(
              searchActions.getListings.byValert({
                ...this.props.filterOptions,
                limit: 200,
                points
              })
            ),
            dispatch(setMapProps('search', mapProps))
          ])
        }

        setOffIsCalculatingLocation()
      },
      error => {
        console.log(getLocationErrorMessage(error))
        setOffIsCalculatingLocation(fetchDallas)
      },
      { timeout: 5000 }
    )
  }

  fetchDallasListings = () => {
    const { dispatch, filterOptions } = this.props

    dispatch(
      getListingsByValert({
        ...filterOptions,
        points: DALLAS_POINTS,
        limit: 200
      })
    )

    const bounds = new window.google.maps.LatLngBounds()

    filterOptions.points.forEach(({ latitude: lat, longitude: lng }) =>
      bounds.extend({ lat, lng })
    )

    batchActions([
      dispatch(searchActions.setSearchInput('Dallas TX, USA')),
      dispatch(searchActions.setSearchLocation(mapInitialState.center)),
      dispatch(
        setMapProps('search', {
          bounds: getBounds(bounds),
          center: mapInitialState.center,
          zoom: mapInitialState.zoom
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
        browserHistory.push(`/dashboard/mls?view=${activeView}`)
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

  formatAndAddDistance = (listing, center, user) =>
    addDistanceFromCenterToListing(
      formatListing(normalizeListingLocation(listing), user),
      center
    )

  onChangeSort = async e => {
    let sort = e.currentTarget.dataset.sort
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
        this.formatAndAddDistance(
          listing,
          this.props.mapCenter,
          this.props.user
        )
      )

      return formattedListings.sort((a, b) =>
        sortByIndex(a, b, index, ascending)
      )
    },
    (...args) => `${hash(args[0])}_${args[1]}_${args[2]}`
  )

  renderMain() {
    const sortedListings = this.sortListings(
      this.props.listings,
      this.state.activeSort.index,
      this.state.activeSort.ascending
    )

    const { isCalculatingLocation } = this.state
    const _props = {
      user: this.props.user,
      listings: this.props.listings,
      sortedListings,
      isFetching: this.props.isFetching || isCalculatingLocation,
      totalRows: this.props.listings.info.total
    }

    switch (this.state.activeView) {
      case 'map':
        return (
          <MapView
            {..._props}
            tabName="search"
            mapCenter={this.props.mapCenter}
            Map={
              this.state.isMapInitialized && !isCalculatingLocation ? (
                <Map {..._props} isWidget={this.props.isWidget} />
              ) : null
            }
          />
        )

      case 'grid':
        return <GridView {..._props} />

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
