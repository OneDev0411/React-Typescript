import { connect } from 'react-redux'
import React, { Component } from 'react'

import Map from './components/Map'
import Loading from '../components/Loading'
import ListingsPanel from '../components/ListingsPanels'
import getFavorites from '../../../../../store_actions/listings/favorites/get-favorites'
import { selectListings } from '../../../../../reducers/listings'

class Favorites extends Component {
  componentDidMount() {
    const { user, isFetching, getFavorites } = this.props

    if (user && !isFetching) {
      getFavorites(user)
    }
  }

  render() {
    const { user, listings, activePanel, isFetching } = this.props
    const isLoggedIn = user || false

    return (
      <div className="l-listings__main clearfix">
        <div className="l-listings__map">
          <Map markers={listings.data} />
          {isFetching && !listings.data.length && <Loading text="Favorites" />}
        </div>
        <div className="l-listings__panel">
          <ListingsPanel
            tabName="FAVORITES"
            listings={listings}
            isLoggedIn={isLoggedIn}
            activePanel={activePanel}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ data, favorites }) => {
  const { listings, panels } = favorites

  return {
    user: data.user,
    activePanel: panels.activePanel,
    isFetching: listings.isFetching,
    listings: {
      data: selectListings(listings),
      info: listings.info
    }
  }
}

export default connect(mapStateToProps, { getFavorites })(Favorites)
