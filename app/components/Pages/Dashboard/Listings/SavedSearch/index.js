import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory, withRouter } from 'react-router'
import { Helmet } from 'react-helmet'
import idx from 'idx'

import { getSavedSearchListings } from '../../../../../models/listings/alerts/get-alert-listings'
import { selectAlert } from '../../../../../reducers/listings/alerts/list'

import Map from './Map'
import { Header } from '../components/PageHeader'
import MapView from '../components/MapView'
import ListView from '../components/ListView'
import GridView from '../components/GridView'
import Avatars from '../../../../../views/components/Avatars'

import { formatListing } from '../helpers/format-listing'
import { normalizeListingLocation } from '../../../../../utils/map'

const mappingStatus = status => {
  switch (status) {
    case 'New':
      return 'Have not Seen'
    case 'PriceDrop':
      return 'PRICE DROP'
    case 'StatusChange':
      return 'STATUS CHANGE'
    case 'OpenHouseAvailable':
      return 'OPEN HOUSE'
    default:
      return ''
  }
}

const normalize = rec => ({
  ...rec.listing,
  recId: rec.id,
  recRoom: rec.room,
  new: mappingStatus(rec.last_update),
  lat: rec.listing.property.address.location.latitude,
  lng: rec.listing.property.address.location.longitude
})

const propTypes = {
  savedSearch: PropTypes.shape(),
  location: PropTypes.shape().isRequired,
  isSideMenuOpen: PropTypes.bool,
  toggleSideMenu: PropTypes.func.isRequired
}

const defaultProps = {
  savedSearch: {
    title: '',
    proposed_title: '',
    users: []
  },
  isSideMenuOpen: true
}

class SavedSearch extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      listings: {
        data: [],
        info: { total: 0 }
      },
      activeSort: {
        index: 'price',
        isDescending: true
      },
      isFetching: false,
      activeView: props.location.query.view || 'map'
    }
  }

  componentDidMount() {
    this.fetchListings()
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.id !== prevProps.params.id) {
      this.fetchListings()
    }
  }

  fetchListings = async () => {
    const { savedSearch } = this.props

    try {
      this.setState({ isFetching: true })

      const response = await getSavedSearchListings(
        savedSearch.id,
        savedSearch.room
      )

      this.setState({
        listings: {
          data: response.data.map(normalize),
          info: { total: response.info.total }
        },
        isFetching: false
      })
    } catch (error) {
      console.log(error)
      this.setState({ isFetching: false })
    }
  }

  onChangeView = e => {
    const activeView = e.currentTarget.dataset.view

    this.setState({ activeView }, () => {
      browserHistory.push(
        `/dashboard/mls/saved-searches/${
          this.props.savedSearch.id
        }?view=${activeView}`
      )
    })
  }

  addListingsDistanceFromCenter = (listing, center) => {
    if (!center || !idx(window, w => w.google.maps.geometry)) {
      return listing
    }

    const { google } = window

    const centerLatLng = new google.maps.LatLng(center.lat, center.lng)

    const listingLocation = new google.maps.LatLng(listing.lat, listing.lng)

    const distanceFromCenter = google.maps.geometry.spherical.computeDistanceBetween(
      centerLatLng,
      listingLocation
    )

    return {
      ...listing,
      distanceFromCenter
    }
  }

  format = (listing, center, user) =>
    this.addListingsDistanceFromCenter(
      formatListing(normalizeListingLocation(listing), user),
      center
    )

  sortBy = (a, b, index, isDescending) =>
    isDescending ? a[index] - b[index] : b[index] - a[index]

  sortListings = listings => {
    const formattedListings = listings.data.map(listing =>
      this.format(listing, this.props.mapCenter, this.props.user)
    )

    return formattedListings.sort((a, b) =>
      this.sortBy(
        a,
        b,
        this.state.activeSort.index,
        this.state.activeSort.isDescending
      )
    )
  }

  renderMain() {
    const { listings, isFetching } = this.state

    const sortedListings = this.sortListings(listings)

    switch (this.state.activeView) {
      case 'map':
        return (
          <MapView
            tabName="alerts"
            sortedListings={sortedListings}
            Map={
              <Map
                savedSearch={this.props.savedSearch}
                markers={listings.data}
                isFetching={isFetching}
              />
            }
          />
        )

      case 'grid':
        return <GridView isFetching={isFetching} listings={listings} />

      default:
        return <ListView isFetching={isFetching} listings={listings} />
    }
  }

  render() {
    const { props } = this
    const { title } = props.savedSearch

    return (
      <React.Fragment>
        <Helmet>
          <title> {title && `${`${title} | `}`}Properties | Rechat</title>
        </Helmet>
        <Header
          title={title}
          subtitle={props.savedSearch.proposed_title}
          onChangeView={this.onChangeView}
          activeView={this.state.activeView}
          isSideMenuOpen={props.isSideMenuOpen}
          toggleSideMenu={props.toggleSideMenu}
          RightComponent={() => (
            <Avatars
              users={props.savedSearch.users}
              style={{ marginRight: '2rem' }}
              tooltipPlacement="bottom"
            />
          )}
        />
        {this.renderMain()}
      </React.Fragment>
    )
  }
}

SavedSearch.propTypes = propTypes
SavedSearch.defaultProps = defaultProps

const mapStateToProps = (state, props) => ({
  savedSearch: selectAlert(state.alerts.list, props.params.id)
})

export default withRouter(connect(mapStateToProps)(SavedSearch))
