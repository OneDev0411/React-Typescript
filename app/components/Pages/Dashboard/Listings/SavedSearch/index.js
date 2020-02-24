import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory, withRouter } from 'react-router'
import { Helmet } from 'react-helmet'

import { getSavedSearchListings } from '../../../../../models/listings/alerts/get-alert-listings'
import { selectAlert } from '../../../../../reducers/listings/alerts/list'

import {
  parsSortIndex,
  getDefaultSort,
  sortByIndex,
  SORT_FIELD_SETTING_KEY
} from '../helpers/sort-utils'

import Map from './Map'
import { Header } from '../components/PageHeader'
import MapView from '../components/MapView'
import ListView from '../components/ListView'
import GridView from '../components/GridView'
import Avatars from '../../../../../views/components/Avatars'

import {
  formatListing,
  addDistanceFromCenterToListing
} from '../helpers/format-listing'
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

  format = (listing, center, user) =>
    addDistanceFromCenterToListing(
      formatListing(normalizeListingLocation(listing), user),
      center
    )

  sortListings = listings => {
    const formattedListings = listings.data.map(listing =>
      this.format(listing, this.props.mapCenter, this.props.user)
    )

    return formattedListings.sort((a, b) =>
      sortByIndex(
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
        return (
          <GridView isFetching={isFetching} sortedListings={sortedListings} />
        )

      default:
        return (
          <ListView
            isFetching={isFetching}
            sortedListings={sortedListings}
            listings={listings}
          />
        )
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
