// Widgets/Listings/index.js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import S from 'shorti'
import PropTypes from 'prop-types'
import ListingSection from './Partials/ListingSection'
import AppStore from '../../../../stores/AppStore'

class ListingsWidget extends Component {
  constructor(props) {
    super(props)
    this._updateHeight = this._updateHeight.bind(this)
    this.height = 0
  }

  componentDidUpdate() {
    this._updateHeight()
  }

  _updateHeight() {
    if (this.parentDiv &&
      this.height !== this.parentDiv.scrollHeight) {
      window.parent.postMessage({ height: this.parentDiv.scrollHeight }, '*')
      this.height = this.parentDiv.scrollHeight
    }
  }

  render() {
    const { user, data } = this.props

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
          user={user}
          type="active"
          updateHeight={this._updateHeight}
        />
        <div
          className="clearfix"
        />
        <ListingSection
          title="Sold"
          data={data}
          user={user}
          type="sold"
          updateHeight={this._updateHeight}
        />
        <div
          className="clearfix"
        />
        {links_area}
      </div>
    )
  }
}

ListingsWidget.propTypes = {
  data: PropTypes.object,
  user: PropTypes.object
}

export default connect(({ user, data }) => ({
  data,
  user
}))(ListingsWidget)