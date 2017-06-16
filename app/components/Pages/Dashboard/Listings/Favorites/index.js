import { connect } from 'react-redux'
import React, { Component } from 'react'

import Map from './components/Map'
import Loading from '../components/Loading'
import getFavorites from '../../../../../store_actions/listings/favorites/get-favorites'
import { selectListings } from '../../../../../reducers/listings'

class Favorites extends Component {
  componentDidMount() {
    const { user, listings, isFetching, getFavorites } = this.props

    if (user && !isFetching && !listings.length) {
      getFavorites(user)
    }
  }

  render() {
    const { listings, isFetching } = this.props

    return (
      <div>
        {isFetching && <Loading text="Favorites" />}
        <Map markers={listings} />
      </div>
    )
  }
}

const mapStateToProps = ({ data, favorites }) => {
  const { listings } = favorites
  return {
    user: data.user,
    listings: selectListings(listings),
    isFetching: listings.isFetching
  }
}

export default connect(mapStateToProps, { getFavorites })(Favorites)
