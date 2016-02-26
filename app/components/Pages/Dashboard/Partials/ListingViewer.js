// ListingViewer.js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Carousel, CarouselItem } from 'react-bootstrap'
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
      // if (e.keyCode === 37)
      //   this.navCarousel('prev')
      // if (e.keyCode === 39)
      //   this.navCarousel('next')
    }
    this.fadeIn()
  }
  // TODO
  // navCarousel(direction) {
  //   const data = this.props.data
  //   const current_listing = data.current_listing
  //   let current_slide = current_listing.current_slide
  //   console.log(current_slide)
  //   const gallery_chunks = _.chunk(current_listing.gallery_image_urls, 3)
  //   const number_slides = gallery_chunks.length
  //   let next_slide
  //   if (!current_slide)
  //     current_slide = 0
  //   if (direction === 'prev') {
  //     next_slide = current_slide - 1
  //     if (current_slide === 0)
  //       next_slide = number_slides - 1
  //   }
  //   if (direction === 'next') {
  //     next_slide = current_slide + 1
  //     if (current_slide === number_slides - 1)
  //       next_slide = 0
  //   }
  //   this.props.navListingCarousel(next_slide)
  // }

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
    // let mls_number
    let bedroom_count
    let bathroom_count
    let square_feet
    let prev_icon
    let next_icon
    let description
    let price
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
      // mls_number = listing.mls_number
      bedroom_count = property.bedroom_count
      bathroom_count = property.bathroom_count
      square_feet = helpers.numberWithCommas(Math.floor(listing_util.metersToFeet(property.square_meters)))
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
                <CarouselItem key={ 'gallery-image-' + gallery_image_url[0] + i }>
                  <div style={ S('w-' + ((window.innerWidth - 70) / 3) + ' h-300 pull-left text-center bg-efefef bg-cover bg-center bg-url(' + gallery_image_url[0] + ')') }/>
                  <div style={ S('w-' + ((window.innerWidth - 70) / 3) + ' h-300 pull-left text-center bg-efefef bg-cover bg-center bg-url(' + gallery_image_url[1] + ')') }/>
                  <div style={ S('w-' + ((window.innerWidth - 70) / 3) + ' h-300 pull-left text-center bg-efefef bg-cover bg-center bg-url(' + gallery_image_url[2] + ')') }/>
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
      main_content = (
        <div>
          <div style={ S('p-0 relative') }>
            { listing_images }
            { listing_images_cached }
            <div className="clearfix"></div>
          </div>
          <div style={ S('p-15') }>
            <div style={ S('fw-700 font-70 mb-10n') }>${ price }</div>
            <div className="tempo" style={ S('font-32 fw-100 color-7d8288 mb-10') }>{ listing_title }</div>
            <div style={ S('font-18 color-b7bfc7 mb-30') }>{ listing_subtitle }</div>
            <div style={ S('font-24 color-4a4a4a') }>
              <span>{ bedroom_count } Beds</span>
              &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
              <span>{ bathroom_count } Baths</span>
              &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
              <span>{ square_feet } Sqft</span>
              &nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;
              <span>{ year_built ? 'Built in ' + year_built : '' }</span>
            </div>
            <hr />
            <div className="clearfix"></div>
            <div style={ S('color-000 font-18') }>{ description }</div>
          </div>
        </div>
      )
    }
    const viewer_wrap_style = S('absolute h-100p bg-fff t-0 l-0 z-1000 ml-70 w-' + (window.innerWidth - 70))
    const nav_bar_style = S('mb-0 p-0 h-65 pt-7 w-100p')
    return (
      <div style={ viewer_wrap_style }>
        <div onClick={ this.props.hideModal } style={ S('absolute r-20 t-8 font-40 fw-400') } className="close">&times;</div>
        <div style={ nav_bar_style }>
          <div style={ S('mt-13 font-18') } className="text-center">{ listing_title }</div>
        </div>
        { main_content }
      </div>
    )
  }
}

// PropTypes
ListingViewer.propTypes = {
  data: React.PropTypes.object,
  listing: React.PropTypes.object,
  hideModal: React.PropTypes.func,
  navListingCarousel: React.PropTypes.func
}