// Widgets/Listings/index.js
import React, { Component } from 'react'
import S from 'shorti'

import ListingSection from './Partials/ListingSection'

class ListingsWidget extends Component {
  state = {
    height: 0
  }

  componentDidUpdate() {
    this._updateHeight()
  }

  _updateHeight = () => {
    if (this.parentDiv && this.state.height !== this.parentDiv.scrollHeight) {
      this.setState(
        {
          height: this.parentDiv.scrollHeight
        },
        () =>
          window.parent.postMessage(
            { height: this.parentDiv.scrollHeight },
            '*'
          )
      )
    }
  }

  render() {
    let links_area = (
      <div>
        <div
          style={S('color-9b9b9b font-15 mb-40 mt-40')}
          className="text-center"
        >
          Powered by
          <a
            href="https://rechat.com"
            target="_blank"
            style={S('color-2196f3 fw-500')}
          >
            Rechat
            <span style={S('color-2196f3 font-9 relative t-7n fw-500')}>
              TM
            </span>
          </a>
        </div>
      </div>
    )

    return (
      <div ref={ref => (this.parentDiv = ref)}>
        <ListingSection
          title="Exclusive Listings"
          type="active"
          updateHeight={this._updateHeight}
        />
        <div className="clearfix" />
        <ListingSection
          title="Sold"
          type="sold"
          updateHeight={this._updateHeight}
        />
        <div className="clearfix" />
        {links_area}
      </div>
    )
  }
}

export default ListingsWidget
