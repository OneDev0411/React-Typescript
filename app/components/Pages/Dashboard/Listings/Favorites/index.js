import { connect } from 'react-redux'
import React, { Component } from 'react'

import getFavorites from '../../../../../store_actions/listings/favorites/get-favorites'
import { selectListings } from '../../../../../reducers/listings'

import Map from './Map'
import { Header } from './Header'
import { MapView } from '../components/MapView'

class Favorites extends Component {
  state = {
    activeView: 'map'
  }
  componentDidMount() {
    const { user, isFetching, getFavorites } = this.props

    if (user && !isFetching) {
      getFavorites(user)
    }
  }

  onChangeView = e =>
    this.setState({ activeView: e.currentTarget.dataset.view })

  renderMain() {
    const _props = {
      listings: this.props.listings,
      isFetching: this.props.isFetching
    }

    switch (this.state.activeView) {
      case 'grid':
        return 'grid'

      case 'map':
        return (
          <MapView
            listings={_props.listings}
            Map={
              this.state.mapWithQueryIsInitialized ? <Map {..._props} /> : null
            }
          />
        )

      case 'gallery':
        return 'gallery'

      default:
        return 'grid'
    }
  }

  render() {
    return (
      <React.Fragment>
        <Header
          user={this.props.user}
          activeView={this.state.activeView}
          isSideMenuOpen={this.props.isSideMenuOpen}
          toggleSideMenu={this.props.toggleSideMenu}
          onChangeView={this.onChangeView}
        />
        {this.renderMain()}
      </React.Fragment>
    )
  }
}

const mapStateToProps = ({ data, favorites }) => {
  const { listings } = favorites

  return {
    user: data.user,
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
