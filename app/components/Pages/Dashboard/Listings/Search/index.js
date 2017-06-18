import _ from 'lodash'
import { connect } from 'react-redux'
import React, { Component } from 'react'

import Map from './components/Map'
import Loading from '../components/Loading'
import SearchToolbar from './components/SearchToolbar'
import ListingsPanel from '../components/ListingsPanels'
import { selectListings } from '../../../../../reducers/listings'

import getFavorites from '../../../../../store_actions/listings/favorites/get-favorites'
import getListingsByMapBounds from '../../../../../store_actions/listings/search/get-listings/by-map-bounds'

let mapOnChangeDebounce = 0

class Search extends Component {
  componentDidMount() {
    this._fetchFavorites()
  }

  componentWillReceiveProps(nextProps) {
    this._fetchSearchListings(nextProps)
  }

  _fetchSearchListings(nextProps) {
    const { mapProps: nextMapProps } = nextProps
    const { mapProps, getListingsByMapBounds } = this.props

    if (!_.isEqual(mapProps, nextMapProps)) {
      if (!mapOnChangeDebounce) {
        mapOnChangeDebounce = 1
        getListingsByMapBounds(nextMapProps.bounds)
      } else {
        clearTimeout(mapOnChangeDebounce)
        mapOnChangeDebounce = setTimeout(() => {
          getListingsByMapBounds(nextMapProps.bounds)
          clearTimeout(mapOnChangeDebounce)
        }, 300)
      }
    }
  }

  _fetchFavorites() {
    const { user, getFavorites, favoritesListings } = this.props

    if (user && !favoritesListings.length) {
      getFavorites(user)
    }
  }

  render() {
    const { data, searchListings, activePanel } = this.props
    return (
      <div className="l-listings__main clearfix">
        <div className="l-listings__map">
          <Map {...this.props} />
          <SearchToolbar />
        </div>
        <div className="l-listings__panel">
          <ListingsPanel
            data={data}
            tabName="SEARCH"
            listings={searchListings}
            activePanel={activePanel}
          />
        </div>
        {this.props.isFetching && <Loading text="MLS®" />}
      </div>
    )
  }
}

const mapStateToProps = ({ data, search, favorites }) => {
  const { listings: searchListings, map, panels } = search
  const { listings: favoritesListings } = favorites
  return {
    map,
    data,
    user: data.user,
    mapProps: map.props,
    activePanel: panels.activePanel,
    isFetching: searchListings.isFetching,
    favoritesListings: selectListings(favoritesListings),
    searchListings: {
      data: selectListings(searchListings),
      info: searchListings.info
    }
  }
}

export default connect(mapStateToProps, {
  getFavorites,
  getListingsByMapBounds
})(Search)
