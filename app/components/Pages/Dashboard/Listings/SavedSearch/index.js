import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory, withRouter } from 'react-router'
import { Helmet } from 'react-helmet'
import memoize from 'lodash/memoize'
import { withStyles } from '@material-ui/core/styles'
import hash from 'object-hash'

import GlobalPageLayout from 'components/GlobalPageLayout'

import { putUserSetting } from 'models/user/put-user-setting'

import { getUserTeams } from 'actions/user/teams'

import { getSavedSearchListings } from '../../../../../models/listings/alerts/get-alert-listings'
import { selectAlert } from '../../../../../reducers/listings/alerts/list'
import getAlerts from '../../../../../store_actions/listings/alerts/get-alerts'

import {
  parsSortIndex,
  getDefaultSort,
  sortByIndex,
  SORT_FIELD_SETTING_KEY
} from '../helpers/sort-utils'

import Tabs from '../components/Tabs'

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
  location: PropTypes.shape().isRequired
}

const defaultProps = {
  savedSearch: {
    title: '',
    proposed_title: '',
    users: []
  }
}

const styles = () => ({
  mlsContainer: {
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
    paddingTop: 0,
    paddingBottom: 0
  }
})

class SavedSearch extends React.Component {
  constructor(props) {
    super(props)

    const { index, ascending } = parsSortIndex(getDefaultSort(this.props.user))

    this.state = {
      listings: {
        data: [],
        info: { total: 0 }
      },
      activeSort: {
        index,
        ascending
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
    await this.props.dispatch(getAlerts())

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
        `/dashboard/mls/saved-searches/${this.props.savedSearch.id}?view=${activeView}`
      )
    })
  }

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
    // Since listings are equal during renders and are read from this.state
    // in order to make memoization work properly, we need to build a custom
    // resolver function which makes a unique key for a specific saved search id,
    // index and sort direction and returns the previously calculated items once it's
    // called.
    (...args) => `${hash(args[0])}_${args[1]}_${args[2]}`
  )

  renderMain() {
    const { user } = this.props
    const { listings, isFetching } = this.state

    const sortedListings = this.sortListings(
      listings,
      this.state.activeSort.index,
      this.state.activeSort.ascending
    )

    switch (this.state.activeView) {
      case 'map':
        return (
          <MapView
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
            user={user}
          />
        )
    }
  }

  render() {
    const { title } = this.props.savedSearch
    const { classes } = this.props

    return (
      <>
        <Helmet>
          <title> {title && `${`${title} | `}`}Properties | Rechat</title>
        </Helmet>
        <GlobalPageLayout className={classes.mlsContainer}>
          <Header
            title={title}
            subtitle={this.props.savedSearch.proposed_title}
            RightComponent={() => (
              <Avatars
                users={this.props.savedSearch.users}
                style={{ marginRight: '2rem' }}
                tooltipPlacement="bottom"
              />
            )}
          />
          <Tabs
            user={this.props.user}
            onChangeView={this.onChangeView}
            onChangeSort={this.onChangeSort}
            activeView={this.state.activeView}
            isWidget={this.props.isWidget}
            activeSort={this.state.activeSort}
          />
          {this.renderMain()}
        </GlobalPageLayout>
      </>
    )
  }
}

SavedSearch.propTypes = propTypes
SavedSearch.defaultProps = defaultProps

const mapStateToProps = ({ alerts, user }, props) => ({
  savedSearch: selectAlert(alerts.list, props.params.id),
  user
})

export default withStyles(styles, { withTheme: true })(
  withRouter(connect(mapStateToProps)(SavedSearch))
)
