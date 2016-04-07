// ListingViewer.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Carousel, CarouselItem, OverlayTrigger, Tooltip, Modal, Button } from 'react-bootstrap'
import _ from 'lodash'
import S from 'shorti'
import helpers from '../../../../utils/helpers'
import listing_util from '../../../../utils/listing'
import Loading from '../../../Partials/Loading'
import ShareListingModal from './ShareListingModal'
import ListingMarker from './ListingMarker'
import controller from '../controller'
import GoogleMap from 'google-map-react'
export default class ListingViewer extends Component {
  componentDidMount() {
    document.onkeydown = e => {
      const data = this.props.data
      if (e.keyCode === 27) {
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
  fadeIn() {
    const elem = ReactDOM.findDOMNode(this)
    elem.style.opacity = 0
    window.requestAnimationFrame(() => {
      elem.style.transition = 'opacity 150ms'
      elem.style.opacity = 1
    })
  }
  render() {
    // Listing modal
    const data = this.props.data
    const user = data.user
    let viewer_width = window.innerWidth - 70
    if (!user)
      viewer_width = window.innerWidth
    const listing = this.props.listing
    let current_slide = listing.current_slide
    if (!current_slide)
      current_slide = 0
    let property
    // let property_type
    let year_built
    let address
    // let city
    // let state
    // let postal_code
    // let full_address
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
    // let lot_size_square_feet
    let listing_images = (
      <div style={ S('bg-eff1f2 w-100p h-300 font-22 text-center pt-125 color-929292') }>No image</div>
    )
    let main_content = <Loading />
    if (listing && listing.property) {
      property = listing.property
      price = helpers.numberWithCommas(listing.price)
      // property_type = property.property_type
      year_built = property.year_built
      address = listing_util.addressTitle(property.address)
      // city = property.address.city
      // state = property.address.state
      // postal_code = property.address.postal_code
      // full_address = `${address} ${city}, ${state}, ${postal_code}`
      listing_title = address
      mls_number = listing.mls_number
      bedroom_count = property.bedroom_count
      bathroom_count = property.bathroom_count
      square_feet = helpers.numberWithCommas(Math.floor(listing_util.metersToFeet(property.square_meters)))
      price_sq_foot = (Number(price.replace(/,/g, '')) / Number(square_feet.replace(/,/g, ''))).toFixed(2)
      // lot_size_square_feet = helpers.numberWithCommas(Math.floor(listing_util.metersToFeet(property.lot_square_meters)))
      if (property.lot_size_area)
        lot_size = property.lot_size_area
      prev_icon = '<'
      next_icon = '>'
      description = property.description
      const gallery_image_urls = [
        listing.cover_image_url,
        ...listing.gallery_image_urls
      ]
      const gallery_chunks = _.chunk(gallery_image_urls, 3)
      listing_images = (
        <Carousel className="listing-viewer__carousel" interval={0} indicators={false} prevIcon={ prev_icon } nextIcon={ next_icon }>
          {
            gallery_chunks.map((gallery_image_url, i) => {
              return (
                <CarouselItem className="listing-carousel__item" key={ 'gallery-image-' + gallery_image_url[0] + i }>
                  <div onClick={ this.props.showModalGallery.bind(this, gallery_image_url[0]) } style={ S('border-right-1-solid-fff w-' + (viewer_width / 3) + ' h-300 pull-left text-center bg-efefef bg-cover bg-center bg-url(' + gallery_image_url[0] + ')') }/>
                  <div onClick={ this.props.showModalGallery.bind(this, gallery_image_url[1]) } style={ S('border-right-1-solid-fff w-' + (viewer_width / 3) + ' h-300 pull-left text-center bg-efefef bg-cover bg-center bg-url(' + gallery_image_url[1] + ')') }/>
                  <div onClick={ this.props.showModalGallery.bind(this, gallery_image_url[2]) } style={ S('w-' + (viewer_width / 3) + ' h-300 pull-left text-center bg-efefef bg-cover bg-center bg-url(' + gallery_image_url[2] + ')') }/>
                </CarouselItem>
              )
            })
          }
        </Carousel>
      )
      // Cache images for uninteruted scroll
      const listing_images_cached = gallery_image_urls.map((image_url, i) => {
        return <img key={ 'image-' + i } src={ image_url } style={ S('w-0 h-0') }/>
      })
      listing_title = `${listing.property.address.street_number} ${listing.property.address.street_name} ${listing.property.address.street_suffix}`
      listing_subtitle = `${listing.property.address.city}, ${listing.property.address.state} ${listing.property.address.postal_code}`
      const status_color = listing_util.getStatusColor(listing.status)
      let sold_date
      if (listing.close_date) {
        const sold_date_obj = helpers.friendlyDate(listing.close_date)
        sold_date = `${sold_date_obj.month} ${sold_date_obj.date}, ${sold_date_obj.year}`
      }
      const listing_status_indicator = (
        <div className="pull-left" style={ S('bg-ebeef1 relative t-7 br-100 ml-15 pt-11 h-35 pl-36 pr-15 mr-15') }>
          <span style={ S('mr-5 font-46 l-10 t-17n absolute color-' + status_color) }>&#8226;</span>
          <span style={ S('font-14 relative t-3n') }>
            <b>{ listing.status } { sold_date }</b>
          </span>
        </div>
      )
      let number_days_indicator
      if (listing.list_date) {
        const days_on_market = listing_util.getDOM(listing.list_date)
        number_days_indicator = (
          <div className="pull-left" style={ S('bg-ebeef1 relative t-7 br-100 pt-11 h-35 pl-15 pr-15 mr-15') }>
            <span style={ S('font-14 relative t-3n') }>
              <b>{ days_on_market } days ago</b>
            </span>
          </div>
        )
      }
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
            <OverlayTrigger rootClose trigger="click" placement="bottom" overlay={ tooltip }>
              <span style={ S('color-8ba8d1 pointer') } className="copy-mls" data-clipboard-text={ mls_number }>{ mls_number }</span>
            </OverlayTrigger>
          </span>
        )
      }
      let lot_size_area
      if (lot_size) {
        lot_size_area = (
          <span>
            &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
            <span>{ lot_size ? 'Lot size ' + lot_size : '' }</span>
          </span>
        )
      }
      main_content = (
        <div style={ S('bg-fff') }>
          <div style={ S('p-0 relative') }>
            { listing_images }
            { listing_images_cached }
            <div className="clearfix"></div>
          </div>
          <div style={ S('pl-40 pr-40 relative') }>
            <div style={ S('fw-700 font-70 mb-10n') }>${ price }</div>
            <div>
              <div className="tempo pull-left" style={ S('font-32 fw-100 color-7d8288 mb-10 mr-20') }>
                { listing_title }
              </div>
              <div className="pull-left">
                { listing_status_indicator }
              </div>
              <div className="pull-left">
                { number_days_indicator }
              </div>
            </div>
            <div className="clearfix"></div>
            <div style={ S('font-18 color-b7bfc7 mb-30') }>{ listing_subtitle } { mls_link }</div>
            <div style={ S('font-30 color-4a4a4a mb-30') }>
              <span>{ bedroom_count } Beds</span>
              &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
              <span>{ bathroom_count } Baths</span>
              &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
              <span>{ square_feet } Sqft</span>
              &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
              <span>{ year_built ? 'Built in ' + year_built : '' }</span>
              { lot_size_area }
            </div>
            <div style={ S('absolute r-20 t-40 w-300') }>
              <div style={ S('font-18 mb-5') }><span style={ S('fw-400') }>{ listing.list_agent_full_name }, Seller Agent</span></div>
              <div style={ S('font-16 color-929292 mb-10') }>{ listing.list_office_name }</div>
              <div style={ S('font-14 color-a5c8f8 mb-10') }>{ listing.list_agent_direct_work_phone }</div>
              <div style={ S('font-14 mb-20') }><a href={ `mailto:${ listing.list_agent_email }?subject=Your listing on Rechat.com&body=I saw your listing (${ listing_title }) on Rechat.com and I'm interested in getting more information.` } style={ S('color-a5c8f8') }>{ listing.list_agent_email }</a></div>
              <div style={ S('border-bottom-1-solid-efeceb w-180') }></div>
            </div>
            <div className="clearfix"></div>
            <div>
              <div style={ S('w-70p pull-left') }>
                <div style={ S('color-4a4a4a font-24 mb-20 pr-30') }>{ description }</div>
              </div>
              <div style={ S('relative w-280 pull-left') }>
                <GoogleMap
                  style={ S('w-280 h-280') }
                  key={ 'map' }
                  center={ { lat: listing.property.address.location.latitude, lng: listing.property.address.location.longitude } }
                  zoom={ 12 }
                  options={ { scrollwheel: false } }
                >
                  <div
                    onMouseOver={ controller.listing_map.showListingPopup.bind(this, listing) }
                    onMouseOut={ controller.listing_map.hideListingPopup.bind(this) }
                    onClick={ controller.listing_viewer.showListingViewer.bind(this, listing) }
                    style={ S('pointer mt-10') } lat={ listing.property.address.location.latitude }
                    lng={ listing.property.address.location.longitude }
                    text={'A'}
                  >
                    <ListingMarker
                      key={ 'listing-marker' + listing.id }
                      data={ data }
                      listing={ listing }
                      property={ listing.property }
                      address={ listing.property.address }
                    />
                  </div>
                </GoogleMap>
              </div>
              <div className="clearfix"></div>
            </div>
            <hr style={ S('mt-40 mb-30') }/>
            <div>
              <div style={ S('mb-30 font-15') }>
                <div style={ S('w-30p pull-left pr-20') }>
                  <div style={ S('mb-30') }>
                    <div style={ S('fw-600 mb-10 font-18') }>Cost Breakdown</div>
                    <div style={ S('color-aaaaaa mb-10') }>
                      Price/sqt: <span style={ S('color-777') }>${ price_sq_foot }</span>
                    </div>
                    <div style={ S('color-aaaaaa mb-10') }>
                      Unexempt Taxes: <span style={ S('color-777') }>${ listing.unexempt_taxes ? helpers.numberWithCommas(listing.unexempt_taxes) : 0 }</span>
                    </div>
                    <div style={ S('color-aaaaaa mb-10') }>
                      HOA Fees: <span style={ S('color-777') }>${ listing.association_fee ? listing.association_fee : 0 }</span>
                    </div>
                    <div style={ S('color-aaaaaa mb-10') }>
                      HOA Frequency: <span style={ S('color-777') }>{ listing.association_fee_frequency }</span>
                    </div>
                    <div style={ S('color-aaaaaa mb-10') }>
                      HOA Includes: <span style={ S('color-777') }>{ listing.association_fee_includes }</span>
                    </div>
                  </div>
                </div>
                <div style={ S('w-30p pull-left pr-20') }>
                  <div style={ S('fw-600 mb-10 font-18') }>Key Facts</div>
                  <div style={ S('color-aaaaaa mb-10') }>
                    Year Built: <span style={ S('color-777') }>{ property.year_built }</span>
                  </div>
                  <div style={ S('color-aaaaaa mb-10') }>
                    Style of House: <span style={ S('color-777') }>{ property.architectural_style }</span>
                  </div>
                  <div style={ S('color-aaaaaa mb-10') }>
                    Subdivision: <span style={ S('color-777') }>{ property.subdivision_name }</span>
                  </div>
                  <div style={ S('color-aaaaaa mb-10') }>
                    Acres: <span style={ S('color-777') }>{ property.lot_size_area }</span>
                  </div>
                  <div style={ S('color-aaaaaa mb-10') }>
                    Stories: <span style={ S('color-777') }>{ property.number_of_stories }</span>
                  </div>
                  <div style={ S('color-aaaaaa mb-10') }>
                    MLS#: <span style={ S('color-777') }>{ listing.mls_number }</span>
                  </div>
                  <div style={ S('color-aaaaaa mb-10') }>
                    Possession: <span style={ S('color-777') }>{ listing.possession }</span>
                  </div>
                  <div style={ S('color-aaaaaa mb-10') }>
                    Days On Market: <span style={ S('color-777') }>{ listing_util.getDOM(listing.dom) }</span>
                  </div>
                  <div style={ S('color-aaaaaa') }>
                    Current Days On Market: <span style={ S('color-777') }>{ listing_util.getDOM(listing.cdom) }</span>
                  </div>
                </div>
                <div style={ S('w-30p pull-left pr-20') }>
                  <div style={ S('fw-600 font-18 mb-10') }>Amenities & Utilities</div>
                  <div style={ S('color-aaaaaa mb-10') }>
                    Pool: <span style={ S('color-777') }>{ property.pool_yn ? 'Yes' : 'No' }</span>
                  </div>
                  <div style={ S('color-aaaaaa mb-10') }>
                    Pool Features:&nbsp;
                    <span style={ S('color-777') }>
                      {
                        property.pool_features.map(item => {
                          return <span key={ item }>{ item }, </span>
                        })
                      }
                    </span>
                  </div>
                  <div style={ S('color-aaaaaa mb-10') }>
                    Handicap Amenities: <span style={ S('color-777') }>{ property.handicap_yn ? 'Yes' : 'No' }</span>
                  </div>
                  <div style={ S('color-aaaaaa mb-10') }>
                    Heating/Cooling:&nbsp;
                    <span style={ S('color-777') }>
                      {
                        property.heating.map(item => {
                          return <span key={ item }>{ item }, </span>
                        })
                      }
                    </span>
                  </div>
                  <div style={ S('color-aaaaaa mb-10') }>
                    Other:&nbsp;
                    <span style={ S('color-777') }>
                      {
                        property.utilities.map(item => {
                          return <span key={ item }>{ item }, </span>
                        })
                      }
                    </span>
                  </div>
                </div>
                <div className="clearfix"></div>
              </div>
              <div className="clearfix"></div>
              <div style={ S('mb-30 font-15') }>
                <div style={ S('w-30p pull-left pr-20') }>
                  <div style={ S('mb-30') }>
                    <div style={ S('fw-600 font-18 mb-10') }>All Features</div>
                    <div style={ S('color-aaaaaa mb-10') }>
                      Garage Spaces:&nbsp;
                      <span style={ S('color-777') }>
                        { property.parking_spaces_garage }
                      </span>
                    </div>
                    <div style={ S('color-aaaaaa mb-10') }>
                      Parking/Garage:&nbsp;
                      <span style={ S('color-777') }>
                        { property.parking_spaces_garage ? 'Yes' : 'No' }
                      </span>
                    </div>
                    <div style={ S('color-aaaaaa mb-10') }>
                      Interior Features:&nbsp;
                      <span style={ S('color-777') }>
                        {
                          property.interior_features.map(item => {
                            return <span key={ item }>{ item }, </span>
                          })
                        }
                      </span>
                    </div>
                    <div style={ S('color-aaaaaa mb-10') }>
                      Alarm/Security:&nbsp;
                      <span style={ S('color-777') }>
                        {
                          property.security_features.map(item => {
                            return <span key={ item }>{ item }, </span>
                          })
                        }
                      </span>
                    </div>
                    <div style={ S('color-aaaaaa mb-10') }>
                      Flooring:&nbsp;
                      <span style={ S('color-777') }>
                        {
                          property.flooring.map(item => {
                            return <span key={ item }>{ item }, </span>
                          })
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <div style={ S('w-30p pull-left pr-20') }>
                  <div style={ S('h-35') }></div>
                  <div style={ S('color-aaaaaa mb-10') }>
                    Exterior Features:&nbsp;
                    <span style={ S('color-777') }>
                      {
                        property.exterior_features.map(item => {
                          return <span key={ item }>{ item }, </span>
                        })
                      }
                    </span>
                  </div>
                  <div style={ S('color-aaaaaa mb-10') }>
                    Construction:&nbsp;
                    <span style={ S('color-777') }>
                      { property.construction_materials }
                    </span>
                  </div>
                  <div style={ S('color-aaaaaa mb-10') }>
                    Foundation:&nbsp;
                    <span style={ S('color-777') }>
                      { property.foundation_details }
                    </span>
                  </div>
                  <div style={ S('color-aaaaaa mb-10') }>
                    Roof:&nbsp;
                    <span style={ S('color-777') }>
                      { property.roof }
                    </span>
                  </div>
                </div>
                <div style={ S('w-30p pull-left pr-20') }>
                  <div style={ S('fw-600 font-18 mb-10') }>Schools</div>
                  <div style={ S('color-aaaaaa mb-10') }>
                    School District: <span style={ S('color-777') }>{ property.school_district }</span>
                  </div>
                  <div style={ S('color-aaaaaa mb-10') }>
                    Elementary School: <span style={ S('color-777') }>{ property.elementary_school_name }</span>
                  </div>
                  <div style={ S('color-aaaaaa mb-10') }>
                    Middle School: <span style={ S('color-777') }>{ property.middle_school_name }</span>
                  </div>
                  <div style={ S('color-aaaaaa mb-10') }>
                    High School: <span style={ S('color-777') }>{ property.high_school_name }</span>
                  </div>
                </div>
                <div className="clearfix"></div>
              </div>
            </div>
            <div className="clearfix"></div>
            <h2>Location</h2>
            <div style={ S('relative w-100p pull-left') }>
              <GoogleMap
                style={ S('w-100p h-300') }
                key={ 'map' }
                center={ { lat: listing.property.address.location.latitude, lng: listing.property.address.location.longitude } }
                zoom={ 12 }
                options={ { scrollwheel: false } }
              >
                <div
                  onMouseOver={ controller.listing_map.showListingPopup.bind(this, listing) }
                  onMouseOut={ controller.listing_map.hideListingPopup.bind(this) }
                  onClick={ controller.listing_viewer.showListingViewer.bind(this, listing) }
                  style={ S('pointer mt-10') } lat={ listing.property.address.location.latitude }
                  lng={ listing.property.address.location.longitude }
                  text={'A'}
                >
                  <ListingMarker
                    key={ 'listing-marker' + listing.id }
                    data={ data }
                    listing={ listing }
                    property={ listing.property }
                    address={ listing.property.address }
                    context={ 'single' }
                  />
                </div>
              </GoogleMap>
            </div>
            <div className="clearfix"></div>
            <div style={ S('h-100 w-100p') }></div>
            <div className="clearfix"></div>
          </div>
        </div>
      )
    }
    let viewer_wrap_style = S('absolute h-100p bg-fff t-0 l-0 z-10 ml-70 w-' + viewer_width)
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
      modal_gallery_area = (
        <Carousel
          activeIndex={ modal_gallery.current_index }
          interval={0}
          indicators={false}
          prevIcon={ prev_icon }
          nextIcon={ next_icon }
          onSelect={ this.props.handleModalGalleryNav }
          direction={ modal_gallery.direction }
        >
          {
            gallery_image_urls.map((gallery_image_url, i) => {
              return (
                <CarouselItem key={ 'gallery-image-' + gallery_image_url[0] + i }>
                  <div style={ S('w-100p h-500 pull-left text-center bg-efefef bg-cover bg-center bg-url(' + gallery_image_url + ')') }/>
                </CarouselItem>
              )
            })
          }
        </Carousel>
      )
    }
    let left_area
    if (user) {
      left_area = (
        <div onClick={ this.props.hideListingViewer } style={ S('pointer absolute l-20 t-20 font-18 fw-400') }>
          <a href="#" style={ S('relative pull-left font-30 mr-10 t-5n') } className="close">
            &times;
          </a>
          <div style={ S('relative pull-left') }>Close</div>
        </div>
      )
    }
    let right_area
    if (user) {
      right_area = (
        <div style={ nav_bar_style }>
          <Button onClick={ this.props.showShareListingModal.bind(this) } style={ S('absolute r-20 t-15') } bsStyle="primary" type="button">
            Share
            &nbsp;&nbsp;<i className="fa fa-share"></i>
          </Button>
        </div>
      )
    }
    let join_area
    if (!user) {
      join_area = (
        <div style={ S('h-70') }>
          <div style={ S('pull-left p-16') }>
            <a style={ S('font-28') } href="/" className="tk-calluna-sans text-primary">
              Rechat
            </a>
          </div>
          <div style={ S('pull-right p-16') }>
            <a style={ S('mr-15 bg-a1bde4 border-1-solid-a1bde4') } className="btn btn-primary" href="/signin">Log in</a>
            <a className="btn btn-primary" href="/signup">Sign up</a>
          </div>
        </div>
      )
    }
    return (
      <div style={ viewer_wrap_style }>
        { join_area }
        { left_area }
        { right_area }
        { main_content }
        <Modal bsSize="large" show={ data.show_modal_gallery } onHide={ this.props.hideModal }>
          <div style={ S('relative') }>
            <div style={ S('absolute r-0 t-60n font-60 z-1000 fw-100') } className="close" onClick={ this.props.hideModal }>&times;</div>
          </div>
          { modal_gallery_area }
        </Modal>
        <ShareListingModal
          data={ data }
          shareAlert={ controller.listing_share.shareAlert }
          handleShareFilter={ controller.share_modal.handleShareFilter }
          handleEmailChange={ controller.share_modal.handleEmailChange }
          handlePhoneNumberChange={ controller.share_modal.handlePhoneNumberChange }
          handleAddEmail={ controller.share_modal.handleAddEmail }
          handleAddPhoneNumber={ controller.share_modal.handleAddPhoneNumber }
          handleRemoveShareItem={ controller.share_modal.handleRemoveShareItem }
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