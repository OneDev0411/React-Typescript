import React, { Component } from 'react'
import Tabs from './components/Tabs'
import { connect } from 'react-redux'
import { selectListings } from '../../../../reducers/listings'
import getFavorites from '../../../../store_actions/listings/favorites/get-favorites'

class Listings extends Component {
  componentDidMount() {
    this._fetchFavorites()
  }

  _fetchFavorites() {
    const { user, getFavorites, favoritesListings } = this.props

    if (user && !favoritesListings.length) {
      getFavorites(user)
    }
  }

  render() {
    const isLoggedIn = this.props.user || false

    return (
      <div className={`l-listings ${isLoggedIn ? 'l-listings--logged' : ''}`}>
        <header className="l-listings__header">
          <Tabs isLoggedIn={isLoggedIn} />
        </header>
        {this.props.children}
      </div>
    )
  }
}

export default connect(
  ({ data, favorites }) => ({
    user: data.user,
    favoritesListings: selectListings(favorites.listings)
  }),
  { getFavorites }
)(Listings)
