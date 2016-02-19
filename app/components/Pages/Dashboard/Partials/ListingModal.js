// ListingModal.js
import React, { Component } from 'react'
import { Modal, Carousel, CarouselItem, Col } from 'react-bootstrap'
import S from 'shorti'
import helpers from '../../../../utils/helpers'
import listing_util from '../../../../utils/listing'
import Loading from '../../../Partials/Loading'

export default class ListingModal extends Component {

  render() {
    const data = this.props.data
    // Listing modal
    const listing = this.props.listing
    let property
    let property_type
    let year_built
    let address
    let city
    let state
    let postal_code
    let full_address
    let listing_title
    let mls_number
    let bedroom_count
    let bathroom_count
    let square_feet
    let prev_icon
    let next_icon
    let description
    let price
    let listing_images = (
      <div style={ S('bg-eff1f2 w-480 h-300 font-22 text-center pt-125 color-929292') }>No image</div>
    )
    const carousel_wh = 'w-480 h-300'
    let modal_body = <Loading />
    if (listing && listing.property) {
      property = listing.property
      price = helpers.numberWithCommas(listing.price)
      property_type = property.property_type
      year_built = property.year_built
      address = `${property.address.street_number} ${property.address.street_name} ${property.address.street_suffix}`
      city = property.address.city
      state = property.address.state
      postal_code = property.address.postal_code
      full_address = `${address} ${city}, ${state}, ${postal_code}`
      listing_title = address
      mls_number = listing.mls_number
      bedroom_count = property.bedroom_count
      bathroom_count = property.bathroom_count
      square_feet = helpers.numberWithCommas(Math.floor(listing_util.metersToFeet(property.square_meters)))
      prev_icon = '<'
      next_icon = '>'
      description = property.description
      listing_images = (
        <Carousel interval={0} indicators={false} prevIcon={ prev_icon } nextIcon={ next_icon }>
          <CarouselItem>
            <div style={ S(carousel_wh + ' bg-cover bg-center bg-url(' + listing.cover_image_url + ')') }></div>
          </CarouselItem>
          {
            listing.gallery_image_urls.map(gallery_image_url => {
              return (
                <CarouselItem key={ 'gallery-image-' + gallery_image_url }>
                  <img className="hidden" src={ gallery_image_url }/>
                  <div style={ S(carousel_wh + ' bg-cover bg-center bg-url(' + gallery_image_url + ')') }></div>
                </CarouselItem>
              )
            })
          }
        </Carousel>
      )
      listing_title = `${listing.property.address.street_number} ${listing.property.address.street_name} ${listing.property.address.street_suffix}`
      modal_body = (
        <div>
          <Col xs={6} style={ S('p-0') }>
            { listing_images }
          </Col>
          <Col xs={6} style={ S('p-15') }>
            <div style={ S('mb-10 mr-20 pull-left') }><b>Address:</b> <span style={ S('color-929292') }>{ full_address }</span></div>
            <div style={ S('mb-10 mr-20 pull-left') }><b>Price:</b> <span style={ S('color-929292') }>${ price }</span></div>
            <div style={ S('mb-10 mr-20 pull-left') }><b>MLS#:</b> <span style={ S('color-929292') }>{ mls_number }</span></div>
            <div style={ S('mb-10 mr-20 pull-left') }><b>Property Type:</b> <span style={ S('color-929292') }>{ property_type }</span></div>
            <div style={ S('mb-10 mr-20 pull-left') }><b>Year Built:</b> <span style={ S('color-929292') }>{ year_built }</span></div>
            <div style={ S('mb-10 mr-20 pull-left') }><b>Beds:</b> <span style={ S('color-929292') }>{ bedroom_count }</span></div>
            <div style={ S('mb-10 mr-20 pull-left') }><b>Baths:</b> <span style={ S('color-929292') }>{ bathroom_count }</span></div>
            <div style={ S('mb-10 mr-20 pull-left') }><b>Sqft:</b> <span style={ S('color-929292') }>{ square_feet }</span></div>
            <div className="clearfix"></div>
            <div>{ description }</div>
          </Col>
        </div>
      )
    }

    return (
      <Modal dialogClassName="modal-800" show={ data.show_listing_modal } onHide={ this.props.hideModal.bind(this) }>
        <Modal.Header closeButton>
          <Modal.Title>{ listing_title }</Modal.Title>
        </Modal.Header>
        <Modal.Body style={ S('p-0') } className="flexbox">
          { modal_body }
          <div className="clearfix"></div>
        </Modal.Body>
      </Modal>
    )
  }
}

// PropTypes
ListingModal.propTypes = {
  data: React.PropTypes.object,
  listing: React.PropTypes.object,
  hideModal: React.PropTypes.func
}