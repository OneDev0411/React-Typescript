// Dashboard/Transactions/TransactionDetail.js
import React, { Component } from 'react'
import { Carousel, CarouselItem, Button } from 'react-bootstrap'
import S from 'shorti'
import listing_util from '../../../../../utils/listing'
import helpers from '../../../../../utils/helpers'

// Partials
import ProfileImage from '../../Partials/ProfileImage'

export default class TransactionDetail extends Component {

  render() {
    const data = this.props.data
    const transaction = data.current_transaction
    const listing = transaction.listing
    let property
    if (listing)
      property = listing.property
    let title = 'No address'
    let subtitle
    if (property) {
      title = `${property.address.street_number} ${property.address.street_name} ${property.address.street_suffix}`
      subtitle = `${property.address.street_number} ${property.address.street_name} ${property.address.street_suffix} ${property.address.city}, ${property.address.state} ${property.address.postal_code}`
    }
    let listing_status_indicator
    if (listing) {
      const status_color = listing_util.getStatusColor(listing.status)
      listing_status_indicator = (
        <div className="pull-left" style={ S('pointer bg-F7F9FA relative t-7 br-100 ml-15 pt-12 h-35 pl-36 pr-15 mr-15') }>
          <span style={ S('mr-5 font-46 l-10 t-16n absolute color-' + status_color) }>&#8226;</span>
          <span style={ S('font-14 relative t-3n') }>
            <b>{ listing.status }</b>
          </span>
        </div>
      )
    }
    const prev_icon = '<'
    const next_icon = '>'
    let listing_images = (
      <div style={ S('bg-eff1f2 w-480 h-300 font-22 text-center pt-125 color-929292') }>No image</div>
    )
    if (listing) {
      listing_images = (
        <Carousel interval={0} indicators={false} prevIcon={ prev_icon } nextIcon={ next_icon }>
          <CarouselItem>
            <div style={ S('w-480 h-300 bg-cover bg-center bg-url(' + listing.cover_image_url + ')') }></div>
          </CarouselItem>
          {
            listing.gallery_image_urls.map(gallery_image_url => {
              return (
                <CarouselItem key={ 'gallery-image-' + gallery_image_url }>
                  <img className="hidden" src={ gallery_image_url }/>
                  <div style={ S('w-480 h-300 bg-cover bg-center bg-url(' + gallery_image_url + ')') }></div>
                </CarouselItem>
              )
            })
          }
        </Carousel>
      )
    }
    let mls_number
    let transaction_type
    let property_type
    let year_built
    let bedroom_count
    let bathroom_count
    if (listing) {
      mls_number = listing.mls_number
      transaction_type = listing.transaction_type
    }
    if (property) {
      property_type = property.property_type
      year_built = property.year_built
      bedroom_count = property.bedroom_count
      bathroom_count = property.bathroom_count
    }

    let square_feet
    if (property)
      square_feet = helpers.numberWithCommas(Math.floor(listing_util.metersToFeet(property.square_meters)))

    const contacts = transaction.contacts

    return (
      <div style={ S('minw-800') }>
        <Button style={ S('absolute r-20') } className={ data.deleting_transaction && data.deleting_transaction === transaction.id ? 'disabled' : '' } onClick={ this.props.deleteTransaction.bind(this, transaction.id) } type="button" bsStyle="danger">
          { data.deleting_transaction && data.deleting_transaction === transaction.id ? 'Deleting...' : 'Delete' }
        </Button>
        <div className="transaction-detail__title" style={ S('h-80') }>
          <div className="pull-left">
            <h4 style={ S('font-28') }>{ title }</h4>
          </div>
          { listing_status_indicator }
          <div className="pull-left text-center" style={ S('pointer bg-F7F9FA relative t-7 br-100 p-8 w-35 h-35') }>
            <img src="/images/dashboard/icons/link.svg"/>
          </div>
          <div className="clearfix"></div>
          <div style={ S('color-929394 mb-20') }>{ subtitle }</div>
        </div>
        <div style={ S('minh-380') }>
          <div style={ S('w-480 mr-15 mb-30') } className="pull-left">
            { listing_images }
          </div>
          <div style={ S('w-500') } className="pull-left">
            <div style={ S('mb-20') }>
              <div style={ S('mb-15 mr-20 pull-left') }><b>MLS#:</b> <span style={ S('color-929292') }>{ mls_number }</span></div>
              <div style={ S('mb-15 mr-20 pull-left') }><b>Transaction Type:</b> <span style={ S('color-929292') }>{ transaction_type }</span></div>
              <div style={ S('mb-15 mr-20 pull-left') }><b>Property Type:</b> <span style={ S('color-929292') }>{ property_type }</span></div>
              <div style={ S('mb-15 mr-20 pull-left') }><b>Year Built:</b> <span style={ S('color-929292') }>{ year_built }</span></div>
              <div style={ S('mb-15 mr-20 pull-left') }><b>Beds:</b> <span style={ S('color-929292') }>{ bedroom_count }</span></div>
              <div style={ S('mb-15 mr-20 pull-left') }><b>Baths:</b> <span style={ S('color-929292') }>{ bathroom_count }</span></div>
              <div style={ S('mb-15 mr-20 pull-left') }><b>Sqft:</b> <span style={ S('color-929292') }>{ square_feet }</span></div>
              <div className="clearfix"></div>
            </div>
            <div style={ S('mb-70') }>
              <Button style={ S('bc-929292 color-929292 pl-20 pr-20 mr-15') }><b>View More</b></Button>
              <Button style={ S('bc-3388ff color-3388ff pl-40 pr-40') }><b>Edit</b></Button>
            </div>
            <div>
              {
                contacts.map(contact => {
                  const contact_style = S('mb-20 mr-15 w-200 h-80')
                  const info_style = {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }
                  return (
                    <div className="pull-left" style={ contact_style } key={ 'contact-' + contact.id }>
                      <ProfileImage user={ contact }/>
                      <div style={ S('ml-50') }>
                        <div><b>{ contact.first_name } { contact.last_name }</b></div>
                        <div style={ S('color-929292') }>
                          <div style={ info_style }>{ contact.roles[0] }</div>
                          <div style={ info_style }>{ contact.phone_number }</div>
                          <div style={ info_style }><a style={{ textDecoration: 'none' }} href={ 'mailto:' + contact.email}>{ contact.email }</a></div>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// PropTypes
TransactionDetail.propTypes = {
  data: React.PropTypes.object,
  deleteTransaction: React.PropTypes.func
}