// ListingViewer.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Carousel, CarouselItem, OverlayTrigger, Tooltip, Modal, Button } from 'react-bootstrap'
import _ from 'lodash'
import S from 'shorti'
import helpers from '../../../../utils/helpers'
import listing_util from '../../../../utils/listing'
import Loading from '../../../Partials/Loading'

export default class ListingViewer extends Component {

  componentDidMount() {
    document.onkeydown = e => {
      if (e.keyCode === 27)
        this.props.hideModal()
      const data = this.props.data
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
    let lot_size_square_feet
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
      lot_size_square_feet = helpers.numberWithCommas(Math.floor(listing_util.metersToFeet(property.lot_square_meters)))
      if (property.lot_size)
        lot_size = property.lot_size
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
                  <div onClick={ this.props.showModalGallery.bind(this, gallery_image_url[0]) } style={ S('border-right-1-solid-fff w-' + ((window.innerWidth - 70) / 3) + ' h-300 pull-left text-center bg-efefef bg-cover bg-center bg-url(' + gallery_image_url[0] + ')') }/>
                  <div onClick={ this.props.showModalGallery.bind(this, gallery_image_url[1]) } style={ S('border-right-1-solid-fff w-' + ((window.innerWidth - 70) / 3) + ' h-300 pull-left text-center bg-efefef bg-cover bg-center bg-url(' + gallery_image_url[1] + ')') }/>
                  <div onClick={ this.props.showModalGallery.bind(this, gallery_image_url[2]) } style={ S('w-' + ((window.innerWidth - 70) / 3) + ' h-300 pull-left text-center bg-efefef bg-cover bg-center bg-url(' + gallery_image_url[2] + ')') }/>
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
      const listing_status_indicator = (
        <div className="pull-left" style={ S('bg-ebeef1 relative t-7 br-100 ml-15 pt-11 h-35 pl-36 pr-15 mr-15') }>
          <span style={ S('mr-5 font-46 l-10 t-17n absolute color-' + status_color) }>&#8226;</span>
          <span style={ S('font-14 relative t-3n') }>
            <b>{ listing.status }</b>
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
      let pool
      if (listing.property.pool_yn) {
        pool = (
          <div style={ S('mb-10') }>
            <span style={ S('fw-600') }>Pool:</span>&nbsp;&nbsp;
            <span style={ S('color-c0c0c0') }>Yes</span>
          </div>
        )
      }
      let hoa
      if (listing.property_association_fees) {
        hoa = (
          <div style={ S('mb-10') }>
            <span style={ S('fw-600') }>HOA:</span>&nbsp;&nbsp;
            <span style={ S('color-c0c0c0') }>{ listing.property_association_fees }</span>
          </div>
        )
      }
      const google_address = listing.property.address.geo_source_formatted_address_google
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
          <div style={ S('pt-20 pl-50 pr-50 relative') }>
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
            <div style={ S('font-24 color-4a4a4a') }>
              <span>{ bedroom_count } Beds</span>
              &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
              <span>{ bathroom_count } Baths</span>
              &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
              <span>{ square_feet } Sqft</span>
              &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
              <span>{ year_built ? 'Built in ' + year_built : '' }</span>
              { lot_size_area }
            </div>
            <div style={ S('absolute r-20 t-20 w-300') }>
              <div style={ S('font-18 mb-5') }><span style={ S('fw-400') }>{ listing.list_agent_full_name }, Seller Agent</span></div>
              <div style={ S('font-16 color-929292 mb-10') }>{ listing.list_office_name }</div>
              <div style={ S('font-14 color-a5c8f8 mb-10') }>{ listing.list_office_phone }</div>
              <div style={ S('font-14 mb-20') }><a href={ `mailto:${ listing.list_agent_email }?subject=Your listing on Rechat.com&body=I saw your listing (${ listing_title }) on Rechat.com and I'm interested in getting more information.` } style={ S('color-a5c8f8') }>{ listing.list_agent_email }</a></div>
              <div style={ S('border-bottom-1-solid-efeceb w-180') }></div>
            </div>
            <hr />
            <div className="clearfix"></div>
            <div>
              <div style={ S('w-50p pull-left') }>
                <div style={ S('color-000 font-18 mb-20 pr-30') }>{ description }</div>
                <div className="clearfix"></div>
                <div style={ S('font-24 mb-20') }>Key Details</div>
                <div style={ S('mb-10') }>
                  <span style={ S('fw-600') }>Property Type:</span>&nbsp;&nbsp;
                  <span style={ S('color-c0c0c0') }>{ listing.property.property_subtype }</span>
                </div>
                <div style={ S('mb-10') }>
                  <span style={ S('fw-600') }>Price Per Square Foot:</span>&nbsp;&nbsp;
                  <span style={ S('color-c0c0c0') }>${ price_sq_foot }</span>
                </div>
                <div style={ S('mb-10') }>
                  <span style={ S('fw-600') }>Built:</span>&nbsp;&nbsp;
                  <span style={ S('color-c0c0c0') }>{ listing.property.year_built }</span>
                </div>
                { pool }
                { hoa }
                <div style={ S('mb-10') }>
                  <span style={ S('fw-600') }>County:</span>&nbsp;&nbsp;
                  <span style={ S('color-c0c0c0') }>{ listing.property.address.county_or_parish }</span>
                </div>
                <div style={ S('mb-30') }>
                  <span style={ S('fw-600') }>Community:</span>&nbsp;&nbsp;
                  <span style={ S('color-c0c0c0') }>{ listing.property.subdivision_name }</span>
                </div>
                <div className="clearfix"></div>
              </div>
              <div style={ S('relative w-50p pull-left') }>
                <iframe
                  width={ (window.innerWidth / 2) - 100 }
                  height="250"
                  frameBorder="0" style={ { border: 0 } }
                  src={ 'https://www.google.com/maps/embed/v1/place?key=AIzaSyDagxNRLRIOsF8wxmuh1J3ysqnwdDB93-4&q=' + google_address }
                  allowFullScreen
                >
                </iframe>
              </div>
              <div className="clearfix"></div>
            </div>
            <div>
              <div style={ S('font-24 mb-20') }>Details</div>
              <div>
                <div style={ S('mb-30 w-300 pull-left mr-20') }>
                  <div style={ S('fw-600') }>Cost Breakdown:</div>
                  <div style={ S('color-c0c0c0') }>
                    Price/sqt <div style={ S('pull-right') }>${ price_sq_foot }</div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    Unexempt Taxes <div style={ S('pull-right') }>${ helpers.numberWithCommas(listing.unexempt_taxes) }</div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    HOA Fees <div style={ S('pull-right') }>${ listing.association_fee }</div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    HOA Frequency <div style={ S('pull-right') }>{ listing.association_fee_frequency }</div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    HOA Includes <div style={ S('pull-right') }>{ listing.association_fee_includes }</div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    Proposed Financing <div style={ S('pull-right') }>{ listing.financing_proposed }</div>
                  </div>
                </div>
                <div style={ S('mb-30 w-300 pull-left mr-20') }>
                  <div style={ S('fw-600') }>Facts:</div>
                  <div style={ S('color-c0c0c0') }>
                    Year Built <div style={ S('pull-right') }>{ listing.year_built }</div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    Style of House <div style={ S('pull-right') }>{ property.architectural_style }</div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    Subdivision <div style={ S('pull-right') }>{ property.subdivision_name }</div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    Acres <div style={ S('pull-right') }>{ property.lot_size_area }</div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    Stories <div style={ S('pull-right') }>{ property.number_of_stories }</div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    MLS# <div style={ S('pull-right') }>{ listing.mls_number }</div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    Possession <div style={ S('pull-right') }>{ listing.possession }</div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    Days On Market <div style={ S('pull-right') }>{ listing_util.getDOM(listing.dom) }</div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    Current Days On Market <div style={ S('pull-right') }>{ listing_util.getDOM(listing.cdom) }</div>
                  </div>
                </div>
                <div style={ S('mb-30 w-300 pull-left mr-20') }>
                  <div style={ S('fw-600') }>Parking:</div>
                  <div style={ S('color-c0c0c0') }>
                    Garage Spaces <div style={ S('pull-right') }>{ property.parking_spaces_garage }</div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    Garage Size <div style={ S('pull-right') }>{ property.garage_width } X { property.garage_length }</div>
                  </div>
                </div>
                <div className="clearfix"></div>
              </div>
              <div>
                <div style={ S('mb-30 w-300 pull-left mr-20') }>
                  <div style={ S('fw-600') }>Interior Features:</div>
                  <div style={ S('color-c0c0c0') }>
                    Interior Features
                    <div style={ S('pull-right text-right') }>
                      {
                        property.interior_features.map(item => {
                          return <div key={ item }>{ item }</div>
                        })
                      }
                    </div>
                    <div className="clearfix"></div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    Alarm/Security
                    <div style={ S('pull-right text-right') }>
                      {
                        property.security_features.map(item => {
                          return <div key={ item }>{ item }</div>
                        })
                      }
                    </div>
                    <div className="clearfix"></div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    Flooring
                    <div style={ S('pull-right text-right') }>
                      {
                        property.flooring.map(item => {
                          return <div key={ item }>{ item }</div>
                        })
                      }
                    </div>
                    <div className="clearfix"></div>
                  </div>
                </div>
                <div style={ S('mb-30 w-300 pull-left mr-20') }>
                  <div style={ S('fw-600') }>Schools:</div>
                  <div style={ S('color-c0c0c0') }>
                    School District <div style={ S('pull-right') }>{ property.school_district }</div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    Elementary School <div style={ S('pull-right') }>{ property.elementary_school_name }</div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    Middle School <div style={ S('pull-right') }>{ property.middle_school_name }</div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    High School <div style={ S('pull-right') }>{ property.high_school_name }</div>
                  </div>
                </div>
                <div style={ S('mb-30 w-300 pull-left mr-20') }>
                  <div style={ S('fw-600') }>Utilities:</div>
                  <div style={ S('color-c0c0c0') }>
                    Heating/Cooling
                    <div style={ S('pull-right text-right') }>
                      {
                        property.heating.map(item => {
                          return <div key={ item }>{ item }</div>
                        })
                      }
                    </div>
                    <div className="clearfix"></div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    Other
                    <div style={ S('pull-right text-right') }>
                      {
                        property.utilities.map(item => {
                          return <div key={ item }>{ item }</div>
                        })
                      }
                    </div>
                    <div className="clearfix"></div>
                  </div>
                </div>
                <div className="clearfix"></div>
              </div>
              <div>
                <div style={ S('mb-30 w-300 pull-left mr-20') }>
                  <div style={ S('fw-600') }>Exterior Features:</div>
                  <div style={ S('color-c0c0c0') }>
                    Lot Size
                    <div style={ S('pull-right') }>{ lot_size_square_feet } Sqft</div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    Exterior Features
                    <div style={ S('pull-right text-right') }>
                      {
                        property.exterior_features.map(item => {
                          return <div key={ item }>{ item }</div>
                        })
                      }
                    </div>
                    <div className="clearfix"></div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    Construction
                    <div style={ S('pull-right') }>{ property.construction_materials }</div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    Foundation
                    <div style={ S('pull-right') }>{ property.foundation_details }</div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    Roof
                    <div style={ S('pull-right') }>{ property.roof }</div>
                  </div>
                </div>
                <div style={ S('mb-30 w-300 pull-left mr-20') }>
                  <div style={ S('fw-600') }>Amenities:</div>
                  <div style={ S('color-c0c0c0') }>
                    Pool
                    <div style={ S('pull-right') }>{ property.pool_yn ? 'Yes' : 'No' }</div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    Pool Features
                    <div style={ S('pull-right text-right') }>
                      {
                        property.pool_features.map(item => {
                          return <div key={ item }>{ item }</div>
                        })
                      }
                    </div>
                    <div className="clearfix"></div>
                  </div>
                  <div style={ S('color-c0c0c0') }>
                    Handicap Amenities
                    <div style={ S('pull-right') }>{ property.handicap_yn ? 'Yes' : 'No' }</div>
                  </div>
                </div>
                <div className="clearfix"></div>
              </div>
            </div>
            <div className="clearfix"></div>
          </div>
        </div>
      )
    }
    const viewer_wrap_style = S('absolute h-100p bg-fff t-0 l-0 z-1000 ml-70 w-' + (window.innerWidth - 70))
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
    return (
      <div style={ viewer_wrap_style }>
        <div onClick={ this.props.hideListingViewer } style={ S('pointer absolute l-20 t-20 font-18 fw-400') }>&lt;&nbsp;&nbsp;Back</div>
        <div style={ nav_bar_style }>
          <Button style={ S('absolute r-20 t-15') } bsStyle="primary" type="button">
            Share
            &nbsp;&nbsp;<i className="fa fa-share"></i>
          </Button>
        </div>
        { main_content }
        <Modal bsSize="large" show={ data.show_modal_gallery } onHide={ this.props.hideModal }>
          <div style={ S('relative') }>
            <div style={ S('absolute r-0 t-60n font-60 z-1000 fw-100') } className="close" onClick={ this.props.hideModal }>&times;</div>
          </div>
          { modal_gallery_area }
        </Modal>
      </div>
    )
  }
}

// PropTypes
ListingViewer.propTypes = {
  data: React.PropTypes.object,
  listing: React.PropTypes.object,
  hideModal: React.PropTypes.func,
  navListingCarousel: React.PropTypes.func,
  showModalGallery: React.PropTypes.func,
  handleModalGalleryNav: React.PropTypes.func,
  hideListingViewer: React.PropTypes.func
}