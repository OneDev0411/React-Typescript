import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import memoize from 'lodash/memoize'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import { getUserTeams } from 'actions/user/teams'
import GlobalPageLayout from 'components/GlobalPageLayout'
import { putUserSetting } from 'models/user/put-user-setting'
import { normalizeListingLocation } from 'utils/map'

import { selectListings } from '../../../../../reducers/listings'
import getFavorites from '../../../../../store_actions/listings/favorites/get-favorites'
import ListView from '../components/ListView'
import MapView from '../components/MapView'
import { Header } from '../components/PageHeader'
import Tabs from '../components/Tabs'
import { formatListing } from '../helpers/format-listing'
import {
  parsSortIndex,
  getDefaultSort,
  sortByIndex,
  SORT_FIELD_SETTING_KEY
} from '../helpers/sort-utils'

import Map from './Map'

const styles = () => ({
  mlsContainer: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    paddingTop: 0,
    paddingBottom: 0
  }
})

class Favorites extends React.Component {
  constructor(props) {
    super(props)

    const { index, ascending } = parsSortIndex(getDefaultSort(this.props.user))

    this.state = {
      activeView: props.location.query.view || 'map',
      activeSort: {
        index,
        ascending
      }
    }
  }

  componentDidMount() {
    const { user } = this.props

    if (user && !this.props.isFetching) {
      this.props.getFavorites(user)
    }
  }

  onChangeView = e => {
    const activeView = e.currentTarget.dataset.view

    this.setState({ activeView }, () => {
      browserHistory.push(`/dashboard/properties/favorites?view=${activeView}`)
    })
  }

  sortListings = memoize((listings, index, ascending) => {
    const formattedListings = listings.data.map(listing =>
      formatListing(normalizeListingLocation(listing), this.props.user)
    )

    return formattedListings.sort((a, b) => sortByIndex(a, b, index, ascending))
  })

  onChangeSort = async sort => {
    const { index, ascending } = parsSortIndex(sort)

    this.setState({
      activeSort: {
        index,
        ascending
      }
    })
    await putUserSetting(SORT_FIELD_SETTING_KEY, sort)
    this.props.getUserTeams(this.props.user)
  }

  renderMain() {
    const { listings, isFetching, user } = this.props

    const sortedListings = this.sortListings(
      listings,
      this.state.activeSort.index,
      this.state.activeSort.ascending
    )

    switch (this.state.activeView) {
      case 'map':
        return (
          <MapView
            user={user}
            tabName="favorites"
            sortedListings={sortedListings}
            Map={<Map markers={listings.data} isFetching={isFetching} />}
          />
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
    const { classes } = this.props

    return (
      <>
        <Helmet>
          <title>Favorites | Properties | Rechat</title>
        </Helmet>
        <GlobalPageLayout className={classes.mlsContainer}>
          <Header title="Favorites" />
          <Tabs
            onChangeView={this.onChangeView}
            activeView={this.state.activeView}
            onChangeSort={this.onChangeSort}
            activeSort={this.state.activeSort}
            user={this.props.user}
          />
          {this.renderMain()}
        </GlobalPageLayout>
      </>
    )
  }
}

const mapStateToProps = state => {
  const { listings } = state.favorites

  return {
    user: state.user,
    isFetching: listings.isFetching,
    listings: {
      data: selectListings(listings),
      info: listings.info
    }
  }
}

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, { getFavorites, getUserTeams })(Favorites)
)
