import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { batchActions } from 'redux-batched-actions'
import memoize from 'lodash/memoize'

import hash from 'object-hash'

import { withStyles } from '@material-ui/core/styles'
import { Box, IconButton, Typography, Tooltip } from '@material-ui/core'
import MyLocation from '@material-ui/icons/MyLocation'

import GlobalPageLayout from 'components/GlobalPageLayout'

import { DALLAS_POINTS } from 'constants/listings/dallas-points'

import { putUserSetting } from 'models/user/put-user-setting'
import { getPlace } from 'models/listings/search/get-place'

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

import Autocomplete from './components/Autocomplete'

import {
  parsSortIndex,
  getDefaultSort,
  sortByIndex,
  getUserLastBrowsingLocation,
  SORT_FIELD_SETTING_KEY,
  LAST_BROWSING_LOCATION
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

const styles = theme => ({
  exploreContainer: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    paddingTop: 0,
    paddingBottom: 0
  },
  landingContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  landingSearchBox: {
    width: '80%',
    maxWidth: 600,
    marginTop: theme.spacing(10)
  }
})

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
    const userLastBrowsingLocation = getUserLastBrowsingLocation(
      this.props.user
    )

    this.state = {
      activeView,
      activeSort: {
        index,
        ascending
      },
      isGettingCurrentPosition: false,
      isMapInitialized: false,
      shareModalIsActive: false,
      userLastBrowsingLocation,
      firstRun:
        !userLastBrowsingLocation ||
        Object.keys(userLastBrowsingLocation).length == 0
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
    const { firstRun } = this.state

    if (firstRun) {
      return
    }

    if (this.props.listings.data.length > 0) {
      return this.state.activeView === 'map' ? this.initMap() : true
    }

    if (this.searchQuery) {
      this._findPlace(decodeURIComponent(this.searchQuery))
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

  goToCurrentPosition = () => {
    const { dispatch } = this.props

    if (!window.navigator.geolocation) {
      return dispatch(
        confirmation({
          confirmLabel: 'OK',
          message: 'Your device does not support Geolocation',
          hideCancelButton: true
        })
      )
    }

    this.setState({ isGettingCurrentPosition: true })

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        this.setState(
          {
            isGettingCurrentPosition: false,
            userLastBrowsingLocation: {
              zoom: 15,
              center: { lat, lng }
            }
          },
          this.initMap
        )
      },
      error => {
        console.log(error)
        console.log(getLocationErrorMessage(error))
        this.setState({ isGettingCurrentPosition: false })
        dispatch(
          confirmation({
            confirmLabel: 'OK',
            message: 'Your location is disabled',
            description:
              'Please check your browser’s setting and make sure ' +
              'your location sharing is on.',
            hideCancelButton: true
          })
        )
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

  updateUserLocation = gmap => {
    // Anonymous user's can also see /mls and explore the map
    // So updatingLastBrowsing location should not be run for them
    if (this.props.user) {
      putUserSetting(LAST_BROWSING_LOCATION, gmap)
      this.props.dispatch(getUserTeams(this.props.user))
    }
  }

  renderMain() {
    const sortedListings = this.sortListings(
      this.props.listings,
      this.state.activeSort.index,
      this.state.activeSort.ascending
    )

    const { isGettingCurrentPosition } = this.state
    const _props = {
      user: this.props.user,
      listings: this.props.listings,
      sortedListings,
      isFetching: this.props.isFetching || isGettingCurrentPosition,
      totalRows: this.props.listings.info.total,
      lastBrowsingLocation: this.state.userLastBrowsingLocation
    }

    switch (this.state.activeView) {
      case 'map':
        return (
          <MapView
            {..._props}
            tabName="search"
            mapCenter={this.props.mapCenter}
            Map={
              this.state.isMapInitialized && !isGettingCurrentPosition ? (
                <Map
                  {..._props}
                  isWidget={this.props.isWidget}
                  updateUserLocation={this.updateUserLocation}
                />
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

  renderExplorePage() {
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

  renderLadingPage() {
    const { classes } = this.props

    return (
      <Box className={classes.landingContainer}>
        <Box className={classes.landingSearchBox}>
          <Box my={4}>
            <Typography variant="h4" align="center">
              Where do you want to start?
            </Typography>
          </Box>
          <Box display="flex">
            <Box flexGrow={1}>
              <Autocomplete
                fullWidth
                landingPageSearch
                onSelectPlace={() => {
                  this.searchQuery = window.location.search.substring(3)
                  this.setState({ firstRun: false }, this.initialize)
                }}
              />
            </Box>
            <Tooltip title="Get your exact location on the map">
              <IconButton
                aria-label="locate me"
                onClick={() =>
                  this.setState({ firstRun: false }, this.goToCurrentPosition)
                }
              >
                <MyLocation />
              </IconButton>
            </Tooltip>
          </Box>
          <Box mt={1} textAlign="center">
            <img
              src="/static/images/properties/search-landing-bg.jpg"
              width="450"
              alt="Search properties"
            />
          </Box>
        </Box>
      </Box>
    )
  }

  render() {
    const { classes } = this.props
    const { firstRun } = this.state

    return (
      <GlobalPageLayout className={classes.exploreContainer}>
        {firstRun ? this.renderLadingPage() : this.renderExplorePage()}
      </GlobalPageLayout>
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

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps)(Search)
)

// todo: refactor initmap when there is a querystring
