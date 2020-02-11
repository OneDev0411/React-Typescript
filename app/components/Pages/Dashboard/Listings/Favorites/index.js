import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Helmet } from 'react-helmet'

import getFavorites from '../../../../../store_actions/listings/favorites/get-favorites'
import { selectListings } from '../../../../../reducers/listings'

import Map from './Map'
import { Header } from '../components/PageHeader'
import Tabs from '../components/Tabs'
import MapView from '../components/MapView'
import ListView from '../components/ListView'
import GridView from '../components/GridView'

class Favorites extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeView: props.location.query.view || 'map'
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
      browserHistory.push(`/dashboard/mls/favorites?view=${activeView}`)
    })
  }

  renderMain() {
    const { listings, isFetching } = this.props

    switch (this.state.activeView) {
      case 'map':
        return (
          <MapView
            tabName="favorites"
            listings={listings}
            Map={<Map markers={listings.data} isFetching={isFetching} />}
          />
        )

      case 'grid':
        return <GridView isFetching={isFetching} listings={listings} />

      default:
        return <ListView isFetching={isFetching} listings={listings} />
    }
  }

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>Favorites | Properties | Rechat</title>
        </Helmet>
        <Header title="Favorites" />
        <Tabs
          onChangeView={this.onChangeView}
          activeView={this.state.activeView}
        />
        {this.renderMain()}
      </React.Fragment>
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

export default connect(
  mapStateToProps,
  { getFavorites }
)(Favorites)
