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
    const listing_data = transaction.listing_data
    let property
    if (listing)
      property = listing.property
    let title = 'No address'
    let subtitle
    if (property) {
      title = `${property.address.street_number} ${property.address.street_name} ${property.address.street_suffix}`
      subtitle = `${property.address.street_number} ${property.address.street_name} ${property.address.street_suffix} ${property.address.city}, ${property.address.state} ${property.address.postal_code}`
    }
    if (listing_data) {
      property = listing_data.property
      title = `${property.address.street_full}`
      subtitle = `${property.address.street_full} ${property.address.city}, ${property.address.state} ${property.address.postal_code}`
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
    let price_area
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
      if (transaction.contract_price) {
        price_area = (
          <span style={ S('color-929394 fw-400') }>${ helpers.numberWithCommas(transaction.contract_price) }</span>
        )
      }
    }

    let square_feet
    if (property)
      square_feet = helpers.numberWithCommas(Math.floor(listing_util.metersToFeet(property.square_meters)))

    let title_area
    title_area = (
      <div>
        <span style={ S('mr-10') }>{ title }</span> { price_area }
      </div>
    )

    let mls_link
    if (mls_number) {
      mls_link = (
        <span>| <a href="#">MLS#: { mls_number }</a></span>
      )
    }
    let subtitle_area
    if (subtitle) {
      subtitle_area = (
        <div className="pull-left">
          { subtitle } { mls_link }
        </div>
      )
    }
    const contacts = transaction.contacts
    const no_border = { border: 'none' }

    // Drawer
    const drawer = transaction.drawer
    let drawer_content
    const drawer_height = window.innerHeight - 153
    let drawer_wrap_style = {
      ...S('absolute h-' + drawer_height + ' r-0 w-0 t-80'),
      overflow: 'hidden'
    }
    const drawer_style = {
      ...S('absolute h-' + drawer_height + ' z-100 bg-fff w-500'),
      borderLeft: '1px solid #edf1f3'
    }
    let drawer_class
    if (drawer) {
      drawer_wrap_style = {
        ...drawer_wrap_style,
        ...S('w-500')
      }
      drawer_class = 'active'
      const drawer_header_style = S('bg-f7f9fa p-12 font-18 color-4a4a4a')
      if (drawer.content === 'docs') {
        drawer_content = (
          <div>
            <div style={ drawer_header_style }>Documents</div>
            <div className="text-center" style={ S('pt-100') }>
              <div style={ S('mb-10') }>
                <img src="/images/dashboard/transactions/drag-n-drop.png"/>
              </div>
              <div style={ S('color-929292') }>
                <span style={ S('font-16') }>DRAG & DROP</span><br />
                <span style={ S('font-14 color-bfc2c3') }>your files to upload, or <a href="#">browse</a></span>
              </div>
            </div>
          </div>
        )
      }
      if (drawer.content === 'contacts') {
        drawer_content = (
          <div>
            <div style={ drawer_header_style }>Contacts</div>
            <div>
              {
                contacts.map((contact) => {
                  const contact_style = {
                    ...S('pt-15 pb-15 pl-15'),
                    borderBottom: '1px solid #f7f9fa'
                  }
                  return (
                    <div key={ 'contact-' + contact.id } style={ contact_style }>
                      <ProfileImage user={ contact }/>
                      <div style={ S('ml-50 ') }>
                        <div><b>{ contact.first_name } { contact.last_name }</b>, <span style={ S('color-929292') }>{ contact.roles[0] }</span></div>
                        <div style={ S('color-929292') }>
                          <div>{ contact.phone_number }{ contact.phone_number ? ' ,' : '' } <a style={{ textDecoration: 'none' }} href={ 'mailto:' + contact.email}>{ contact.email }</a></div>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        )
      }
    }

    let contacts_markup
    if (contacts) {
      contacts_markup = contacts.map(contact => {
        const contact_style = S('mb-20 mr-15 w-200 h-80')
        const info_style = {
          overflow: 'hidden',
          textOverflow: 'ellipsis'
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
    const title_header_style = {
      ...S('h-80 mb-15 pl-15 pr-15'),
      borderBottom: '1px solid #edf1f3'
    }
    let drawer_open = ''
    if (drawer)
      drawer_open = ' drawer-open'
    return (
      <div style={ S('minw-800 z-0') }>
        <div style={ S('mt-40 absolute r-10 z-100') }>
          <Button style={ { ...no_border, ...S('br-100 w-35 h-35 p-2 mr-5') } } onClick={ this.props.setDrawerContent.bind(this, 'contacts') }>
            <img style={ S('w-20 h-20') } src={ `/images/dashboard/icons/drawer/contacts${drawer && drawer.content === 'contacts' ? '-active' : ''}.svg`} />
          </Button>
          <Button style={ { ...no_border, ...S('border-none br-100 w-35 h-35 p-2') } } onClick={ this.props.setDrawerContent.bind(this, 'docs') }>
            <img style={ S('w-15 h-15 mt-2n') } src={ `/images/dashboard/icons/drawer/docs${drawer && drawer.content === 'docs' ? '-active' : ''}.svg`} />
          </Button>
        </div>
        <div style={ drawer_wrap_style }>
          <div style={ drawer_style } className={ 'transaction-detail__drawer ' + drawer_class }>
            <div onClick={ this.props.closeDrawer } style={ S('mt-5 mr-15 fw-400 font-32') }className="close pull-right">&times;</div>
            { drawer_content }
          </div>
        </div>
        <div className="transaction-detail__title" style={ title_header_style }>
          <div className="pull-left">
            <h4 style={ S('font-28') }>{ title_area }</h4>
          </div>
          { listing_status_indicator }
          <div className="pull-left text-center" style={ S('pointer bg-F7F9FA relative t-7 br-100 p-8 w-35 h-35') }>
            <img src="/images/dashboard/icons/link.svg"/>
          </div>
          <div className="clearfix"></div>
          <div style={ S('color-929394 mb-20') }>{ subtitle_area }</div>
        </div>
        <div style={ S('relative') } className={ 'transaction-detail__main-content' + drawer_open }>
          <div style={ S('minh-380 pl-15 pr-15') }>
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
              <div style={ S('mb-100') }>
                <Button style={ S('bc-929292 color-929292 pl-20 pr-20 mr-15') }><b>View More</b></Button>
                <Button style={ S('bc-3388ff color-3388ff pl-40 pr-40 mr-15') }><b>Edit</b></Button>
                <Button style={ S('pl-40 pr-40') } className={ data.deleting_transaction && data.deleting_transaction === transaction.id ? 'disabled' : '' } onClick={ this.props.deleteTransaction.bind(this, transaction.id) } type="button" bsStyle="danger">
                  { data.deleting_transaction && data.deleting_transaction === transaction.id ? 'Deleting...' : 'Delete' }
                </Button>
              </div>
              <div>
                { contacts_markup }
              </div>
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
  deleteTransaction: React.PropTypes.func,
  setDrawerContent: React.PropTypes.func,
  closeDrawer: React.PropTypes.func
}