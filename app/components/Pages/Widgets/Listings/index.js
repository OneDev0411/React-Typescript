// Widgets/Listings/index.js
import React, { Component } from 'react'
import S from 'shorti'
import ListingSection from './Partials/ListingSection'
import Brand from '../../../../controllers/Brand'
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
    if (this.height !== this.parentDiv.scrollHeight) {
      parent.postMessage({ height: this.parentDiv.scrollHeight }, '*')
      this.height = this.parentDiv.scrollHeight
    }
  }
  render() {
    // Data
    const data = this.props.data
    let view_all_button
    if (!data.location.query.all && Brand.asset('listing_url')) {
      view_all_button = (
        <div style={S('text-center mt-20 mb-30')}>
          <a
            target="_parent" href={Brand.asset('listing_url')} className="btn btn-default"
            style={S(`w-280 font-17 p-20 color-fff border-1-solid-${Brand.color('primary')} bg-${Brand.color('primary')}`)}
          >View Exclusive Listings</a>
        </div>
      )
    }
    let links_area = (
      <div>
        {view_all_button}
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
        {
          !this.props.location.query.agent &&
          <div style={S('text-center')}>
            <h1 style={S(`font-50 color-263445 mb-0${data.is_mobile ? ' ml-10 mr-10' : ''}`)}>Our Exclusive Listings</h1>
            <span style={S('h-1 bg-e2e2e2 w-80 m-20 inline-block')} />
          </div>
        }
        {/* <ListingSection*/}
        {/* title="open Houses"*/}
        {/* data={data}*/}
        {/* type="openHouses"*/}
        {/* />*/}
        <ListingSection
          title="Listings"
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
