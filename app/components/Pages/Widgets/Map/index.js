// Widgets/Map/index.js
import React, { Component } from 'react'
import AppStore from '../../../../stores/AppStore'
import SearchMap from '../../Dashboard/Mls'
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
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