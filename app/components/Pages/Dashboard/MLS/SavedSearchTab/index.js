import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import memoize from 'lodash/memoize'
import hash from 'object-hash'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { browserHistory, withRouter } from 'react-router'

import {
  sortListingsByIndex,
  parseSortIndex,
  getDefaultSort,
  SORT_FIELD_SETTING_KEY
} from '@app/components/Pages/Dashboard/MLS/helpers/sort-utils'
import { getSavedSearchListings } from '@app/models/listings/alerts/get-alert-listings'
import { selectAlert } from '@app/reducers/listings/alerts/list'
import { setActiveTeamSetting } from '@app/store_actions/active-team'
import getAlerts from '@app/store_actions/listings/alerts/get-alerts'
import { changeUrl } from '@app/utils/change-url'
import Avatars from '@app/views/components/Avatars'
import GlobalPageLayout from '@app/views/components/GlobalPageLayout'

import ListView from '../components/ListView'
import MapView from '../components/MapView'
import { Header } from '../components/PageHeader'
import Tabs from '../components/Tabs'
import { DEFAULT_VIEW } from '../constants'

import Map from './Map'

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
    minHeight: '100vh',
    flexDirection: 'column',
    paddingTop: 0,
    paddingBottom: 0
  }
})

class SavedSearch extends React.Component {
  constructor(props) {
    super(props)

    const { index, ascending } = parseSortIndex(
      getDefaultSort(this.props.activeTeam)
    )

    this.state = {
      listings: {
        data: [],
        info: { count: 0, total: 0 }
      },
      activeSort: {
        index,
        ascending
      },
      isFetching: false,
      activeView: props.location.query.view || DEFAULT_VIEW
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
          info: response.info
        },
        isFetching: false
      })
    } catch (error) {
      console.log(error)
      this.setState({ isFetching: false })
    }
  }

  onToggleView = to => {
    const activeView = to

    this.setState({ activeView: to }, () => {
      browserHistory.push(
        // eslint-disable-next-line max-len
        `/dashboard/mls/saved-searches/${this.props.savedSearch.id}?view=${activeView}`
      )
    })
  }

  onChangeSort = async sort => {
    const { index, ascending } = parseSortIndex(sort)

    this.setState({
      activeSort: {
        index,
        ascending
      }
    })
    this.props.dispatch(setActiveTeamSetting(SORT_FIELD_SETTING_KEY, sort))
  }

  onToggleListingModal = (id, isOpen) => {
    if (!this.props.isWidget) {
      if (isOpen) {
        changeUrl(`/dashboard/mls/${id}`)
      } else {
        // Inject view param to url
        const viewQueryParam =
          this.state.activeView !== DEFAULT_VIEW
            ? { view: this.state.activeView }
            : {}

        changeUrl(
          `/dashboard/mls/saved-searches/${this.props.params.id}`,
          viewQueryParam
        )
      }
    }
  }

  sortListings = memoize(
    (listings, index, ascending) => {
      return sortListingsByIndex(listings, index, ascending)
    },
    // Since listings are equal during renders and are read from this.state
    // in order to make memoization work properly, we need to build a custom
    // resolver function which makes a unique key for a specific saved search id,
    // index and sort direction and returns the previously calculated items once it's
    // called.
    (...args) => `${hash(args[0])}_${args[1]}_${args[2]}`
  )

  renderMain() {
    const { listings, isFetching } = this.state

    const sortedListings = this.sortListings(
      listings.data,
      this.state.activeSort.index,
      this.state.activeSort.ascending
    )

    switch (this.state.activeView) {
      case 'cards':
        return (
          <MapView
            info={this.state.listings.info}
            isFetching={isFetching}
            sortedListings={sortedListings}
            onToggleView={this.onToggleView}
            onChangeSort={this.onChangeSort}
            activeSort={this.state.activeSort}
            onToggleListingModal={this.onToggleListingModal}
            Map={
              <Map
                savedSearch={this.props.savedSearch}
                markers={listings.data}
                isFetching={isFetching}
              />
            }
          />
        )

      default:
        return (
          <ListView
            isFetching={isFetching}
            info={this.state.listings.info}
            sortedListings={sortedListings}
            listings={listings}
            onToggleView={this.onToggleView}
            onChangeSort={this.onChangeSort}
            activeSort={this.state.activeSort}
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
            onToggleView={this.onToggleView}
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

const mapStateToProps = ({ alerts, user, activeTeam }, props) => ({
  savedSearch: selectAlert(alerts.list, props.params.id),
  activeTeam,
  user
})

export default withStyles(styles, { withTheme: true })(
  withRouter(connect(mapStateToProps)(SavedSearch))
)
