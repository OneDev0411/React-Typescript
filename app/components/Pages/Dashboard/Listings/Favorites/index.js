import { connect } from 'react-redux'
import React, { Component } from 'react'

import GMap from './GMap'
import * as actions from
  '../../../../../store_actions/listings/favorites'
import { getListings } from '../../../../../reducers/listings'

class Favorites extends Component {
  componentDidMount() {
    const {
      listings,
      isFetching
    } = this.props

    if (!isFetching && !listings.length) {
      this.fetchData()
    }
  }

  fetchData() {
    const {
      user,
      fetchFavorites
    } = this.props

    fetchFavorites(user)
  }

  render() {
    const {
      listings,
      isFetching,
      errorMessage
    } = this.props

    // if (isFetching && !listings.length) {
    //   return <p><b>Loading listings...</b></p>
    // }

    /*if (errorMessage && !listings.length) {
      return (
        <FetchError />
      )
    }*/

    return <GMap listings={listings} />
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
    errorMessage: listings.errorMessage,
    isFetching: listings.isFetching
  })
}

export default connect(
  mapStateToProps,
  actions
)(Favorites)
