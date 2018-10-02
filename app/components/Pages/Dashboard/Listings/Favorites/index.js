import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import getFavorites from '../../../../../store_actions/listings/favorites/get-favorites'
import { selectListings } from '../../../../../reducers/listings'

import Map from './Map'
import { Header } from '../components/PageHeader'
import { MapView } from '../components/MapView'
import { GridView } from '../components/GridView'
import { GalleryView } from '../components/GalleryView'

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
      browserHistory.push(`/dashboard/mls/following?view=${activeView}`)
    })
  }

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
        return <GalleryView isFetching={isFetching} listings={listings} />

      default:
        return <GridView isFetching={isFetching} listings={listings} />
    }
  }

  render() {
    return (
      <React.Fragment>
        <Header
          title="Following"
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
