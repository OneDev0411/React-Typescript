import _ from 'lodash'
import { connect } from 'react-redux'
import React, { Component } from 'react'

import Map from './components/Map'
import Filters from './components/Filters'
import Loading from '../components/Loading'
import SearchToolbar from './components/SearchToolbar'
import ListingsPanel from '../components/ListingsPanels'
import { selectListings } from '../../../../../reducers/listings'
import getListingsByMapBounds from '../../../../../store_actions/listings/search/get-listings/by-map-bounds'

let mapOnChangeDebounce = 0

class Search extends Component {
  componentWillReceiveProps(nextProps) {
    this._fetchListings(nextProps)
  }

  _fetchListings(nextProps) {
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

  render() {
    const {
      isLoggedIn,
      listings,
      activePanel,
      isFetching,
      filterAreaIsOpen
    } = this.props

    return (
      <div className="l-listings__main clearfix">
        <div className="l-listings__map">
          <Map {...this.props} />
          <SearchToolbar />
          <Filters isOpen={filterAreaIsOpen} />
          {isFetching && <Loading text="MLS®" />}
        </div>
        <div className="l-listings__panel">
          <ListingsPanel
            tabName="SEARCH"
            listings={listings}
            isLoggedIn={isLoggedIn}
            activePanel={activePanel}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ data, search }) => {
  const { listings, map, panels, filters } = search

  return {
    map,
    data,
    mapProps: map.props,
    isLoggedIn: data.user || false,
    activePanel: panels.activePanel,
    isFetching: listings.isFetching,
    filterAreaIsOpen: filters.isOpen,
    listings: {
      data: selectListings(listings),
      info: listings.info
    }
  }
}

export default connect(mapStateToProps, {
  getListingsByMapBounds
})(Search)
