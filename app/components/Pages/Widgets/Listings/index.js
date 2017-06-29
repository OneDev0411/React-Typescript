// Widgets/Listings/index.js
import React from 'react'
import S from 'shorti'
import ListingSection from './Partials/ListingSection'
import Brand from '../../../../controllers/Brand'

const Listings = (props) => {
  // Data
  const data = props.data
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
      <ListingSection
        title="Listings"
        data={data}
        type="active"
      />
      <div className="clearfix" />
      <ListingSection
        title="Sold"
        data={data}
        type="sold"
      />
      <div className="clearfix" />
      {links_area}
    </div>
  )
}
export default Listings
// PropTypes
Listings.propTypes = {
  data: React.PropTypes.object,
  location: React.PropTypes.object
}
