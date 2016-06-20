// Widgets/Map/index.js
import React, { Component } from 'react'
import AppStore from '../../../../stores/AppStore'
import SearchMap from '../../Dashboard/Mls'
export default class Listings extends Component {
  componentWillMount() {
    AppStore.data.theme = {
      primary: 'f47624'
    }
    AppStore.emitChange()
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