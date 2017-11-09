// Widgets/Listings/index.js
import React, { Component } from 'react'
import S from 'shorti'
import ListingSection from './Partials/ListingSection'
import AppStore from '../../../../stores/AppStore'

export default class Listings extends Component {

  constructor(props) {
    super(props)
    this.updateHeight = this.updateHeight.bind(this)
    this.height = 0
  }
  componentWillMount() {
    AppStore.data.is_widget = true
    AppStore.emitChange()
  }

  componentDidUpdate() {
    this.updateHeight()
  }

  updateHeight() {
    if (this.parentDiv &&
      this.height !== this.parentDiv.scrollHeight) {
      parent.postMessage({ height: this.parentDiv.scrollHeight }, '*')
      this.height = this.parentDiv.scrollHeight
    }
  }
  render() {
    // Data
    const data = this.props.data
    let links_area = (
      <div>
        <div style={S('color-9b9b9b font-15 mb-40 mt-40')} className="text-center">
          Powered by <a href="https://rechat.com" target="_blank" style={S('color-2196f3 fw-500')}>
          Rechat<span style={S('color-2196f3 font-9 relative t-7n fw-500')}>TM</span></a>
        </div>
      </div>
    )
    return (
      <div
        className="futurastd"
        ref={ref => this.parentDiv = ref}
      >
        <ListingSection
          title="Exclusive Listings"
          data={data}
          type="active"
          updateHeight={this.updateHeight}
        />
        <div
          className="clearfix"
        />
        <ListingSection
          title="Sold"
          data={data}
          type="sold"
          updateHeight={this.updateHeight}
        />
        <div
          className="clearfix"
        />
        {links_area}
      </div>
    )
  }
}
// PropTypes
Listings.propTypes = {
  data: React.PropTypes.object,
  location: React.PropTypes.object
}
