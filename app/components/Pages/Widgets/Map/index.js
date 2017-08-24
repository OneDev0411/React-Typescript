import { connect } from 'react-redux'
import React, { Component } from 'react'
import AppStore from '../../../../stores/AppStore'
import SearchMap from '../../Dashboard/Listings/Search'
import setWidget from '../../../../store_actions/widgets/setWidget'

class MapWidget extends Component {
  componentWillMount() {
    AppStore.data.is_widget = true
    this.props.setWidget(true)
  }

  render() {
    return (
      <div className="l-listings is-widget">
        <SearchMap isWidget />
      </div>
    )
  }
}

export default connect(null, { setWidget })(MapWidget)
