import { connect } from 'react-redux'
import React, { Component } from 'react'

import GMap from './components/GMap'
import Loading from '../components/Loading'
import * as actions from
  '../../../../../store_actions/listings/favorites'
import { getListings } from '../../../../../reducers/listings'

class Favorites extends Component {
  componentDidMount() {
    const {
      user,
      listings,
      isFetching,
      fetchFavorites
    } = this.props

    if (!isFetching && !listings.length) {
      fetchFavorites(user)
    }
  }

  render() {
    const { listings, isFetching } = this.props

    return (
      <div>
        {isFetching && <Loading text="Favorites" />}
        <GMap markers={listings} />
      </div>
    )
  }
}

const mapStateToProps = ({
  data,
  favorites
}) => {
  const { listings } = favorites
  return ({
    user: data.user,
    listings: getListings(listings),
    isFetching: listings.isFetching
  })
}

export default connect(
  mapStateToProps,
  actions
)(Favorites)
