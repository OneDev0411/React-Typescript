// ListingViewer.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Col, Carousel, CarouselItem, OverlayTrigger, Tooltip, Modal, Button } from 'react-bootstrap'
import _ from 'lodash'
import S from 'shorti'
import helpers from '../../../../utils/helpers'
import listing_util from '../../../../utils/listing'
import Loading from '../../../Partials/Loading'
import ShareListingModal from './ShareListingModal'
import ListingMapMarker from './ListingMapMarker'
import ListingMarker from './ListingMarker'
import FavoriteHeart from '../Listings/components/FavoriteHeart'
import controller from '../controller'
import GoogleMap from 'google-map-react'
import Brand from '../../../../controllers/Brand.js'
import config from '../../../../../config/public'
// import ChatModule from './ChatModule'
// import ActionBubble from '../../Partials/ActionBubble'
export default class ListingViewer extends Component {
  componentDidMount() {
    document.onkeydown = (e) => {
      const { data } = this.props
      if (e.keyCode === 27 && !data.show_share_listing_modal && !data.fucking_listing_modal_is_active) {
        if (!data.show_modal_gallery)
          this.props.hideListingViewer()
        this.props.hideModal()
      }
      const modal_gallery = data.modal_gallery
      if (modal_gallery) {
        if (e.keyCode === 37)
          this.props.handleModalGalleryNav(null, 'prev')
        if (e.keyCode === 39)
          this.props.handleModalGalleryNav(null, 'next')
      }
    }
    if (typeof window !== 'undefined') {
      const clipboard = require('clipboard')
      new clipboard('.copy-mls')
    }
    this.fadeIn()
  }
  componentWillUnmount() {
    // Reinit google search if on map
    setTimeout(() => {
      if (document.getElementById('google_search'))
        controller.search_input_map.initGoogleSearch()
    }, 300)
  }
  fadeIn() {
    const elem = ReactDOM.findDOMNode(this)

    if (!elem)
      return

    elem.style.opacity = 0
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        elem.style.transition = 'opacity 150ms'
        elem.style.opacity = 1
      })
    }
  }
  handleActivateAccountClick() {
    if (typeof window !== 'undefined') {
      window.location.href = `/password/create${window.location.search}`
    }
  }
  render() {
    // Listing modal
    const data = this.props.data
    const listing = this.props.listing
    const user = data.user
    const brand_agent = listing.proposed_agent

    let viewer_width = 0
    if (typeof window !== 'undefined') {
      viewer_width = window.innerWidth - 70
      if (!user)
        viewer_width = window.innerWidth
    }
    let current_slide
    if (listing)
      current_slide = listing.current_slide
    if (!current_slide)
      current_slide = 0
    let property
    let year_built
    let address
    let listing_title
    let listing_subtitle
    let mls_number
    let bedroom_count
    let bathroom_count
    let square_feet
    let lot_size
    let prev_icon
    let next_icon
    let description
    let price
    let price_sq_foot
    let listing_images = (
      <div style={S('bg-eff1f2 w-100p h-300 font-22 text-center pt-125 color-929292')}>No image</div>
    )
    let main_content = <Loading />
    if (listing && listing.property) {
      property = listing.property
      price = listing.price
      if (listing.close_price && user && user.user_type === 'Agent')
        price = listing.close_price
      price = helpers.numberWithCommas(price)
      year_built = property.year_built
      address = listing_util.addressTitle(property.address)
      listing_title = address
      mls_number = listing.mls_number
      bedroom_count = property.bedroom_count
      bathroom_count = property.bathroom_count
      square_feet = helpers.numberWithCommas(Math.floor(listing_util.metersToFeet(property.square_meters)))
      if (property.square_meters)
        price_sq_foot = (Number(price.replace(/,/g, '')) / Number(square_feet.replace(/,/g, ''))).toFixed(2)
      if (property.lot_size_area)
        lot_size = property.lot_size_area
      prev_icon = '<'
      next_icon = '>'
      description = property.description
      const gallery_image_urls = listing.gallery_image_urls
      const gallery_chunks = _.chunk(gallery_image_urls, 4)
      listing_images = (
        <Carousel className="listing-viewer__carousel" interval={0} indicators={false} prevIcon={prev_icon} nextIcon={next_icon}>
          {
            gallery_chunks.map((gallery_image_url, i) => (
              <CarouselItem className="listing-carousel__item" key={`gallery-images-chunked-${gallery_image_url[0]}${i}`}>
                <div onClick={this.props.showModalGallery.bind(this, gallery_image_url[0])} style={S(`border-right-1-solid-fff w-${viewer_width / 4} h-300 pull-left text-center bg-efefef bg-cover bg-center bg-url(${gallery_image_url[0]})`)} />
                <div onClick={this.props.showModalGallery.bind(this, gallery_image_url[1])} style={S(`border-right-1-solid-fff w-${viewer_width / 4} h-300 pull-left text-center bg-efefef bg-cover bg-center bg-url(${gallery_image_url[1]})`)} />
                <div onClick={this.props.showModalGallery.bind(this, gallery_image_url[2])} style={S(`border-right-1-solid-fff w-${viewer_width / 4} h-300 pull-left text-center bg-efefef bg-cover bg-center bg-url(${gallery_image_url[2]})`)} />
                <div onClick={this.props.showModalGallery.bind(this, gallery_image_url[3])} style={S(`w-${viewer_width / 4} h-300 pull-left text-center bg-efefef bg-cover bg-center bg-url(${gallery_image_url[3]})`)} />
              </CarouselItem>
              ))
          }
        </Carousel>
      )
      // Cache images for uninteruted 3-pic and single scroll
      const listing_images_cached = gallery_image_urls.map((image_url, i) => (
        <div key={`cached-images-${i}`} style={S('w-0 h-0')}>
          <img key={`image-800-${i}`} src={`${image_url}?w=800`} style={S('w-0 h-0')} />
          <img key={`image-1200-${i}`} src={`${image_url}?w=1200`} style={S('w-0 h-0')} />
        </div>
        ))
      listing_subtitle = `${listing.property.address.city}, ${listing.property.address.state} ${listing.property.address.postal_code}`
      const status_color = listing_util.getStatusColor(listing.status)
      let sold_date
      if (listing.close_date) {
        const sold_date_obj = helpers.friendlyDate(listing.close_date)
        sold_date = `${sold_date_obj.month} ${sold_date_obj.date}, ${sold_date_obj.year}`
      }
      const listing_status_indicator = (
        <div className="pull-left" style={S(`border-1-solid-${status_color} font-14 color-fff relative br-3 pt-5 pb-5 pl-10 pr-10 mt-3 bg-${status_color}`)}>
          { listing.status } { sold_date }
        </div>
      )
      // let number_days_indicator
      // if (listing.list_date) {
      //   const days_on_market = listing_util.getDOM(listing.dom)
      //   number_days_indicator = (
      //     <div className="pull-left" style={S('border-1-solid-263445 br-3 pt-5 pb-5 pl-10 pr-10 mt-3 font-14')}>
      //       { days_on_market } days ago
      //     </div>
      //   )
      // }
      const tooltip = (
        <Tooltip id="copied-tooltip">
          Copied
        </Tooltip>
      )
      let mls_link
      if (mls_number) {
        mls_link = (
          <span>
            | MLS#:&nbsp;
            <OverlayTrigger rootClose trigger="click" placement="bottom" overlay={tooltip}>
              <span style={S('color-8ba8d1 pointer')} className="copy-mls" data-clipboard-text={mls_number}>{ mls_number }</span>
            </OverlayTrigger>
          </span>
        )
      }
      let lot_size_area
      if (lot_size) {
        lot_size_area = (
          <span>
            &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
            <span>{ lot_size ? `Lot size ${lot_size}` : '' }</span>
          </span>
        )
      }
      // Agent info
      let brand_agent_area
      if (brand_agent) {
        let profile_image_area
        if (brand_agent.cover_image_url) {
          profile_image_area = (
            <img style={S('w-100p')} src={brand_agent.cover_image_url} />
          )
        }
        let phone_area
        if (brand_agent.phone_number)
          phone_area = <div style={S('font-15 mb-5')}>M: { brand_agent.phone_number }</div>

        brand_agent_area = (
          <div style={S('mt-50 color-bfc3c7 w-100p text-left relative')}>
            { profile_image_area }
            <div style={S('bg-263445 p-20 w-100p')}>
              <div style={S('font-18 mb-5 color-fff')}><span style={S('fw-400')}>{ brand_agent.first_name } { brand_agent.last_name }</span></div>
              <div style={S('font-14 mb-5 color-bfc3c7')}>
                <div style={S(`bg-cover bg-url(${Brand.asset('office_logo')}) bg-center w-20 h-20 pull-left mr-10`)} />
                <div style={S('pull-left')}>{ Brand.message('office_title') }</div>
                <div className="clearfix" />
              </div>
              { phone_area }
              <div style={S('font-15 mb-5')}>E: { brand_agent.email }</div>
            </div>
          </div>
        )
      }
      let list_agent_area
      if (user && user.user_type === 'Agent') {
        const email_style = {
          ...S('font-15 mb-20'),
          wordWrap: 'break-word'
        }
        // TODO New Listing Info
        let showing_instructions
        if (listing.showing_instructions) {
          showing_instructions = (
            <div style={S('font-15 mb-5')}>{ showing_instructions }</div>
          )
        }
        list_agent_area = (
          <div style={S('mt-20 color-748090 w-100p border-1-solid-ededed br-3 p-20 text-center')}>
            <div style={S('font-18 mb-5 color-3388ff')}><span style={S('fw-400')}>{ listing.list_agent_full_name }, Seller Agent</span></div>
            <div style={S('font-15 mb-5')}>{ listing.list_agent_direct_work_phone }</div>
            <div style={S('font-15 mb-5')}>{ listing.list_office_name }</div>
            { showing_instructions }
            <div style={email_style}><a href={`mailto:${listing.list_agent_email}?subject=Your listing on Rechat.com&body=I saw your listing (${listing_title}) on Rechat.com and I'm interested in getting more information.`} style={S('color-748090')}>{ listing.list_agent_email }</a></div>
            <div style={S('border-bottom-2-solid-e4e4e4 w-40 center-block mb-5')} />
          </div>
        )
      }
      let latitude
      let longitude
      let center
      let listing_map_small
      if (listing.property.address.location) {
        latitude = listing.property.address.location.latitude
        longitude = listing.property.address.location.longitude
        center = {
          lat: latitude,
          lng: longitude
        }
        const bootstrap_url_keys = {
          key: config.google.api_key,
          libraries: ['drawing', 'places'].join(',')
        }
        listing_map_small = (
          <GoogleMap
            key={'map'}
            center={center}
            zoom={12}
            options={{ scrollwheel: false }}
            bootstrapURLKeys={bootstrap_url_keys}
          >
            <ListingMapMarker
              onMouseOver={controller.listing_map.showListingPopup.bind(this, listing)}
              onMouseOut={controller.listing_map.hideListingPopup.bind(this)}
              onClick={controller.listing_viewer.showListingViewer.bind(this, listing)}
              style={S('pointer mt-10')} lat={latitude}
              lng={longitude}
              text={'A'}
            >
              <ListingMarker
                key={`listing-marker${listing.id}`}
                data={data}
                listing={listing}
                property={listing.property}
                address={listing.property.address}
              />
            </ListingMapMarker>
          </GoogleMap>
        )
      }
      let asking_price_area
      if (listing.close_price && user && user.user_type === 'Client') {
        asking_price_area = (
          <span style={S('font-28 relative t-5n color-ccc fw-400')}>(Asking price)</span>
        )
      }
      let agent_area_client = (
        <div>
          <div style={S('fw-600 font-18 mb-10')}>Listing Provided by</div>
          <div>
            <span style={S('fw-400')}>
              {listing.list_agent_full_name}, {listing.list_office_name}
            </span>
          </div>
        </div>
      )
      main_content = (
        <div style={S('bg-fff')}>
          <div style={S('p-0 relative')}>
            { listing.gallery_image_urls && listing.gallery_image_urls.length ? listing_images : '' }
            { listing.gallery_image_urls && listing.gallery_image_urls.length ? listing_images_cached : '' }
            <div className="clearfix" />
          </div>
          <div>
            <div style={S('pl-40 pr-40 relative')}>
              <Col sm={8} md={9} style={S('pl-0')}>
                <div style={S('pt-50 mb-20')}>
                  <div style={S('p-0 pull-left w-210')}>
                    <div style={S('w-200 br-3 border-1-solid-f4f6f9')}>
                      <div style={S('w-100p h-200')}>
                        { listing_map_small }
                      </div>
                      <div style={S('w-100p bg-fff p-5 font-13')}>
                        <div style={S('text-center w-50p pull-left')}>
                          <a target="_blank" href={`http://maps.google.com/?q=${listing.property.address.geo_source_formatted_address_google}`}>Google Maps</a>
                          <div style={S('bg-ebebeb w-1 h-16 pull-right')} />
                        </div>
                        <div style={S('text-center w-50p pull-left')}>
                          <a target="_blank" href={`http://maps.google.com/?q=${listing.property.address.geo_source_formatted_address_google}&layer=c&cbll=${listing.property.address.location.latitude},${listing.property.address.location.longitude}`}>Street View</a>
                        </div>
                        <div className="clearfix" />
                      </div>
                    </div>
                  </div>
                  <div style={S('p-0 pl-20 pull-left')}>
                    <div style={S('fw-700 font-60')}>
                      ${ price }{ listing.property && listing.property.property_type === 'Residential Lease' ? '/mo' : '' } { asking_price_area }
                    </div>
                    <div style={S('mb-20')}>
                      <div className="lato" style={S('pull-left font-24 color-8696a4 mr-20')}>
                        { listing_title }
                      </div>
                      <div style={S('pull-left font-15 mb-10 mr-10')}>
                        { listing_status_indicator }
                      </div>
                    </div>
                    <div className="clearfix" />
                    <div style={S('font-18 color-b7bfc7 mb-10')}>{ listing_subtitle } { mls_link }</div>
                    <div style={S('font-15 color-4a4a4a mb-10')}>
                      <span>{ bedroom_count } Beds</span>
                      &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
                      <span>{ bathroom_count } Baths</span>
                      &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
                      <span>{ square_feet } Sqft</span>
                      &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
                      <span>{ year_built ? `Built in ${year_built}` : '' }</span>
                      { lot_size_area }
                    </div>
                  </div>
                  <div className="clearfix" />
                </div>
                <div style={S('mb-70 font-15')}>
                  { description }
                </div>
                <div style={S('pr-40 relative')}>
                  <div style={S('mb-30 font-15')}>
                    <div style={S('w-33p pull-left pr-20')}>
                      <div style={S('mb-30')}>
                        <div style={S('fw-600 mb-10 font-18')}>Cost Breakdown</div>
                        <div style={S('color-aaaaaa mb-10')}>
                          Price/sqt: <span style={S('color-777')}>${ price_sq_foot }</span>
                        </div>
                        <div style={S('color-aaaaaa mb-10')}>
                          Unexempt Taxes: <span style={S('color-777')}>${ listing.unexempt_taxes ? helpers.numberWithCommas(listing.unexempt_taxes) : 0 }</span>
                        </div>
                        <div style={S('color-aaaaaa mb-10')}>
                          HOA Fees: <span style={S('color-777')}>${ listing.association_fee ? listing.association_fee : 0 }</span>
                        </div>
                        <div style={S('color-aaaaaa mb-10')}>
                          HOA Frequency: <span style={S('color-777')}>{ listing.association_fee_frequency }</span>
                        </div>
                        <div style={S('color-aaaaaa mb-10')}>
                          HOA Includes: <span style={S('color-777')}>{ listing.association_fee_includes }</span>
                        </div>
                      </div>
                    </div>
                    <div style={S('w-33p pull-left pr-20')}>
                      <div style={S('fw-600 mb-10 font-18')}>Key Facts</div>
                      <div style={S('color-aaaaaa mb-10')}>
                        Year Built: <span style={S('color-777')}>{ property.year_built }</span>
                      </div>
                      <div style={S('color-aaaaaa mb-10')}>
                        Style of House: <span style={S('color-777')}>{ property.architectural_style }</span>
                      </div>
                      <div style={S('color-aaaaaa mb-10')}>
                        Subdivision: <span style={S('color-777')}>{ property.subdivision_name }</span>
                      </div>
                      <div style={S('color-aaaaaa mb-10')}>
                        Acres: <span style={S('color-777')}>{ property.lot_size_area }</span>
                      </div>
                      <div style={S('color-aaaaaa mb-10')}>
                        Stories: <span style={S('color-777')}>{ property.number_of_stories }</span>
                      </div>
                      <div style={S('color-aaaaaa mb-10')}>
                        MLS#: <span style={S('color-777')}>{ listing.mls_number }</span>
                      </div>
                      <div style={S('color-aaaaaa mb-10')}>
                        Possession: <span style={S('color-777')}>{ listing.possession }</span>
                      </div>
                      <div style={S('color-aaaaaa mb-10')}>
                        Days On Market: <span style={S('color-777')}>{ listing_util.getDOM(listing.dom) }</span>
                      </div>
                      <div style={S('color-aaaaaa')}>
                        Current Days On Market: <span style={S('color-777')}>{ listing_util.getDOM(listing.cdom) }</span>
                      </div>
                    </div>
                    <div style={S('w-33p pull-left pr-20')}>
                      <div style={S('fw-600 font-18 mb-10')}>Amenities & Utilities</div>
                      <div style={S('color-aaaaaa mb-10')}>
                        Pool: <span style={S('color-777')}>{ property.pool_yn ? 'Yes' : 'No' }</span>
                      </div>
                      <div style={S('color-aaaaaa mb-10')}>
                        Pool Features:&nbsp;
                        <span style={S('color-777')}>
                          {
                            property.pool_features.map(item => <span key={item}>{ item }, </span>)
                          }
                        </span>
                      </div>
                      <div style={S('color-aaaaaa mb-10')}>
                        Handicap Amenities: <span style={S('color-777')}>{ property.handicap_yn ? 'Yes' : 'No' }</span>
                      </div>
                      <div style={S('color-aaaaaa mb-10')}>
                        Heating/Cooling:&nbsp;
                        <span style={S('color-777')}>
                          {
                            property.heating.map(item => <span key={item}>{ item }, </span>)
                          }
                        </span>
                      </div>
                      <div style={S('color-aaaaaa mb-10')}>
                        Other:&nbsp;
                        <span style={S('color-777')}>
                          {
                            property.utilities.map(item => <span key={item}>{ item }, </span>)
                          }
                        </span>
                      </div>
                    </div>
                    <div className="clearfix" />
                  </div>
                  <div className="clearfix" />
                </div>
              </Col>
              <Col sm={4} md={3} style={S('pl-0 maxw-350')}>
                { brand_agent_area }
                { list_agent_area }
              </Col>
            </div>
            <div className="clearfix" />
            <div style={S('pl-0 bg-f8f8f8 w-100p')}>
              <Col sm={8} md={9} style={S('pl-0 bg-f8f8f8')}>
                <div style={S('p-40')}>
                  <div style={S('mb-30 font-15')}>
                    <div style={S('w-33p pull-left pr-20')}>
                      <div style={S('mb-30')}>
                        <div style={S('fw-600 font-18 mb-10')}>All Features</div>
                        <div style={S('color-aaaaaa mb-10')}>
                          Parking Spaces:&nbsp;
                          <span style={S('color-777')}>
                            { property.parking_spaces_garage }
                          </span>
                        </div>
                        <div style={S('color-aaaaaa mb-10')}>
                          Parking/Garage:&nbsp;
                          <span style={S('color-777')}>
                            { property.parking_spaces_garage ? 'Yes' : 'No' }
                          </span>
                        </div>
                        <div style={S('color-aaaaaa mb-10')}>
                          Interior Features:&nbsp;
                          <span style={S('color-777')}>
                            {
                              property.interior_features.map(item => <span key={item}>{ item }, </span>)
                            }
                          </span>
                        </div>
                        <div style={S('color-aaaaaa mb-10')}>
                          Alarm/Security:&nbsp;
                          <span style={S('color-777')}>
                            {
                              property.security_features.map(item => <span key={item}>{ item }, </span>)
                            }
                          </span>
                        </div>
                        <div style={S('color-aaaaaa mb-10')}>
                          Flooring:&nbsp;
                          <span style={S('color-777')}>
                            {
                              property.flooring.map(item => <span key={item}>{ item }, </span>)
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={S('w-33p pull-left pr-20')}>
                      <div style={S('h-35')} />
                      <div style={S('color-aaaaaa mb-10')}>
                        Exterior Features:&nbsp;
                        <span style={S('color-777')}>
                          {
                            property.exterior_features.map(item => <span key={item}>{ item }, </span>)
                          }
                        </span>
                      </div>
                      <div style={S('color-aaaaaa mb-10')}>
                        Construction:&nbsp;
                        <span style={S('color-777')}>
                          { property.construction_materials }
                        </span>
                      </div>
                      <div style={S('color-aaaaaa mb-10')}>
                        Foundation:&nbsp;
                        <span style={S('color-777')}>
                          { property.foundation_details }
                        </span>
                      </div>
                      <div style={S('color-aaaaaa mb-10')}>
                        Roof:&nbsp;
                        <span style={S('color-777')}>
                          { property.roof }
                        </span>
                      </div>
                    </div>
                    <div style={S('w-33p pull-left pr-20')}>
                      <div style={S('fw-600 font-18 mb-10')}>Schools</div>
                      <div style={S('color-aaaaaa mb-10')}>
                        School District: <span style={S('color-777')}>{ property.school_district }</span>
                      </div>
                      <div style={S('color-aaaaaa mb-10')}>
                        Elementary School: <span style={S('color-777')}>{ property.elementary_school_name }</span>
                      </div>
                      <div style={S('color-aaaaaa mb-10')}>
                        Middle School: <span style={S('color-777')}>{ property.middle_school_name }</span>
                      </div>
                      <div style={S('color-aaaaaa mb-10')}>
                        Junior High School: <span style={S('color-777')}>{ property.junior_high_school_name }</span>
                      </div>
                      <div style={S('color-aaaaaa mb-10')}>
                        Senior High School: <span style={S('color-777')}>{ property.senior_high_school_name }</span>
                      </div>
                    </div>
                    <div className="clearfix" />
                    { agent_area_client }
                  </div>
                </div>
                <div className="clearfix" />
              </Col>
              <div className="clearfix" />
            </div>
            <div className="clearfix" />
          </div>
        </div>
      )
    }
    let viewer_wrap_style = S(`absolute h-100p bg-fff t-0 l-0 z-10 ml-70 w-${viewer_width}`)
    if (!user) {
      viewer_wrap_style = {
        ...viewer_wrap_style,
        ...S('ml-0')
      }
    }
    const nav_bar_style = S('mb-0 p-0 h-65 pt-7 w-100p')
    let modal_gallery_area
    if (data.show_modal_gallery) {
      const modal_gallery = data.modal_gallery
      const gallery_image_urls = modal_gallery.gallery_image_urls
      const onSelectHandler = (selectedIndex, e) => {
        this.props.handleModalGalleryNav(selectedIndex, e.direction)
      }
      modal_gallery_area = (
        <Carousel
          activeIndex={modal_gallery.current_index}
          interval={0}
          indicators={false}
          prevIcon={prev_icon}
          nextIcon={next_icon}
          onSelect={onSelectHandler}
        >
          {
            gallery_image_urls.map((gallery_image_url, i) => (
              <CarouselItem key={`gallery-image-${gallery_image_url[0]}${i}`}>
                <div style={S(`w-100p h-500 pull-left text-center bg-efefef bg-cover bg-center bg-url(${gallery_image_url})`)} />
              </CarouselItem>
              ))
          }
        </Carousel>
      )
    }
    let left_area
    if (user) {
      left_area = (
        <div onClick={this.props.hideListingViewer} style={S('pointer absolute l-20 t-20 font-18 fw-400')}>
          <a href="#" style={S('relative pull-left font-30 mr-10 t-5n')} className="close">
            &times;
          </a>
          <div style={S('relative pull-left')}>Close</div>
        </div>
      )
    }
    let right_area
    if (user) {
      const login_btn_color = Brand.color('primary', '006aff')

      right_area = (
        <div className="listing-viewer--navbar" style={nav_bar_style}>
          <div style={S('pull-right relative r-20 t-7')}>
            <FavoriteHeart listing={listing} width="40px" height="40px" />
          </div>
          {/* <Button onClick={this.props.showShareListingModal.bind(this)} style={S(`absolute color-fff r-20 t-15 bg-${login_btn_color} border-1-solid-${login_btn_color}`)} type="button">
            Share
            &nbsp;&nbsp;<i className="fa fa-share" />
          </Button> */}
        </div>
      )
    }
    let join_area
    let brand_logo = (
      <a style={S('font-28')} href="/" className="tk-calluna-sans text-primary">
        Rechat
      </a>
    )
    if (Brand.asset('site_logo_wide')) {
      const host = (typeof window !== 'undefined') ? `https://${window.location.host}` : '#'
      brand_logo = (
        <a href={host}>
          <img style={S('maxw-200 maxh-35')} src={Brand.asset('site_logo_wide')} />
        </a>
      )
    }
    if (!user) {
      let listingId = listing ? listing.id : ''
      join_area = (
        <div style={S('h-70')}>
          <div style={S('pull-left p-16 h-35')}>
            { brand_logo }
          </div>
          <div style={S('pull-right p-16')}>
            <a style={S(`mr-15 bg-${Brand.color('primary', 'a1bde4')} border-1-solid-${Brand.color('primary', 'a1bde4')}`)} className="btn btn-primary" href={`/signin?redirect_to=/dashboard/mls/${listingId}`}>Log in</a>
            { /* <a className="btn btn-primary" href="/signup">Sign up</a> */ }
          </div>
        </div>
      )
    }
    let brand_agent_footer
    if (brand_agent) {
      let profile_image_area
      if (brand_agent.cover_image_url) {
        profile_image_area = (
          <div style={S(`w-300 h-300 center-block br-300 bg-cover bg-top bg-url(${brand_agent.cover_image_url})`)} />
        )
      }
      let phone_area
      if (brand_agent.phone_number)
        phone_area = <div style={S('font-15 mb-5')}>M: { brand_agent.phone_number }</div>
      const brand_agent_area = (
        <div style={S('mt-50 color-fff w-100p text-left center-block text-center')}>
          { profile_image_area }
          <div style={S('p-20 w-100p')}>
            <div style={S('font-18 mb-5 color-fff')}><span style={S('fw-400')}>{ brand_agent.first_name } { brand_agent.last_name }</span></div>
            <div style={S('font-14 mb-15 relative')}>
              <div style={S(`bg-cover bg-url(${Brand.asset('office_logo')}) bg-center w-20 h-20 inline-block mr-10 mt-10`)} />
              <div style={S('inline-block relative t-5n')}>{ Brand.message('office_title') }</div>
              <div className="clearfix" />
            </div>
            { phone_area }
            <div style={S('font-15 mb-5')}>E: { brand_agent.email }</div>
          </div>
          <div style={S('font-32 color-fff')} className="lato">Love this home?  I can help you.</div>
        </div>
      )
      brand_agent_footer = (
        <div style={S('w-100p pt-100 pb-100 bg-263445 text-center')}>
          { brand_agent_area }
        </div>
      )
    }
    // Claim account message
    let claim_account_message
    let token
    if (data.location && data.location.query && data.location.query.token)
      token = data.location.query.token
    if (token) {
      let contact_info = data.location.query.email
      if (data.location.query.phone_number)
        contact_info = data.location.query.phone_number
      claim_account_message = (
        <div style={S('bg-2196f3 color-fff w-100p font-17 p-20 text-center')}>
          This listing was shared to { contact_info }. Claim your account to save this listing and check out many more.&nbsp;&nbsp;&nbsp;&nbsp;
          <Button bsSize="large" style={S('bg-fff color-2196f3 border-none')} onClick={this.handleActivateAccountClick}>Activate your account</Button>
        </div>
      )
    }
    return (
      <div className="listing-viewer" style={viewer_wrap_style}>
        { claim_account_message }
        { join_area }
        { left_area }
        { right_area }
        { main_content }
        { brand_agent_footer }
        <Modal bsSize="large" show={data.show_modal_gallery} onHide={this.props.hideModal}>
          <div style={S('relative')}>
            <div style={S('absolute r-0 t-60n font-60 z-1000 fw-100')} className="close" onClick={this.props.hideModal}>&times;</div>
          </div>
          { modal_gallery_area }
        </Modal>
        <ShareListingModal
          data={data}
          shareAlert={controller.alert_share.shareAlert}
          handleFilterChange={controller.share_modal.handleFilterChange}
          handleEmailChange={controller.share_modal.handleEmailChange}
          handlePhoneNumberChange={controller.share_modal.handlePhoneNumberChange}
          handleAddEmail={controller.share_modal.handleAddEmail}
          handleAddPhoneNumber={controller.share_modal.handleAddPhoneNumber}
          handleRemoveShareItem={controller.share_modal.handleRemoveShareItem}
          addUsersToSearchInput={controller.share_modal.addUsersToSearchInput}
          handleInputChange={controller.share_modal.handleInputChange}
        />
      </div>
    )
  }
}
ListingViewer.propTypes = {
  data: React.PropTypes.object,
  listing: React.PropTypes.object,
  hideModal: React.PropTypes.func,
  navListingCarousel: React.PropTypes.func,
  showModalGallery: React.PropTypes.func,
  handleModalGalleryNav: React.PropTypes.func,
  hideListingViewer: React.PropTypes.func,
  showShareListingModal: React.PropTypes.func
}
