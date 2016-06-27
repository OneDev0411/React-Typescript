// Widgets/Map/index.js
import React, { Component } from 'react'
import AppStore from '../../../../stores/AppStore'
import SearchMap from '../../Dashboard/Mls'
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
export default class Listings extends Component {
  componentWillMount() {
    AppStore.data.brand = {
      primary: '2196f3'
    }
    AppStore.data.is_widget = true
    AppStore.emitChange()
    let subdomain = window.location.host.split('.')[0]
    if (window.location.host.indexOf('.') === -1)
      subdomain = 'claystapp'
    AppDispatcher.dispatch({
      action: 'get-branding',
      subdomain
    })
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
      ListingDispatcher.dispatch({
        action: 'search-listing-map',
        q,
        user: data.user
      })
    }
  }
  render() {
    // Data
    const data = this.props.data
    return <SearchMap data={ data }/>
  }
}

// PropTypes
Listings.propTypes = {
  data: React.PropTypes.object
}