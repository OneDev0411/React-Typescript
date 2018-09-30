import { connect } from 'react-redux'
import React, { Component } from 'react'

import getFavorites from '../../../../../store_actions/listings/favorites/get-favorites'
import { selectListings } from '../../../../../reducers/listings'

import Map from './Map'
import { Header } from './Header'
import { MapView } from '../components/MapView'
import { GridView } from '../components/GridView'

class Favorites extends Component {
  state = {
    activeView: 'map'
  }

  componentDidMount() {
    const { user } = this.props

    if (user && !this.props.isFetching) {
      this.props.getFavorites(user)
    }
  }

  onChangeView = e =>
    this.setState({ activeView: e.currentTarget.dataset.view })

  renderMain() {
    const { listings, isFetching } = this.props

    switch (this.state.activeView) {
      case 'map':
        return (
          <MapView
            listings={listings}
            Map={<Map markers={listings.data} isFetching={isFetching} />}
          />
        )

      case 'gallery':
        return 'gallery'

      default:
        return <GridView idFetching={isFetching} listings={listings} />
    }
  }

  render() {
    return (
      <React.Fragment>
        <Header
          user={this.props.user}
          onChangeView={this.onChangeView}
          activeView={this.state.activeView}
          isSideMenuOpen={this.props.isSideMenuOpen}
          toggleSideMenu={this.props.toggleSideMenu}
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
