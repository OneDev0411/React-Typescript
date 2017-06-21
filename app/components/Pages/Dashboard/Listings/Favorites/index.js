import { connect } from 'react-redux'
import React, { Component } from 'react'

import Map from './components/Map'
import Loading from '../components/Loading'
import ListingsPanel from '../components/ListingsPanels'
import getFavorites from '../../../../../store_actions/listings/favorites/get-favorites'
import { selectListings } from '../../../../../reducers/listings'

class Favorites extends Component {
  componentDidMount() {
    const { data, listings, isFetching, getFavorites } = this.props
    const { user } = data

    if (user && !isFetching && !listings.data.length) {
      getFavorites(user)
    }
  }

  render() {
    const { data, listings, activePanel, isFetching } = this.props

    return (
      <div className="l-listings__main clearfix">
        <div className="l-listings__map">
          <Map markers={listings.data} />
          {isFetching && <Loading text="Favorites" />}
        </div>
        <div className="l-listings__panel">
          <ListingsPanel
            data={data}
            tabName="FAVORITE"
            listings={listings}
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
    data,
    activePanel: panels.activePanel,
    isFetching: listings.isFetching,
    listings: {
      data: selectListings(listings),
      info: listings.info
    }
  }
}

export default connect(mapStateToProps, { getFavorites })(Favorites)
