// Widgets/Map/index.js
import React, { Component } from 'react'
import AppStore from '../../../../stores/AppStore'
import SearchMap from '../../Dashboard/Mls'
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
export default class Listings extends Component {
  componentWillMount() {
    AppStore.data.is_widget = true
  }
  componentDidMount() {
    AppStore.data.show_search_map = true
    AppStore.emitChange()
  }
  componentDidUpdate() {
    const data = this.props.data
    // Override default listing query
    if (data.location && data.location.query && data.location.query.q && data.listing_map && data.listing_map.listings && !data.listing_map.query_search) {
      // Search listing map
      AppStore.data.listing_map.query_search = true
      AppStore.data.listing_map.is_loading = true
      delete AppStore.data.listing_map.listings_info
      AppStore.emitChange()
      const q = data.location.query.q
      // Check if MLS number
      if (!isNaN(q) && q.length > 7) {
        AppStore.data.listing_map.is_loading = true
        // console.log(place.name) // 13362991
        AppStore.data.listing_map.has_location_search = true
        AppStore.data.listing_map.auto_move = true
        const center = AppStore.data.listing_map.center
        AppStore.data.listing_map.location_search = {
          center
        }
        AppStore.emitChange()
        ListingDispatcher.dispatch({
          action: 'search-listing-map',
          user: AppStore.data.user,
          q
        })
        return
      }
      AppDispatcher.dispatch({
        action: 'geocode-address',
        address: q
      })
    }
  }
  render() {
    // Data
    const data = this.props.data
    return <SearchMap data={data} />
  }
}

// PropTypes
Listings.propTypes = {
  data: React.PropTypes.object
}